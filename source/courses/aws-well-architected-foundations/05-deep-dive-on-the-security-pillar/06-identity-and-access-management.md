# Identity and Access Management

## Identity and Access Management (1.14)
เพื่อใช้งาน AWS services ต้อง grant การเข้าถึง resources ใน AWS accounts ให้กับ users และ applications เมื่อ workload มากขึ้น จำเป็นต้องมี identity management และ permissions ที่แข็งแรง เพื่อให้แน่ใจว่าคนที่ถูกต้องเข้าถึง resource ที่ถูกต้องภายใต้เงื่อนไขที่ถูกต้อง แบ่งเป็น 2 พื้นที่หลัก: **identity management** และ **permissions management**

## Identity management (1.15)
มี identity 2 ประเภทที่ต้องจัดการ:

- **Human identities** — administrators, developers, operators และ consumers ที่ต้องการ identity เพื่อเข้าถึง AWS environments/applications ผ่าน web browser, client application, mobile app หรือ command-line tools
- **Machine identities** — workload applications, operational tools และ components ที่ต้องการ identity เพื่อเรียก AWS services เช่น EC2 instances หรือ AWS Lambda functions รวมถึง identity สำหรับ external parties และ machines ภายนอก AWS

Best practices สำหรับ identity management:

- **ใช้ strong sign-in mechanisms** — เช่น multi-factor authentication (MFA) และ strong password policies เพื่อลดความเสี่ยงจาก credentials ที่รั่วไหลหรือเดาง่าย
- **ใช้ temporary credentials แทน long-term credentials** — ลดความเสี่ยงจาก credentials ที่รั่วไหล/ถูกแชร์/ถูกขโมย
- **จัดเก็บและใช้ secrets อย่างปลอดภัย** — ใช้ purpose-built service สำหรับ store, manage, rotate secret access credentials (API keys, passwords, OAuth tokens)
- **ใช้ identity provider แบบรวมศูนย์** — สำหรับ workforce identities จะช่วยให้จัดการ access ข้าม applications/services ได้ง่ายจากที่เดียว
- **audit และ rotate credentials เป็นระยะ** — เพื่อจำกัดระยะเวลาที่ credentials ใช้เข้าถึง resources ได้
- **จัดกลุ่ม users** — วาง users ที่มี security requirements เหมือนกันไว้ใน groups ที่กำหนดโดย identity provider ใช้ attributes (เช่น department, location) เพื่อ control access แทนที่จะ manage รายบุคคล ช่วยให้จัดการ access แบบรวมศูนย์ได้ง่ายขึ้น

## Permissions management (1.16)
**Permissions** ควบคุมว่าใครเข้าถึงอะไรได้ภายใต้เงื่อนไขใด — set permissions ให้กับ human/machine identity เฉพาะเจาะจงเพื่อ grant การเข้าถึง service actions บน resources ที่ระบุ พร้อม conditions ที่ต้องเป็นจริง (เช่น อนุญาตให้สร้าง Lambda function เฉพาะใน Region ที่กำหนด)

Best practices เมื่อบริหาร AWS environments ในระดับ scale:

- **นิยามผู้เข้าถึงแต่ละ component ให้ชัดเจน** และเลือก identity type/authentication method ที่เหมาะสม ให้สิทธิ์เท่าที่จำเป็น (least privilege)
- **ใช้ group และ identity attributes เพื่อกำหนด permissions แบบ dynamic** แทนการกำหนดรายบุคคล เช่น ให้กลุ่ม developer เข้าถึงเฉพาะ resource ของ project ตน — เมื่อออกจาก project สิทธิ์จะถูกยกเลิกอัตโนมัติ
- **เตรียม emergency access** สำหรับกรณี automated process/pipeline มีปัญหา โดยยังคงยึด least privilege เป็นหลัก
- **ทบทวนและลบ permissions ที่ไม่ได้ใช้งาน** อย่างต่อเนื่อง (achieve least privilege permissions) พร้อม monitor unused identities/permissions และกำหนด permission guardrails ระดับองค์กร
- **บริหาร access ตาม lifecycle** — integrate access controls กับ lifecycle ของ operator/application และ federation provider ส่วนกลาง
- **วิเคราะห์ public/cross-account access อย่างต่อเนื่อง** เพื่อลดการเข้าถึงที่ไม่จำเป็น
- **แชร์ resources อย่างปลอดภัย** ระหว่าง accounts/environments (dev/test/production) เพื่อลด operational overhead และความเสี่ยงจากการสร้าง resource ซ้ำ
- สำหรับ **third party**: ใช้หลัก just-in-time access และ least privilege พร้อม temporary credentials

## Key terms
- Human identity / Machine identity: identity ของมนุษย์ (ผู้ใช้) และของระบบ/แอปพลิเคชัน
- MFA (Multi-Factor Authentication): การยืนยันตัวตนหลายปัจจัย
- Least privilege: ให้สิทธิ์เท่าที่จำเป็นเท่านั้น
- Just-in-time access: การให้สิทธิ์เข้าถึงเฉพาะช่วงเวลาที่จำเป็นต้องใช้งาน
