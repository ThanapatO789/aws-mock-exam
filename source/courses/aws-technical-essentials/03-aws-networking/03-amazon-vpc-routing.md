# Amazon VPC Routing

**Route table** ประกอบด้วยชุดของกฎ (rules) ที่เรียกว่า **routes** ซึ่งกำหนดว่าการจราจรของเครือข่าย (network traffic) จาก subnet หรือ gateway ของเราจะถูกส่งไปที่ไหน

## Main route table

เมื่อสร้าง VPC ขึ้นมา AWS จะสร้าง route table ให้อัตโนมัติเรียกว่า **main route table** ซึ่งประกอบด้วยชุดของ routes ที่ใช้กำหนดทิศทางการจราจรของเครือข่าย AWS ตั้งสมมติฐานว่าเมื่อสร้าง VPC พร้อม subnet ใหม่ ผู้ใช้ต้องการให้ traffic ไหลระหว่าง subnet เหล่านั้นได้ ดังนั้น ค่าเริ่มต้น (default) ของ main route table คือ อนุญาตให้ traffic ไหลระหว่างทุก subnet ใน local network

กฎของ main route table:
- ไม่สามารถลบ (delete) main route table ได้
- ไม่สามารถตั้งค่า gateway route table ให้เป็น main route table ได้
- สามารถแทนที่ (replace) main route table ด้วย custom subnet route table ได้
- สามารถเพิ่ม ลบ และแก้ไข route ใน main route table ได้
- สามารถ associate subnet กับ main route table ได้ แม้ subnet นั้นจะ associate อยู่แล้วโดยปริยาย (implicitly)

## Custom route tables

main route table จะถูกใช้โดยปริยาย (implicitly) สำหรับ subnet ที่ไม่มีการ associate route table แบบชัดเจน (explicit) อย่างไรก็ตาม บางครั้งเราอาจต้องการกำหนด route ที่แตกต่างกันในแต่ละ subnet เพื่อให้ traffic เข้าถึง resource ภายนอก VPC ได้ต่างกัน ตัวอย่างเช่น แอปพลิเคชันอาจประกอบด้วยส่วน frontend และ database เราสามารถสร้าง subnet แยกกันสำหรับแต่ละ resource และกำหนด route ที่แตกต่างกันให้แต่ละ subnet ได้

หาก associate subnet กับ **custom route table** subnet นั้นจะใช้ custom route table แทน main route table แต่ละ custom route table ที่สร้างขึ้นจะมี **local route** อยู่ในนั้นอยู่แล้วโดยอัตโนมัติ ซึ่งช่วยให้การสื่อสารไหลระหว่างทุก resource และ subnet ภายใน VPC ได้ เราสามารถปกป้อง VPC ได้โดยการ associate แต่ละ subnet ใหม่กับ custom route table อย่างชัดเจน (explicit) และปล่อยให้ main route table อยู่ในสถานะ default เดิม

## Key terms
- Route table: ชุดของกฎ (routes) ที่กำหนดทิศทางการจราจรของเครือข่ายจาก subnet หรือ gateway
- Main route table: route table เริ่มต้นที่ AWS สร้างให้อัตโนมัติเมื่อสร้าง VPC อนุญาตให้ traffic ไหลระหว่างทุก subnet ใน local network โดยค่าเริ่มต้น
- Custom route table: route table ที่สร้างขึ้นเองเพื่อกำหนด route เฉพาะให้ subnet บางตัว แทนการใช้ main route table
- Local route: route ที่มีอยู่ใน custom route table ทุกตัวโดยอัตโนมัติ ช่วยให้สื่อสารกันได้ภายใน VPC
- Implicit association: การที่ subnet ใช้ main route table โดยปริยายเมื่อไม่มีการ associate route table อื่นอย่างชัดเจน
