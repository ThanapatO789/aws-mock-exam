# AWS Identity and Access Management

**Authentication** ตอบคำถามว่า "คุณคือคนที่คุณอ้างหรือไม่" ส่วน **Authorization** ตอบคำถามว่า "คุณสามารถทำอะไรได้บ้าง"

## Authentication และ Authorization
เมื่อตั้งค่าการเข้าถึงบัญชีใดๆ จะเจอ 2 คำศัพท์บ่อยๆ คือ authentication และ authorization แม้จะดูเป็นแนวคิดพื้นฐาน แต่ต้องเข้าใจให้ชัดเจนเพื่อตั้งค่า access management บน AWS ได้อย่างถูกต้อง

- **Authentication**: เมื่อสร้างบัญชี AWS จะใช้อีเมลและรหัสผ่านเพื่อยืนยันตัวตน หากผู้ใช้กรอกอีเมลและรหัสผ่านถูกต้อง ระบบจะสันนิษฐานว่าผู้ใช้ได้รับอนุญาตให้เข้าใช้งานได้ นี่คือกระบวนการ authentication ซึ่งยืนยันว่าผู้ใช้คือคนที่อ้างจริง รูปแบบที่พบบ่อยที่สุดคือ username/password แต่อาจใช้รูปแบบอื่นได้เช่น token-based authentication หรือ biometric data เช่นลายนิ้วมือ
- **Authorization**: หลังจากยืนยันตัวตนและเข้าสู่บัญชีแล้ว ขั้นตอนถัดไปคือตรวจสอบว่าสามารถทำอะไรได้บ้าง — นี่คือ authorization ซึ่งเป็นกระบวนการมอบสิทธิ์การเข้าถึงทรัพยากรและ service ของ AWS ให้กับผู้ใช้ กำหนดว่าผู้ใช้สามารถทำ action เช่น read, edit, delete, หรือ create resource ได้หรือไม่

## IAM คืออะไร (What is IAM?)
**AWS Identity and Access Management (IAM)** คือ AWS service ที่ช่วยจัดการการเข้าถึงบัญชีและทรัพยากร AWS ของคุณ ให้มุมมองรวมศูนย์ว่าใครและอะไรได้รับอนุญาตให้เข้าถึงบัญชี AWS (authentication) และใครหรืออะไรมีสิทธิ์ใช้และทำงานกับทรัพยากร AWS (authorization)

ด้วย IAM สามารถแชร์การเข้าถึงบัญชีและทรัพยากร AWS ได้โดยไม่ต้องแชร์ access keys หรือรหัสผ่านของตนเอง สามารถให้สิทธิ์การเข้าถึงแบบละเอียด (granular) แก่คนที่ทำงานในบัญชีของคุณ เพื่อให้บุคคลและ service เข้าถึงเฉพาะทรัพยากรที่จำเป็นเท่านั้น เช่น หากต้องการให้ผู้ใช้บัญชี AWS มีสิทธิ์ read-only ต่อ service หนึ่ง สามารถเลือกได้อย่างละเอียดว่า action ใดและทรัพยากรใดใน service นั้นที่พวกเขาเข้าถึงได้

## IAM features
IAM มีฟีเจอร์หลายอย่างเพื่อช่วยควบคุมการเข้าถึงและจัดการ identity ในบัญชี AWS:
- **Global**: IAM เป็น global ไม่ผูกกับ Region ใดโดยเฉพาะ สามารถดูและใช้ IAM configuration จาก Region ใดก็ได้ใน AWS Management Console
- **Integrated with AWS services**: IAM ผสานกับ AWS services หลายตัวโดยค่าเริ่มต้น
- **Shared access**: สามารถให้สิทธิ์ identity อื่นในการดูแลและใช้ทรัพยากรในบัญชี AWS โดยไม่ต้องแชร์รหัสผ่านและ key ของคุณ
- **Multi-factor authentication (MFA)**: IAM รองรับ MFA สามารถเพิ่ม MFA ให้กับบัญชีและผู้ใช้แต่ละคนเพื่อความปลอดภัยเพิ่มเติม
- **Identity federation**: IAM รองรับ identity federation ซึ่งช่วยให้ผู้ใช้ที่มีรหัสผ่านจากที่อื่น (เช่น เครือข่ายองค์กรหรือ internet identity provider) เข้าถึงบัญชี AWS ได้ชั่วคราว
- **Free to use**: ลูกค้า AWS ทุกคนสามารถใช้ IAM ได้โดยไม่มีค่าใช้จ่ายเพิ่มเติม

