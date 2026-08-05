# Operate

## Operate (1.19)
สไลด์เกริ่นนำ: ความสำเร็จคือการบรรลุ business outcomes ตาม metrics ที่กำหนด การเข้าใจ health ของ workload และ operations ช่วยระบุได้ว่าเมื่อใดที่ organizational/business outcomes กำลังจะมีความเสี่ยงหรือมีความเสี่ยงแล้ว เพื่อตอบสนองได้อย่างเหมาะสม

## Understanding workload health (1.20)
กำหนด เก็บ และวิเคราะห์ **workload metrics** เพื่อมองเห็น workload events และดำเนินการได้อย่างเหมาะสม ทีมควรเข้าใจ health ของ workload ได้ง่าย ใช้ metrics ที่อิงจาก workload outcomes เพื่อ insight ที่เป็นประโยชน์ และสร้าง dashboards ที่มีมุมมองทั้งด้านธุรกิจและเทคนิค

Best practices:

- **Identify key performance indicators (KPIs)** — อิงจาก business outcomes (เช่น order rate, customer retention rate, profit vs. operating expense) และ customer outcomes (เช่น customer satisfaction) ใช้ประเมินความสำเร็จของ workload
- **Define workload metrics** — วัด health ของ workload จากการบรรลุ business outcomes/KPIs และสถานะของ components/applications
- **Collect and analyze workload metrics** — รวบรวม metrics จาก applications/components ไปยังศูนย์กลาง ใช้ dashboards และ analytics tools วิเคราะห์ telemetry เพื่อกำหนด workload health ทำ periodic workload health reviews กับ stakeholders
- **Establish workload metrics baselines** — ช่วยเข้าใจ health/performance ระบุ under/over-performing applications และช่วย mitigate ปัญหาก่อนกลายเป็น incident เป็นพื้นฐานสำหรับ pattern ของกิจกรรมและ anomaly detection
- **Learn expected patterns of activity for workload** — เพื่อระบุพฤติกรรมผิดปกติและตอบสนองได้เหมาะสม
- **Alert when workload outcomes are at risk** — ใช้ threshold หรือ event ที่ระบุไว้ล่วงหน้าเพื่อ trigger การตอบสนองอัตโนมัติ
- **Alert when workload anomalies are detected** — จาก pattern ที่วิเคราะห์ได้ตามเวลา
- **Validate the achievement of outcomes and KPI/metric effectiveness** — สร้าง business-level view ของ workload operations เพื่อระบุพื้นที่ที่ต้องปรับปรุง

## Understanding operational health (1.21)
เช่นเดียวกับ workload health แต่เน้นที่ **operations metrics**:

- **Identify KPIs** — อิงจาก business outcomes (เช่น new features delivered) และ customer outcomes (เช่น customer support cases)
- **Define operations metrics** — เช่น successful/failed deployments, mean time to detect (MTTD), mean time to recovery (MTTR)
- **Collect and analyze operations metrics / Establish baselines** — ใช้ baselines เป็นค่าคาดหวังเพื่อเปรียบเทียบและระบุกิจกรรมที่ under/over-performing
- **Learn expected patterns of activity for operations** — ระบุพฤติกรรมผิดปกติ
- **Alert when operations outcomes are at risk** — operations outcomes คือกิจกรรมใด ๆ ที่สนับสนุน workload ใน production (ตั้งแต่ deploy เวอร์ชันใหม่ถึงกู้คืนจาก outage) ต้องให้ความสำคัญเทียบเท่า business outcomes alert ต้องทันเวลาและปฏิบัติได้จริง ควรอ้างอิง runbook/playbook เสมอ (ไม่เช่นนั้นจะเกิด alert fatigue)
- **Alert when operations anomalies are detected**
- **Validate the achievement of outcomes, KPI, and metric effectiveness** — สร้าง business-level view ของ operations activities และปรับปรุง KPIs/metrics ตามความเหมาะสม

## Responding to events (1.22)
ควรคาดการณ์ (anticipate) operational events ทั้งที่วางแผนไว้ (เช่น sales promotions, deployments, failure tests) และไม่ได้วางแผน (เช่น utilization surge, component failures) ใช้ runbooks/playbooks ที่มีอยู่เพื่อตอบสนองอย่างสม่ำเสมอ ควรมี role/team ที่รับผิดชอบ alert แต่ละประเภท

องค์กรควรมีกระบวนการจัดการ **events, incidents, และ problems**:
- **Events** — สิ่งที่เกิดขึ้นใน workload แต่อาจไม่ต้องมีการแทรกแซง
- **Incidents** — events ที่ต้องมีการแทรกแซง
- **Problems** — events ที่เกิดซ้ำและต้องแทรกแซงหรือไม่สามารถแก้ไขได้

Best practices:

- **Use a process for event, incident, and problem management** — เมื่อมีหลาย events ที่ต้องแทรกแซงพร้อมกัน ให้จัดการตัวที่สำคัญต่อธุรกิจก่อน (ผลกระทบอาจรวมถึงการสูญเสียชีวิต/บาดเจ็บ ความสูญเสียทางการเงิน หรือความเสียหายต่อชื่อเสียง)
- **Have a process per alert** — เจ้าของ alert ที่ชัดเจนพร้อม escalation
- **Define escalation paths** — ระบุ owner ของแต่ละ action, ระบุว่าเมื่อไหร่ต้องใช้ human decision และเตรียม pre-approve ล่วงหน้าเพื่อลด MTTR
- **Define a customer communication plan for outages** — วางแผนและทดสอบแผนสื่อสารเพื่อแจ้งลูกค้า/stakeholders ระหว่าง outage สื่อสารทั้งตอนเกิดผลกระทบและตอนกลับสู่ปกติ
- **Communicate status through dashboards** — จัดทำ dashboards ที่เหมาะกับกลุ่มเป้าหมาย (internal technical teams, leadership, customers)
- **Automate responses to events** — ลด error จาก manual processes และตอบสนองได้รวดเร็วสม่ำเสมอ
- **Prioritize operational events based on business impact**

## Key terms
- KPI (Key Performance Indicator): ตัวชี้วัดความสำเร็จที่อิงจาก business/customer outcomes
- MTTD / MTTR: Mean Time to Detect / Mean Time to Recovery — เวลาเฉลี่ยในการตรวจจับ/กู้คืนจาก incident
- Alert fatigue: ภาวะที่ทีมเพิกเฉยต่อ alert เพราะมี alert ที่ไม่ actionable มากเกินไป
- Event / Incident / Problem: ระดับความรุนแรงของเหตุการณ์ที่ต้องจัดการต่างกัน
