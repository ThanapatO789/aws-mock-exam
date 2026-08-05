# Amazon EC2 Auto Scaling

**Amazon EC2 Auto Scaling** ช่วยรักษา application availability โดยเพิ่มหรือลด EC2 instance โดยอัตโนมัติตาม scaling policy ที่กำหนด

## Capacity issues และ Active-passive vs Active-active

เพิ่ม availability และ reachability ได้ด้วยการเพิ่ม server อีกตัว แต่ในระบบ **active-passive** เมื่อ traffic มาก ต้อง scale แบบ vertical (เพิ่มขนาด server) ซึ่งต้องทำตามขั้นตอน: หยุด passive instance (ไม่กระทบแอปเพราะไม่รับ traffic) → เปลี่ยนขนาด/ประเภท instance แล้ว start ใหม่ → สลับ traffic ไปยัง instance ที่เพิ่งอัปเดต (กลายเป็น active) → หยุด/เปลี่ยนขนาด/start instance เดิม (เพื่อให้ทั้งสองตัวตรงกัน) เมื่อ traffic ลดลงก็ต้องทำแบบเดียวกันย้อนกลับ — ขั้นตอนนี้เป็นงาน manual ที่เยอะ และ vertical scaling มีขีดจำกัดบน เมื่อถึงขีดจำกัดต้องสร้างระบบ active-passive อีกชุดและแบ่ง request/functionality ซึ่งอาจต้อง rewrite แอปพลิเคชันขนานใหญ่

ระบบ **active-active** ช่วยแก้ปัญหานี้ได้ดีกว่า เพราะเมื่อ request เยอะเกินไปสามารถ scale แบบ horizontal (เพิ่ม server) ได้ทันที เนื่องจาก Employee Directory Application ถูกออกแบบเป็น stateless (ไม่เก็บ client session ที่ server) การมี 2 หรือ 4 server จึงไม่ต้องแก้แอปพลิเคชันเพิ่ม เพียงสร้าง instance เพิ่มเมื่อจำเป็นและปิดเมื่อ traffic ลดลง — **Amazon EC2 Auto Scaling** ทำหน้าที่นี้โดยอัตโนมัติ โดยสร้างและลบ EC2 instance ตาม metric จาก Amazon CloudWatch

active-active system มีข้อดีกว่า active-passive หลายด้าน การปรับแอปพลิเคชันให้เป็น stateless ทำให้ scalable ได้ดีขึ้น

## Traditional scaling vs Auto scaling

วิธีดั้งเดิม: ซื้อและเตรียม server ให้พอรองรับ traffic ช่วงพีค ซึ่งหมายความว่าช่วงกลางคืนอาจมี capacity เกินความจำเป็น (เสียเงินโดยเปล่าประโยชน์) การปิด server ตอนกลางคืนช่วยประหยัดแค่ค่าไฟ แต่ cloud ทำงานต่างออกไปด้วยโมเดล pay-as-you-go — ต้องปิดบริการที่ไม่ใช้ (โดยเฉพาะ EC2 instance แบบ on-demand) สามารถเพิ่ม/ลด server แบบ manual ตามเวลาที่คาดการณ์ได้ หรือให้ **Amazon EC2 Auto Scaling** ช่วย scale infrastructure และรักษา high availability ให้ ทำให้จ่ายเฉพาะสิ่งที่แอปพลิเคชันต้องการจริง ๆ

Auto scaling features (flashcard):
- **Automatic scaling** — scale in/out อัตโนมัติตาม demand
- **Scheduled scaling** — scale ตามตารางเวลาที่ผู้ใช้กำหนด
- **Fleet management** — แทนที่ EC2 instance ที่ไม่ healthy โดยอัตโนมัติ
- **Predictive scaling** — ใช้ machine learning (ML) ช่วยกำหนดตารางจำนวน EC2 instance ที่เหมาะสม
- **Purchase options** — รองรับ purchase model, instance type, และ Availability Zone หลายแบบ
- **Amazon EC2 availability** — มาพร้อมกับบริการ Amazon EC2

**ELB กับ EC2 Auto Scaling**: บริการ ELB integrate กับ EC2 Auto Scaling ได้อย่างไร้รอยต่อ เมื่อ instance ใหม่ถูกเพิ่มหรือลบออก ELB จะปรับปรุงการ route traffic ให้อัตโนมัติ

## องค์ประกอบหลักของ Amazon EC2 Auto Scaling (3 ส่วน)

แต่ละส่วนตอบคำถามหลักหนึ่งข้อ:
- **Launch template หรือ launch configuration**: resource ใดที่ควร scale อัตโนมัติ
- **Amazon EC2 Auto Scaling groups**: resource ควรถูก deploy ที่ไหน
- **Scaling policies**: เมื่อไรควรเพิ่ม/ลด resource

### Launch templates and configurations
การสร้าง EC2 instance ต้องการพารามิเตอร์หลายตัว เช่น AMI ID, instance type, security group, EBS volume เพิ่มเติม ฯลฯ ข้อมูลเหล่านี้ถูกเก็บไว้ใน **launch template** ซึ่งใช้ได้ทั้งสร้าง instance แบบ manual หรือใช้กับ EC2 Auto Scaling รองรับ versioning ทำให้ rollback ได้เร็วหากมีปัญหา หรือกำหนด default version ให้คนอื่นใช้ launch instance ต่อไปได้ระหว่างที่กำลัง iterate เวอร์ชันใหม่ — ข้อมูลที่ต้องกำหนดรวมถึง: AMI ID, instance type, key pair, security group, storage, resource tags

