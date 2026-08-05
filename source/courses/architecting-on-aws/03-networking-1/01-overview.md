# Overview

โมดูลนี้อธิบายองค์ประกอบที่ใช้สร้างเครือข่ายเสมือน (virtual network) ที่ยืดหยุ่นและปลอดภัย ครอบคลุม private, public และ protected subnets พร้อมกลยุทธ์การรักษาความปลอดภัยแบบเป็นชั้น (layered security) สำหรับ subnets ใน **Amazon Virtual Private Cloud (VPC)**

ในโมดูลนี้ คุณจะได้เรียนรู้วิธี:

- กำหนด IP address ให้กับองค์ประกอบต่าง ๆ ของเครือข่าย
- นิยามและกำหนดค่า **virtual private cloud (VPC)**
- นิยามและใช้งาน VPC traffic security
- นำ networking use cases ทั่วไปไปใช้งานใน VPC

## Key terms
- VPC (Virtual Private Cloud): เครือข่ายเสมือนส่วนตัวของบัญชี AWS
- Subnet: ช่วงของ IP address ย่อยภายใน VPC
- Layered security: แนวทางรักษาความปลอดภัยแบบหลายชั้น
