# Protecting the AWS Root User

เมื่อเข้าใช้งาน AWS ครั้งแรก จะเริ่มต้นด้วย single sign-in identity ที่เรียกว่า **root user**

## AWS root user
เมื่อสร้างบัญชี AWS ครั้งแรก จะได้รับ single sign-in identity ที่มีสิทธิ์เข้าถึง AWS services และทรัพยากรทั้งหมดในบัญชีอย่างสมบูรณ์ identity นี้เรียกว่า AWS root user และเข้าถึงได้โดยล็อกอินด้วยอีเมลและรหัสผ่านที่ใช้สร้างบัญชี

## AWS root user credentials
AWS root user มี credentials 2 ชุด:
1. **อีเมลและรหัสผ่าน** ที่ใช้สร้างบัญชี ใช้เข้าถึง AWS Management Console
2. **Access keys** ใช้สำหรับส่งคำขอแบบ programmatic ผ่าน AWS Command Line Interface (AWS CLI) หรือ AWS API

Access keys ประกอบด้วย 2 ส่วน:
- **Access key ID**: เช่น `A2lAl5EXAMPLE`
- **Secret access key**: เช่น `wJalrFE/KbEKxE`

คล้ายกับชุด username/password ต้องใช้ทั้ง access key ID และ secret access key เพื่อยืนยันตัวตนคำขอผ่าน AWS CLI หรือ AWS API ควรจัดการ access keys ด้วยความปลอดภัยระดับเดียวกับอีเมลและรหัสผ่าน

### ลบ access keys เพื่อความปลอดภัย!
หากไม่มี access key สำหรับ root user ของบัญชี ไม่ควรสร้างขึ้นเว้นแต่จำเป็นจริงๆ หากมี access key อยู่แล้วและต้องการลบ ทำตามขั้นตอนนี้:
1. ใน AWS Management Console ไปที่ username มุมขวาบนของแถบนำทาง จากเมนู dropdown ไปที่หน้า My Security Credentials แล้วล็อกอินด้วยอีเมลและรหัสผ่านของ root user
2. เปิดส่วน Access keys
3. ที่ Actions เลือก Delete
4. เลือก Yes

## แนวปฏิบัติที่ดีที่สุดสำหรับ AWS root user
root user มีสิทธิ์เข้าถึง AWS services และทรัพยากรทั้งหมดในบัญชี รวมถึงข้อมูลการเรียกเก็บเงินและข้อมูลส่วนตัว จึงควรเก็บ credentials ของ root user ไว้อย่างปลอดภัยและไม่ใช้ root user สำหรับงานประจำวัน

แนวปฏิบัติที่ดีเพื่อความปลอดภัยของ root user:
- ตั้งรหัสผ่านที่แข็งแรงสำหรับ root user
- เปิดใช้ multi-factor authentication (MFA) สำหรับ root user
- ห้ามแชร์รหัสผ่านหรือ access keys ของ root user กับใครก็ตาม
- ปิดใช้งานหรือลบ access keys ที่เชื่อมโยงกับ root user
- สร้าง IAM user สำหรับงาน administrative หรืองานประจำวันแทน

## Multi-factor authentication (MFA)
เมื่อสร้างบัญชี AWS และล็อกอินครั้งแรก จะใช้ single-factor authentication เช่น อีเมลกับรหัสผ่าน (เช่นเดียวกับ AWS root user) รูปแบบ single-factor authentication อื่นๆ ได้แก่ security pin หรือ security token

