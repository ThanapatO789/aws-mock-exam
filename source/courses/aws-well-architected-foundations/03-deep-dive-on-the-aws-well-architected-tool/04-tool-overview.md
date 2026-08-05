# AWS Well-Architected Tool / AWS Well-Architected Tool overview

## AWS Well-Architected Tool (1.5)
**AWS WA Tool** ถูกออกแบบมาเพื่อช่วยตรวจสอบสถานะของ application และ workload โดยเป็นศูนย์กลาง (central place) สำหรับ architectural best practices และคำแนะนำ

- นอกจากคำแนะนำมาตรฐานจาก framework และ AWS lenses แล้ว tool ยังช่วยเพิ่มคำแนะนำ best practice ผ่าน **custom lenses** ได้
- วิธีเริ่มต้นที่เร็วที่สุดคือทำ **Well-Architected Framework Review** ผ่าน tool ใน console หรือผ่าน APIs
- สามารถสร้าง workload ใน AWS WA Tool ไว้ใน AWS account ของลูกค้าเองเพื่อเก็บข้อมูลอย่างปลอดภัย โดยยึดหลัก **least-privilege access** (ให้สิทธิ์เข้าถึงเฉพาะคนที่เกี่ยวข้อง)
- Workload สามารถแชร์ (share) กับ solutions architect, account team หรือ partner resource เพื่อร่วมกัน review หรือแก้ไขปัญหาได้ รวมถึง custom lenses ก็แชร์ได้เช่นกัน
- ลิงก์ไปยัง: AWS Well-Architected Tool product page, AWS Well-Architected Tool Labs

## AWS Well-Architected Tool overview (1.6)
เมื่อเข้าไปที่ AWS WA Tool ใน AWS Management Console หน้า **dashboard** จะแสดงทรัพยากรของ Region ที่เลือกไว้

- Framework และ tool มีการอัปเดตและปรับปรุงอย่างต่อเนื่องตาม feedback ของลูกค้า หาก workload ยังใช้ lens หรือ framework เวอร์ชันเก่า จะมีตัวเลือก **View available upgrades** ให้อัปเกรด
- หน้า **Workloads list** แสดงรายการ workload ทั้งหมดใน account และ Region ที่เลือก พร้อมรายละเอียด เช่น ชื่อ, เจ้าของ (owner), จำนวนคำถามที่ตอบแล้ว, จำนวนความเสี่ยงที่พบ
- จากหน้า workloads console สามารถ **Define new workload** เพื่อเริ่ม review ใหม่ได้

## Key terms
- Least-privilege access: หลักการให้สิทธิ์เข้าถึงเท่าที่จำเป็น
- Dashboard: หน้าภาพรวมทรัพยากรตาม Region
- Workloads list: รายการ workload ทั้งหมดใน account/Region
