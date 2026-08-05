# Auto Scaling

ข้อดีอย่างหนึ่งของ cloud infrastructure คือสามารถ scale out และ scale in ได้อย่างราบรื่นตามความต้องการของแอปพลิเคชัน บทเรียนนี้จะสอนวิธีเพิ่มและลดขนาด (capacity) ของ application infrastructure แบบไดนามิก เพื่อรองรับความต้องการที่เปลี่ยนแปลงไป

## AWS Auto Scaling

**AWS Auto Scaling** จะ monitor แอปพลิเคชันของคุณและปรับ capacity โดยอัตโนมัติ เพื่อรักษาประสิทธิภาพให้คงที่และคาดการณ์ได้ในต้นทุนที่ต่ำที่สุด ด้วย AWS Auto Scaling คุณสามารถตั้งค่า application scaling สำหรับทรัพยากรหลายตัวข้ามหลายบริการได้ภายในไม่กี่นาที

บริการนี้มี user interface ที่เรียบง่ายและทรงพลัง ใช้สร้าง scaling plans สำหรับทรัพยากรต่างๆ รวมถึง EC2 instances, Spot Fleets และบริการ compute/database อื่นๆ AWS Auto Scaling ช่วยแนะนำวิธี scale เพื่อเพิ่มประสิทธิภาพและต้นทุน หรือสร้างสมดุลระหว่างทั้งสองอย่าง

## Amazon EC2 Auto Scaling

**Amazon EC2 Auto Scaling** สามารถ launch หรือ terminate instances เมื่อความต้องการต่อแอปพลิเคชันเพิ่มขึ้นหรือลดลง โดยอิงตาม scaling policy Amazon EC2 Auto Scaling เชื่อมต่อกับ ELB ได้ จึงสามารถแนบ load balancer หนึ่งตัวหรือมากกว่ากับ Amazon EC2 Auto Scaling group ที่มีอยู่แล้วได้

ตัวอย่าง: VPC หนึ่งมี 2 subnets ใน 2 Availability Zones แยกกัน มี EC2 instances 2 ตัวถูก launch ในแต่ละ subnet เป็นส่วนหนึ่งของ Auto Scaling group เดียว load balancer ที่มีอยู่แล้วแสดงแยกต่างหาก แต่การลงทะเบียน Auto Scaling group กับ load balancer เป็นทางเลือก (optional)

### Amazon EC2 Auto Scaling components

การใช้งาน Amazon EC2 Auto Scaling ต้องมี 3 components:

**Component 1 — Launch Template**
launch template ที่รวมพารามิเตอร์ที่จำเป็นสำหรับการ launch EC2 instance เช่น ID ของ Amazon Machine Image (AMI) และ instance type launch template รองรับฟังก์ชันการทำงานเต็มรูปแบบของ Amazon EC2 Auto Scaling รวมถึงฟีเจอร์ใหม่ๆ ของ Amazon EC2 เช่น Amazon EBS Provisioned IOPS volumes รุ่นปัจจุบัน (io2), EBS volume tagging, T2 Unlimited instances, Elastic Inference และ Dedicated Hosts

**Component 2 — Auto Scaling group**
Auto Scaling group ประกอบด้วยกลุ่มของ EC2 instances ที่ถูกจัดกลุ่มเชิงตรรกะ (logical grouping) เพื่อการ scale และจัดการอัตโนมัติ กลุ่มนี้ยังใช้ฟีเจอร์ Amazon EC2 Auto Scaling อื่นๆ ได้ เช่น health check replacements และ scaling policies คุณสามารถกำหนดจำนวน instance ขั้นต่ำในแต่ละกลุ่มได้ และ Amazon EC2 Auto Scaling จะควบคุมกลุ่มไม่ให้ต่ำกว่าขนาดนี้

ตัวอย่าง: กลุ่มนี้มี minimum size 1 instance, desired capacity 2 instances และ maximum size 4 instances scaling policies ที่กำหนดไว้จะปรับจำนวน instances ภายในขอบเขต minimum และ maximum ตามเกณฑ์ที่กำหนด

