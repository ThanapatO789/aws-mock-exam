# Knowledge Check

> **หมายเหตุ**: โมดูลนี้เจอบั๊กเดียวกับที่พบในโมดูลอื่น ๆ ของคอร์สนี้ — renderer (Storyline) ค้างอยู่ที่หน้าจอเปิดโมดูลจนสกรีนช็อตค้าง/timeout แม้จะกดปุ่ม Play แล้วก็ตาม จึงดึงเนื้อหาผ่านไฟล์ข้อมูลดิบของ Storyline package (same-origin fetch ของ session ที่ authenticate อยู่แล้ว) แทน ข้อความคำถามและตัวเลือกด้านล่างเป็นข้อความจริงที่ใช้แสดงบนหน้าจอ (เรียงลำดับตามตำแหน่ง x/y ของแต่ละ object บนสไลด์เพื่อให้ตรงกับป้าย A/B/C/D/E/F ที่ถูกต้อง)
>
> สำหรับคำตอบที่ถูกต้อง: ในสไลด์ knowledge check พบ layer แสดงผล "correct" ที่มี accessibility alt text ระบุคำตอบที่ถูกต้องไว้ตรง ๆ (เช่น `"Choice A is correct."`) ซึ่งเป็นข้อความเดียวกับที่ระบบจะแสดงเมื่อผู้เรียนกด "Show Answers" จริง จึงถือว่าเป็นคำตอบที่ยืนยันจากข้อมูลของระบบเอง (ไม่ใช่การเดาหรืออนุมานจากเนื้อหาบทเรียน) แม้จะไม่ได้กดปุ่ม Show Answers ในหน้าจอ renderer จริงก็ตาม

## Question 1
**What are the areas of focus for performance efficiency pillar questions? (Select THREE.)**
(อะไรคือ areas ที่ performance efficiency pillar questions มุ่งเน้น — เลือก 3 ข้อ)

- A. Selecting the right resource types for compute, storage, database, and networking
- B. Gracefully recovering from failure
- C. Reviewing your selection as AWS continues to innovate with new resource types and features
- D. Making architectural trade-offs to maximize your performance efficiency
- E. Being aware of how your resources are performing through game days and testing
- F. Maintaining confidentiality and integrity of data

**คำตอบที่ถูกต้อง: A, C, D** (ยืนยันจาก alt text "correct" ในข้อมูลดิบของสไลด์) — สอดคล้องกับ 4 best practice areas ของ performance efficiency pillar ที่เรียนไปคือ Selection (A), Review (C), Trade-offs (D) ส่วน Monitoring ไม่ได้ถูกเลือกในคำตอบนี้ ในขณะที่ B (reliability), E (ลักษณะของ monitoring/testing แต่ไม่ใช่คำตอบ) และ F (security) ไม่ใช่คำตอบที่ถูกต้อง

## Question 2
**What is an example of a performance efficiency best practice in compute, storage, database, and networking?**
(ข้อใดคือตัวอย่างของ performance efficiency best practice ในด้าน compute, storage, database และ networking)

- A. Select the cheapest resource type.
- B. Select the largest resource type.
- C. Select the smallest resource type.
- D. Select the appropriate resource type.

**คำตอบที่ถูกต้อง: D** (ยืนยันจาก alt text "correct" ในข้อมูลดิบของสไลด์) — สอดคล้องกับหลักการ "evaluate available options" และ "rightsizing" ที่เรียนไปในหัวข้อ selection คือควรเลือก resource type ที่ **เหมาะสม** กับ workload ไม่ใช่เลือกจากราคาถูกสุด ใหญ่สุด หรือเล็กสุด

## Question 3
**What is an example of a performance efficiency best practice in trade-offs?**
(ข้อใดคือตัวอย่างของ performance efficiency best practice ในด้าน trade-offs)

- A. Cache data in one Availability Zone.
- B. Position resources or cached data closer to end users.
- C. Encrypt storage.
- D. Use more instances.

**คำตอบที่ถูกต้อง: B** (ยืนยันจาก alt text "correct" ในข้อมูลดิบของสไลด์) — สอดคล้องกับหัวข้อ "Using trade-offs to improve performance" ที่กล่าวถึงการใช้ edge services เพื่อย้าย content/cached data ให้เข้าใกล้ผู้ใช้งานมากขึ้นเพื่อลด latency
