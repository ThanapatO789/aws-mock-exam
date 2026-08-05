# Amazon S3

บทเรียนนี้พาไปดูบริการ **Amazon S3** เจาะลึกวิธีจัดระเบียบข้อมูลและ use case ต่าง ๆ ของการใช้งาน Amazon S3

## Amazon Simple Storage Service (Amazon S3)

Amazon S3 เป็น object-level storage โดย object หนึ่งชิ้นประกอบด้วยข้อมูลไฟล์ (file data), metadata และ unique identifier การจัดเก็บแบบ object ไม่ใช้โครงสร้างไฟล์และโฟลเดอร์แบบดั้งเดิม

Amazon S3 storage tiers ทุกระดับถูกออกแบบให้มี durability 99.999999999% (11 9s) ต่อปี โดยค่าเริ่มต้นข้อมูลใน Amazon S3 จะถูกจัดเก็บแบบ redundant ในหลาย facility และหลายอุปกรณ์ในแต่ละ facility สามารถเข้าถึง Amazon S3 ได้ผ่าน AWS Management Console (แบบเว็บ), ผ่าน API/SDK แบบ programmatic หรือผ่านโซลูชันของบุคคลที่สาม (third-party) ที่ใช้ API/SDK เช่นกัน

### Use case หลักของ Amazon S3 (accordion 5 หมวด)

- **Backup and restore**: ใช้ Amazon S3 เก็บและดึงข้อมูลปริมาณเท่าใดก็ได้ ทุกเวลา ใช้เป็น durable store สำหรับข้อมูลแอปพลิเคชันและกระบวนการ backup/restore ระดับไฟล์ ออกแบบมาให้มี durability 99.999999999% (11 9s)
- **Data lakes for analytics**: รัน big data analytics, AI, ML และ high performance computing (HPC) เพื่อค้นหา insight จากข้อมูล
- **Media storage and streaming**: ใช้ Amazon S3 ร่วมกับ Amazon CloudFront edge locations เพื่อ host วิดีโอสำหรับดูแบบ on-demand อย่างปลอดภัยและ scalable (video-on-demand streaming คือวิดีโอถูกเก็บบนเซิร์ฟเวอร์ให้ผู้ชมดูได้แทบทุกเวลา)
- **Static website**: ใช้ Amazon S3 host เว็บไซต์แบบ static ที่แต่ละหน้าเป็น static content (อาจมี client-side script ด้วย) การเก็บแบบ object storage ช่วยจัดการ data access, replication และ data protection ของไฟล์ static ได้ง่ายขึ้น
- **Archiving and compliance**: ทดแทนการใช้ tape ด้วย workflow สำรองข้อมูลบนคลาวด์ที่ต้นทุนต่ำ พร้อมรักษาข้อกำหนด compliance ทั้งด้าน corporate, contractual และ regulatory

## Buckets and objects

Amazon S3 จัดเก็บข้อมูลเป็น object ภายใน bucket โดย object ประกอบด้วยไฟล์และ metadata ที่อธิบายไฟล์นั้น การจะเก็บ object ใน Amazon S3 ต้องอัปโหลดไฟล์เข้า bucket

สามารถมี bucket ได้หนึ่งหรือหลาย bucket ในบัญชี เมื่อสร้าง bucket ชื่อ bucket ต้องไม่ซ้ำกันทั่วโลก (globally unique) สำหรับแต่ละ bucket:

- สามารถควบคุมว่าใครสร้าง ลบ และ list object ใน bucket ได้
- เลือก AWS Region ทางภูมิศาสตร์ที่ Amazon S3 จะจัดเก็บ bucket และเนื้อหาภายใน
- สามารถเข้าถึง log ของ bucket และ object ภายในได้

Amazon S3 อนุญาตให้มี bucket สูงสุด 100 bucket ต่อบัญชี เมื่ออัปโหลดไฟล์ สามารถตั้งค่า permission ของ object และเพิ่ม metadata ได้ URL แบบ virtual-hosted–style ประกอบด้วย bucket และ object key

Object key คือ unique identifier ของ object ใน bucket การรวมกันของ bucket, key และ version ID จะระบุ object แต่ละชิ้นได้อย่างเฉพาะเจาะจง object ทุกชิ้นสามารถระบุที่อยู่ได้ผ่านการรวมกันของ web service endpoint, bucket name, key และ (ถ้ามี) version

ตัวอย่างเช่น URL `https://my-bucket.s3.amazonaws.com/2006-03-01/pup.jpg` — `my-bucket` คือชื่อ bucket และ `2006-03-01/pup.jpg` คือ key ส่วน `2006-03-01/` ของ object key เรียกว่า prefix

บทเรียนนี้อธิบายพื้นฐานของ Amazon S3 บทเรียนถัดไปจะพูดถึงการรักษาความปลอดภัยของ object ที่จัดเก็บใน Amazon S3

## Key terms
- Amazon S3: object storage service ของ AWS
- Durability: ความทนทาน/โอกาสที่ข้อมูลจะไม่สูญหาย (11 9s = 99.999999999%)
- Bucket: คอนเทนเนอร์สำหรับเก็บ object ใน Amazon S3 ชื่อต้อง globally unique
- Object key: unique identifier ของ object ภายใน bucket
- Prefix: ส่วนของ object key ที่ใช้จำลองโครงสร้างแบบโฟลเดอร์
- Amazon CloudFront: บริการ CDN ของ AWS ที่ใช้ร่วมกับ S3 สำหรับ media streaming
