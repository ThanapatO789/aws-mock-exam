# Overview

โมดูลนี้เป็นภาพรวมของ edge services ที่ AWS นำเสนอ ครอบคลุมแง่มุมต่าง ๆ ของการกระจาย content (content distribution) และบริการที่ AWS มีให้เพื่อรองรับการกระจาย content อย่างปลอดภัย

ในโมดูลนี้ ผู้เรียนจะได้เรียนรู้วิธี:

- ระบุบริการที่ทำงานอยู่บริเวณ edge ของ AWS network
- อธิบายวิธีใช้ **Amazon Route 53** เพื่อนำทาง (route) traffic ไปยังทรัพยากรของคุณ
- กำหนดค่า (configure) **Amazon CloudFront**
- อธิบาย best practice สำหรับการป้องกันบริการ AWS ที่ edge
- อธิบายวิธีจัดการทรัพยากรภายในองค์กร (local resources) ด้วย **AWS Outposts**

## Key terms
- Edge services: กลุ่มบริการของ AWS ที่ทำงานใกล้กับผู้ใช้งานปลายทาง เพื่อลด latency และเพิ่มความปลอดภัยของการกระจาย content
