# Amazon EC2 Pricing Options

บทเรียนนี้พูดถึงตัวเลือกด้านราคา (pricing option) ต่าง ๆ ของบริการ compute อย่าง EC2

## Pricing options

การจะปรับให้ compute resource คุ้มค่าที่สุดทำได้อย่างไร? EC2 instance มีตัวเลือกด้านราคาหลายแบบ ให้คุณสามารถสมดุลระหว่าง commitment กับความยืดหยุ่น (flexibility) และต้นทุน ได้แก่ (flashcards):

- **On-Demand Instances** — จ่ายค่า compute capacity เป็นรายวินาทีหรือรายชั่วโมง โดยไม่มีข้อผูกมัดระยะยาว (no long-term commitments)
- **Savings Plans** — ให้ส่วนลดต้นทุนแลกกับข้อผูกมัด (commitment) ที่แน่นอนในช่วงเวลาหนึ่ง คือ 1 ปี หรือ 3 ปี
- **Spot Instances** — ใช้ spare cloud capacity ที่เหลือ ช่วยประหยัดได้สูงสุดถึง 90%

## Spot Instances และ use case

**Spot Instance** คือ instance ที่ใช้ spare EC2 host capacity Spot Instance ช่วยประหยัดได้สูงสุดถึง 90% เมื่อเทียบกับ On-Demand Instance เนื่องจาก Spot Instance อนุญาตให้ขอใช้ EC2 instance ที่ไม่ได้ถูกใช้งาน (unused) ในราคาที่ลดลงมาก จึงช่วยลดต้นทุน Amazon EC2 สำหรับ workload ที่ยืดหยุ่นได้

**Interruption** คือเหตุการณ์ที่ไม่มี capacity เหลือสำหรับ request ของคุณที่ราคาสูงสุดที่ตั้งไว้ (maximum price) คุณจะได้รับการแจ้งเตือนล่วงหน้า 2 นาทีก่อนเกิดเหตุการณ์นี้ และ workload ของคุณจะถูกขัดจังหวะ (interrupt) หลังจากผ่านไป 2 นาที

Spot Instance เหมาะกับ workload ที่ fault-tolerant, ยืดหยุ่น (flexible), loosely coupled หรือ stateless

### Use case สำหรับ Spot Instances (hotspots)

- **Image and media rendering** — จัดการและ scale rendering workload ทั้งแบบ on-premises หรือ cloud ได้อย่างคุ้มค่า ด้วย capacity ที่แทบไม่จำกัด
- **Big data and analytics** — เร่งความเร็วงาน big data, machine learning และ natural language processing (NLP) ด้วย Spot Instance ซึ่งให้ทั้งความเร็ว, การขยายขนาด (scale) และประหยัดต้นทุนอย่างมาก เหมาะกับงานวิเคราะห์ข้อมูลแบบเร่งด่วนและ hyper-scale ที่ time-critical
- **Web services** — deploy EC2 Spot Fleet ไว้หลัง load balancer เพื่อ scale ได้ถึงหมื่น instance รองรับ service request นับพันล้านครั้ง

## Key terms
- On-Demand Instance: จ่ายตามการใช้งานจริง ไม่มีข้อผูกมัดระยะยาว
- Savings Plans: ส่วนลดแลกกับการผูกมัดใช้งาน 1 หรือ 3 ปี
- Spot Instance: ใช้ capacity ส่วนเกินของ AWS ในราคาถูกกว่ามาก แต่อาจถูก interrupt ได้
- Interruption: เหตุการณ์ที่ AWS เรียกคืน Spot Instance เมื่อไม่มี capacity เพียงพอ (แจ้งเตือนล่วงหน้า 2 นาที)
- Spot Fleet: กลุ่มของ Spot Instance (และ On-Demand) ที่จัดการร่วมกันเพื่อรองรับ workload
