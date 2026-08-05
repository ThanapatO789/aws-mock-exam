# Knowledge Check

แบบทดสอบท้ายโมดูล ใช้ทบทวนความเข้าใจเนื้อหาทั้งหมดของโมดูล 11 (Serverless) ผลลัพธ์ที่ได้จะช่วยชี้ให้เห็นหัวข้อที่ควรกลับไปทบทวนเพิ่มเติม ประกอบด้วยคำถาม 3 ข้อ ดังนี้ (คำตอบที่ถูกต้องยืนยันจากระบบหลังตอบจริง)

## คำถามที่ 1

**คำถาม:** Amazon SQS queue ประเภทใดให้การส่งข้อความแบบ at-least-once delivery
(Which type of Amazon Simple Queue Service (Amazon SQS) queue provides at-least-once delivery?)

- First in, first out (FIFO) queue
- **Standard queue** ✅ (คำตอบที่ถูกต้อง)
- Dead-letter queue
- Long polling

## คำถามที่ 2

**คำถาม:** ข้อดีของ long polling เมื่อเทียบกับ short polling ใน Amazon SQS คืออะไร
(What is an advantage of long polling compared to short polling, while using Amazon Simple Queue Service (Amazon SQS)?)

- Long polling provides an immediate response from a ReceiveMessage call.
- Long polling is more stable when using a single thread to poll multiple queues.
- **Long polling reduces the cost of using Amazon SQS by reducing the number of empty responses and false empty responses.** ✅ (คำตอบที่ถูกต้อง)
- Long polling reduces cost by only sampling a subset of Amazon SQS servers.

## คำถามที่ 3

**คำถาม:** ข้อใดคือคุณสมบัติของ Amazon Simple Notification Service (Amazon SNS)
(What is a feature of Amazon Simple Notification Service (Amazon SNS)?)

- Amazon SNS exchanges messages through a polling model.
- Amazon SNS can send messages to distributed components of applications without requiring each component to be concurrently available.
- **Amazon SNS can push messages to multiple subscribers.** ✅ (คำตอบที่ถูกต้อง)
- Amazon SNS keeps messages persistent.

## Key terms
- Knowledge Check: แบบทดสอบสั้น ๆ ท้ายโมดูลเพื่อประเมินความเข้าใจ