## IAM user
**IAM user** คือ identity ที่แทนบุคคลหรือ service ที่โต้ตอบกับ AWS โดยกำหนดผู้ใช้ในบัญชี AWS การกระทำใดๆ ของผู้ใช้นั้นจะถูกเรียกเก็บเงินเข้าบัญชีของคุณ เมื่อสร้างผู้ใช้ ผู้ใช้นั้นสามารถล็อกอินเพื่อเข้าถึงทรัพยากร AWS ในบัญชีได้

สามารถเพิ่มผู้ใช้เข้าบัญชีได้ตามต้องการ เช่น สำหรับแอปพลิเคชัน cat photo สามารถสร้างผู้ใช้แต่ละคนในบัญชี AWS ให้ตรงกับคนที่ทำงานในแอปนั้น แต่ละคนควรมี login credentials ของตัวเองเพื่อป้องกันการแชร์ credentials ระหว่างผู้ใช้

### IAM user credentials
IAM user ประกอบด้วยชื่อและชุด credentials เมื่อสร้างผู้ใช้ สามารถให้สิทธิ์การเข้าถึงประเภทต่อไปนี้:
- Access ผ่าน AWS Management Console
- Programmatic access ผ่าน AWS CLI และ AWS API

สำหรับเข้าถึงคอนโซล ให้ username และรหัสผ่านแก่ผู้ใช้ สำหรับ programmatic access AWS จะสร้างชุด access keys ที่ใช้กับ AWS CLI และ AWS API ได้ IAM user credentials ถือเป็น permanent หมายความว่าจะอยู่กับผู้ใช้จนกว่าจะมีการบังคับหมุนเวียน (rotation) โดย admin

เมื่อสร้าง IAM user สามารถให้สิทธิ์โดยตรงในระดับ user ได้ แต่หากมีผู้ใช้จำนวนมากขึ้น การจัดการสิทธิ์ในระดับ user จะซับซ้อนขึ้นเรื่อยๆ เช่น หากมีผู้ใช้ 3,000 คนในบัญชี AWS การดูแลสิทธิ์และมองภาพรวมว่าใครทำอะไรได้กับทรัพยากรใดจะเป็นเรื่องยาก จึงสามารถจัดกลุ่ม IAM users และแนบสิทธิ์ในระดับกลุ่มแทนได้

## IAM groups
**IAM group** คือกลุ่มของผู้ใช้ ผู้ใช้ทุกคนในกลุ่มจะได้รับสิทธิ์ที่กำหนดให้กับกลุ่มนั้น ทำให้สามารถให้สิทธิ์กับผู้ใช้หลายคนพร้อมกันได้ เป็นวิธีที่สะดวกและ scalable กว่าในการจัดการสิทธิ์ของผู้ใช้ในบัญชี AWS จึงเป็น best practice ให้ใช้ IAM groups

ตัวอย่าง: หากมีแอปพลิเคชันที่กำลังพัฒนาและมีผู้ใช้หลายคนทำงานในบัญชีเดียวกัน อาจจัดกลุ่มผู้ใช้ตามหน้าที่งาน เช่น กลุ่ม developers, security, และ admins แล้ววาง IAM users ทั้งหมดเข้ากลุ่มที่เหมาะสม วิธีนี้ช่วยให้เห็นว่าใครมีสิทธิ์อะไรในองค์กร และช่วยในการ scale เมื่อมีคนเข้าใหม่ ออก หรือเปลี่ยนบทบาท

ตัวอย่างการใช้งาน:
- นักพัฒนาใหม่เข้าร่วมบัญชี AWS เพื่อช่วยงานแอปพลิเคชัน สร้างผู้ใช้ใหม่และเพิ่มเข้ากลุ่ม developer โดยไม่ต้องคิดว่าต้องการสิทธิ์อะไรใหม่
- นักพัฒนาเปลี่ยนงานไปเป็น security engineer แทนที่จะแก้สิทธิ์ของผู้ใช้โดยตรง ให้ลบออกจากกลุ่มเดิมแล้วเพิ่มเข้ากลุ่มใหม่ที่มีระดับสิทธิ์ที่ถูกต้องอยู่แล้ว

