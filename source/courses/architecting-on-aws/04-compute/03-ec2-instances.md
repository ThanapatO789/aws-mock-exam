# EC2 Instances

บทเรียนนี้เน้นเรื่อง **Amazon EC2 instances** โดยจะเรียนรู้วิธี launch และ configure EC2 instance

## Amazon EC2 คืออะไร

Amazon EC2 คือบริการที่ใช้สร้างและรัน virtual machine โดย virtual machine บน AWS Cloud เรียกว่า **EC2 instance** ซึ่งเปรียบเสมือนเซิร์ฟเวอร์แบบ on-premises แบบดั้งเดิม แต่อยู่บนคลาวด์ รองรับ workload ได้หลากหลาย เช่น web hosting, applications, databases, authentication services และงานอื่น ๆ ที่เซิร์ฟเวอร์ทั่วไปรองรับได้

บน AWS เซิร์ฟเวอร์, ฐานข้อมูล, พื้นที่จัดเก็บข้อมูล และ component ระดับสูงอื่น ๆ สามารถถูกสร้างขึ้น (instantiate) ได้ภายในไม่กี่วินาที คุณสามารถมองทรัพยากรเหล่านี้เป็นทรัพยากรชั่วคราวและใช้แล้วทิ้งได้ (temporary and disposable) โดยไม่ผูกติดกับโครงสร้าง IT แบบตายตัว elastic cloud computing เปลี่ยนวิธีที่คุณจัดการเรื่อง change management, testing, reliability และ capacity planning

## สิ่งที่ต้องพิจารณาก่อน launch EC2 instance

มีตัวเลือกหลายอย่างที่ต้องพิจารณาก่อนเริ่มใช้งาน EC2 instance (hotspots 8 จุด):

1. **Name and tags** — ควรระบุตัวตน (identify) instance อย่างไร: บน AWS สามารถกำหนด metadata ให้ resource ในรูปแบบ tag ได้ แต่ละ tag ประกอบด้วย key ที่กำหนดเองและ value ที่เป็น optional ใช้ tag เพื่อกรอง (filter) resource, ควบคุมสิทธิ์เข้าถึง, ติดตามต้นทุน, ช่วย automate งาน และช่วยจัดระเบียบ แม้ไม่มี tag type ที่บังคับ แต่สามารถสร้าง tag เพื่อจัดหมวดหมู่ resource ตาม purpose, owner, environment หรือเกณฑ์อื่น ๆ ได้
2. **Application and OS image** — จะรัน application และ operating system ใดบน instance นี้ (เชื่อมโยงกับหัวข้อ AMI ด้านล่าง)
3. **Instance type and size** — มี technical requirement อะไรบ้าง
4. **Key pair** — จะเชื่อมต่อ instance กับ component อื่นของแอปพลิเคชันอย่างไร และจะยืนยันตัวตน (authenticate) การเข้าถึง instance อย่างไร
5. **Network and security** — จะใช้ VPC, subnet และ security group ใด
6. **Configure storage** — block storage แบบใดที่เหมาะกับ use case
7. **Placement and tenancy** — ควรรัน EC2 instance ที่ไหน
8. **Scripts and metadata** — ทำอะไรได้บ้างเพื่อ automate การ launch

## Amazon Machine Image (AMI)

**Amazon Machine Image (AMI)** ให้ข้อมูลที่จำเป็นสำหรับการ launch instance (virtual server บนคลาวด์) สามารถ launch หลาย instance จาก AMI เดียวได้เมื่อต้องการ instance ที่มี configuration เดียวกัน หรือใช้ AMI ต่างกันเมื่อต้องการ instance ที่มี configuration ต่างกัน ต้องระบุ source AMI ทุกครั้งที่ launch instance

AMI ประกอบด้วย:
- template สำหรับ root volume ของ instance (เช่น OS, application server, applications)
- launch permissions ที่ควบคุมว่า AWS account ใดสามารถใช้ AMI นี้ launch instance ได้
- block device mapping ที่ระบุ volume ที่จะแนบกับ instance เมื่อ launch

### แหล่งที่มาของ AMI (flashcards)

สามารถใช้ AMI ที่ AWS จัดเตรียมไว้ หรือสร้าง custom AMI ของตัวเองได้:
- ใช้ pre-built AMI ที่ AWS จัดเตรียมไว้ (offered by AWS)
- ค้นหาจาก AWS Marketplace ซึ่งมีโซลูชันนับพันให้เลือก
- สร้าง custom AMI ของตัวเอง (manually) หรือใช้ EC2 Image Builder

