# Prepare

## Prepare (1.14)
สไลด์เกริ่นนำ: เพื่อเตรียมความพร้อมสำหรับ operational excellence ต้องเข้าใจ workloads และพฤติกรรมที่คาดหวัง จากนั้นออกแบบให้มองเห็น insight ของสถานะ และสร้าง procedures รองรับ

## Design telemetry (1.15)
ออกแบบ workload ให้ให้ข้อมูลที่จำเป็นต่อการเข้าใจ internal state เช่น metrics, logs, events, traces ครอบคลุมทุก component เพื่อสนับสนุน observability และการตรวจสอบปัญหา ทำซ้ำ (iterate) เพื่อพัฒนา telemetry ที่จำเป็นสำหรับ monitor health ของ workload ระบุเมื่อ outcomes มีความเสี่ยง และขับเคลื่อนการตอบสนองที่มีประสิทธิภาพ

Best practices:

- **Implement application telemetry** — รากฐานของ observability ของ workload แอปพลิเคชันควรส่ง telemetry ที่ให้ insight เกี่ยวกับสถานะและการบรรลุ business outcomes ประกอบด้วย metrics (ข้อมูล diagnostic เช่น การเรียก API, HTTP status codes, scaling events) และ logs
- **Implement and configure workload telemetry** — ใช้ข้อมูลนี้ช่วยตัดสินใจว่าต้องตอบสนองเมื่อใด
- **Implement user activity telemetry** — instrument โค้ดแอปพลิเคชันให้ส่งข้อมูล user activity เช่น click streams, transactions ที่เริ่ม/ยกเลิก/สำเร็จ ใช้เข้าใจรูปแบบการใช้งานและสร้าง synthetic activity สำหรับ monitor/test ใน production
- **Implement dependency telemetry** — ออกแบบและตั้งค่า workload ให้ส่งข้อมูลสถานะของ resources ภายนอกที่ workload พึ่งพา เช่น external databases, DNS, network connectivity
- **Implement transaction traceability** — implement โค้ดและ config ให้ส่ง events ที่เกิดจาก single logical operations และรวมข้ามขอบเขตต่าง ๆ ของ workload สร้าง maps เพื่อดูว่า traces ไหลผ่าน workload/services อย่างไร ช่วยระบุความสัมพันธ์ระหว่าง components และวิเคราะห์ปัญหา

## Design for operations (1.16)
นำแนวทางที่ช่วยเพิ่ม flow ของการเปลี่ยนแปลงเข้าสู่ production และทำให้ refactoring, fast feedback on quality และ bug fixing เป็นไปได้ — ช่วยเร่งการเปลี่ยนแปลงที่เป็นประโยชน์ จำกัดปัญหาที่ถูก deploy และขับเคลื่อนการระบุ/แก้ไขปัญหาที่เกิดจาก deployment ได้อย่างรวดเร็ว บน AWS สามารถมอง workload ทั้งหมด (applications, infrastructure, policy, governance, operations) เป็นโค้ดได้ทั้งหมด

Best practices:

- **Use version control** — เริ่ม track การเปลี่ยนแปลงและ releases
- **Test and validate changes** — ทดสอบทุกการเปลี่ยนแปลงก่อน deploy เพื่อลด error ครอบคลุมทั้ง application code, infrastructure, configuration และ security — สร้าง feedback loops เพื่อปรับปรุงคุณภาพซอฟต์แวร์
- **Use configuration management systems** — ลด error จาก manual processes และลดความพยายามในการ deploy changes
- **Use build and deployment management systems** — เช่นเดียวกัน ลด error และความพยายาม
- **Perform patch management** — ได้ฟีเจอร์ใหม่ แก้ปัญหา และรักษา compliance ควร automate patch management แนะนำให้ใช้ immutable infrastructure และ deploy ใน verified known good states หากทำไม่ได้ค่อย patch in place
- **Share design standards** — แชร์ design standards และ best practices ข้ามทีมเพื่อเพิ่มความตระหนักรู้และประโยชน์สูงสุดจากความพยายามพัฒนา ต้อง document และอัปเดตตามสถาปัตยกรรมที่วิวัฒนาการ พร้อมมีกลไกขอเพิ่ม/แก้ไข/ยกเว้น standards
- **Implement practices to improve code quality** — เช่น test-driven development, code reviews, standards adoption, pair programming — รวมเข้ากับ CI/CD process
- **Use multiple environments** — ใช้ทดลอง พัฒนา และทดสอบ workload โดยเพิ่มระดับ controls เมื่อเข้าใกล้ production
- **Make frequent, small, reversible changes** — ลด scope และผลกระทบของการเปลี่ยนแปลง ช่วยแก้ปัญหาได้เร็วขึ้นและมีทางเลือกในการ rollback
- **Fully automate integration and deployment** — automate การ build, deploy, test ของ workload เพื่อลด error และความพยายาม

