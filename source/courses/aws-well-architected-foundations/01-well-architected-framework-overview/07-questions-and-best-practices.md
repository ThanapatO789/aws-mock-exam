# Questions and best practices

## โครงสร้างคำถามใน framework
สไลด์อธิบายโครงสร้างของแต่ละคำถามใน framework ว่าประกอบด้วย 3 ส่วน: **Question text**, **Question context**, **Best practices**

ตัวอย่างที่แสดงในสไลด์คือคำถาม **SEC 8** จาก Security pillar:

> **SEC 8: How do you protect your data at rest?**
>
> Protect your data at rest by implementing multiple controls, to reduce the risk of unauthorized access or mishandling.
> (ปกป้องข้อมูลที่จัดเก็บอยู่ (data at rest) ด้วยการใช้มาตรการควบคุมหลายชั้น เพื่อลดความเสี่ยงจากการเข้าถึงหรือจัดการข้อมูลโดยไม่ได้รับอนุญาต)

**Best practices:**
- **Implement secure key management** (ใช้การจัดการคีย์อย่างปลอดภัย): กุญแจเข้ารหัส (encryption keys) ต้องถูกจัดเก็บอย่างปลอดภัย มีการควบคุมการเข้าถึงอย่างเข้มงวด เช่น ใช้บริการจัดการคีย์อย่าง **AWS KMS** และควรพิจารณาใช้คีย์และการควบคุมการเข้าถึงที่แตกต่างกันให้สอดคล้องกับระดับการจัดประเภทข้อมูล (data classification) และข้อกำหนดการแบ่งแยก (segregation) ร่วมกับ IAM และ resource policies
- **Enforce encryption at rest** (บังคับใช้การเข้ารหัสข้อมูลที่จัดเก็บ): บังคับใช้ข้อกำหนดการเข้ารหัสตามมาตรฐานและคำแนะนำล่าสุด เพื่อช่วยปกป้องข้อมูลที่จัดเก็บอยู่
- **Automate data at rest protection** (ใช้ automation ป้องกันข้อมูลที่จัดเก็บ): ใช้เครื่องมืออัตโนมัติตรวจสอบและบังคับใช้การป้องกันข้อมูลที่จัดเก็บอย่างต่อเนื่อง เช่น ตรวจสอบว่ามีเฉพาะ storage resource ที่เข้ารหัสแล้วเท่านั้น

## หมายเหตุการอ่านเนื้อหา
เนื้อหาตัวอย่าง SEC 8 นี้ปรากฏบนสไลด์แบบ canvas-rendered และ**ไม่ปรากฏใน DOM/accessibility text เลย** — ต้องอ่านจากภาพหน้าจอ (screenshot) เท่านั้น เป็นตัวอย่างของข้อจำกัดสำคัญของ Storyline renderer นี้ (ดูรายละเอียดในรายงาน)

## Key terms
- Data at rest: ข้อมูลที่จัดเก็บอยู่ (ไม่ได้ถูกส่งผ่านเครือข่าย) เช่น ข้อมูลใน S3, EBS, RDS
- AWS KMS (Key Management Service): บริการจัดการคีย์เข้ารหัสของ AWS
- SEC 8: รหัสคำถามใน Security pillar ของ Well-Architected Framework เกี่ยวกับการปกป้องข้อมูลที่จัดเก็บอยู่
