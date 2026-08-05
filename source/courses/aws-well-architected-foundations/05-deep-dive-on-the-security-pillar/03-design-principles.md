# Security Design Principles

## Security Design Principles (1.6)
สไลด์เกริ่นนำ: ต่อไปผู้เรียนจะได้เจาะลึก design principles ของ security pillar

## Security — design principles (1.7)
มีหลักการ (principles) ที่ช่วยเสริมความแข็งแกร่งให้กับ workload security บน cloud ทั้งหมด 7 ข้อ:

1. **Implement a strong identity foundation** — ใช้หลักการ least privilege และ enforce separation of duties พร้อม authorization ที่เหมาะสมสำหรับทุก interaction กับ AWS resources รวมถึง centralize identity management และลดการพึ่งพา long-term/static credentials
2. **Enable traceability** — monitor, alert และ audit การกระทำ/การเปลี่ยนแปลงต่อสภาพแวดล้อมแบบ real time พร้อม integrate การเก็บ log และ metric เข้ากับระบบเพื่อ investigate และ take action อัตโนมัติ
3. **Apply security at all layers** — ใช้แนวทาง defense-in-depth ด้วย security controls หลายชั้น ครอบคลุมทุก layer เช่น edge of network, VPC, load balancing, compute instances, operating systems, applications และ code
4. **Automate security best practices** — ใช้กลไก security แบบ software-based ที่เป็น automated เพื่อช่วยให้ scale ได้อย่างปลอดภัย รวดเร็ว และคุ้มค่า เช่น implement controls ที่กำหนดและจัดการเป็น code ใน version-controlled templates
5. **Protect data in transit and at rest** — จัดประเภทข้อมูลตาม sensitivity level และใช้กลไกที่เหมาะสม เช่น encryption, tokenization และ access control
6. **Keep people away from data** — ใช้ mechanisms/tools เพื่อลดหรือขจัดความจำเป็นในการเข้าถึงหรือประมวลผลข้อมูลโดยตรงจากคน เพื่อลดความเสี่ยงจาก mishandling หรือ human error
7. **Prepare for security events** — เตรียมพร้อมรับมือ incident ด้วย incident management/investigation policy และ process ที่สอดคล้องกับความต้องการขององค์กร รวมถึงทำ incident response simulations และใช้ automated tools เพื่อเร่งการ detect, investigate และ recover

## Key terms
- Least privilege: หลักการให้สิทธิ์เท่าที่จำเป็นต่อการทำงานเท่านั้น
- Defense in depth: แนวทางป้องกันหลายชั้นเพื่อลดความเสี่ยง
- Traceability: ความสามารถในการติดตาม/ตรวจสอบการกระทำและการเปลี่ยนแปลงในระบบ
