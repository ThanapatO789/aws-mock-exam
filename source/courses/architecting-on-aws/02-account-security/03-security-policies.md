# Security Policies

บทเรียนนี้เกี่ยวกับ security policies โดยครอบคลุมประเภทของ policy (policy types) และวิธีที่ IAM policies ถูกประเมินผล (evaluated)

## Policy Types

**security policy** คือเอกสารที่แนบกับ identity หรือ resource เพื่อกำหนดสิทธิ์ (permissions) ของสิ่งนั้น AWS จะประเมิน policies เหล่านี้เมื่อ principal (เช่น user) ทำ request

จัดการสิทธิ์การเข้าถึงใน AWS ได้โดยสร้าง policies แล้วแนบเข้ากับ IAM identities (users, groups ของ users หรือ roles) หรือแนบกับ AWS resources

### Security policy categories

Policy types แบ่งออกเป็น 2 กลุ่มหลักตามลักษณะการทำงาน:

**Set maximum permissions** (กำหนดสิทธิ์สูงสุด):
- **IAM permissions boundaries**
- **AWS Organizations service control policies (SCPs)**

**Grant permissions** (ให้สิทธิ์):
- **IAM identity-based policies**
- **IAM resource-based policies**

Policy ทั้งสองประเภทข้างต้น (identity-based และ resource-based policy) จะทำงานร่วมกัน — permission ที่ใช้ได้จริงคือส่วนที่ policy ทั้งสองฝั่งอนุญาตตรงกัน (allowed by both)

ประเภท policy ที่มีให้ใช้งานใน AWS มี 5 แบบ เลือกดูรายละเอียดแต่ละแบบได้ดังนี้:

**Identity-based policies:** ให้สิทธิ์แก่ IAM identity (users, user groups หรือ IAM roles) โดย identity policies สามารถทำเป็น **managed policy** หรือ **inline policy** ก็ได้
- Managed policies แบ่งเป็น **AWS managed policies** หรือ **customer-managed policies**
- Inline policies คือ policy ที่แนบตรงกับ user, user group หรือ role หนึ่งรายการเท่านั้น มีความสัมพันธ์แบบหนึ่งต่อหนึ่ง (strict one-to-one) ระหว่าง policy กับ identity

**Resource-based policies:** เป็น inline policies ที่ผูกกับ resources ตัวอย่างที่พบบ่อยที่สุดคือ Amazon S3 bucket policies และ IAM role trust policies โดย resource-based policies ให้สิทธิ์แก่ principal ที่ระบุใน policy เพื่อเข้าถึง AWS resource นั้น principal อาจอยู่ในบัญชีเดียวกับ resource หรืออยู่ต่างบัญชีก็ได้

**IAM permissions boundaries:** permissions boundary ของ entity หนึ่ง ทำให้ entity นั้นทำได้เฉพาะ actions ที่ได้รับอนุญาตจากทั้ง identity-based policy และ permissions boundary ของตัวเอง ใช้ managed policy เป็น permissions boundary สำหรับ IAM entity (user หรือ role) เพื่อจำกัดขอบเขตสูงสุดของสิทธิ์ที่ identity-based policy สามารถให้ได้ ตัวมันเองไม่ได้ให้สิทธิ์ (does not grant permissions)

**AWS Organizations service control policies (SCPs):** ใช้ SCP เพื่อกำหนดสิทธิ์สูงสุดสำหรับสมาชิกบัญชีในองค์กร (organization) หรือ organizational unit (OU) SCPs จำกัดสิทธิ์ที่ identity-based policies หรือ resource-based policies ให้แก่ entities (users หรือ roles) ภายในบัญชี แต่ตัวมันเองไม่ได้ให้สิทธิ์เช่นกัน

**Access control lists (ACLs):** ใช้ ACLs เพื่อควบคุมว่า principal จากบัญชีอื่นสามารถเข้าถึง resource ที่ ACL นั้นแนบอยู่ได้หรือไม่ ACLs คล้ายกับ resource-based policies แต่เป็น policy ประเภทเดียวที่**ไม่ใช้**โครงสร้างแบบ JSON policy document

