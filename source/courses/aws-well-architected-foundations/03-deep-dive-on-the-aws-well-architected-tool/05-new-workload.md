# AWS Well-Architected Tool new workload (1-2)

## AWS Well-Architected Tool new workload (1.7)
เมื่อสร้าง workload ใหม่ในเครื่องมือ ต้องกรอกข้อมูลต่อไปนี้:

- **Workload name** — ชื่อที่ไม่ซ้ำและสื่อความหมายชัดเจนสำหรับระบุ workload
- **Workload description** — คำอธิบายขอบเขตและวัตถุประสงค์ของ workload
- **Review owner** — ฟิลด์บังคับ (เพิ่มเข้ามาปี 2020) คือผู้ที่รับผิดชอบทำ review ให้เสร็จ, รายงานสถานะความเสี่ยง และติดตามการปรับปรุงเมื่อเวลาผ่านไป
- **Workload environment** — เลือกระหว่าง **production** หรือ **pre-production** เพื่อระบุว่า workload อยู่ใน lifecycle ช่วงไหน

## AWS Well-Architected Tool new workload cont. (1.8)
ฟิลด์บังคับสุดท้ายคือ **Workload Regions** — Region ที่ workload รันอยู่ ใช้เพื่อช่วยค้นหา/จัดเรียง/กรองข้อมูล (search, sort, filter) เนื่องจาก "workload" เป็นแนวคิดสังเคราะห์ (synthetic concept) ที่ลูกค้ากำหนดเอง

- best practices ของ framework สามารถขยายนอกเหนือจาก AWS environment ได้ — ใช้ tool review ทรัพยากรที่รันแบบ on-premises หรือบน cloud provider อื่นได้เช่นกัน
- **Workload account IDs** — ระบุ account ID (หรือหลาย ID ถ้า workload ครอบคลุมหลาย account) โดยค่าเริ่มต้นไม่ต้องให้สิทธิ์ IAM หรือ access ใด ๆ กับ account ที่ระบุไว้นี้ (ยกเว้นใช้ Well-Architected API หรือบริการจาก AWS software partners ที่ทำงานข้าม account อาจต้องปรับสิทธิ์)
- **Architectural design** — ช่องเสริม (optional) สำหรับใส่ URL ของ architecture diagram เพื่อใช้อ้างอิงระหว่าง review ให้ทุกคนมีข้อมูล setup ตรงกัน โดยเฉพาะเมื่อมี AWS employee หรือ AWS Well-Architected partner ช่วย review
- **Industry type / Industry** — ตัวเลือกสุดท้าย ใช้เพื่อช่วยจัดเรียง/กรอง/ค้นหาเมื่อมีหลาย workload

## Key terms
- Review owner: ผู้รับผิดชอบหลักของการ review workload
- Production / Pre-production: สถานะ lifecycle ของ workload
- Architectural design (URL): ลิงก์ diagram สถาปัตยกรรมสำหรับอ้างอิงระหว่าง review
