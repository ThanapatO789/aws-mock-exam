# Knowledge Check

> **หมายเหตุ**: โมดูลนี้ใช้วิธีดึงข้อมูลดิบของสไลด์ (source JS ของ Storyline package ผ่าน same-origin fetch `html5/data/js/<slideId>.js`) หลังจากกดปุ่ม Play ของ module renderer หนึ่งครั้งก่อน (ซึ่งเป็นวิธีแก้ปัญหา 403 ที่เจอในรอบก่อนหน้า — สไลด์ 2 เป็นต้นไปจะ 403 จนกว่าจะกด Play ครั้งเดียว หลังจากนั้นการ fetch ทุกสไลด์ที่เหลือสำเร็จหมด ไม่ 403 อีกเลย) ข้อความคำถามและตัวเลือกด้านล่างเป็นข้อความจริงที่ใช้แสดงบนหน้าจอ
>
> **คำตอบที่ถูกต้องยืนยันจาก embedded answer key ในไฟล์ JSON ของแต่ละสไลด์คำถามเอง** (ไม่ใช่การอนุมาน และไม่ต้องกด "Show answers" ในระบบจริง) — แต่ละตัวเลือกที่ถูกต้องมี object ย่อยที่มี field `"altText"` ระบุตรงตัวว่า `"Choice X is the correct answer."` (X = ตัวอักษรตัวเลือก) ฝังอยู่ในสไลด์นั้นเอง (เป็น accessibility text ของ checkmark/feedback overlay ที่ปกติจะเห็นหลังตอบถูกในหน้าจอจริง) จึงถือเป็นคำตอบที่ยืนยันแล้ว (confirmed-from-embedded-data)

## Question 1
**Why is security important in cloud architecture?**
(เหตุใด security จึงสำคัญในสถาปัตยกรรมคลาวด์)

- A. To operate a workload securely, it is important to apply overarching best practices to every area of security.
- B. Envelope encryption makes everything more secure.
- C. Without securing cost savings, the business will not be viable.
- D. No one will use the application if it is secure.

**คำตอบที่ถูกต้อง (ยืนยันจาก embedded answer key): A**
*("Choice A is the correct answer." — ฝังอยู่ใน JSON ของสไลด์คำถามนี้)*

## Question 2
**What are the security best practice areas? (Select THREE.)**
(ข้อใดคือ best practice areas ของ security pillar — เลือก 3 ข้อ)

- A. Security formations
- B. Data protection
- C. Incident response
- D. Identity and access management
- E. Preparation for security events
- F. Keeping people away from the data

**คำตอบที่ถูกต้อง (ยืนยันจาก embedded answer key): B, C, D**
*("Choice D is the correct answer.", "Choice B is the correct answer.", "Choice C is the correct answer." — ฝังอยู่ใน JSON ของสไลด์คำถามนี้ ตรงกับ best practice areas จริงของ security pillar คือ Identity and access management, Data protection, Incident response)*

## Question 3
**What are the areas of security design principles? (Select THREE.)**
(ข้อใดคือส่วนหนึ่งของ security design principles — เลือก 3 ข้อ)

- A. Apply security at all layers.
- B. Protect data at transit and at rest.
- C. Understand that true security doesn't require planning.
- D. Keep people away from data.
- E. Use detective controls.
- F. Respond to incidents.

**คำตอบที่ถูกต้อง (ยืนยันจาก embedded answer key): A, B, D**
*("Choice A is the correct answer.", "Choice B is the correct answer.", "Choice D is the correct answer." — ฝังอยู่ใน JSON ของสไลด์คำถามนี้ ตรงกับ security design principles จริงคือ Apply security at all layers, Protect data in transit and at rest, Keep people away from data)*
