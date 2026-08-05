# Database Services

นอกจาก compute และ storage แล้ว database ก็เป็นองค์ประกอบสำคัญของแอปพลิเคชันเช่นกัน บทเรียนนี้ช่วยให้ผู้เรียนสามารถประเมิน (evaluate) และเลือกฐานข้อมูลให้เหมาะกับความต้องการของแอปพลิเคชัน

## AWS database services

AWS database services เป็นฐานข้อมูลที่ออกแบบมาเฉพาะทาง (purpose-built) รองรับ workload หลากหลายรูปแบบ เช่น relational, key-value, document, graph, time-series ฯลฯ การเลือกฐานข้อมูลที่เหมาะสมกับ workload จะช่วยให้ได้ผลลัพธ์ที่ดีที่สุดในแง่ high availability, low latency และประสิทธิภาพสูงสุด

## Relational และ non-relational databases

ตลอดหลายทศวรรษที่ผ่านมา data model หลักที่ใช้ในการพัฒนาแอปพลิเคชันคือ relational data model ซึ่งใช้ใน relational database เช่น Oracle, IBM DB2, Microsoft SQL Server, MySQL และ PostgreSQL จนกระทั่งช่วงกลางถึงปลายยุค 2000s data model แบบอื่น ๆ จึงเริ่มได้รับความนิยมมากขึ้น และมีการบัญญัติศัพท์ว่า NoSQL ขึ้นเพื่อแยกประเภทฐานข้อมูลกลุ่มใหม่นี้ (คำว่า NoSQL มักใช้แทนกันได้กับคำว่า nonrelational)

### Relational databases

relational database คือชุดของ data item ที่มีความสัมพันธ์ (relationship) กำหนดไว้ล่วงหน้าระหว่างกัน โดยจัดเก็บเป็นชุดของตาราง (table) ที่มีคอลัมน์ (column) และแถว (row) แต่ละคอลัมน์เก็บข้อมูลประเภทหนึ่ง ๆ และแต่ละ field เก็บค่าจริงของ attribute นั้น แต่ละแถวแทนกลุ่มของค่าที่เกี่ยวข้องกันของวัตถุหรือ entity หนึ่งชิ้น ข้อมูลนี้สามารถถูกเข้าถึงได้หลายรูปแบบโดยไม่ต้องจัดโครงสร้างตารางใหม่

โมดูลนี้เน้นที่บริการ SQL database สองตัว คือ **Amazon RDS** และ **Amazon Aurora**

### Non-relational หรือ NoSQL databases

**NoSQL database** ถูกออกแบบมาเฉพาะทาง (purpose built) สำหรับ data model เฉพาะ และมี schema ที่ยืดหยุ่น (flexible schema) สำหรับสร้างแอปพลิเคชันสมัยใหม่ NoSQL เป็นคำที่ใช้เรียกระบบฐานข้อมูลแบบ non-relational ที่มี high availability, scalable และปรับให้เหมาะกับ performance สูง NoSQL database ใช้โมเดลข้อมูลแบบอื่น เช่น key-value pair หรือ document storage แทนโครงสร้างตารางแบบดั้งเดิม

### เปรียบเทียบ Relational กับ Nonrelational (NoSQL) Database

| Relational Database | Nonrelational (NoSQL) Database |
|---|---|
| ต้องการกฎ schema ที่เข้มงวดและการควบคุมคุณภาพข้อมูล | ต้องการให้ฐานข้อมูล scale ได้แบบ horizontal |
| ฐานข้อมูลไม่ได้ต้องการ read/write capacity ที่สูงมาก | ข้อมูลไม่เหมาะกับการจัดเก็บแบบ schema ดั้งเดิม |
| ถ้ามีชุดข้อมูลแบบ relational ที่ไม่ต้องการประสิทธิภาพสูงมาก relational database management system อาจเป็นทางเลือกที่ดีที่สุดและใช้ความพยายามน้อยที่สุด | อัตรา read/write เกินกว่าที่ SQL database แบบดั้งเดิมจะรองรับได้อย่างคุ้มค่าทางเศรษฐกิจ |

## Managed และ unmanaged services

เมื่อสร้าง resource บนคลาวด์ ต้องพิจารณาระดับการควบคุม (control) ที่ต้องการ และทรัพยากรที่มีสำหรับดูแล resource นั้น

ตัวอย่างเช่น เมื่อรันฐานข้อมูลบนคลาวด์ สามารถติดตั้งฐานข้อมูลบน **Amazon EC2** instance เอง หรือเลือกใช้ managed database option เช่น **Amazon RDS** ก็ได้ (หน้าเว็บมี hotspot ให้กดดูรายละเอียดเพิ่มเติม แต่ไม่มีเนื้อหาเพิ่มเติมนอกเหนือจากที่สรุปไว้ข้างต้น)

## สรุป

ตอนนี้ผู้เรียนทราบแล้วว่ามีบริการฐานข้อมูลแบบใดบ้าง และแต่ละบริการรองรับข้อมูลประเภทใด บทเรียนถัดไปจะเจาะลึกเรื่อง **Amazon RDS**

## Key terms
- Relational database: ฐานข้อมูลเชิงสัมพันธ์ (มีโครงสร้างตาราง มี schema ตายตัว) เช่น Oracle, MySQL, PostgreSQL
- Non-relational (NoSQL) database: ฐานข้อมูลที่ไม่ใช้โครงสร้างตารางแบบตายตัว รองรับ key-value, document, graph, time-series
- Amazon Aurora: relational database service ของ AWS ที่เข้ากันได้กับ MySQL/PostgreSQL
- Managed service: บริการที่ AWS ดูแลจัดการโครงสร้างพื้นฐานให้ (เช่น Amazon RDS) ต่างจากการติดตั้งฐานข้อมูลเองบน Amazon EC2
