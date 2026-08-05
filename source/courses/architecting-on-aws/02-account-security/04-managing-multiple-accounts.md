# Managing Multiple Accounts

บทเรียนนี้ตอบคำถามว่า "อะไรคือวิธีที่ดีที่สุดในการจัดการหลายบัญชี (multiple accounts)" ครอบคลุมเหตุผลที่ควรใช้หลายบัญชี และการใช้ **AWS Organizations**

ควรพัฒนา **multi-account strategy** ตั้งแต่ช่วงต้นของกระบวนการ deploy ระบบบนคลาวด์ และปรับปรุง (refine) กลยุทธ์นี้ไปเรื่อย ๆ ตามที่ธุรกิจพัฒนาไป

## Reasons to use multiple accounts

เหตุผลหลัก 5 ประการที่ควรใช้หลายบัญชี AWS:

1. **Many teams** — เมื่อมีทีมงานจำนวนมาก multi-account strategy ช่วยให้จัดกลุ่มทรัพยากร (group resources) เพื่อการจัดหมวดหมู่และค้นหา (categorization and discovery) ได้ง่ายขึ้น
2. **Security and compliance controls** — สามารถปรับปรุง security posture ได้ด้วย logical boundary ที่เกิดจาก multi-account strategy
3. **Billing** — จะช่วยให้เห็น insight ด้านต้นทุน (cost insights) ได้ดีขึ้น
4. **Isolation** — สามารถจำกัดผลกระทบที่อาจเกิดขึ้น (limit potential impact) ในกรณีมีการเข้าถึงโดยไม่ได้รับอนุญาต (unauthorized access)
5. **Business process** — จะช่วยให้การบริหารจัดการสิทธิ์เข้าถึง environment ต่าง ๆ ง่ายขึ้น (simplified management of user access to different environments)

## AWS Organizations

**AWS Organizations** คือ account management service ที่ช่วยให้รวม (consolidate) หลายบัญชี AWS เข้าเป็น organization เดียวที่สร้างและบริหารจัดการจากศูนย์กลาง สามารถจัดกลุ่มบัญชีเป็น **organizational units (OUs)** และแนบ access policies ต่าง ๆ ให้แต่ละ OU ได้

### Key features

- Centralized management ของบัญชี AWS ทั้งหมด
- Consolidated billing สำหรับ member accounts
- Hierarchical grouping ของบัญชีต่าง ๆ เพื่อตอบโจทย์ budgetary, security หรือ compliance needs
- Policies เพื่อควบคุมส่วนกลาง (centralize control) เหนือ AWS services และ API operations ที่แต่ละบัญชีสามารถเข้าถึงได้
- Integration และรองรับ (support) IAM
- Integration กับ AWS services อื่น ๆ

### Without vs. With AWS Organizations

**Without AWS Organizations:** การจัดการหลายบัญชีจะท้าทายกว่ามากหากไม่ใช้ Organizations ตัวอย่างเช่น เนื่องจาก IAM policies ใช้ได้เฉพาะกับบัญชี AWS หนึ่งบัญชีเท่านั้น IAM policies จึงต้องถูกทำซ้ำ (duplicated) และบริหารจัดการแยกในแต่ละบัญชี เพื่อ deploy สิทธิ์แบบมาตรฐานให้ครบทุกบัญชี

**With AWS Organizations:** AWS Organizations รวมความสามารถด้าน account management และ consolidated billing ที่ช่วยตอบโจทย์ budgetary, security และ compliance needs ของธุรกิจได้ดีขึ้น ในฐานะ administrator ขององค์กร สามารถสร้างบัญชีใหม่ใน organization และเชิญบัญชีที่มีอยู่แล้วให้เข้าร่วม organization ได้ รวมถึงสามารถใช้ **service control policies (SCPs)** เพื่อกำหนดสิทธิ์สูงสุดสำหรับ member accounts ใน organization

โครงสร้างตัวอย่าง: Management account อยู่บนสุด แตกเป็นหลาย OU ซึ่งแต่ละ OU มี AWS accounts อยู่ภายใน และสามารถแนบ SCP เข้ากับ OU หรือ account ใดก็ได้

## How IAM policies interact with SCPs

**SCP** คือ organization policy ประเภทหนึ่งที่ใช้บริหารจัดการสิทธิ์ในองค์กร

แนบ identity-based หรือ resource-based policies เข้ากับ IAM users หรือกับ resources ใน accounts ขององค์กร ส่วน SCP จะแนบเข้ากับ Organizations entity (root, OU หรือ account) เพื่อกำหนด guardrail — SCP จะจำกัด (sets limits) การกระทำที่ IAM users และ roles ในบัญชีที่ได้รับผลกระทบสามารถทำได้

**หลักการสำคัญ:** ใน Venn diagram ของ permissions ที่ได้รับอนุญาต (center) จะเป็นเฉพาะ permissions ที่ได้รับอนุญาตทั้งใน IAM identity-based permissions policy และใน Organizations SCP เท่านั้น (ทั้งคู่ต้อง allow ตรงกัน)

ตัวอย่าง (hotspot ในบทเรียน):

1. **Organizations SCP** กำหนดขอบเขตขององค์กร (defines the organizational boundaries) — ในตัวอย่างนี้ SCP อนุญาตให้ทำ operations ทั้งหมดบน EC2 instances และ S3 buckets (`Allow ec2:*`, `Allow s3:*`)
2. **IAM identity-based permissions** อนุญาตให้ principals ที่เกี่ยวข้องกับ policy นั้นทำ operations ที่กำหนดไว้ — ในตัวอย่างนี้ principals ที่เกี่ยวข้องกับ identity-based policy นี้สามารถทำ operations ทั้งหมดบน EC2 instances และทำ IAM operations ทั้งหมด เช่น สร้าง users, กำหนด roles เป็นต้น (`Allow ec2:*`, `Allow iam:*`)
3. **Allowed (effective allowed operation)** — สิทธิ์ที่ใช้ได้จริงของ principal ตามทั้ง SCP และ identity-based policy คือสามารถทำ operations ทั้งหมดได้เฉพาะบน **EC2 instances** เท่านั้น (จุดตัดของทั้งสอง policy)

## Key terms
- Multi-account strategy: กลยุทธ์การใช้หลายบัญชี AWS เพื่อแยกทีม, ความปลอดภัย, billing, isolation และ business process
- AWS Organizations: บริการรวมและบริหารจัดการหลายบัญชี AWS จากศูนย์กลาง
- Organizational unit (OU): กลุ่มบัญชี AWS ภายใต้ organization ที่สามารถแนบ policy ร่วมกันได้
- Consolidated billing: การรวม billing ของหลายบัญชีเข้าด้วยกัน
- Service control policy (SCP): policy ระดับ organization ที่กำหนดสิทธิ์สูงสุดของ member accounts
