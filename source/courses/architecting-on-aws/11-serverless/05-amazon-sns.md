# Amazon SNS

**Amazon SQS** และ **Amazon SNS** เป็นบริการที่ช่วยการสื่อสารระหว่าง component ที่ loosely coupled ใน serverless application บทเรียนนี้อธิบายวิธีใช้ Amazon SNS

**Amazon Simple Notification Service (Amazon SNS)** เป็น web service ที่ใช้ set up, operate และส่ง notification จาก cloud บริการนี้ทำงานตามรูปแบบ publish-subscribe (pub-sub) messaging โดยส่ง notification ไปยัง client ด้วยกลไกแบบ push

คุณสร้าง topic และควบคุมการเข้าถึงด้วย policy ที่กำหนดว่า publisher และ subscriber รายใดสามารถสื่อสารกับ topic ได้ publisher จะส่งข้อความไปยัง topic ที่ตัวเองสร้างหรือมีสิทธิ์ publish แทนที่จะระบุ destination address เฉพาะในแต่ละข้อความ publisher จะส่งข้อความไปยัง topic แทน โดย SNS จะระบุ endpoint ที่ publisher ส่งข้อความไปและที่ subscriber ลงทะเบียนรับ notification subscriber ทุกรายที่ subscribe topic เดียวกันจะได้รับข้อความเดียวกันทั้งหมด

## Characteristics ของ Amazon SNS

- เมื่อข้อความถูกส่งสำเร็จแล้ว จะไม่สามารถเรียกคืนได้
- สามารถใช้ Amazon SNS Delivery Policy เพื่อควบคุมรูปแบบการ retry เช่น linear, geometric, exponential backoff, ระยะเวลา retry สูงสุด/ต่ำสุด และรูปแบบอื่น ๆ
- เพื่อป้องกันข้อความสูญหาย ข้อความทั้งหมดจะถูกเก็บซ้ำ (redundantly) ไว้ในหลายเซิร์ฟเวอร์และหลาย data center
- Amazon SNS ออกแบบมาเพื่อรองรับความต้องการของแอปพลิเคชันขนาดใหญ่และต้องการความเร็วสูง สามารถ publish ข้อความจำนวนมากได้ตลอดเวลา
- Amazon SNS ส่ง notification ไปยังแอปพลิเคชันและผู้ใช้บนอุปกรณ์ต่าง ๆ ได้ผ่าน Mobile Push notification (รวมถึง Apple, Google, Kindle Fire), HTTP/HTTPS, email หรือ email-JSON, SMS, Amazon SQS queue หรือ Lambda function
- Amazon SNS มีกลไกควบคุมการเข้าถึงเพื่อปกป้อง topic และข้อความจากการเข้าถึงโดยไม่ได้รับอนุญาต เจ้าของ topic ตั้ง policy จำกัดว่าใคร publish/subscribe ได้ และสามารถเข้ารหัส notification โดยกำหนดให้ delivery mechanism ต้องเป็น HTTPS

## Amazon SNS publish ไปยัง SQS queue หลายชุด (Fan-out)

การใช้บริการ highly available อย่าง Amazon SNS เพื่อ route message พื้นฐาน เป็นวิธีที่มีประสิทธิภาพในการกระจายข้อความไปยัง microservices รูปแบบการสื่อสารหลักระหว่าง microservices มีสองแบบ คือ request-response และ observer

ตัวอย่างนี้ใช้รูปแบบ observer และแสดง fan-out scenario โดยใช้ Amazon SNS และ Amazon SQS ร่วมกัน ในสถานการณ์ fan-out ข้อความจะถูกส่งไปยัง SNS topic แล้วถูก replicate และ push ไปยัง SQS queue, HTTP endpoint หรือ email address หลายรายการพร้อมกัน ทำให้ประมวลผลแบบ parallel asynchronous ได้

ตัวอย่าง: Amazon SNS fan-out order ไปยัง SQS queue สองชุดที่ต่างกัน โดยมี **Amazon EC2** instance สองตัว แต่ละตัว observe queue คนละชุด — instance หนึ่งทำหน้าที่ประมวลผล/fulfill order อีก instance หนึ่งเชื่อมต่อกับ data warehouse เพื่อวิเคราะห์ order ทั้งหมดที่ได้รับ

หากต้องการส่ง notification ไปยัง topic ของ SNS ผ่าน SQS queue: ถ้า user เป็นเจ้าของทั้ง SNS topic ที่ subscribe และ SQS queue ที่รับ notification ก็ไม่ต้องทำอะไรเพิ่มเติม — ข้อความที่ publish ไปยัง topic จะถูกส่งไปยัง SQS queue ที่ระบุโดยอัตโนมัติ แต่ถ้าเจ้าของ SQS queue ไม่ใช่เจ้าของ SNS topic เดียวกัน Amazon SNS จะต้องมีการยืนยัน (confirmation) คำขอ subscription อย่างชัดเจน

## Key terms
- Amazon SNS: บริการ pub-sub สำหรับ set up, operate และส่ง notification แบบ push
- Topic: ปลายทางที่ publisher ส่งข้อความไป และ subscriber ลงทะเบียนรับ notification
- Fan-out: รูปแบบที่ข้อความจาก SNS topic ถูก replicate ส่งไปยัง SQS queue/endpoint หลายรายการพร้อมกัน
- Pub-sub (publish-subscribe): รูปแบบการส่งข้อความที่ publisher ส่งไปยัง topic แล้ว subscriber ทุกรายรับข้อความเดียวกัน
