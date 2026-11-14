## Errors

None.

## Weak spots

- Q747: `โจทย์ต้องการ 3 อย่าง: ยังเข้าถึงได้ทันที, availability และ resiliency เท่าเดิม ... S3 Standard-IA เก็บข้อมูลข้ามอย่างน้อย 3 AZ เหมือน Standard` — ตัวโจทย์เขียนรวมว่า "same high availability and resiliency" เพื่อตัด One Zone-IA แต่ตามสเปกจริง S3 Standard-IA มีความทนทานระดับ ≥3 AZ (durability 99.999999999%) เท่ากับ S3 Standard แต่มี availability ต่ำกว่าเล็กน้อย (99.9% เทียบกับ 99.99% ของ Standard) → ควรวงเล็บเสริมสั้นๆ ว่าในโจทย์หมายถึงการเก็บข้อมูลระดับ Multi-AZ (≥3 AZ) เหมือนเดิม (แม้ตามสเปก availability ของ Standard-IA คือ 99.9% ส่วน Standard คือ 99.99%) เพื่อไม่ให้จำสลับหากเจอโจทย์ที่ถามค่า availability โดยตรง
- Q754: `ข้อควรรู้คือ subscriber ของ SNS FIFO ต้องเป็น SQS queue (FIFO หรือ standard) แต่ละ service จึงมี queue ของตัวเองมารับ เป็นรูปแบบ SNS FIFO → SQS FIFO fan-out` — แม้ปัจจุบัน SNS FIFO จะส่งเข้า SQS standard queue ได้ แต่ถ้าปลายทางเป็น standard queue จะไม่รับประกันลำดับข้อความ → ควรระบุให้ชัดว่าแม้ SNS FIFO จะรองรับ subscriber ทั้ง SQS FIFO และ standard แต่หากต้องการรับประกันลำดับจนถึงปลายทางตามที่โจทย์สั่ง ต้องใช้คู่กับ **SQS FIFO queue** เท่านั้น
- Q756: `TAG: {"cat": "ops", "sub": "ops-dr", ...}` — โจทย์ถามฟีเจอร์ภายในของ Amazon RDS โดยตรง (Automated backups vs Manual snapshots vs Read replicas vs Multi-AZ) → `{"cat": "database", "sub": "db-rds", "pillar": "Reliability", "domain": "resilient"}` จะตรงหมวดกว่า

## Verdict

22 questions reviewed: 0 errors, 3 minor weak spots (Q747, Q754, Q756); 19/22 are fine as-is (and all 22 are technically sound enough to use as-is).
