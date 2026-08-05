# Amazon RDS

**Amazon Relational Database Service (Amazon RDS)** ช่วยให้เน้นทำงานที่สร้างความแตกต่างให้แอปพลิเคชันได้ แทนที่จะเสียเวลากับงานด้านโครงสร้างพื้นฐาน เช่น provisioning, patching, scaling และ restoring

## เดโมในวิดีโอ (Transcript สรุป)
วิดีโอสาธิตการสร้างฐานข้อมูลสำหรับแอป employee directory ผ่าน Amazon RDS console:
- คลิก **Create database** แล้วเลือก **Easy create** (ใช้ best practice มาตรฐานสำหรับ backup และ high availability) หรือเลือก **Standard create** หากต้องการควบคุมรายละเอียดเอง
- เลือก database engine ที่รองรับ เช่น MySQL, PostgreSQL, MariaDB, Microsoft SQL Server และ **Amazon Aurora**
  - Aurora เป็นฐานข้อมูลเฉพาะของ AWS ออกแบบมาให้ใช้ประโยชน์จาก scalability และ durability ของ AWS Cloud ได้เต็มที่ เข้ากันได้แบบ drop-in กับ MySQL/PostgreSQL เร็วกว่า MySQL มาตรฐานได้ถึง 5 เท่า และเร็วกว่า PostgreSQL มาตรฐานได้ถึง 3 เท่า เหมาะกับงานที่ต้องการข้อมูลจำนวนมาก, high availability, durability และ latency ต่ำ
- เดโมเลือกใช้ standard MySQL instance ขนาด free-tier แล้วตั้งชื่อฐานข้อมูล/username/password
- เมื่อสร้าง RDS DB instance จะถูกวางไว้ใน subnet ภายใน VPC (คล้าย EC2) หนึ่ง DB instance อยู่ใน 1 subnet/1 AZ เท่านั้น — เพื่อ high availability ตาม best practice ควร configure **RDS Multi-AZ deployment** ให้มี DB instance สำรอง (secondary) ใน subnet/AZ อื่น โดย RDS จะจัดการ data replication และ failover ให้อัตโนมัติ แอปเชื่อมต่อผ่าน endpoint เดียว ไม่ต้องแก้โค้ดเมื่อเกิด failover

## Amazon RDS overview
Amazon RDS เป็น managed database service ที่ให้ลูกค้าสร้างและจัดการฐานข้อมูลเชิงสัมพันธ์บนคลาวด์ได้โดยไม่ต้องแบกภาระด้านการดูแลฐานข้อมูลแบบดั้งเดิม ช่วยให้โฟกัสกับงานที่สร้างความแตกต่างให้ธุรกิจ แทนงานโครงสร้างพื้นฐาน

รองรับ RDBMS ยอดนิยมหลายแบบ:
- **Commercial**: Oracle, SQL Server
- **Open source**: MySQL, PostgreSQL, MariaDB
- **Cloud native**: Aurora

### Database instances
Amazon RDS ประกอบด้วย compute และ storage เช่นเดียวกับฐานข้อมูลที่จัดการเอง ส่วน compute เรียกว่า **DB instance** ซึ่งรัน DB engine หนึ่ง DB instance สามารถมีหลายฐานข้อมูลที่ใช้ engine เดียวกันได้ และแต่ละฐานข้อมูลมีได้หลายตาราง ภายใต้ DB instance คือ EC2 instance ที่ถูกจัดการผ่าน RDS console (ไม่ใช่ EC2 console) เมื่อสร้าง DB instance ต้องเลือก instance type/size ซึ่งมีผลต่อพลังประมวลผลและหน่วยความจำ (มีกราฟิกโต้ตอบอธิบาย instance class 4 แบบในบทเรียน)

### Storage บน Amazon RDS
- Engine ทั่วไป (MySQL, MariaDB, PostgreSQL, Oracle, SQL Server) ใช้ **Amazon EBS** volume สำหรับเก็บฐานข้อมูลและ log
- **Aurora** เก็บข้อมูลใน cluster volume ซึ่งเป็น virtual volume แบบ SSD เดียวที่มีสำเนาข้อมูลกระจายอยู่ 3 Availability Zones ในหนึ่ง Region ส่วนไฟล์ชั่วคราวที่ไม่ต้อง persist ใช้ local storage
- ประเภท storage ของ RDS มี 3 แบบ: **General Purpose SSD** (gp2/gp3), **Provisioned IOPS SSD** (io1), และ **Magnetic** (standard) — ต่างกันด้าน performance และราคา เพื่อให้ปรับให้เหมาะกับ workload ได้

### Amazon RDS ใน VPC
เมื่อสร้าง DB instance ต้องเลือก VPC และ subnet ที่ต้องการ เรียกว่า **DB subnet group** ซึ่งต้องมีอย่างน้อย 2 AZ ในภูมิภาคนั้น subnet ใน DB subnet group ควรเป็น private (ไม่มีเส้นทางไปยัง internet gateway) เพื่อให้เข้าถึง DB instance ได้เฉพาะจาก application backend เท่านั้น สามารถจำกัดการเข้าถึงเพิ่มเติมได้ด้วย **network ACLs** และ **security groups**

