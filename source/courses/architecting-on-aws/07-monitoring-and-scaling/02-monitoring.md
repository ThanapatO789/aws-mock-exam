# Monitoring

เมื่อออกแบบและ deploy แอปพลิเคชันแล้ว สิ่งสำคัญคือต้อง monitor ประสิทธิภาพของแอปพลิเคชัน และ scale ตามความต้องการของผู้ใช้ บทเรียนนี้จะสอนวิธี monitor แอปพลิเคชัน

Monitoring จำเป็นสำหรับติดตามว่าทรัพยากรของเราทำงานและมีประสิทธิภาพอย่างไร ด้วยการ monitoring คุณสามารถ:

- รวบรวมข้อมูลเกี่ยวกับการใช้งานทรัพยากร (resource utilization) และประสิทธิภาพของแอปพลิเคชัน
- วัดว่า infrastructure เพียงพอหรือไม่
- ดูว่าควร scale out หรือ scale in infrastructure เมื่อใด
- จากมุมมองด้าน security สามารถดูได้ว่ามีผู้ใช้เข้าถึงส่วนใดของ environment เมื่อใด และตรวจสอบ permissions

## Amazon CloudWatch

**Amazon CloudWatch** เป็นบริการของ AWS ที่ให้ near-real-time stream ของ system events ซึ่งอธิบายถึงการเปลี่ยนแปลงของทรัพยากร AWS ด้วย CloudWatch คุณสามารถตอบสนองต่อการเปลี่ยนแปลงในการดำเนินงานได้อย่างรวดเร็วและดำเนินการแก้ไข CloudWatch alarms จะส่งการแจ้งเตือนหรือเปลี่ยนแปลงทรัพยากรที่กำลัง monitor โดยอัตโนมัติ ตามกฎที่กำหนดไว้

คุณสามารถรวบรวม เข้าถึง และเชื่อมโยงข้อมูลนี้ไว้ในที่เดียวจากทรัพยากรและบริการ AWS ทั้งหมด รวมถึง CloudWatch ยังรวบรวมข้อมูลจาก on-premises servers ได้ด้วย เพื่อเพิ่มประสิทธิภาพและการใช้ทรัพยากร CloudWatch มี automatic dashboards ข้อมูลที่ความละเอียดระดับ 1 วินาที (1-second granularity) และเก็บ metrics ได้นานสูงสุด 15 เดือน

### CloudWatch metrics

Metrics คือข้อมูลเกี่ยวกับประสิทธิภาพของระบบ โดยค่าเริ่มต้น หลายบริการจะให้ metrics สำหรับทรัพยากรต่างๆ เช่น **Amazon EC2** instances, **Amazon EBS** volumes และ **Amazon RDS** DB instances CloudWatch เก็บข้อมูลของ metric เป็นชุดของ data points โดยแต่ละ data point จะมี timestamp กำกับ

คุณสามารถเปิดใช้งาน detailed monitoring สำหรับทรัพยากรบางประเภท เช่น EC2 instances หรือ publish application metrics ของคุณเองได้ CloudWatch สามารถโหลด metrics ทั้งหมดในบัญชีของคุณ (ทั้ง AWS resource metrics และ application metrics ที่คุณให้มา) เพื่อใช้ค้นหา, สร้างกราฟ และตั้ง alarms ข้อมูล metric จะถูกเก็บไว้ 15 เดือน จึงสามารถดูได้ทั้งข้อมูลล่าสุดและข้อมูลย้อนหลัง

คุณสามารถ publish metrics ของคุณเองไปยัง CloudWatch ได้ และใช้ AWS Management Console เพื่อดูกราฟทางสถิติของ metrics ที่ publish ไว้

## Types of logs

หน้านี้มีภาพประกอบแบบ hotspot 4 จุด ได้แก่ Amazon CloudWatch Logs, AWS CloudTrail, VPC Flow Logs และ Custom logs พร้อมคำอธิบายสั้นๆ ใต้แต่ละไอคอน (คลิกทดสอบแล้วพบว่า hotspot ของ Amazon CloudWatch Logs เปิดเป็นกราฟตัวอย่าง (Percent over Time) แบบ canvas โดยไม่มีข้อความเพิ่มเติม):

- **Amazon CloudWatch Logs**: Monitor apps using log data, store, and access log files (ติดตามแอปโดยใช้ log data จัดเก็บ และเข้าถึงไฟล์ log)
- **AWS CloudTrail**: Track user activity and API usage (ติดตามกิจกรรมผู้ใช้และการใช้งาน API)
- **VPC Flow Logs**: Capture information about IP traffic to and from network interfaces (บันทึกข้อมูล IP traffic เข้าและออกจาก network interfaces)
- **Custom logs**: Store custom logs generated from your application instances (จัดเก็บ log ที่กำหนดเองซึ่งสร้างจาก application instances)

### AWS CloudTrail