ข้อควรจำเกี่ยวกับ groups:
- กลุ่มสามารถมีผู้ใช้ได้หลายคน
- ผู้ใช้สามารถอยู่ในหลายกลุ่มได้
- กลุ่มไม่สามารถอยู่ในกลุ่มอื่นได้ (nested groups)

root user สามารถทำ action ใดๆ กับทรัพยากรทั้งหมดในบัญชี AWS ได้โดยค่าเริ่มต้น ต่างจากการสร้าง IAM user, group, หรือ role ใหม่ เพื่อให้ IAM identity ทำ action เฉพาะบน AWS เช่น สร้างทรัพยากร ต้องให้สิทธิ์ที่จำเป็นแก่ IAM user นั้น วิธีให้สิทธิ์ใน IAM คือการใช้ **IAM policies**

## IAM policies
เพื่อจัดการการเข้าถึงและให้สิทธิ์แก่ AWS services และทรัพยากร จะสร้าง IAM policy แล้วแนบเข้ากับ IAM identity เมื่อ IAM identity ส่งคำขอ AWS จะตรวจสอบ policy ที่เชื่อมโยงกับ identity นั้น เช่น หากนักพัฒนาในกลุ่ม developers ส่งคำขอไปยัง AWS service AWS จะตรวจสอบ policy ที่แนบกับกลุ่ม developers และ policy ที่แนบกับผู้ใช้นั้นโดยตรง เพื่อตัดสินใจว่าจะอนุญาตหรือปฏิเสธคำขอ

### ตัวอย่าง IAM policy
Policy ส่วนใหญ่ถูกเก็บใน AWS เป็นเอกสาร JSON ที่มีหลาย element ตัวอย่าง policy ที่ให้สิทธิ์ admin ผ่าน IAM identity-based policy:

```json
{
"Version": "2012-10-17",
"Statement": [{
"Effect": "Allow",
"Action": "*",
"Resource": "*"
}]
}
```

Policy นี้มี JSON elements หลัก 4 ตัว: Version, Effect, Action, และ Resource
- **Version** กำหนดเวอร์ชันของ policy language ควรใส่ `"Version": "2012-10-17"` ก่อน element "Statement" ใน policy เสมอ
- **Effect** ระบุว่า policy จะ allow หรือ deny การเข้าถึง ในตัวอย่างนี้ Effect คือ `"Allow"` หมายถึงกำลังให้สิทธิ์เข้าถึงทรัพยากร
- **Action** อธิบายประเภทของ action ที่จะถูก allow หรือ deny ในตัวอย่างนี้ action คือ `"*"` ซึ่งเป็น wildcard ที่หมายถึงทุก action ในบัญชี AWS
- **Resource** ระบุ object หรือ objects ที่ policy statement นั้นครอบคลุม ในตัวอย่างนี้คือ wildcard `"*"` ซึ่งหมายถึงทรัพยากรทั้งหมดใน AWS console

รวมกันแล้ว policy นี้ให้สิทธิ์ทำทุก action กับทุกทรัพยากรในบัญชี AWS เรียกว่า **administrator policy**

