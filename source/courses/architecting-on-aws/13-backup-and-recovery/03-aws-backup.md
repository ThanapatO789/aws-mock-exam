# AWS Backup

**AWS Backup** เป็นบริการที่คุณสามารถใช้เพื่อรวมศูนย์ (centralize) และทำ automate กลยุทธ์การ backup ของคุณ บทเรียนนี้สอนวิธีใช้งาน AWS Backup มีวิดีโอผู้สอนความยาว 2:47 นาที ประกอบเนื้อหา

AWS Backup เป็นบริการ backup แบบ fully managed ที่ช่วยรวมศูนย์และทำ automate การ backup ข้อมูลข้าม AWS services ต่าง ๆ นอกจากนี้ยังช่วยให้ลูกค้าปฏิบัติตามข้อกำหนดด้าน regulatory compliance และบรรลุเป้าหมายด้าน business continuity

AWS Backup ทำงานร่วมกับ **AWS Organizations** โดย deploy data protection policies แบบรวมศูนย์เพื่อ configure, manage และ govern กิจกรรมการ backup ของคุณ ทำงานได้ข้าม AWS accounts และ resources ซึ่งรวมถึง **Amazon EC2** instances และ **Amazon EBS** volumes คุณสามารถ backup ฐานข้อมูลต่าง ๆ เช่น **DynamoDB** tables, **Amazon DocumentDB** databases, **Amazon Neptune** graph databases และ **Amazon RDS** databases (รวมถึง Aurora database clusters) นอกจากนี้ยัง backup **Amazon EFS**, **Amazon S3**, Storage Gateway volumes และทุกเวอร์ชันของ **Amazon FSx** (รวมถึง FSx for Lustre และ FSx for Windows File Server) ได้ด้วย

## Benefits of AWS Backup

เนื้อหาส่วนนี้อธิบายผ่าน 3 หมวดหมู่ที่ต้องคลิกขยาย (accordion):

### Simplicity
AWS Backup ช่วยลดความซับซ้อนของแผน backup ต่างจากเครื่องมืออื่น AWS Backup ไม่จำเป็นต้องเขียน custom backup scripts และยังมีศูนย์กลางเดียวสำหรับจัดการและมอนิเตอร์การ backup แผน AWS Backup คือชุดของกฎ (rules) ที่กำหนดการ backup ของคุณ กฎเหล่านี้รวมถึงเวลาที่เริ่ม backup, ระยะเวลาของ backup window และ retention period หนึ่งในความสามารถหลักของ AWS Backup คือการใช้ tags เพื่อกำหนดว่าจะ backup ทรัพยากรใดที่ต้องการปกป้อง

### Compliance
คุณสามารถบังคับใช้ backup policies, เข้ารหัส (encrypt) backups ของคุณ, ป้องกัน backups จากการลบด้วยมือ (manual deletion) และป้องกันการเปลี่ยนแปลงการตั้งค่า backup lifecycle คุณสามารถใช้ consolidated backup activity logs ข้าม AWS services เพื่อทำ compliance audits ได้ AWS Backup อยู่ในขอบเขตของมาตรฐาน Payment Card Industry (PCI) และ International Organization for Standardization (ISO) และมีสิทธิ์ตามกฎหมาย U.S. Health Insurance Portability and Accountability Act (HIPAA)

### Control costs
AWS Backup ช่วยลดความเสี่ยงของ downtime ซึ่งอาจส่งผลกระทบทางลบต่อธุรกิจของคุณ นอกจากนี้ยังช่วยลดต้นทุนการดำเนินงาน (operating costs) โดยลดเวลาที่ใช้กับการตั้งค่าด้วยมือ และทำ automate การ backup

## How does AWS Backup work?

คุณดำเนินการตามกลยุทธ์ backup ของคุณด้วย AWS Backup โดยการสร้าง AWS Backup plans ซึ่งมี 3 ขั้นตอน:

### Step 1: Create AWS Backup plan
เมื่อสร้าง backup plan คุณจะระบุสิ่งต่อไปนี้:
- **Schedule** – กำหนดความถี่ของการ backup และช่วงเวลาที่จะทำการ backup
- **Lifecycle** – กำหนดเวลาที่ backup จะถูกย้ายไปยัง cold storage และเวลาที่ backup จะหมดอายุ
- **Vault** – AWS Backup เก็บ backups ไว้ใน AWS Backup Vault คุณระบุว่า backup plan ของคุณจะใช้ vault ใด เมื่อสร้าง backup vault คุณจะกำหนด AWS Key Management Service (AWS KMS) encryption key เพื่อเข้ารหัส backups ที่ไม่มีวิธีเข้ารหัสของตัวเอง
- **Tags for backup** – คุณระบุ tags ที่จะถูกกำหนดให้กับ backups ที่สร้างโดย plan นี้

### Step 2: Assign resources
คุณกำหนดทรัพยากรที่จะ backup ด้วย backup plan ของคุณ พร้อมทั้งกำหนด AWS Identity and Access Management (IAM) role ที่ AWS Backup จะใช้เพื่อเข้าถึงทรัพยากรเหล่านั้น คุณสามารถกำหนดทรัพยากรได้ 2 วิธี:
- **Assign tags** – ให้ค่า tag และทรัพยากร AWS ทั้งหมดที่มี tag นั้นจะถูก backup ด้วย plan นี้
- **Resource IDs** – ใช้ Resource IDs สำหรับทรัพยากรเฉพาะ เช่น DynamoDB table หรือ Amazon EBS volume เจาะจง

### Step 3: Manage and monitor backups
AWS Backup ทำงานร่วมกับ AWS services อื่น ๆ เพื่อมอนิเตอร์ workloads เช่น **Amazon CloudWatch**, **Amazon EventBridge**, **AWS CloudTrail** และ **Amazon Simple Notification Service**

**สรุป:** AWS Backup ทำงานร่วมกับ AWS Organizations เพื่อจัดการ backup policies ข้าม AWS accounts

เมื่อเข้าใจตัวเลือกสำหรับกลยุทธ์ backup แล้ว คุณก็พร้อมเริ่มกำหนดกลยุทธ์ backup สำหรับแอปพลิเคชันของคุณโดยใช้ AWS Backup ในบทเรียนถัดไป คุณจะได้เรียนรู้วิธี implement กลยุทธ์การกู้คืน (recovery strategies)

## Key terms
- AWS Backup: บริการ backup แบบ fully managed ที่รวมศูนย์และ automate การ backup ข้าม AWS services
- AWS Organizations: บริการสำหรับจัดการหลาย AWS accounts แบบรวมศูนย์
- Backup vault: ที่เก็บ backups ของ AWS Backup ซึ่งสามารถกำหนด encryption key ได้
- Backup plan: ชุดกฎที่กำหนด schedule, lifecycle, vault และ tags สำหรับการ backup
