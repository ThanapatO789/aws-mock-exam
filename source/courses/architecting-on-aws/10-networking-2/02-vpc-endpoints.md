# VPC Endpoints

บทเรียนนี้ต่อยอดจากแนวคิด VPC พื้นฐานที่เรียนไปแล้วใน Module 3 โดยเจาะลึกวิธีเชื่อมต่อ VPC กับเครือข่ายทั้งแบบ public และ private มีวิดีโอผู้สอนความยาว 5 นาที 9 วินาที

## VPC Endpoint คืออะไร

**VPC endpoint** สร้างเส้นทาง (path) ที่เชื่อถือได้ระหว่าง VPC กับ AWS service ที่รองรับ โดยไม่ต้องใช้ internet gateway, NAT device, VPN connection หรือ AWS Direct Connect connection instance ใน VPC ไม่จำเป็นต้องมี public IP address เพื่อสื่อสารกับ resource ของ service นั้น

- Endpoint เป็น virtual device ที่ scale แบบ horizontal, redundant และ highly available
- อนุญาตให้สื่อสารระหว่าง instance ใน VPC กับ service โดยไม่มีข้อจำกัดด้าน availability หรือ bandwidth
- หากไม่มี VPC endpoint, VPC จำเป็นต้องมี internet gateway และ NAT gateway หรือ public IP address เพื่อเข้าถึง serverless service ที่อยู่นอก VPC

VPC endpoint มี 2 ประเภทหลัก

### Gateway endpoint

**Gateway VPC endpoint (gateway endpoint)** คือ gateway ที่กำหนดเป็น target ของ route ใน route table สำหรับ traffic ที่ปลายทางเป็น AWS service ที่รองรับ เช่น **Amazon S3** และ **Amazon DynamoDB**

ตัวอย่างในไดอะแกรม: Instance A ใน public subnet สื่อสารกับ Amazon S3 ผ่าน internet gateway (มี route ไปยัง local destination ใน VPC) ส่วน Instance B สื่อสารกับ Amazon S3 bucket และ Amazon DynamoDB table ผ่าน gateway endpoint เฉพาะของแต่ละ service — private route table จะกำหนดเส้นทางคำขอไปยัง Amazon S3/DynamoDB ผ่าน gateway endpoint โดยใช้ prefix list เพื่อระบุ Region เป้าหมายของแต่ละ service

### Interface VPC endpoint

**Interface VPC endpoint (interface endpoint)** คือ elastic network interface ที่มี private IP address จากช่วง IP ของ subnet ทำหน้าที่เป็นจุดเข้า (entry point) สำหรับ traffic ที่ปลายทางเป็น service ที่รองรับ ขับเคลื่อนด้วย **AWS PrivateLink** ซึ่งช่วยไม่ให้ traffic ถูกเปิดเผยสู่อินเทอร์เน็ตสาธารณะ

- เมื่อสร้าง interface endpoint แล้ว traffic จะถูกส่งไปยัง endpoint ใหม่โดยไม่ต้องแก้ไข route table ใด ๆ ใน VPC
- ตัวอย่าง: Region หนึ่งมี Systems Manager อยู่นอก VPC ตัวอย่าง VPC มี public และ private subnet พร้อม Amazon EC2 instance อยู่ในแต่ละ subnet traffic ของ Systems Manager ที่ส่งไปยัง `ssm.region.amazonaws.com` จะถูกส่งไปยัง elastic network interface ในและ private subnet

การใช้ VPC endpoint ช่วยให้เข้าถึง external entity ได้อย่างปลอดภัย บทเรียนถัดไปจะกล่าวถึงการเชื่อมต่อหลาย VPC เข้าด้วยกันผ่าน VPC peering

## Key terms
- VPC endpoint: ช่องทางเชื่อมต่อ VPC กับ AWS service โดยตรง ไม่ผ่านอินเทอร์เน็ตสาธารณะ
- Gateway endpoint: VPC endpoint แบบ route table target สำหรับ Amazon S3 และ Amazon DynamoDB
- Interface endpoint: VPC endpoint แบบ elastic network interface ขับเคลื่อนด้วย AWS PrivateLink
- AWS PrivateLink: เทคโนโลยีเบื้องหลัง interface endpoint ที่หลีกเลี่ยงการเปิดเผย traffic สู่อินเทอร์เน็ต
