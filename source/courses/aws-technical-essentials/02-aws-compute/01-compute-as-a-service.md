# Compute as a Service

ในระดับพื้นฐาน มีตัวเลือกด้าน compute อยู่ 3 ประเภทหลัก ได้แก่ virtual machines (VMs), container services, และ serverless

## Servers
สิ่งแรกที่จำเป็นในการโฮสต์แอปพลิเคชันคือ server ซึ่งโดยทั่วไปจะรับ HTTP request และส่ง response กลับไปยัง client ตาม client-server model (การสื่อสารแบบ API-based ใดๆ ก็จัดอยู่ในโมเดลนี้เช่นกัน)

- **Client**: บุคคลหรือคอมพิวเตอร์ที่ส่ง request
- **Server**: คอมพิวเตอร์ (หรือกลุ่มคอมพิวเตอร์) ที่เชื่อมต่ออินเทอร์เน็ต ให้บริการเว็บไซต์แก่ผู้ใช้ Server จะให้พลังงานแก่แอปพลิเคชันผ่าน CPU, memory และ networking capacity เพื่อประมวลผล request ของผู้ใช้และแปลงเป็น response

ตัวอย่าง HTTP server ที่พบทั่วไป:
- Windows: Internet Information Services (IIS)
- Linux: Apache HTTP Server, Nginx, Apache Tomcat

หากต้องการรัน HTTP server บน AWS ต้องเลือกบริการที่ให้ compute power ผ่าน AWS Management Console ซึ่งสามารถดูรายการ AWS compute services ทั้งหมดได้เมื่อ log in เข้า console

## การเลือก compute option ที่เหมาะสม
หากรับผิดชอบตั้งค่า server บน AWS เพื่อรันโครงสร้างพื้นฐาน จะมีตัวเลือก compute หลากหลาย สิ่งแรกที่ต้องรู้คือควรใช้ compute service แบบใดสำหรับแต่ละ use case โดยมี 3 ประเภทหลัก คือ virtual machines (VMs), container services, และ serverless

### Virtual Machine (VM)
สำหรับผู้ที่มีพื้นฐานด้าน infrastructure มาก่อน VM มักเป็นตัวเลือกที่เข้าใจง่ายที่สุด เพราะ VM จำลอง (emulate) physical server และสามารถติดตั้ง HTTP server เพื่อรันแอปพลิเคชันได้ การจะรัน VM ได้ ต้องติดตั้ง **hypervisor** บน host machine

- **Hypervisor**: ซอฟต์แวร์หรือเฟิร์มแวร์ที่ทำให้สามารถแชร์ physical hardware resources ข้าม VM หนึ่งตัวหรือมากกว่าได้ hypervisor จะจัดสรร (provision) resources เพื่อสร้างและรัน VM

### Amazon EC2
ใน AWS, **Amazon Elastic Compute Cloud (Amazon EC2)** เป็นบริการเว็บที่ให้ compute capacity ที่ปลอดภัยและปรับขนาดได้ (secure and resizable) บนคลาวด์ ผู้ใช้สามารถ provision virtual server ที่เรียกว่า **EC2 instance** ได้ เบื้องหลัง AWS เป็นผู้ดูแลจัดการ host machine และ hypervisor layer รวมถึงติดตั้งระบบปฏิบัติการของ VM ที่เรียกว่า **guest operating system**

บริการ compute อื่นๆ ของ AWS จำนวนมากใช้ Amazon EC2 หรือใช้แนวคิด virtualization อยู่เบื้องหลัง จึงควรเข้าใจบริการนี้ก่อนที่จะศึกษา container services และ serverless compute ต่อไป

## Resources
- AWS whitepaper: Compute Services
- AWS website: Compute for Any Workload

## Key terms
- Hypervisor: ซอฟต์แวร์/เฟิร์มแวร์ที่ใช้แชร์ physical hardware ให้กับ VM หลายตัว
- Amazon EC2: บริการ virtual server (compute capacity) ที่ปรับขนาดได้บน AWS
- Guest operating system: ระบบปฏิบัติการที่ติดตั้งอยู่บน virtual machine
- Client-server model: รูปแบบการสื่อสารที่ client ส่ง request และ server ตอบกลับด้วย response
