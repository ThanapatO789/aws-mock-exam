# Choosing the Right Database Service

เลือกบริการฐานข้อมูลที่เหมาะสมที่สุดกับงาน เพื่อช่วยให้ออกแบบแอปพลิเคชันได้อย่างเหมาะสมทั้งด้าน scale, ประสิทธิภาพ, และค่าใช้จ่าย

## ภาพรวมพอร์ตโฟลิโอฐานข้อมูลของ AWS
ตารางสรุปบริการฐานข้อมูลของ AWS ตามประเภทและ use case:

| AWS Service(s) | Database Type | Use Cases |
|---|---|---|
| Amazon RDS, Aurora, Amazon Redshift | Relational | แอปพลิเคชันแบบดั้งเดิม, ERP, CRM, ecommerce |
| DynamoDB | Key-value | เว็บแอปที่มี traffic สูง, ระบบ ecommerce, แอปเกม |
| Amazon ElastiCache for Memcached, Amazon ElastiCache for Redis | In-memory | Caching, session management, gaming leaderboard, geospatial application |
| Amazon DocumentDB | Document | Content management, catalog, user profile |
| Amazon Keyspaces | Wide column | แอปพลิเคชันอุตสาหกรรมระดับ high-scale เช่น equipment maintenance, fleet management, route optimization |
| Neptune | Graph | Fraud detection, social networking, recommendation engine |
| Timestream | Time series | แอป IoT, DevOps, industrial telemetry |
| Amazon Aurora PostgreSQL | Relational | งาน audit และ compliance, financial services, healthcare records, regulatory reporting |

## การแยกแอปพลิเคชันและฐานข้อมูลออกจากกัน (Breaking up applications and databases)
วงการเทคโนโลยีเปลี่ยนไป แอปพลิเคชันและฐานข้อมูลก็เปลี่ยนตาม ปัจจุบันแอปพลิเคชันขนาดใหญ่ไม่ได้ใช้ฐานข้อมูลเดียวรองรับทั้งหมดอีกต่อไป แต่ถูกแบ่งเป็นบริการย่อย (microservices) ที่แต่ละบริการมีฐานข้อมูลแบบ purpose-built ของตัวเอง แนวคิดนี้เปลี่ยนจาก "ฐานข้อมูลเดียวใช้ได้กับทุกอย่าง" (one-size-fits-all) ไปเป็นกลยุทธ์ฐานข้อมูลแบบผสมผสาน (complimentary database strategy) ทำให้แต่ละฐานข้อมูลได้รับ functionality, performance และ scale ที่เหมาะสมกับ workload ของตนเองมากที่สุด

## Key terms
- Amazon Redshift: บริการ data warehouse เชิงสัมพันธ์ของ AWS ที่เหมาะกับงานวิเคราะห์ข้อมูลขนาดใหญ่
- Complimentary database strategy: กลยุทธ์ใช้ฐานข้อมูลหลายประเภทร่วมกัน แต่ละตัวรองรับ microservice ของตัวเอง แทนการใช้ฐานข้อมูลเดียวสำหรับทุกงาน
- Purpose-built database: ฐานข้อมูลที่ออกแบบมาเฉพาะสำหรับ use case หนึ่ง ๆ
