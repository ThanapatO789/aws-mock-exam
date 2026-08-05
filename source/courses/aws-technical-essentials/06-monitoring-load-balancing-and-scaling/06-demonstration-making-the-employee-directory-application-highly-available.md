# Demonstration: Making the Employee Directory Application Highly Available

บทเรียนนี้เป็นวิดีโอสาธิต (demonstration) ที่ตั้งใจให้ดูเป็น visual walk-through ไม่ใช่ hands-on exercise ให้ทำตาม เนื้อหาสาธิตขั้นตอนการตั้งค่า load balancing และ auto scaling ให้กับ Employee Directory Application ใน AWS Management Console โดยสรุปขั้นตอนหลักได้ดังนี้

## 1. เตรียม EC2 instance ตัวที่สอง
Launch instance ตัวใหม่โดยใช้ key pair เดิม เปิดใช้ public IP เพื่อทดสอบ ตรวจสอบ instance role และ user data (สำหรับติดตั้ง/ตั้งค่าแอปพลิเคชัน) ให้ตรงกับที่ตั้งไว้ก่อนหน้า แล้ว launch instance และรอจนผ่าน health check ก่อน verify ว่าแอปพลิเคชันทำงานผ่าน IPv4 address

## 2. สร้าง Application Load Balancer (ALB)
ไปที่ EC2 console → Load Balancers → Create load balancer → เลือก **Application Load Balancer**
- ตั้งชื่อ `app-elb` เป็นแบบ internet-facing
- เลือก VPC (`app-vpc`) และ Availability Zone ทั้งสอง (us-west-2a, us-west-2b) พร้อม subnet ที่เกี่ยวข้อง
- สร้าง security group ใหม่สำหรับ load balancer
- กำหนด **Listeners and routing**: สร้าง target group ใหม่ชื่อ `app-target-group` (target type = Instances) ผูกกับ VPC ที่ถูกต้อง และตั้งค่า health check
- Register target: เลือก instance ที่ launch ไว้เป็น target (สถานะ pending จนกว่า health check จะผ่าน)
- สร้าง target group แล้วกลับมาเลือก `app-target-group` ในหน้าสร้าง load balancer แล้วคลิก Create load balancer

## 3. สร้าง Launch Template
ไปที่ EC2 console → Instances → Launch Templates → Create launch template
- ตั้งชื่อ `app-launch-template` พร้อมคำอธิบาย
- เปิดใช้ตัวเลือก "auto scaling guidance" เนื่องจากจะใช้กับ EC2 Auto Scaling
- กำหนดค่าที่จำเป็นสำหรับ launch instance (คล้ายการ launch แบบ manual)
- ใน Advanced details: ตรวจสอบ instance profile (role) ให้ถูกต้อง และเพิ่ม user data (แก้ bucket name และ region ให้ตรงกับ resource ที่สร้างไว้ เช่น `us-west-2`)
- คลิก Create launch template

## 4. สร้าง Auto Scaling Group
ไปที่หน้า Auto Scaling groups → Create
- ผูก Auto Scaling group เข้ากับ load balancer ที่สร้างไว้ (attach to existing load balancer) โดยเลือก `app-target-group` และให้ load balancer เป็นผู้จัดการ health check
- ตั้งค่า capacity: **Desired capacity = 2, Minimum capacity = 2, Maximum capacity = 4** — หมายความว่ากลุ่มจะเริ่มด้วย 2 instance และจะไม่ลดต่ำกว่า 2 instance เสมอ (ถ้า instance ใดไม่ healthy จะถูกแทนที่ทันที)
- ตั้งค่า **scaling policy** แบบ target tracking โดยอิงจาก average CPU utilization ของทั้ง fleet — ถ้า CPU ถึงหรือเกิน **60%** จะ launch instance ใหม่ โดยให้เวลา **300 วินาที (5 นาที)** สำหรับ instance ใหม่ warm up และผ่าน health check ก่อนจะทำ scaling action ครั้งถัดไป
- (แสดงตัวอย่างการตั้ง notification ผ่าน SNS topic + email เมื่อมี scaling action เกิดขึ้น แต่ไม่ได้ตั้งค่าจริงในสาธิตนี้)
- คลิก Create Auto Scaling group

## 5. ทดสอบระบบ
- ตรวจสอบ target group ว่า instance ทั้งหมดอยู่ในสถานะ healthy ก่อนทดสอบ
- Refresh หน้าเว็บแอปพลิเคชันหลายครั้งเพื่อดูว่า load balancer กระจาย request ไปยัง instance และ Availability Zone ต่างกัน
- ใช้ปุ่ม **stress CPU** ที่มีอยู่ในตัวแอปพลิเคชันตัวอย่าง เพื่อจำลอง CPU load เป็นเวลา 10 นาที ให้ CPU utilization ทะลุ threshold 60% แล้วสังเกตว่า Auto Scaling group launch instance ใหม่เพิ่มเข้ามาในกลุ่มโดยอัตโนมัติ (ตรวจสอบผ่านหน้า Target Groups → Targets)

## Key terms
- Application Load Balancer (ALB): load balancer แบบ internet-facing สำหรับกระจาย web traffic
- Target group: กลุ่มของ EC2 instance ที่ load balancer ส่ง traffic ไปหา พร้อม health check
- Launch template: กำหนดค่าที่ใช้ launch EC2 instance โดย Auto Scaling
- Auto Scaling group: กำหนด min/desired/max capacity และ policy การ scale
- Target tracking scaling policy: scaling policy ที่อิง metric เป้าหมาย (เช่น average CPU utilization) และให้ระบบสร้าง CloudWatch alarm ที่จำเป็นให้อัตโนมัติ
