# Employee Directory Application Redesign

บทสรุปคอร์ส: ทบทวนสถาปัตยกรรมที่สร้างมาตลอดคอร์ส และนำเสนอแนวทาง redesign ด้วยบริการอื่นที่ยังไม่ได้กล่าวถึง เพื่อให้เห็นทางเลือกสถาปัตยกรรมแบบอื่น

## สถาปัตยกรรมปัจจุบัน

Employee Directory Application ปัจจุบันถูก host บนหลาย EC2 instance ภายใน VPC ใน private subnet โดย EC2 instance เหล่านี้เป็นส่วนหนึ่งของ EC2 Auto Scaling group และกระจาย traffic ด้วย Application Load Balancer ฐานข้อมูลใช้ Amazon DynamoDB และเก็บรูปภาพใน S3

ด้าน maintenance ต้องดูแล auto scaling policy ให้ตรงกับความคาดหวัง (อาจต้องปรับจูนไปเรื่อย ๆ) ต้องติดตั้ง security patch/update ให้ EC2 และติดตาม instance type/size ใหม่ ๆ ที่เหมาะสมกว่า

## แนวคิด Three-tier application

แอปพลิเคชันนี้เป็นตัวอย่างของ **three-tier application**:
- **Presentation layer** — user interface
- **Application layer** — business logic
- **Data layer** — database

ปัจจุบัน EC2 instance host ทั้ง presentation layer (web server ที่เสิร์ฟ HTML, CSS, JavaScript) และ application layer (backend logic สำหรับ view/add/update/delete employee) พร้อมกัน — เป้าหมายของการ redesign คือแยกสองส่วนนี้ออกจากกันโดยสมบูรณ์ เพื่อไม่ให้ instance เดียวรับภาระ request หลายประเภทพร้อมกัน โดยยังคง data layer เดิม (DynamoDB) ไว้โดยไม่ต้องแก้ไข ซึ่งแสดงถึงความยืดหยุ่นที่ช่วยให้ innovate และปรับตัวได้เร็ว

## Presentation layer ใหม่: Amazon S3 static website

ย้าย presentation layer ไป host บน Amazon S3 เนื่องจาก S3 รองรับ static website hosting เหมาะสำหรับเก็บ HTML, CSS, JavaScript แม้เว็บไซต์จะดึงข้อมูลจาก database (ดูเหมือนไม่ static) แต่แก้ได้ด้วย JavaScript ที่ทำ HTTP request และโหลด dynamic content มาแสดงผลบนหน้า static ได้

## Application layer ใหม่: AWS Lambda + Amazon API Gateway

เปลี่ยนจากการรันบน EC2 มาเป็น **AWS Lambda** — โค้ดของแอปพลิเคชันจะรันเฉพาะเมื่อถูก trigger จาก event ที่มาจาก presentation layer เนื่องจากไม่ควรให้ frontend คุยกับ backend code โดยตรง จึงเปิด backend ผ่าน API โดยใช้ **Amazon API Gateway** เป็นตัวกลาง — แต่ละ action ที่ทำกับ employee (view/add/update/delete) จะมี method ของตัวเองบน API ซึ่ง API Gateway ทำหน้าที่เป็น "หน้าประตู" (front door) เพื่อ trigger backend code ที่รันบน Lambda

## เติมส่วนประกอบเพิ่มเติมให้สถาปัตยกรรมสมบูรณ์

- **Amazon Route 53** — จัดการ domain name
- **Amazon CloudFront** — cache static asset (HTML, CSS, JavaScript) ให้ใกล้ end user มากขึ้นผ่าน AWS Edge locations

**Flow การทำงาน** เมื่อผู้ใช้เข้าเว็บไซต์เพื่อดูรายชื่อพนักงาน:
1. ผู้ใช้พิมพ์ domain ของเว็บไซต์ → ส่งไปยัง Amazon Route 53
2. Route 53 ตอบกลับ client ด้วย address ของ static website ที่ host บน S3 → เว็บไซต์ถูก render ในเบราว์เซอร์
3. JavaScript บนหน้าเว็บเรียก API เพื่อโหลด dynamic content (เช่นดึงรายชื่อพนักงานทั้งหมด) → เรียกไปที่ **API Gateway**
4. API Gateway validate request แล้ว trigger **AWS Lambda** เพื่อประมวลผล logic และดึงข้อมูลจาก **DynamoDB**
5. ข้อมูลถูกส่งกลับไปยัง API Gateway → กลับไปยัง JavaScript → render บนหน้าเว็บ

## ข้อดีของสถาปัตยกรรมแบบ Serverless

สถาปัตยกรรมใหม่นี้ optimize ทั้งด้าน scalability, operational overhead และในหลายกรณีก็ optimize ด้าน cost ด้วย เนื่องจากเป็น serverless การดูแล operation จึงน้อยกว่าเมื่อเทียบกับ workload ที่ใช้ EC2 มาก — ไม่ต้อง patch หรือจัดการ AMI เมื่อใช้ AWS Lambda และไม่จำเป็นต้องสร้าง VPC, subnet, security group, หรือ network ACL เอง (ด้าน networking ถูกจัดการให้อัตโนมัติ) แม้จะยังสามารถ integrate serverless service เข้ากับ VPC ได้หากจำเป็นด้วยเหตุผลด้าน compliance ก็ตาม

มีตัวเลือกสถาปัตยกรรมได้อีกหลากหลาย เช่น การออกแบบใหม่โดยใช้ AWS container services ก็จะได้ diagram ที่ต่างออกไปอีกแบบ — AWS มีหลายวิธีในการสร้างระบบ และสามารถสลับเปลี่ยนส่วนประกอบตามบริการใหม่ ๆ ที่ AWS ปล่อยออกมาได้ และเนื่องจากทุกอย่างใน AWS เป็น API call จึงสามารถ automate กระบวนการเหล่านี้ได้ด้วย

## Key terms
- Three-tier application: สถาปัตยกรรมที่แบ่งเป็น presentation layer, application layer, data layer
- Amazon S3 static website hosting: การ host เว็บไซต์แบบ static (HTML/CSS/JS) บน S3
- AWS Lambda: บริการรันโค้ดแบบ serverless ตาม event trigger
- Amazon API Gateway: บริการสร้างและจัดการ API เป็นหน้าประตูเชื่อม frontend กับ backend
- Amazon Route 53: บริการจัดการ domain name (DNS)
- Amazon CloudFront: บริการ CDN ที่ cache เนื้อหาใกล้ end user ผ่าน Edge location
