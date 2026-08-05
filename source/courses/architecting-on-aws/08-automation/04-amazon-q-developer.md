# Amazon Q Developer

**Amazon Q Developer** คือ generative AI-powered coding assistant ที่ช่วยสนับสนุนกระบวนการพัฒนาซอฟต์แวร์ ใช้งานได้ใน IDE ที่คุณถนัดเพื่อช่วยเพิ่มประสิทธิภาพการพัฒนา โดยถูก train ด้วยตัวอย่างและเอกสารคุณภาพสูงของ AWS มาหลายปี และยังสามารถ train เพิ่มด้วยโค้ดและระบบของบริษัทคุณเองได้

Amazon Q Developer สามารถสนทนาเกี่ยวกับโค้ด, เสนอ inline code completion, generate โค้ดใหม่ และสแกนโค้ดเพื่อหาช่องโหว่ด้าน security นอกจากนี้ยังช่วย upgrade/ปรับปรุงโค้ด เช่น อัปเดตภาษา, debug และ optimize ได้ คุณสามารถอธิบาย application ที่ต้องการสร้างด้วยภาษาธรรมชาติ (natural language) แล้ว Amazon Q Developer จะ generate และแนะนำโค้ดให้

Amazon Q Developer ช่วยให้คุณ:
- ค้นหาและแก้ bug
- Generate functional test
- ขอ sample code เพื่อเริ่มต้นงาน
- ตรวจสอบคำแนะนำและเลือกว่าจะ accept หรือ reject code snippet ที่เสนอมา

## Software Development Lifecycle (SDLC)

Amazon Q สนับสนุนนักพัฒนาในหลายขั้นตอนของ SDLC ดังนี้

### Code Generation

Amazon Q สามารถให้คำแนะนำโค้ดแบบ real time ได้ ขณะที่คุณเขียนโค้ด Amazon Q จะ generate คำแนะนำโดยอัตโนมัติจากโค้ดและ comment ที่มีอยู่ คำแนะนำที่ personalize ให้คุณอาจมีขนาดและขอบเขตต่างกัน ตั้งแต่ comment บรรทัดเดียวไปจนถึง function ที่สมบูรณ์ นอกจากนี้ยังสามารถ customize คำแนะนำที่ Amazon Q generate ให้ตรงกับเทคนิค algorithm เฉพาะขององค์กร, รูปแบบโค้ดขององค์กร (enterprise code style) และ internal library ของทีมพัฒนาได้

### Feature Development

ด้วย Amazon Q Developer คุณสามารถไปจาก natural language prompt สู่ application feature ได้ โดยมีคำแนะนำแบบ step-by-step ใน IDE โดยตรง Amazon Q Developer เข้าใจโครงสร้าง workspace ของคุณ และแบ่ง prompt ออกเป็นขั้นตอนการ implement แบบ logical ซึ่งอาจรวมถึงการ generate application code, test, API integration และอื่น ๆ คุณสามารถทำงานร่วมกับ Amazon Q Developer เพื่อ review และปรับปรุง implementation ได้ เมื่อพร้อมแล้วสามารถขอให้ Amazon Q Developer Agent ทำการ implement แต่ละขั้นตอนให้

