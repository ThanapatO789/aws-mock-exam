# Security Foundations

## Security Foundations (1.10)
สไลด์เกริ่นนำ: Security foundations คือ best practice area แรก

## Shared responsibility (1.11)
**Security และ compliance เป็นความรับผิดชอบร่วมกัน (shared responsibility)** ระหว่าง AWS และลูกค้า โมเดลนี้ช่วยลดภาระด้าน operations ของลูกค้า เพราะ AWS จะ operate, manage และ control components ตั้งแต่ host operating system, virtualization layer ไปจนถึง physical security ของ facilities

- ลูกค้ารับผิดชอบ guest operating system (รวมถึง update/security patch) และ application software ที่เกี่ยวข้อง รวมถึง configuration ของ security group firewall
- ความรับผิดชอบแตกต่างกันไปตาม service ที่เลือกใช้ การ integrate เข้ากับ IT environment และกฎหมาย/ระเบียบที่เกี่ยวข้อง

โมเดลนี้มักเรียกว่า **security "of" the cloud** เทียบกับ **security "in" the cloud**:

- **AWS รับผิดชอบ security "of" the cloud** — ปกป้อง infrastructure ที่รัน services ทั้งหมดใน AWS Cloud (hardware, software, networking, facilities)
- **ลูกค้ารับผิดชอบ security "in" the cloud** — ขึ้นอยู่กับ AWS Cloud services ที่เลือกใช้ ซึ่งกำหนดปริมาณงาน configuration ที่ลูกค้าต้องทำ

ตัวอย่าง:
- **Amazon EC2** (infrastructure as a service) — ลูกค้าต้องทำ security configuration/management ทั้งหมดเอง เช่น จัดการ guest OS (update/patch), application software, และ configuration ของ security group บนแต่ละ instance
- **Amazon S3** และ **Amazon DynamoDB** (abstracted services) — AWS operate infrastructure layer, OS และ platform ให้ ลูกค้าเข้าถึงผ่าน endpoint เพื่อเก็บ/ดึงข้อมูล โดยลูกค้ารับผิดชอบจัดการข้อมูลของตนเอง (รวมถึง encryption options) จัดประเภท assets และใช้ **AWS Identity and Access Management (IAM)** เพื่อกำหนด permissions ที่เหมาะสม

## AWS account management and separation (1.12)
เป็น best practice ที่จะจัดระเบียบ workloads แยกตาม **accounts** และจัดกลุ่ม accounts โดยอิงตาม function, compliance requirements หรือ common set of controls มากกว่าที่จะสะท้อนโครงสร้างองค์กร

- ใน AWS, **account เป็น hard boundary** — แนะนำให้แยก production workloads ออกจาก development/test workloads ด้วยการแยก account
- ควร manage accounts, ตั้งค่า controls, และ configure services/resources จากส่วนกลาง (centrally)
- ใช้กลยุทธ์ multi-account เพื่อสร้าง common guardrails และ isolation ระหว่าง environments (production, development, test) — การแยกระดับ account ให้ isolation boundary ที่แข็งแรงสำหรับ security, billing และ access
- ควร secure **root user**: root user คือ user ที่มีสิทธิ์สูงสุดในบัญชี AWS (full admin access ต่อทุก resource) และในบางกรณีไม่สามารถถูกจำกัดด้วย security policies ได้ แนวทางลดความเสี่ยง ได้แก่ ปิด programmatic access ของ root user, ตั้ง controls ที่เหมาะสมสำหรับ root user, และหลีกเลี่ยงการใช้ root user ในงานประจำ

## Operating your workloads securely (1.13)
เพื่อ operate workload อย่างปลอดภัย ต้องนำ overarching best practices ไปใช้กับทุกพื้นที่ของ security โดยนำ requirements/processes ที่กำหนดไว้ใน operational excellence มาประยุกต์ใช้ในทุกพื้นที่ Best practices ได้แก่:

- **Identify and validate control objectives** — จาก compliance requirements และความเสี่ยงที่ระบุจาก threat model ให้กำหนดและ validate control objectives/controls ที่ต้องใช้กับ workload อย่างต่อเนื่อง
- **Stay up to date with the latest security threats** — ติดตาม AWS และ industry security recommendations เพื่อพัฒนา security posture ของ workload
- **Automate testing and validation of security controls in pipelines** — สร้าง secure baselines/templates ที่ทดสอบและ validate เป็นส่วนหนึ่งของ build/pipeline
- **Identify threats and prioritize mitigations using a threat model** — ทำ threat modeling เพื่อระบุและปรับปรุง register ของภัยคุกคามและ mitigation ที่เกี่ยวข้อง พร้อม prioritize และปรับใช้ security control mitigations เพื่อ prevent, detect, respond
- ประเมินและนำ security services/features จาก AWS และ AWS Partners มาใช้เพื่อพัฒนา security posture ของ workload

## Key terms
- Shared responsibility model: โมเดลแบ่งความรับผิดชอบด้าน security ระหว่าง AWS ("of the cloud") และลูกค้า ("in the cloud")
- Root user: user ที่มีสิทธิ์สูงสุดในบัญชี AWS
- Threat model: แบบจำลองที่ใช้ระบุและจัดลำดับความสำคัญของภัยคุกคามและวิธี mitigation
