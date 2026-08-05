# Failure Management

## Failure Management (1.21)
สไลด์เกริ่นนำเข้าสู่ best practice area สุดท้าย: **Failure Management**

## Back up data (1.22)
- **Perform data backup automatically** — ทำ backup ข้อมูลโดยอัตโนมัติ
- **Perform periodic recovery of data to verify backup integrity and processes** — ทำการกู้คืนข้อมูลเป็นระยะเพื่อยืนยัน integrity ของ backup และกระบวนการ
- **Identify and back up all data that needs to be backed up** — ระบุและสำรองข้อมูลทั้งหมดที่จำเป็นต้อง backup
- **Secure and encrypt backups** — รักษาความปลอดภัยและเข้ารหัส backups

## Use fault isolation to protect your workload (1.23)
- **Automate recovery for components constrained to a single location** — ทำ automate การกู้คืนสำหรับ components ที่ถูกจำกัดอยู่ใน location เดียว
- **Use bulkhead architectures to limit scope of impact** — ใช้สถาปัตยกรรมแบบ bulkhead เพื่อจำกัดขอบเขตผลกระทบ
- **Deploy workload to multiple locations** — deploy workload ไปยังหลาย location
- **Select appropriate locations for your multi-location deployment** — เลือก location ที่เหมาะสมสำหรับการ deploy แบบ multi-location

## Design workload to withstand component failures (1.24)
- **Monitor all components of workload to detect failures** — เฝ้าติดตาม components ทั้งหมดของ workload เพื่อตรวจจับความล้มเหลว
- **Fail over to healthy resources** — ทำ failover ไปยัง resources ที่ปกติ
- **Rely on data plane, not control plane, during recovery** — พึ่งพา data plane แทน control plane ในระหว่างการกู้คืน
- **Use static stability to prevent bimodal behavior** — ใช้ static stability เพื่อป้องกัน bimodal behavior
- **Automate healing on all layers** — ทำ automate การ healing ในทุกชั้น (layers)
- **Send notifications when events impact availability** — ส่งการแจ้งเตือนเมื่อเหตุการณ์ส่งผลกระทบต่อ availability
- **Architect product to meet availability targets and uptime SLAs** — ออกแบบผลิตภัณฑ์ให้ตรงตาม availability targets และ uptime SLAs

## Test reliability (1.25)
- **Use playbooks to investigate failures** — ใช้ playbooks เพื่อตรวจสอบความล้มเหลว
- **Perform post-incident analysis** — ทำการวิเคราะห์หลังเกิดเหตุการณ์ (post-incident analysis)
- **Test scaling and performance requirements** — ทดสอบ scaling และ performance requirements
- **Test resiliency using chaos engineering** — ทดสอบ resiliency โดยใช้ chaos engineering
- **Test functional requirements** — ทดสอบ functional requirements
- **Conduct game days regularly** — จัด game days อย่างสม่ำเสมอ

## Plan for disaster recovery (1.26)
- **Define recovery objectives for downtime and data loss** — กำหนด recovery objectives สำหรับ downtime และ data loss
- **Use defined recovery strategies to meet recovery objectives** — ใช้ recovery strategies ที่กำหนดไว้เพื่อให้บรรลุ recovery objectives
- **Manage configuration drift at the DR site or Region** — จัดการ configuration drift ที่ DR site หรือ Region
- **Automate recovery** — ทำ automate การกู้คืน
- **Test disaster recovery implementation to validate implementation** — ทดสอบการ implement disaster recovery เพื่อยืนยันความถูกต้อง

(สไลด์ทั้ง 5 แสดงเป็นรายการหัวข้อ ไม่มีคำอธิบายเพิ่มเติมต่อท้ายแต่ละข้อในข้อมูลดิบที่ดึงมาได้)

## Key terms
- Bulkhead architecture: การแบ่งแยกส่วนประกอบของระบบเพื่อจำกัดผลกระทบเมื่อส่วนใดส่วนหนึ่งล้มเหลว
- Static stability: การออกแบบให้ระบบยังคงเสถียรได้แม้ dependency บางตัวหยุดทำงาน โดยไม่ต้องพึ่ง dynamic behavior ระหว่างเกิดความล้มเหลว
- Bimodal behavior: พฤติกรรมของระบบที่เปลี่ยนแปลงรูปแบบการทำงานอย่างมากระหว่างสภาวะปกติกับสภาวะล้มเหลว
- Chaos engineering: แนวทางการทดสอบโดยจงใจสร้างความล้มเหลวเพื่อตรวจสอบความทนทานของระบบ
- Game day: กิจกรรมจำลองเหตุการณ์เพื่อทดสอบ procedures และความพร้อมของทีม
- DR (Disaster Recovery): กระบวนการกู้คืนระบบหลังเกิดภัยพิบัติ
