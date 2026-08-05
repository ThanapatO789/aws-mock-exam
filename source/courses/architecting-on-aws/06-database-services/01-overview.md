# Overview

โมดูลนี้แนะนำบริการฐานข้อมูล (database services) ต่าง ๆ ที่ใช้ในแอปพลิเคชันบน AWS โดยครอบคลุมทั้งฐานข้อมูลแบบ relational และ non-relational, กลไกการทำ database caching และเครื่องมือสำหรับการ migrate ฐานข้อมูล

ในโมดูลนี้ ผู้เรียนจะได้เรียนรู้วิธี:

- ระบุ (identify) บริการฐานข้อมูลต่าง ๆ ของ AWS
- อธิบายประโยชน์ของการรัน database บน managed service อย่าง **Amazon Relational Database Service (Amazon RDS)**
- อธิบายวิธีที่ **Amazon DynamoDB** ใช้สร้างฐานข้อมูล NoSQL แบบ key-value ที่ scalable ได้
- อธิบายวิธี cache ข้อมูลที่ถูกเรียกใช้บ่อย เพื่อเพิ่มประสิทธิภาพและลดโหลดของฐานข้อมูล
- ระบุเครื่องมือที่ใช้ migrate ฐานข้อมูลเดิมไปยัง AWS Cloud

## Key terms
- Amazon RDS: managed service สำหรับรัน relational database บน AWS
- Amazon DynamoDB: บริการฐานข้อมูล NoSQL แบบ key-value ที่ scalable
- Database caching: การ cache ข้อมูลที่ถูกเรียกใช้บ่อยเพื่อลดโหลดของฐานข้อมูลหลักและเพิ่มประสิทธิภาพ
- Database migration tools: เครื่องมือสำหรับย้ายฐานข้อมูลเดิมเข้าสู่ AWS Cloud
