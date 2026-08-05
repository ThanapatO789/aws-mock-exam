# Choosing the Right Storage Service

บทเรียนนี้สรุปเปรียบเทียบบริการ storage หลักของ AWS ทั้งหมด เพื่อช่วยเลือกบริการที่เหมาะสมกับ workload

## Amazon EC2 instance store

Instance store คือ **ephemeral block storage** เป็น storage ที่ตั้งค่ามาล่วงหน้าและอยู่บน physical server เดียวกับที่ host EC2 instance ไม่สามารถถอด (detach) ออกจาก Amazon EC2 ได้ — เปรียบเสมือน built-in drive ของ EC2 instance นั้น

Instance store เหมาะสำหรับเก็บข้อมูลชั่วคราวที่เปลี่ยนแปลงตลอดเวลา เช่น buffer, cache, scratch data ไม่เหมาะสำหรับข้อมูลที่ต้อง persistent หรืออยู่ระยะยาว หากต้องการ block storage ระยะยาวที่ persistent และถอดออกจาก Amazon EC2 ได้ พร้อมความยืดหยุ่นในการจัดการ (เช่น เพิ่มขนาด volume หรือสร้าง snapshot) ควรใช้ **Amazon EBS** แทน

## Amazon EBS

Amazon EBS เหมาะกับข้อมูลที่เปลี่ยนแปลงบ่อยและต้อง persist ผ่านการ stop, terminate หรือ hardware failure ของ instance มี volume 2 ประเภท: **SSD-backed volumes** และ **HDD-backed volumes**

- **SSD-backed volumes** — performance ขึ้นกับ IOPS เหมาะสำหรับ transactional workload เช่น database และ boot volume
- **HDD-backed volumes** — performance ขึ้นกับ megabytes per second (MBps) เหมาะสำหรับ throughput-intensive workload เช่น big data, data warehouse, log processing, sequential data I/O

คุณสมบัติสำคัญของ Amazon EBS เมื่อเทียบกับบริการอื่น:
- เป็น block storage
- จ่ายตามที่ provision ไว้ล่วงหน้า (ต้อง provision storage ล่วงหน้า)
- EBS volume ถูก replicate ข้ามหลาย server ภายใน Availability Zone เดียว
- EBS volume ส่วนใหญ่ attach ได้กับ EC2 instance เดียวในเวลาเดียวกันเท่านั้น

## Amazon S3

หากข้อมูลไม่เปลี่ยนแปลงบ่อย Amazon S3 อาจเป็น storage solution ที่คุ้มค่าและขยายตัวได้ดี เหมาะสำหรับเก็บ static web content, media, backup/archive และข้อมูลสำหรับ analytics รวมถึง host เว็บไซต์แบบ static ทั้งหมดพร้อม custom domain name ได้

คุณสมบัติสำคัญของ Amazon S3 เมื่อเทียบกับบริการอื่น:
- เป็น object storage
- จ่ายตามที่ใช้จริง (ไม่ต้อง provision storage ล่วงหน้า)
- Amazon S3 replicate object ข้ามหลาย Availability Zone ภายใน Region
- Amazon S3 ไม่ใช่ storage ที่ attach กับ compute

## Amazon EFS

Amazon EFS ให้ file storage ที่ optimize สำหรับ workload และ application หลากหลายรูปแบบ เป็น cloud-native shared file system เดียวที่มี fully automatic lifecycle management สามารถขยายจาก gigabyte ไปจนถึง petabyte โดยอัตโนมัติโดยไม่ต้อง provision storage เอง compute instance หลักสิบ หลักร้อย หรือหลักพัน สามารถเข้าถึง Amazon EFS file system เดียวกันพร้อมกันได้

- **EFS Standard storage class** เหมาะกับ workload ที่ต้องการ durability และ availability สูงสุด
- **EFS One Zone storage class** เหมาะกับ workload เช่น development, build, staging environment

คุณสมบัติสำคัญของ Amazon EFS เมื่อเทียบกับบริการอื่น:
- เป็น file storage
- Amazon EFS มีความยืดหยุ่น (elastic) ขยาย/หดขนาดอัตโนมัติตามการเพิ่ม/ลบไฟล์ จ่ายเฉพาะเท่าที่ใช้
- Amazon EFS มี high availability และออกแบบให้ durable สูง ไฟล์และ directory ถูกเก็บซ้ำ (redundant) ทั้งภายในและข้าม Availability Zone
- Amazon EFS มี native lifecycle management ของไฟล์ และมี storage class ให้เลือกหลายแบบ

## Amazon FSx

Amazon FSx ให้ความเข้ากันได้แบบ native กับ third-party file system โดยเลือกได้จาก NetApp ONTAP, OpenZFS, Windows File Server และ Lustre ไม่ต้องกังวลเรื่องการจัดการ file server และ storage เอง เพราะ Amazon FSx automate งาน administrative ที่กินเวลา เช่น hardware provisioning, software configuration, patching และ backup ทำให้มีเวลาโฟกัสกับ application, end user และธุรกิจมากขึ้น

Amazon FSx file system มี feature set, performance profile และ data management capability ที่รองรับ use case และ workload หลากหลาย เช่น machine learning, analytics, high performance computing (HPC) application, media and entertainment

| File System | รายละเอียด |
|---|---|
| Amazon FSx for NetApp ONTAP | Fully managed shared storage สร้างบน NetApp ONTAP file system ยอดนิยม |
| Amazon FSx for OpenZFS | Fully managed shared storage สร้างบน OpenZFS file system ยอดนิยม |
| Amazon FSx for Windows File Server | Fully managed shared storage สร้างบน Windows Server |
| Amazon FSx for Lustre | Fully managed shared storage สร้างบน high-performance file system ที่ได้รับความนิยมมากที่สุดในโลก |

## Key terms
- Instance store: ephemeral block storage ผูกกับ physical server ของ EC2 instance ไม่สามารถ detach ได้
- Amazon EBS: persistent block storage ที่ detach/attach กับ EC2 instance ได้ จ่ายตาม provision
- Amazon S3: object storage คุ้มค่า จ่ายตามการใช้งานจริง ไม่ผูกกับ compute
- Amazon EFS: managed shared file storage ที่ scale อัตโนมัติ ใช้ร่วมกันได้จากหลาย compute instance
- Amazon FSx: managed service สำหรับ third-party file system (ONTAP, OpenZFS, Windows File Server, Lustre)