แต่บางครั้งรหัสผ่านของผู้ใช้เดาได้ง่าย เช่น รหัสผ่านของเพื่อนร่วมงาน Bob คือ `IloveCats222` ซึ่งคนที่รู้จัก Bob เป็นการส่วนตัวอาจเดาได้ เพราะเป็นการรวมข้อมูลที่จำง่ายเกี่ยวกับ Bob (Bob ชอบแมวและวันเกิดคือ 22 กุมภาพันธ์) หากผู้ไม่หวังดีเดาหรือ crack รหัสผ่านของ Bob ผ่าน social engineering, bots, หรือ scripts Bob อาจเสียการควบคุมบัญชีของตน ซึ่งเป็นสถานการณ์ที่พบได้บ่อยกับผู้ใช้เว็บไซต์ทั่วไป นี่จึงเป็นเหตุผลที่การใช้ **multi-factor authentication (MFA)** มีความสำคัญในการป้องกันการเข้าถึงบัญชีที่ไม่พึงประสงค์

MFA ต้องการวิธียืนยันตัวตนตั้งแต่ 2 วิธีขึ้นไปเพื่อยืนยันตัวตน โดยแบ่งเป็น 3 หมวดหมู่ของข้อมูล:
- **Something you know**: เช่น username/password หรือ pin number
- **Something you have**: เช่น one-time passcode จาก hardware device หรือ mobile app
- **Something you are**: เช่น ลายนิ้วมือหรือเทคโนโลยีสแกนใบหน้า

การผสมข้อมูลเหล่านี้ช่วยให้ระบบมีการป้องกันแบบหลายชั้น แม้ว่าวิธียืนยันตัวตนแรก เช่น รหัสผ่านของ Bob จะถูก crack แต่วิธียืนยันตัวตนที่สอง เช่น ลายนิ้วมือ จะช่วยเพิ่มระดับความปลอดภัย ชั้นความปลอดภัยเพิ่มเติมนี้ช่วยปกป้องบัญชีที่สำคัญที่สุดได้ จึงควรเปิดใช้ MFA บน AWS root user

## MFA บน AWS
หากเปิดใช้ MFA บน root user ต้องกรอกข้อมูลยืนยันตัวตนจากทั้งหมวด something you know และ something you have ข้อมูลชิ้นแรกที่ผู้ใช้กรอกคือชุดอีเมลและรหัสผ่าน ข้อมูลชิ้นที่สองคือรหัสตัวเลขชั่วคราวจาก MFA device

การใช้ MFA เพิ่มชั้นความปลอดภัยเพิ่มเติม เพราะต้องการให้ผู้ใช้ใช้กลไก MFA ที่รองรับ นอกเหนือจาก credentials ปกติในการล็อกอิน การเปิดใช้ MFA บนบัญชี AWS root user เป็น AWS best practice

## MFA devices ที่รองรับ
AWS รองรับกลไก MFA หลากหลายรูปแบบ:

| ประเภท | รายละเอียด | ตัวอย่าง |
|---|---|---|
| **Virtual MFA device / authenticator app** | แอปที่ใช้บนมือถือหรือฮาร์ดแวร์ที่มีระดับความปลอดภัยเท่า hardware หรือ FIDO security key | Twilio Authy Authenticator, Duo Mobile, LastPass Authenticator, Microsoft Authenticator, Google Authenticator, Symantec VIP |
| **Hardware TOTP token** | ฮาร์ดแวร์ (มักเป็น key fob หรือ display card) ที่สร้างรหัส 6 หลักแบบ time-based one-time password (TOTP) | Key fob, display card |
| **FIDO security keys** | ฮาร์ดแวร์ security key ที่ผ่านการรับรอง FIDO จากผู้ให้บริการภายนอก เช่น Yubico เสียบผ่านพอร์ต USB ของคอมพิวเตอร์ | FIDO Certified products |

## Key terms
- Root user: identity ที่มีสิทธิ์เข้าถึง AWS services และทรัพยากรทั้งหมดในบัญชีอย่างสมบูรณ์
- Access key: credential (access key ID + secret access key) สำหรับเรียก API แบบ programmatic
- MFA (Multi-factor authentication): การยืนยันตัวตนที่ต้องใช้หลักฐานตั้งแต่ 2 ประเภทขึ้นไป
- TOTP (Time-based one-time password): รหัสผ่านชั่วคราวที่คำนวณจากเวลา ใช้กับ hardware MFA token
