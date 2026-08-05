# Amazon RDS

ทบทวนจากบทก่อนหน้า: บริการฐานข้อมูลมีสองประเภทหลัก คือ relational และ non-relational databases บทเรียนนี้ครอบคลุมวิธี configure **multi-AZ deployments** และ **read replicas** โดยใช้ **Amazon RDS**

เนื้อหาหลักนำเสนอผ่านวิดีโอผู้สอน (ความยาว 7 นาที 17 วินาที) หัวข้อ "Amazon RDS" ตั้งคำถามนำว่า "How can we more efficiently manage our relational databases in the AWS Cloud?"

## Amazon RDS

**Amazon RDS** เป็น web service ที่ช่วยให้ตั้งค่า (set up) ใช้งาน (operate) และ scale ฐานข้อมูลเชิงสัมพันธ์ (relational database) บนคลาวด์ได้ ให้ capacity ที่คุ้มค่าและปรับขนาดได้ (resizable) พร้อมจัดการงานดูแลฐานข้อมูลที่กินเวลามากแทนผู้ใช้ ทำให้ผู้ใช้สามารถโฟกัสที่แอปพลิเคชันและธุรกิจของตนได้

Amazon RDS รองรับ database engine ที่คุ้นเคย 6 ตัว ได้แก่ **Amazon Aurora, PostgreSQL, MySQL, MariaDB, Oracle Database และ Microsoft SQL Server** ซึ่งหมายความว่าโค้ด แอปพลิเคชัน และเครื่องมือที่ใช้กับฐานข้อมูลเดิมอยู่แล้วส่วนใหญ่สามารถนำมาใช้กับ Amazon RDS ได้เลย

Amazon RDS จะ patch database software และสำรองข้อมูล (backup) ให้อัตโนมัติ โดยเก็บ backup ไว้ตามระยะเวลาที่ผู้ใช้กำหนด (retention period) และรองรับ point-in-time recovery นอกจากนี้ยังสามารถปรับขนาด compute resource หรือ storage capacity ของ DB instance ได้ด้วย API call เดียว

## Multi-AZ deployments

**Amazon RDS Multi-AZ deployments** ช่วยเพิ่ม availability และ durability ให้กับ DB instance เหมาะสำหรับ production database workload เมื่อ provision Multi-AZ DB instance แล้ว Amazon RDS จะทำการ replicate ข้อมูลแบบ synchronous ไปยัง standby instance ที่อยู่คนละ Availability Zone

## Read replicas

ด้วย Amazon RDS สามารถสร้าง **read replica** ของฐานข้อมูลได้ โดย AWS จะ sync ข้อมูลกับ primary DB instance ให้อัตโนมัติ read replica รองรับสำหรับ Amazon RDS for Aurora, MySQL, MariaDB, PostgreSQL, Oracle และ Microsoft SQL Server read replica ช่วยได้ดังนี้:

- ลดภาระของ primary node ด้วย read capacity เพิ่มเติม (relieve pressure ด้วย additional read capacity)
- นำข้อมูลเข้าใกล้แอปพลิเคชันที่อยู่ต่าง AWS Region มากขึ้น
- promote read replica ให้เป็น standalone instance เพื่อใช้เป็นแนวทาง disaster recovery (DR) หาก primary DB instance ล้มเหลว

## Data encryption at rest

Amazon RDS มีการเข้ารหัสข้อมูลขณะพัก (encryption of data at rest) โดยใช้ **AWS Key Management Service (AWS KMS)** ซึ่งเป็น managed service ที่ช่วยสร้างและจัดการ encryption key แล้วเข้ารหัส/ถอดรหัสข้อมูลด้วย key เหล่านั้น key ทั้งหมดผูกกับ AWS account ของผู้ใช้และผู้ใช้เป็นผู้จัดการเองทั้งหมด AWS KMS เพิ่มการป้องกันอีกชั้นหนึ่งจากการเข้าถึง underlying storage ของ Amazon RDS instance โดยไม่ได้รับอนุญาต โดยใช้การเข้ารหัสมาตรฐานอุตสาหกรรม **AES-256** เพื่อปกป้องข้อมูลที่จัดเก็บบน host ที่รัน Amazon RDS instance นั้น

## Amazon Aurora

