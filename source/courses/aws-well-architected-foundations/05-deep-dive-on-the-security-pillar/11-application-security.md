# Application Security

## Application Security (1.30)
best practice area สุดท้ายคือ **application security** — security เป็นหัวข้อที่ครอบคลุมทุกพื้นที่ของเทคโนโลยี ต่อจาก identity, infrastructure protection, data protection และ incident response ต่อไปผู้เรียนจะได้เรียนรู้ application security

## Application security — best practices (1.31)
การฝึกอบรมคน (train people), ทดสอบด้วย automation, เข้าใจ dependencies และ validate security properties ของ tools/applications ช่วยลดโอกาสเกิดปัญหา security ใน production workloads

- **Train for application security** — ให้การฝึกอบรมแก่ builders ในองค์กรเกี่ยวกับแนวทาง secure development/operation ของ applications การนำ security-focused development practices มาใช้ช่วยลดปัญหาที่ตรวจพบเฉพาะช่วง security review
- **Automate testing throughout the development and release lifecycle** — รวมถึง testing ด้าน security properties ตลอด lifecycle เพื่อระบุปัญหาที่อาจเกิดขึ้นก่อนที่จะ release อย่างสม่ำเสมอ
- **Perform regular penetration testing** — ช่วยระบุปัญหาซอฟต์แวร์ที่ automated testing หรือ manual code review อาจตรวจไม่พบ และช่วยประเมินประสิทธิภาพของ detective controls โดยพยายามทดสอบว่าซอฟต์แวร์อาจทำงานผิดคาดได้อย่างไร เช่น เปิดเผยข้อมูลที่ควรถูกป้องกัน หรือให้สิทธิ์กว้างกว่าที่ควร
- **Perform manual code review** — ช่วยยืนยันว่าไม่ใช่แค่คนเขียนโค้ดคนเดียวที่ตรวจสอบคุณภาพโค้ด
- **Centralize services for packages and dependencies** — จัดหา service ส่วนกลางให้ builder teams ใช้ดึง software packages/dependencies เพื่อ validate packages ก่อนถูกรวมเข้ากับซอฟต์แวร์ และเป็นแหล่งข้อมูลสำหรับ software analysis
- **Perform software deployments programmatically** — ลดโอกาสที่ deployment ล้มเหลวหรือเกิดปัญหาจาก human error
- **Regularly assess security properties of the pipelines** — นำหลักการของ security pillar มาใช้กับ pipelines โดยเฉพาะเรื่อง separation of permissions
- **Build a program that embeds security ownership in workload teams** — เสริมพลังให้ builder teams ตัดสินใจด้าน security ของซอฟต์แวร์ที่สร้างเอง (โดยทีม security ยังคง validate การตัดสินใจนั้นระหว่าง review) ช่วยให้สร้าง workload ที่ปลอดภัยได้เร็วขึ้น และส่งเสริมวัฒนธรรมความเป็นเจ้าของ (ownership culture)

## Key terms
- Penetration testing: การทดสอบเจาะระบบเพื่อค้นหาช่องโหว่
- CI/CD pipeline: กระบวนการ build/deploy ซอฟต์แวร์อัตโนมัติ
- Security ownership: การให้ทีมพัฒนามีส่วนรับผิดชอบด้าน security ของงานที่ตนสร้าง
