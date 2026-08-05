# Recovery Strategies

การกำหนดกลยุทธ์การกู้คืน (recovery strategy) ที่ดีเป็นสิ่งสำคัญเพื่อลด downtime ของแอปพลิเคชันให้น้อยที่สุด บทเรียนนี้สอนวิธีการกู้คืนจากเหตุการณ์ที่ไม่คาดคิด มีวิดีโอผู้สอนความยาว 8:51 นาที ประกอบเนื้อหา

## Strategies

ในสภาพแวดล้อมแบบดั้งเดิม (traditional environment) ส่วนใหญ่ ข้อมูลจะถูก backup ไปยัง tape และส่งไปเก็บนอกสถานที่ (offsite) เป็นประจำ หากใช้วิธีนี้ อาจใช้เวลานานในการกู้คืนระบบเมื่อเกิดเหตุขัดข้อง

**Amazon S3** เป็นปลายทางที่เหมาะสำหรับการเข้าถึง backup ได้อย่างรวดเร็ว การโอนย้ายข้อมูลไปและกลับจาก Amazon S3 มักทำผ่านเครือข่าย จึงสามารถเข้าถึงได้จากทุกที่ นอกจากนี้ยังสามารถใช้ lifecycle policy เพื่อย้าย backup ที่เก่ากว่าไปยัง storage class ที่คุ้มค่าใช้จ่ายมากขึ้นตามระยะเวลา

โมดูลนี้ครอบคลุมกลยุทธ์การกู้คืน 4 แบบ เรียงจากต้นทุนต่ำ/RTO ช้าที่สุด ไปจนถึงต้นทุนสูง/RTO เร็วที่สุด:

### Backup and restore
Backups จะถูกสร้างขึ้นใน Region เดียวกับต้นฉบับ และยังถูกคัดลอกไปยังอีก Region หนึ่งด้วย วิธีนี้ให้การปกป้องที่มีประสิทธิภาพจากภัยพิบัติทุกขอบเขต (scope) กลยุทธ์ backup and restore ถือเป็นวิธีที่มีประสิทธิภาพน้อยที่สุดในแง่ RTO

### Pilot light
ด้วยกลยุทธ์ pilot light ข้อมูลจะ "มีชีวิต" (live) แต่บริการ (services) จะอยู่ในสถานะ idle ข้อมูล live หมายความว่า data stores และ databases จะอัปเดตล่าสุด (หรือเกือบล่าสุด) ตาม Region ที่ใช้งานอยู่ และพร้อมให้บริการ read operations ในภาพประกอบ database จะทำการ replicate ข้อมูลไปยัง local read-only cluster ใน recovery Region

ในกลยุทธ์ pilot light องค์ประกอบพื้นฐานของ infrastructure เช่น Elastic Load Balancing และ Amazon EC2 Auto Scaling จะพร้อมใช้งานอยู่ แต่องค์ประกอบด้าน functional (เช่น compute) จะถูก "ปิด" ไว้

### Fully working low-capacity standby
Fully working low-capacity standby รักษาการ deploy ขั้นต่ำที่สามารถรองรับคำขอ (requests) ได้ แต่ด้วย capacity ที่ลดลง — ไม่สามารถรองรับ traffic ระดับ production ได้ ก่อน failover จะต้องขยาย (scale up) infrastructure เพื่อให้ตรงตามความต้องการระดับ production

### Multi-site active/active
ด้วย multi-site active/active สอง Region ขึ้นไปจะรับคำขอพร้อมกันแบบ active Failover คือการเปลี่ยนเส้นทาง (re-route) คำขอออกจาก Region ที่ไม่สามารถให้บริการได้ ข้อมูลจะถูก replicate ข้าม Regions และถูกใช้งานจริงเพื่อให้บริการ read requests ใน Regions เหล่านั้น สำหรับ write requests สามารถใช้ pattern ต่าง ๆ ได้ เช่น เขียนไปยัง local Region หรือ re-route การเขียนไปยัง Region เฉพาะ

Backup และ recovery strategies ทำงานร่วมกัน ควรผสมผสานตัวเลือกที่เหมาะกับความต้องการของคุณเพื่อให้ได้แผน disaster recovery ที่มีประสิทธิภาพ

นี่คือการสรุปเนื้อหาของโมดูล backup and recovery ในบทเรียนถัดไปจะมี Knowledge Check สั้น ๆ เพื่อประเมินสิ่งที่คุณได้เรียนรู้

## Key terms
- Backup and restore: กลยุทธ์ DR ต้นทุนต่ำสุด แต่ RTO ช้าที่สุด
- Pilot light: กลยุทธ์ DR ที่ข้อมูล live แต่ compute อยู่ในสถานะปิด
- Fully working low-capacity standby (warm standby): กลยุทธ์ DR ที่มี deployment ขนาดเล็กพร้อมใช้งาน รองรับ RTO ระดับนาที
- Multi-site active/active: กลยุทธ์ DR ที่มีหลาย Region รับ traffic พร้อมกัน ให้ RTO เร็วที่สุดแต่ต้นทุนสูงสุด
