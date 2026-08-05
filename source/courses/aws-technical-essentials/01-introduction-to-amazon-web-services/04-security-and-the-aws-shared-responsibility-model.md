# Security and the AWS Shared Responsibility Model

ความปลอดภัยและ compliance เป็นความรับผิดชอบร่วมกัน (shared responsibility) ระหว่าง AWS และผู้ใช้งาน AWS เรียกแนวคิดนี้ว่า **shared responsibility model** ซึ่งแบ่งความรับผิดชอบออกเป็น "security **of** the cloud" (AWS รับผิดชอบ) กับ "security **in** the cloud" (ลูกค้ารับผิดชอบ)

## ความรับผิดชอบของ AWS (AWS responsibility)
AWS รับผิดชอบ **security of the cloud** หมายถึงการปกป้องและรักษาความปลอดภัยของ infrastructure ที่รัน service ต่างๆ บน AWS Cloud โดย AWS รับผิดชอบเรื่องต่อไปนี้:
- ปกป้องและรักษาความปลอดภัยของ AWS Regions, Availability Zones, และ data center ไปจนถึงความปลอดภัยทางกายภาพของอาคาร
- จัดการฮาร์ดแวร์, ซอฟต์แวร์, และส่วนประกอบเครือข่ายที่รัน AWS services เช่น เซิร์ฟเวอร์จริง, host operating system, virtualization layer, และส่วนประกอบเครือข่ายของ AWS

ระดับความรับผิดชอบของ AWS ขึ้นอยู่กับประเภทของ service ซึ่ง AWS แบ่ง service ออกเป็น 2 หมวดหมู่:

| Category | ตัวอย่าง AWS service | AWS Responsibility |
|---|---|---|
| **Infrastructure services** | Compute service เช่น Amazon EC2 | AWS จัดการ underlying infrastructure และ foundation services |
| **Abstracted services** | Service ที่ต้องการการจัดการจากลูกค้าน้อยมาก เช่น Amazon Simple Storage Service (Amazon S3) | AWS ดูแล infrastructure layer, operating system, และ platform รวมถึง server-side encryption และการปกป้องข้อมูล |

## ความรับผิดชอบของลูกค้า (Customer responsibility)
ลูกค้ารับผิดชอบ **security in the cloud** เมื่อใช้งาน AWS service ใดก็ตาม ลูกค้าต้องรับผิดชอบการตั้งค่า service และแอปพลิเคชันของตนให้ถูกต้อง รวมถึงต้องมั่นใจว่าข้อมูลของตนปลอดภัย

ระดับความรับผิดชอบของลูกค้าขึ้นอยู่กับ service ที่ใช้ บาง service ต้องการให้ลูกค้าทำงาน configuration และ management ด้านความปลอดภัยทั้งหมดเอง ในขณะที่ service ที่ abstracted มากกว่าต้องการเพียงให้ลูกค้าจัดการข้อมูลและควบคุมการเข้าถึงทรัพยากรเท่านั้น จากการแบ่ง 2 หมวดหมู่ของ AWS service ลูกค้าสามารถกำหนดระดับความรับผิดชอบของตนต่อแต่ละ service ได้

ลูกค้าต้องพิจารณาว่าใช้ AWS service ใดบ้าง และทบทวนระดับความรับผิดชอบที่ต้องมีเพื่อรักษาความปลอดภัยแต่ละ service รวมถึงต้องทบทวนว่า shared responsibility model สอดคล้องกับมาตรฐานความปลอดภัยขององค์กร รวมถึงกฎหมายและข้อบังคับที่เกี่ยวข้องหรือไม่

แนวคิดสำคัญคือ ลูกค้ามีการควบคุมข้อมูลของตนอย่างสมบูรณ์และรับผิดชอบการจัดการความปลอดภัยที่เกี่ยวข้องกับเนื้อหาของตน ตัวอย่างเช่น ลูกค้ารับผิดชอบเรื่องต่อไปนี้:
- เลือก Region สำหรับทรัพยากร AWS ให้สอดคล้องกับกฎระเบียบด้าน data sovereignty
- ติดตั้งกลไกป้องกันข้อมูล เช่น encryption และการสำรองข้อมูลตามกำหนดเวลา
- ใช้ access control เพื่อจำกัดว่าใครสามารถเข้าถึงข้อมูลและทรัพยากร AWS ของตนได้

## Key terms
- Shared responsibility model: โมเดลที่แบ่งความรับผิดชอบด้านความปลอดภัยระหว่าง AWS (security of the cloud) และลูกค้า (security in the cloud)
- Infrastructure services: หมวด AWS service ที่ AWS จัดการเฉพาะ underlying infrastructure เช่น Amazon EC2
- Abstracted services: หมวด AWS service ที่ AWS ดูแลตั้งแต่ infrastructure จนถึง operating system และ platform เช่น Amazon S3
- Data sovereignty: ข้อกำหนดที่ระบุว่าข้อมูลต้องถูกเก็บไว้ในอาณาเขตทางภูมิศาสตร์ที่กำหนด
