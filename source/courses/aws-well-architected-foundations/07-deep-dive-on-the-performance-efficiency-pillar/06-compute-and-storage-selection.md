# Compute and Storage Architecture Selection

## Compute architecture selection (1.12)
เมื่อเลือกสถาปัตยกรรม compute ให้เลือก compute resources ที่ตอบโจทย์ requirements และ performance needs พร้อมทั้งให้ประสิทธิภาพด้านต้นทุนและความพยายามที่ดี วิธีนี้ช่วยให้ทำงานได้มากขึ้นด้วยจำนวน resources เท่าเดิม แต่ solution ที่เหมาะสมที่สุดสำหรับ compute จะแตกต่างกันไปตามการออกแบบ application, รูปแบบการใช้งาน (usage patterns) และการตั้งค่า (configuration settings)

แนวปฏิบัติที่ดีมีดังนี้:

- **Evaluate available compute options** — ทำความเข้าใจ performance characteristics ของตัวเลือก compute ต่าง ๆ เช่น instances, containers และ functions
- **Understand available compute configuration options** — configuration options ต่าง ๆ ตอบโจทย์ workload อย่างไร และตัวเลือกใดเหมาะสมที่สุด เช่น instance family, sizes, ฟีเจอร์อย่าง GPU/I/O, function sizes, container instances และ single/multi-tenancy
- **Collect compute-related metrics** — บันทึกและติดตามการใช้งาน (utilization) ของระบบต่าง ๆ เพื่อเข้าใจว่า compute resources ทำงานอย่างไร แล้วใช้ข้อมูลนี้กำหนด resource requirements ได้แม่นยำขึ้น
- **Determine required configuration by rightsizing** — วิเคราะห์ performance characteristics ของ workload ที่เกี่ยวข้องกับ memory, network, I/O และ CPU usage เพื่อเลือก resources ที่เหมาะกับ profile ของ workload เช่น workload ที่เน้น memory อย่าง database อาจได้ประโยชน์จาก memory-to-core ratio ที่สูงกว่า ในขณะที่ workload ที่เน้น compute อาจต้องการ core count และความถี่ (frequency) สูงกว่าแต่ใช้ memory ต่อ core น้อยกว่าได้
- **Use available elasticity of resources** — cloud มีความยืดหยุ่นในการขยายและลด resources แบบ dynamic ผ่านกลไกหลากหลาย เมื่อรวมกับ compute-related metrics workload จะสามารถตอบสนองต่อการเปลี่ยนแปลงของ demand ได้อัตโนมัติ โดยใช้เฉพาะ resources ที่จำเป็นเท่านั้น
- **Continually evaluate compute needs based on metrics** — ใช้ data-driven approach เพื่อประเมินและ optimize compute resources ของ workload อย่างต่อเนื่อง

## Storage architecture selection (1.13)
Solution ของ storage ที่เหมาะสมที่สุดสำหรับระบบจะแตกต่างกันไปตามวิธีการเข้าถึง (access method) ไม่ว่าจะเป็น block, file หรือ object และตามรูปแบบการเข้าถึงว่าเป็นแบบสุ่ม (random) หรือลำดับ (sequential) นอกจากนี้ยังขึ้นกับ throughput ที่ต้องการ, ข้อจำกัดด้าน availability และ durability, ความถี่ในการเข้าถึงหรืออัปเดตข้อมูล

แนวปฏิบัติที่ดีมีดังนี้:

- **Understand storage characteristics and requirements** — ระบุและบันทึกลักษณะของ workload storage เช่น shareable access, file size, growth rate, throughput, IOPS, latency, access patterns และ persistence of data แล้วใช้ลักษณะเหล่านี้ประเมินว่า block, file, object หรือ instance storage services เหมาะสมที่สุด
- **Evaluate available configuration options** — ประเมินลักษณะและ configuration options ต่าง ๆ ที่เกี่ยวข้องกับ storage เช่น provisioned IOPS, SSD, magnetic storage, object storage, archival storage หรือ ephemeral storage เพื่อ optimize พื้นที่และประสิทธิภาพของ storage สำหรับ workload
- **Make decisions based on access patterns and metrics** — เลือกระบบ storage ตามรูปแบบการเข้าถึง (access patterns) ของ workload และ configure ให้สอดคล้อง เพิ่มประสิทธิภาพการใช้ storage ด้วยการเลือก object storage แทน block storage เมื่อเหมาะสม และปรับ configuration ให้ตรงกับ data access patterns

## Key terms
- Rightsizing: การเลือกขนาด resource ให้พอดีกับความต้องการจริง ไม่มากหรือน้อยเกินไป
- IOPS (Input/Output Operations Per Second): หน่วยวัดจำนวนการอ่าน/เขียนข้อมูลต่อวินาที
- Ephemeral storage: พื้นที่จัดเก็บข้อมูลชั่วคราวที่ข้อมูลจะหายไปเมื่อ instance หยุดทำงาน
