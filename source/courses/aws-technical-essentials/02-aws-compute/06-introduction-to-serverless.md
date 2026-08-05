# Introduction to Serverless

แนวคิดหลัก: ใช้เวลากับสิ่งที่สร้างความแตกต่างให้กับแอปพลิเคชัน แทนที่จะเสียเวลาไปกับการรับประกัน availability, scaling และการจัดการ server

## Removing the undifferentiated heavy lifting
เมื่อรันโค้ดบน Amazon EC2, AWS รับผิดชอบ physical hardware แต่ผู้ใช้ยังรับผิดชอบส่วน logical control เช่น guest operating system, security และ patching, networking, security, และ scaling

หากใช้ Amazon EC2 หรือ container service ที่รันบน EC2 ผู้ใช้ต้องตั้งค่าและจัดการ fleet ของ instance เอง รวมถึงรับผิดชอบ patching เมื่อมี software package หรือ security update ใหม่, การตั้งค่า scaling ของ instance, และการออกแบบให้ระบบมี high availability (เช่น deploy instance ข้าม 2 AZs ขั้นต่ำ) แม้จะมี management overhead น้อยกว่าการโฮสต์แบบ on-premises แต่ก็ยังต้องมีกระบวนการจัดการ (management process) ของตนเอง ซึ่งในหลาย use case ถือเป็นข้อดีเพราะให้การควบคุมระบบได้เต็มที่

เมื่อเลือกใช้การควบคุมมากขึ้นด้วยการรันและจัดการ container บน Amazon ECS และ Amazon EKS เอง (ตามที่กล่าวในบทเรียน Container Services) AWS จะรับผิดชอบการจัดการ container มากขึ้น เช่น การ deploy container ข้าม EC2 instance และจัดการ container cluster แต่หากรัน Amazon ECS/EKS บน Amazon EC2 ผู้ใช้ก็ยังต้องรับผิดชอบดูแล EC2 instance ที่เป็นพื้นฐานอยู่ดี

คำถามคือ มีวิธีลดภาระงานที่ไม่สร้างความแตกต่าง (undifferentiated heavy lifting) นี้ได้หรือไม่? — มี! หากต้องการ deploy workload และแอปพลิเคชันโดยไม่ต้องจัดการ EC2 instance เลย สามารถทำได้ด้วย **serverless compute**

## Go serverless
ด้วย serverless compute ผู้ใช้สามารถใช้เวลากับสิ่งที่สร้างความแตกต่างให้กับแอปพลิเคชัน แทนที่จะเสียเวลาไปกับการรับประกัน availability, scaling และการจัดการ server ทุกคำนิยามของ serverless มักกล่าวถึง 4 ประเด็นนี้:
- ไม่มี server ที่ต้อง provision หรือจัดการ
- scale ตามการใช้งานโดยอัตโนมัติ
- ไม่ต้องจ่ายค่าใช้จ่ายสำหรับทรัพยากรที่ไม่ได้ใช้งาน (idle)
- มี availability และ fault tolerance ในตัว

AWS พัฒนา serverless service ครอบคลุมทั้ง 3 ชั้น (layer) ของ application stack โดยในบทเรียนถัดไปจะกล่าวถึง 2 บริการคือ **AWS Fargate** และ **AWS Lambda**

## ความหมายของ Serverless (เพิ่มเติม)
เมื่อใช้ Amazon EC2 หรือ container service ที่รันบน EC2 ผู้ใช้ต้องตั้งค่าและจัดการ fleet ของ instance เอง — รวมถึง patching, scaling และการออกแบบให้มี high availability ซึ่งแม้จะมี overhead น้อยกว่าการโฮสต์แบบ on-premises แต่ก็ยังต้องมีกระบวนการจัดการเอง ในหลาย use case นี้คือข้อดีเพราะให้การควบคุมเต็มรูปแบบ สามารถสร้างสถาปัตยกรรมได้ทั้งแบบง่ายหรือซับซ้อนตามต้องการ

นี่คือที่มาของคำว่า **serverless** — บริการ AWS จำนวนมากมีลักษณะ serverless คือผู้ใช้ไม่สามารถมองเห็นหรือเข้าถึง infrastructure หรือ instance ที่เป็นพื้นฐานของบริการนั้นได้ การจัดการ underlying environment ทั้งในด้าน provisioning, scaling, fault tolerance และ maintenance ถูกดูแลให้ทั้งหมด ผู้ใช้เพียงโฟกัสที่แอปพลิเคชันของตนเอง ส่วนที่เหลือถูก "แยกออกไป" (abstracted) ทำให้ serverless offering สะดวกต่อการใช้งานมาก ช่วยลดจำนวนกระบวนการสนับสนุนด้าน operation ที่ต้องมี

### ผลกระทบต่อ Shared Responsibility Model
แนวคิด serverless ส่งผลต่อ shared responsibility model เช่นกัน ตัวอย่างเช่น เมื่อใช้ Amazon EC2 instance ผู้ใช้ต้อง patch OS เมื่อมี security update ใหม่ แต่สำหรับบริการ serverless เส้นแบ่งความรับผิดชอบระหว่างผู้ใช้กับ AWS จะขยับขึ้นไป — ผู้ใช้ไม่มีสิทธิ์เข้าถึงระบบปฏิบัติการที่รันบริการอยู่ จึงไม่ต้องรับผิดชอบงานอย่างการ patching แต่ยังคงต้องรับผิดชอบเรื่อง data encryption และ access management

### Spectrum ของ AWS services
สามารถมอง AWS service ว่าอยู่บน spectrum (สเปกตรัม) ด้านหนึ่งคือความสะดวก (convenience) อีกด้านหนึ่งคือการควบคุม (control) — บริการอย่าง Amazon EC2 ให้การควบคุมสูง ในขณะที่บริการ serverless อย่าง AWS Lambda ให้ความสะดวกสูง

## Resources
- AWS website: (Serverless resources — ดูรายละเอียดเพิ่มเติมได้จากหน้า Serverless บน AWS)

## Key terms
- Undifferentiated heavy lifting: งานพื้นฐานที่จำเป็นแต่ไม่สร้างมูลค่าเพิ่มโดยตรง เช่น การจัดการ server, patching, scaling
- Serverless: รูปแบบการให้บริการที่ผู้ใช้ไม่ต้องจัดการ infrastructure/server เอง มี scaling อัตโนมัติ และจ่ายตามการใช้งานจริง
- AWS Fargate: serverless compute engine สำหรับ container (ใช้กับ ECS/EKS)
- AWS Lambda: serverless compute service สำหรับรันโค้ดโดยไม่ต้องจัดการ server
