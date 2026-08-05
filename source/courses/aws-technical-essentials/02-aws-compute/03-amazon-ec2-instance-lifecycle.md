# Amazon EC2 Instance Lifecycle

EC2 instance จะเปลี่ยนสถานะ (transition) ระหว่างสถานะต่างๆ ตั้งแต่วินาทีที่สร้างจนกระทั่งถูก terminate

## สถานะของ EC2 instance

1. **Pending**: เมื่อ launch instance จะเข้าสู่สถานะ pending ซึ่งยังไม่เริ่มคิดค่าบริการ (billing) เป็นขั้นตอนที่ AWS ทำการเตรียมการต่างๆ เช่น คัดลอกเนื้อหา AMI ไปยัง root device และจัดสรร networking components ที่จำเป็น
2. **Running**: เมื่อ instance รันอยู่ พร้อมใช้งาน และเป็นจุดที่เริ่มคิดค่าบริการ สามารถทำ action อื่นๆ ได้ เช่น reboot, terminate, stop, stop-hibernate
3. **Reboot**: การ reboot ต่างจากการทำ stop แล้ว start เพราะ reboot instance เทียบเท่ากับการ reboot ระบบปฏิบัติการ instance จะยังคงรักษา public DNS name (IPv4), private/public IPv4 address และ IPv6 address (ถ้ามี) ไว้บน host computer เดิม รวมถึงข้อมูลใน instance store volume
4. **Stop / Stop-hibernate**: เมื่อ stop instance จะเข้าสู่สถานะ stopping แล้วตามด้วย stopped เปรียบเสมือนการปิดแล็ปท็อป สามารถ stop และ start instance ได้หากมี Amazon EBS volume เป็น root device เมื่อ stop แล้ว start ใหม่ instance อาจถูกวางบน physical server ใหม่ แต่ยังคงรักษา private IPv4 address (และ IPv6 ถ้ามี) ไว้ได้ ส่วน **stop-hibernate** จะบันทึกข้อมูลล่าสุดลง memory ทำให้กระบวนการ start ครั้งถัดไปเร็วขึ้น
5. **Terminate**: เมื่อ terminate instance, instance store จะถูกลบ และสูญเสียทั้ง public/private IP address จะไม่สามารถเข้าถึง machine ได้อีก เมื่อสถานะเปลี่ยนเป็น shutting down หรือ terminated จะหยุดคิดค่าบริการทันที

### ความแตกต่างระหว่าง stop และ stop-hibernate
เมื่อ stop instance จะเข้าสู่สถานะ stopping จนถึง stopped โดย AWS จะไม่คิดค่าบริการ usage หรือ data transfer หลัง stop แล้ว แต่ยังคงคิดค่า storage ของ Amazon EBS volume ขณะที่ instance อยู่ในสถานะ stopped สามารถปรับแก้บาง attribute ได้ เช่น instance type เมื่อ stop ข้อมูลใน instance memory (RAM) จะสูญหาย

เมื่อ stop-hibernate instance, Amazon EC2 จะสั่งให้ระบบปฏิบัติการทำ hibernation (suspend-to-disk) ซึ่งบันทึกเนื้อหาจาก instance memory (RAM) ลงใน EBS root volume การ hibernate ทำได้เฉพาะเมื่อเปิดใช้งาน hibernation และ instance ตรงตามเงื่อนไขที่กำหนด (hibernation prerequisites)

## Pricing
วิธีหนึ่งในการลดต้นทุนของ Amazon EC2 คือการเลือก pricing option ที่เหมาะสมกับลักษณะการรันแอปพลิเคชัน AWS มีตัวเลือกด้านราคาหลากหลายรูปแบบสำหรับสถานการณ์ workload ที่แตกต่างกัน

### On-Demand Instances
จ่ายค่า compute capacity ตามรายชั่วโมงหรือรายวินาที ไม่มีข้อผูกมัดระยะยาวหรือต้องจ่ายล่วงหน้า เริ่มคิดค่าบริการเมื่อ instance รันอยู่ และหยุดคิดเมื่อ instance หยุดหรือ terminate สามารถเพิ่ม/ลด compute capacity ได้ตามความต้องการของแอปพลิเคชัน

เหมาะสำหรับ:
- ผู้ที่ต้องการต้นทุนต่ำและความยืดหยุ่นโดยไม่ต้องจ่ายล่วงหน้าหรือผูกมัดระยะยาว
- แอปพลิเคชันที่มี workload ระยะสั้น ไม่แน่นอน หรือ spiky ที่ขัดจังหวะไม่ได้
- แอปพลิเคชันที่กำลังพัฒนาหรือทดสอบบน Amazon EC2 เป็นครั้งแรก

### Spot Instances
สำหรับแอปพลิเคชันที่มีเวลาเริ่ม/สิ้นสุดยืดหยุ่นได้ Amazon EC2 เสนอ Spot Instances ซึ่งสามารถขอใช้ compute capacity ส่วนเกิน (spare) ได้ในราคาลดสูงสุดถึง 90% เมื่อเทียบกับราคา On-Demand

