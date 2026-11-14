## Errors

- `ops-bd16`: ใน `fact` ท่อน `"tag ที่บริษัทตั้งเอง = user-defined ส่วน AWS-generated tag ขึ้นต้นด้วย aws: และ activate ที่ member account เห็นแค่ค่าใช้จ่ายของตัวเอง"` มีทั้งจุดที่คลาดเคลื่อนและประโยคกำกวม — ใน AWS Organizations (consolidated billing) **member account ไม่สามารถกด activate cost allocation tag เองได้** (ต้องให้ management account เป็นคน activate เท่านั้น) ส่วนเรื่องที่เห็นเฉพาะค่าใช้จ่ายของตัวเองเป็นข้อจำกัดของการดู Cost Explorer ใน member account และการเชื่อมด้วย `"และ"` ต่อจาก `"AWS-generated tag ขึ้นต้นด้วย aws:"` ทำให้อ่านเข้าใจผิดว่า AWS-generated tag ต้องไป activate ที่ member account → `"tag ที่บริษัทตั้งเอง = user-defined (ส่วน AWS-generated tag ขึ้นต้นด้วย aws:) ทั้งนี้ใน Organizations จะ activate cost allocation tag ที่ member account ไม่ได้ (ทำได้เฉพาะที่ management account) และถ้าดู Cost Explorer ที่ member account จะเห็นแค่ค่าใช้จ่ายของตัวเอง"`

## Weak spots

- `ops-bd08`: ใน `fact` ท่อน `"ไม่ต้องเปิด EC2 รอใน Region ที่สอง จ่ายแค่ค่าเก็บ backup และ copy on demand หรือเขียน Lambda เองไม่ใช่ LEAST effort"` เชื่อมประโยคด้วย `"และ"` ยาวติดกันโดยไม่มีวรรคตอน ทำให้ `"จ่ายแค่ค่าเก็บ backup และ copy on demand"` อ่านรวบเป็นวลีเดียวกัน แล้วเหลือ `"หรือเขียน Lambda เองไม่ใช่ LEAST effort"` ลอยอยู่ท้ายประโยค → `"ไม่ต้องเปิด EC2 รอใน Region ที่สอง (จ่ายแค่ค่าเก็บและโอนย้าย backup) ส่วนการกด copy แบบ on-demand หรือเขียน Lambda เองไม่ใช่ LEAST effort"`
- `ops-bd13`: ใน `cue` ท่อน `"DR ข้าม Region ที่ Region สำรองไม่ต้องรับโหลดตอนปกติ หรือต้องการ downtime น้อยสุด ตั้ง Route 53 และ data อย่างไร"` การใช้คำว่า `"หรือ"` อาจทำให้ผู้เรียนจำว่าโจทย์ที่ถามหา `"downtime น้อยสุด"` เดี่ยว ๆ ต้องตอบ active-passive เสมอ (ทั้งที่ถ้าไม่มีเงื่อนไขห้ามรับโหลดตอนปกติ โจทย์อาจหมายถึง active-active) → `"DR ข้าม Region ที่ Region สำรองไม่ต้องรับโหลดตอนปกติ และต้องการ downtime ตอน failover น้อยสุด ตั้ง Route 53 และ data อย่างไร"`

## Verdict

15 of 18 cards are fine as-is (1 factual/trap-reason error in `ops-bd16`, 2 minor Thai phrasing weak spots in `ops-bd08` and `ops-bd13`).
