# Module 6 Knowledge Check

แบบทดสอบท้ายบทของ Module 6 เป็นคำถามแบบเลือกคำตอบ ต้องเลือกคำตอบแล้วกด SUBMIT เพื่อตรวจคำตอบ ประกอบด้วยทั้งหมด 3 ข้อ ยืนยันคำตอบที่ถูกต้องครบทุกข้อแล้วจากการ submit จริงในเบราว์เซอร์

## คำถามที่ 1 (ยืนยันคำตอบจากการ submit จริง)

**What are the three components of Amazon EC2 Auto Scaling?**
(อะไรคือสามองค์ประกอบหลักของ Amazon EC2 Auto Scaling)

ตัวเลือก:
- Launch template, scaling policies, Amazon EC2 Auto Scaling group **(คำตอบที่ถูกต้อง)**
- Scaling policies, security group, Amazon EC2 Auto Scaling group
- Security group, instance type, key pair
- Amazon Machine Image (AMI) ID, instance type, storage

คำอธิบาย: Amazon EC2 Auto Scaling ต้องการ 3 องค์ประกอบหลัก ได้แก่ launch template (หรือ launch configuration) ที่ใช้เป็น template การตั้งค่า EC2 instance, Amazon EC2 Auto Scaling group ที่ใช้กำหนด minimum/maximum/desired capacity และตำแหน่งที่ deploy, และ scaling policies ที่กำหนดเมื่อไรควรเพิ่ม/ลด instance

## คำถามที่ 2 (ยืนยันคำตอบจากการ submit จริง)

**Which features are included with Elastic Load Balancing (ELB)? (Select TWO.)**
(ฟีเจอร์ใดบ้างที่รวมอยู่ใน Elastic Load Balancing (ELB) — เลือก 2 ข้อ)

ตัวเลือก:
- Integrating with Amazon EC2 Auto Scaling **(คำตอบที่ถูกต้อง)**
- Using artificial intelligence (AI) to categorize employee photos
- Using vertical scaling for Amazon EC2 instances
- Directing incoming traffic to instances **(คำตอบที่ถูกต้อง)**
- Deploying new instances as required

คำอธิบาย: ELB สามารถทำงานร่วมกับ Amazon EC2 Auto Scaling ได้อย่างไร้รอยต่อ (integrate seamlessly) — เมื่อมี EC2 instance ใหม่ถูกเพิ่มเข้า Auto Scaling group, ELB จะได้รับการแจ้งเตือนและเริ่ม direct traffic ไปยัง instance ใหม่นั้นได้ทันที นอกจากนี้หน้าที่หลักของ ELB คือการ direct/route incoming traffic ไปยัง instance ต่าง ๆ ที่อยู่เบื้องหลัง

## คำถามที่ 3 (ยืนยันคำตอบจากการ submit จริง)

**What are the possible states of an Amazon CloudWatch alarm?**
(สถานะที่เป็นไปได้ของ Amazon CloudWatch alarm มีอะไรบ้าง)

ตัวเลือก:
- OK, ALARM, NOT_AVAILABLE
- OK, ALARM, INSUFFICIENT_DATA **(คำตอบที่ถูกต้อง)**
- OK, ALERT, INSUFFICIENT_DATA
- OK, ALERT, NOT_AVAILABLE

คำอธิบาย: Metric alarm มีสถานะที่เป็นไปได้ 3 แบบ ได้แก่ **OK** (ค่า metric หรือ expression อยู่ในเกณฑ์ threshold ที่กำหนด), **ALARM** (ค่า metric หรือ expression อยู่นอกเกณฑ์ threshold ที่กำหนด), และ **INSUFFICIENT_DATA** (alarm เพิ่งเริ่มทำงาน, metric ไม่พร้อมใช้งาน, หรือข้อมูลไม่เพียงพอสำหรับใช้ประเมินสถานะ alarm)

## Key terms
- (อ้างอิงเนื้อหาจากบทเรียนก่อนหน้าในโมดูลนี้ โดยเฉพาะ "Amazon EC2 Auto Scaling", "Traffic Routing with Elastic Load Balancing", และ "Amazon CloudWatch" — ดู `05-amazon-ec2-auto-scaling.md`, `04-traffic-routing-with-elastic-load-balancing.md`, `02-amazon-cloudwatch.md`)
