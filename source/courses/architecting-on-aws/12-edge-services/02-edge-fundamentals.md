# Edge Fundamentals

บทเรียนนี้ให้ภาพรวมของ AWS infrastructure และวิธีใช้งานเพื่อออกแบบ (architect) แอปพลิเคชันที่ดีโดยใช้ Edge services

## AWS Cloud at the edge

AWS edge computing services มอบ infrastructure และ software ที่ย้ายการประมวลผลและวิเคราะห์ข้อมูล (data processing/analysis) ให้เข้าใกล้ endpoint มากที่สุดเท่าที่จำเป็น ซึ่งรวมถึงการนำ hardware/software ที่ AWS จัดการไปติดตั้งนอก AWS data center และแม้กระทั่งบนอุปกรณ์ของลูกค้าเอง (customer-owned devices)

เนื้อหาส่วนนี้มีภาพ infographic แบบ hotspot ให้คลิกเรียนรู้เพิ่มเติม 5 จุด ได้แก่:

### AWS Regions
AWS Region คือสถานที่ตั้งทางกายภาพ (physical location) แห่งหนึ่งทั่วโลกที่มีกลุ่ม data center รวมกันเพื่อความพร้อมใช้งานสูง (high availability) แต่ละ AWS Region ประกอบด้วย Availability Zone ที่แยกจากกันทางกายภาพ (isolated) อย่างน้อย 3 แห่งภายในพื้นที่ทางภูมิศาสตร์เดียวกัน

### Edge locations
Edge locations เชื่อมต่อกับ AWS Regions ผ่าน AWS network backbone บริการที่ใช้งานที่นี่ได้แก่ **Amazon CloudFront**, **AWS WAF**, และ **AWS Shield**

### AWS Local Zones
AWS Local Zones เป็นรูปแบบหนึ่งของการติดตั้ง infrastructure ที่นำ compute, storage, database และบริการ AWS ที่เลือกไว้ไปวางใกล้กับศูนย์กลางประชากรและอุตสาหกรรมขนาดใหญ่ (large population and industry centers)

### AWS Outposts
(หัวข้อนี้แสดงเป็นจุด hotspot บนภาพประกอบ แต่ไม่มีข้อความอธิบายเพิ่มเติมในป๊อปอัป — เนื้อหาเรื่อง AWS Outposts อธิบายแบบละเอียดในบทเรียนของตัวเองถัดไปในโมดูลนี้)

### AWS Snow Family
กลุ่มผลิตภัณฑ์ AWS Snow Family ให้บริการจัดเก็บข้อมูลแบบออฟไลน์ที่ edge (offline storage at the edge) ซึ่งใช้สำหรับนำข้อมูลกลับไปยัง AWS Regions

หลังจากทำความเข้าใจส่วนประกอบต่าง ๆ ของ AWS infrastructure ที่ช่วยนำ infrastructure เข้ามาใกล้ผู้ใช้งานมากขึ้นแล้ว บทเรียนถัดไปจะกล่าวถึง **Amazon Route 53** สำหรับโซลูชัน DNS

## Key terms
- Edge location: จุดเชื่อมต่อเครือข่ายของ AWS ที่ใช้ให้บริการ CloudFront, WAF, Shield ใกล้ผู้ใช้งาน
- AWS Local Zones: การติดตั้ง infrastructure ของ AWS ใกล้ศูนย์กลางประชากร/อุตสาหกรรม เพื่อ latency ต่ำ
- AWS Snow Family: กลุ่มอุปกรณ์สำหรับ offline data transfer/storage ที่ edge
