# Organization

## Organization (1.10)
สไลด์เกริ่นนำ: **Organization** คือ best practice area แรกของ operational excellence

## Organization priorities (1.11)
ทีมงานต้องเข้าใจ workload ทั้งหมด บทบาทของตนเองใน workload นั้น และเป้าหมายทางธุรกิจร่วมกัน (shared business goals) เพื่อกำหนด priorities ที่จะขับเคลื่อนความสำเร็จทางธุรกิจ priorities ที่ชัดเจนจะช่วยเพิ่มประโยชน์สูงสุดจากความพยายามของทีม ควรทบทวน priorities อย่างสม่ำเสมอเพื่ออัปเดตตามความต้องการขององค์กรที่เปลี่ยนไป

Best practices ที่ควรพิจารณา:

- **Evaluate external customer needs** — ให้ stakeholders หลัก (business, development, operations) เข้ามาร่วมกำหนดจุดโฟกัสตาม external customer needs เพื่อให้เข้าใจ operations support ที่จำเป็นในการบรรลุ business outcomes
- **Evaluate internal customer needs** — เช่นเดียวกันแต่เน้นที่ internal customer needs
- **Evaluate the threat landscape** — ประเมินภัยคุกคามต่อธุรกิจ เช่น competition, business risk/liabilities, operational risks และ information security threats รักษาข้อมูลปัจจุบันไว้ใน risk registry และนำผลกระทบของความเสี่ยงมาพิจารณาจุดโฟกัส
- **Evaluate trade-offs** — ประเมินผลกระทบของ trade-offs ระหว่างผลประโยชน์ที่แข่งขันกัน หรือแนวทางทางเลือก เพื่อช่วยตัดสินใจอย่างมีข้อมูล (เช่น เร่ง speed to market มากกว่า cost optimization)
- **Evaluate compliance requirements** — compliance requirements ทั้งด้าน regulatory, industry และ internal เป็นตัวขับเคลื่อนสำคัญของ priorities ตัวอย่าง compliance standards เช่น PCI DSS, FedRAMP, HIPAA
- **Manage benefits and risks** — ช่วยตัดสินใจอย่างมีข้อมูลว่าจะโฟกัสความพยายามที่จุดใด เช่น อาจ deploy workload ที่ยังมี unresolved issues เพื่อปล่อยฟีเจอร์ใหม่ที่สำคัญให้ลูกค้าได้ก่อน แล้วค่อยบรรเทา (mitigate) ความเสี่ยงที่เกี่ยวข้อง
- **Evaluate governance requirements** — governance คือชุดของ policies/rules/frameworks ที่บริษัทใช้เพื่อบรรลุเป้าหมายธุรกิจ ส่งผลต่อการเลือกเทคโนโลยีหรือวิธีดำเนินงาน conformance คือความสามารถในการแสดงให้เห็นว่าได้ทำตาม governance requirements แล้ว

## Operating models (1.12)
Diagram แสดง operating models โดยมี 2 แกน:

- **แกนตั้ง**: Applications (business software — custom developed หรือ commercial off-the-shelf) และ Platform (compute, network, storage, middleware, runtime, data operations, security)
- **แกนนอน**: Engineering (develop, build, test — กิจกรรมทั้งหมดที่ใช้นิยามและ validate platform, infrastructure หรือ business applications) และ Operations (deploy, operate, manage — กิจกรรมทั้งหมดที่ใช้ deploy และ support platform/infrastructure/applications ใน production)

รวมกันแล้วได้ 4 quadrants: Application engineering, Application operations, Platform engineering, Platform operations — มี operating model รูปแบบอื่นที่แสดงว่าความรับผิดชอบเหล่านี้กระจายไปยังทีมต่าง ๆ อย่างไร (ดูรายละเอียดเพิ่มเติมได้ที่เอกสาร operational excellence pillar)

## Organizational culture (1.13)
การสนับสนุนสมาชิกในทีมให้ทำงานได้อย่างมีประสิทธิภาพมากขึ้นเพื่อสนับสนุน business outcome:

- **Executive sponsorship** — senior leadership กำหนดความคาดหวังให้องค์กรอย่างชัดเจนและประเมินความสำเร็จ เป็น sponsor/advocate/driver ในการนำ best practices มาใช้และวิวัฒนาการองค์กร
- **Empower team members / Escalation is encouraged** — workload owner กำหนด guidance และ scope ให้ทีมสามารถตอบสนองเมื่อ outcomes มีความเสี่ยง มีกลไก escalation เมื่อเหตุการณ์อยู่นอกขอบเขตที่กำหนด ควร escalate แต่เนิ่น ๆ และบ่อยครั้งเพื่อป้องกันไม่ให้ความเสี่ยงกลายเป็น incident การสื่อสารควรทันเวลา ชัดเจน และนำไปปฏิบัติได้ (timely, clear, actionable) — บันทึกกิจกรรมที่วางแผนไว้ใน change calendar/maintenance schedule
- **Experimentation is encouraged** — การทดลองเป็นตัวเร่งให้ไอเดียใหม่กลายเป็นผลิตภัณฑ์/ฟีเจอร์ได้ ช่วยเร่งการเรียนรู้และทำให้ทีมมีส่วนร่วม แม้ผลลัพธ์จะไม่เป็นไปตามคาด ทีมงานจะไม่ถูกลงโทษจากการทดลองที่ล้มเหลว
- **Team members are empowered and encouraged to maintain and grow skill sets** — ทีมต้องพัฒนาทักษะเพื่อรองรับเทคโนโลยีใหม่และการเปลี่ยนแปลงความต้องการ สนับสนุนการรับ certifications และการทำ cross-training เพื่อลดความเสี่ยงเมื่อสูญเสียบุคลากรที่มีความรู้เฉพาะทาง จัดเวลาสำหรับการเรียนรู้อย่างเป็นระบบ
- **Resource teams appropriately** — รักษา capacity ของทีมและจัดหา tools/resources ให้เพียงพอ การมอบหมายงานเกินกำลัง (overtasking) เพิ่มความเสี่ยงจาก human error การลงทุนใน automation ช่วยขยายประสิทธิภาพของทีม
- **Diverse opinions are encouraged and sought within and across teams** — ใช้ความหลากหลายข้ามองค์กรเพื่อมุมมองที่หลากหลาย เพิ่ม innovation ท้าทายสมมติฐาน และลด confirmation bias ส่งเสริม inclusion, diversity, accessibility

## Key terms
- Operating model: กรอบที่แสดงว่าความรับผิดชอบด้าน engineering/operations กระจายไปยังทีมต่าง ๆ อย่างไร
- Governance: ชุด policies/rules/frameworks ที่ใช้บรรลุเป้าหมายธุรกิจ
- Conformance: ความสามารถในการแสดงว่าได้ปฏิบัติตาม governance requirements
- Escalation: กลไกการยกระดับปัญหาไปยังผู้มีอำนาจตัดสินใจเมื่อเหตุการณ์อยู่นอกขอบเขต