**AWS CloudTrail** ให้ข้อมูลเชิงลึกว่าใครทำอะไรและเมื่อใด โดยติดตาม user activity และการใช้งาน API ด้วย CloudTrail คุณสามารถดูประวัติของ AWS API calls ในบัญชีของคุณได้ ทั้งที่เรียกผ่าน console, AWS SDKs, AWS CLI และบริการระดับสูงอื่นๆ ของ AWS CloudTrail จะบันทึก AWS API calls และส่งมอบ log files ให้คุณ ข้อมูลที่บันทึกประกอบด้วย source IP address และตัวตนของผู้เรียก API, เวลาที่เรียก, request parameters และ response elements ที่ส่งกลับโดยบริการ AWS

ประวัติการเรียก AWS API ที่ CloudTrail สร้างขึ้นช่วยในการวิเคราะห์ด้าน security, การติดตามการเปลี่ยนแปลงทรัพยากร และการตรวจสอบ compliance

คุณเปิดใช้งาน CloudTrail แบบรายภูมิภาค (per-Region) หากใช้หลาย Region คุณสามารถเลือกได้ว่าจะส่ง log files ไปที่ใดในแต่ละ Region CloudTrail จะบันทึก log ไว้ใน Amazon S3 bucket ที่คุณกำหนด

**ตัวอย่าง CloudTrail log**: log file หนึ่งไฟล์ประกอบด้วย record หนึ่งรายการขึ้นไป ตัวอย่างด้านล่างแสดง record ของ action ที่เริ่มสร้าง log file:

- **Example 1 — ใครเป็นผู้ร้องขอ**: ตัวอย่าง log แสดงว่าผู้ใช้ IAM ชื่อ Alice เรียก EC2 `StopInstances` action ผ่านคำสั่ง `ec2-stop-instances` ใน AWS CLI ส่วนนี้ของ log บอกว่าใครเป็นผู้ร้องขอ
- **Example 2 — เป้าหมายของ request คืออะไร**: ส่วนนี้บอกข้อมูลเกี่ยวกับเป้าหมายของ request ในกรณีนี้คือ instance ที่มี instance ID: `i-abcdefg01234567890`
- **Example 3 — เวลาและ Region ของ API call**: ส่วนนี้บอกว่า API call เกิดขึ้นเมื่อใด, API call คืออะไร (`StopInstances`) และเกิดขึ้นใน Region ใด
- **Example 4 — response คืออะไร**: ส่วนนี้บอกข้อมูลเกี่ยวกับ response ในกรณีนี้คือ instance ถูก stop แล้ว

**สรุป**: CloudTrail ช่วยตอบคำถามที่ต้องการการวิเคราะห์อย่างละเอียด โดยเก็บ CloudTrail API usage logs ไว้ใน Amazon S3 bucket และวิเคราะห์ในภายหลังเพื่อตอบคำถาม เช่น:
- ทำไม instance ที่รันมานานถูก terminate และใครเป็นคนทำ? (organizational traceability และ accountability)
- ใครเปลี่ยนแปลง configuration ของ security group? (accountability และ security auditing)
- กิจกรรมใดถูกปฏิเสธเนื่องจากขาด permission? (อาจเป็นการโจมตีจากภายในหรือภายนอกเครือข่าย)

### VPC Flow Logs

**VPC Flow Logs** บันทึกข้อมูล IP traffic ที่เข้าและออกจาก network interfaces ของ VPC

- สามารถตั้งค่าให้บันทึก traffic ต่อ VPC, subnet หรือ network interface ก็ได้
- ดูข้อมูล flow logs ได้ในหน้า Amazon EC2 และ Amazon VPC console โดยเลือกแท็บ Flow Logs ของทรัพยากรนั้นๆ
- Flow logs ปิดใช้งานเป็นค่าเริ่มต้น ต้อง opt-in เพื่อเก็บข้อมูล flow log

**เนื้อหาของ flow log record**: แต่ละ record บันทึก network IP traffic flow สำหรับช่วงเวลาที่กำหนด (capture window) และมี 5 ค่า เรียกว่า 5-tuple ซึ่งประกอบด้วยส่วนต่างๆ ของ IP flow เช่น source, destination และ protocol คุณสามารถสร้าง alarms ที่ทำงานเมื่อพบ traffic บางประเภท และสร้าง metrics เพื่อช่วยระบุ trends และ patterns

ในบทเรียนนี้ ได้สำรวจบริการ AWS ที่ใช้ monitor ประสิทธิภาพของแอปพลิเคชัน บทเรียนถัดไปจะเรียนรู้วิธีตั้งค่า alarms และ events ในแอปพลิเคชัน

## Key terms
- Amazon CloudWatch: บริการ monitoring ที่รวบรวม metrics, logs, และ events แบบ near-real-time
- CloudWatch metrics: ข้อมูลประสิทธิภาพของระบบ เก็บเป็น data points พร้อม timestamp
- AWS CloudTrail: บริการบันทึกประวัติการเรียก AWS API calls เพื่อ security analysis และ auditing
- VPC Flow Logs: บันทึกข้อมูล IP traffic เข้า/ออกจาก network interfaces ของ VPC
- Custom logs: log ที่กำหนดเองจาก application instances
