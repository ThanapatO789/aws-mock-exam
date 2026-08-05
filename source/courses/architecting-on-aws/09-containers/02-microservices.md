# Microservices

Loosely coupled architecture ทำให้ component ต่าง ๆ ของแอปพลิเคชันเป็นอิสระต่อกัน การเปลี่ยนแปลง component หนึ่งจะไม่กระทบส่วนอื่น บทเรียนนี้สอนวิธีออกแบบ microservices สำหรับแอปพลิเคชันแบบ loosely coupled

## Loosely coupled architecture

โครงสร้างพื้นฐานแบบ monolithic ดั้งเดิมประกอบด้วยเซิร์ฟเวอร์ที่ผูกติดกันแน่น (tightly integrated) เป็นชุด ๆ แต่ละชุดมีหน้าที่เฉพาะ เมื่อ component หรือ layer ใด layer หนึ่งล่ม อาจส่งผลกระทบร้ายแรงต่อทั้งระบบ การตั้งค่าแบบนี้ยังขัดขวางการ scaling ด้วย เพราะเมื่อเพิ่มหรือลด server ใน layer หนึ่ง จะต้องเชื่อมต่อ server ทุกตัวใน layer ที่เชื่อมโยงกันใหม่ทั้งหมด

ด้วย loose coupling คุณใช้ managed solution (เช่น **Elastic Load Balancing**) เป็นตัวกลาง (intermediary) ระหว่าง layer ต่าง ๆ ของระบบ ตัวกลางนี้จะจัดการความล้มเหลวและการ scaling ของ component หรือ layer โดยอัตโนมัติ solution หลักสองแบบสำหรับ decouple component คือ load balancer และ message queue

## Microservices

Microservices เป็นแนวทางเชิงสถาปัตยกรรมและองค์กรสำหรับการพัฒนาซอฟต์แวร์ โดยออกแบบซอฟต์แวร์เป็นกลุ่มของ service ย่อย ๆ แต่ละ service จะถูก deploy แยกจากกันและสื่อสารผ่าน API ที่กำหนดไว้ชัดเจน วิธีนี้ช่วยเร่งรอบการ deploy ส่งเสริมนวัตกรรม และเพิ่ม maintainability และ scalability ของแอปพลิเคชัน

ตัวอย่าง: แอปพลิเคชันฟอรัมแบบ monolithic ถูก refactor ให้เป็น microservices architecture โดยแยกเป็น user service, topic service และ message service ทีม `/users` รัน user service บน **AWS Lambda** ทีม `/topics` รัน topic service บน **Amazon EC2** และทีม `/messages` รัน message service บน containers แอปพลิเคชัน microservices นี้กระจายอยู่บน 2 Availability Zones และจัดการ traffic ด้วย Application Load Balancer

หลังจากเข้าใจ loosely coupled architecture และ microservices แล้ว บทถัดไปจะพูดถึงการแพ็กเกจ microservices เหล่านี้ด้วย containers

## Key terms
- Loose coupling: การออกแบบให้ component เป็นอิสระต่อกันผ่านตัวกลาง เช่น load balancer หรือ message queue
- Elastic Load Balancing (ELB): บริการกระจาย traffic ที่ใช้เป็นตัวกลางเพื่อ decouple layer ต่าง ๆ
- Microservices: การออกแบบซอฟต์แวร์เป็น service ย่อยที่ deploy แยกกันและสื่อสารผ่าน well-defined API
