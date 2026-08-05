# Serverless with AWS Fargate

AWS Fargate ทำหน้าที่ scale และจัดการ infrastructure ให้ ทำให้นักพัฒนาสามารถโฟกัสกับสิ่งที่ตนถนัดที่สุด คือการพัฒนาแอปพลิเคชัน (application development)

## ทบทวน: Container orchestrator กับ compute platform
ก่อนหน้านี้ได้เรียนรู้เกี่ยวกับ container service และความหมายของ serverless แล้ว โดย:
- **ECS หรือ EKS** คือ container orchestrator — เครื่องมือที่จัดการวงจรชีวิต (lifecycle) ของ container
- ต้องมี **compute platform** ซึ่งเป็นที่ที่ container รันจริง — ก่อนหน้านี้เรียนรู้ว่า ECS/EKS รัน container บน cluster ของ EC2 instance โดยใช้ EC2 เป็น compute platform และมีการควบคุม instance เหล่านั้นอย่างเข้มงวด

แต่ EC2 ไม่ใช่ serverless ดังนั้นเมื่อพูดถึง serverless compute สำหรับ container จึงมีบริการที่เรียกว่า **AWS Fargate**

## AWS Fargate
**AWS Fargate** เป็น purpose-built serverless compute engine สำหรับ container โดย Fargate ทำการ abstract EC2 instance ออกไป ทำให้ไม่ต้องจัดการ underlying compute infrastructure เอง แต่ยังสามารถใช้แนวคิด, API และการเชื่อมต่อ (integration) ต่างๆ ของ Amazon ECS ได้เหมือนเดิม รวมถึงเชื่อมต่อ (native integration) กับ IAM และ Amazon Virtual Private Cloud (Amazon VPC) ได้ ทำให้สามารถ launch Fargate container ภายในเครือข่ายของตนเองและควบคุมการเชื่อมต่อ (connectivity) ไปยังแอปพลิเคชันได้

Fargate เป็น serverless compute platform สำหรับ container ที่ใช้ร่วมกับ ECS หรือ EKS ได้ทั้งคู่ เมื่อใช้ Fargate เป็น compute platform, container จะรันบน managed serverless platform ที่มี scaling และ fault tolerance ในตัว โดยไม่ต้องกังวลเรื่องระบบปฏิบัติการหรือ instance ที่เป็นพื้นฐาน แทนที่จะจัดการ infrastructure เอง ผู้ใช้เพียงกำหนด application content, networking, storage และ scaling requirement เท่านั้น — ไม่ต้อง provisioning, patching, จัดการ cluster capacity หรือจัดการ infrastructure ใดๆ

### วิธีการทำงานกับ Fargate
1. สร้าง container image และ push เข้า repository เช่น **Amazon Elastic Container Registry (Amazon ECR)** ซึ่งเป็นที่เก็บ container image สำหรับดึงไปใช้ deploy
2. กำหนด memory และ compute resource สำหรับ task (ถ้าใช้ ECS) หรือ pod (ถ้าใช้ EKS)
3. รัน container
4. จ่ายค่าใช้จ่ายตามปริมาณ vCPU, memory และ storage resource ที่ container ใช้จริงเท่านั้น

Fargate รองรับ pricing แบบ Spot และ Compute Savings Plan เช่นเดียวกับ EC2 instance ทำให้มีความยืดหยุ่นในการวางแผนรัน container บน Fargate — ยังคงได้รับการควบคุม (control) การ deploy container ในระดับที่ดี แต่ไม่ต้องกังวลเรื่อง provisioning, patching หรือจัดการระบบปฏิบัติการ/instance ที่เป็นพื้นฐาน และไม่ต้อง scale infrastructure เข้า-ออกเพื่อตอบสนอง demand เหมือนกับการใช้ EC2

### กลไกภายใน
Fargate จัดสรร compute ให้เหมาะสม ช่วยตัดความจำเป็นในการเลือกและจัดการ EC2 instance, cluster capacity และ scaling ออกไป Fargate รองรับทั้งสถาปัตยกรรม Amazon ECS และ Amazon EKS พร้อมมี workload isolation และความปลอดภัยที่ดีขึ้นโดยการออกแบบ (by design)

### Use cases
AWS Fargate เหมาะกับ use case ทั่วไปของ container เช่น:
- Microservice architecture applications
- Batch processing
- Machine learning applications
- การย้ายแอปพลิเคชันจาก on-premises ไปยังคลาวด์ (migration)

## Resources
- AWS website: AWS Fargate
- AWS website: Getting Started with Serverless Computing
- External site: Coursera course – Building Modern Python Applications on AWS

## Key terms
- AWS Fargate: serverless compute engine สำหรับ container ที่ใช้ร่วมกับ ECS หรือ EKS
- Amazon ECR (Elastic Container Registry): ที่เก็บ (repository) สำหรับ container image
- Workload isolation: การแยกการทำงานของแต่ละ workload ออกจากกันเพื่อความปลอดภัย
