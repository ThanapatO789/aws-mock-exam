# AWS Well-Architected Tool content / custom lenses

## AWS Well-Architected Tool content (1.13)
เจาะลึกว่าคำถาม (question) หนึ่งข้อใน tool มีหน้าตาอย่างไร:

- ด้านบนของคำถามจะแสดง **pillar** และ **หมายเลขคำถาม** พร้อมตัวคำถามเอง
- แต่ละคำถามมี **key concept** ที่เกี่ยวข้อง เช่น ตัวอย่างคำถาม Cost 6 เกี่ยวข้องกับแนวคิด **Rightsizing**
- แต่ละ concept ถูกออกแบบมาเพื่อช่วยให้เข้าใจวิธี implement **design principle** ของ pillar นั้น ๆ เช่น concept ของ rightsizing ช่วย implement design principle "**Adopt a consumption model**"
- ใต้คำถามและคำอธิบายจะมีรายการ checkbox แสดง **best practices** ที่เกี่ยวข้องกับการบรรลุ key concept นั้น
- ใน detail bar ด้านซ้ายของหน้าจอ สามารถดูคำอธิบายเพิ่มเติมของแต่ละ best practice และเข้าถึง helpful resources เพื่อเรียนรู้วิธี implement best practices ในคำถามนั้นได้

## AWS Well-Architected Tool custom lenses (1.14)
นอกจากวัดผล workload เทียบกับ framework และ AWS lenses แล้ว ผู้ใช้สามารถสร้าง **custom lens** ของตัวเองได้:

- custom lens ประกอบด้วย pillars, questions, answer choices, helpful resources และ improvement plans
- สามารถกำหนดกฎ (rules) ว่าตัวเลือกใดที่ถ้าไม่ทำตามจะถือเป็นความเสี่ยงระดับสูง (high risk) หรือปานกลาง (medium risk) และให้คำแนะนำของตัวเองในการแก้ไข
- ช่วยให้แชร์ lens นี้ข้าม account ในองค์กร และวัดผล workload ได้อย่างสอดคล้องกัน
- วิธีสร้าง: ดาวน์โหลด **JSON template** พื้นฐาน จากนั้นอัปโหลด (upload) lens ที่กำหนดเอง แล้วนำไปใช้กับการ review workload ได้เหมือนใช้ AWS lens ทั่วไป — ข้อมูลเป็น JSON formatted, user-defined data
- ลูกค้าที่ถูกแชร์ lens สามารถ review workload ด้วยชุดคำถามที่กำหนดเองนี้ได้เหมือน review ด้วย framework หรือ AWS content ทั่วไป
- สามารถแชร์ custom lens กับ AWS account อื่น, solutions architect หรือ partner resource ได้เช่นกัน
- ลิงก์อ้างอิง: AWS Well-Architected Tool — Custom lenses User Guide, custom lens documentation (เข้าถึงได้ผ่าน AWS Well-Architected Tool console)

## Key terms
- Key concept: แนวคิดหลักที่คำถามแต่ละข้อมุ่งเน้น
- Design principle: หลักการออกแบบของแต่ละ pillar
- Custom lens: ชุดคำถาม/best practices ที่ผู้ใช้กำหนดเอง เป็น JSON template
