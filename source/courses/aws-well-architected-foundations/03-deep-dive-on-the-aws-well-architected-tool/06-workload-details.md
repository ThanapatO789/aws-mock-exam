# AWS Well-Architected Tool workload details (1-2)

## AWS Well-Architected Tool workload details (1.9)
หลังจากสร้าง workload ใหม่ หรือเลือก workload ที่มีอยู่แล้ว จะเห็นหน้า **overview** ของ workload ซึ่งมีตัวเลือก:

- **Edit workload details** — แก้ไขรายละเอียด workload หลังสร้างแล้ว
- **Delete workload** — ลบ workload จากหน้านี้ได้
- **Questions completed and risks** — แสดงจำนวนคำถามที่ตอบแล้วจากทั้งหมด และความเสี่ยง (risks) ที่พบระหว่าง review
- **Save milestone** — บันทึก milestone เพื่อติดตามความคืบหน้าระหว่างทำ framework review

## AWS Well-Architected Tool workload details cont. (1.10)
ด้านล่างของหน้ารายละเอียด workload:

- **Workload notes** — บันทึกแบบเปิดกว้าง (open-ended) ใช้ติดตามความคืบหน้า, การเปลี่ยนแปลงสำคัญ หรือข้อมูล launch ที่จะมาถึง
- **Workload lens details** — รายการ lens ที่ใช้กับ workload นี้ (นอกเหนือจาก default framework) รวมถึง lens ที่ AWS สร้าง/สนับสนุน และ custom lens (รายละเอียดอยู่ในโมดูลอื่นของซีรีส์)
- **Pillar priority** — แสดงลำดับความสำคัญของ pillar (ค่า default) ไม่ได้หมายความว่า pillar ใด pillar หนึ่งสำคัญกว่ากัน แต่เป็นลำดับที่ลูกค้าส่วนใหญ่มักเข้าหาแนวคิดใน framework ตามลำดับนี้ — สามารถกด **Edit pillar priority** เพื่อเปลี่ยนลำดับได้ตามความสำคัญของแต่ละ workload การเปลี่ยนลำดับนี้จะจัดเรียงลำดับคำถามใน tool ใหม่ และเปลี่ยนลำดับคำแนะนำการปรับปรุง (recommendations) ตามลำดับความสำคัญที่ตั้งไว้ด้วย

## Key terms
- Workload notes: บันทึกอิสระเกี่ยวกับ workload
- Lens: ชุดคำถาม/best practices ที่ใช้ประเมิน workload (เช่น default framework, AWS lens, custom lens)
- Pillar priority: ลำดับความสำคัญของแต่ละ pillar ที่ปรับได้ตาม workload
