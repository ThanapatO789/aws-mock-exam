# Amazon CloudWatch

**Amazon CloudWatch** เป็น monitoring and observability service ที่เก็บรวบรวมข้อมูลจาก resource และให้ actionable insight เกี่ยวกับแอปพลิเคชัน AWS resource สร้างข้อมูลที่สามารถ monitor ได้ผ่าน metrics, logs, network traffic, events และอื่น ๆ ซึ่งมาจาก component ที่กระจายตัวกัน (distributed) ทำให้ยากต่อการรวบรวมข้อมูลถ้าไม่มีที่ศูนย์กลาง — CloudWatch ทำหน้าที่เป็นศูนย์กลางการเก็บข้อมูลนี้ให้

ด้วย CloudWatch สามารถตอบสนองต่อการเปลี่ยนแปลง performance ทั่วทั้งระบบ, optimize การใช้ resource, และเห็นภาพรวม operational health แบบรวมศูนย์ ใช้งานเพื่อ:
- Detect พฤติกรรมผิดปกติ (anomalous) ในสภาพแวดล้อม
- ตั้ง alarm เพื่อแจ้งเตือนเมื่อมีสิ่งผิดปกติ
- Visualize logs และ metrics ผ่าน AWS Management Console
- ดำเนินการอัตโนมัติ เช่น scaling
- Troubleshoot ปัญหา
- ค้นหา insight เพื่อรักษาความ healthy ของแอป

กรอบการทำงานของ CloudWatch (See/Act/Analyze):
- **See** — เห็นภาพรวมด้วย dashboards, troubleshoot ด้วย correlated logs และ metrics, ตั้ง alert
- **Act** — automate การตอบสนองต่อการเปลี่ยนแปลง operational ด้วย CloudWatch events และ auto scaling
- **Analyze** — metric ความละเอียดสูงสุดถึงระดับ 1 วินาที, เก็บข้อมูลได้นาน (15 เดือน), และวิเคราะห์แบบ real-time ด้วย CloudWatch metric math

Employee Directory Application ประกอบด้วยหลายบริการ AWS ทำงานร่วมกัน การ monitor แต่ละบริการแยกกันเป็นเรื่องยาก CloudWatch จึงเป็นที่รวมศูนย์สำหรับเก็บและวิเคราะห์ metric หลายบริการ AWS ส่ง metric ไปยัง CloudWatch โดยอัตโนมัติแบบไม่มีค่าใช้จ่าย ที่อัตรา 1 data point ต่อ metric ต่อช่วง 5 นาที เรียกว่า **basic monitoring** ซึ่งเพียงพอสำหรับแอปพลิเคชันส่วนใหญ่โดยไม่มีค่าใช้จ่ายเพิ่ม

สำหรับแอปที่รันบน EC2 สามารถขอความละเอียดสูงขึ้นได้โดยส่ง metric ทุก 1 นาทีแทน 5 นาที ด้วยฟีเจอร์ **detailed monitoring** (มีค่าใช้จ่ายเพิ่ม) และยังมี **high-resolution custom metrics** ที่เก็บ metric ที่กำหนดเองได้ละเอียดถึงระดับ 1 วินาที (1 data point ต่อวินาทีต่อ custom metric)

ตัวอย่าง custom metrics:
- Webpage load times
- Request error rates
- จำนวน process หรือ thread บน instance
- ปริมาณงานที่แอปพลิเคชันประมวลผล

## CloudWatch metrics — ส่วนประกอบสำคัญ

- **Metric**: ข้อมูลเกี่ยวกับ performance ของระบบ เช่น CPU usage ของ EC2 instance หนึ่งตัวคือหนึ่ง metric ที่ Amazon EC2 ให้มา
- **Timestamp**: แต่ละ metric data point ต้องมี timestamp กำกับ ถ้าไม่ระบุ CloudWatch จะสร้างให้เองตามเวลาที่ได้รับข้อมูล
- **Dimension**: บริการ AWS ที่ส่งข้อมูลไปยัง CloudWatch จะแนบ dimension (คู่ name-value ที่เป็นส่วนหนึ่งของ identity ของ metric) เข้ากับแต่ละ metric ใช้ dimension เพื่อ filter ผลลัพธ์ที่ CloudWatch คืนมาได้ เช่น metric ของ EC2 หลายตัวจะเผยแพร่ InstanceId เป็นชื่อ dimension และค่า instance ID จริงเป็นค่า dimension

โดย default หลายบริการ AWS ให้ metric ฟรีสำหรับ resource เช่น EC2 instances, Amazon EBS volumes, และ Amazon RDS DB instances สามารถเปิดใช้ฟีเจอร์เพิ่มเติม (มีค่าใช้จ่าย) เพื่อความละเอียดมากขึ้นได้

## CloudWatch dashboards

เมื่อ provision AWS resource แล้วและกำลังส่ง metric ไปยัง CloudWatch สามารถ visualize และตรวจสอบข้อมูลผ่าน **CloudWatch dashboards** ซึ่งเป็นหน้า home page ที่ปรับแต่งได้เพื่อ visualize ข้อมูล metric หนึ่งหรือหลายตัวผ่าน widget (เช่น กราฟหรือข้อความ)

สามารถสร้าง dashboard ที่กำหนดเองได้หลายอัน แต่ละอันเน้นมุมมองที่ต่างกันของสภาพแวดล้อม และสามารถดึงข้อมูลจากหลาย AWS Region มารวมในหนึ่ง dashboard เพื่อสร้างมุมมองแบบ global ของสถาปัตยกรรมได้ นอกจากดูผ่าน console ยังดึงข้อมูลผ่าน **GetMetricData API** ได้ ด้าน security ใช้ **AWS IAM policies** ควบคุมสิทธิ์การเข้าถึงหรือจัดการ CloudWatch dashboards

