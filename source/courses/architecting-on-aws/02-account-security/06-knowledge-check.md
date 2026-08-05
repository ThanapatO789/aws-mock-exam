# Knowledge Check

แบบทดสอบท้ายโมดูล ใช้ทบทวนความเข้าใจเนื้อหาทั้งหมดของโมดูล 2 (Account Security) ผลลัพธ์ที่ได้จะช่วยชี้ให้เห็นหัวข้อที่ควรกลับไปทบทวนเพิ่มเติม ประกอบด้วยคำถาม 5 ข้อ ดังนี้ (คำตอบที่ถูกต้องยืนยันจากระบบหลังตอบจริง)

## คำถามที่ 1

**คำถาม:** ข้อใดสามารถแนบกับ user, group หรือ role ได้
(Which of the following can be attached to a user, group, or role?)

- Resource-based policies
- AWS STS
- Security groups
- **Identity-based policies** ✅ (คำตอบที่ถูกต้อง)

## คำถามที่ 2

**คำถาม:** ข้อใดกำหนดสิทธิ์ (permissions) บน resource เฉพาะเจาะจง และต้องมีการระบุ principal ไว้ใน policy
(Which of the following sets permissions on a specific resource and requires a principal to be listed in the policy?)

- Identity-based policies
- Service control policies (SCPs)
- **Resource-based policies** ✅ (คำตอบที่ถูกต้อง)
- Permissions boundaries

## คำถามที่ 3

**คำถาม:** ข้อใดคือองค์ประกอบของ programmatic access ของ IAM user (เลือก 2 ข้อ)
(Which of the following are elements of an IAM user's programmatic access? Select TWO.)

- User name
- **Access key ID** ✅ (คำตอบที่ถูกต้อง)
- Password
- **Secret access key** ✅ (คำตอบที่ถูกต้อง)
- MFA token

## คำถามที่ 4

**คำถาม:** Root user ควรถูกใช้สำหรับการบริหารจัดการประจำวัน (daily administration) ของบัญชี AWS
(The root user should be used for daily administration of your AWS account.)

- True
- **False** ✅ (คำตอบที่ถูกต้อง)

## คำถามที่ 5

**คำถาม:** ข้อใดที่สามารถจัดการได้เฉพาะผ่าน AWS Organizations เท่านั้น
(Which of the following can only be managed with AWS Organizations?)

- **Service control policies (SCPs)** ✅ (คำตอบที่ถูกต้อง)
- Resource-based policies
- Permissions boundaries
- Identity-based policies

หลังจากทำแบบทดสอบเสร็จ จะมีวิดีโอสรุปท้ายโมดูล (ความยาวประมาณ 4 นาที 46 วินาที) โดยเนื้อหาสรุปว่า จบเรื่อง account security แล้ว บทเรียนถัดไปสั้น ๆ จะเป็น Knowledge Check และในโมดูลถัดไปจะเรียนรู้วิธีสร้าง networking infrastructure บนคลาวด์

## Key terms
- Knowledge Check: แบบทดสอบสั้น ๆ ท้ายโมดูลเพื่อประเมินความเข้าใจ
- Programmatic access: การเข้าถึง AWS ผ่าน API/CLI/SDK โดยใช้ access key ID และ secret access key แทนการ login ด้วย user name/password
