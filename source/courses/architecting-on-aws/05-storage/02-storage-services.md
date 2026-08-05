# Storage Services

บทเรียนนี้พูดถึงบริการที่ควรพิจารณาเมื่อมองหา block, file และ object storage

## ภาพรวมของ cloud storage

Block, object และ file storage เป็นวิธีการจัดเก็บข้อมูล 3 รูปแบบที่แตกต่างกัน เหมาะกับ use case ที่ต่างกัน:

- **Block storage** เช่น **AWS EBS** — แบ่งข้อมูลเป็น block ขนาดคงที่ เหมาะสำหรับ operating system และฐานข้อมูลที่ต้องการ latency ต่ำและมีการอัปเดตข้อมูลบ่อย เพราะสามารถจัดการ block แต่ละอันได้โดยตรง
- **Object storage** เช่น **AWS S3** — มองข้อมูลเป็น object แยกชิ้น พร้อม metadata และ unique identifier เหมาะสำหรับข้อมูลแบบ unstructured ขนาดใหญ่ เช่น media files, backups และ static web content โดยมีความสามารถด้าน scalability และ durability ที่ดีเยี่ยม
- **File storage** เช่น **AWS EFS** — จัดเก็บข้อมูลในโครงสร้างโฟลเดอร์แบบลำดับชั้น (hierarchical) ที่คุ้นเคย ให้การเข้าถึงไฟล์ร่วมกัน (shared access) จากหลาย instance หรือแอปพลิเคชัน เหมาะสำหรับ content management systems, web serving และ development environments ที่ต้องการการเข้าถึงไฟล์แบบ traditional file system

บทเรียนถัดไปจะเจาะลึกเรื่อง Amazon S3

## Key terms
- AWS EBS (Elastic Block Store): บริการ block storage ของ AWS
- AWS S3 (Simple Storage Service): บริการ object storage ของ AWS
- AWS EFS (Elastic File System): บริการ file storage ของ AWS