(สาธิตในวิดีโอ: สร้าง dashboard ชื่อ mydashboard เพิ่ม widget แบบ line graph เลือก metric ของ EC2 → Per-Instance Metrics → CPUUtilization เพื่อดู CPU utilization ของ instance หนึ่งตัว)

## Amazon CloudWatch Logs

**CloudWatch Logs** เป็นที่รวมศูนย์สำหรับเก็บและวิเคราะห์ log สามารถ monitor, store, และเข้าถึง log file จากแอปพลิเคชันที่รันบน EC2 instances, AWS Lambda functions และแหล่งอื่น ๆ ได้ ใช้ query และ filter log data ได้ (เช่น ค้นหา stack trace เมื่อเกิด application logic error) และสามารถตั้ง **metric filter** บน log เพื่อแปลง log data ให้เป็น numerical CloudWatch metric ที่นำไปกราฟหรือใช้บน dashboard ได้ บางบริการ เช่น Lambda ถูกตั้งค่าให้ส่ง log ไปยัง CloudWatch Logs โดยแทบไม่ต้องตั้งค่าเพิ่ม

Log terminology (hotspot 3 จุด):
- **Log event**: บันทึกกิจกรรมที่ถูกบันทึกโดยแอปพลิเคชันหรือ resource ที่ถูก monitor มี timestamp และ event message
- **Log stream**: log event ถูกจัดกลุ่มเป็น log stream ซึ่งเป็นลำดับของ log event ที่อยู่ resource เดียวกัน เช่น log ของ EC2 instance หนึ่งตัวจะถูกจัดกลุ่มเป็น log stream ที่ filter/query ได้
- **Log group**: ประกอบด้วย log stream หลายตัวที่มี retention และ permission settings ร่วมกัน เช่น มี EC2 หลายตัวรัน application เดียวกัน ส่ง log ไปยัง CloudWatch Logs สามารถจัดกลุ่ม log stream จากแต่ละ instance เป็น log group เดียวได้

## CloudWatch alarms

สร้าง **CloudWatch alarms** เพื่อเริ่มการทำงานอัตโนมัติ (initiate action) ตาม sustained state change ของ metric — กำหนด metric, threshold, และช่วงเวลา (time period) เพื่อไม่ให้ alarm ทำงานจาก spike ชั่วคราวของ CPU เช่น ต้องการให้ alarm ทำงานเมื่อ CPU utilization เกิน 80% ต่อเนื่อง 5 นาทีขึ้นไปเท่านั้น

เมื่อ alarm เปลี่ยน state จะสามารถ initiate action ได้ เช่น EC2 action, automatic scaling action, หรือแจ้งเตือนผ่าน **Amazon SNS**

3 สถานะของ alarm (flashcard):
- **OK**: metric อยู่ในขอบเขต threshold ที่กำหนด ทุกอย่างดำเนินไปตามปกติ
- **ALARM**: metric อยู่นอกขอบเขต threshold ที่กำหนด อาจเป็นปัญหาด้าน operational
- **INSUFFICIENT_DATA**: alarm เพิ่งเริ่มทำงาน, metric ไม่พร้อมใช้งาน, หรือมีข้อมูลไม่เพียงพอที่จะระบุสถานะของ alarm

ตัวอย่างการตั้ง alarm (3 ขั้นตอน):
1. **Create a metric filter** — สร้าง metric filter สำหรับ HTTP 500 error response codes
2. **Define an alarm** — กำหนดว่า metric alarm state ใดควรถูก invoke ตาม threshold (เช่น เกิด HTTP 500 error ต่อเนื่องตามช่วงเวลาที่กำหนด)
3. **Define an action** — กำหนด action ที่ต้องการให้เกิดขึ้นเมื่อ alarm ถูก invoke เช่น ส่งอีเมลหรือ text alert เพื่อให้เริ่ม troubleshoot

สามารถตั้ง alarm หลายตัวสำหรับเหตุผลต่างกันเพื่อช่วยป้องกันหรือ troubleshoot ปัญหา operational ได้ — บาง alarm อาจส่ง SNS notification ให้คนไปตรวจสอบเอง หรือให้ alarm invoke action ที่แก้ไขปัญหาทางเทคนิคโดยอัตโนมัติ

## Key terms
- Amazon CloudWatch: monitoring and observability service ที่เก็บรวบรวมข้อมูล resource และให้ insight เกี่ยวกับแอปพลิเคชัน
- Basic monitoring: การส่ง metric ฟรีอัตโนมัติทุก 5 นาที
- Detailed monitoring: การส่ง metric ทุก 1 นาที (มีค่าใช้จ่าย)
- Dimension: คู่ name-value ที่เป็นส่วนหนึ่งของ identity ของ metric ใช้ filter ผลลัพธ์
- CloudWatch dashboard: หน้า home page ที่ปรับแต่งได้เพื่อ visualize metric ผ่าน widget
- CloudWatch Logs: บริการเก็บและวิเคราะห์ log แบบรวมศูนย์
- Log event / Log stream / Log group: ลำดับชั้นการจัดกลุ่ม log ใน CloudWatch Logs
- CloudWatch alarm: กลไกที่ initiate action อัตโนมัติเมื่อ metric ข้าม threshold ตามช่วงเวลาที่กำหนด
- Amazon SNS: บริการส่งข้อความ/แจ้งเตือนที่ CloudWatch alarm สามารถเรียกใช้ได้