**ตัวอย่าง demonstration (5 ขั้นตอน):**
1. เปิด Amazon Q Developer extension จาก sidebar แล้ว chat tab จะเปิดขึ้น พิมพ์ `/d` และเลือกฟีเจอร์ `/dev` ของ Amazon Q Developer จากนั้นพิมพ์ request ที่ต้องการ
2. **Plan** – Amazon Q Developer วิเคราะห์ทั้ง project และสร้างแผน (plan) ให้คุณ implement task ที่ร้องขอ อาจใช้เวลาสักครู่ขึ้นอยู่กับขนาด project เมื่อวิเคราะห์เสร็จ chat panel จะแสดง step-by-step plan ที่อธิบายการเปลี่ยนแปลงโค้ด ให้เลื่อนดูแต่ละขั้นตอนเพื่อ review
3. **Review diff** – หลังจาก review transformation summary แล้ว สามารถดูการเปลี่ยนแปลงที่ Amazon Q เสนอแบบ file-by-file diff view ได้ โค้ดที่ถูกลบจะแสดงเป็นสีแดง ส่วนโค้ดที่เพิ่มเข้ามาแสดงเป็นสีเขียว หาก Amazon Q Developer สร้างไฟล์ใหม่ที่ไม่เคยมีใน codebase เดิม diff view จะเปรียบเทียบไฟล์ใหม่กับไฟล์ว่าง โดยแสดงโค้ดใหม่ทั้งหมดเป็นส่วนที่เพิ่มเข้ามา
4. **Insert code** – เลื่อนไปท้าย chat แล้วเลือก Insert code ได้ หรือจะ regenerate โค้ดใหม่หากไม่พอใจคำแนะนำปัจจุบันก็ได้ หลังจากอัปเดตโค้ดเสร็จแล้ว สามารถปิด session ได้
5. **Test** – สุดท้ายรัน validation เพื่อตรวจสอบว่าการเปลี่ยนแปลงใหม่ไม่กระทบต่อ build เมื่อกระบวนการ clean install เสร็จสมบูรณ์ terminal จะแสดงข้อความ BUILD SUCCESS โค้ดของคุณก็พร้อม commit และ deploy ไปยัง environment เพื่อทดสอบต่อไป

### Security Scan

ฟีเจอร์ security scanning ที่มีอยู่ใน Amazon Q Developer ตรวจจับช่องโหว่ด้าน security ได้ทั้งในโค้ดที่ generate โดย AI และโค้ดที่นักพัฒนาเขียนเอง ระบบจะสแกนโค้ดเพื่อระบุช่องโหว่ที่อาจเกิดขึ้น รวมถึงช่องโหว่ที่หายาก (hard-to-find) ที่อาจถูกมองข้าม และให้คำแนะนำในการแก้ไข (remediation) security scan นี้ใช้งานร่วมกับ IDE ยอดนิยมได้ เช่น VS Code และ JetBrains รองรับภาษา Python, Java และ JavaScript

## ข้อมูลเพิ่มเติม

Amazon Q Developer เป็นส่วนหนึ่งของ AWS Toolkit สำหรับ VS Code และ JetBrains ปัจจุบันรองรับการสนทนาเป็นภาษาอังกฤษ และรองรับภาษาโปรแกรมมิ่ง Python, Java, JavaScript, TypeScript, C#, Go, Rust, PHP, Ruby, Kotlin, C, C++, shell scripting, SQL และ Scala

Amazon Q Developer ให้ความสำคัญกับ secure coding และแนวปฏิบัติด้าน responsible AI โดยถูก optimize สำหรับ Amazon API และ train อย่างละเอียดด้วยโค้ดของ Amazon และ open-source คุณสามารถเลือกที่จะ accept คำแนะนำแรก, สำรวจคำแนะนำเพิ่มเติม หรือเขียนโค้ดต่อเองก็ได้ สิ่งสำคัญคือต้อง review คำแนะนำแต่ละอันก่อน accept เพราะอาจต้องแก้ไขเพื่อให้ตรงกับ functionality ที่ต้องการจริง

## Key terms
- Amazon Q Developer: generative AI coding assistant ของ AWS สำหรับ IDE ต่าง ๆ
- Code Generation: ฟีเจอร์แนะนำโค้ดแบบ real time ตามบริบทของโค้ดที่มีอยู่
- Feature Development (/dev): ฟีเจอร์ที่แปลง natural language prompt เป็น implementation plan และโค้ดจริงแบบ step-by-step
- Security Scan: ฟีเจอร์สแกนหาช่องโหว่ด้าน security ในโค้ดและให้คำแนะนำการแก้ไข
