# Knowledge Check

> **หมายเหตุ**: โมดูลนี้ใช้วิธีดึงข้อมูลดิบของสไลด์ (source JS ของ Storyline package ผ่าน same-origin fetch) แทนการอ่านผ่าน renderer ที่แสดงผลจริง ข้อความคำถามและตัวเลือกด้านล่างเป็นข้อความจริงที่ใช้แสดงบนหน้าจอ (เรียงลำดับตามตำแหน่ง x/y ของแต่ละ object บนสไลด์เพื่อให้ตรงกับป้าย A/B/C/D/... ที่ถูกต้อง) แต่ **ไม่สามารถกด "Show answers" ในระบบจริงเพื่อยืนยันคำตอบที่ถูกต้องได้** คำตอบที่ทำเครื่องหมายด้านล่างเป็นการ**อนุมานจากเนื้อหาบทเรียนก่อนหน้า** (จับคู่ตัวเลือกกับ best practice areas / bullet points ที่ปรากฏในบทเรียน) ไม่ใช่คำตอบที่ยืนยันจากระบบจริง

## Question 1
**Which of the following is a reliability best practice area?**
(ข้อใดต่อไปนีเป็น best practice area ของ reliability pillar)

- A. Foundation
- B. Network architecture
- C. Risk management
- D. Cost allocation

*(อนุมานคำตอบ: **A** — เนื้อหาบทเรียน 1.9 "Reliability best practice areas" ระบุ 4 ด้านคือ Foundations, Workload architecture, Change management, Failure management ซึ่งตรงกับตัวเลือก A "Foundation" ส่วน B, C, D ไม่ปรากฏเป็น best practice area ในเนื้อหาบทเรียน — ยังไม่ได้ยืนยันจากการกด Show answers จริง)*

## Question 2
**What are examples of reliability best practices in workload architecture? (Select THREE.)**
(ตัวอย่างของ reliability best practices ใน workload architecture คือข้อใด — เลือก 3 ข้อ)

- A. Make all responses idempotent.
- B. Fail fast and limit queues.
- C. Throttle requests.
- D. Use cost allocation tags.
- E. Secure and encrypt backups.
- F. Perform post-incident analysis.

*(อนุมานคำตอบ: **A, B, C** — ทั้งสามข้อนี้ปรากฏตรงตัวในบทเรียน 1.15-1.16 "Design interactions in a distributed system to prevent/mitigate failures" ซึ่งอยู่ใน best practice area "Workload architecture" ส่วน D เป็นเรื่อง cost, E และ F อยู่ใน best practice area "Failure management" (บทเรียน 1.22, 1.25) ไม่ใช่ workload architecture — ยังไม่ได้ยืนยันจากการกด Show answers จริง)*

## Question 3
**Which of the following are best practices to test reliability? (Select TWO.)**
(ข้อใดต่อไปนี้เป็น best practices สำหรับการทดสอบ reliability — เลือก 2 ข้อ)

- A. Use playbooks to investigate failures.
- B. Perform post-incident analysis.
- C. Test security compliance and performance requirements.
- D. Conduct a monthly AWS Well-Architected Review.
- E. Conduct daily standup meetings to discuss possible breaking points in the system.

*(อนุมานคำตอบ: **A, B** — ทั้งสองข้อนี้ปรากฏตรงตัวในบทเรียน 1.25 "Test reliability" ("Use playbooks to investigate failures", "Perform post-incident analysis") ส่วน C เป็นข้อความที่ใกล้เคียงแต่ไม่ตรงกับ bullet จริงในบทเรียน ("Test scaling and performance requirements" / "Test functional requirements") และ D, E ไม่ปรากฏในเนื้อหาบทเรียนเลย — ยังไม่ได้ยืนยันจากการกด Show answers จริง)*