การสร้าง custom AMI: launch instance แล้ว customize ให้ตรงตาม requirement จากนั้นบันทึก configuration นั้นเป็น custom AMI instance ที่ launch จาก custom AMI นี้จะได้รับการ customization ทั้งหมดไปด้วย custom AMI เหล่านี้สามารถเผยแพร่ (publish) เพื่อใช้แบบ internal, private หรือ external public ก็ได้

## ทำความเข้าใจชื่อ instance type

มี EC2 instance ให้เลือกมากกว่า 400 ประเภท สำหรับรันแอปพลิเคชันที่ย้ายมาบนคลาวด์ แต่ละ instance type มีหลายขนาด (size) พร้อม vCPU และ memory ที่ต่างกัน การเลือกขนาด instance ที่เหมาะสมมีความสำคัญต่อการใช้งานอย่างมีประสิทธิภาพ ชื่อเต็มของ instance ประกอบด้วย family name ตามด้วย generation number, additional properties (ถ้ามี) และ size

ตัวอย่างชื่อ `m6g.2xlarge` (hotspots 4 จุด):
1. **Instance family (m)** — ตัวอักษรแรกคือ instance family เช่น family "c" คือ compute optimized มี general purpose, burstable, compute-intensive และ memory-intensive instance เป็นต้น
2. **Instance generation (6)** — ตัวเลขบ่งบอก generation ซึ่งจะเพิ่มขึ้นเรื่อย ๆ เมื่อ AWS อัปเกรด hardware ใน data center
3. **Additional properties (g)** — บางครั้งมีตัวอักษรตามหลัง generation หนึ่งตัวหรือมากกว่า แทน additional properties เช่น "g" หมายถึง Graviton2 ซึ่งเป็นโปรเซสเซอร์ ARM-based ที่ AWS พัฒนาเอง เลือก properties ตามความต้องการ เช่น optimized networking throughput หรือ storage
4. **Instance size (2xlarge)** — ส่วนสุดท้ายแทนขนาดของ instance ครอบคลุม CPU, memory, storage และ network performance

## EC2 instance families

เลือก instance family ที่เหมาะสมที่สุดกับประเภท workload ที่จะ deploy ช่วยประหยัดเวลาและต้นทุน ลดความจำเป็นในการ resize ในภายหลัง instance type บางประเภทมีให้ใช้เฉพาะบาง Region เท่านั้น มี 5 หมวดหมู่หลัก:

- **General purpose** — สมดุลระหว่าง compute, memory และ networking เหมาะกับ workload หลากหลายและ web application
- **Compute optimized** — เหมาะกับ compute-bound application ใช้โปรเซสเซอร์ประสิทธิภาพสูง (high-performance processors) เช่น media transcoding, scientific modeling, machine learning
- **Memory optimized** — ส่งข้อมูลชุดใหญ่ใน memory ได้อย่างรวดเร็ว เหมาะกับ database server, web cache, data analytics
- **Accelerated computing** — ประมวลผลกราฟิกสูง (high-graphics processing), GPU bound เหมาะกับ machine learning, high performance computing (HPC), autonomous vehicles
- **Storage optimized** — อ่าน/เขียนแบบ sequential สูง เหมาะกับ dataset ขนาดใหญ่, NoSQL database, Amazon OpenSearch Service

### AWS Compute Optimizer

**AWS Compute Optimizer** ใช้ machine learning วิเคราะห์ configuration ปัจจุบันของ resource และข้อมูลการใช้งานจาก Amazon CloudWatch เพื่อให้คำแนะนำ (recommendation) ด้าน compute ตาม configuration และ usage ของคุณ

ใช้คำแนะนำเหล่านี้เพื่อปรับ configuration resource ใหม่ เพื่อลดต้นทุนและเพิ่มประสิทธิภาพ คำแนะนำสามารถเชื่อมโยง (integrate) กับบริการอื่นได้ เช่น export ไปยัง Amazon S3 แล้วเชื่อมกับ AWS Cost Explorer และ Systems Manager

## Amazon EC2 key pairs

