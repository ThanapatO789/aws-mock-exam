## Errors
- Q873: `Batch บน Fargate รองรับเฉพาะ Linux` และใน ANALYSIS `'Windows container' ตัด Lambda และ Batch on Fargate (Linux เท่านั้น)` — ข้อมูลล้าสมัย เพราะ AWS Batch on AWS Fargate รองรับ Windows container แล้ว (ตั้งแต่ พ.ย. 2023) → เหตุผลที่ตัดข้อ B คือ AWS Batch ไม่มีฟีเจอร์ตั้งเวลาแบบ cron ในตัว (`Configure the job scheduling to run every 10 minutes` ไม่มีอยู่จริง เพราะ scheduling policy ของ Batch ใช้จัดลำดับคิว/fair-share ไม่ใช่ตัวตั้งเวลาเรียกงานซ้ำ ซึ่งต้องพึ่ง EventBridge อยู่ดี) และมี overhead ในการตั้งค่า compute environment/job queue เกินจำเป็นสำหรับงานเดี่ยวสั้นๆ

## Weak spots
- Q873: `จ่ายเฉพาะช่วง 1-3 นาทีที่ task รัน` — สำหรับ **Windows container** บน ECS Fargate มีการคิดค่าใช้จ่ายขั้นต่ำ **15 นาทีต่อ task** (ต่างจาก Linux container ที่คิดขั้นต่ำ 1 นาที) → ควรเขียนว่าคิดค่าใช้จ่ายเฉพาะตามการรันของแต่ละ task โดยไม่ต้องเปิดเครื่องทิ้งไว้ตลอดเวลา แทนการระบุว่าจ่ายแค่ 1-3 นาที
- Q890: `ส่วนทางที่ผ่าน S3 ก่อนจะทำ permission หาย เพราะ S3 object ไม่เก็บ Windows ACL` และ `**จุดจำ: ย้ายไฟล์ไป FSx for Windows โดยเก็บ permission = DataSync ส่งตรง ห้ามผ่าน S3 ตรงกลาง**` — หากใช้ DataSync ทั้งขาขึ้นและขาลง (SMB → S3 → FSx) DataSync สามารถเก็บ SMB/NTFS permission ไว้ใน S3 object metadata ได้ → เหตุผลที่ข้อ B และ E ทำ permission หายคือขาแรกใช้ **AWS CLI** copy ไฟล์ขึ้น S3 ซึ่ง AWS CLI ไม่ได้เก็บ NTFS ACL/permission ไปด้วย (ส่วนข้อ C AWS ไม่มีบริการรับฮาร์ดดิสก์ที่ถอดจากเครื่องมา import เข้า S3)

## Verdict
20 of 22 questions (Q869–Q890) are fine as-is; 1 question (Q873) has a factual error to fix and 1 additional question (Q890) has a minor technical nuance to tighten.
