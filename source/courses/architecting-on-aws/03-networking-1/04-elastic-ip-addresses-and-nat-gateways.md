# Elastic IP Addresses and NAT Gateways

บทเรียนนี้อธิบายเรื่อง **Elastic IP address**, **Network Address Translation (NAT)** และ **NAT gateway** ซึ่งเป็นองค์ประกอบ VPC ที่ออกแบบมาสำหรับ dynamic cloud computing ช่วยให้เชื่อมต่อ private subnet เข้ากับอินเทอร์เน็ตได้

**Elastic IP address** คือ static public IPv4 address ที่ออกแบบมาสำหรับ dynamic cloud computing สามารถผูก (associate) กับ instance หรือ network interface ใดก็ได้ใน VPC ของบัญชีคุณ ด้วย Elastic IP address คุณสามารถกลบเกลื่อนความล้มเหลวของ instance ได้ โดย remap address ไปยัง instance อื่นใน VPC อย่างรวดเร็ว

## Elastic IP Addresses

- ผูก (associate) กับ instance หรือ network interface ได้
- สามารถ re-associate ใหม่และส่ง traffic ใหม่ได้ทันที
- มีได้สูงสุด 5 Elastic IP address ต่อ Region
- รองรับ **Bring Your Own IP (BYOIP)**

## Elastic Network Interface

**Elastic network interface** เป็นองค์ประกอบเครือข่ายเชิงตรรกะ (logical networking component) ใน VPC ที่แทน virtual network card โดย network interface แบบเสมือนนี้:

- ย้ายข้าม EC2 instance ที่อยู่ใน Availability Zone เดียวกันได้
- คงค่า private IP address, Elastic IP address และ MAC address ไว้เหมือนเดิม

สำหรับ Amazon EC2 คุณสามารถสร้าง network interface, attach เข้ากับ instance, detach ออกจาก instance และ attach เข้ากับ instance อื่นได้ เมื่อย้ายไป instance ใหม่ network interface จะคง public/Elastic IP address, private IP address และ MAC address ไว้เหมือนเดิม (attribute ของ network interface จะติดตามไปด้วย)

## NAT Gateways

**Network Address Translation (NAT)** ออกแบบมาเพื่อประหยัดการใช้ IP address ด้วย NAT, private IP network ที่ใช้ unregistered IP address สามารถเชื่อมต่ออินเทอร์เน็ตได้ โดยอุปกรณ์ตัวเดียว เช่น router ทำหน้าที่เป็นตัวกลางระหว่างอินเทอร์เน็ต (public network) กับเครือข่ายภายใน (private network)

ใช้ **NAT gateway** สำหรับการเชื่อมต่อแบบ one-way outbound ระหว่าง instance ใน private subnet กับอินเทอร์เน็ตหรือบริการ AWS อื่น ๆ การเชื่อมต่อแบบนี้ป้องกันไม่ให้ traffic ภายนอกเชื่อมต่อเข้ามายัง private instance ได้ NAT gateway จะใช้ Elastic IP address ของตัวเองเป็น source IP address สำหรับ traffic ที่มาจาก private subnet

## Connecting private subnets to the internet

การเชื่อมต่อ component ใน private subnet เข้ากับอินเทอร์เน็ตผ่าน route table:

1. Route table ของ private subnet จะส่ง IPv4 internet traffic ทั้งหมดไปยัง NAT gateway
2. NAT gateway ใช้ Elastic IP address ของตัวเองเป็น source IP address สำหรับ traffic จาก private subnet
3. Route table ของ public subnet จะส่ง internet traffic ทั้งหมดไปยัง internet gateway (การทำงานนี้ไม่รองรับ IPv6)

## Deploy a VPC across multiple Availability Zones

การ deploy VPC ข้ามหลาย Availability Zone ช่วยสร้างสถาปัตยกรรมที่มี high availability โดยกระจาย traffic พร้อมทั้งรักษาความปลอดภัยของข้อมูล หากเกิด outage ใน Availability Zone หนึ่ง สามารถ failover ไปยังอีก Availability Zone ได้

ตัวอย่างสถาปัตยกรรม VPC ที่ครอบคลุมสอง Availability Zone:

- Backend server อยู่ใน private subnet สองชุด แยกกันคนละ Availability Zone
- Backend server ส่ง outbound traffic ไปยัง NAT gateway ที่อยู่ใน public subnet ของ Availability Zone เดียวกัน
- Backend traffic จาก NAT gateway ทั้งสองตัว route ไปยัง internet gateway ตัวเดียวกัน
- **Elastic Load Balancing (ELB)** รับ inbound traffic และ route ไปยัง application server ใน private subnet ของทั้งสอง Availability Zone

## Key terms
- Elastic IP address: static public IPv4 address ที่ผูกกับ instance/network interface ได้ และ remap ใหม่ได้อย่างรวดเร็ว
- BYOIP (Bring Your Own IP): การนำ IP address ของตัวเองมาใช้กับ AWS
- Elastic network interface: virtual network card ที่ย้ายข้าม EC2 instance ในโซนเดียวกันได้
- NAT (Network Address Translation): เทคนิคแปล private IP เป็น public IP เพื่อประหยัด address
- NAT gateway: บริการที่ให้การเชื่อมต่อ outbound แบบทางเดียวจาก private subnet ไปอินเทอร์เน็ต
- Multi-AZ deployment: การ deploy resource ข้ามหลาย Availability Zone เพื่อ high availability
