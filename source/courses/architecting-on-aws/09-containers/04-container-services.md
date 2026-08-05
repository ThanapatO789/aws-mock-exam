# Container Services

AWS มี container services ที่ช่วยให้คุณรัน container บนโครงสร้างพื้นฐานของ AWS ได้ บทเรียนนี้สอนวิธีใช้ container services เพื่อ deploy container บน AWS

การ deploy managed container solution บน AWS เกี่ยวข้องกับการเลือกและ configure 3 องค์ประกอบ: registry, orchestration tool และ container hosting

## Amazon Elastic Container Registry (Amazon ECR)

**Amazon ECR** เป็น managed Docker container registry คุณ push container image ไปที่ Amazon ECR แล้ว pull image เหล่านั้นมาใช้ launch container ได้ ด้วย Amazon ECR คุณสามารถ compress, encrypt และควบคุมการเข้าถึง (access control) container image รวมถึงจัดการ versioning และ image tag ได้ ทุกบัญชี AWS จะได้รับ Amazon ECR private registry ให้ใช้งาน

## Orchestration tools

**Kubernetes** เป็นซอฟต์แวร์ open-source ที่ใช้ deploy และจัดการแอปพลิเคชันแบบ containerized ในระดับสเกลใหญ่

### Amazon Elastic Kubernetes Service (Amazon EKS)

**Amazon EKS** เป็น managed service ที่ใช้รัน Kubernetes บน AWS โดยไม่ต้อง install และ operate Kubernetes cluster ของตัวเอง AWS จะจัดการ availability และ upgrade ของ service ให้ Amazon EKS รัน Kubernetes manager 3 ตัวกระจายใน 3 Availability Zones ตรวจจับและแทนที่ manager ที่ไม่ healthy และมี automated version upgrade และ patching ให้ manager Amazon EKS ยังถูก integrate กับบริการ AWS อื่น ๆ อีกมากมายเพื่อเพิ่ม scalability และ security ให้แอปพลิเคชัน

Amazon EKS รัน Kubernetes เวอร์ชันล่าสุดของ open-source ทำให้ใช้ plugin และ tooling ทั้งหมดจากชุมชน Kubernetes ได้ แอปพลิเคชันที่รันบน Amazon EKS จึงเข้ากันได้อย่างสมบูรณ์กับแอปพลิเคชันที่รันบน standard Kubernetes environment ไม่ว่าจะเป็น on-premises data center หรือ public cloud ใดก็ตาม

### Amazon Elastic Container Service (Amazon ECS)

**Amazon ECS** เป็น container-management service ที่มี scalability และ performance สูง รองรับ Docker container Amazon ECS จัดการ scaling, maintenance และ connectivity ให้กับแอปพลิเคชันแบบ containerized

ด้วย Amazon ECS คุณสร้าง ECS service ซึ่งจะ launch ECS task โดย task หนึ่งสามารถใช้ container image ได้หนึ่งตัวหรือมากกว่า ECS service จะ scale จำนวน task ที่กำลังรันให้สอดคล้องกับความต้องการของแอปพลิเคชัน

ด้วย Amazon ECS คุณไม่ต้อง operate cluster management และ configuration management system ของตัวเอง หรือกังวลเรื่อง scaling โครงสร้างพื้นฐานสำหรับจัดการเหล่านี้ Amazon ECS มีคุณสมบัติเด่น 4 ด้าน:

- **Service discovery** — Amazon ECS รองรับ service discovery ซึ่งใช้ register ECS service ให้เป็นชื่อ Domain Name System (DNS) เช่น register service ชื่อ "backend" กับ private DNS namespace เช่น `backend.example` และ register service ชื่อ "frontend" กับ `frontend.example` แล้ว configure ให้ service เหล่านี้ discover กันได้ภายใน VPC เดียวกัน ทำให้ microservice component ถูกค้นพบและเพิ่มเข้า namespace โดยอัตโนมัติเมื่อถูกสร้างและปิด
- **AWS integrations** — Amazon ECS integrate ใกล้ชิดกับบริการ AWS หลายตัว เช่น Amazon ECR (ช่วยให้แอปพลิเคชัน containerized เข้าถึงและรัน container image ได้ง่ายขึ้น), AWS Identity and Access Management (IAM) (กำหนด permission ละเอียดให้แต่ละ container เพื่อ isolation ระดับสูง) และ Amazon CloudWatch Logs และ CloudWatch Container Insights (ดู log จากแอปพลิเคชันและ instance แบบ containerized ในที่เดียว)
- **Flexible hosting options** — ด้วย Amazon ECS คุณใช้ทั้ง Amazon EC2 และ serverless hosting ผ่าน AWS Fargate ได้ กำหนด schedule การวาง container บน cluster ตามความต้องการ resource, isolation policy และ availability requirement ได้
- **Compatibility with common development workflows** — Amazon ECS รองรับ continuous integration และ continuous delivery (CI/CD) ซึ่งเป็นกระบวนการทั่วไปสำหรับ microservice architecture ที่ใช้ Docker container คุณสร้าง CI/CD pipeline ที่ทำสิ่งต่อไปนี้ได้: ตรวจสอบการเปลี่ยนแปลงใน source code repository, build Docker image ใหม่จาก source นั้น, push image ไปยัง image repository เช่น Amazon ECR หรือ Docker Hub, และ update ECS service ให้ใช้ image ใหม่ในแอปพลิเคชัน

## AWS Fargate

**AWS Fargate** เป็นเทคโนโลยีสำหรับ Amazon ECS และ Amazon EKS ที่ใช้รัน container โดยไม่ต้องจัดการ server หรือ cluster เอง ด้วย Fargate คุณไม่ต้อง provision, configure และ scale cluster ของ VM เพื่อรัน container อีกต่อไป ตัดความจำเป็นในการเลือกประเภท server, ตัดสินใจว่าจะ scale cluster เมื่อไร หรือ optimize การจัด packing ของ cluster

Fargate ลดความจำเป็นในการยุ่งเกี่ยวกับ (หรือแม้แต่คิดถึง) server หรือ cluster ทำให้คุณโฟกัสที่การออกแบบและ build แอปพลิเคชัน แทนที่จะต้องจัดการโครงสร้างพื้นฐานที่รันแอปพลิเคชันเหล่านั้น

บทถัดไป ผู้สอนจะพูดคุยแบบ Tech Talk เกี่ยวกับการใช้ container บน AWS

## Key terms
- Amazon ECR (Elastic Container Registry): managed Docker container registry สำหรับ push/pull container image
- Kubernetes: ซอฟต์แวร์ open-source สำหรับ deploy และจัดการ containerized application ในระดับสเกลใหญ่
- Amazon EKS (Elastic Kubernetes Service): managed service สำหรับรัน Kubernetes บน AWS โดยไม่ต้องดูแล control plane เอง
- Amazon ECS (Elastic Container Service): container-management service ของ AWS ที่จัดการ scaling, maintenance และ connectivity ของ container
- ECS task/service: task คือหน่วยรันของ container image หนึ่งตัวหรือมากกว่า; service คือตัวจัดการจำนวน task ให้ตรงกับ demand
- AWS Fargate: เทคโนโลยี serverless compute สำหรับรัน container บน ECS/EKS โดยไม่ต้องจัดการ server หรือ cluster
- CI/CD: กระบวนการ continuous integration/continuous delivery สำหรับ build, push และ update container image อัตโนมัติ
