# Load Balancing

คุณต้องการให้แอปพลิเคชันทำงานได้อย่างมีประสิทธิภาพทั้งในช่วง peak traffic และช่วง low-traffic บทเรียนนี้จะเรียนรู้เกี่ยวกับ load balancing ซึ่งช่วยเพิ่ม high availability ให้กับ EC2 workloads และกระจาย traffic ไปยัง targets หลายตัว

## Elastic Load Balancing (ELB)

**Elastic Load Balancing (ELB)** เป็นหนึ่งในหมวดหมู่บริการ AWS ที่ถูกใช้งานอย่างแพร่หลายที่สุด ELB load balancers เป็น load balancer เดียวบน AWS ที่เชื่อมต่อผู้ใช้กับ EC2 instances, container deployments และ AWS Lambda functions ได้โดยตรง (natively)

คุณสมบัติหลักของ load balancer มี 5 หมวดหมู่:

**High availability**
ELB กระจาย traffic ของคุณโดยอัตโนมัติไปยัง targets หลายตัวใน Availability Zone เดียวหรือหลาย Availability Zones ตัวอย่างของ targets ได้แก่ EC2 instances, containers และ IP addresses

**Layer 4 หรือ Layer 7 HTTP and HTTPS load balancing**
คุณสามารถ load balance แอปพลิเคชัน HTTP หรือ HTTPS สำหรับคุณสมบัติเฉพาะของ Layer 7 หรือใช้ strict Layer 4 load balancing สำหรับแอปพลิเคชันที่พึ่งพา TCP ล้วนๆ

**Security features**
ใช้ Amazon VPC เพื่อสร้างและจัดการ security groups ที่เชื่อมโยงกับ load balancers เพื่อเพิ่มตัวเลือกด้าน networking และ security นอกจากนี้ยังสามารถสร้าง internal load balancer (ที่ไม่เปิดสู่อินเทอร์เน็ต) ได้ด้วย

**Health checks**
ELB load balancers สามารถตรวจจับ targets ที่ไม่ healthy หยุดส่ง traffic ไปยัง targets เหล่านั้น และกระจายโหลดไปยัง targets ที่ยัง healthy อยู่แทน

**Monitoring operations**
เพื่อ monitor ประสิทธิภาพของแอปพลิเคชันแบบ real-time ELB เชื่อมต่อกับ CloudWatch metrics และมี request tracing ให้ด้วย

## Load balancer types

เลือกแท็บที่เหมาะสมเพื่อเรียนรู้เพิ่มเติมเกี่ยวกับ load balancer แต่ละประเภท:

**APPLICATION LOAD BALANCER**
load balancer ประเภทนี้ทำงานที่ application layer ซึ่งเป็น layer ที่ 7 ของ OSI model รองรับ content-based routing, แอปพลิเคชันที่รันใน containers และ open standard protocols (WebSocket และ HTTP/2) เหมาะสำหรับการทำ load balancing ขั้นสูงของ HTTP และ HTTPS traffic

**NETWORK LOAD BALANCER**
load balancer ประเภทนี้ออกแบบมาเพื่อรองรับ requests หลายสิบล้านครั้งต่อวินาที พร้อมรักษา throughput สูงและ latency ต่ำมาก ทำงานที่ connection level (Layer 4) โดย route connections ไปยัง targets ตามข้อมูล IP protocol targets รวมถึง EC2 instances, containers และ IP addresses เหมาะสำหรับ load balancing TCP และ User Datagram Protocol (UDP) traffic

**GATEWAY LOAD BALANCER**
ใช้ load balancer ประเภทนี้เพื่อ deploy, scale และจัดการ third-party virtual appliances โดยให้ gateway เดียวสำหรับกระจาย traffic ไปยัง virtual appliances หลายตัว และ scale ขึ้นหรือลงตามความต้องการ การกระจายนี้ช่วยลดจุดที่อาจล้มเหลว (points of failure) ในเครือข่าย และเพิ่ม availability Gateway Load Balancer ส่งผ่าน Layer 3 traffic ทั้งหมดอย่างโปร่งใส (transparently) ผ่าน third-party virtual appliances โดยที่ต้นทางและปลายทางมองไม่เห็น (invisible)

มีตารางเปรียบเทียบคุณสมบัติของ load balancer แต่ละประเภท (แสดงเป็นภาพประกอบในบทเรียน — รูปภาพไม่โหลดขณะบันทึกเนื้อหา จึงไม่สามารถถอดรายละเอียดตารางได้ แต่เนื้อหาคุณสมบัติหลักได้สรุปไว้ในแต่ละประเภทด้านบนแล้ว)

ในบทเรียนนี้ ได้ตรวจสอบวิธีแยกแยะระหว่างประเภทของ load balancer ที่มีอยู่ และแต่ละประเภทช่วยปรับปรุงประสิทธิภาพของแอปพลิเคชันได้อย่างไร บทเรียนถัดไปจะสำรวจเรื่อง auto scaling ในแอปพลิเคชัน

## Key terms
- Elastic Load Balancing (ELB): บริการกระจาย traffic ไปยัง EC2 instances, containers, และ Lambda functions
- Application Load Balancer (ALB): load balancer ที่ Layer 7 รองรับ content-based routing
- Network Load Balancer (NLB): load balancer ที่ Layer 4 รองรับ throughput สูง latency ต่ำ สำหรับ TCP/UDP
- Gateway Load Balancer (GWLB): load balancer สำหรับ deploy/scale third-party virtual appliances ที่ Layer 3
- Health check: การตรวจสอบสถานะ targets เพื่อหยุดส่ง traffic ไปยัง targets ที่ไม่ healthy