## Backup data
มีวิธี backup 2 แบบ เลือกดูได้จาก tab:
- **Automated backups**: เปิดใช้งานเป็นค่าเริ่มต้น สำรองข้อมูลทั้ง DB instance (ไม่ใช่แค่แต่ละฐานข้อมูล) รวมถึง transaction log ตั้งค่า backup window ได้ (ควรตั้งช่วงเวลาที่ database มีการใช้งานน้อย) เก็บได้ 0-35 วัน (ตั้งเป็น 0 = ปิดการ backup อัตโนมัติและลบ backup เดิมทั้งหมด) ข้อดีคือทำ **point-in-time recovery** ได้ (สร้าง DB instance ใหม่จากข้อมูล ณ จุดเวลาที่ระบุ โดย restore full backup แล้ว roll back transaction จนถึงเวลาที่กำหนด)
- **Manual snapshots**: คล้าย Amazon EBS snapshot แต่จัดการผ่าน RDS console เริ่มสำรองได้ทุกเมื่อและเก็บไว้จนกว่าจะลบเอง เหมาะกับกรณีต้องเก็บ backup นานกว่า 35 วัน (เช่น เพื่อ compliance ที่กำหนดให้เก็บ 1 ปี) การ restore จาก manual snapshot จะสร้าง DB instance ใหม่จากข้อมูลใน snapshot นั้น

แนะนำให้ใช้ทั้งสองแบบร่วมกัน: automated backups เหมาะกับ point-in-time recovery ส่วน manual snapshots เก็บได้นานกว่า 35 วัน

## Redundancy ด้วย Amazon RDS Multi-AZ
เมื่อใช้ Multi-AZ deployment, RDS จะสร้างสำเนาฐานข้อมูล 2 ชุด: primary copy ใน subnet หนึ่ง AZ และ standby copy ใน subnet อีก AZ หนึ่ง
- Primary copy ให้บริการ query/แสดงข้อมูลจริง ข้อมูลจาก primary จะถูก replicate แบบ synchronous ไปยัง standby (standby ไม่ถูก query โดยตรง)
- หาก primary มีปัญหา (เช่น การเชื่อมต่อขาดหาย) RDS จะทำ **automatic failover** โดยใช้ DNS name เดิมชี้ไปยัง standby ที่ถูกเลื่อนเป็น primary แทน แล้ว query จะถูก redirect ไปยัง primary ใหม่โดยอัตโนมัติ
- เพื่อรักษาการตั้งค่า Multi-AZ ไว้เสมอ มี 2 วิธีสร้าง standby ใหม่: ปรับ primary เดิม (ถ้ายังทำงานอยู่) ให้กลับมาเป็น standby, หรือสร้าง standby DB instance ใหม่
- เลือก subnet หลายตัวได้เพราะต้องมี subnet คนละ AZ สำหรับ primary และ standby

## Amazon RDS security
การจัดการความปลอดภัยขึ้นกับงานที่ผู้ใช้ต้องทำใน RDS โดยมีเครื่องมือหลัก:
- **Network ACLs** และ **security groups**: ควบคุมทิศทาง traffic ที่เข้าถึง DB instance
- **AWS IAM (Identity and Access Management)**: ใช้กำหนดสิทธิ์ว่าใครสามารถจัดการทรัพยากร RDS ได้ เช่น สร้าง/ดู/แก้ไข/ลบ DB instance, ติด tag ทรัพยากร, หรือแก้ไข security group
- **Amazon RDS encryption**: เข้ารหัสข้อมูลใน DB instance และ snapshot ขณะพัก (at rest) เพื่อความปลอดภัย

(บทเรียนมี flashcard อธิบายหัวข้อความปลอดภัย 4 ใบ ได้แก่ IAM, Security groups, Amazon RDS encryption และอีกหนึ่งหัวข้อเพิ่มเติม)

## Key terms
- Amazon RDS: บริการ managed relational database บน AWS
- Amazon Aurora: ฐานข้อมูล relational แบบ cloud-native ของ AWS ที่เร็วกว่า MySQL/PostgreSQL มาตรฐาน
- DB instance: หน่วย compute ของ RDS ที่รัน database engine
- DB subnet group: กลุ่มของ subnet (อย่างน้อย 2 AZ) ที่กำหนดให้ RDS DB instance ใช้งาน
- Multi-AZ deployment: การตั้งค่าให้มี DB instance สำรองในอีก AZ หนึ่งเพื่อ high availability และ automatic failover
- Automated backups: การสำรองข้อมูลอัตโนมัติของ RDS ที่รองรับ point-in-time recovery
- Manual snapshots: การสำรองข้อมูลด้วยตนเองที่เก็บได้นานกว่า automated backups
- Point-in-time recovery: การกู้คืนฐานข้อมูล ณ จุดเวลาที่ระบุ
