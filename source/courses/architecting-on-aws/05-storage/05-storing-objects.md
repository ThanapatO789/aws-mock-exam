# Storing Objects

บทเรียนนี้แนะนำ storage class ต่าง ๆ ที่มีให้ใช้งานบน Amazon S3 และพูดถึงวิธีเลือก storage class ให้เหมาะสม

## Storage classes (hotspot)

### Amazon S3 Intelligent-Tiering

**S3 Intelligent-Tiering** เป็น storage class เดียวที่ช่วยประหยัดต้นทุนโดยอัตโนมัติเมื่อรูปแบบการเข้าถึงข้อมูล (data access pattern) เปลี่ยนไป โดยแทบไม่กระทบ performance หรือภาระงานปฏิบัติการเลย ข้อมูลจะย้ายระหว่าง access tier ตามรูปแบบการใช้งานที่เปลี่ยนไป

เมื่อกำหนด object ให้เป็น S3 Intelligent-Tiering object จะถูกวางไว้ใน Frequent Access tier ซึ่งมีต้นทุนเท่ากับ S3 Standard หาก object ไม่ถูกเข้าถึงเป็นเวลา 30 วัน จะถูกย้ายไปยัง Infrequent Access tier ซึ่งมีต้นทุนเท่ากับ S3 Standard-IA และหลังจาก 90 วันที่ไม่ถูกเข้าถึง object จะถูกย้ายไปยัง Archive Instant Access tier ซึ่งมีต้นทุนเท่ากับ S3 Glacier Instant Retrieval

S3 Intelligent-Tiering เหมาะกับข้อมูลที่มีรูปแบบการเข้าถึงไม่แน่นอน เปลี่ยนแปลง หรือคาดเดาไม่ได้ ไม่ว่าขนาด object หรือระยะเวลาการเก็บรักษาจะเป็นเท่าใด สามารถใช้เป็น storage class เริ่มต้นสำหรับ workload แทบทุกประเภท โดยเฉพาะ data lakes, data analytics, แอปพลิเคชันใหม่ และ user-generated content

### Amazon S3 Glacier storage class benefits

Amazon S3 Glacier เป็นบริการที่ให้โซลูชันจัดเก็บข้อมูลต้นทุนต่ำ ทรงพลัง และยืดหยุ่น ออกแบบมาโดยเฉพาะสำหรับข้อมูลที่ต้อง archive

- **Cost-effective storage** — มีต้นทุนต่ำที่สุดสำหรับรูปแบบการเข้าถึงข้อมูลบางประเภท
- **Flexible data retrieval** — มี storage class ย่อยให้เลือก 3 แบบ พร้อมตัวเลือกการเข้าถึงที่หลากหลาย (Deep Archive, Instant Retrieval, Flexible Retrieval)
- **Secure and compliant** — มีการเข้ารหัสข้อมูลระหว่างพัก (encryption at rest), การเชื่อมต่อกับ AWS CloudTrail และ retrieval policy
- **Scalable and durable** — รองรับ scalability ตั้งแต่ระดับกิกะไบต์ถึงเอ็กซาไบต์ ด้วย durability 11 9s

### Lifecycle policies

ใช้ **S3 Lifecycle policies** เพื่อย้าย object ไปยัง storage class อื่นตามอายุของข้อมูล ควร automate lifecycle ของข้อมูลที่เก็บใน Amazon S3 การใช้ S3 Lifecycle policies ช่วยให้ข้อมูลถูกย้ายไปมาระหว่าง storage type ต่าง ๆ ของ Amazon S3 ตามรอบเวลาที่กำหนดได้

### Replicating S3 objects

Amazon S3 มอบระดับ availability และ durability สูงให้ลูกค้าในทุก AWS Region ข้อมูลที่เก็บใน Amazon S3 storage class ใด ๆ จะถูกเก็บกระจายในอย่างน้อย 3 Availability Zone ที่แยกห่างกันภายใน Region เดียวกัน ด้วยเหตุนี้ลูกค้า AWS จำนวนมากจึงเลือกใช้ Amazon S3 สำหรับข้อมูลที่สำคัญต่อธุรกิจและแอปพลิเคชัน (ยกเว้น S3 One Zone-IA ซึ่งเป็นบริการแบบ one-zone ตามชื่อ)

การ replicate S3 objects (accordion 4 หมวด):

- **Replicate objects while retaining metadata**: ทำให้ replica เหมือนกับ source object ทุกประการหากจำเป็น
- **Replicate objects into different storage classes**: ใช้ replication เพื่อนำ object ไปไว้ใน S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive หรือ storage class อื่นใน destination bucket โดยตรง
- **Maintain object copies under different ownership**: สั่งให้ Amazon S3 เปลี่ยนความเป็นเจ้าของ replica ให้เป็น AWS account ที่เป็นเจ้าของ destination bucket
- **Keep objects stored over multiple AWS Regions**: ตอบโจทย์ข้อกำหนด compliance โดยการ replicate ข้อมูลไปยัง AWS Region อื่น

Amazon S3 มีฟีเจอร์หลายอย่างที่ช่วยให้ลูกค้าใช้ตัวเลือกการจัดเก็บข้อมูลได้อย่างมีประสิทธิภาพ บทเรียนถัดไปจะทบทวนฟีเจอร์ที่มีประโยชน์เพิ่มเติมสำหรับแอปพลิเคชัน

## Key terms
- S3 Intelligent-Tiering: storage class ที่ย้าย object ระหว่าง tier อัตโนมัติตามรูปแบบการเข้าถึง
- S3 Glacier: กลุ่ม storage class ต้นทุนต่ำสำหรับการ archive ข้อมูล (Deep Archive, Instant Retrieval, Flexible Retrieval)
- S3 Standard-IA: storage class สำหรับข้อมูลที่เข้าถึงไม่บ่อย (Infrequent Access)
- S3 One Zone-IA: storage class ที่เก็บข้อมูลใน Availability Zone เดียว
- S3 Lifecycle policy: กฎสำหรับย้าย/ลบ object อัตโนมัติตามอายุของข้อมูล
- S3 Replication: การทำสำเนา object ไปยัง bucket อื่น (อาจข้าม Region หรือเปลี่ยนเจ้าของ)
