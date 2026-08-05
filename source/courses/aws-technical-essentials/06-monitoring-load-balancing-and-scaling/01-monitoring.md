# Monitoring

Monitoring คือการเก็บรวบรวม วิเคราะห์ และใช้ข้อมูลเพื่อตัดสินใจหรือตอบคำถามเกี่ยวกับสถานะการทำงาน (operational health) และการใช้งานทรัพยากรของระบบ ช่วยให้เห็น insight ของแอปพลิเคชันแบบใกล้เคียง real-time เพื่อ detect, investigate และ remediate ปัญหาได้เร็วขึ้น

## จุดประสงค์ของ Monitoring

เมื่อรันเว็บไซต์อย่าง employee directory application บน AWS อาจมีคำถามเช่น มีผู้เข้าชมกี่คนต่อวัน ติดตามจำนวนผู้เข้าชมอย่างไร จะรู้ได้อย่างไรว่าเว็บไซต์มีปัญหา performance/availability จะเกิดอะไรขึ้นถ้า **Amazon EC2** instance capacity หมด และจะมีการแจ้งเตือนไหมถ้าเว็บไซต์ล่ม — Monitoring ช่วยตอบคำถามเหล่านี้ได้ โดยดูจากข้อมูลที่เก็บว่ามีปัญหาจาก overuse ของ resource, ข้อผิดพลาดของแอป, resource misconfiguration หรือเหตุการณ์ด้าน security หรือไม่

- **Metric**: จุดข้อมูล (data point) แต่ละจุดที่ resource สร้างขึ้น
- Metrics ที่ถูกเก็บรวบรวมและวิเคราะห์ตามเวลาจะกลายเป็น **statistics** เช่น ค่าเฉลี่ย CPU utilization ที่แสดง spike

ตัวอย่าง: การประเมินสุขภาพของ EC2 instance ผ่าน CPU utilization — ถ้าสูงผิดปกติอาจหมายถึง request ท่วมหรือ process ที่ error ใช้ CPU มากเกินไป ควรตั้ง threshold และระยะเวลาที่ผิดปกติ แล้วใช้เป็น cue ในการแก้ไขปัญหา (manual หรือ automatic เช่น scaling) เมตริกอื่นของ EC2 ได้แก่ network utilization, disk performance, memory utilization และ log ของแอปพลิเคชันที่รันบน EC2

## ประเภทของ Metrics (ตามบริการ)

แต่ละ resource ใน AWS สร้าง metric ประเภทต่างกัน ตัวอย่าง (ไม่ครบทั้งหมด):

- **Amazon S3**: ขนาดของ object ที่เก็บใน bucket, จำนวน object ที่เก็บใน bucket, จำนวน HTTP request ที่เรียกไปยัง bucket
- **Amazon RDS**: จำนวน database connections, CPU utilization ของ instance, การใช้พื้นที่ disk (disk space consumption)
- **Amazon EC2**: CPU utilization, network utilization, disk performance, status checks

## ประโยชน์ของ Monitoring (Monitoring benefits)

แบ่งเป็น 5 หมวด (accordion — ขยายดูรายละเอียดแต่ละหัวข้อ):

1. **Respond proactively** — ตอบสนองต่อปัญหาการทำงานเชิงรุกก่อนที่ผู้ใช้ปลายทางจะรู้ตัว ไม่ต้องรอให้ end user แจ้งปัญหาก่อน ทำให้แก้ไขปัญหาได้ก่อนที่ผู้ใช้จะรับรู้
2. **Improve performance and reliability** — การ monitor ทรัพยากรต่าง ๆ ที่ประกอบกันเป็นแอปพลิเคชันช่วยให้เห็นภาพรวมว่าระบบทำงานอย่างไร ช่วยชี้ bottleneck และสถาปัตยกรรมที่ไม่มีประสิทธิภาพ ทำให้ปรับปรุง performance และ reliability ได้
3. **Recognize security threats and events** — การ monitor ทรัพยากร เหตุการณ์ และระบบตามเวลาจะสร้าง **baseline** (พฤติกรรมปกติ) ทำให้สามารถสังเกต anomaly เช่น traffic spike ผิดปกติ หรือ IP address แปลกปลอมที่เข้าถึง resource เมื่อพบ anomaly ระบบสามารถส่ง alert หรือดำเนินการตรวจสอบได้
4. **Make data-driven decisions** — ช่วยตัดสินใจทางธุรกิจโดยอาศัยข้อมูล เช่น ดูว่าฟีเจอร์ใหม่ได้รับความนิยมหรือไม่ เพื่อตัดสินใจว่าจะลงทุนพัฒนาต่อหรือไม่
5. **Create cost-effective solutions** — ช่วยดูทรัพยากรที่ใช้งานน้อยเกินไป (underused) แล้วปรับขนาด (rightsize) ให้เหมาะกับการใช้งานจริง เพื่อควบคุมค่าใช้จ่ายไม่ให้เกินความจำเป็น

## Resources (แหล่งข้อมูลเพิ่มเติมที่ระบุในบทเรียน)

- AWS user guide: Best practices for monitoring
- AWS website: Monitoring and Observability
- AWS user guide: Monitor Amazon EC2
- AWS user guide: Monitoring Amazon S3
- AWS user guide: Monitoring metrics in an Amazon RDS instance

## Key terms
- Monitoring: การเก็บรวบรวม วิเคราะห์ และใช้ข้อมูลเพื่อตัดสินใจ/ตอบคำถามเกี่ยวกับสถานะการทำงานของระบบ
- Metric: จุดข้อมูลแต่ละจุดที่ resource สร้างขึ้น
- Statistic: ค่าที่ได้จากการรวบรวม/วิเคราะห์ metric ตามช่วงเวลา
- Baseline: พฤติกรรม/กิจกรรมปกติของระบบที่ใช้เปรียบเทียบเพื่อหา anomaly
