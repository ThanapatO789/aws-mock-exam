# Additional Amazon S3 Features

บทเรียนนี้พูดถึงฟีเจอร์เพิ่มเติมของ S3 ที่สามารถนำไปใช้สร้างระบบจัดเก็บข้อมูลสำหรับแอปพลิเคชัน

## Amazon S3 event notifications

**Amazon S3 event notifications** ช่วยให้ได้รับการแจ้งเตือนเมื่อมีเหตุการณ์บางอย่างเกิดขึ้นกับ object ใน bucket โมเดลแบบ event-driven นี้ทำให้ไม่ต้องสร้างหรือดูแล server-based polling infrastructure เพื่อตรวจสอบการเปลี่ยนแปลงของ object และไม่ต้องเสียค่าใช้จ่ายช่วงที่ infrastructure ว่าง (idle) เมื่อไม่มีการเปลี่ยนแปลงให้ประมวลผล

Amazon S3 สามารถส่ง event notification message ไปยังปลายทางต่อไปนี้:

- **Amazon Simple Notification Service (Amazon SNS)** topics
- **Amazon Simple Queue Service (Amazon SQS)** queues
- **AWS Lambda** function

## Amazon S3 multipart upload

Amazon S3 รองรับ multipart upload ซึ่งช่วยให้อัปโหลด object ขนาดใหญ่ได้อย่างสม่ำเสมอ (consistently) โดยมีขั้นตอน:

1. Initiate the upload
2. Upload the object parts
3. Complete the multipart upload

เมื่อ multipart upload request เสร็จสมบูรณ์ Amazon S3 จะสร้าง object เต็มรูปแบบขึ้นมาใหม่จากชิ้นส่วน (part) แต่ละชิ้น

## Amazon S3 Transfer Acceleration

**Amazon S3 Transfer Acceleration** ใช้ AWS edge location ที่กระจายอยู่ทั่วโลกเพื่อช่วยให้การถ่ายโอนข้อมูลเข้า S3 bucket รวดเร็วขึ้น ข้อมูลจะถูก route ไปยัง Amazon S3 ผ่านเส้นทางเครือข่ายที่ปรับให้เหมาะสม (optimized network path)

ควรใช้ Transfer Acceleration เมื่อ:

- มีลูกค้าทั่วโลกที่อัปโหลดไปยัง bucket ศูนย์กลาง (centralized bucket)
- ต้องถ่ายโอนข้อมูลระดับกิกะไบต์หรือเทราไบต์ข้ามทวีปเป็นประจำ
- ใช้แบนด์วิดท์ที่มีอยู่ไม่เต็มประสิทธิภาพเมื่ออัปโหลดผ่านอินเทอร์เน็ตไปยัง Amazon S3

## Amazon S3 cost factors (accordion 5 หมวด)

- **Storage**: ค่าใช้จ่ายต่อกิกะไบต์ในการเก็บ object โดยอัตราค่าใช้จ่ายขึ้นกับขนาด object ระยะเวลาที่เก็บในเดือนนั้น และ storage class ที่ใช้ นอกจากนี้ยังมีค่าใช้จ่าย per-request สำหรับการนำข้อมูลเข้า (ingest) เมื่อใช้ PUT, COPY หรือ lifecycle rule เพื่อย้ายข้อมูลเข้า storage class ใด ๆ
- **Requests and Retrievals**: จำนวน API call เช่น PUT และ GET request จ่ายตาม request ที่ทำต่อ bucket และ object โดยต้นทุนคิดตามประเภท request และปริมาณ request เมื่อใช้ Amazon S3 console เพื่อ browse storage ก็จะมีค่าใช้จ่ายจาก GET, LIST และ request อื่น ๆ ที่เกิดขึ้นด้วย
- **Data transfer**: โดยทั่วไปไม่มีค่าธรรมเนียมสำหรับข้อมูลขาเข้า (data-in) จากอินเทอร์เน็ต แต่ข้อมูลขาออก (data-out) จะมีค่าใช้จ่ายแตกต่างกันตามตำแหน่งผู้ร้องขอและช่องทางการถ่ายโอน
- **Management and analytics**: จ่ายค่าใช้จ่ายสำหรับฟีเจอร์ด้าน storage management และ analytics ที่เปิดใช้งานบน bucket ของบัญชี (รายละเอียดไม่ครอบคลุมในคอร์สนี้)
- **S3 Replication and Versioning**: ทั้ง replication และ versioning สร้างสำเนาของ object หลายชุด และมีค่าใช้จ่ายต่อ PUT request เพิ่มเติมจากค่า storage tier โดย S3 Cross-Region Replication ยังต้องมีค่าใช้จ่ายในการถ่ายโอนข้อมูลข้าม AWS Region ด้วย

เนื้อหาเรื่อง S3 จบเพียงเท่านี้ บทเรียนถัดไปจะทบทวนตัวเลือกในการสร้างระบบจัดเก็บข้อมูลแบบ shared file system ที่ปลอดภัยและ scalable

## Key terms
- Amazon SNS: บริการส่งข้อความแจ้งเตือนแบบ pub/sub
- Amazon SQS: บริการคิวข้อความ
- AWS Lambda: บริการรัน code แบบ serverless
- Multipart upload: การอัปโหลดไฟล์ขนาดใหญ่แบบแบ่งเป็นชิ้นส่วน
- S3 Transfer Acceleration: ฟีเจอร์เร่งความเร็วการอัปโหลดข้อมูลเข้า S3 ผ่าน edge location
- S3 Cross-Region Replication (CRR): การทำสำเนา object ข้าม AWS Region
