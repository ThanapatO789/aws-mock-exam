# Amazon DynamoDB

**Amazon DynamoDB** เป็นบริการฐานข้อมูล NoSQL บทเรียนนี้สอนวิธีที่ข้อมูลถูกจัดเก็บใน DynamoDB และวิธีใช้ features ต่าง ๆ ในแอปพลิเคชัน

## Amazon DynamoDB คืออะไร

DynamoDB เป็น fully managed NoSQL database service ความซับซ้อนในการรันฐานข้อมูล NoSQL แบบ distributed ที่ scale ได้มหาศาลนี้ถูกจัดการโดยตัวบริการเอง ทำให้นักพัฒนาสามารถโฟกัสที่การสร้างแอปพลิเคชันแทนที่จะต้องจัดการ infrastructure

DynamoDB คุ้มค่าใช้จ่าย (cost effective) โดยจ่ายตาม storage ที่ใช้จริงและ I/O throughput ที่ provision ไว้ ถูกออกแบบให้ scale ได้แบบยืดหยุ่น (elastically) พร้อมรักษาประสิทธิภาพสูง

DynamoDB รองรับ end-to-end encryption และ fine-grained access control

## Tables, primary keys และ secondary indexes

DynamoDB จัดเก็บข้อมูลในรูปแบบ table เมื่อสร้าง table ต้องระบุ table name และ partition key ซึ่งเป็นสองสิ่งเดียวที่จำเป็นต้องระบุ

DynamoDB ใช้ primary key เพื่อระบุแต่ละ item ในตารางอย่างไม่ซ้ำกัน (uniquely identify) และใช้ secondary index เพื่อเพิ่มความยืดหยุ่นในการ query มี primary key อยู่ 2 ประเภท:

- **Simple primary key** – ประกอบด้วย attribute เดียวที่กำหนดเป็น partition key ถ้าใช้แค่ partition key จะไม่มี item สองรายการที่มีค่าเดียวกันได้
- **Composite primary key** – ประกอบด้วยทั้ง partition key และ sort key โดยค่า partition key ของหลาย ๆ item สามารถซ้ำกันได้ แต่ค่า sort key ของ item เหล่านั้นต้องต่างกัน

ใน DynamoDB, table, item และ attribute เป็นองค์ประกอบหลักที่ใช้งาน: table คือกลุ่มของ item และแต่ละ item คือกลุ่มของ attribute (หน้าเว็บมี hotspot ให้กดดูตามลำดับ แต่ไม่มีเนื้อหาเพิ่มเติมนอกเหนือจากที่สรุปไว้)

## DynamoDB capacity และ scaling

Amazon DynamoDB มอบประสิทธิภาพที่รวดเร็วและคาดการณ์ได้ พร้อม scalability แบบไร้รอยต่อ DynamoDB ให้ latency ต่ำในทุกระดับ scale และช่วยลดความซับซ้อนของการจัดการ capacity ของฐานข้อมูล หลังจาก provision table แล้ว สามารถเปลี่ยน capacity ของ table ได้ตามความต้องการที่เปลี่ยนไป

เมื่อวางแผนเรื่อง capacity ใน DynamoDB ต้องพิจารณาจำนวน read/write request ต่อวินาทีที่คาดการณ์ไว้ รวมถึงขนาดของ request เหล่านั้น สิ่งนี้ช่วยเลือก capacity mode ที่เหมาะสมสำหรับ table โดย read/write capacity mode จะควบคุมว่าจะถูกคิดค่าใช้จ่ายสำหรับ read/write throughput อย่างไร และจัดการ capacity อย่างไร สามารถตั้งค่า mode นี้ได้ตอนสร้าง table หรือเปลี่ยนภายหลังก็ได้

