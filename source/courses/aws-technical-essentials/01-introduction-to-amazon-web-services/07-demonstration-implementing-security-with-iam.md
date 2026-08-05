# Demonstration: Implementing Security with IAM

บทเรียนนี้เป็นวิดีโอสาธิต (demonstration) ล้วนๆ ไม่มีเนื้อหาข้อความเพิ่มเติมนอกจากวิดีโอและบทถอดเสียง (transcript) — วิดีโอนี้เป็นการสาธิตแบบดูอย่างเดียว ไม่ใช่แบบฝึกหัดลงมือทำ (hands-on)

## เนื้อหาการสาธิต
วิดีโอสาธิตการสร้าง **IAM role** สำหรับแอปพลิเคชัน employee directory และสาธิตการสร้าง **IAM user** พร้อมดู **AWS access keys** ที่ใช้สำหรับ programmatic access ไปยัง AWS APIs

### สร้าง IAM role
1. ไปที่ **Roles** ในแถบนำทางซ้ายของ IAM dashboard แล้วเลือก **Create role**
2. เลือก **Trusted entity type** — เนื่องจาก role ให้ credentials ชั่วคราวสำหรับเรียก AWS API จึงต้องจำกัดว่าใครสามารถ assume role นี้ได้ ตัวเลือกที่มี เช่น
   - **AWS service** เช่น EC2 instance, Lambda function, หรือ service อื่นที่ assume role เพื่อเรียก AWS API
   - **AWS account** สำหรับให้บัญชี AWS อื่นเข้าถึง
   - ในสาธิตนี้เลือก **EC2** เนื่องจากแอปพลิเคชัน employee directory จะรันบน EC2
3. หน้า **Add permissions** จะแสดงรายชื่อ AWS managed policies ที่มีอยู่แล้วในบัญชี (managed policy คือ policy ที่สร้างและดูแลโดย AWS) — ตัวอย่างเช่นค้นหา "S3" แล้วดู policy **AmazonS3FullAccess** จะเห็น JSON permissions ที่มี:
   - `Effect`: `Allow` หรือ `Deny` เท่านั้น
   - `Action`: กำหนด AWS API calls ที่อนุญาต เช่น `s3:*` และ `s3-object-lambda:*` (wildcard หมายถึงทุก API call ของ service นั้น)
   - `Resource`: กำหนดขอบเขตทรัพยากร เช่น `*` หมายถึงทรัพยากร S3 ทั้งหมด — policy แบบนี้ permissive มาก ในโลกจริงควรจำกัดเฉพาะ API calls และทรัพยากรที่แอปพลิเคชันต้องใช้จริง (ต้องสร้าง custom policy)
4. เลือก **AmazonS3FullAccess** และค้นหาเพิ่ม **AmazonDynamoDBFullAccess** (เพราะบทเรียนถัดไปจะใช้ DynamoDB เป็นฐานข้อมูลของแอปนี้) แล้วคลิก Next
5. ตั้งชื่อ role เช่น `EmployeeWebApp` แล้วดู trust policy — trust policy อนุญาต API call `STS AssumeRole` โดยระบุว่า `ec2.amazonaws.com` เท่านั้นที่ assume role นี้ได้ (คือ EC2 instance เท่านั้น)
6. คลิก **Create role** เมื่อสร้างเสร็จ สามารถคลิกดู role เพื่อดูรายละเอียด เช่น ARN (Amazon Resource Name), permissions ที่แนบ, trust relationships, และ tags

### สร้าง IAM user
1. ไปที่ **Users** ในแถบนำทางซ้าย แล้วคลิก **Add users**
2. ตั้งชื่อผู้ใช้ เช่น `EC2Admin` และเลือก checkbox **Enable console access** เพื่อให้ผู้ใช้ต้องเปลี่ยนรหัสผ่านเมื่อล็อกอินครั้งแรก
3. เพิ่มผู้ใช้เข้ากลุ่ม — สร้างกลุ่มใหม่ชื่อ `EC2Admins` แล้วแนบ policy **AmazonEC2FullAccess** เข้ากับกลุ่ม (เพราะการแนบ policy ที่กลุ่มเป็น best practice มากกว่าแนบที่ user โดยตรง)
4. เพิ่ม user เข้ากลุ่ม `EC2Admins` แล้วดูสรุปสิทธิ์ที่ user ได้รับ — user จะได้รับสิทธิ์จากกลุ่ม EC2Admins และมี permission `IAMUserChangePassword` แนบตรงเพื่อให้เปลี่ยนรหัสผ่านได้
5. คลิก **Create user**

### สร้างและดู Access keys
1. คลิกที่ user แล้วไปที่แท็บ **Security Credentials** เลื่อนลงไปดูส่วน **Access keys**
2. Access keys ใช้สำหรับให้ผู้ใช้เรียก API แบบ programmatic เช่นผ่าน AWS CLI หรือ AWS SDK เมื่อพัฒนาบนเครื่อง local
3. คลิกสร้าง access key เลือกใช้งานสำหรับ command line แล้วยอมรับคำแนะนำ (AWS แนะนำให้ใช้ AWS CloudShell แทนก็ได้ แต่ในสาธิตนี้สร้าง access keys ต่อไป)
4. หลังสร้างเสร็จจะเห็น **access key** และ **secret access key** (secret จะถูกซ่อนไว้ ต้องคลิก show หรือ copy) — ใช้คู่นี้เพื่อตั้งค่า command line บนเครื่อง local

## Key terms
- IAM role (สาธิต): ในตัวอย่างนี้สร้าง role ชื่อ EmployeeWebApp ให้ EC2 instance assume เพื่อเข้าถึง S3 และ DynamoDB
- Trust policy: ส่วนของ role ที่ระบุว่า identity ใดสามารถ assume role นี้ได้ (เช่น `ec2.amazonaws.com`)
- Managed policy: IAM policy ที่ AWS สร้างและดูแลให้ พร้อมใช้งานได้ทันที เช่น AmazonS3FullAccess
- Access key: credential (access key ID + secret access key) สำหรับเรียก AWS API แบบ programmatic จาก local machine
