# Compute Services

บทเรียนนี้ให้ภาพรวมของวิวัฒนาการของบริการ compute บน AWS ตามช่วงเวลา ผ่านกราฟิกแบบ hotspot 5 จุด (คลิกแต่ละจุดเพื่อดูรายละเอียด)

## วิวัฒนาการของบริการ Compute (hotspots)

**1. Amazon EC2**
Amazon EC2 เป็นหนึ่งในบริการ AWS แรก ๆ ที่เปิดตัวในปี 2006 (2006) และยังคงเป็นองค์ประกอบหลักของ cloud computing มาจนถึงปัจจุบัน EC2 instance type รุ่นใหม่ ๆ ช่วยเพิ่มประสิทธิภาพการประมวลผล (compute efficiency) ซึ่งช่วยลดต้นทุนด้าน compute ได้

**2. Containerization (การทำ container)**
Containerization ให้ความเป็นอิสระจากแพลตฟอร์ม (platform independence), runtime environment ที่สอดคล้องกัน (consistent), ใช้ทรัพยากรได้มีประสิทธิภาพสูงขึ้น, deploy ได้ง่ายและเร็วขึ้น, มี isolation และ sandboxing, และเริ่มทำงานได้เร็ว (deploy ได้ในไม่กี่วินาที)

ในปี 2014 **Amazon Elastic Container Service (Amazon ECS)** เปิดตัวความสามารถในการรัน distributed application บน managed cluster ของ EC2 instance ด้วย Docker container ต่อมาในปี 2017 มีการรองรับ Kubernetes ผ่าน **Amazon Elastic Kubernetes Service (Amazon EKS)**

**3. AWS Lambda**
Serverless computing ให้การ scale ต่อเนื่อง (continuous scaling), มี fault tolerance ในตัว, จ่ายตามมูลค่าที่ใช้งานจริง (pay for value) และไม่ต้องดูแลรักษา (zero maintenance)

AWS Lambda เปิดตัวในปี 2014 เช่นกัน โดยนำเสนอแนวคิด serverless computing — สามารถรันโค้ดได้โดยไม่ต้อง provision หรือจัดการ EC2 instance เอง

**4. AWS Fargate**
Serverless computing และ containerization ถูกนำมารวมกันในปี 2017 ด้วยการเปิดตัว **AWS Fargate** ซึ่งเป็น serverless compute engine สำหรับ container ที่ทำงานร่วมกับ Amazon ECS และ Amazon EKS

**5. AWS Graviton processors**
ในปี 2020 AWS เปิดตัวโปรเซสเซอร์เฉพาะทาง (specialized processors) เพื่อรองรับการทำงานด้าน artificial intelligence (AI) และ machine learning (ML)

## Key terms
- Amazon ECS (Elastic Container Service): บริการรัน container บน managed cluster ของ EC2 instance
- Amazon EKS (Elastic Kubernetes Service): บริการรัน Kubernetes บน AWS
- AWS Fargate: serverless compute engine สำหรับ container ที่ใช้กับ Amazon ECS/EKS
- AWS Graviton: โปรเซสเซอร์ ARM-based ที่ AWS พัฒนาเอง เพื่อเพิ่มประสิทธิภาพ/ลดต้นทุน