**Amazon Aurora** เป็นฐานข้อมูลเชิงสัมพันธ์ระดับ enterprise-class เข้ากันได้ (compatible) กับ MySQL และ PostgreSQL relational database มีความเร็วสูงกว่า MySQL มาตรฐานได้ถึง 5 เท่า และเร็วกว่า PostgreSQL มาตรฐานได้ถึง 3 เท่า Aurora ช่วยลดต้นทุนฐานข้อมูลโดยลดการทำ I/O operation ที่ไม่จำเป็น ในขณะที่ยังคงความน่าเชื่อถือ (reliability) และ availability ของทรัพยากรฐานข้อมูล เหมาะสำหรับ workload ที่ต้องการ high availability เพราะ Aurora จะทำสำเนาข้อมูล 6 ชุด (replicates six copies) กระจายอยู่ใน 3 Availability Zone และถูกออกแบบให้สำรองข้อมูล (back up) ไปยัง **Amazon S3** อย่างต่อเนื่อง

Aurora รองรับ network isolation, encryption at rest และ in transit, และ compliance/assurance program ต่าง ๆ Aurora ถูกจัดการโดย Amazon RDS ดังนั้นจึงไม่ต้อง provision server, patch software, setup หรือ configuration และ backup เอง

### Aurora DB clusters

**Amazon Aurora DB cluster** ประกอบด้วย DB instance หนึ่งตัวหรือมากกว่า และ cluster volume ที่จัดการข้อมูลสำหรับ DB instance เหล่านั้น instance ทำหน้าที่ประมวลผล (compute) ของฐานข้อมูล ส่วน cluster volume เก็บข้อมูลจริง

**Aurora cluster volume** เป็น virtual database storage volume ที่ครอบคลุมหลาย Availability Zone โดยแต่ละ Availability Zone มีสำเนาของข้อมูล DB cluster เก็บอยู่ ข้อมูลใน cluster volume ถูก replicate ไปยัง storage node หลายร้อยตัว Aurora นำเสนอ cluster volume เป็น single logical volume ให้กับ primary instance และ Aurora replica ใน DB cluster การเขียนข้อมูล (write operation) ไปยัง cluster volume มักพร้อมใช้งานสำหรับ Aurora replica ได้ภายในเวลาน้อยกว่า 100 มิลลิวินาที

**Aurora Serverless** เป็น configuration แบบ on-demand ที่ปรับขนาด (scaling) ให้ Aurora โดยอัตโนมัติ — เริ่มทำงาน (start up) ปิด (shut down) และปรับ capacity ขึ้นลงตามความต้องการของแอปพลิเคชัน ด้วย Aurora Serverless ผู้ใช้สามารถรันฐานข้อมูลบนคลาวด์ได้โดยไม่ต้องจัดการ database capacity เอง เพียงสร้างฐานข้อมูล ระบุช่วง capacity ที่ต้องการ แล้วเชื่อมต่อแอปพลิเคชัน โดยจ่ายเงินตามการใช้งานจริงแบบรายวินาที (pay per second) ที่ database ทำงานอยู่ Aurora Serverless เหมาะสำหรับ workload ที่ใช้งานไม่บ่อย ไม่แน่นอน หรือเป็นวัฏจักร (infrequent, unpredictable, or cyclical workloads)

บทเรียนถัดไปจะเรียนรู้เกี่ยวกับ non-relational database service คือ **Amazon DynamoDB**

## Key terms
- Amazon RDS: managed relational database service บน AWS รองรับ 6 engine (Aurora, PostgreSQL, MySQL, MariaDB, Oracle, SQL Server)
- Multi-AZ deployment: การตั้งค่า RDS ให้มี standby replica อยู่คนละ Availability Zone แบบ synchronous replication เพื่อความพร้อมใช้งานสูง (high availability)
- Read replica: สำเนาฐานข้อมูลแบบอ่านอย่างเดียว sync กับ primary อัตโนมัติ ใช้ช่วยกระจายโหลดการอ่านข้อมูล (read scaling) และทำ DR ได้
- AWS KMS: บริการจัดการ encryption key ใช้เข้ารหัสข้อมูล at rest ของ RDS ด้วย AES-256
- Amazon Aurora: relational database เข้ากันได้กับ MySQL/PostgreSQL เร็วกว่า MySQL 5 เท่า และ PostgreSQL 3 เท่า เก็บสำเนาข้อมูล 6 ชุดใน 3 AZ
- Aurora DB cluster: ประกอบด้วย DB instance และ cluster volume ที่ครอบคลุมหลาย AZ
- Aurora Serverless: configuration แบบ on-demand ที่ปรับ capacity อัตโนมัติ จ่ายตามการใช้งานจริงรายวินาที