### Defense in depth

Defense in depth คือกลยุทธ์ที่มุ่งเน้นการสร้าง**หลายชั้น (multiple layers)** ของความปลอดภัย ควรใช้แนวทาง defense-in-depth โดยใส่ security controls หลายชั้นในทุกระดับ เช่น ที่ edge ของ network, VPC, load balancing และทุก instance, compute service, operating system, application และ code (ตัวอย่างในบทเรียน: Users → Role → Amazon S3 VPC endpoint → S3 bucket → Documents โดยมี IAM policy และ VPC endpoint policy/Bucket policy ควบคุมในแต่ละชั้น เป็น identity-based และ resource-based ตามลำดับ)

## Policy elements

policy ส่วนใหญ่ถูกเก็บใน AWS ในรูปแบบ **JSON documents** ซึ่งประกอบด้วย elements ดังนี้:

| Element | คำอธิบาย |
|---|---|
| **Effect** | ใช้ Allow หรือ Deny เพื่อระบุว่า policy อนุญาตหรือปฏิเสธการเข้าถึง |
| **Principal** | หากสร้าง resource-based policy ต้องระบุ account, user, role หรือ federated user ที่ต้องการ allow/deny หากสร้าง IAM permissions policy เพื่อแนบกับ user หรือ role จะไม่ใส่ element นี้ เพราะ principal คือ user/role นั้นโดยนัยอยู่แล้ว |
| **Action** | ระบุรายการ actions ที่ policy อนุญาตหรือปฏิเสธ |
| **Resource** | หากสร้าง IAM permissions policy ต้องระบุรายการ resources ที่ actions นั้นใช้บังคับ หากสร้าง resource-based policy element นี้เป็นทางเลือก (optional) — ถ้าไม่ระบุ resource ที่ action นั้นใช้บังคับคือ resource ที่ policy นั้นแนบอยู่ |
| **Condition** | ระบุเงื่อนไข (circumstances) ที่ policy ให้สิทธิ์ |

### Using an identity-based policy

ตัวอย่าง JSON policy พร้อมคำอธิบายแต่ละส่วน (hotspots):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances"
      ],
      "Resource": "arn:aws:ec2:*:*:instance/*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Owner": "${aws:username}"
        }
      }
    }
  ]
}
```

คำอธิบายแต่ละ element (จาก hotspot ในบทเรียน):

1. **Version** — ใช้วันที่เวอร์ชันนี้เพื่อใช้ policy features ที่มีทั้งหมด
2. **Effect** — ระบุว่า policy อนุญาตหรือปฏิเสธ action นั้น
3. **Action** — เลือกรายการ actions ที่ policy อนุญาตหรือปฏิเสธ
4. **Resource** — เลือกรายการ resources ที่ effect นี้ใช้บังคับ
5. **Condition** — (Optional) ระบุเงื่อนไขที่ policy นี้ใช้บังคับ

### Using a resource-based policy

ตัวอย่าง resource-based policy (Amazon S3 bucket policy):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AccountBAccess",
      "Effect": "Allow",
      "Principal": {"AWS": "444455556666"},
      "Action": "s3:PutObject",
      "Resource": [
        "arn:aws:s3:::DOC-EXAMPLE-BUCKET/folder123/*"
      ]
    }
  ]
}
```

คำอธิบาย element สำคัญ (hotspot):

1. **Principal (Required)** — หากสร้าง resource-based policy ต้องระบุ principal account, user, role หรือ federated user ที่ต้องการ allow/deny access ในตัวอย่างนี้ principal คือ AWS account ID
2. **Resource (Optional)** — หากไม่ระบุ element นี้ resource ที่ action ใช้บังคับคือ resource ที่ policy นั้นแนบอยู่ ในตัวอย่างนี้ ชุด resources คือ objects ทั้งหมดในบัญชี DOC-EXAMPLE-BUCKET ที่อยู่ใน folder ชื่อ folder123 — bucket policy นี้ให้สิทธิ์เข้าถึง Amazon S3 account 444455556666 ในการ put objects ใน folder นั้น

