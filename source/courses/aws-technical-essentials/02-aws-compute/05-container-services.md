# Container Services

ไม่มี compute service แบบใดที่เหมาะกับทุกกรณี (no one-size-fits-all) เพราะขึ้นอยู่กับความต้องการของแต่ละ workload สิ่งสำคัญคือต้องเข้าใจว่าแต่ละตัวเลือกให้อะไรบ้าง

AWS มี compute offering หลากหลาย ให้ความยืดหยุ่นในการเลือกเครื่องมือที่เหมาะสม โดยมี 3 หมวดหลักคือ virtual machines (VMs), containers, และ serverless บทเรียนนี้เน้นที่ containers และวิธีการรัน

Container สามารถโฮสต์ workload ได้หลากหลาย เช่น web application, lift-and-shift migration, distributed application และช่วยทำให้ development/test/production environment มีความสอดคล้องกัน (streamlining)

## Container คืออะไร
Container ถูกใช้เพื่อแก้ปัญหาของ compute แบบดั้งเดิม เช่น ปัญหาซอฟต์แวร์ทำงานไม่ได้เสถียรเมื่อย้ายจาก compute environment หนึ่งไปอีกที่หนึ่ง

**Container** คือหน่วยมาตรฐาน (standardized unit) ที่รวมโค้ดและ dependency เข้าด้วยกัน ออกแบบมาให้ทำงานได้อย่างน่าเชื่อถือบนแพลตฟอร์มใดก็ได้ เพราะ container สร้าง environment อิสระของตัวเอง ทำให้สามารถย้าย workload จากที่หนึ่งไปอีกที่หนึ่งได้ เช่น จาก development ไป production หรือจาก on-premises ไปคลาวด์

ตัวอย่างแพลตฟอร์ม containerization คือ **Docker** ซึ่งเป็น container runtime ยอดนิยมที่ช่วยจัดการ operating system stack ทั้งหมดที่จำเป็นสำหรับการแยก (isolation) container รวมถึง networking และ storage ช่วยให้ผู้ใช้สร้าง, บรรจุ (package), deploy และรัน container ได้

## ความแตกต่างระหว่าง VM กับ Container
Container ใช้ operating system และ kernel ร่วมกับ host ที่ deploy อยู่ ในขณะที่ virtual machine มีระบบปฏิบัติการของตัวเอง ทำให้ VM แต่ละตัวต้องมีสำเนา OS ซึ่งทำให้เกิดการสิ้นเปลืองทรัพยากรในระดับหนึ่ง

Container มีน้ำหนักเบากว่า (lightweight) เริ่มทำงานได้เร็วเกือบทันที ความแตกต่างของเวลาเริ่มทำงานนี้สำคัญมากเมื่อออกแบบแอปพลิเคชันที่ต้อง scale อย่างรวดเร็วช่วง I/O burst

Container ให้ความรวดเร็ว แต่ virtual machine ให้ความสามารถเต็มรูปแบบของระบบปฏิบัติการและทรัพยากรมากกว่า เช่น การติดตั้งแพ็กเกจ, dedicated kernel และอื่นๆ

## Orchestrating containers (การจัดการ container)
บน AWS, container สามารถรันบน EC2 instance ได้ เช่น ใช้ instance ขนาดใหญ่และรันหลาย container บน instance นั้น แม้การรัน instance เดียวจะจัดการง่าย แต่ขาด high availability และ scalability องค์กรส่วนใหญ่จึงรัน container จำนวนมากบน EC2 instance จำนวนมากใน หลาย Availability Zones

เมื่อจัดการ compute ในระดับใหญ่ ต้องพิจารณา:
- จะวาง (place) container บน instance อย่างไร
- จะเกิดอะไรขึ้นหาก container ล้มเหลว
- จะเกิดอะไรขึ้นหาก instance ล้มเหลว
- จะ monitor การ deploy container อย่างไร

การประสานงานเหล่านี้จัดการด้วย **container orchestration service** ซึ่ง AWS มี 2 บริการคือ **Amazon Elastic Container Service (Amazon ECS)** และ **Amazon Elastic Kubernetes Service (Amazon EKS)**

## Amazon ECS
**Amazon ECS** เป็น end-to-end container orchestration service ที่ช่วยสร้าง container ใหม่ได้ โดย container จะถูกกำหนดไว้ใน **task definition** ที่ใช้รัน task เดี่ยวหรือ task ภายใน service

