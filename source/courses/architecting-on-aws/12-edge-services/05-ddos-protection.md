# DDoS Protection

บทเรียนนี้สอนเทคนิคต่าง ๆ ในการป้องกัน application infrastructure จากการโจมตีแบบ distributed denial of service (DDoS)

## DDoS attacks

การโจมตีแบบ DDoS คือการโจมตีที่ระบบที่ถูกยึดครอง (compromised) จำนวนมากพยายามถล่ม (flood) เป้าหมาย เช่น เครือข่ายหรือ web application ด้วย traffic จำนวนมาก การโจมตี DDoS สามารถทำให้ผู้ใช้งานที่ถูกต้อง (legitimate user) ไม่สามารถเข้าถึงบริการได้ และอาจทำให้ระบบล่มเนื่องจากปริมาณ traffic ที่ล้นเกิน

แนวคิดทั่วไปของการโจมตี DDoS คือการใช้ host เพิ่มเติมเพื่อขยาย (amplify) request ที่ส่งไปยังเป้าหมาย ทำให้เป้าหมายทำงานเต็ม capacity และไม่พร้อมใช้งาน

## OSI layer attacks

โดยทั่วไป การโจมตี DDoS สามารถแบ่งตาม layer ของ Open Systems Interconnection (OSI) model ที่ถูกโจมตี พบบ่อยที่สุดที่ Network (Layer 3), Transport (Layer 4), Presentation (Layer 6) และ Application (Layer 7)

**Infrastructure layer attacks** — การโจมตีที่ Layer 3 และ 4 มักถูกจัดเป็น infrastructure layer attack เป็นประเภทการโจมตี DDoS ที่พบบ่อยที่สุด รวมถึงรูปแบบอย่าง synchronized (SYN) flood และการโจมตีแบบ reflection อื่น ๆ เช่น User Datagram Protocol (UDP) packet flood การโจมตีเหล่านี้มักมีปริมาณมากและมีเป้าหมายเพื่อทำให้ capacity ของเครือข่ายหรือ application server เกินขีดจำกัด แต่โชคดีที่เป็นประเภทการโจมตีที่มี signature ชัดเจนและตรวจจับได้ง่ายกว่า

**Application layer attacks** — ผู้โจมตีอาจเล็งเป้าไปที่ตัวแอปพลิเคชันเองด้วยการโจมตีแบบ Layer 7 หรือ Application layer ในการโจมตีลักษณะนี้ คล้ายกับการโจมตี SYN flood ที่ระดับ infrastructure ผู้โจมตีพยายามทำให้ function เฉพาะของแอปพลิเคชันทำงานหนักเกินไป จนทำให้แอปพลิเคชันไม่พร้อมใช้งานหรือตอบสนองช้ามากสำหรับผู้ใช้งานที่ถูกต้อง

## AWS Shield

**AWS Shield** เป็น managed DDoS protection service ที่ปกป้องแอปพลิเคชันที่ทำงานบน AWS มีการตรวจจับแบบ dynamic และมาตรการบรรเทา (mitigation) แบบอัตโนมัติในตัว (inline) เพื่อลด downtime และ latency ของแอปพลิเคชัน

AWS Shield ให้การป้องกันการโจมตีระดับ infrastructure (Layer 3 และ 4) ที่พบบ่อยที่สุด เช่น SYN/UDP flood และ reflection attack ช่วยเพิ่มความพร้อมใช้งานของแอปพลิเคชันบน AWS บริการนี้ใช้การผสมผสานระหว่าง traffic signature, anomaly algorithm และเทคนิคการวิเคราะห์อื่น ๆ AWS Shield ตรวจจับ traffic ที่เป็นอันตรายและบรรเทาปัญหาแบบ real-time

## AWS WAF

**AWS WAF** เป็น web application firewall ที่ช่วยปกป้อง web application หรือ API จากการโจมตีเว็บทั่วไป (common web exploits) และ bot ด้วย AWS WAF ผู้ใช้สามารถควบคุมได้ว่า traffic จะเข้าถึงแอปพลิเคชันได้อย่างไร สร้างกฎความปลอดภัย (security rule) เพื่อควบคุม bot traffic และบล็อกรูปแบบการโจมตีทั่วไป เช่น SQL injection (SQLi) หรือ cross-site scripting (XSS) นอกจากนี้ยังสามารถตรวจสอบ (monitor) HTTP(S) request ที่ถูกส่งต่อไปยังบริการ AWS ที่รองรับได้ด้วย

