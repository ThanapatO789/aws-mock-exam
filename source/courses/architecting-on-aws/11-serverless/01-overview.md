# Overview

โมดูลนี้ให้ภาพรวมของแอปพลิเคชันแบบ serverless บน AWS ครอบคลุมวิธี host serverless applications บน infrastructure ของ AWS และบริการต่าง ๆ ที่ช่วยให้ deploy serverless application ได้

หลังจบโมดูลนี้ ผู้เรียนจะสามารถ:

- อธิบายความคล่องตัว (agility) ของ serverless
- อธิบายวิธีใช้ **Amazon API Gateway** เพื่อสร้าง เผยแพร่ ดูแลรักษา ตรวจสอบ และรักษาความปลอดภัยของ API
- ใช้ **Amazon Simple Queue Service (Amazon SQS)** เพื่อสร้าง message queue สำหรับการสื่อสารระหว่างบริการ (service-to-service) อย่างน่าเชื่อถือ
- ใช้ **Amazon Simple Notification Service (Amazon SNS)** เพื่อส่ง push notification
- ใช้ **Amazon Kinesis** เพื่อรับข้อมูล streaming
- อธิบายว่า **AWS Step Functions** ช่วยจัดการ workflow ระหว่าง function และบริการต่าง ๆ อย่างไร

## Key terms
- Serverless: รูปแบบการพัฒนาแอปพลิเคชันที่ไม่ต้อง provision หรือจัดการเซิร์ฟเวอร์เอง