## Explicit allow and explicit deny

ใช้ IAM policies เพื่อ allow และ deny การเข้าถึงทรัพยากร

ตัวอย่าง policy ที่ **allow** การเข้าถึง:

```
{
  "Effect": "Allow",
  "Action": ["s3:ListObject", "s3:GetObject"],
  "Resource": ["arn:aws:s3:::DOC-EXAMPLE-BUCKET/*"]
}
```

ตัวอย่าง policy ที่ **deny** การเข้าถึง:

```
{
  "Effect": "Deny",
  "Action": ["ec2:*", "s3:*"],
  "Resource": "*"
}
```

## How IAM policies are evaluated

**Explicit deny** เป็นมาตรการความปลอดภัยที่มีประโยชน์ เนื่องจากมันจะ override (มีน้ำหนักเหนือกว่า) explicit allow เสมอ

ลำดับการประเมิน (evaluation flow):

1. Is the action explicitly denied? → **Yes** → **Deny**
2. ถ้าไม่ → Is the action explicitly allowed? → **No** → **Deny (implicit deny)**
3. ถ้า Yes → **Allow**

สรุป: explicit deny จะ override explicit allow เสมอ และหากไม่มี explicit allow ใด ๆ เลย สิทธิ์นั้นก็จะถูกปฏิเสธด้วยเช่นกัน (implicit deny)

เมื่อ principal พยายามใช้ console, AWS API หรือ AWS CLI, principal จะส่ง request ไปยัง AWS เมื่อ AWS service ได้รับ request จะดำเนินการหลายขั้นตอนเพื่อพิจารณาว่าจะ grant หรือ deny request นั้น

โดย default แล้ว ทุก request จะถูกปฏิเสธ เรียกว่า **implicit deny** โค้ดบังคับใช้ของ AWS (enforcement code) จะประเมิน policies ทั้งหมดในบัญชีที่เกี่ยวข้องกับ request นั้น ซึ่งรวมถึง Organizations SCPs, resource-based policies, IAM permissions boundaries, role session policies และ identity-based policies โดยโค้ดจะมองหา deny statement ที่ใช้บังคับกับ request นั้น เรียกว่า **explicit deny** หากพบ explicit deny แม้เพียงหนึ่งรายการที่ใช้บังคับได้ โค้ดจะคืนค่าผลลัพธ์สุดท้ายเป็น deny หากไม่มี explicit deny โค้ดจะดำเนินการต่อไป

ในกราฟิกตัวอย่าง permission ที่ได้รับอนุญาต (center ของ Venn diagram) คือเฉพาะสิ่งที่ได้รับอนุญาตทั้งใน identity-based permissions policy และ Organizations SCP เท่านั้น (single API, AWS CLI หรือ console request จะถูกประเมินโดย SCP, permissions boundary และ identity-based policies)

## Key terms
- Security policy: เอกสาร (มักเป็น JSON) ที่กำหนดสิทธิ์การเข้าถึงทรัพยากร
- Identity-based policy: policy ที่แนบกับ IAM identity (user/group/role) เพื่อ "grant permissions"
- Resource-based policy: policy ที่แนบกับ resource เพื่อ "grant permissions" และต้องระบุ principal
- IAM permissions boundary: policy ที่ "set maximum permissions" ให้กับ IAM entity
- AWS Organizations SCP (service control policy): policy ที่ "set maximum permissions" ระดับองค์กรหรือ OU
- Access control list (ACL): policy ควบคุมการเข้าถึงข้ามบัญชี ไม่ใช้โครงสร้าง JSON
- Defense in depth: กลยุทธ์สร้างความปลอดภัยหลายชั้น
- Explicit allow / Explicit deny: การอนุญาต/ปฏิเสธที่ระบุชัดเจนใน policy
- Implicit deny: การปฏิเสธโดยปริยายเมื่อไม่มี explicit allow ใด ๆ