**Component 3 — Scaling policy**
scaling policy กำหนดว่าจะเรียกใช้ scaling เมื่อใด สามารถใช้เครื่องมือต่อไปนี้เพื่อเรียกใช้ scaling ในกลุ่มของคุณ:
- **Health status checks** — สามารถกำหนดค่ากลุ่มให้รักษาจำนวน running instances ที่ระบุไว้ตลอดเวลา หาก instance ใด unhealthy กลุ่มจะ terminate instance นั้นและ launch instance ใหม่มาแทนที่
- **CloudWatch alarms** — scaling policy สั่งให้ Amazon EC2 Auto Scaling ติดตาม CloudWatch metric ที่ระบุ และกำหนด action ที่จะทำเมื่อ CloudWatch alarm ที่เกี่ยวข้องอยู่ในสถานะ ALARM
- **Schedules** — สามารถ scale ตามตารางเวลาได้ actions จะถูกทำโดยอัตโนมัติตามฟังก์ชันของเวลาและวันที่ มีประโยชน์เมื่อทราบแน่ชัดว่าจะต้องเพิ่มหรือลดจำนวน instances เมื่อใด
- **Manual scaling** — วิธีพื้นฐานที่สุดในการ scale ทรัพยากร โดยระบุเพียงการเปลี่ยนแปลงค่า maximum, minimum หรือ desired capacity ของกลุ่ม Amazon EC2 Auto Scaling จะจัดการกระบวนการสร้างหรือ terminate instances เพื่อรักษา capacity ที่อัปเดตแล้ว

**สรุป**: ด้วย Amazon EC2 Auto Scaling คุณสามารถสร้าง scaling plans ที่ทำให้กลุ่มของทรัพยากร EC2 ต่างๆ ตอบสนองต่อการเปลี่ยนแปลงความต้องการโดยอัตโนมัติ สามารถ optimize เพื่อ availability, ต้นทุน หรือสมดุลระหว่างทั้งสองอย่างได้

## Ways to scale with Amazon EC2 Auto Scaling

สามารถ implement automatic scaling สำหรับ Amazon EC2 ได้ 3 วิธี:

**Scheduled scaling**
วางแผนกิจกรรม scaling ได้ตาม traffic patterns ที่ทราบล่วงหน้าของเว็บแอปพลิเคชัน ด้วย scheduled scaling คุณสามารถ scale แอปพลิเคชันก่อนที่จะเกิดการเปลี่ยนแปลงโหลดที่ทราบล่วงหน้า ตัวอย่างเช่น สมมติว่าทุกสัปดาห์ traffic ของเว็บแอปพลิเคชันเริ่มเพิ่มขึ้นในวันพุธ สูงต่อเนื่องในวันพฤหัสบดี และเริ่มลดลงในวันศุกร์

**Dynamic scaling**
กำหนดวิธี scale capacity ของ Amazon EC2 Auto Scaling group ตอบสนองต่อความต้องการที่เปลี่ยนแปลง ตัวอย่างเช่น สมมติว่ามีเว็บแอปพลิเคชันที่รันอยู่บน 2 instances และต้องการให้ CPU utilization ของกลุ่มอยู่ที่ประมาณ 50 เปอร์เซ็นต์เมื่อโหลดของแอปพลิเคชันเปลี่ยนแปลง วิธีนี้ให้ capacity สำรองสำหรับรองรับ traffic spikes โดยไม่ต้องคงจำนวนทรัพยากรที่ idle มากเกินไป

**Predictive scaling**
ใช้ predictive scaling เพื่อเพิ่มจำนวน EC2 instances ในกลุ่มล่วงหน้า ก่อนที่ pattern ของ traffic รายวันและรายสัปดาห์จะเกิดขึ้น Predictive scaling เหมาะกับสถานการณ์ต่อไปนี้:
- Traffic แบบ cyclical เช่น การใช้ทรัพยากรสูงในช่วงเวลาทำการปกติ และใช้ทรัพยากรต่ำในช่วงเย็นและวันหยุดสุดสัปดาห์
- Pattern ของ workload ที่เกิดซ้ำแบบ on-and-off เช่น batch processing, การทดสอบ หรือการวิเคราะห์ข้อมูลเป็นระยะ
- แอปพลิเคชันที่ใช้เวลานานในการ initialize ทำให้เกิด latency ที่สังเกตเห็นได้ต่อประสิทธิภาพของแอปพลิเคชันระหว่างเหตุการณ์ scale-out

จากนั้น วิทยากรจะพูดคุยแบบ tech talk เกี่ยวกับความแตกต่างระหว่าง auto scaling groups และ elastic load balancers

## Key terms
- AWS Auto Scaling: บริการที่ปรับ capacity ของทรัพยากรหลายประเภทโดยอัตโนมัติเพื่อรักษาประสิทธิภาพในต้นทุนต่ำสุด
- Amazon EC2 Auto Scaling: บริการ launch/terminate EC2 instances อัตโนมัติตาม scaling policy
- Launch template: พารามิเตอร์สำหรับ launch EC2 instance (AMI ID, instance type ฯลฯ)
- Auto Scaling group: กลุ่ม EC2 instances ที่จัดการและ scale ร่วมกัน
- Scaling policy: กำหนดเงื่อนไขและวิธีการเรียกใช้ scaling (health check, CloudWatch alarm, schedule, manual)
- Scheduled scaling / Dynamic scaling / Predictive scaling: 3 วิธีหลักในการ scale ด้วย Amazon EC2 Auto Scaling
