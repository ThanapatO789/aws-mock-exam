# AWS Outposts

**AWS Outposts** ใช้เพื่อรองรับบริการที่ทำงาน on premises เพื่อตอบสนองข้อกำหนดด้าน latency และ residency บทเรียนนี้สอนวิธีใช้ AWS Outposts

AWS Outposts เป็น fully managed service ที่ขยาย AWS infrastructure, บริการ, API และเครื่องมือ ไปยังสถานที่ของลูกค้า (customer premises) ด้วยการให้เข้าถึง AWS managed infrastructure ในพื้นที่ ลูกค้าสามารถใช้ AWS Outposts เพื่อสร้างและรันแอปพลิเคชันแบบ on premises โดยใช้ programming interface เดียวกับที่ใช้ใน AWS Regions ในขณะที่ใช้ compute และ storage ในพื้นที่เพื่อ latency ต่ำและตอบสนองความต้องการประมวลผลข้อมูลในพื้นที่

## AWS resources on Outposts

Outpost คือกลุ่ม (pool) ของ AWS compute และ storage capacity ที่ติดตั้งอยู่ที่สถานที่ของลูกค้า AWS เป็นผู้ดำเนินการ ตรวจสอบ และจัดการ capacity นี้ในฐานะส่วนหนึ่งของ AWS Region สามารถสร้าง subnet บน Outpost และระบุ subnet เหล่านั้นเมื่อสร้างทรัพยากร AWS เช่น EC2 instance, EBS volume, ECS cluster และ RDS instance instance ใน Outpost subnet จะสื่อสารกับ instance อื่นใน AWS Region โดยใช้ private IP address ทั้งหมดอยู่ภายใน VPC เดียวกัน

หลังจากนี้ ผู้สอนมี tech talk พูดคุยเรื่องการเลือกใช้ edge service

## Key terms
- AWS Outposts: บริการ fully managed ที่นำ AWS infrastructure/services/API มาติดตั้งที่สถานที่ของลูกค้า (on premises)
- Outpost: pool ของ compute/storage capacity ที่ติดตั้งที่ site ลูกค้า จัดการโดย AWS เป็นส่วนหนึ่งของ AWS Region
