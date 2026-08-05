# Object Storage with Amazon S3

Object storage ถูกออกแบบมาสำหรับ cloud โดยเฉพาะ ให้ scalability แทบไร้ขีดจำกัด, durability สูง และคุ้มค่าทางต้นทุน

## Amazon S3 คืออะไร

ต่างจาก Amazon EBS, **Amazon Simple Storage Service (Amazon S3)** เป็น storage solution แบบ standalone ที่ไม่ผูกกับ compute สามารถเรียกดูข้อมูลได้จากทุกที่บนเว็บ Amazon S3 เป็น object storage service ที่เก็บข้อมูลแบบ flat structure โดย object คือไฟล์ที่รวมกับ metadata และสามารถเก็บ object ได้จำนวนไม่จำกัด

## Buckets

ไม่สามารถ upload object แม้แต่รูปเดียวไปยัง Amazon S3 ได้โดยไม่สร้าง **bucket** ก่อน เมื่อเก็บ object ไว้ใน bucket การรวมกันของ bucket name, key และ version ID จะระบุ object นั้นได้อย่างเฉพาะเจาะจง เมื่อสร้าง bucket ต้องระบุอย่างน้อย 2 อย่าง คือ ชื่อ bucket และ AWS Region ที่ต้องการให้ bucket อยู่

### กฎการตั้งชื่อ Amazon S3 bucket

Amazon S3 รองรับ global bucket ดังนั้นชื่อ bucket ต้องไม่ซ้ำกันในทุก AWS account ในทุก AWS Region ภายใน partition เดียวกัน (partition คือกลุ่มของ Region ซึ่งปัจจุบัน AWS มี 3 partition: Standard Regions, China Regions และ AWS GovCloud (US)) ควรหลีกเลี่ยงการใช้คำว่า AWS หรือ Amazon ในชื่อ bucket

กฎการตั้งชื่อบางส่วน:
- ความยาวชื่อ bucket ต้องอยู่ระหว่าง 3 ถึง 63 ตัวอักษร
- ใช้ได้เฉพาะตัวอักษรพิมพ์เล็ก ตัวเลข จุด (.) และขีดกลาง (-)
- ต้องขึ้นต้นและลงท้ายด้วยตัวอักษรหรือตัวเลข
- ต้องไม่มีรูปแบบเป็น IP address
- ชื่อ bucket ที่ถูกใช้แล้วจะไม่สามารถใช้ซ้ำโดย AWS account อื่นใน partition เดียวกันได้ จนกว่า bucket นั้นจะถูกลบ

หากแอปพลิเคชันสร้าง bucket แบบอัตโนมัติ ควรเลือก naming scheme ที่ไม่น่าจะเกิดการชนกันของชื่อ

### Object key names

**Object key (key name)** ระบุ object ใน Amazon S3 bucket อย่างเฉพาะเจาะจง เมื่อสร้าง object จะต้องระบุ key name โดย Amazon S3 model เป็นแบบ flat structure หมายความว่าไม่มี hierarchy ของ subbucket หรือ subfolder แต่ Amazon S3 console รองรับแนวคิดของ "folder" ได้โดยใช้ key name prefix และ delimiter เพื่อสื่อถึง logical hierarchy

ตัวอย่างเช่น bucket ชื่อ testbucket มี object 2 ตัว ที่มี key คือ `2022-03-01/AmazonS3.html` และ `2022-03-01/Cats.jpg` console จะใช้ key name prefix `2022-03-01` และ delimiter (`/`) เพื่อแสดงเป็นโครงสร้าง folder แม้ Amazon S3 จะรองรับ bucket และ object โดยไม่มี hierarchy จริง แต่การใช้ prefix และ delimiter ทำให้ console และ AWS SDK สามารถอนุมาน hierarchy และแสดงแนวคิดของ folder ได้

## Amazon S3 use cases (accordion ที่ขยายแล้ว)