เหมาะสำหรับ:
- แอปพลิเคชันที่มีเวลาเริ่ม/สิ้นสุดยืดหยุ่น
- แอปพลิเคชันที่คุ้มค่าเฉพาะเมื่อราคา compute ต่ำมาก
- ผู้ใช้ที่มี workload แบบ fault-tolerant หรือ stateless

ผู้ใช้กำหนดราคาสูงสุดที่ยอมจ่ายต่อชั่วโมง เทียบกับราคา Spot ปัจจุบันที่ AWS กำหนด ราคา Spot จะปรับเปลี่ยนตามแนวโน้ม supply/demand ระยะยาวของ Spot Instance capacity หากราคาที่ตั้งไว้สูงกว่าราคา Spot ปัจจุบันและมี capacity ว่าง จะได้รับ instance

### Savings Plans
เป็นรูปแบบราคาที่ยืดหยุ่น ให้ราคาต่ำเมื่อผูกมัดใช้งานในระดับคงที่เป็นระยะเวลา 1 ปีหรือ 3 ปี ครอบคลุมการใช้งาน Amazon EC2, AWS Lambda และ AWS Fargate ประหยัดได้สูงสุดถึง 72% ของค่าใช้จ่าย compute บน AWS

เหมาะสำหรับ:
- Workload ที่มีการใช้งานสม่ำเสมอและคงที่
- ลูกค้าที่ต้องการใช้ instance type และ compute solution ที่แตกต่างกันในหลายๆ ที่ตั้ง
- ลูกค้าที่สามารถผูกมัดค่าใช้จ่ายกับ Amazon EC2 เป็นระยะ 1 หรือ 3 ปี

### Reserved Instances
สำหรับแอปพลิเคชันที่มีการใช้งานคงที่ (steady state) ซึ่งอาจต้องการ reserved capacity ประหยัดได้สูงสุดถึง 72% เมื่อเทียบกับ On-Demand มีตัวเลือกการจ่าย 3 แบบ: All Upfront, Partial Upfront, No Upfront และเลือกระยะเวลา 1 ปีหรือ 3 ปีได้

ประเภทของ Reserved Instances:
- **Standard Reserved Instances**: ส่วนลดสูงสุด (ถึง 72%) เหมาะกับ workload ที่คงที่
- **Convertible Reserved Instances**: ส่วนลด (ถึง 54%) และสามารถเปลี่ยน attribute ของ Reserved Instance ได้ หากผลการแลกเปลี่ยนสร้าง Reserved Instance ที่มีมูลค่าเท่ากันหรือมากกว่า เหมาะกับ workload ที่คงที่เช่นกัน
- **Scheduled Reserved Instances**: ใช้งานได้ภายในช่วงเวลาที่จองไว้ ช่วยให้จับคู่ capacity reservation กับตารางเวลาที่เกิดขึ้นซ้ำได้ (เช่น เพียงบางส่วนของวัน สัปดาห์ หรือเดือน)

### Dedicated Hosts
เป็น physical Amazon EC2 server ที่จัดสรรไว้เฉพาะสำหรับผู้ใช้เท่านั้น ช่วยลดต้นทุนได้เพราะสามารถใช้ software license ที่ผูกกับ server เดิมได้ (เช่น Windows Server, SQL Server, Oracle license) และช่วยตอบโจทย์ข้อกำหนดด้าน compliance ทำงานร่วมกับ AWS License Manager ซึ่งช่วยจัดการ software license (รวมถึง Microsoft Windows Server และ SQL Server license)

- สามารถซื้อแบบ on-demand (รายชั่วโมง)
- สามารถซื้อแบบ Reservation ได้ ลดราคาสูงสุดถึง 70% เมื่อเทียบกับ On-Demand

## Resources
- AWS user guide: Amazon EC2: Instance Lifecycle
- AWS user guide: Hibernation Prerequisites
- AWS website: Amazon EC2 Pricing
- AWS website: Amazon EC2 On-Demand Pricing
- AWS website: Amazon EC2 Spot Instances Pricing
- AWS website: Amazon EC2 Reserved Instances Pricing

## Key terms
- Pending / Running / Reboot / Stop / Stop-hibernate / Terminate: สถานะต่างๆ ในวงจรชีวิต (lifecycle) ของ EC2 instance
- On-Demand Instances: จ่ายตามการใช้งานจริง ไม่มีข้อผูกมัด
- Spot Instances: ใช้ compute capacity ส่วนเกินในราคาถูก แต่ไม่รับประกันความต่อเนื่อง
- Savings Plans: ผูกมัดการใช้งานระยะยาวเพื่อแลกส่วนลด ครอบคลุม EC2/Lambda/Fargate
- Reserved Instances: จองการใช้งานระยะยาวเพื่อแลกส่วนลด แบ่งเป็น Standard, Convertible, Scheduled
- Dedicated Hosts: physical server เฉพาะสำหรับผู้ใช้รายเดียว รองรับ license แบบผูกกับ server
