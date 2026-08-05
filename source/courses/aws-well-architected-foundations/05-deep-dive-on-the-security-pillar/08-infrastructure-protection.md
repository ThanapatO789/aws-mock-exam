# Infrastructure Protection

## Infrastructure Protection (1.19)
best practice area ต่อไปคือ **infrastructure protection** ครอบคลุม control methodologies เช่น defense in depth ที่จำเป็นเพื่อให้เป็นไปตาม best practices และข้อกำหนดขององค์กร/กฎระเบียบ เป็นส่วนสำคัญของ information security program ที่ช่วยให้แน่ใจว่า systems/services ใน workload ได้รับการปกป้องจากการเข้าถึงที่ไม่ตั้งใจ/ไม่ได้รับอนุญาตและช่องโหว่ที่อาจเกิดขึ้น

## Protecting networks (1.20)
Users (ทั้งใน workforce และลูกค้า) อาจอยู่ที่ไหนก็ได้ จึงต้องปรับจากโมเดลดั้งเดิมที่เชื่อถือทุกคน/ทุกสิ่งที่มี access ไปสู่แนวทาง **Zero Trust** — โมเดลที่ application components/microservices ถือเป็นหน่วยแยกจากกัน โดยไม่มี component ใดเชื่อถือ component อื่นโดยอัตโนมัติ

Best practices:

1. **Create network layers** — จัดกลุ่ม components ที่มี sensitivity requirements ร่วมกันไว้เป็น layers เพื่อลด scope ของผลกระทบจาก unauthorized access
2. **Control traffic at all layers** — พิจารณา connectivity requirements ของแต่ละ component เมื่อออกแบบ network topology
3. **Automate network protection mechanisms** — สร้าง self-defending network โดยอิงจาก threat intelligence และ anomaly detection
4. **Implement inspection and protection** — ตรวจสอบและกรอง (inspect/filter) traffic ในทุก layer

## Protecting compute (1.21)
Compute resources ได้แก่ EC2 instances, containers, Lambda functions, database services, IoT devices และอื่น ๆ แต่ละประเภทต้องการวิธีป้องกันที่แตกต่างกัน แต่มีกลยุทธ์ร่วมกัน ได้แก่ defense in depth, vulnerability management, reduction in attack surface, automation of configuration/operation และ performing actions at a distance

Best practices:

- **Perform vulnerability management** — สแกนและ patch ช่องโหว่ในโค้ด dependencies และ infrastructure บ่อย ๆ เพื่อป้องกันภัยคุกคามใหม่
- **Reduce attack surface** — จำกัดการเข้าถึงที่ไม่ตั้งใจด้วยการ harden operating systems และลด components/libraries/external services ที่ใช้ให้น้อยที่สุด และใช้ managed services เช่น **Amazon RDS**, **Lambda**, **Amazon ECS** เพื่อลดภาระงาน security maintenance ตาม shared responsibility model
- **Automate protective compute mechanisms** — ทั้ง vulnerability management, reduction in attack surface และ resource management เพื่อลดความเสี่ยงจาก human error
- **Help people perform actions at a distance** — ลดการเข้าถึงแบบ interactive เพื่อลด human error และความเสี่ยงจากการ configure/manage ด้วยมือ ใช้กลไกเช่น code signing เพื่อยืนยันว่า software/code/libraries มาจากแหล่งที่เชื่อถือได้และไม่ถูกดัดแปลง

## Key terms
- Zero Trust: โมเดล security ที่ไม่เชื่อถือ component/user ใดโดยอัตโนมัติ ต้องยืนยันตัวตนทุกครั้ง
- Attack surface: จุดที่ระบบมีความเสี่ยงต่อการถูกโจมตี
- Code signing: การเซ็นรับรอง code เพื่อยืนยันแหล่งที่มาและความสมบูรณ์