- **Backup and storage** — Amazon S3 เป็นที่ที่เหมาะสำหรับ backup ไฟล์เพราะมีความ redundant สูง AWS เก็บ EBS snapshot ไว้ใน Amazon S3 เพื่อใช้ประโยชน์จาก high availability ของมัน
- **Media hosting** — เนื่องจากเก็บ object ได้ไม่จำกัดจำนวน และแต่ละ object มีขนาดได้สูงสุดถึง 5 TB จึงเหมาะเป็นที่เก็บ video, photo และ music
- **Software delivery** — สามารถใช้ Amazon S3 เพื่อ host software application ให้ลูกค้าดาวน์โหลดได้
- **Data lakes** — Amazon S3 เป็นรากฐานที่ดีสำหรับ data lake เพราะขยายตัวได้แทบไร้ขีดจำกัด เพิ่ม storage จากระดับ gigabyte ไปจนถึง petabyte ได้ จ่ายเฉพาะเท่าที่ใช้
- **Static websites** — สามารถตั้งค่า S3 bucket ให้ host เว็บไซต์แบบ static ที่ประกอบด้วย HTML, CSS และ client-side script ได้
- **Static content** — ด้วยการขยายตัวไม่จำกัด รองรับไฟล์ขนาดใหญ่ และเข้าถึง object ได้ผ่านเว็บทุกเมื่อ Amazon S3 จึงเหมาะเป็นที่เก็บ static content

## Security ใน Amazon S3

ทุกอย่างใน Amazon S3 เป็น private โดยค่าเริ่มต้น หมายความว่า resource ทั้งหมด (bucket และ object) จะมองเห็นได้เฉพาะ user หรือ AWS account ที่สร้าง resource นั้น หากต้องการให้ทุกคนบนอินเทอร์เน็ตเห็นได้ สามารถตั้งค่าให้ bucket/object เป็น public ได้ แต่โดยทั่วไปมักต้องการควบคุมสิทธิ์แบบละเอียด (granular) มากกว่า all-or-nothing Amazon S3 มี security management feature หลายแบบ: IAM policy, S3 bucket policy และ encryption

### Amazon S3 กับ IAM policies

เมื่อแนบ IAM policy กับ resource (bucket และ object) หรือ IAM user, group, role นโยบายจะกำหนดว่าพวกเขาสามารถทำ action ใดได้บ้าง access policy ที่แนบกับ resource เรียกว่า resource-based policy และ access policy ที่แนบกับ user เรียกว่า user policy

ควรใช้ IAM policy สำหรับ private bucket ใน 2 สถานการณ์:
- มี bucket จำนวนมากที่มีความต้องการสิทธิ์ต่างกัน แทนที่จะกำหนด S3 bucket policy หลายอัน สามารถใช้ IAM policy แทนได้
- ต้องการให้ policy ทั้งหมดอยู่ในที่เดียว (centralized location) เพื่อจัดการ policy information ได้จากที่เดียว

### Amazon S3 bucket policies

เช่นเดียวกับ IAM policy, S3 bucket policy ถูกกำหนดในรูปแบบ JSON แต่ต่างจาก IAM policy ตรงที่ S3 bucket policy แนบได้เฉพาะกับ S3 bucket เท่านั้น policy ที่วางบน bucket จะมีผลกับทุก object ในนั้น S3 bucket policy ระบุว่า action ใดได้รับอนุญาตหรือถูกปฏิเสธบน bucket

ควรใช้ S3 bucket policy ใน 2 สถานการณ์:
- ต้องการวิธีง่ายๆ ในการทำ cross-account access ไปยัง Amazon S3 โดยไม่ใช้ IAM role
- IAM policy ของคุณชนกับขีดจำกัดขนาดที่กำหนดไว้ S3 bucket policy มีขีดจำกัดขนาดที่ใหญ่กว่า

### Amazon S3 encryption

Amazon S3 เสริมความปลอดภัยด้วย encryption ทั้ง in transit (ระหว่างส่งไป/กลับจาก Amazon S3) และ at rest โดยจะเข้ารหัส object ทุกตัวโดยอัตโนมัติเมื่อ upload และใช้ server-side encryption ด้วย S3-managed key เป็นระดับพื้นฐานสำหรับทุก bucket โดยไม่มีค่าใช้จ่ายเพิ่มเติม

## Amazon S3 storage classes

