# Securing Objects

บทเรียนนี้พูดถึงวิธีการรักษาความปลอดภัยของ object ที่จัดเก็บใน Amazon S3 bucket โดยเน้นที่วิธีการควบคุมการเข้าถึง (access control)

## Amazon S3 access control

โดยค่าเริ่มต้น ทรัพยากรทั้งหมดของ Amazon S3 ไม่ว่าจะเป็น bucket, object และทรัพยากรที่เกี่ยวข้อง (เช่น lifecycle configuration และ website configuration) จะเป็นแบบ private มีเพียงเจ้าของทรัพยากร (resource owner) ซึ่งคือ AWS account ที่สร้างทรัพยากรนั้นเท่านั้นที่เข้าถึงได้ เจ้าของสามารถให้สิทธิ์การเข้าถึงแก่ผู้อื่นได้โดยการเขียน access policy

สามารถทำให้ทรัพยากรใน Amazon S3 เป็น public ได้ ซึ่งจะอนุญาตให้ทุกคนเข้าถึงได้ แต่ use case ส่วนใหญ่ของ Amazon S3 ไม่จำเป็นต้องเปิด public access

## Bucket policies

สามารถสร้างและกำหนดค่า bucket policy เพื่อให้สิทธิ์ในการเข้าถึง bucket และ object ของ Amazon S3 ได้

**Bucket policy** เป็น resource-based policy สำหรับ S3 bucket การควบคุมการเข้าถึงข้อมูลอิงตาม policy หลายประเภท เช่น IAM policies, S3 bucket policies และ AWS Organizations service control policies (SCPs)

ใช้ภาษา JSON-based access policy ในการเขียน bucket policy สามารถใช้เพื่อเพิ่มหรือปฏิเสธสิทธิ์สำหรับ object ใน bucket ได้ ในตัวอย่าง bucket policy อนุญาตให้ principal ใดก็ตาม list bucket และ get object ใด ๆ จาก bucket ได้ ควรพิจารณาจำกัด public access ต่อ bucket และ object ลักษณะนี้ Amazon S3 มีเครื่องมือที่ช่วยป้องกัน bucket ที่เปิด public access มากเกินไป (overly-permissive)

## Amazon S3 access points

**Amazon S3 access points** ช่วยให้การจัดการการเข้าถึงข้อมูลขนาดใหญ่สำหรับชุดข้อมูลที่ใช้ร่วมกัน (shared datasets) ใน S3 ง่ายขึ้น access point คือ named network endpoint ที่ใช้ทำ S3 object operation เช่น `GetObject` และ `PutObject` โดย access point จะผูกกับ bucket แต่ละ access point มีสิทธิ์และการควบคุมเครือข่ายเฉพาะที่ Amazon S3 ใช้กับทุก request ที่ผ่าน access point นั้น

แต่ละ access point บังคับใช้ access point policy เฉพาะที่ทำงานร่วมกับ bucket policy ของ bucket ที่อยู่เบื้องหลัง สามารถจำกัดการเข้าถึงข้อมูล S3 ให้อยู่ในเครือข่ายส่วนตัวได้โดยกำหนดค่า access point ให้รับเฉพาะ request จาก VPC เท่านั้น และสามารถกำหนดค่า custom block public access ต่อ access point แต่ละอันได้

ตัวอย่าง: พนักงานฝ่ายการเงิน (finance) assume IAM role ของทีมการเงิน แล้วส่ง `GetObject` request ไปยัง finance access point access point policy อนุญาตให้ finance role เข้าถึง object ใน `doc-example-bucket` ที่มี prefix `/finance` และ `/tax` เท่านั้น finance role จะไม่มีสิทธิ์เข้าถึง object ที่มี prefix ของฝ่ายขายและการตลาด หรือ object อื่น ๆ ใน S3 bucket โดย S3 bucket policy อนุญาตให้ finance access point เข้าถึง bucket ได้

## Server-side encryption key types (hotspot)

- **Amazon S3 managed keys (SSE-S3)**: เมื่อใช้ SSE-S3 แต่ละ object จะถูกเข้ารหัสด้วย key เฉพาะของตัวเอง และเพื่อความปลอดภัยเพิ่มเติม key นั้นจะถูกเข้ารหัสอีกชั้นด้วย primary key ที่มีการหมุนเวียน (rotate) เป็นประจำ Amazon S3 server-side encryption ใช้ 256-bit Advanced Encryption Standard (AES-256) ในการเข้ารหัสข้อมูล
- **AWS KMS keys (SSE-KMS)**: คล้ายกับ SSE-S3 แต่มีประโยชน์เพิ่มเติมและมีค่าใช้จ่ายเพิ่ม มีสิทธิ์แยกต่างหากสำหรับการใช้ KMS key ซึ่งช่วยป้องกันการเข้าถึง object ใน Amazon S3 โดยไม่ได้รับอนุญาต และ SSE-KMS ยังมี audit trail แสดงว่า KMS key ถูกใช้เมื่อใดและโดยใคร
- **Customer-provided keys (SSE-C)**: ผู้ใช้จัดการ encryption key เอง ส่วน Amazon S3 จัดการการเข้ารหัสตอนเขียนลงดิสก์ และจัดการการถอดรหัสตอนเข้าถึง object

## Key terms
- Bucket policy: resource-based policy แบบ JSON สำหรับควบคุมสิทธิ์ของ S3 bucket
- IAM policy: policy ที่ผูกกับ identity (user/role) เพื่อกำหนดสิทธิ์
- AWS Organizations SCP (service control policy): policy ระดับองค์กรที่จำกัดสิทธิ์สูงสุดของบัญชีในองค์กร
- S3 access point: named network endpoint สำหรับเข้าถึง object ใน bucket แบบมี policy เฉพาะ
- SSE-S3 / SSE-KMS / SSE-C: รูปแบบการเข้ารหัสฝั่งเซิร์ฟเวอร์ (server-side encryption) ของ Amazon S3
- AES-256: มาตรฐานการเข้ารหัสแบบ symmetric key ขนาด 256 บิต
