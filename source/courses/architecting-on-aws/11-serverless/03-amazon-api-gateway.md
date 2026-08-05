# Amazon API Gateway

บทเรียนนี้อธิบายวิธีใช้ **Amazon API Gateway** เพื่อสร้าง เผยแพร่ ดูแลรักษา และตรวจสอบ (monitor) API อย่างปลอดภัย

**Amazon API Gateway** เป็นบริการของ AWS สำหรับสร้าง เผยแพร่ ดูแลรักษา ตรวจสอบ และรักษาความปลอดภัยของ REST, HTTP และ WebSocket API ได้ในทุกระดับ scale

ด้วย API Gateway คุณสามารถเชื่อมต่อแอปพลิเคชันของคุณเข้ากับบริการของ AWS และเว็บไซต์สาธารณะหรือส่วนตัวอื่น ๆ ได้ โดยมันให้ RESTful และ HTTP API ที่สอดคล้องกันสำหรับแอปพลิเคชัน mobile และ web เพื่อเข้าถึงบริการของ AWS และ resource อื่น ๆ ที่ hosted อยู่นอก AWS

ในฐานะ gateway มันจัดการงานทั้งหมดที่เกี่ยวข้องกับการรับและประมวลผล API call พร้อมกันได้หลายแสนครั้ง งานเหล่านี้รวมถึง traffic management, authorization และ access control, monitoring และ API version management

ตัวอย่าง: client browser ร้องขอ static webpage ที่ host อยู่บน **Amazon S3** จากนั้น client browser สื่อสารกับ API Gateway ผ่าน REST API โดย API Gateway จะ authenticate และ authorize คำขอ แล้วเรียก Lambda function ที่สื่อสารกับ **DynamoDB** ตัวอย่างนี้ยังรวมถึง API Gateway cache (เป็นทางเลือก) ที่ช่วยลด backend load และลด latency เมื่อ serve คำขอที่เกิดซ้ำ นอกจากนี้ API Gateway ยังส่ง log ไปยัง **Amazon CloudWatch** ด้วย

## การ monitor ผ่าน CloudWatch

API Gateway สามารถส่ง log ไปยัง CloudWatch ได้ทั้งในระดับ stage ของ API หรือระดับ method โดยตั้งค่าความละเอียดของ log ได้ (Error หรือ Info) และเลือกได้ว่าจะบันทึกข้อมูล request/response แบบเต็มหรือไม่

metric รายละเอียดที่ API Gateway สามารถส่งไปยัง CloudWatch ได้แก่:

- จำนวน API call
- Latency
- Integration latency
- HTTP 400 และ 500 errors

นอกจากนี้ยังสามารถเปิดใช้ access logging เพื่อบันทึกว่าใครเข้าถึง API และเข้าถึงอย่างไร

## Key terms
- Amazon API Gateway: บริการสำหรับสร้าง เผยแพร่ ดูแลรักษา ตรวจสอบ และรักษาความปลอดภัย REST/HTTP/WebSocket API
- Access logging: การบันทึก log ว่าใครเข้าถึง API และเข้าถึงอย่างไร
- Integration latency: ระยะเวลาที่ API Gateway ใช้ในการสื่อสารกับ backend integration
