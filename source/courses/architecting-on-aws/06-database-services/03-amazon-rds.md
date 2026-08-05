# Amazon RDS

ทบทวนจากบทก่อนหน้า: บริการฐานข้อมูลมีสองประเภทหลัก คือ relational และ non-relational databases บทเรียนนี้ครอบคลุมวิธี configure **multi-AZ deployments** และ **read replicas** โดยใช้ **Amazon RDS**

เนื้อหาหลักนำเสนอผ่านวิดีโอผู้สอน (ความยาว 7 นาที 17 วินาที) หัวข้อ "Amazon RDS" ตั้งคำถามนำว่า "How can we more efficiently manage our relational databases in the AWS Cloud?"

> หมายเหตุการเก็บเนื้อหา: เช่นเดียวกับบทก่อนหน้า ไม่สามารถเลื่อนดูเนื้อหาข้อความส่วนที่อยู่ใต้วิดีโอได้ เนื่องจากบั๊กของหน้าเว็บที่ทำให้การ scroll พาออกนอกบทเรียน จึงเก็บได้เฉพาะย่อหน้าเปิดเรื่อง

## Key terms
- Amazon RDS: managed relational database service บน AWS
- Multi-AZ deployment: การตั้งค่า RDS ให้มี standby replica อยู่คนละ Availability Zone เพื่อความพร้อมใช้งานสูง (high availability)
- Read replica: สำเนาฐานข้อมูลแบบอ่านอย่างเดียว ใช้ช่วยกระจายโหลดการอ่านข้อมูล (read scaling)
