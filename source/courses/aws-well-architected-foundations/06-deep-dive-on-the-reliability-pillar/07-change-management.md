# Change Management

## Change Management (1.17)
สไลด์เกริ่นนำเข้าสู่ best practice area ที่สาม: **Change Management**

## Monitor workload resources (1.18)
- **Monitor all components for the workload (generation)** — เฝ้าติดตาม components ทั้งหมดของ workload (การสร้างข้อมูล/generation)
- **Define and calculate metrics (aggregation)** — กำหนดและคำนวณ metrics (aggregation)
- **Perform analytics** — ทำ analytics
- **Conduct reviews regularly** — ทำการ review อย่างสม่ำเสมอ
- **Automate responses (real-time processing and alarming)** — ทำการตอบสนองอัตโนมัติ (real-time processing และ alarming)
- **Monitor end-to-end tracing of requests through your system** — เฝ้าติดตาม end-to-end tracing ของ requests ผ่านระบบ
- **Send notifications (real-time processing and alarming)** — ส่งการแจ้งเตือน (real-time processing และ alarming)

## Design a workload to adapt to changes in demand (1.19)
- **Obtain resources upon detection that more resources are needed for a workload** — จัดหา resources เพิ่มเมื่อตรวจพบว่า workload ต้องการ resources มากขึ้น
- **Load test your workload** — ทำ load test กับ workload
- **Use automation when obtaining or scaling resources** — ใช้ automation เมื่อจัดหาหรือ scale resources
- **Obtain resources upon detection of impairment to a workload** — จัดหา resources เมื่อตรวจพบความเสียหาย (impairment) ต่อ workload

## Implement change (1.20)
- **Use runbooks for standard activities such as deployment** — ใช้ runbooks สำหรับกิจกรรมมาตรฐาน เช่น การ deploy
- **Integrate functional testing as part of your deployment** — รวม functional testing เข้ากับกระบวนการ deploy
- **Deploy using immutable infrastructure** — deploy โดยใช้ immutable infrastructure
- **Deploy changes with automation** — deploy การเปลี่ยนแปลงด้วย automation
- **Integrate resiliency testing as part of your deployment** — รวม resiliency testing เข้ากับกระบวนการ deploy

(สไลด์ทั้ง 3 แสดงเป็นรายการหัวข้อ ไม่มีคำอธิบายเพิ่มเติมต่อท้ายแต่ละข้อในข้อมูลดิบที่ดึงมาได้)

## Key terms
- Runbook: เอกสาร/สคริปต์ขั้นตอนมาตรฐานสำหรับดำเนินการงานปฏิบัติการ
- Immutable infrastructure: สถาปัตยกรรมที่ไม่มีการแก้ไข resource ที่ deploy แล้ว แต่จะสร้างใหม่แทนเมื่อมีการเปลี่ยนแปลง
- Resiliency testing: การทดสอบความสามารถของระบบในการทนต่อความล้มเหลว