## Mitigate deployment risks (1.17)
Best practices เพื่อลดความเสี่ยงจากการ deploy:

- **Plan for unsuccessful changes** — วางแผน revert กลับสู่ known good state หรือแก้ไขใน production หากการเปลี่ยนแปลงไม่ได้ผลตามคาด ลดเวลาในการ recovery
- **Test and validate changes** — ทดสอบและ validate ผลลัพธ์ในทุกขั้นตอนของ lifecycle
- **Use deployment management systems** — track และ implement การเปลี่ยนแปลง ลด error จาก manual processes
- **Test using limited deployments** — เช่น canary testing หรือ one-box deployments เพื่อยืนยันผลลัพธ์ก่อน deploy เต็มรูปแบบ
- **Deploy using parallel environments** — implement การเปลี่ยนแปลงบน parallel environment แล้วค่อย transition ไปยัง environment ใหม่ คง environment เดิมไว้จนยืนยันว่า deploy สำเร็จ ช่วยลดเวลา recovery เพราะ rollback ได้
- **Deploy frequent, small, reversible changes** — ลด scope ของการเปลี่ยนแปลง แก้ปัญหาและ remediate ได้เร็วขึ้น
- **Fully automate integration and deployment** — ลด error และความพยายามในการ deploy
- **Automate testing and rollback** — automate การทดสอบ deployed environments และ automate rollback กลับสู่ known good state เมื่อ outcome ไม่เป็นไปตามคาด

## Operational readiness and change management (1.18)
ประเมินความพร้อมด้าน operational readiness ของ workload, processes, procedures และ personnel เพื่อเข้าใจความเสี่ยงด้าน operations และจัดการ flow ของการเปลี่ยนแปลงในสภาพแวดล้อมต่าง ๆ

Best practices:

- **Ensure a consistent review of operational readiness** — ใช้กระบวนการที่สม่ำเสมอ (checklist แบบ manual หรือ automated) เพื่อรู้ว่าพร้อม go live หรือไม่ — เรียกว่า **Operational Readiness Review (ORR)** ซึ่งเป็นกระบวนการตรวจสอบด้วย checklist และ self-service experience ให้ทีม certify workload ของตนเอง ครอบคลุม architectural recommendations, operational processes, event management, release quality — Correction of Error (COE) process เป็นตัวขับเคลื่อนสำคัญของรายการเหล่านี้
- **Ensure personnel capability** — มีกลไกยืนยันว่ามีบุคลากรที่ผ่านการฝึกอบรมเพียงพอในการสนับสนุน workload ต้องได้รับการฝึกอบรมบน platform/services ที่ประกอบเป็น workload
- **Use runbooks to perform procedures** — runbooks คือกระบวนการที่ documented เพื่อบรรลุผลลัพธ์เฉพาะเจาะจง เป็นชุดขั้นตอนที่ทำตามได้
- **Use playbooks to investigate issues** — playbooks ช่วยระบุ root cause ที่ runbook จะใช้แก้ไข เป็นส่วนสำคัญของ incident response plans ครอบคลุมสถานการณ์หลากหลายตั้งแต่ failed deployments ถึง security incidents
- **Make informed decisions to deploy systems and changes** — มีกระบวนการรองรับทั้งกรณีสำเร็จและไม่สำเร็จ ใช้ pre-mortem (จำลองความล้มเหลวล่วงหน้า) เพื่อวางแผนบรรเทาผลกระทบ ประเมิน benefits/risks และยืนยันว่าสอดคล้องกับ governance
- **Facilitate support plans for production workloads** — จัดหา support plan ที่เหมาะสมให้ software/services ที่ workload พึ่งพา document วิธี request support และมีกลไกอัปเดต point of contact

## Key terms
- Telemetry: ข้อมูล (metrics, logs, events, traces) ที่บอกสถานะภายในของ workload
- ORR (Operational Readiness Review): กระบวนการตรวจสอบความพร้อมของ workload ก่อน go live
- Runbook: ขั้นตอนที่ documented เพื่อบรรลุผลลัพธ์เฉพาะเจาะจง
- Playbook: แนวทางกระบวนการแก้ไขปัญหา ใช้ระบุ root cause
- Canary deployment / one-box deployment: การทดสอบ deploy แบบจำกัดวงก่อนขยายเต็มรูปแบบ