อีกวิธีคือ **launch configuration** ซึ่งคล้าย launch template แต่ใช้ launch configuration เดิมเป็น template ไม่ได้ และสร้างจาก EC2 instance ที่มีอยู่แล้วไม่ได้ ด้วยเหตุผลนี้และเพื่อให้ได้ฟีเจอร์ล่าสุดของ EC2 AWS แนะนำให้ใช้ launch template แทน launch configuration

### Amazon EC2 Auto Scaling groups
กำหนดว่า EC2 Auto Scaling จะ deploy resource ที่ไหน — กำหนด VPC และ subnet ที่ EC2 instance ควรถูก launch (ควรเลือกอย่างน้อย 2 subnet ที่อยู่คนละ Availability Zone) สามารถกำหนดประเภทการซื้อ (purchase) ได้ เช่น On-Demand Instances, Spot Instances หรือผสมทั้งสองแบบ (ใช้ประโยชน์จาก Spot Instance โดยมี administrative overhead น้อย)

กำหนดจำนวน instance ผ่าน 3 การตั้งค่า (hotspot 3 จุด):
- **Minimum capacity**: จำนวน instance ต่ำสุดที่รันอยู่เสมอ แม้จะถึง threshold ที่ควรลดจำนวนลงอีก ระบบก็จะไม่ลดต่ำกว่าค่านี้ (แนะนำอย่างน้อย 2 เพื่อความพร้อมใช้งานสูง แต่ขึ้นกับความต้องการจริงของแอปพลิเคชัน)
- **Desired capacity**: จำนวน instance ที่ EC2 Auto Scaling สร้างตอนสร้างกลุ่ม ต้องอยู่ระหว่างหรือเท่ากับ minimum/maximum เปลี่ยนแปลงได้ manual หรือผ่าน scaling policy — ถ้าลดลง จะลบ instance ที่เก่าที่สุดก่อนโดย default
- **Maximum capacity**: จำนวน instance สูงสุดที่กลุ่มสามารถ scale ขึ้นไปได้

### Scaling policies
เดิมได้เรียนเรื่อง CloudWatch metrics และ alarms แล้ว — metric เก็บข้อมูล attribute ต่าง ๆ ของ EC2 instance (เช่น CPU percentage) alarm กำหนด action เมื่อถึง threshold metric และ alarm คือสิ่งที่ scaling policy ใช้ตัดสินใจว่าเมื่อไรควรทำงาน เช่น ตั้ง alarm ว่าเมื่อ CPU utilization เกิน 70% ทั่วทั้ง fleet ให้ invoke scaling policy เพื่อเพิ่ม EC2 instance

3 ประเภทของ scaling policy:

**Simple Scaling Policy** — ใช้ CloudWatch alarm และกำหนดว่าจะทำอะไรเมื่อถูก invoke เช่น เพิ่ม/ลบจำนวน EC2 instance หรือกำหนด desired capacity เป็นจำนวนที่ต้องการ (หรือกำหนดเป็นเปอร์เซ็นต์ของกลุ่มแทนจำนวนตายตัวก็ได้ ทำให้กลุ่มโตหรือหดเร็วขึ้น) หลังถูก invoke จะเข้าสู่ **cooldown period** ก่อนดำเนินการอื่นต่อ (สำคัญเพราะ EC2 instance ใช้เวลา boot และ CloudWatch alarm อาจยังถูก invoke อยู่ระหว่างนั้น)

**Step Scaling Policy** — เหมาะเมื่อ simple scaling policy ไม่เพียงพอ เช่นถ้า CPU utilization สูงกว่า 65% อาจเพิ่ม 1 instance แต่ถ้าสูงถึง 85% การเพิ่มแค่ 1 instance อาจไม่พอ step scaling policy ตอบสนองต่อ alarm เพิ่มเติมได้แม้ scaling activity หรือ health check replacement กำลังดำเนินอยู่ เช่น เพิ่ม 2 instance เมื่อ CPU 85% และเพิ่ม 4 instance เมื่อ CPU 95%

**Target Tracking Scaling Policy** — เหมาะเมื่อแอปพลิเคชัน scale ตาม average CPU utilization, average network utilization (in/out), หรือ request count เพียงกำหนด target value ที่ต้องการ ระบบจะสร้าง CloudWatch alarm ที่จำเป็นให้อัตโนมัติ

## Resources (แหล่งข้อมูลเพิ่มเติมที่ระบุในบทเรียน)

- AWS website: Amazon EC2 Auto Scaling
- AWS website: Amazon EC2 Auto Scaling FAQs
- AWS user guide: Set capacity limits on your Auto Scaling group
- AWS user guide: Step and simple scaling policies for Amazon EC2 Auto Scaling
- AWS user guide: Target tracking scaling policies for Amazon EC2 Auto Scaling
- AWS user guide: Create an Auto Scaling group using a launch template

## Key terms
- Amazon EC2 Auto Scaling: บริการที่เพิ่ม/ลด EC2 instance อัตโนมัติตาม scaling policy
- Launch template / Launch configuration: ที่เก็บพารามิเตอร์สำหรับสร้าง EC2 instance (AWS แนะนำ launch template)
- Auto Scaling group: กำหนดว่า resource จะถูก deploy ที่ไหน (VPC/subnet/AZ) และจำนวน min/desired/max capacity
- Minimum / Desired / Maximum capacity: การตั้งค่าจำนวน instance ขั้นต่ำ/ที่ต้องการ/สูงสุดของ Auto Scaling group
- Scaling policy: กฎที่กำหนดว่าเมื่อไรควรเพิ่ม/ลด instance (Simple, Step, Target Tracking)
- Cooldown period: ช่วงเวลาที่รอหลัง scaling policy ถูก invoke ก่อนดำเนินการ scaling ครั้งต่อไป
