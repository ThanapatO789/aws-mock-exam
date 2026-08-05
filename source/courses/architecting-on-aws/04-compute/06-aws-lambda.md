# AWS Lambda

ด้วย serverless computing คุณสามารถสร้างและรัน application/service ได้โดยไม่ต้องกังวลเรื่องเซิร์ฟเวอร์ serverless application ไม่จำเป็นต้อง provision, scale และจัดการเซิร์ฟเวอร์เอง สามารถสร้างได้สำหรับแอปพลิเคชันหรือ backend service เกือบทุกประเภท โดยทุกอย่างที่จำเป็นสำหรับรันและ scale แอปพลิเคชันแบบ high availability จะถูกจัดการให้โดยอัตโนมัติ

**AWS Lambda** เป็นบริการ serverless compute ของ AWS มาดูกันว่า Lambda ใช้ทำอะไรได้บ้าง

## AWS Lambda คืออะไร

AWS Lambda เป็นบริการ serverless และ event-driven compute ที่ให้รันโค้ดสำหรับแอปพลิเคชันหรือ backend service แทบทุกประเภท โดยไม่ต้อง provision หรือจัดการเซิร์ฟเวอร์เอง

บริการนี้รันโค้ดของคุณบน compute infrastructure ที่มี high availability และดูแลจัดการ administration ของ compute resource ทั้งหมดให้

ด้วย Lambda คุณสามารถรันโค้ดได้สำหรับแอปพลิเคชันหรือ backend service แทบทุกประเภท สิ่งที่ต้องทำคือส่งโค้ดของคุณในภาษาใดภาษาหนึ่งที่ Lambda รองรับ

คุณจัดระเบียบโค้ดของคุณเป็น **Lambda function** Lambda จะรัน function ของคุณเฉพาะเมื่อจำเป็น และ scale โดยอัตโนมัติ ตั้งแต่ระดับไม่กี่ request ต่อวัน ไปจนถึงหลายพัน request ต่อวินาที คุณจ่ายเฉพาะเวลาที่ compute ถูกใช้งานจริง (compute time ที่คุณใช้) — ไม่มีค่าใช้จ่ายเมื่อโค้ดไม่ได้ทำงาน

องค์ประกอบหลักของ Lambda คือ **event source** และ **Lambda function**: event source คือตัวที่ publish event ส่วน Lambda function คือโค้ดที่คุณเขียนขึ้นเพื่อประมวลผล event นั้น Lambda จะเป็นตัวรัน function ให้

## Use case ของ AWS Lambda (hotspots)

- **Web applications** — เว็บไซต์แบบ static, เว็บแอปพลิเคชันที่ซับซ้อน, รองรับแพ็กเกจอย่าง Flask และ Express
- **Backends** — backend สำหรับแอปพลิเคชันและบริการ, มือถือ (mobile), Internet of Things (IoT)
- **Data processing** — การประมวลผลแบบ real-time, MapReduce, AWS Batch
- **Chatbots** — ขับเคลื่อน logic ของ chatbot
- **Amazon Alexa** — ขับเคลื่อนแอปพลิเคชันที่สั่งงานด้วยเสียง (voice-activated), Alexa Skills Kit
- **IT automation** — policy engine, การขยายความสามารถของบริการ AWS อื่น (extending AWS services), การจัดการ infrastructure

## Key terms
- AWS Lambda: บริการ serverless, event-driven compute สำหรับรันโค้ดโดยไม่ต้องจัดการเซิร์ฟเวอร์
- Lambda function: หน่วยโค้ดที่ผู้ใช้เขียนเพื่อประมวลผล event บน Lambda
- Event source: ตัวที่ publish event เพื่อ trigger การทำงานของ Lambda function
