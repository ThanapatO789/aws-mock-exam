## Errors

None.

## Weak spots

- Q636: `ตั้ง target group ของ dev ให้มี instance เดียว - instance ใน target group ถูกจัดการโดย ASG ที่ผูกอยู่ การแก้ target group ไม่ได้ลดจำนวน instance ที่ ASG launch จึงไม่ได้ลดค่าใช้จ่ายจริง` → ควรเสริมว่าขัดกับเงื่อนไขในโจทย์ที่ระบุว่าต้องส่ง traffic ไปยัง `"at least two Amazon EC2 instances in a single target group"` ด้วย
- Q649: `Lambda มีข้อจำกัด timeout 15 นาทีและหน่วยความจำ/ephemeral storage การดาวน์โหลดและแปลงไฟล์ 1 GB จึงเสี่ยงชนข้อจำกัด` → ปัจจุบัน Lambda ขยายทั้ง memory และ ephemeral storage (`/tmp`) ได้สูงสุด 10 GB (เฉพาะค่าเริ่มต้นของ `/tmp` คือ 512 MB) ไฟล์ 1 GB จึงไม่ได้เกินเพดานสูงสุดของ Lambda แต่แพ้ AWS Glue ETL ที่ต้องตั้งค่า/ดูแลโค้ดและ library แปลง Parquet เองเมื่อต้องประมวลผลหลายร้อยไฟล์ต่อชั่วโมง (operational overhead สูงกว่า)

## Verdict

21/21 questions reviewed: 19 are fine as-is, 0 errors, 2 minor weak spots.
