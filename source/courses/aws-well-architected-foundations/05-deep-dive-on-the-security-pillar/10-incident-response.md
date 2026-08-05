# Incident Response

## Incident Response (1.26)
best practice area ต่อไปคือ **incident response** แม้จะมี preventive/detective controls ที่แข็งแรง องค์กรก็ควรมี process สำหรับตอบสนองและลดผลกระทบจาก security incidents สถาปัตยกรรมของ workload มีผลอย่างมากต่อความสามารถของทีมในการ isolate/contain systems และ restore operations กลับสู่สถานะที่ดีในระหว่างเกิด incident

## Design goals of cloud response (1.27)
process/mechanism ทั่วไปของ incident response เช่นที่กำหนดใน **NIST SP 800-61 Computer Security Incident Handling Guide** มีความสำคัญ นอกจากนี้ควรพิจารณา design goals ต่อไปนี้สำหรับการตอบสนอง incident บน cloud:

- **Establish response objectives** — ทำงานร่วมกับ stakeholders, legal counsel และผู้บริหารเพื่อกำหนดเป้าหมายของการตอบสนอง incident เช่น containment/mitigation, การกู้คืน resources, การรักษาข้อมูลสำหรับ forensics และ attribution
- **Document plans** — สร้างแผนสำหรับตอบสนอง สื่อสาร และกู้คืนจาก incident
- **Respond using the cloud** — implement response patterns ณ จุดที่ event/data เกิดขึ้น เก็บรักษา logs, snapshots และหลักฐานอื่น ๆ โดย copy ไปยัง centralized security cloud account ใช้ tags/metadata และกลไกบังคับ retention policies (เช่นใช้คำสั่ง `dd` เพื่อทำสำเนาข้อมูลแบบสมบูรณ์สำหรับการสืบสวน)
- **Use redeployment mechanisms** — หากปัญหาความปลอดภัยเกิดจาก misconfiguration การแก้ไขอาจทำได้เร็วเพียงแค่ redeploy resources ด้วย configuration ที่ถูกต้อง ควรออกแบบ response mechanisms ให้รันซ้ำได้อย่างปลอดภัย
- **Automate where possible** — สร้างกลไก triage/response อัตโนมัติสำหรับ issue ที่เกิดซ้ำ ใช้ human response สำหรับ incident ที่ unique/sensitive
- **Choose scalable solutions** — ให้สอดคล้องกับ scale ขององค์กรและลดเวลาระหว่าง detection กับ response
- **Learn and improve your process** — เมื่อพบ gap ใน process/tools/people ให้วางแผนแก้ไข การทำ simulation เป็นวิธีที่ปลอดภัยในการหา gap และปรับปรุง process

## Educate (1.28)
Automated processes ช่วยให้ทีม security มีเวลามุ่งเน้นมาตรการเพิ่มความปลอดภัย และมีเวลามากขึ้นสำหรับ correlate events, ฝึก simulation, พัฒนา response procedures ใหม่, ทำ research และพัฒนาทักษะ/เครื่องมือใหม่ ๆ แม้จะมี automation มากขึ้น ทีม security ก็ยังต้องได้รับการศึกษาต่อเนื่อง:

- **Development skills** — สอนทักษะ programming (เช่น Python) รวมถึง source control, version control และ CI/CD process เพื่อช่วยเร่ง automation ขององค์กรและลดข้อผิดพลาด
- **ฝึกทีมให้ชำนาญ AWS security services** — เพื่อลด response time และสร้างความมั่นใจให้ทีม พร้อมจัดการศึกษาต่อเนื่องเกี่ยวกับ services/capabilities ใหม่ ๆ
- **Maintain application awareness** — ฝึกทีม incident response ให้เข้าใจ workload/environment ที่ตนดูแล เช่น logs ที่ถูกส่งออก, ข้อมูลใน logs, traffic flow และกลไก authentication/authorization วิธีที่ดีที่สุดคือการเรียนรู้แบบ hands-on เช่น **incident-response game days**
- ต้อง maintain การฝึกอบรมที่จำเป็นสำหรับทั้งองค์กร — security awareness เป็นแนวป้องกันด่านสำคัญ ทุกคนควรได้รับการฝึกให้รายงานพฤติกรรมน่าสงสัยต่อทีม security เพื่อตรวจสอบเพิ่มเติม

## Prepare, simulate, iterate (1.29)
- **Pre-provision access** — ทีม incident response ต้องมี access ที่เตรียมไว้ล่วงหน้าอย่างเหมาะสมสำหรับปฏิบัติหน้าที่ก่อนเกิด event โดย tools, access และ plans ทั้งหมดควรถูก document และทดสอบ
- **Identify key personnel and external resources** — ระบุบุคลากรภายใน/ภายนอกและข้อผูกพันทางกฎหมายที่จะช่วยองค์กรตอบสนอง incident
- **Develop incident management plans**
- **Prepare forensic capabilities** — เข้าใจว่า forensic investigation เข้ากับ response plan อย่างไร กำหนดหลักฐานที่ต้องเก็บและเครื่องมือที่ใช้ รวมถึงพิจารณา automate การ contain/recover incident
- แปลง playbook เป็น **code-based solution** เพื่อให้ responders หลายคนใช้ automate response และลดความคลาดเคลื่อน จากนั้นพัฒนาให้ automate เต็มรูปแบบ ให้ code ถูกเรียกโดย alert/event โดยตรง (event-driven response) และเติมข้อมูลลง security systems อัตโนมัติ (เช่น block IP ที่น่าสงสัยผ่าน AWS WAF หรือ AWS Network Firewall)
- **Run game days** (simulations/exercises) — กิจกรรมภายในที่จำลองสถานการณ์จริงเพื่อฝึกแผน/procedure ของ incident management โดยใช้ tools/techniques เดียวกับสถานการณ์จริง เป็นการเตรียมพร้อมและปรับปรุง response capability อย่างต่อเนื่อง

## Key terms
- NIST SP 800-61: แนวทางมาตรฐานสำหรับการจัดการ incident ด้าน security
- Game day: กิจกรรมจำลองสถานการณ์เพื่อฝึกซ้อมทีม
- Event-driven response: การตอบสนอง incident ที่ถูก trigger อัตโนมัติจาก event/alert โดยไม่ต้องรอมนุษย์