ก่อนกำหนดค่า AWS WAF ควรเข้าใจส่วนประกอบที่ใช้ควบคุมการเข้าถึงทรัพยากร AWS:

- **Web ACLs** — ใช้ web ACL เพื่อปกป้องชุดทรัพยากร AWS โดยสร้าง web ACL และกำหนดกลยุทธ์การป้องกันด้วยการเพิ่ม rule
- **Rules** — กำหนดเกณฑ์ในการตรวจสอบ web request และระบุวิธีจัดการ request ที่ตรงกับเกณฑ์นั้น
- **Rule groups** — สามารถใช้ rule แบบเดี่ยว หรือรวมเป็น reusable rule group ได้ AWS Managed Rules for AWS WAF และผู้ขายบน AWS Marketplace มี managed rule group ให้ใช้งาน หรือจะกำหนด rule group เองก็ได้
- **Rule statements** — ส่วนของ rule ที่บอก AWS WAF ว่าต้องตรวจสอบ web request อย่างไร เมื่อ AWS WAF พบเกณฑ์การตรวจสอบใน web request หมายความว่า web request นั้นตรงกับ statement
- **IP set** — คือชุดของ IP address และช่วง IP address ที่ต้องการใช้ร่วมกันใน rule statement เป็นทรัพยากร AWS ชนิดหนึ่ง
- **Regex pattern set** — คือชุดของ regular expression ที่ต้องการใช้ร่วมกันใน rule statement เป็นทรัพยากร AWS ชนิดหนึ่ง
- **Monitoring and logging** — สามารถ monitor web request, web ACL และ rule ผ่าน CloudWatch ได้ และยังเปิดใช้ logging เพื่อดูรายละเอียด traffic ที่ web ACL วิเคราะห์ โดยเลือกปลายทางส่ง log ได้ทั้ง CloudWatch Logs, Amazon S3 หรือ Amazon Kinesis Data Firehose

### Control traffic with ACL rule statements

Rule statement คือส่วนของ rule ที่บอก AWS WAF ว่าต้องตรวจสอบ web request อย่างไร ทุก rule statement มีคุณสมบัติดังนี้:
- ระบุว่าต้องมองหาอะไร และมองหาอย่างไร ตามชนิดของ statement
- มี top-level rule statement เดียวที่สามารถบรรจุ statement อื่น ๆ ไว้ภายในได้

## AWS Firewall Manager

**AWS Firewall Manager** ช่วยลดความซับซ้อนของงานบริหารจัดการและดูแลรักษา AWS WAF และ Amazon VPC security group ตั้งค่า AWS WAF firewall rule, AWS Shield protection และ Amazon VPC security group ได้ในคราวเดียว บริการนี้จะนำ rule และการป้องกันไปใช้กับทุก account และทรัพยากรโดยอัตโนมัติ แม้ในขณะที่เพิ่มทรัพยากรใหม่เข้ามา Firewall Manager ช่วยให้ทำสิ่งต่อไปนี้ได้:

- ลดความซับซ้อนของการจัดการ rule ข้ามแอปพลิเคชันและ account
- ค้นพบ account ใหม่โดยอัตโนมัติและแก้ไขเหตุการณ์ที่ไม่เป็นไปตามข้อกำหนด (noncompliant)
- นำ AWS WAF rule จาก AWS Marketplace มาใช้งาน
- เปิดใช้การตอบสนองอย่างรวดเร็ว (rapid response) ต่อการโจมตีในทุก account

เมื่อมีการสร้างแอปพลิเคชันใหม่ Firewall Manager ยังช่วยให้แอปพลิเคชันและทรัพยากรใหม่เหล่านั้นเป็นไปตามชุดกฎความปลอดภัยเดียวกันได้ตั้งแต่วันแรก ทำให้มีบริการเดียวสำหรับสร้าง firewall rule สร้าง security policy และบังคับใช้อย่างสอดคล้องกันในทุก AWS infrastructure

## Key terms
- DDoS attack: การโจมตีที่ใช้หลายระบบถล่ม traffic เข้าเป้าหมายจนไม่พร้อมใช้งาน
- AWS Shield: managed service สำหรับป้องกันการโจมตี DDoS ระดับ infrastructure (Layer 3/4)
- AWS WAF: web application firewall สำหรับป้องกันการโจมตีเว็บ เช่น SQLi, XSS
- Web ACL: ชุดกฎ (rule) ที่ใช้ปกป้องทรัพยากร AWS ผ่าน AWS WAF
- AWS Firewall Manager: บริการบริหารจัดการ WAF/Shield/security group แบบรวมศูนย์ข้าม account
