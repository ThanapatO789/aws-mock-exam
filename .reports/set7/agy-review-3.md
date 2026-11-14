## Errors

- Q455: เหตุผลของตัวเลือกผิด B อธิบายไม่ตรงกับตัวเลือก: `"ใช้ S3 File Gateway แล้วย้ายข้อมูลเข้า gateway - S3 File Gateway ให้ SMB/NFS share แต่เก็บเป็น object ใน S3 ไม่ใช่ Windows file server เต็มรูปแบบ และ cloud workload ต้องปรับไปใช้ S3"` (ในตัวเลือก B ระบุให้ทั้ง on-premises และ cloud workload ชี้ไปใช้ S3 File Gateway ที่อยู่ on-premises ส่วนการให้ใช้ S3 โดยตรงอยู่ในตัวเลือก C) → `"ใช้ S3 File Gateway แล้วย้ายข้อมูลเข้า gateway - S3 File Gateway เก็บข้อมูลเป็น object ใน S3 ไม่ใช่ Windows file server เต็มรูปแบบ และตัวเลือกนี้ให้ cloud workload วิ่งข้าม VPN กลับมาใช้ gateway ที่ on-premises ทำให้ latency สูง"`

## Weak spots

- Q441: `TAG` ใช้ `"sub": "ops-iac"` ทั้งที่โจทย์ทดสอบการสั่งรันคำสั่งและ patch ด้วย AWS Systems Manager Run Command / Patch Manager ไม่ใช่ Infrastructure as Code → เปลี่ยน `sub` ให้ตรงกับหมวด Systems Manager / operations ของระบบแท็ก
- Q442: `TAG` ใช้ `"sub": "srv-sns"` ทั้งที่ SNS เป็นตัวหลอก และคำตอบที่ถูกคือ Amazon SES + Amazon EventBridge + AWS Lambda → เปลี่ยน `sub` ให้ตรงกับบริการหลักที่ทดสอบ (เช่น EventBridge หรือ Lambda)
- Q448: `TAG` ใช้ `"cat": "compute", "sub": "cmp-lambda"` ทั้งที่โจทย์ถามเรื่องการตรวจจับรูปภาพไม่เหมาะสมด้วย Amazon Rekognition และไม่มี AWS Lambda ในโจทย์หรือตัวเลือกเลย → เปลี่ยน `cat`/`sub` ให้ตรงกับหมวด AI/ML (หรือหมวดที่เหมาะสมในระบบแท็ก)
- Q453: เหตุผลของตัวเลือกผิด B ระบุว่า `"ให้ ACM ออก cert แล้ว import key material - ขัดกันเอง cert ที่ ACM ออกให้ไม่ได้มาจาก CA ภายนอก และ export private key ของ public cert ไม่ได้"` ซึ่งปัจจุบัน ACM รองรับการออก exportable public certificate ที่ export private key ได้แล้ว และตัวเลือก B พูดถึงการ import key material จาก cert ที่ ACM ออกให้ → `"ให้ ACM ออก cert แล้ว import key material - ขัดกันเองเพราะ cert ที่ ACM ออกให้ไม่ได้มาจาก CA ภายนอก และเมื่อให้ ACM ออก cert ให้ ACM จะสร้างและจัดการ key เอง ไม่ใช่การนำ key material มา import ซ้ำ"`

## Verdict

16 of 21 questions (Q436–Q456) are fine as-is; 1 has an inaccurate wrong-option explanation and 4 have minor tag or wording issues.
