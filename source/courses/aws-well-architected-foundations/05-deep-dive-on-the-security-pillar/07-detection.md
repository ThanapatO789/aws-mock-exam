# Detection

## Detection (1.17)
best practice area ต่อไปคือ **detection** — ใช้ **detective controls** เพื่อระบุภัยคุกคามหรือ incident ที่อาจเกิดขึ้น เป็นส่วนสำคัญของ governance framework และสนับสนุน quality process, legal/compliance obligation และความพยายามในการระบุ/ตอบสนองภัยคุกคาม

## Detection — best practices (1.18)
Detection ประกอบด้วย 2 ส่วน: การตรวจจับ configuration changes ที่ไม่คาดคิด/ไม่ต้องการ และการตรวจจับพฤติกรรมที่ไม่คาดคิด ช่วยระบุ security misconfiguration, threat หรือพฤติกรรมผิดปกติ เป็นส่วนสำคัญของ security lifecycle

Best practices:

1. **Configure service and application logging** — เก็บ security event logs จาก services/applications เป็นหลักการพื้นฐานสำหรับ audit, investigation และการใช้งานด้าน operations (ตามข้อกำหนด GRC — governance, risk, compliance)
2. **Analyze logs, findings, and metrics centrally** — ทีม security operations ใช้ search tools เพื่อค้นหา event ที่น่าสนใจซึ่งอาจบ่งชี้ unauthorized activity หรือการเปลี่ยนแปลงที่ไม่ตั้งใจ (การวิเคราะห์/รายงานอย่างเดียวไม่เพียงพอต่อปริมาณข้อมูลจาก architecture ที่ซับซ้อน)
3. **Automate response to events** — ใช้ automation ในการ investigate และ remediate events เพื่อลด human effort/error และช่วย scale ความสามารถในการ investigate พร้อมทบทวนและปรับปรุง automation tools อย่างสม่ำเสมอ
4. **Implement actionable security events** — สร้าง alerts ที่ส่งถึงทีมและสามารถนำไปปฏิบัติได้ (actionable) โดยมีข้อมูลที่เกี่ยวข้องครบถ้วน สำหรับแต่ละ detective mechanism ควรมี process (runbook/playbook) สำหรับ investigate ประกอบด้วย

## Key terms
- Detective controls: กลไกที่ใช้ตรวจจับภัยคุกคามหรือเหตุการณ์ผิดปกติ
- GRC (Governance, Risk, Compliance): กรอบงานด้านธรรมาภิบาล ความเสี่ยง และการปฏิบัติตามข้อกำหนด
- Runbook / Playbook: เอกสารขั้นตอนการตอบสนองต่อเหตุการณ์
