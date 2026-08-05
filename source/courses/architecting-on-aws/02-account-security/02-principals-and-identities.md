# Principals and Identities

บทเรียนนี้เป็นเรื่องเกี่ยวกับแนวคิดด้านความปลอดภัย โดยเน้นวิธีใช้ **AWS Identity and Access Management (IAM)**

## AWS account root user

เมื่อสร้างบัญชี AWS ครั้งแรก จะเริ่มต้นด้วย **root user**

- Root user มีสิทธิ์เข้าถึงบริการและทรัพยากรทั้งหมดของบัญชีแบบสมบูรณ์ (complete access)
- เข้าถึง root user identity ได้โดยลงชื่อเข้าใช้ด้วยอีเมลและรหัสผ่านที่ระบุไว้ตอนสร้างบัญชี
- AWS แนะนำอย่างยิ่ง (strongly recommends) ว่า**ไม่ควร**ใช้ root user credentials สำหรับงานประจำวัน (day-to-day interactions) — ให้สร้าง user แยกต่างหากสำหรับงานทั่วไป
- ควรสร้างผู้ใช้เพิ่มเติม (additional users) และกำหนดสิทธิ์ตามหลัก **principle of least privilege** คือให้สิทธิ์เท่าที่จำเป็นเท่านั้น ไม่มากกว่านั้น
- แนวทางที่แนะนำ: เริ่มจากสร้าง **administrator user** แล้วบริหารจัดการบัญชีด้วย administrator user แทนการใช้ root user

## AWS Identity and Access Management (IAM)

IAM เป็น web service ที่ช่วยควบคุมการเข้าถึงทรัพยากร AWS อย่างปลอดภัย ใช้ IAM เพื่อควบคุมว่าใครถูก **authenticated** (ผ่านการยืนยันตัวตน/signed in) และใครถูก **authorized** (มีสิทธิ์/permissions) ในการใช้ทรัพยากร

มองว่า IAM เป็นเครื่องมือกลางสำหรับจัดการสิทธิ์เข้าถึงในการเปิดใช้งาน (launching), กำหนดค่า (configuring), บริหารจัดการ (managing) และยกเลิก (terminating) ทรัพยากรต่าง ๆ โดยมีการควบคุมสิทธิ์แบบละเอียด (granular) อิงตามทรัพยากร ซึ่งช่วยกำหนดว่าใครมีสิทธิ์เรียกใช้ API operation ใดได้บ้าง

### Authentication (การยืนยันตัวตน)

Principal ต้องผ่านการ authenticated (signed in เข้า AWS) โดยใช้ credentials ก่อนจึงจะส่ง request ไปยัง AWS ได้ บริการบางตัว เช่น Amazon S3 และ AWS STS อนุญาตให้มี request บางส่วนจากผู้ใช้แบบไม่ระบุตัวตน (anonymous users) ได้ แต่เป็นข้อยกเว้น ไม่ใช่กฎทั่วไป

การ authenticate จาก console ในฐานะ root user ต้องลงชื่อเข้าใช้ด้วยอีเมลและรหัสผ่าน

### Authorization (การให้สิทธิ์)

นอกจากผ่านการ authenticated แล้ว ยังต้องถูก **authorized** (ได้รับอนุญาต) ให้ทำ request นั้นสำเร็จด้วย ระหว่างขั้นตอน authorization นี้ AWS จะตรวจสอบค่าจาก request context เทียบกับ policies ที่เกี่ยวข้อง เพื่อตัดสินใจว่าจะ allow หรือ deny request

## IAM users

โดยค่าเริ่มต้น (default) ผู้ใช้ IAM ใหม่จะยังไม่มีสิทธิ์ใด ๆ ถูกกำหนด (no permissions assigned) — ไม่ได้รับอนุญาตให้ทำ AWS operations หรือเข้าถึงทรัพยากรใด ๆ ข้อดีของการมี IAM user แยกแต่ละคนคือสามารถกำหนดสิทธิ์ให้แต่ละคนได้เป็นรายบุคคล (individually)

ตัวอย่างเช่น IAM users ในบัญชี AWS (Administrator, Developer, Auditor) แต่ละคนมีระดับสิทธิ์การเข้าถึงทรัพยากรต่างกัน (Amazon S3 bucket, Amazon EC2 instance, IAM user list) ขึ้นอยู่กับ permissions ที่ถูกกำหนดไว้

### Setting permissions with IAM policies

เพื่อให้ IAM users สามารถสร้างหรือแก้ไขทรัพยากรและทำงานต่าง ๆ ได้:

1. สร้าง **IAM policies** ที่ให้สิทธิ์ IAM users เข้าถึงทรัพยากรและ API operations ที่ต้องการโดยเฉพาะ
2. แนบ (attach) policies เข้ากับ IAM users หรือ groups ที่ต้องการสิทธิ์นั้น

ผู้ใช้จะมีสิทธิ์ตามที่ระบุใน policy เท่านั้น ผู้ใช้ส่วนใหญ่มีหลาย policies ประกอบกันเพื่อแทนสิทธิ์ทั้งหมดของผู้ใช้นั้น

ตัวอย่าง: Policy 1 สำหรับ Amazon S3 administrators ให้สิทธิ์เต็ม (**AmazonS3FullAccess**) ส่วน Policy 2 สำหรับ auditors ให้สิทธิ์อ่านอย่างเดียว (read-only) กับทั้ง Amazon EC2 และ Amazon S3 (**AmazonEC2ReadOnlyAccess**, **AmazonS3ReadOnlyAccess**)

