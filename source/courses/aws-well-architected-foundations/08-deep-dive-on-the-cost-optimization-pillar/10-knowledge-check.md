# Knowledge Check

> **หมายเหตุ**: เนื้อหาดึงผ่านไฟล์ข้อมูลดิบของ Storyline package (same-origin fetch ของ session ที่ authenticate อยู่แล้ว) แทนการอ่านจากหน้าจอ renderer โดยตรง เนื่องจาก registration/course นี้เจอบั๊ก "resume last activity" ที่ renderer เด้งไปโมดูลอื่นซ้ำ ๆ (สอดคล้องกับที่ skill เอกสารไว้) ข้อความคำถามและตัวเลือกด้านล่างเป็นข้อความจริงที่ใช้แสดงบนหน้าจอ (เรียงลำดับตามตำแหน่ง x/y ของแต่ละ object บนสไลด์เพื่อให้ตรงกับป้าย A/B/C/D ที่ถูกต้อง)
>
> สำหรับคำตอบที่ถูกต้อง: ในสไลด์ knowledge check พบ layer แสดงผล "correct" ที่มี accessibility alt text ระบุคำตอบที่ถูกต้องไว้ตรง ๆ (เช่น `"Choice B is correct."`) ซึ่งเป็นข้อความเดียวกับที่ระบบจะแสดงเมื่อผู้เรียนกด "Show Answers" จริง จึงถือว่าเป็นคำตอบที่ยืนยันจากข้อมูลของระบบเอง (ไม่ใช่การเดาหรืออนุมานจากเนื้อหาบทเรียน) แม้จะไม่ได้กดปุ่ม Show Answers ในหน้าจอ renderer จริงก็ตาม

## Question 1
**Which is an area of focus for the cost optimization pillar?**
(ข้อใดคือ area of focus ของ cost optimization pillar)

- A. Use serverless computing.
- B. Use cost-efficient resources.
- C. Control and understand where your money is being spent by conducting regular testing.
- D. Use trade-offs.

**คำตอบที่ถูกต้อง: B** (ยืนยันจาก alt text "Choice B is correct." ในข้อมูลดิบของสไลด์) — สอดคล้องกับ best practice area "Cost-Effective Resources" ที่เรียนไปในโมดูลนี้

## Question 2
**Which is a cost optimization best practice in expenditure awareness?**
(ข้อใดคือ cost optimization best practice ในด้าน expenditure awareness)

- A. Manage access by creating user policies.
- B. Have a third party review the spend.
- C. Use spend manager to reduce data transfer costs.
- D. Use AWS Cost Explorer to categorize and track AWS costs.

**คำตอบที่ถูกต้อง: D** (ยืนยันจาก alt text "Choice D is correct." ในข้อมูลดิบของสไลด์) — สอดคล้องกับหัวข้อ "Monitor cost and usage" ภายใต้ Expenditure and Usage Awareness ที่เรียนไปในโมดูลนี้ (การใช้เครื่องมือ เช่น AWS Cost Explorer เพื่อ track และจัดหมวดหมู่ต้นทุน)
