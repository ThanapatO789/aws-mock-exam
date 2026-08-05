# Module 5 Knowledge Check

แบบทดสอบท้ายโมดูล 5 มีทั้งหมด 2 ข้อ (ยืนยันคำตอบที่ถูกต้องจากการตอบและ submit จริงในบทเรียน)

## คำถามที่ 1
**คำถาม (แปล)**: ด้วย Amazon RDS คุณสามารถ scale ส่วนประกอบ (components) ของบริการได้ สิ่งนี้หมายความว่าอย่างไร?

ตัวเลือก (ภาษาอังกฤษต้นฉบับ):
- For major database (DB) updates, you can activate automatic version upgrades.
- You can upgrade your DB instance at any time.
- **You can increase or decrease specific database configurations independently.** ✅ (คำตอบที่ถูกต้อง)
- Amazon RDS components are coupled. When you modify any component, such as storage, memory, or processor size, all other components are also modified.

**คำอธิบาย**: การ scale ส่วนประกอบของบริการหมายถึงคุณสามารถปรับเปลี่ยน memory, processor size, allocated storage หรือ IOPS ได้อย่างอิสระทีละส่วน โดยไม่ต้องแก้ไขการตั้งค่าอื่น ๆ ของฐานข้อมูล

## คำถามที่ 2
**คำถาม (แปล)**: องค์กรหนึ่งต้องการบริการฐานข้อมูลแบบ fully managed เพื่อสร้างแอปพลิเคชันที่ต้องการ concurrency และการเชื่อมต่อสูงสำหรับผู้ใช้หลายล้านคนและ request หลายล้านครั้งต่อวินาที องค์กรควรใช้บริการฐานข้อมูล AWS ใด?

ตัวเลือก (ภาษาอังกฤษต้นฉบับ):
- Amazon Redshift
- Amazon RDS
- **Amazon DynamoDB** ✅ (คำตอบที่ถูกต้อง)
- Amazon Aurora

**คำอธิบาย**: ด้วย Amazon DynamoDB คุณสามารถสร้างแอปพลิเคชันระดับ internet-scale ที่รองรับ user-content metadata และ cache ที่ต้องการ concurrency และการเชื่อมต่อสูงสำหรับผู้ใช้หลายล้านคนและ request หลายล้านครั้งต่อวินาที
