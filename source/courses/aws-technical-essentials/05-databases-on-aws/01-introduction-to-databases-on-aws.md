# Introduction to Databases on AWS

ฐานข้อมูลที่มีประสิทธิภาพสูงมีความสำคัญมากต่อทุกองค์กร ฐานข้อมูลรองรับการทำงานภายในของบริษัทและเก็บข้อมูลการโต้ตอบกับลูกค้าและซัพพลายเออร์

วิดีโอของบทเรียนนี้ใช้ตัวอย่างแอปพลิเคชัน "employee directory" (ระบบทำเนียบพนักงาน) ที่สร้างต่อเนื่องมาตลอดคอร์ส ซึ่งต้องเก็บข้อมูลพนักงาน (ชื่อ, สถานที่, ตำแหน่งงาน, badge) โดยรองรับการเพิ่ม/ดู/แก้ไข/ลบข้อมูลพนักงาน ตามแผนสถาปัตยกรรมของแอปนี้เลือกใช้ **Amazon RDS** (Amazon Relational Database) เป็นที่เก็บข้อมูล

## รันฐานข้อมูลเชิงสัมพันธ์บน AWS ได้อย่างไร
- ติดตั้งและดำเนินการฐานข้อมูลบน **Amazon EC2** instance ได้ — เหมาะสำหรับการย้าย (migrate) ฐานข้อมูลเดิมขึ้น AWS เมื่อย้ายจาก on-premises มา EC2 จะไม่ต้องรับผิดชอบโครงสร้างพื้นฐานทางกายภาพหรือการติดตั้ง OS อีกต่อไป แต่ยังคงต้องรับผิดชอบการติดตั้ง database engine, การตั้งค่า multi-AZ พร้อม data replication, และงานดูแลเซิร์ฟเวอร์ฐานข้อมูล เช่น การติดตั้ง security patch และอัปเดตซอฟต์แวร์
- ใช้บริการ managed database ของ AWS เช่น **Amazon RDS** — AWS รับผิดชอบงาน "undifferentiated heavy lifting" ทั้งหมด (การจัดการ instance, patching, upgrade, การติดตั้งฐานข้อมูล) ส่วนผู้ใช้ยังคงรับผิดชอบการสร้างและปรับแต่งฐานข้อมูลเอง เช่น schema, indexing, stored procedures, encryption, access control

## ประวัติของฐานข้อมูลระดับองค์กร (History behind enterprise databases)
แต่เดิมการเลือกฐานข้อมูลเป็นเรื่องง่าย ลูกค้ามีตัวเลือก vendor ไม่กี่ราย และมักเลือก vendor เดียวใช้กับทุกแอปพลิเคชันโดยที่ยังไม่เข้าใจ use case อย่างถ่องแท้ ตั้งแต่ปี 1970 เป็นต้นมา ประเภทฐานข้อมูลที่ธุรกิจเลือกใช้มากที่สุดคือ **relational database** (ฐานข้อมูลเชิงสัมพันธ์)

## Relational databases
- จัดเก็บข้อมูลในรูปแบบ**ตาราง (tables)** ข้อมูลในตารางหนึ่งสามารถเชื่อมโยง (link) กับตารางอื่นเพื่อสร้างความสัมพันธ์ (relationship) — ที่มาของคำว่า "relational"
- ตารางเก็บข้อมูลเป็นแถว (row/record) และคอลัมน์ (column/attribute) เช่น ตัวอย่างตาราง books, sales, authors ที่เชื่อมกันผ่านคอลัมน์ author ร่วมกัน
- โครงสร้างตาราง คอลัมน์ และความสัมพันธ์ทั้งหมดเรียกว่า **logical schema** ซึ่งเมื่อฐานข้อมูล relational เริ่มทำงานแล้ว schema จะถูกกำหนดตายตัว (fixed) และยากที่จะเปลี่ยนภายหลัง จึงต้องออกแบบ data model ล่วงหน้าให้เรียบร้อยก่อน

### Relational database management system (RDBMS)
ใช้สร้าง อัปเดต และดูแลฐานข้อมูลเชิงสัมพันธ์ ตัวอย่าง RDBMS ที่พบทั่วไป:
- MySQL
- PostgreSQL
- Oracle
- Microsoft SQL Server
- Amazon Aurora

