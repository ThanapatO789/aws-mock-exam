# Knowledge Check

แบบทดสอบท้ายโมดูล ใช้ทบทวนความเข้าใจเนื้อหาทั้งหมดของโมดูล 3 (Networking-1) ผลลัพธ์ที่ได้จะช่วยชี้ให้เห็นหัวข้อที่ควรกลับไปทบทวนเพิ่มเติม ประกอบด้วยคำถาม 5 ข้อ ดังนี้ (คำตอบที่ถูกต้องยืนยันจากระบบหลังตอบจริง)

## คำถามที่ 1

**คำถาม:** VPC หนึ่งตัวสามารถครอบคลุมหลาย Region ได้ (True or False)
(True or False: A single Amazon virtual private cloud (VPC) can span multiple Regions.)

- True
- **False** ✅ (คำตอบที่ถูกต้อง)

## คำถามที่ 2

**คำถาม:** ต้องทำอะไรจึงจะทำให้ subnet เป็น public
(What action must you take to make a subnet public?)

- Route outbound traffic from the subnet.
- Route inbound traffic from the internet gateway.
- **Route outbound traffic to the internet gateway.** ✅ (คำตอบที่ถูกต้อง)
- Subnets are public by default.

## คำถามที่ 3

**คำถาม:** NAT gateway ทำหน้าที่อะไร
(What function does the NAT gateway serve?)

- Load balances incoming traffic to multiple instances
- **Allows internet traffic initiated by private subnet instances** ✅ (คำตอบที่ถูกต้อง)
- Allows instances to communicate between subnets
- Increases security for instances in a public subnet

## คำถามที่ 4

**คำถาม:** ควรใช้อะไรเพื่อสร้างกฎกรอง traffic (traffic filtering rules) สำหรับ subnet
(What should you use to create traffic filtering rules for a subnet?)

- NAT gateway
- Route table
- Security group
- **Network ACL** ✅ (คำตอบที่ถูกต้อง)

## คำถามที่ 5

**คำถาม:** พอร์ตใดที่เปิดอยู่โดยค่าเริ่มต้นเมื่อสร้าง security group ใหม่ (เลือก 2 ข้อ)
(Which ports are open by default when you create a new security group? Select TWO.)

- **Nothing allowed inbound** ✅ (คำตอบที่ถูกต้อง)
- Nothing allowed outbound
- Anything allowed inbound
- **Anything allowed outbound** ✅ (คำตอบที่ถูกต้อง)
- Inbound traffic is allowed on public subnets

หลังจากทำแบบทดสอบเสร็จ จะมีวิดีโอสรุปท้ายโมดูล (ความยาวประมาณ 5 นาที 26 วินาที) ปิดท้ายเนื้อหาเรื่อง networking และ VPC fundamentals, security groups และ access control lists ก่อนเข้าสู่โมดูลถัดไปเรื่อง compute services

## Key terms
- Knowledge Check: แบบทดสอบสั้น ๆ ท้ายโมดูลเพื่อประเมินความเข้าใจ
- Default security group behavior: ปฏิเสธ inbound ทั้งหมดโดย default แต่อนุญาต outbound ทั้งหมด
