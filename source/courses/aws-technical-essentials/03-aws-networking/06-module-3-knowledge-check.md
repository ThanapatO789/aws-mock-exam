# Module 3 Knowledge Check

แบบทดสอบท้าย Module 3 มีทั้งหมด 3 ข้อ (ตอบและ submit จริงในระบบ ยืนยันคำตอบที่ถูกต้องแล้ว)

## Question 1

**คำถาม (EN):** Which of the following can a route table be attached to?

**ตัวเลือก:**
- AWS accounts
- Availability Zones
- Subnets
- Regions

**คำตอบที่ถูกต้อง:** Subnets

## Question 2

**คำถาม (EN):** Which of the following is true for a security group's default setting?

**ตัวเลือก:**
- It allows all inbound traffic and blocks all outbound traffic.
- It blocks all inbound traffic and allows all outbound traffic.
- It allows all inbound and outbound traffic.
- It blocks all inbound and outbound traffic.

**คำตอบที่ถูกต้อง:** It blocks all inbound traffic and allows all outbound traffic. (ค่าเริ่มต้นของ security group คือบล็อก inbound ทั้งหมด และอนุญาต outbound ทั้งหมด)

## Question 3

**คำถาม (EN):** A network access control list (network ACL) filters traffic at the Amazon EC2 instance level.

**ตัวเลือก:**
- True
- False

**คำตอบที่ถูกต้อง:** False (network ACL ทำหน้าที่ป้องกัน/กรอง traffic ที่ระดับ subnet ไม่ใช่ระดับ EC2 instance — การกรอง traffic ที่ระดับ EC2 instance เป็นหน้าที่ของ security group)
