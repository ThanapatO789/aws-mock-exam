# Hosting the Employee Directory Application on AWS

บทเรียนนี้เป็นวิดีโอ (พร้อมบทถอดเสียง) ที่ปูพื้นสำหรับการเริ่มสร้างแอปพลิเคชัน employee directory บน AWS ในบทเรียนถัดๆ ไป

## สรุปเนื้อหา
ผู้สอนทบทวนคำศัพท์ AWS, แนวคิดของ cloud computing, และรายละเอียดของ cloud identity and access management ที่เรียนมา แล้วแนะนำ architecture diagram ของแอปพลิเคชันที่จะสร้างตลอดคอร์สนี้ ซึ่งประกอบด้วยหลาย AWS service ทำงานร่วมกัน — จะได้เห็นว่าแต่ละส่วนถูกสร้างขึ้นอย่างไรตลอดบทเรียนถัดๆ ไป

จากนั้นสาธิตวิธี host แอปพลิเคชัน employee directory โดยใช้ **Amazon EC2** ด้วยการตั้งค่าเริ่มต้น (defaults) ของ AWS

### แนวคิดสำคัญที่กล่าวถึง
- AWS มี **default VPC** ให้ ซึ่งเป็นเครือข่ายส่วนตัวสำหรับทรัพยากร AWS — ทุก EC2 instance ที่ launch ต้องอยู่ในเครือข่ายเสมอ ในสาธิตนี้ใช้ default VPC ที่ AWS เตรียมไว้เพื่อให้การทดลองใช้งานง่ายขึ้นสำหรับผู้เริ่มต้น (รายละเอียดเรื่อง networking จะอธิบายเพิ่มเติมในบทเรียนถัดไป)

### ขั้นตอนการ launch EC2 instance ในสาธิต
1. เข้าสู่ EC2 management console แล้ว launch instance ใหม่ — **Amazon EC2** คือ compute service ที่ช่วยให้ host virtual machine ได้
2. ตั้งชื่อ instance เช่น `employee-web-app` แล้วเลือก free tier eligible options: Linux AMI (Amazon Machine Image) และ instance type แบบ `t2.micro`
3. ข้าม key pair (ปกติใช้สำหรับ SSH เข้า instance) โดยเลือก "proceed without a key pair"
4. ตั้งค่า **network settings**: เลือก default VPC และปล่อย subnet เป็น "No preference" แล้วสร้าง **security group** ใหม่ (เปรียบเสมือน firewall ระดับ instance) ที่อนุญาต inbound traffic สำหรับ HTTP และ HTTPS
5. ใน **Advanced details** เลือก **IAM instance profile** เป็น IAM role ที่จะใช้กับแอปพลิเคชัน (role นี้จะยังไม่มีผลจนกว่าจะสร้าง S3 bucket ในบทเรียนถัดไป)
6. ใส่ **user data** — เป็นสคริปต์ที่รันอัตโนมัติเมื่อ instance boot ขึ้น สคริปต์นี้จะดาวน์โหลด source code ของแอป, เริ่ม web server, และรันแอปพลิเคชันให้พร้อมรับ request แทนการ launch instance แล้วต่อผ่าน SSH เพื่อ config และ start แอปด้วยมือ
7. คลิก **Launch instance** และรอสักครู่ให้ instance boot ขึ้น
8. คัดลอก IP address ของ instance วางในแท็บเบราว์เซอร์ใหม่ — จะเห็นหน้า homepage ของแอปพลิเคชัน (ยังไม่มีข้อมูลแสดงเพราะยังไม่ได้เชื่อมกับฐานข้อมูล)

ในบทเรียนถัดๆ ไปจะอธิบายรายละเอียดของ EC2 และ networking บน AWS เพิ่มเติม เพื่อให้เข้าใจว่าขั้นตอนที่ผ่านมาทำงานอย่างไร

## Key terms
- Default VPC: เครือข่ายส่วนตัวเริ่มต้นที่ AWS เตรียมไว้ให้ ใช้ launch EC2 instance ได้ทันทีโดยไม่ต้องตั้งค่าเครือข่ายเอง
- Security group: firewall ระดับ instance ที่กำหนดกฎ inbound/outbound traffic
- User data: สคริปต์ที่รันอัตโนมัติตอน EC2 instance boot ขึ้น ใช้ตั้งค่า/ติดตั้งแอปพลิเคชันโดยอัตโนมัติ
- IAM instance profile: กลไกที่ผูก IAM role เข้ากับ EC2 instance เพื่อให้แอปพลิเคชันบน instance นั้นใช้ credentials ชั่วคราวของ role ได้
