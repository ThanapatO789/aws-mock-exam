# Amazon Route 53

บทเรียนนี้สอนวิธีใช้ **Amazon Route 53** ซึ่งเป็นโซลูชัน DNS จาก AWS สำหรับแอปพลิเคชันที่มีความพร้อมใช้งานสูง (highly available) และปรับขนาดได้ (scalable)

Amazon Route 53 เป็นบริการ Domain Name System (DNS) ที่มีความพร้อมใช้งานสูงและปรับขนาดได้ สามารถใช้ Route 53 ทำหน้าที่หลัก 3 อย่างในการผสมผสานใด ๆ ก็ได้ ได้แก่ domain registration, DNS routing และ health checking

เมื่อ Route 53 เป็น DNS service ของโดเมน Route 53 จะสร้าง hosted zone ที่มีชื่อเดียวกับโดเมน กำหนด name server สี่ตัวให้กับ hosted zone และอัปเดตโดเมนให้ใช้ name server เหล่านั้น

## Hosted zones

Hosted zone คือ container สำหรับ record ของโดเมน ใช้เมื่อต้องการ route traffic สำหรับโดเมนหนึ่ง ๆ (เช่น example.com) และ subdomain ของมัน (เช่น dev.example.com หรือ mail.example.com) hosted zone และโดเมนที่สอดคล้องกันจะมีชื่อเดียวกัน มี hosted zone อยู่ 2 ประเภท:

**Public hosted zones** — เก็บ record ที่ระบุวิธี route traffic บนอินเทอร์เน็ต ใช้สำหรับ internet name resolution และมี delegation set สำหรับให้ authoritative name server แก่ registrar หรือ parent domain

**Private hosted zones** — เก็บ record ที่ระบุวิธี route traffic ภายใน virtual private cloud (VPC) ใช้สำหรับ name resolution ภายใน VPC และสามารถเชื่อมโยงกับหลาย VPC รวมถึงข้าม account ได้

## Routing policies

เมื่อสร้าง record จะต้องเลือก routing policy ซึ่งกำหนดว่า Amazon Route 53 จะตอบสนองต่อ query อย่างไร มี routing policy ทั้งหมด 7 แบบ:

- **Simple routing policy** — ใช้สำหรับทรัพยากรเดียวที่ทำหน้าที่เฉพาะให้กับโดเมน เช่น web server ที่ให้บริการ content ของเว็บไซต์ example.com สามารถใช้สร้าง record ใน private hosted zone ได้
- **Failover routing policy** — ใช้เมื่อต้องการกำหนดค่า active-passive failover สามารถใช้สร้าง record ใน private hosted zone ได้
- **Geolocation routing policy** — ใช้เมื่อต้องการ route traffic ตามตำแหน่งที่ตั้งของผู้ใช้งาน สามารถใช้สร้าง record ใน private hosted zone ได้
- **Geoproximity routing policy** — ใช้เมื่อต้องการ route traffic ตามตำแหน่งที่ตั้งของทรัพยากร และ (ถ้าต้องการ) เลื่อน traffic จากทรัพยากรในตำแหน่งหนึ่งไปยังอีกตำแหน่งหนึ่ง
- **Latency routing policy** — ใช้เมื่อมีทรัพยากรอยู่หลาย AWS Region และต้องการ route traffic ไปยัง Region ที่ให้ latency ดีที่สุด สามารถใช้สร้าง record ใน private hosted zone ได้
- **Multivalue answer routing policy** — ใช้เมื่อต้องการให้ Route 53 ตอบ DNS query ด้วย record ที่สุขภาพดี (healthy) สูงสุด 8 รายการแบบสุ่ม สามารถใช้สร้าง record ใน private hosted zone ได้
- **Weighted routing policy** — ใช้เพื่อ route traffic ไปยังหลายทรัพยากรตามสัดส่วน (proportion) ที่กำหนด สามารถใช้สร้าง record ใน private hosted zone ได้

จบบทเรียนนี้แล้ว บทเรียนถัดไปจะสำรวจวิธีใช้ **Amazon CloudFront** เพื่อ cache ข้อมูลให้ใกล้ผู้ใช้งานมากขึ้น

## Key terms
- Hosted zone: container สำหรับเก็บ DNS record ของโดเมนใน Route 53
- Routing policy: กฎที่กำหนดวิธีที่ Route 53 ตอบสนอง DNS query
- Weighted routing: การกระจาย traffic ไปยังหลายทรัพยากรตามสัดส่วนที่กำหนด (เช่น 80/20)