## IAM roles

IAM roles ให้ **temporary AWS credentials** จัดการง่ายเพราะพนักงานหรือแอปพลิเคชันหลายรายสามารถใช้ role เดียวกันได้ ใช้ roles เพื่อมอบสิทธิ์เข้าถึง (delegate access) ให้ users, applications หรือ services ที่ปกติไม่มีสิทธิ์เข้าถึงทรัพยากร AWS ของคุณ

การ assume role ทำได้ผ่านการเรียก API โดยใช้วิธีใดวิธีหนึ่งต่อไปนี้:

- The console
- AWS CLI
- AssumeRole API
- AWS Security Token Service (AWS STS)

**AssumeRole** action จะคืนค่า temporary security credentials ชุดหนึ่ง ประกอบด้วย access key ID, secret access key และ security token โดยทั่วไปใช้สำหรับ cross-account access หรือ federation

สามารถสลับ (switch) role ได้จาก AWS Management Console หรือเรียกผ่าน AWS CLI/API operation หรือใช้ custom URL วิธีที่ใช้จะเป็นตัวกำหนดว่าใครสามารถ assume role ได้ และ role session จะคงอยู่ได้นานแค่ไหน เมื่อใช้ **AssumeRole\*** API operations, IAM role ที่ถูก assume คือ resource ส่วน user หรือ role ที่เรียก API นั้นคือ principal

ตัวอย่าง: group "Analysts" และ users (Richard, Ana, Shirley) — Ana และ Shirley สามารถ assume role "DevApp1" (IAM role) เพื่อใช้สิทธิ์เฉพาะของ role นั้นเป็นการชั่วคราว

### Assuming a role

ขั้นตอนการ assume role มี 3 จุดสำคัญ:

1. **Use an API call to assume a role** — assume role ผ่าน trusted entity เช่น IAM user, AWS service หรือ federated user โดย IAM users assume roles ผ่าน AWS Management Console หรือ AWS Command Line Interface (AWS CLI) ซึ่งใช้ AssumeRole API ส่วน AWS services ใช้ API call เดียวกันในการ assume roles ในบัญชีของคุณ ผู้ใช้ federated ใช้ AssumeRoleWithSAML หรือ AssumeRoleWithWebIdentity API calls
2. **Return temporary security credentials** — API call จะถูกส่งไปยัง AWS Security Token Service (AWS STS) ซึ่งเป็น web service ที่ให้ temporary, limited-privilege credentials สำหรับ IAM หรือ federated users โดยคืนค่าชุด temporary security credentials ประกอบด้วย access key ID, secret access key และ security token
3. **Use temporary credentials** — เมื่อได้รับ temporary security credentials แล้ว trusted entities สามารถนำไปใช้เข้าถึงทรัพยากร AWS ได้

## IAM user access

IAM user สามารถเข้าถึง AWS services ได้สองช่องทาง คือผ่าน **AWS Management Console** หรือ **programmatic access**

**AWS Management Console:** IAM user เข้าถึง console ได้โดยใช้ user credentials (user name และ password) เพื่อยืนยันตัวตน

**Programmatic access:** IAM user เข้าถึง AWS services ผ่าน API calls, AWS CLI หรือ AWS Tools for Windows PowerShell/AWS API tools สำหรับ Linux เมื่อได้รับ programmatic access จะมีการสร้าง key pair (access key ID และ secret access key) ให้ใช้ตั้งค่า AWS CLI หรือเรียก API ผ่าน AWS SDK

### The AWS Command Line Interface (AWS CLI)

AWS CLI เป็นเครื่องมือ open source ที่ให้ผู้ใช้โต้ตอบกับ AWS services ผ่านคำสั่งในบรรทัดคำสั่ง (command-line shell) ด้วยการตั้งค่าเพียงเล็กน้อย AWS CLI ทำให้เริ่มรันคำสั่งที่มีฟังก์ชันเทียบเท่ากับ AWS Management Console แบบ browser-based ได้จาก terminal

การตั้งค่า AWS CLI บน client ด้วยคำสั่ง `aws configure` ต้องระบุองค์ประกอบ 4 อย่าง:

- AWS Access Key ID
- AWS Secret Access Key
- Default region name
- Default output format (json, yaml, yaml-stream, text, table)

## Key terms
- Root user: ผู้ใช้ระดับสูงสุดของบัญชี AWS มีสิทธิ์เข้าถึงทุกอย่าง ไม่ควรใช้ในงานประจำวัน
- IAM (Identity and Access Management): บริการควบคุมสิทธิ์การเข้าถึง AWS resources
- Authentication: การยืนยันตัวตนผู้ใช้ (signed in)
- Authorization: การตรวจสอบและให้สิทธิ์การทำ request
- IAM policy: เอกสารกำหนดสิทธิ์ที่แนบกับ user/group/role
- IAM role: ตัวตนที่ให้ temporary credentials สำหรับ delegate access
- AssumeRole: API action สำหรับขอ temporary security credentials จาก role
- AWS STS (Security Token Service): บริการออก temporary, limited-privilege credentials
- AWS CLI (Command Line Interface): เครื่องมือ open source สำหรับสั่งงาน AWS ผ่าน command line
