# VPC Fundamentals

บทเรียนนี้อธิบายแนวคิดพื้นฐานของ VPC เพื่อสร้างโครงสร้างเครือข่ายที่ยืดหยุ่นและปลอดภัยในบัญชี AWS

## Amazon Virtual Private Cloud

**Amazon VPC** คือสภาพแวดล้อมเครือข่ายของคุณบนคลาวด์ ช่วยให้เปิดใช้งาน AWS resource ภายในเครือข่ายเสมือนที่คุณกำหนดเองได้

- VPC จะถูก deploy อยู่ใน AWS Region ใด Region หนึ่ง และสามารถ host resource จาก Availability Zone ใดก็ได้ภายใน Region นั้น
- ใช้ได้ทั้ง IPv4 และ IPv6 เพื่อการเข้าถึง resource และแอปพลิเคชันอย่างปลอดภัยและง่ายดาย
- VPC เป็นเครือข่ายเสมือนที่ผูกเฉพาะกับบัญชี AWS ของคุณ (dedicated to your AWS account)

## Subnets

**Subnet** คือช่วงของ IP address ภายใน VPC ที่สามารถ launch AWS resource ลงไปได้

- ใช้ **public subnet** สำหรับ resource ที่ต้องเชื่อมต่ออินเทอร์เน็ต และ **private subnet** สำหรับ resource ที่ไม่ต้องเชื่อมต่ออินเทอร์เน็ต
- แต่ละ subnet อยู่ภายใน Availability Zone เดียวเท่านั้น
- AWS สงวน IP address 4 รายการแรกและ 1 รายการสุดท้ายในทุก subnet CIDR block ไว้ใช้งานภายใน
- ควรพิจารณาใช้ subnet ขนาดใหญ่มากกว่าขนาดเล็ก เพื่อรองรับการขยายตัวในอนาคต

**ตัวอย่าง:** VPC ที่มี CIDR block `172.31.0.0/16` (65,536 addresses) แบ่งเป็น 4 subnets:

- Public subnet 1: `172.31.0.0/20` (4,096 addresses) ช่วง 172.31.0.1 - 172.31.15.254
- Public subnet 2: `172.31.16.0/20` (4,096 addresses) ช่วง 172.31.16.1 - 172.31.31.254
- Private subnet 1: `172.31.32.0/20` (4,096 addresses) ช่วง 172.31.32.1 - 172.31.47.254
- Private subnet 2: `172.31.48.0/20` (4,096 addresses) ช่วง 172.31.48.1 - 172.31.63.254

## VPC Components

### Public Subnets

Public subnet ผูกกับ route table ที่มีเส้นทาง (route) ไปยัง internet gateway ทำให้เข้าถึง resource ภายใน subnet นั้นได้จากอินเทอร์เน็ตสาธารณะโดยกำหนด public IP address ให้ การตั้งค่า public subnet ทำหน้าที่เหมือนประตูสองทาง (two-way door) — อนุญาตให้ traffic ไหลได้ทั้งสองทิศทาง ไม่ว่าจะถูกร้องขอ (invited) หรือไม่ก็ตาม

Public subnet ใช้องค์ประกอบต่อไปนี้:

- **Internet gateways** — อนุญาตให้สื่อสารระหว่าง resource ใน VPC กับอินเทอร์เน็ต
- **Route tables** — ชุดกฎที่ VPC ใช้กำหนดเส้นทาง network traffic; ใน public subnet จะมี route ไปยัง internet gateway
- **Public IP addresses** — เข้าถึงได้จากอินเทอร์เน็ต
- **Private IP addresses** — เข้าถึงได้เฉพาะภายในเครือข่ายเท่านั้น

### Internet Gateways

**Internet gateway** เป็นองค์ประกอบของ VPC ที่ scaled แบบ horizontal, redundant และ highly available อนุญาตให้สื่อสารระหว่าง instance ใน VPC กับอินเทอร์เน็ต โดยไม่มีข้อจำกัดด้าน availability หรือ bandwidth ต่อ network traffic รองรับทั้ง IPv4 และ IPv6 traffic

Internet gateway มีจุดประสงค์หลักสองอย่าง:

- เป็น target ใน route table สำหรับ traffic ที่ route ไปยังอินเทอร์เน็ตได้ (internet-routable traffic)
- ปกป้อง IP address บนเครือข่ายด้วยการทำ **network address translation (NAT)**

Internet gateway ทำ NAT โดย map ระหว่าง public และ private IP address เช่น แปลง source IP ของ request จาก private IP (172.31.2.15) เป็น public IP (54.56.9.10) เมื่อผู้รับตอบกลับมายัง public IP, internet gateway จะแปลงกลับเป็น private IP ที่ตรงกันแล้ว route response กลับไปยังผู้ร้องขอ

### Route Tables

**Route table** มีชุดกฎ (routes) ที่ใช้กำหนดว่า network traffic จะถูก route ไปทางไหน เมื่อสร้าง VPC จะมี main route table ให้อัตโนมัติ ซึ่งเริ่มต้นมีเพียง route เดียวคือ local route ที่อนุญาตให้ resource ทั้งหมดภายใน VPC สื่อสารกันได้ (แก้ไข local route ไม่ได้) เมื่อ launch instance ใหม่ใน VPC, local route จะครอบคลุม instance นั้นโดยอัตโนมัติ สามารถสร้าง custom route table เพิ่มเติมสำหรับ VPC ได้

### Private Subnets

Private subnet อนุญาตให้เข้าถึงอินเทอร์เน็ตแบบทางอ้อม (indirect access) เท่านั้น traffic จะอยู่ภายในเครือข่ายส่วนตัว private IP address ที่กำหนดให้ EC2 instance จะไม่เปลี่ยนแปลงเว้นแต่จะกำหนด IP address ใหม่ด้วยตนเองบน network interface

แม้จะวาง web-tier instance ไว้ใน public subnet ได้ แต่ AWS แนะนำให้วาง web-tier instance ไว้ใน private subnet โดยอยู่หลัง load balancer ที่วางใน public subnet (Elastic Load Balancing จะกล่าวถึงในบทเรียนหลัง ๆ)

### Default VPC

ทุกบัญชี AWS มาพร้อมกับ **default VPC** ที่ตั้งค่าไว้ล่วงหน้าให้ใช้งานได้ทันที โดยไม่ต้องสร้างและกำหนดค่า VPC เอง

- CIDR block ของ default VPC เป็น `/16` subnet mask เสมอ (เช่น `172.31.0.0/16` = 65,536 addresses)
- มี public subnet หนึ่งตัวในทุก Availability Zone ของ Region นั้น โดยใช้ `/20` subnet mask (4,096 addresses ต่อ subnet)
- มี internet gateway ให้ในตัว
- ใช้ main route table เชื่อม subnets เข้ากับ internet gateway

## Key terms
- Amazon VPC: เครือข่ายเสมือนส่วนตัวของบัญชี AWS ที่ deploy ในหนึ่ง Region
- Subnet: ช่วง IP address ภายใน VPC ที่อยู่ในหนึ่ง Availability Zone
- Internet gateway: องค์ประกอบ VPC ที่เชื่อมต่อ instance กับอินเทอร์เน็ต และทำ NAT
- Route table: ชุดกฎกำหนดเส้นทางของ network traffic ใน VPC
- Default VPC: VPC ที่ AWS สร้างไว้ล่วงหน้าให้ในทุกบัญชี พร้อม public subnet และ internet gateway
