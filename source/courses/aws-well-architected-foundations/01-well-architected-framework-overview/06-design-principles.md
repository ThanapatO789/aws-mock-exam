# General design principles / Design principles

## General design principles (1.13)
หลักการออกแบบทั่วไป 6 ข้อ ที่ใช้ได้กับทุก workload:
- **Stop guessing your capacity needs** — เลิกเดาปริมาณ capacity ที่ต้องการ (ใช้ auto scaling แทนการคาดเดา)
- **Test systems at production scale** — ทดสอบระบบในระดับที่ใกล้เคียงกับ production จริง
- **Automate to make architectural experimentation easier** — ใช้ automation เพื่อให้ทดลองปรับสถาปัตยกรรมได้ง่ายขึ้น
- **Allow for evolutionary architectures** — ออกแบบให้สถาปัตยกรรมปรับเปลี่ยน/วิวัฒนาการได้ตามเวลา
- **Drive architectures using data** — ใช้ข้อมูลจริงในการขับเคลื่อนการตัดสินใจด้านสถาปัตยกรรม
- **Improve through game days** — ปรับปรุงระบบผ่านการจำลองสถานการณ์ (game days)

## Design principles (1.14)
ภาพรวมความสัมพันธ์ของหลักการออกแบบ 4 กลุ่ม (แสดงเป็น flow diagram):
- **General design principles** (หลักการออกแบบทั่วไป) → นำไปสู่ →
  - **Improve through game days** (ปรับปรุงผ่านการทำ game days)
- **Pillar-specific design principles** (หลักการออกแบบเฉพาะแต่ละ pillar) → นำไปสู่ →
  - **Prepare for security events** (เตรียมพร้อมรับมือเหตุการณ์ด้านความปลอดภัย)

## Key terms
- Game day: การจำลองสถานการณ์ (เช่น ระบบล่ม, โหลดสูง) เพื่อทดสอบและฝึกซ้อมทีมในการรับมือ
- Auto scaling: การปรับขนาดทรัพยากรอัตโนมัติตามความต้องการใช้งานจริง แทนการประมาณ capacity ล่วงหน้า
