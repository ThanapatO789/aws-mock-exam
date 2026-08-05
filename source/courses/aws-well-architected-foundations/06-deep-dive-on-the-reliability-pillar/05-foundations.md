# Foundations

## Foundations (1.10)
สไลด์เกริ่นนำเข้าสู่ best practice area แรก: **Foundations**

## Manage service quotas and constraints (1.11)
แนวปฏิบัติในการจัดการ service quotas และข้อจำกัดของบริการ:
- **Stay aware of service quotas and constraints** — ตระหนักถึง service quotas และข้อจำกัดต่าง ๆ อยู่เสมอ
- **Manage service quotas across accounts and Regions** — จัดการ service quotas ให้ครอบคลุมทั้ง accounts และ Regions
- **Monitor and manage quotas** — ตรวจสอบและจัดการ quotas
- **Automate quota management** — ทำ quota management แบบอัตโนมัติ
- **Accommodate fixed service quotas and constraints through architecture** — ออกแบบสถาปัตยกรรมให้รองรับ service quotas และข้อจำกัดที่กำหนดตายตัว
- **Ensure a sufficient gap exists between current quotas and maximum usage** — รักษาระยะห่างที่เพียงพอระหว่าง quota ปัจจุบันกับการใช้งานสูงสุด

## Plan your network topology (1.12)
แนวปฏิบัติในการวางแผน network topology:
- **Use highly available network connectivity for your workload public endpoints** — ใช้การเชื่อมต่อเครือข่ายที่มี high availability สำหรับ public endpoints ของ workload
- **Provision redundant connectivity between cloud and on-premises environments** — จัดเตรียมการเชื่อมต่อแบบ redundant ระหว่าง cloud และ on-premises
- **Prefer hub-and-spoke topologies over many-to-many mesh** — เลือกใช้ topology แบบ hub-and-spoke แทนแบบ many-to-many mesh
- **Enforce non-overlapping private IP ranges in connected address spaces** — บังคับใช้ private IP ranges ที่ไม่ทับซ้อนกันในพื้นที่ที่เชื่อมต่อกัน
- **Ensure IP subnet allocation accounts for expansion and availability** — จัดสรร IP subnet โดยคำนึงถึงการขยายตัวและ availability ในอนาคต

(สไลด์แสดงเป็นรายการหัวข้อ ไม่มีคำอธิบายเพิ่มเติมต่อท้ายแต่ละข้อในข้อมูลดิบที่ดึงมาได้)

## Key terms
- Service quota: ขีดจำกัดของบริการ AWS ที่กำหนดโดยค่าเริ่มต้นหรือปรับได้ตามคำขอ
- Hub-and-spoke topology: รูปแบบเครือข่ายที่มีศูนย์กลาง (hub) เชื่อมต่อไปยังจุดต่าง ๆ (spokes) แทนการเชื่อมต่อกันเองทุกจุด (mesh)