เมื่อ upload object โดยไม่ระบุ storage class จะถูก upload ไปที่ default storage class หรือที่เรียกว่า standard storage สามารถเปลี่ยน storage tier ได้เมื่อลักษณะข้อมูลเปลี่ยนไป เพื่อประหยัดต้นทุน

| Storage Class | รายละเอียด |
|---|---|
| **S3 Standard** | Storage แบบ general-purpose สำหรับ cloud application, dynamic website, content distribution, mobile/gaming application และ big data analytics |
| **S3 Intelligent-Tiering** | เหมาะเมื่อ access pattern ของข้อมูลไม่ทราบแน่ชัดหรือเปลี่ยนแปลง เก็บ object ใน 3 tier (frequent access, infrequent access, archive instance access) และย้ายข้อมูลอัตโนมัติตาม access pattern |
| **S3 Standard-Infrequent Access (S3 Standard-IA)** | สำหรับข้อมูลที่เข้าถึงไม่บ่อยแต่ต้องการเข้าถึงได้รวดเร็วเมื่อจำเป็น ให้ durability/throughput/latency เท่า S3 Standard แต่ราคาต่อ GB และ retrieval fee ต่ำกว่า เหมาะสำหรับ backup ระยะยาว, disaster recovery file |
| **S3 One Zone-Infrequent Access (S3 One Zone-IA)** | ต่างจาก class อื่นที่เก็บข้อมูลอย่างน้อย 3 AZ, S3 One Zone-IA เก็บข้อมูลใน AZ เดียว ราคาถูกกว่า Standard-IA เหมาะสำหรับข้อมูลที่ไม่ต้องการ availability/resilience สูง เช่น secondary backup หรือข้อมูลที่สร้างใหม่ได้ง่าย |
| **S3 Glacier Instant Retrieval** | สำหรับ archive ข้อมูลที่เข้าถึงไม่บ่อยแต่ต้องการ retrieval ระดับ millisecond ประหยัดต้นทุนได้ถึง 68% เทียบกับ Standard-IA โดย latency/throughput เท่ากัน |
| **S3 Glacier Flexible Retrieval** | storage ต้นทุนต่ำสำหรับข้อมูล archive ที่เข้าถึง 1-2 ครั้ง/ปี เข้าถึงได้เร็วสุด 1-5 นาที (expedited retrieval) หรือขอ bulk retrieval ฟรีใน 5-12 ชั่วโมง เหมาะสำหรับ backup, disaster recovery, offsite storage |
| **S3 Glacier Deep Archive** | storage class ที่ราคาต่ำที่สุด รองรับการเก็บระยะยาวสำหรับข้อมูลที่เข้าถึง 1-2 ครั้ง/ปี default retrieval time 12 ชั่วโมง เหมาะสำหรับเก็บข้อมูล 7-10 ปีขึ้นไปเพื่อ compliance เช่น financial services, healthcare, public sector |
| **S3 on Outposts** | ให้บริการ object storage แก่สภาพแวดล้อม on-premises AWS Outposts โดยใช้ S3 API และ feature เดียวกัน เหมาะสำหรับ workload ที่ต้องการ data residency ในพื้นที่หรือให้ข้อมูลอยู่ใกล้ application on-premises เพื่อ performance |

## Amazon S3 versioning

Amazon S3 ระบุ object ส่วนหนึ่งด้วย object name เช่น เมื่อ upload รูปพนักงานชื่อ `employee.jpg` ไปยัง bucket `employees` — หากไม่มี versioning ทุกครั้งที่ upload object ชื่อ `employee.jpg` จะเขียนทับ object เดิม ซึ่งอาจเป็นปัญหาได้จาก:

- **Common names** — ชื่อ object ที่ใช้ทั่วไปอาจถูกเขียนทับโดยไม่ตั้งใจ และไม่สามารถเข้าถึง object เดิมได้อีก
- **Version preservation** — หากต้องการเก็บ object หลายเวอร์ชันไว้ โดยไม่มี versioning จะต้อง upload และตั้งชื่อใหม่ทุกครั้ง ทำให้เกิดความสับสนและ bucket รก

