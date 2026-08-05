# Operational Excellence — Design Principles

## Operational Excellence (1.6)
สไลด์เกริ่นนำ: หลังจากเข้าใจว่า operational excellence pillar คืออะไรแล้ว ต่อไปจะเจาะลึก **design principles** ของ pillar นี้

## Operational excellence design principles (1.7)
มี design principles ทั้งหมด **5 ข้อ** สำหรับ operational excellence บน cloud:

1. **Perform operations as code** — บน cloud คุณสามารถใช้ engineering discipline แบบเดียวกับที่ใช้กับ application code มาใช้กับทั้ง environment ได้ นิยาม workload ทั้งหมด (applications, infrastructure ฯลฯ) เป็นโค้ด และอัปเดตด้วยโค้ด สามารถเขียน script operations procedures และ automate การเรียกใช้งานเพื่อตอบสนองต่อ events ได้ ช่วยลด human error และทำให้การตอบสนองต่อ events มีความสม่ำเสมอ
2. **Make frequent, small, reversible changes** — ออกแบบ workload ให้สามารถอัปเดต component ได้อย่างสม่ำเสมอ เพื่อเพิ่ม flow ของการเปลี่ยนแปลงที่เป็นประโยชน์เข้าสู่ workload เปลี่ยนแปลงทีละน้อย (small increments) ที่สามารถย้อนกลับได้ (reversible) เพื่อช่วยระบุและแก้ไขปัญหาโดยไม่กระทบลูกค้า (ถ้าเป็นไปได้)
3. **Refine operations procedures frequently** — เมื่อใช้ operations procedures ให้มองหาโอกาสในการปรับปรุงอยู่เสมอ เมื่อ workload มีวิวัฒนาการ ก็ควรปรับ procedures ให้เหมาะสมตามไปด้วย จัดให้มี game days อย่างสม่ำเสมอเพื่อตรวจสอบและยืนยันว่า procedures ทั้งหมดยังมีประสิทธิภาพ และทีมงานคุ้นเคยกับมัน
4. **Anticipate failure** — ทำ pre-mortem exercises เพื่อระบุแหล่งที่มาของความล้มเหลวที่อาจเกิดขึ้น เพื่อกำจัดหรือลดผลกระทบ ทดสอบ failure scenarios และยืนยันความเข้าใจต่อผลกระทบ ทดสอบ response procedures เพื่อให้แน่ใจว่ามีประสิทธิภาพและทีมงานคุ้นเคย จัดให้มี game days เพื่อทดสอบการตอบสนองของ workload และทีมต่อ simulated events
5. **Learn from all operational failures** — ขับเคลื่อนการปรับปรุงผ่านบทเรียน (lessons learned) จาก operational events และ failures ทั้งหมด แชร์สิ่งที่เรียนรู้ข้ามทีมและทั่วทั้งองค์กร

## Key terms
- Operations as code: การนิยามและจัดการ workload/operations ทั้งหมดในรูปแบบโค้ด
- Reversible change: การเปลี่ยนแปลงที่สามารถย้อนกลับ (rollback) ได้หากเกิดปัญหา
- Pre-mortem: กิจกรรมจำลองความล้มเหลวล่วงหน้าเพื่อวางแผนป้องกัน/บรรเทาผลกระทบ
- Game day: กิจกรรมจำลองเหตุการณ์เพื่อทดสอบ procedures และความพร้อมของทีม
