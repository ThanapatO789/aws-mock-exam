# Overview

โมดูลนี้ต่อยอดจากแนวคิด networking ในโมดูลก่อนหน้า (Module 3: Networking-1) โดยเจาะลึกเรื่องการเชื่อมต่อหลายเครือข่ายเข้าด้วยกัน และการเชื่อมต่อกับ hybrid environment (on-premises + cloud)

ในโมดูลนี้จะได้เรียนรู้:

- การใช้ **VPC endpoints** เพื่อปกป้อง traffic ที่เข้า-ออกจาก AWS services
- การใช้ **VPC peering** เพื่อ route traffic แบบ private ระหว่าง VPC
- วิธีเชื่อมต่อเครือข่าย on-premises เข้ากับ AWS Cloud
- การใช้ **AWS Transit Gateway** เพื่อลดจำนวน route table ที่ต้องจัดการ

มีวิดีโอแนะนำโมดูลความยาว 1 นาที 3 วินาที

## Key terms
- VPC endpoint: ช่องทางเชื่อมต่อ VPC กับ AWS service โดยไม่ผ่านอินเทอร์เน็ตสาธารณะ
- VPC peering: การเชื่อมต่อแบบ private ระหว่างสอง VPC
- Hybrid networking: การเชื่อมต่อเครือข่าย on-premises กับ AWS Cloud
- AWS Transit Gateway: hub กลางสำหรับเชื่อมต่อหลายเครือข่ายเข้าด้วยกัน
