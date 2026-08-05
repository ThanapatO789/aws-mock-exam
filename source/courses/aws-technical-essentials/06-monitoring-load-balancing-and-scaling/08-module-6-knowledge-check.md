# Module 6 Knowledge Check

แบบทดสอบท้ายบทของ Module 6 เป็นคำถามแบบเลือกคำตอบ ต้องเลือกคำตอบแล้วกด SUBMIT เพื่อตรวจคำตอบ

> หมายเหตุการเก็บข้อมูล: เนื่องจากมีปัญหาการ navigate/redirect ของแพลตฟอร์ม Skill Builder ระหว่างการเก็บข้อมูล (คอร์สเดียวกันถูกหลาย agent เข้าถึงพร้อมกัน ทำให้หน้าเว็บสลับ module/redirect ไปมาซ้ำ ๆ) จึงสามารถยืนยันคำตอบที่ถูกต้องได้เพียงข้อแรกเท่านั้นจากการ submit จริงในเบราว์เซอร์ ข้อที่เหลือของแบบทดสอบไม่สามารถเก็บได้ครบในรอบนี้

## คำถามที่ 1 (ยืนยันคำตอบจากการ submit จริง)

**What are the three components of Amazon EC2 Auto Scaling?**
(อะไรคือสามองค์ประกอบหลักของ Amazon EC2 Auto Scaling)

ตัวเลือก:
- Launch template, scaling policies, Amazon EC2 Auto Scaling group **(คำตอบที่ถูกต้อง)**
- Scaling policies, security group, Amazon EC2 Auto Scaling group
- Security group, instance type, key pair
- Amazon Machine Image (AMI) ID, instance type, storage

คำอธิบาย: Amazon EC2 Auto Scaling ต้องการ 3 องค์ประกอบหลัก ได้แก่ launch template (หรือ launch configuration) ที่ใช้เป็น template การตั้งค่า EC2 instance, Amazon EC2 Auto Scaling group ที่ใช้กำหนด minimum/maximum/desired capacity และตำแหน่งที่ deploy, และ scaling policies ที่กำหนดเมื่อไรควรเพิ่ม/ลด instance

## Key terms
- (อ้างอิงเนื้อหาจากบทเรียนก่อนหน้าในโมดูลนี้ โดยเฉพาะ "Amazon EC2 Auto Scaling" — ดู `05-amazon-ec2-auto-scaling.md`)
