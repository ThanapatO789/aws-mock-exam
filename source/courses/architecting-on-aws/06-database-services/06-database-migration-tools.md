# Database Migration Tools

เมื่อต้องการ migrate ฐานข้อมูลจาก on-premises ไปยัง cloud infrastructure จำเป็นต้องใช้เครื่องมือสำหรับ schema conversion และ data transfer บทเรียนนี้สอนว่ามีเครื่องมือใดบ้างสำหรับ database migration และวิธีเลือกเครื่องมือที่เหมาะสมกับแอปพลิเคชัน

## AWS Database Migration Service (AWS DMS)

**AWS Database Migration Service (AWS DMS)** เป็นบริการคลาวด์ที่ทำให้การ migrate relational database, data warehouse, NoSQL database และ data store ประเภทอื่น ๆ เป็นเรื่องง่าย

AWS DMS จะ replicate ข้อมูลจาก source ไปยัง target database บน AWS Cloud โดยผู้ใช้สร้าง source และ target connection เพื่อบอก AWS DMS ว่าจะดึงข้อมูล (extract) จากที่ใดและโหลด (load) ไปที่ใด จากนั้นตั้งเวลา (schedule) task ที่รันบน server นี้เพื่อย้ายข้อมูล AWS DMS จะสร้างตารางและ primary key ที่เกี่ยวข้องให้อัตโนมัติ หากยังไม่มีอยู่บน target

AWS DMS รองรับการ migrate ระหว่างฐานข้อมูลที่ใช้กันแพร่หลายที่สุด ได้แก่ Oracle, PostgreSQL, SQL Server, Amazon Redshift, Aurora, MariaDB และ MySQL นอกจากนี้ยังรองรับทั้งการ migration แบบ homogeneous (เครื่องมือฐานข้อมูลชนิดเดียวกัน) และ heterogeneous (ฐานข้อมูลต่างชนิดกัน) สามารถใช้บริการนี้ migrate ระหว่าง on-premises database, Amazon EC2 database และ Amazon RDS database ได้ อย่างไรก็ตาม **ไม่สามารถ migrate ระหว่าง on-premises database สองตัวได้** โดย source หรือ target database (หรือทั้งสองฝั่ง) ต้องอยู่บน Amazon RDS หรือ Amazon EC2 อย่างน้อยฝั่งใดฝั่งหนึ่ง

## AWS Schema Conversion Tool (AWS SCT)

**AWS Schema Conversion Tool (AWS SCT)** ช่วยให้การ migrate ฐานข้อมูลแบบ heterogeneous คาดการณ์ผลลัพธ์ได้ง่ายขึ้น โดยจะแปลง schema ของ source database และ database code object ส่วนใหญ่โดยอัตโนมัติ ซึ่งรวมถึง view, stored procedure และ function โดยแปลงให้อยู่ในรูปแบบที่เข้ากันได้กับ target database ส่วน object ใดที่ไม่สามารถแปลงอัตโนมัติได้ ระบบจะทำเครื่องหมายไว้เพื่อให้แปลงด้วยตนเอง (manually) เพื่อให้การ migration สมบูรณ์

AWS SCT ยังสามารถสแกน source code ของแอปพลิเคชันเพื่อหาคำสั่ง SQL (structured query language) ที่ฝังอยู่ และแปลงเป็นส่วนหนึ่งของโครงการแปลง database schema ได้ด้วย ระหว่างกระบวนการนี้ AWS SCT จะปรับโค้ดที่สร้างมาสำหรับใช้งานบนคลาวด์ให้เหมาะสม โดยแปลง legacy function ของ Oracle และ SQL Server ให้เป็น AWS service ที่เทียบเท่า ซึ่งเป็นการ modernize แอปพลิเคชันไปพร้อมกับการ migrate database

เมื่อการแปลง schema เสร็จสมบูรณ์แล้ว AWS SCT ยังช่วย migrate ข้อมูลจาก data warehouse หลากหลายชนิดไปยัง **Amazon Redshift** โดยใช้ built-in data migration agent ได้อีกด้วย

## สรุป

บทเรียนนี้ครอบคลุม AWS Database Migration Service และ AWS Schema Conversion Tool ซึ่งเป็นการปิดท้ายเนื้อหาของโมดูลนี้ ต่อไปจะเป็น Knowledge Check และตามด้วย lab

## Key terms
- AWS Database Migration Service (AWS DMS): บริการ migrate ฐานข้อมูล (relational, data warehouse, NoSQL) จาก source ไปยัง target บน AWS Cloud
- Homogeneous migration: การ migrate ระหว่างฐานข้อมูล engine ชนิดเดียวกัน
- Heterogeneous migration: การ migrate ระหว่างฐานข้อมูล engine ต่างชนิดกัน
- AWS Schema Conversion Tool (AWS SCT): เครื่องมือแปลง database schema และ code object โดยอัตโนมัติสำหรับ heterogeneous migration
