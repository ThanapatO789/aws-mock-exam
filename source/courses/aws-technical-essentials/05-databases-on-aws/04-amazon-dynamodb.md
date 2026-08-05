# Amazon DynamoDB

**Amazon DynamoDB** เป็นบริการแบบ fully managed ที่ AWS จัดการงานด้าน operations ให้ทั้งหมด

## DynamoDB overview
DynamoDB เป็นฐานข้อมูล **NoSQL** แบบ fully managed ที่ให้ประสิทธิภาพเร็วและคาดเดาได้ พร้อม scalability แบบไร้รอยต่อ (seamless) ช่วยลดภาระด้านการดูแลและ scale ฐานข้อมูลแบบ distributed ไม่ต้องกังวลเรื่อง hardware provisioning, การติดตั้งและตั้งค่า, replication, การ patch ซอฟต์แวร์ หรือการ scale cluster

ด้วย DynamoDB คุณสามารถ:
- สร้างตารางฐานข้อมูลที่เก็บและดึงข้อมูลได้ทุกปริมาณ รองรับ request traffic ได้ทุกระดับ
- ปรับ (scale) throughput capacity ของตารางขึ้นหรือลงได้โดยไม่มี downtime หรือประสิทธิภาพลดลง
- ตรวจสอบการใช้ทรัพยากรและ performance metric ผ่าน AWS Management Console

DynamoDB กระจายข้อมูลและ traffic ของตารางไปยังหลายเซิร์ฟเวอร์โดยอัตโนมัติเพื่อรองรับ throughput/storage ที่ต้องการ พร้อมรักษาประสิทธิภาพให้เร็วและสม่ำเสมอ ข้อมูลทั้งหมดถูกเก็บบน SSD และ replicate ข้าม Availability Zone หลายแห่งในภูมิภาคโดยอัตโนมัติ ทำให้มี high availability และ data durability ในตัว

## DynamoDB core components
ส่วนประกอบหลักที่ทำงานด้วยใน DynamoDB คือ **table**, **item**, และ **attribute**:
- **Table**: กลุ่มของ items
- **Item**: กลุ่มของ attributes (คล้าย 1 แถวข้อมูล)
- ใช้ **primary key** เพื่อระบุแต่ละ item ในตารางแบบไม่ซ้ำกัน และใช้ **secondary index** เพื่อเพิ่มความยืดหยุ่นในการ query

(บทเรียนมีกราฟิกโต้ตอบอธิบายส่วนประกอบหลักทั้ง 3 นี้เพิ่มเติม)

## DynamoDB use cases
ควรพิจารณาใช้ DynamoDB เมื่อ:
- ฐานข้อมูลแบบดั้งเดิมอื่น ๆ มีปัญหาด้าน scalability
- กำลังพัฒนาแอปพลิเคชันหรือบริการใหม่อยู่
- ทำงานกับ workload แบบ OLTP
- ต้องการ deploy แอปพลิเคชันที่ mission-critical ที่ต้อง highly available ตลอดเวลาโดยไม่ต้องแทรกแซงด้วยมือ
- ต้องการ data durability ระดับสูงไม่ว่าจะมีกลยุทธ์ backup-and-restore แบบใด

DynamoDB ถูกใช้ในหลากหลาย workload ตั้งแต่ operation ระดับเล็กไปจนถึงระดับ ultra-high scale (เช่นที่ Amazon.com ใช้งาน) ตัวอย่างหมวดหมู่การใช้งาน (แบบ accordion ในบทเรียน):
- Develop software applications (พัฒนาแอปซอฟต์แวร์)
- Create media metadata stores (จัดเก็บ metadata ของสื่อ)
- Scale gaming platforms (รองรับการขยายตัวของแพลตฟอร์มเกม)
- Deliver seamless retail experiences (มอบประสบการณ์ retail ที่ราบรื่น)

## DynamoDB security
DynamoDB มีฟีเจอร์ด้านความปลอดภัยหลายอย่างให้พิจารณาเมื่อออกแบบนโยบายความปลอดภัยของตนเอง ได้แก่:
- โครงสร้าง storage ที่ทนทานสูง ออกแบบมาสำหรับข้อมูล mission-critical และข้อมูลหลัก โดยเก็บข้อมูลซ้ำซ้อนในหลายอุปกรณ์และหลาย facility ภายใน DynamoDB Region
- ข้อมูลผู้ใช้ทั้งหมดที่เก็บใน DynamoDB ถูก**เข้ารหัสขณะพัก (encryption at rest)** ทั้งหมด โดยใช้ encryption key ที่เก็บใน **AWS Key Management Service (AWS KMS)**
- ผู้ดูแล **IAM** ควบคุมว่าใครสามารถ authenticate และ authorize เพื่อใช้ทรัพยากร DynamoDB ได้ ใช้ IAM จัดการสิทธิ์การเข้าถึงและวางนโยบายความปลอดภัยได้
- ในฐานะ managed service, DynamoDB ได้รับการปกป้องโดยกระบวนการด้านความปลอดภัยของ AWS global network

### แนวปฏิบัติด้านความปลอดภัย (flashcards)
บทเรียนมี flashcard 4 ใบอธิบาย best practice ด้านความปลอดภัยของ DynamoDB ตัวอย่างที่ปรากฏ:
- **ใช้ AWS CloudTrail เพื่อตรวจสอบการใช้งาน AWS managed key**: หากใช้ AWS managed key สำหรับ encryption at rest การใช้งาน key จะถูกบันทึกไว้ใน AWS CloudTrail ซึ่งบอกได้ว่าใครเป็นผู้ร้องขอ ใช้บริการใด ทำ action อะไร พารามิเตอร์ของ action และผลลัพธ์ที่ตอบกลับ

## Key terms
- Amazon DynamoDB: บริการฐานข้อมูล NoSQL แบบ fully managed ของ AWS
- Table / Item / Attribute: ส่วนประกอบหลักของ DynamoDB (ตาราง / รายการข้อมูล / คุณลักษณะของรายการ)
- Primary key: คีย์ที่ใช้ระบุแต่ละ item ในตารางแบบไม่ซ้ำกัน
- Secondary index: ดัชนีเสริมที่เพิ่มความยืดหยุ่นในการ query
- Encryption at rest: การเข้ารหัสข้อมูลขณะจัดเก็บ
- AWS KMS (Key Management Service): บริการจัดการ encryption key ของ AWS
- AWS CloudTrail: บริการบันทึก log การใช้งาน API/ทรัพยากรของ AWS
