# What's new with AWS WA?

## What's new with AWS WA? (1.15)
สรุปฟีเจอร์ใหม่ ๆ ที่เพิ่มเข้ามาใน AWS Well-Architected Tool เมื่อเวลาผ่านไป:

- **Sustainability pillar** — AWS เปิดตัว pillar นี้ในงาน re:Invent 2021 เพื่อช่วยลูกค้าลดผลกระทบต่อสิ่งแวดล้อมจากการรัน workload บน cloud และเริ่มใช้งานได้ใน AWS WA Tool ตั้งแต่มีนาคม 2022 ออกแบบมาเพื่อช่วย CTO, architect, developer และทีม operations สนับสนุนเป้าหมายด้าน sustainability ขององค์กร
- **AWS re:Post integration** — tool มีทางเข้าถึง AWS re:Post โดยตรง ซึ่งเป็นบริการถาม-ตอบที่ขับเคลื่อนโดยชุมชน (community-driven) ช่วยลูกค้า AWS แก้ปัญหาทางเทคนิค เร่งการสร้างนวัตกรรม และพัฒนาการดำเนินงาน มีมากกว่า 40 หัวข้อ รวมถึงชุมชนเฉพาะสำหรับ AWS Well-Architected
- **AWS Organizations integration** (เปิดตัวมิถุนายน 2022) — ช่วยให้ cloud architect แชร์ workload และ custom lens ได้กว้างขึ้นทั่วทั้งองค์กร รวมถึงรองรับลูกค้าที่มีข้อกำหนดด้าน regulatory/compliance เฉพาะ และ AWS Partners ใช้ทำ self-service Well-Architected Review ได้ทั้งภาครัฐและเอกชน
- **AWS GovCloud (US) Regions** — AWS WA Tool พร้อมใช้งานใน GovCloud ซึ่งเป็น Region แยกต่างหากสำหรับข้อมูลที่ sensitive และ workload ที่มีการกำกับดูแล (regulated)
- **AWS Trusted Advisor integration** — tool แสดงผลการตรวจสอบ (findings) จาก automated Trusted Advisor resource checks ช่วยให้ข้อมูลบริบทเพิ่มเติมระหว่าง review ทำให้คำตอบแม่นยำขึ้นและ review เร็วขึ้น (เดิมลูกค้าต้อง double-check workload เองว่าทำตาม best practices หรือไม่ โดยไม่มีการเชื่อมโยงชัดเจนระหว่าง workload ที่ review กับทรัพยากรที่เกี่ยวข้อง)
- **AWS Service Catalog AppRegistry integration** — ใช้ AppRegistry เก็บ AWS applications, resource collections และ application attribute groups ที่เกี่ยวข้อง ช่วยให้เห็นภาพชัดขึ้นว่า application ใดเกี่ยวข้องกับ workload ใดระหว่าง review ประหยัดเวลาในการติดตามและจัดระเบียบทรัพยากรที่เกี่ยวข้องกับ workload
- ดูฟีเจอร์ใหม่เพิ่มเติมได้ที่ **What's New Feed**

## Key terms
- Sustainability pillar: pillar ที่ 6 ของ framework เน้นลดผลกระทบสิ่งแวดล้อม
- AWS re:Post: บริการถาม-ตอบชุมชนของ AWS
- AWS Trusted Advisor: บริการตรวจสอบ resource อัตโนมัติที่เชื่อมกับ AWS WA Tool
- AWS Service Catalog AppRegistry: บริการเก็บและจัดกลุ่ม AWS applications/resources