**Amazon S3 versioning** เก็บหลายเวอร์ชันของ object เดียวกันไว้ใน bucket เดียวกัน ช่วยกู้คืน object จากการลบหรือเขียนทับโดยไม่ตั้งใจ หรือจาก application failure หากเปิดใช้ versioning สำหรับ bucket, Amazon S3 จะสร้าง version ID ให้อัตโนมัติ ทำให้ object ที่มี key เดียวกันแต่ version ID ต่างกัน เช่น `employeephoto.jpg` (version 111111) และ `employeephoto.jpg` (version 121212) สามารถอยู่ร่วมกันได้

ด้วย versioning-enabled bucket สามารถกู้คืน object จากการลบหรือเขียนทับโดยไม่ตั้งใจได้:
- การลบ object ไม่ได้ลบถาวรทันที แต่ Amazon S3 จะใส่ marker แสดงว่ามีการพยายามลบ หากต้องการกู้คืนสามารถลบ marker ออกได้
- หากเขียนทับ object จะเกิด object version ใหม่ในตัว bucket และยังคงเข้าถึง version เก่าได้

### Versioning states (accordion ที่ขยายแล้ว)

Bucket มีสถานะ versioning ได้ 3 แบบ ซึ่งมีผลกับทุก object ใน bucket โดย storage cost จะเกิดกับทุก object รวมทุก version ดังนั้นอาจต้องการลบ version เก่าเมื่อไม่จำเป็นแล้ว เพื่อลดค่าใช้จ่าย:

- **Unversioned (default)** — object ใหม่และที่มีอยู่เดิมใน bucket ไม่มี version
- **Versioning-enabled** — เปิด versioning สำหรับทุก object ใน bucket หลังจากเปิดใช้แล้ว bucket จะไม่สามารถกลับไปเป็น unversioned ได้อีก แต่สามารถ suspend versioning ได้
- **Versioning-suspended** — object ใหม่จะไม่มี version แต่ object เดิมยังคงมี version ของตัวเองอยู่

## Managing your storage lifecycle

หากต้องเปลี่ยน storage tier ของ object ด้วยตนเองบ่อยๆ (เช่น รูปพนักงาน) สามารถ automate ได้ด้วยการตั้งค่า **Amazon S3 lifecycle** เมื่อกำหนด lifecycle configuration สำหรับ object หรือกลุ่ม object สามารถ automate ได้ 2 แบบ:

- **Transition actions** — กำหนดว่าเมื่อไหร่ object ควร transition ไปยัง storage class อื่น
- **Expiration actions** — กำหนดว่าเมื่อไหร่ object จะหมดอายุและควรถูกลบถาวร

ตัวอย่างเช่น transition object ไปยัง S3 Standard-IA หลังจากสร้างมาแล้ว 30 วัน หรือ archive object ไปยัง S3 Glacier Deep Archive หลังจากสร้างมาแล้ว 1 ปี

Use case ที่เหมาะกับการใช้ lifecycle configuration rule:
- **Periodic logs** — หากมีการ upload log เป็นระยะ และแอปพลิเคชันไม่ต้องการเข้าถึง log เก่าอีกต่อไป อาจต้องการลบทิ้ง
- **Data that changes in access frequency** — เอกสารบางอย่างถูกเข้าถึงบ่อยในช่วงแรก แล้วเข้าถึงไม่บ่อยหลังจากนั้น อาจไม่ต้องการ real-time access อีกต่อไป แต่องค์กรหรือกฎระเบียบอาจกำหนดให้ archive ไว้ในช่วงเวลาหนึ่งก่อนลบ

## Key terms
- Bucket: container สำหรับเก็บ object ใน Amazon S3 ต้องสร้างก่อนจึงจะ upload object ได้
- Object key: ชื่อที่ระบุ object อย่างเฉพาะเจาะจงภายใน bucket
- S3 bucket policy: JSON policy ที่แนบกับ bucket โดยตรง มีผลกับทุก object ในนั้น
- S3 storage class: ระดับชั้นการเก็บข้อมูลที่มี trade-off ระหว่างต้นทุน ความเร็วในการเข้าถึง และ availability
- Amazon S3 versioning: การเก็บหลายเวอร์ชันของ object เดียวกันไว้ใน bucket เดียวกัน
- Lifecycle configuration: กฎที่ automate การ transition/expire object ตามช่วงเวลา
