# Knowledge Check

> **หมายเหตุ**: โมดูลนี้ใช้วิธีดึงข้อมูลดิบของสไลด์ (source JS ของ Storyline package ผ่าน same-origin fetch) แทนการอ่านผ่าน renderer ที่แสดงผลจริง (renderer แสดงผลค้าง/freeze ซ้ำหลายครั้งระหว่างพยายามเข้าถึงหน้า Knowledge Check ด้วยการคลิกจริง) ข้อความคำถามและตัวเลือกด้านล่างเป็นข้อความจริงที่ใช้แสดงบนหน้าจอ ตรวจสอบ JSON ของสไลด์ทั้ง 3 ข้อแล้วไม่พบ embedded answer key (ไม่มี field เช่น "correct"/"isCorrect"/alt-text ที่ระบุคำตอบที่ถูกต้อง) จึง **ไม่สามารถกด "Show Answers" ในระบบจริงเพื่อยืนยันคำตอบที่ถูกต้องได้** คำตอบที่ทำเครื่องหมายด้านล่างเป็นการ**อนุมานจากเนื้อหาบทเรียนก่อนหน้าในโมดูลนี้เอง** (จับคู่ตัวเลือกกับ bullet points ที่ปรากฏตรงตัวในบทเรียน) ไม่ใช่คำตอบที่ยืนยันจากระบบจริง

## Question 1
**Which of the following are drivers for considering sustainability when improving architectures? (Select THREE.)**
(ปัจจัยขับเคลื่อน (driver) ใดต่อไปนี้ที่ทำให้ต้องพิจารณาเรื่อง sustainability เมื่อปรับปรุง architecture — เลือก 3 ข้อ)

- A. Customer demand
- B. Performance
- C. Competitive positioning
- D. Government regulations
- E. Cost savings
- F. Security

*(อนุมานคำตอบ: **A, D, E** (Customer demand, Government regulations, Cost savings) — เนื้อหาบทเรียนของโมดูลนี้ไม่ได้ระบุ driver เหล่านี้ไว้ตรงๆ เป็น list เดียว การอนุมานนี้อ้างอิงจากความรู้ทั่วไปเกี่ยวกับเหตุผลหลักที่องค์กรพิจารณาเรื่อง sustainability ในสื่อการสอนของ AWS (แรงกดดันด้าน regulation, ความต้องการของลูกค้า, และการประหยัดต้นทุน) ส่วน Performance, Competitive positioning, และ Security ไม่ใช่ driver ด้าน sustainability โดยตรง — **ความเชื่อมั่นของการอนุมานข้อนี้ต่ำกว่าข้ออื่น เนื่องจากไม่มี bullet ในบทเรียนที่ตรงกับตัวเลือกเหล่านี้โดยตรง** — ยังไม่ได้ยืนยันจากการกด Show answers จริง)*

## Question 2
**Which of the following is a Well-Architected sustainability design principle?**
(ข้อใดต่อไปนี้เป็น sustainability design principle ของ Well-Architected)

- A. Process and culture
- B. Regional selection
- C. Review cost and usage reports regularly
- D. Understand your impact

*(อนุมานคำตอบ: **D** — ตรงกับบทเรียน 1.7 "Sustainability design principles" ที่ระบุ design principle ข้อแรกว่า "Understand your impact" แบบตรงตัวคำต่อคำ ส่วน A "Process and culture" และ B "Regional selection" เป็นชื่อ **best practice area** (บทเรียน 1.9-1.21) ไม่ใช่ design principle และ C เป็นเนื้อหาเกี่ยวกับ cost optimization pillar ไม่ใช่ sustainability — ความเชื่อมั่นสูง เพราะตรงกับข้อความในบทเรียนแบบคำต่อคำ — ยังไม่ได้ยืนยันจากการกด Show answers จริง)*

## Question 3
**Which of the following are best practices when considering hardware patterns for sustainability? (Select THREE.)**
(ข้อใดต่อไปนี้เป็น best practices เมื่อพิจารณา hardware patterns เพื่อ sustainability — เลือก 3 ข้อ)

- A. Use instance types with the lowest cost.
- B. Use managed services.
- C. Use instance types with the least impact.
- D. Use the minimum amount of hardware to meet your needs.
- E. Use policies to manage the lifecycle of your datasets.
- F. Optimize areas of code that consume the most resources.

*(อนุมานคำตอบ: **B, C, D** — ทั้งสามข้อนี้ตรงกับบทเรียน 1.19 "Hardware and services" แบบเกือบคำต่อคำ ("Use managed services", "Use the minimum amount of hardware to meet your needs", "Use instance types with the least impact") ส่วน A "lowest cost" ไม่ตรงกับ bullet จริงที่เน้น "least impact" ไม่ใช่ cost, E เป็น best practice ของหัวข้อ **Data patterns** (บทเรียน 1.17) ไม่ใช่ Hardware, และ F เป็น best practice ของหัวข้อ **Software and architecture patterns** (บทเรียน 1.15) ไม่ใช่ Hardware — ความเชื่อมั่นสูง เพราะตรงกับข้อความในบทเรียนแบบคำต่อคำ — ยังไม่ได้ยืนยันจากการกด Show answers จริง)*