DynamoDB มี read/write capacity mode 2 แบบ:
- **ON-DEMAND**: เป็นโมเดลแบบจ่ายตามการใช้งาน (pay-per-request) เหมาะสำหรับกรณีที่ workload ไม่แน่นอน, traffic คาดเดาไม่ได้ หรือต้องการจ่ายเฉพาะส่วนที่ใช้จริง
- **PROVISIONED**: (ไม่สามารถเก็บเนื้อหารายละเอียดของโหมดนี้ได้ เนื่องจากเนื้อหาอยู่ใน tab ที่ต้องกดเปลี่ยนและระบบ redirect ของหน้าเว็บพาออกจากบทเรียนก่อนกดดูได้)

## DynamoDB consistency options

เมื่อแอปพลิเคชันเขียนข้อมูลลง DynamoDB table และได้รับ HTTP 200 response (OK) แสดงว่าการเขียนนั้นเกิดขึ้นแล้วและ durable ข้อมูลจะ eventually consistent ในทุก storage location โดยปกติภายใน 1 วินาทีหรือน้อยกว่า DynamoDB รองรับทั้ง eventually consistent reads และ strongly consistent reads

- **Eventually consistent reads** (ค่าเริ่มต้น): DynamoDB ใช้ eventually consistent reads เว้นแต่จะระบุเป็นอย่างอื่น การทำ read operation (เช่น GetItem, Query, Scan) มี parameter ชื่อ ConsistentRead ให้กำหนด (ไม่สามารถเก็บเนื้อหาต่อจากนี้ได้ครบถ้วน เนื่องจากอยู่ใน accordion ที่ระบบ redirect พาออกจากบทเรียนก่อนอ่านจบ)
- **Strongly consistent reads**: (ไม่สามารถเก็บเนื้อหาของ accordion นี้ได้เลย เนื่องจากปัญหา redirect เดียวกัน)

## DynamoDB global tables

**Global table** คือกลุ่มของ DynamoDB table ตั้งแต่หนึ่งตารางขึ้นไป ที่เป็นเจ้าของโดย AWS account เดียวกัน เรียกว่า replica table แต่ละ replica table คือ DynamoDB table เดี่ยว ๆ ที่ทำหน้าที่เป็นส่วนหนึ่งของ global table โดยแต่ละ replica จะเก็บชุดข้อมูล (data item) ชุดเดียวกัน global table หนึ่งตัวสามารถมี replica table ได้เพียง 1 ตารางต่อ 1 Region เท่านั้น และทุก replica จะมีชื่อ table และ primary key schema เดียวกัน

DynamoDB global tables มอบโซลูชันแบบ fully managed สำหรับการ deploy ฐานข้อมูลแบบ multi-Region, multi-active โดยไม่ต้องสร้างและดูแล replication solution ของตัวเอง เมื่อสร้าง global table ต้องระบุ Region ที่ต้องการให้ table พร้อมใช้งาน DynamoDB จะจัดการงานทั้งหมดที่จำเป็นเพื่อสร้าง table ที่เหมือนกันใน Region เหล่านี้ และ propagate การเปลี่ยนแปลงข้อมูลอย่างต่อเนื่องไปยังทุก Region โดย DynamoDB จะสื่อสารการเปลี่ยนแปลงเหล่านี้ผ่าน AWS network backbone

บทเรียนถัดไปจะสอนวิธี implement database caching ในแอปพลิเคชัน

## Key terms
- Amazon DynamoDB: fully managed NoSQL database service ที่ scale ได้และมีประสิทธิภาพสูง
- Partition key: ส่วนหนึ่งของ primary key ที่ใช้กำหนด partition ของข้อมูล
- Sort key: ส่วนที่สองของ composite primary key ใช้เรียงลำดับ item ที่มี partition key เดียวกัน
- Simple primary key / Composite primary key: primary key แบบมี attribute เดียว / แบบมี partition key + sort key
- On-demand capacity mode: โหมดจ่ายตามการใช้งานจริง (pay-per-request)
- Provisioned capacity mode: โหมดกำหนด capacity ล่วงหน้า
- Eventually consistent read / Strongly consistent read: การอ่านข้อมูลแบบ consistency ในที่สุด / แบบ consistency ทันที
- Global tables: DynamoDB table ที่ replicate ข้อมูลข้าม Region แบบ multi-active
