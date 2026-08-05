# Workload Architecture

## Workload Architecture (1.13)
สไลด์เกริ่นนำเข้าสู่ best practice area ที่สอง: **Workload Architecture**

## Design your workload service architecture (1.14)
- **Choose how to segment your workload** — เลือกวิธีการแบ่ง (segment) workload
- **Build services focused on specific business domains and functionality** — สร้าง services ที่มุ่งเน้น business domain และ functionality เฉพาะเจาะจง
- **Provide service contracts per API** — กำหนด service contracts ต่อ API

## Design interactions in a distributed system to prevent failures (1.15)
- **Do constant work** — ทำงานในปริมาณคงที่
- **Make all responses idempotent** — ทำให้ทุก response เป็น idempotent
- **Identify which kind of distributed system is required** — ระบุประเภทของ distributed system ที่ต้องการ
- **Implement loosely coupled dependencies** — ทำให้ dependencies เชื่อมโยงกันแบบหลวม (loosely coupled)

## Design interactions in a distributed system to mitigate or withstand failures (1.16)
- **Implement graceful degradation to transform hard dependencies to soft** — ทำ graceful degradation เพื่อเปลี่ยน hard dependencies ให้เป็น soft dependencies
- **Throttle requests** — จำกัดอัตรา (throttle) คำขอ
- **Set client timeouts** — ตั้งค่า timeout ฝั่ง client
- **Make services stateless where possible** — ทำให้ services เป็น stateless เท่าที่เป็นไปได้
- **Fail fast and limit queues** — ล้มเหลวอย่างรวดเร็ว (fail fast) และจำกัดขนาด queue
- **Implement emergency levers** — จัดเตรียม emergency levers (กลไกฉุกเฉิน)
- **Control and limit retry calls** — ควบคุมและจำกัดจำนวนการเรียก retry

(สไลด์ทั้ง 3 แสดงเป็นรายการหัวข้อ ไม่มีคำอธิบายเพิ่มเติมต่อท้ายแต่ละข้อในข้อมูลดิบที่ดึงมาได้)

## Key terms
- Idempotent: การเรียกซ้ำ operation เดิมหลายครั้งให้ผลลัพธ์เหมือนเดิมโดยไม่ก่อผลข้างเคียงเพิ่ม
- Graceful degradation: การลดระดับความสามารถของระบบอย่างนุ่มนวลแทนการล่มทั้งระบบเมื่อเกิดปัญหา
- Throttle: การจำกัดอัตราการประมวลผลคำขอ
- Stateless: บริการที่ไม่เก็บสถานะ (state) ไว้ในตัวเอง ทำให้ scale และ fail over ได้ง่ายขึ้น