**Key pair** ประกอบด้วย private key และ public key เป็นชุด security credential ที่ใช้พิสูจน์ตัวตนเมื่อเชื่อมต่อกับ instance Amazon EC2 จะเก็บ public key ไว้ ส่วนคุณเก็บ private key เอง ใช้ private key แทน password เพื่อเข้าถึง instance อย่างปลอดภัย ใครก็ตามที่มี private key ของคุณสามารถเชื่อมต่อ instance ได้ จึงสำคัญมากที่ต้องเก็บ private key ไว้ในที่ปลอดภัย

## Tenancy (การจัดวาง instance บน hardware)

**Compute tenancy** หมายถึงวิธีที่ EC2 instance ถูกกระจายอยู่บน physical hardware ที่รองรับ มี 3 ตัวเลือกหลัก ขึ้นอยู่กับความต้องการด้าน compliance, licensing และ cost optimization (เลือกดูผ่าน tab):

- **Shared tenancy** — ค่าเริ่มต้นของ EC2 instance คือ shared tenancy หมายความว่าหลาย AWS account อาจใช้ physical hardware เดียวกันร่วมกัน
- **Dedicated instance** — Dedicated Instance คือ EC2 instance ที่ถูก isolate ทาง physical host hardware แยกจาก instance ที่ไม่ใช่ dedicated และแยกจาก instance ของ AWS account อื่น
- **Dedicated host** — เมื่อ launch instance บน Dedicated Host, instance จะรันบน physical server ที่ EC2 instance capacity ถูก dedicate ให้คุณทั้งหมด คุณจะได้รับ isolated server ที่ควบคุม configuration ได้เอง สามารถให้ AWS เลือก server อัตโนมัติ หรือเลือก dedicated server เองก็ได้

## Placement groups และ use case

บริการ Amazon EC2 พยายามกระจาย instance ทั้งหมดของคุณไปบน underlying hardware เพื่อลด correlated failure สามารถใช้ **placement group** เพื่อกำหนดตำแหน่งของกลุ่ม instance ที่พึ่งพากันให้ตรงตาม workload:

- **Cluster placement groups** — แนะนำสำหรับแอปพลิเคชันที่ต้องการ network latency ต่ำ, network throughput สูง หรือทั้งสองอย่าง และเมื่อ traffic ส่วนใหญ่เกิดขึ้นระหว่าง instance ในกลุ่ม เหมาะกับ HPC workload ที่ต้องการ connectivity ระดับนี้ใน VPC
- **Spread placement groups** — แนะนำสำหรับแอปพลิเคชันที่มี instance สำคัญจำนวนน้อยที่ควรแยกออกจากกัน บริการที่ต้องการ uptime สูงสุด เช่น medical health record system จะ fault-tolerant มากขึ้นด้วย spread
- **Partition placement groups** — ใช้ deploy distributed และ replicated workload ขนาดใหญ่ ช่วยหลีกเลี่ยง hardware failure ที่เกิดพร้อมกันในหลาย component โดยใช้ partition

## User data

เมื่อสร้าง EC2 instance สามารถส่ง **user data** ให้ instance ได้ ซึ่งช่วย automate ขั้นตอนหลัง launch instance เช่น patch/update instance AMI, fetch และติดตั้ง software license key หรือติดตั้ง software เพิ่มเติม user data ถูก implement เป็น shell script หรือ cloud-init directive ที่รันด้วยสิทธิ์ root หรือ administrator หลังจาก instance launch แต่ก่อนที่ instance จะเข้าถึงได้ผ่าน network

user data field ถูก execute โดย cloud-init บน Linux และโดย EC2Launch service บน Windows

## Key terms
- AMI (Amazon Machine Image): template ที่ให้ข้อมูลสำหรับ launch EC2 instance
- Instance type/family: กลุ่มของ EC2 instance ที่ออกแบบมาสำหรับ workload ประเภทต่าง ๆ (เช่น general purpose, compute optimized)
- AWS Compute Optimizer: บริการใช้ ML แนะนำการปรับ configuration resource เพื่อลดต้นทุน/เพิ่มประสิทธิภาพ
- Key pair: ชุด private/public key สำหรับยืนยันตัวตนเชื่อมต่อ EC2 instance
- Tenancy: วิธีการจัดวาง instance บน physical hardware (shared / dedicated instance / dedicated host)
- Placement group: การจัดกลุ่ม instance เพื่อควบคุมตำแหน่งบน underlying hardware (cluster/spread/partition)
- User data: script/cloud-init directive ที่รันอัตโนมัติหลัง instance launch เพื่อ automate การตั้งค่า
