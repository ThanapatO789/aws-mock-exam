# Demonstration: Relaunching the Employee Directory Application in Amazon EC2

บทเรียนนี้เป็นวิดีโอสาธิต (demonstration video) ที่มีไว้เป็นการเดินผ่าน (visual walk-through) เท่านั้น ไม่ใช่แบบฝึกหัดลงมือทำ (hands-on exercise) เนื้อหาด้านล่างสรุปมาจาก transcript ของวิดีโอ

ในวิดีโอนี้จะสาธิตการ: สร้าง VPC, สร้าง subnet 4 อัน, สร้าง route table สำหรับ public subnet, attach internet gateway เข้ากับ VPC และสุดท้ายคือ relaunch แอปพลิเคชัน Employee Directory เข้าไปใน VPC ใหม่นี้

## ขั้นตอนที่ 1: สร้าง VPC

จาก VPC dashboard คลิก **Create VPC** เลือกโหมด "VPC only" (สร้างเฉพาะ VPC ก่อน) ตั้งชื่อว่า `app-vpc` และกำหนด CIDR range เป็น `10.1.0.0/16` แล้วคลิก Create VPC

## ขั้นตอนที่ 2: สร้าง Subnets

ไปที่เมนู Subnets ทางซ้าย คลิก **Create subnet** เลือก VPC เป็น `app-vpc` แล้วสร้าง subnet ทั้งหมด 4 อัน (public และ private อย่างละ 1 ใน 2 Availability Zone):

| Subnet name | Availability Zone | CIDR range |
|---|---|---|
| Public Subnet 1 | us-west-2a | 10.1.1.0/24 |
| Private Subnet 1 | us-west-2a | 10.1.2.0/24 |
| Public Subnet 2 | us-west-2b | 10.1.3.0/24 |
| Private Subnet 2 | us-west-2b | 10.1.4.0/24 |

ทุก CIDR range ไม่ทับซ้อนกัน (non-overlapping) และเป็นส่วนย่อย (subset) ของ CIDR range ของ VPC (`10.1.0.0/16`) จากนั้นคลิก Create subnet เพื่อสร้างทั้ง 4 อันพร้อมกัน

## ขั้นตอนที่ 3: สร้างและ Attach Internet Gateway

ไปที่เมนู Internet gateways คลิก **Create internet gateway** ตั้งชื่อว่า `app-igw` แล้วคลิก Create internet gateway จากนั้นเลือก internet gateway ที่สร้างใหม่ แล้วคลิก **Attach to VPC** เพื่อ attach เข้ากับ `app-vpc`

หมายเหตุ: internet gateway หนึ่งตัวสามารถ attach กับ VPC ได้เพียง 1 VPC เท่านั้น (ความสัมพันธ์แบบ one-to-one)

## ขั้นตอนที่ 4: Configure Route Table

ไปที่เมนู Route tables — จะเห็นว่ามี main route table อยู่แล้วสำหรับทั้ง default VPC และ app-vpc คลิก **Create route table** ตั้งชื่อว่า `public-route-table` และเชื่อมโยง (associate) กับ `app-vpc`

จากนั้นเพิ่ม route ใหม่: ปลายทาง (destination) `0.0.0.0/0` ไปยัง target เป็น internet gateway ที่สร้างไว้ (`app-igw`) แล้ว Save changes

ขั้นต่อไปคือ **associate subnet** กับ route table นี้ โดยไปที่แท็บ Subnet associations คลิก Edit subnet associations แล้วเลือกเฉพาะ Public Subnet 1 และ Public Subnet 2 เท่านั้น

ข้อสังเกตสำคัญ: subnet เองไม่มีคุณสมบัติที่กำหนดว่าเป็น public หรือ private โดยตรง สิ่งที่กำหนดว่า subnet เป็น public หรือ private คือ **การที่ subnet นั้นมี route table ที่มี route ไปยัง internet gateway หรือไม่**

## ขั้นตอนที่ 5: Relaunch แอปพลิเคชัน Employee Directory

ไปที่ EC2 console → Instances จะเห็น instance ของ Employee Directory application เดิมทำงานอยู่ใน default VPC เลือก instance นี้ แล้วไปที่ **Actions → Image and templates → Launch more like this** ซึ่งจะนำ configuration เดิมมา prepopulate ให้อัตโนมัติ

ตั้งชื่อ instance ใหม่ว่า `Employee Directory App 2` (AMI และ instance type เช่น t2.micro จะถูกเลือกไว้ให้แล้ว) เลือก "proceed without a key pair"

ในส่วน **Network settings** ซึ่งเป็นจุดที่ต้องเปลี่ยนแปลงหลัก:
- เลือก VPC ใหม่คือ `app-vpc`
- เลือก subnet เป็น Public Subnet 1
- ตรวจสอบว่า auto-assign public IP ถูกตั้งเป็น Enable

สำหรับ **security group** — security group เดิมใช้ไม่ได้เพราะผูกอยู่กับ VPC เดิม (security group ผูกกับ VPC) จึงต้องสร้าง security group ใหม่สำหรับ VPC ใหม่นี้ โดยกำหนด inbound rule เหมือนเดิม:
- อนุญาต HTTP traffic พอร์ต 80 จาก internet
- อนุญาต HTTPS traffic พอร์ต 443 จาก internet

ตรวจสอบ **Advanced details** จะพบว่า IAM role และ user data ถูก prepopulate มาให้เรียบร้อยแล้วจาก instance เดิม

คลิก **Launch instance** รอสักครู่จน instance เข้าสถานะ running แล้วคัดลอก public IP address ไปเปิดในแท็บใหม่ หากเข้าถึง Employee Directory application ได้สำเร็จ แสดงว่าการตั้งค่าเครือข่าย (VPC, subnet, internet gateway, route table, security group) ทั้งหมดถูกต้อง

## Key terms
- Launch more like this: ฟีเจอร์ของ EC2 ที่ใช้ configuration ของ instance เดิมมาเป็นค่าเริ่มต้นสำหรับ instance ใหม่
- Public/Private subnet: กำหนดโดย route table ที่ associate อยู่ ไม่ใช่คุณสมบัติของ subnet เอง — public subnet คือ subnet ที่มี route ไปยัง internet gateway
- Security group ผูกกับ VPC: security group ของ VPC หนึ่งไม่สามารถใช้กับ instance ใน VPC อื่นได้ ต้องสร้างใหม่
