# Alarms and Events

การตั้งค่า thresholds และรับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงใน AWS infrastructure ใช้ **CloudWatch alarms** บทเรียนนี้จะสอนวิธีตั้งค่า CloudWatch alarms และ events

## CloudWatch alarms

CloudWatch alarm สามารถสร้างได้จาก:
- **metric alarm**: อิงจาก cloud metric ตัวเดียว
- **composite alarm**: อิงจากการรวมกันของหลาย cloud metrics

alarm จะทำ action หนึ่งอย่างหรือมากกว่านั้น โดยพิจารณาจากค่าของ metric หรือ expression เทียบกับ threshold ในช่วงเวลาหนึ่งจำนวนหนึ่ง (number of time periods)

## Alarm states

Alarm มี 3 สถานะที่เป็นไปได้:

**OK**
metric อยู่ภายใน threshold ที่กำหนดไว้

**ALARM**
ALARM เป็นเพียงชื่อของสถานะ ไม่ได้หมายความว่าเป็นเหตุฉุกเฉินที่ต้องดำเนินการทันทีเสมอไป หมายถึง metric ที่ถูก monitor มีค่าเท่ากับ มากกว่า หรือน้อยกว่าค่า threshold ที่กำหนดไว้ ตัวอย่างเช่น สามารถกำหนด alarm ที่แจ้งเตือนเมื่อ CPU utilization ของ EC2 instance สูงเกินไป คุณอาจประมวลผลการแจ้งเตือนนี้แบบ programmatic เพื่อ suspend งานที่ใช้ CPU มากบน instance หรือส่งการแจ้งเตือนเพื่อให้ application owner รับทราบและดำเนินการ

**INSUFFICIENT_DATA**
สถานะนี้จะถูกส่งคืนเมื่อไม่มีข้อมูลสำหรับ metric ที่กำหนด ตัวอย่างเช่น ความลึก (depth) ของ Amazon SQS queue ที่ว่างเปล่า สถานะนี้อาจเป็นสัญญาณบ่งชี้ว่ามีบางอย่างผิดปกติในระบบด้วยเช่นกัน

## Alarm components

ในตัวอย่าง alarm threshold ถูกตั้งไว้ที่ 25 เปอร์เซ็นต์ และ minimum breach คือ 2 periods หมายความว่า alarm จะเปลี่ยนสถานะและเรียก action ก็ต่อเมื่อ threshold ถูกละเมิด (breach) ติดต่อกัน 2 periods เท่านั้น ค่านี้ผู้ใช้เป็นผู้กำหนดเอง

นอกจากนี้ยังสามารถกำหนดวิธีที่ alarm จัดการกับ missing data points ได้ ในบางกรณีอาจต้องการให้ alarm ไปที่สถานะ INSUFFICIENT_DATA สำหรับข้อมูลที่ขาดหายไป แทนที่จะไปที่สถานะ ALARM

ในกราฟ metric ตัวอย่าง สิ่งนี้เกิดขึ้นในช่วง period ที่ 3 ถึง 4 และ 5 และสถานะของ alarm ถูกตั้งเป็น ALARM ที่เวลา 1:20 PM ที่ period ที่ 6 ค่าลดลงต่ำกว่า threshold และสถานะกลับเป็น OK ที่เวลา 1:25 PM

## Amazon EventBridge

**Amazon EventBridge** เป็น serverless event bus ที่ช่วยให้สร้างแอปพลิเคชันแบบ event-driven ได้ง่ายขึ้นในระดับขนาดใหญ่ โดยใช้ events ที่สร้างจากแอปพลิเคชันของคุณ, SaaS applications ที่เชื่อมต่อไว้ และบริการ AWS ต่างๆ EventBridge จะรับ event (ตัวบ่งชี้การเปลี่ยนแปลงใน environment) และใช้ rule เพื่อ route event ไปยัง target EventBridge เป็นวิธีที่แนะนำ (preferred) สำหรับจัดการ events ที่ถูกจับไว้ใน CloudWatch

**ตัวอย่าง**: EC2 instance รายงาน CPUUtilization metric data ไปยัง CloudWatch มีการสร้างและกำหนดค่า custom alarm ชื่อ "CPUAbove90Percent" เพื่อให้ทราบเมื่อ EC2 instance ถูกใช้งานเกินกำลัง (overused)

EventBridge rules ถูกสร้างขึ้นเพื่อแจ้งเตือนทีม support เมื่อ alarm "CPUAbove90Percent" อยู่ในสถานะ ALARM เพื่อให้พวกเขาตรวจสอบและดำเนินการ EventBridge ทำ 2 actions คือ:
- ส่งอีเมลไปยังผู้รับที่ subscribe ผ่าน **Amazon SNS** topic
- ส่ง rich notification ไปยังเครื่องมือ third-party monitoring ของทีมปฏิบัติการ (operation team)

ในบทเรียนนี้ ได้เรียนรู้วิธีตั้งค่า CloudWatch alarms และ events ในแอปพลิเคชัน และวิธีใช้ Amazon EventBridge เพื่อตอบสนองต่อ events ใน infrastructure บทเรียนถัดไปจะเรียนรู้วิธี implement load balancing ในแอปพลิเคชัน

## Key terms
- CloudWatch alarm: กลไกแจ้งเตือน/ดำเนินการอัตโนมัติเมื่อ metric ถึง threshold ที่กำหนด
- Metric alarm / Composite alarm: alarm จาก metric เดียว / alarm จากหลาย metric รวมกัน
- Alarm states (OK / ALARM / INSUFFICIENT_DATA): สถานะที่เป็นไปได้ของ alarm
- Amazon EventBridge: serverless event bus สำหรับ route events ไปยัง targets ตาม rules
- Amazon SNS: บริการส่ง notification เช่น อีเมลแจ้งเตือน
