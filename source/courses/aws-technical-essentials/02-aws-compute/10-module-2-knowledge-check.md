# Module 2 Knowledge Check

แบบทดสอบท้ายบท Module 2 (ตอบและส่งจริงในเบราว์เซอร์ ยืนยันคำตอบที่ถูกต้องแล้ว)

## คำถามที่ 1
**What does an Amazon EC2 instance type indicate?**
(Amazon EC2 instance type บ่งบอกถึงอะไร?)

ตัวเลือก:
- Instance placement and instance size
- **Instance family and instance size** ✅ (คำตอบที่ถูกต้อง)
- Instance tenancy and instance billing
- Instance AMI and networking speed

คำอธิบาย: Amazon EC2 มี instance type ให้เลือกหลากหลายที่ถูก optimize สำหรับ use case ต่างกัน โดย instance type ประกอบด้วยการรวมกันของ CPU, memory, storage และ networking capacity ในสัดส่วนต่างๆ ทำให้เลือกทรัพยากรที่เหมาะสมกับแอปพลิเคชันได้อย่างยืดหยุ่น แต่ละ instance type จะมี instance size ให้เลือกอย่างน้อยหนึ่งขนาดขึ้นไป เพื่อให้สามารถปรับขนาดทรัพยากรตามความต้องการของ workload ได้

## คำถามที่ 2
**Which of the following is true about serverless?**
(ข้อใดต่อไปนี้เป็นจริงเกี่ยวกับ serverless?)

ตัวเลือก:
- You must provision and manage servers.
- You must manually scale serverless resources.
- You must manage availability and fault tolerance.
- **You never pay for idle resources.** ✅ (คำตอบที่ถูกต้อง)

คำอธิบาย: ด้วย AWS serverless ผู้ใช้ไม่ต้องจ่ายค่าใช้จ่ายสำหรับทรัพยากรที่ไม่ได้ใช้งาน (idle) แต่จะจ่ายเฉพาะสิ่งที่ใช้จริงเท่านั้น โดยแต่ละบริการ serverless จะคิดค่าบริการแตกต่างกันไปตามลักษณะการใช้งาน