สามารถเลือกได้ 2 แบบ:
- รัน task/service บน serverless infrastructure ที่จัดการโดย **AWS Fargate**
- รันบน cluster ของ EC2 instance ที่จัดการเอง (ต้องติดตั้ง Amazon ECS container agent บน EC2 instance ซึ่ง instance ที่ติดตั้ง agent แล้วเรียกว่า **container instance**)

เมื่อ Amazon ECS container instance พร้อมใช้งาน สามารถดำเนินการต่างๆ ได้ เช่น:
- Launch และ stop container
- ดู cluster state
- Scale in/out
- กำหนดตำแหน่ง (scheduling) การวาง container บน cluster
- กำหนดสิทธิ์ (permissions)
- ตอบสนองความต้องการด้าน availability

### Task definition
ในการเตรียมแอปพลิเคชันให้รันบน Amazon ECS ต้องสร้าง **task definition** ซึ่งเป็นไฟล์ข้อความรูปแบบ JSON ที่อธิบาย container หนึ่งตัวหรือมากกว่า เปรียบเสมือน blueprint ที่อธิบายทรัพยากรที่ต้องใช้ในการรัน container เช่น CPU, memory, ports, images, storage และข้อมูล networking

ตัวอย่าง task definition อย่างง่ายสำหรับ corporate directory application (รันบน Nginx web server):
```json
{
  "family": "webserver",
  "containerDefinitions": [ {
    "name": "web",
    "image": "nginx",
    "memory": "100",
    "cpu": "99"
  } ],
  "requiresCompatibilities": [ "FARGATE" ],
  "networkMode": "awsvpc",
  "memory": "512",
  "cpu": "256"
}
```

## Amazon EKS (Kubernetes)
**Kubernetes** เป็นแพลตฟอร์มโอเพนซอร์สที่พกพาได้และขยายได้ (portable, extensible) สำหรับจัดการ containerized workload และ service โดยรวมงานด้าน software development และ operations เข้าด้วยกัน ทำให้เกิด ecosystem ที่เติบโตเร็วและเป็นที่นิยมในตลาด

หากใช้ Kubernetes อยู่แล้ว สามารถใช้ **Amazon EKS** เพื่อจัดการ (orchestrate) workload บน AWS Cloud ได้ Amazon EKS เป็น managed service ที่ใช้รัน Kubernetes บน AWS โดยไม่ต้องติดตั้ง ดูแล และบำรุงรักษา Kubernetes control plane หรือ node เอง

Amazon EKS มีแนวคิดคล้ายกับ Amazon ECS แต่มีความแตกต่างดังนี้:
- ใน Amazon ECS เครื่องที่รัน container คือ EC2 instance ที่ติดตั้ง ECS agent เรียกว่า container instance ส่วนใน Amazon EKS เครื่องที่รัน container เรียกว่า worker node หรือ Kubernetes node
- Container ใน ECS เรียกว่า task ส่วนใน EKS เรียกว่า pod
- Amazon ECS รันบนเทคโนโลยี native ของ AWS ส่วน Amazon EKS รันบน Kubernetes

หากมี container ที่รันบน Kubernetes อยู่แล้ว และต้องการ orchestration solution ขั้นสูงที่ให้ความง่าย (simplicity), high availability และการควบคุม infrastructure แบบละเอียด Amazon EKS อาจเป็นเครื่องมือที่เหมาะสม

## Resources
- AWS website: Containers on AWS
- External website: Docker – Use Containers to Build, Share and Run Your Applications
- AWS website: Amazon Elastic Container Service (Amazon ECS)
- External website: GitHub – Amazon ECS Agent
- AWS developer guide: Amazon ECS Container Instances
- External website: Coursera course – Building Containerized Applications on AWS
- AWS website: Amazon Elastic Kubernetes Service (EKS)
- AWS user guide: Amazon EKS User Guide

## Key terms
- Container: หน่วยมาตรฐานที่บรรจุโค้ดและ dependency เพื่อรันได้อย่างสม่ำเสมอในทุก environment
- Docker: container runtime ยอดนิยมสำหรับสร้าง/จัดการ container
- Amazon ECS: บริการ container orchestration ของ AWS แบบ native
- Amazon EKS: บริการ managed Kubernetes บน AWS
- Task definition: ไฟล์ JSON ที่อธิบายทรัพยากรและการตั้งค่าของ container ใน ECS
- Container instance (ECS) / Worker node (EKS): EC2 instance ที่ใช้รัน container
- Task (ECS) / Pod (EKS): หน่วยของ container ที่ถูกจัดการโดย orchestration service
- AWS Fargate: serverless infrastructure สำหรับรัน container โดยไม่ต้องจัดการ EC2 instance เอง
