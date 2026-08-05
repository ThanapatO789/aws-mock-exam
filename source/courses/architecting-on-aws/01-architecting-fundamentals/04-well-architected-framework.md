# Well-Architected Framework

บทเรียนนี้พูดถึง **Well-Architected Framework** รวมถึงแนวทางปฏิบัติที่ดี (best practices) สำหรับสร้างแอปพลิเคชันบนคลาวด์

## บทบาทหน้าที่ของ AWS Architect (AWS Architect responsibilities)

**AWS Architects** มีหน้าที่หลัก 3 ด้าน คือ วางแผน (plan) ค้นคว้า/วิเคราะห์ (research) และสร้าง (build) โดย solutions architect รับผิดชอบการบริหารจัดการสถาปัตยกรรม cloud computing ขององค์กร ต้องมีความรู้เชิงลึกเกี่ยวกับหลักการทางสถาปัตยกรรมและบริการต่าง ๆ

รายละเอียดของแต่ละหน้าที่:

**Plan (วางแผน)**
- กำหนดกลยุทธ์ด้านเทคนิคของคลาวด์ร่วมกับผู้บริหารฝ่ายธุรกิจ (set technical cloud strategy with business leads)
- วิเคราะห์โซลูชันให้ตรงกับความต้องการทางธุรกิจ (analyze solutions for business needs and requirements)

**Research (ค้นคว้า/วิเคราะห์)**
- ศึกษาข้อกำหนดของบริการคลาวด์และความต้องการของ workload
- ทบทวนสถาปัตยกรรม workload ที่มีอยู่เดิม
- ออกแบบ prototype ของโซลูชัน

**Build (สร้าง)**
- ออกแบบแผนงานการเปลี่ยนผ่าน (transformation roadmap) พร้อมกำหนด milestone, work stream และผู้รับผิดชอบ
- บริหารจัดการการนำไปใช้งานจริงและการย้ายระบบ (adoption and migration)

## AWS Well-Architected Framework คืออะไร

**AWS Well-Architected Framework** ช่วยให้สถาปนิกคลาวด์สร้างโครงสร้างพื้นฐานของแอปพลิเคชันที่ปลอดภัย มีประสิทธิภาพสูง ทนทาน (resilient) และมีประสิทธิภาพ (efficient) โดย Framework นี้มอบแนวทางและชุด best practices ที่สอดคล้องกัน สำหรับให้ลูกค้าและพาร์ตเนอร์ของ AWS ใช้ประเมินสถาปัตยกรรมและนำการออกแบบไปปรับใช้ให้รองรับการขยายตัวได้ในระยะยาว

Framework นี้ตั้งอยู่บน **6 เสาหลัก (six pillars)**:

1. **Operational excellence** — ความเป็นเลิศด้านการปฏิบัติงาน
2. **Security** — ความปลอดภัย
3. **Reliability** — ความน่าเชื่อถือ/ทนทานของระบบ
4. **Performance efficiency** — ประสิทธิภาพการทำงาน
5. **Cost optimization** — การบริหารต้นทุนให้เหมาะสม
6. **Sustainability** — ความยั่งยืน

## AWS Well-Architected Tool

**AWS Well-Architected Tool** เป็นเครื่องมือที่ใช้งานได้ฟรีผ่าน AWS Management Console ช่วยให้สามารถประเมิน workload อย่างสม่ำเสมอ ระบุปัญหาความเสี่ยงสูง (high risk issues) และบันทึกการปรับปรุงต่าง ๆ ได้ เป็นเครื่องมือแบบ self-service ที่ออกแบบมาเพื่อช่วยสถาปนิกและผู้จัดการทบทวน workload บน AWS โดยไม่จำเป็นต้องพึ่งพา AWS solutions architect (SA) โดยตรง ช่วยให้ตรวจสอบสถานะของ workload ที่มีอยู่ เทียบกับแนวทางปฏิบัติทางสถาปัตยกรรม (architectural best practices) ล่าสุดของ AWS ทั้งนี้ตัวเครื่องมือถูกสร้างขึ้นบนพื้นฐานของ AWS Well-Architected Framework

**ขั้นตอนการใช้งาน:** Define Workload (กำหนด workload) → Conduct architectural review (ทำการทบทวนสถาปัตยกรรม) → Apply best practices (นำแนวทางปฏิบัติที่ดีไปปรับใช้)

## สรุป

หลังจากได้ภาพรวมพื้นฐานของการออกแบบสถาปัตยกรรมแอปพลิเคชันด้วย AWS แล้ว บทถัดไปจะเป็น Knowledge Check สั้น ๆ เพื่อทบทวนหัวข้อเหล่านี้ ก่อนจะได้ฝึกปฏิบัติจริงผ่าน AWS Labs

## Key terms
- AWS Architect / Solutions Architect: ผู้รับผิดชอบออกแบบและบริหารสถาปัตยกรรม cloud computing ขององค์กร
- Well-Architected Framework: กรอบแนวทาง 6 เสาหลักของ AWS สำหรับประเมินและออกแบบสถาปัตยกรรมที่ดี
- Operational excellence: เสาหลักด้านการดำเนินงานอย่างมีประสิทธิภาพและปรับปรุงต่อเนื่อง
- Security: เสาหลักด้านการปกป้องข้อมูลและระบบ
- Reliability: เสาหลักด้านความสามารถของระบบในการทำงานได้ตามคาดหมายอย่างสม่ำเสมอ
- Performance efficiency: เสาหลักด้านการใช้ทรัพยากรอย่างมีประสิทธิภาพให้ตรงกับความต้องการ
- Cost optimization: เสาหลักด้านการบริหารจัดการต้นทุนให้คุ้มค่าที่สุด
- Sustainability: เสาหลักด้านผลกระทบต่อสิ่งแวดล้อมและความยั่งยืนในระยะยาว
- AWS Well-Architected Tool: เครื่องมือฟรีใน AWS Management Console สำหรับประเมิน workload เทียบกับ Well-Architected Framework
- Principle of least privilege: หลักการให้สิทธิ์การเข้าถึงเท่าที่จำเป็นเท่านั้น อยู่ภายใต้เสาหลัก Security