สื่อสารกับ RDBMS ด้วยภาษา **SQL (structured query language)** เช่น `SELECT * FROM table_name` และสามารถเขียน query ที่ซับซ้อนขึ้นเพื่อดึงข้อมูลจากหลายตาราง (join) มาวิเคราะห์ความสัมพันธ์และตอบโจทย์ทางธุรกิจ

### ประโยชน์ของ relational database
- **Complex SQL**: ใช้ SQL join หลายตารางเพื่อทำความเข้าใจความสัมพันธ์ของข้อมูล
- **Reduced redundancy**: เก็บข้อมูลไว้ที่ตารางเดียวแล้วอ้างอิงจากตารางอื่น แทนที่จะบันทึกข้อมูลซ้ำในหลายที่
- **Familiarity**: relational database เป็นที่นิยมมาตั้งแต่ปี 1970 ผู้เชี่ยวชาญด้านเทคนิคจึงมักคุ้นเคยและมีประสบการณ์กับมัน
- **Accuracy**: รับประกันความถูกต้องของข้อมูลสูงและเป็นไปตามหลัก **ACID** (atomicity, consistency, isolation, durability)

### กรณีการใช้งาน (use cases) ของ relational database
- **Applications that have a fixed schema**: แอปพลิเคชันที่มี schema ตายตัวและไม่ค่อยเปลี่ยนแปลง เช่น แอป lift-and-shift ที่ยกจาก on-premises ขึ้นคลาวด์โดยแทบไม่ต้องแก้ไข
- **Applications that need persistent storage**: แอปพลิเคชันที่ต้องการ persistent storage และยึดหลัก ACID เช่น Enterprise resource planning (ERP), Customer relationship management (CRM), งานด้าน commerce และ financial

## เลือกระหว่าง unmanaged กับ managed database
การเลือกรัน relational database บน AWS แบบ managed หรือ unmanaged มีหลักการคล้าย shared responsibility model (แบ่งความรับผิดชอบด้านความปลอดภัยระหว่าง AWS กับลูกค้า) — ยิ่ง managed มาก ยิ่งสะดวกแต่ควบคุมได้น้อยลง

- **Unmanaged (on-premises)**: ผู้ใช้รับผิดชอบทุกอย่างเอง ทั้งความปลอดภัยและไฟฟ้าของ data center, การจัดการเครื่อง host, การจัดการฐานข้อมูล, การปรับแต่ง query, และการจัดการข้อมูลลูกค้า — ควบคุมได้ทั้งหมดแต่ต้องรับผิดชอบทั้งหมดเช่นกัน
- **รันบน Amazon EC2**: AWS ดูแลโครงสร้างพื้นฐานทางกายภาพ ฮาร์ดแวร์ และติดตั้ง OS ให้ ส่วนผู้ใช้ยังต้องจัดการ EC2 instance, จัดการฐานข้อมูลบน host นั้น, ปรับแต่ง query, และจัดการข้อมูลลูกค้า
- **Managed database service (เช่น Amazon RDS)**: AWS ตั้งค่าทั้ง EC2 instance และฐานข้อมูลให้ พร้อมระบบ high availability, scalability, patching, และ backup ผู้ใช้ยังคงรับผิดชอบการปรับแต่งฐานข้อมูล (tuning), การปรับแต่ง query, และการดูแลความปลอดภัยของข้อมูลลูกค้า — สะดวกที่สุดแต่ควบคุมได้น้อยที่สุดเมื่อเทียบกับสองแบบก่อนหน้า

## Key terms
- Relational database: ฐานข้อมูลที่จัดเก็บข้อมูลเป็นตารางที่มีความสัมพันธ์กัน
- RDBMS (Relational Database Management System): ระบบจัดการฐานข้อมูลเชิงสัมพันธ์ เช่น MySQL, PostgreSQL, Oracle, Amazon Aurora
- SQL (Structured Query Language): ภาษาสำหรับ query ฐานข้อมูลเชิงสัมพันธ์
- Schema: โครงสร้างของตาราง คอลัมน์ และความสัมพันธ์ในฐานข้อมูล
- ACID (Atomicity, Consistency, Isolation, Durability): หลักการรับประกันความถูกต้องของ transaction ในฐานข้อมูล
- Amazon RDS: บริการ managed relational database ของ AWS
- Amazon EC2: บริการ virtual server ของ AWS ที่สามารถใช้รันฐานข้อมูลแบบ self-managed ได้
