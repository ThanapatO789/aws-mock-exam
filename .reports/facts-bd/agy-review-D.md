## Errors

- `database-bd09`: ใน `fact` ระบุว่า `"ไม่ใช่: read replica แบบ RDS (ใช้ snapshot หรือ Multi-AZ แทน)"` ซึ่งสับสนระหว่างการขยายการอ่าน (read scaling) กับการสำรองข้อมูล/ทำ HA เพราะ snapshot เป็นเพียง backup ณ จุดเวลาหนึ่ง ไม่ใช่ replica ที่ซิงค์ข้อมูลตลอดเวลา และ Multi-AZ ของ Redshift (เฉพาะ RA3 / Serverless) มีไว้ทำ HA ไม่ใช่ตัวแทน Read Replica → `"ไม่ใช่: read replica ชื่อตรงๆ แบบ RDS (ถ้าต้องการรับโหลดอ่านเพิ่มใช้ Concurrency Scaling / แยก workload อ่านข้ามคลัสเตอร์ใช้ Data Sharing / ทำ HA ใช้ Multi-AZ บน RA3 หรือ Serverless / ทำ DR ข้าม region ใช้ cross-region snapshot copy)"`

## Weak spots

- `compute-bd04`: ใน `cue` ถามกว้างๆ ว่า `"container แบบ stateless ทน interruption ได้ ต้องการลดทั้งค่าใช้จ่ายและ overhead ใช้อะไร"` โดยไม่ได้ระบุว่าเป็น EKS แต่ `fact` เปิดด้วย `"Spot Instances ใน Amazon EKS managed node group (หรือ Fargate Spot ฝั่ง ECS)"` และอธิบายกลไกของ EKS เป็นหลัก (เพราะอิงจากโจทย์ข้อ 519 ที่ใช้ EKS อยู่แล้ว) → ปรับ `cue` ให้ชัดขึ้นเป็น `"รัน container บน EKS (หรือ ECS) แบบ stateless ทน interruption ได้ ต้องการลดทั้งค่าใช้จ่ายและ overhead ใช้อะไร"`
- `compute-bd08`: ใน `cue` มีคำว่า `"(บาง model ว่างหลายสัปดาห์ บางทีมาเป็นพัน)"` โดยไม่มีบริบทมาก่อนว่าเป็นงานรัน ML model และใน `fact` ระบุว่า `"scale ทั้งจำนวน task และ cluster ตามความยาว queue"` ซึ่งตัว ECS cluster เองเป็นเพียง logical grouping → ปรับ `cue` ให้ระบุบริบท เช่น `"ระบบรันหลาย ML model แบบ async มาเป็น burst ไม่สม่ำเสมอ..."` และปรับ `fact` เป็น `"scale ทั้งจำนวน task และเครื่อง EC2 ใน cluster (ผ่าน ECS Capacity Provider / Auto Scaling group หรือใช้ Fargate) ตามความยาว queue"`
- `database-bd07`: จัดอยู่ใน `cat: "database"`, `sub: "db-analytics"` ทั้งที่เป็นบริการกลุ่ม AI/ML ล้วน (`Textract`, `Comprehend Medical`, `Rekognition`, `Transcribe Medical`) → หากระบบมีหมวด AI/ML แยก ควรย้ายหมวด แต่ถ้าใช้ `db-analytics` รวมงาน data/ML อยู่แล้วสามารถคงไว้ได้
- `database-bd08`: จัดอยู่ใน `cat: "database"`, `sub: "db-analytics"` (เป็นบริการ AI/ML ล้วน) และตั้ง `kind: "compare"` ทั้งที่ `cue` (`"ใช้อะไรต่อกัน"`) และบรรทัดแรกของ `fact` เน้นลำดับ pipeline (`Transcribe → Amazon Translate → Comprehend`) → พิจารณาเปลี่ยน `kind` เป็น `"fact"` หากต้องการให้ตรงกับรูปแบบโจทย์เรียงลำดับบริการ
- `database-bd09`: `cue` (`"Redshift ทำอะไรได้บ้างที่ข้อสอบชอบถาม และอะไรที่ไม่ใช่ Redshift"`) กว้างเกินไปเพราะมัดรวมตัวเลือกจากข้อสอบ multi-select ข้อเดียว (ข้อ 905) และคำว่า `"รับข้อมูลที่เข้ารหัสฝั่ง client"` ใน `fact` กำกวม → ควรระบุให้ชัดว่า `"โหลดไฟล์จาก S3 ที่เข้ารหัสฝั่ง client (client-side encryption) ด้วยคำสั่ง COPY"`

## Verdict

13 of 18 cards are fine as-is (1 card has an inaccuracy in `database-bd09`, and 4 cards have minor weak spots).
