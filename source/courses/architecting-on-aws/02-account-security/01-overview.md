# Overview

บทเรียนภาพรวมของ **Module 2: Account Security** โมดูลนี้เริ่มต้นจากคำร้องขอทางธุรกิจ (business request) จาก security specialist ซึ่งต้องการให้ผู้เรียนเข้าใจแนวคิดด้านความปลอดภัย (security concepts) ที่เป็นพื้นฐาน เพื่อนำไปตอบสนองคำร้องขอนั้นได้

ในโมดูลนี้ ผู้เรียนจะได้เรียนรู้วิธี:

- ระบุแนวปฏิบัติที่ดี (best practices) ในการจัดการสิทธิ์การเข้าถึง (access) บัญชีและทรัพยากร AWS โดยใช้ **principals** และ **identities**
- ระบุวิธีให้สิทธิ์ผู้ใช้เข้าถึงเฉพาะทรัพยากรที่จำเป็น โดยใช้ **security policies**
- จัดการหลายบัญชี AWS (**manage multiple accounts**)

## Key terms
- Principal: ตัวตนที่สามารถส่งคำขอ (request) เพื่อกระทำการใน AWS เช่น ผู้ใช้, บริการ หรือ role
- Identity: ตัวตนใน IAM เช่น user, group, role ที่ใช้ควบคุมการเข้าถึงทรัพยากร
- Security policy: เอกสารที่กำหนดสิทธิ์การเข้าถึงทรัพยากร