ตัวอย่างถัดไปแสดง policy ที่ละเอียดกว่า:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyS3AccessOutsideMyBoundary",
      "Effect": "Deny",
      "Action": [
        "s3:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:ResourceAccount": [
            "222222222222"
          ]
        }
      }
    }
  ]
}
```

Policy นี้ใช้ Effect แบบ Deny เพื่อบล็อกการเข้าถึง action ของ Amazon S3 ยกเว้นทรัพยากร Amazon S3 ที่ถูกเข้าถึงอยู่ในบัญชี `222222222222` ทำให้มั่นใจได้ว่า principal ที่เข้าถึง Amazon S3 จะเข้าถึงเฉพาะทรัพยากรที่อยู่ในบัญชี AWS ที่เชื่อถือได้เท่านั้น

## IAM roles
คุณได้เรียนรู้เกี่ยวกับ IAM users, groups, และ policies แล้ว policies สามารถแนบกับ AWS identity อย่าง users และ groups เพื่อกำหนดสิทธิ์ได้ นอกจากนี้ยังสามารถแนบกับ AWS identity อีกแบบคือ **IAM roles**

**IAM role** คือ identity ที่สามารถถูก "assume" (สวมบทบาท) โดยใครหรืออะไรก็ตามที่ต้องการ AWS credentials แบบชั่วคราว

การเรียก AWS API ส่วนใหญ่ต้องถูก sign และ authenticate เมื่อส่ง HTTP request ไปยัง AWS ต้อง sign request นั้น กระบวนการ signing นี้เกิดขึ้นแบบ programmatic เพื่อให้ AWS ยืนยันตัวตนของผู้ส่งคำขอและตรวจสอบกระบวนการความปลอดภัยต่างๆ ว่าคำขอนั้นถูกต้องหรือไม่ IAM users มี credentials ที่เกี่ยวข้อง เช่น access key ID และ secret access key ที่ใช้ในการ sign request

แต่หากไม่ต้องการสร้าง IAM user พร้อม credentials ให้แอปพลิเคชันใช้ แอปพลิเคชันจะได้รับ AWS access key ID และ secret access key ที่จำเป็นมาจากไหน? คำตอบคือ **IAM roles**

IAM roles เป็น identity ใน AWS ที่เหมือน IAM user คือมี AWS credentials ที่เกี่ยวข้องสำหรับ sign request แต่ IAM users จะมี username/password และ credentials แบบ static ในขณะที่ IAM roles ไม่มี login credentials แบบ username/password และ credentials ที่ใช้ sign request จะถูกได้มาแบบ programmatic, เป็นแบบชั่วคราว (temporary), และหมุนเวียนอัตโนมัติ

ตัวอย่าง: EC2 instance จะถูกกำหนด IAM role ให้ role นี้สามารถถูก assume โดยแอปพลิเคชันที่รันบน virtual machine เพื่อเข้าถึง credentials ชั่วคราวสำหรับ sign AWS API calls role หนึ่งสามารถถูก assume โดย identity ต่างๆ ได้หลายแบบและมี use case หลากหลาย สิ่งสำคัญที่ต้องรู้เกี่ยวกับ role คือ credentials ที่ได้จาก role จะหมดอายุและ role จะถูก assume แบบ programmatic

การใช้งานทั่วไปของ IAM role อีกแบบคือการเข้าถึงระหว่าง AWS services แม้ว่าสองทรัพยากรจะอยู่ในบัญชี AWS เดียวกัน ก็ไม่ได้หมายความว่าจะเรียก API หากันได้เสมอไป หาก AWS service หนึ่งต้องการส่ง API call ไปยัง AWS service อื่น มักจะใช้ role-based access ที่ AWS service นั้น assume role เพื่อรับ credentials ชั่วคราวแล้วส่ง API call ไปยัง service อื่นที่จะตรวจสอบคำขอนั้น

identity อีกแบบที่สามารถ assume IAM role ได้คือ external identity provider ตัวอย่างเช่น บริษัทที่มีพนักงานสาย technical 5,000 คนที่ต้องเข้าถึงบัญชี AWS มีระบบ identity provider อยู่แล้วที่ให้พนักงานล็อกอินเข้าแล็ปท็อปและเข้าถึงทรัพยากรองค์กรต่างๆ ได้ แทนที่จะสร้าง IAM user ให้พนักงาน 5,000 คนแยกกัน สามารถใช้ IAM roles เพื่อให้สิทธิ์เข้าถึงกับ identity ที่มีอยู่แล้วจาก enterprise user directory ได้ เรียกว่า **federated users** AWS จะกำหนด role ให้กับ federated user เมื่อมีการร้องขอ access ผ่าน identity provider และมี AWS service ที่ช่วยให้กระบวนการนี้ง่ายขึ้น เช่น AWS IAM Identity Center

## IAM best practices
สรุป best practice ที่สำคัญของ IAM:
- **Lock down the AWS root user**: root user คือ identity ที่มีสิทธิ์เข้าถึงทุกอย่างในบัญชี AWS หากผู้ไม่หวังดีควบคุม credentials ของ root user ได้ จะสามารถเข้าถึงทรัพยากรทั้งหมดในบัญชี รวมถึงข้อมูลส่วนตัวและ billing เพื่อล็อก root user ควรทำดังนี้: ห้ามแชร์ credentials ของ root user, พิจารณาลบ access keys ของ root user, เปิดใช้ MFA บนบัญชี root
- **Follow the principle of least privilege**: least privilege คือหลักความปลอดภัยมาตรฐานที่แนะนำให้ให้สิทธิ์เฉพาะที่จำเป็นสำหรับงานหนึ่งเท่านั้น ไม่มากไปกว่านั้น เพื่อทำ least privilege สำหรับ access control เริ่มจากสิทธิ์ขั้นต่ำใน IAM policy แล้วเพิ่มสิทธิ์เพิ่มเติมตามความจำเป็นสำหรับ user, group, หรือ role
- **Use IAM appropriately**: IAM ใช้เพื่อรักษาความปลอดภัยในการเข้าถึงบัญชีและทรัพยากร AWS ช่วยสร้างและจัดการ users, groups, roles เพื่อเข้าถึงทรัพยากรในบัญชี AWS เดียว IAM ไม่ได้ใช้สำหรับ website authentication/authorization เช่น sign-in/sign-up ของเว็บไซต์ และไม่รองรับ security control สำหรับปกป้อง operating systems และ networks
- **Use IAM roles when possible**: การดูแล roles มีประสิทธิภาพมากกว่าการดูแล users เมื่อ assume role IAM จะให้ credentials ชั่วคราวแบบ dynamic ที่หมดอายุหลังช่วงเวลาที่กำหนด (ระหว่าง 15 นาทีถึง 36 ชั่วโมง) ในขณะที่ users มี credentials ระยะยาวในรูปแบบ username/password หรือ access keys — access keys ของ user จะหมดอายุก็ต่อเมื่อคุณหรือ admin หมุนเวียน key เอง ส่วน login credentials จะหมดอายุถ้ามีการตั้ง password policy ที่บังคับให้หมุนเวียนรหัสผ่าน
- **Consider using an identity provider**: หากพัฒนาแอปพลิเคชัน cat photo ให้กลายเป็นธุรกิจและเริ่มมีคนทำงานมากกว่าไม่กี่คน ควรพิจารณาจัดการข้อมูล identity ของพนักงานผ่าน identity provider (IdP) ไม่ว่าจะเป็น AWS service เช่น AWS IAM Identity Center (ผู้สืบทอด AWS Single Sign-On) หรือ third-party identity provider ก็ตาม ช่วยให้มีแหล่งข้อมูล identity เดียวสำหรับทั้งองค์กร ไม่ต้องสร้าง IAM user แยกในแต่ละ AWS อีกต่อไป สามารถใช้ IAM roles เพื่อให้สิทธิ์กับ identity ที่ federated จาก IdP ได้ ตัวอย่างเช่น พนักงาน Martha มีสิทธิ์เข้าถึงหลายบัญชี AWS แทนที่จะสร้างและจัดการ IAM user ชื่อ Martha ในแต่ละบัญชี สามารถจัดการ Martha ใน IdP ของบริษัทได้ที่เดียว หาก Martha ย้ายแผนกหรือลาออก ก็อัปเดตที่ IdP แทนที่ต้องอัปเดตทุกบัญชี AWS
- **Regularly review and remove unused users, roles, and other credentials**: อาจมี IAM users, roles, permissions, policies, หรือ credentials ที่ไม่ได้ใช้งานแล้วในบัญชี IAM มีข้อมูล last accessed ที่ช่วยระบุ credentials ที่ไม่เกี่ยวข้องเพื่อให้สามารถลบออกได้ ช่วยลดจำนวน users, roles, permissions, policies, และ credentials ที่ต้องคอยตรวจสอบ

## Key terms
- IAM (Identity and Access Management): AWS service สำหรับจัดการการเข้าถึงบัญชีและทรัพยากร AWS
- IAM user: identity ที่แทนบุคคลหรือ service ที่โต้ตอบกับ AWS มี credentials แบบ permanent
- IAM group: กลุ่มของ IAM users ที่ใช้แนบสิทธิ์ร่วมกัน
- IAM policy: เอกสาร JSON ที่กำหนดสิทธิ์ (Allow/Deny) สำหรับ action และ resource
- IAM role: identity ที่ให้ credentials ชั่วคราวแบบ programmatic ไม่มี login credentials แบบถาวร
- Least privilege: หลักการให้สิทธิ์เฉพาะเท่าที่จำเป็นเท่านั้น
- Identity federation: การเชื่อมโยง identity จากภายนอก (IdP) เข้ากับ AWS ผ่าน IAM role โดยไม่ต้องสร้าง IAM user แยก
