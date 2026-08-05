# VPC Traffic Security

การป้องกันด้วยชั้นความปลอดภัยที่เป็นอิสระต่อกันหลายชั้น (multiple independent layers of security) ทำหน้าที่เป็นตัวยับยั้ง (deterrent) ลดโมเมนตัมและประสิทธิภาพของการโจมตี แนวทางนี้บังคับให้ผู้โจมตีต้องฝ่าชั้นการป้องกันเฉพาะทางหลายชั้น ทำให้การโจมตียากและมีต้นทุนสูงขึ้น บทเรียนนี้ครอบคลุมข้อจำกัดด้านความปลอดภัยหลักสองอย่าง คือ **network ACLs** และ **security groups**

## Network access control lists (ACLs)

**Network ACL** เป็นชั้นความปลอดภัยเสริม (optional) สำหรับ VPC ทำหน้าที่เป็นไฟร์วอลล์ควบคุม traffic เข้าออกของ subnet หนึ่งตัวหรือมากกว่า ทุก VPC จะมาพร้อมกับ default network ACL ที่อนุญาต inbound และ outbound IPv4 traffic ทั้งหมดโดยอัตโนมัติ

Network ACL เป็นแบบ **stateless** หมายความว่า การตอบกลับ (response) ของ inbound traffic ที่ได้รับอนุญาต จะต้องผ่านกฎของ outbound traffic ด้วย (และในทางกลับกัน)

Network ACL ประกอบด้วยรายการกฎที่มีหมายเลขกำกับ (numbered list of rules) ระบบจะประเมินกฎตามลำดับ เริ่มจากหมายเลขต่ำสุด เพื่อตัดสินว่า traffic จะได้รับอนุญาตให้เข้าหรือออกจาก subnet ที่ผูกกับ network ACL นั้นหรือไม่ ทุก VPC จะมี default network ACL ที่แก้ไขได้มาให้อัตโนมัติ

### Network ACL rules

ทุก network ACL จะมีกฎที่หมายเลขกฎเป็นเครื่องหมาย asterisk (*) กฎนี้ทำให้แน่ใจว่าหาก packet ไม่ตรงกับกฎที่มีหมายเลขอื่นใดเลย จะถูกปฏิเสธ (denied) โดยอัตโนมัติ — กฎนี้แก้ไขหรือลบไม่ได้ องค์ประกอบของกฎ network ACL ได้แก่:

- **Rule number** — กฎจะถูกประเมินโดยเริ่มจากหมายเลขต่ำสุด เมื่อกฎใดตรงกับ traffic แล้ว จะถูกนำไปใช้ทันที โดยไม่สนใจกฎที่มีหมายเลขสูงกว่าที่อาจขัดแย้งกัน
- **Type** — ประเภทของ traffic เช่น Secure Shell (SSH) หรือระบุ traffic ทั้งหมด หรือช่วง custom ก็ได้
- **Protocol** — ระบุ protocol ใดก็ได้ที่มีหมายเลข protocol มาตรฐาน
- **Port range** — พอร์ตหรือช่วงพอร์ตที่รับฟัง traffic เช่น พอร์ต 80 สำหรับ HTTP traffic
- **Source** — สำหรับ inbound rule เท่านั้น คือแหล่งที่มาของ traffic (CIDR range)
- **Destination** — สำหรับ outbound rule เท่านั้น คือปลายทางของ traffic (CIDR range)
- **Allow or Deny** — อนุญาตหรือปฏิเสธ traffic ที่ระบุไว้

Network ACLs เป็นแบบ stateless หมายความว่า response ต่อ inbound traffic ที่อนุญาต จะต้องอยู่ภายใต้กฎของ outbound traffic ด้วย (และในทางกลับกัน)

## Security groups

**Security group** ทำหน้าที่เป็นไฟร์วอลล์เสมือน (virtual firewall) สำหรับ instance เพื่อควบคุม inbound และ outbound traffic ทำงานที่ระดับ network interface ไม่ใช่ระดับ subnet และรองรับเฉพาะกฎแบบ Allow เท่านั้น

### Security groups (การทำงานพื้นฐาน)

Security group อนุญาต traffic โดยพิจารณาจาก IP protocol, port หรือ IP address และใช้กฎแบบ stateful traffic สามารถถูกจำกัดโดย IP protocol ใดก็ได้, service port และ source หรือ destination IP address (IP address เดี่ยว หรือ CIDR block)

### Default and new security groups

โดย default, security group จะมี outbound rule ที่อนุญาต outbound traffic ทั้งหมด คุณสามารถลบกฎนี้และเพิ่ม outbound rule ที่อนุญาตเฉพาะ outbound traffic บางประเภทเท่านั้นได้ หาก security group ของคุณไม่มี outbound rule เลย จะไม่มี outbound traffic ใด ๆ จาก instance ได้รับอนุญาต traffic สามารถถูกจำกัดโดย protocol, service port และ source IP address (IP address เดี่ยวหรือ CIDR block) หรือ security group

### Custom security group rules

ด้วยกฎของ security group คุณสามารถกรอง traffic ตาม protocol และหมายเลขพอร์ตได้ Security group เป็นแบบ **stateful** — หากส่ง request จาก instance ของคุณ traffic ตอบกลับของ request นั้นจะได้รับอนุญาตให้ไหลเข้าโดยไม่ขึ้นกับ inbound security group rule

ตัวอย่างตาราง inbound/outbound security group rule ของ web server: inbound rule อนุญาต traffic บนพอร์ต 80 และ 443 ผู้ใช้ที่ร้องขอ web server จะได้รับอนุญาตเข้ามา และ web server จะส่ง response กลับไปตาม request นั้น ในมุม outbound หากพยายามส่ง traffic ที่ไม่ใช่การตอบสนองต่อ request บนพอร์ต 80/443 จะถูกจำกัดให้ใช้ได้เฉพาะพอร์ต 1433 และ 3306 เท่านั้น

### Security group chaining

ตัวอย่างการเชื่อมโยง (chain) security group หลายตัวต่อกัน: กฎ inbound และ outbound ถูกตั้งค่าให้ traffic ไหลได้เฉพาะจาก tier บนสุดลงไปยัง tier ล่างสุด แล้วไหลกลับขึ้นมาได้เท่านั้น security group ทำหน้าที่เป็นไฟร์วอลล์ เพื่อป้องกันไม่ให้การถูกเจาะระบบ (security breach) ใน tier หนึ่งเปิดช่องให้เข้าถึง resource ทั้งหมดของ subnet โดยอัตโนมัติจาก client ที่ถูกเจาะระบบ

## Comparing security groups and network ACLs

Security group ทำหน้าที่เป็นไฟร์วอลล์สำหรับ EC2 instance ที่ผูกอยู่ ควบคุม inbound/outbound traffic ที่ระดับ instance ส่วน network ACL ทำหน้าที่เป็นไฟร์วอลล์สำหรับ subnet ที่ผูกอยู่ ควบคุม inbound/outbound traffic ที่ระดับ subnet — network ACL ปฏิเสธการสื่อสารโดยค่าเริ่มต้น (denies by default) และลำดับของกฎ (rule order) มีความสำคัญ

| Security Group | Network ACL |
|---|---|
| ทำหน้าที่เป็นไฟร์วอลล์สำหรับ EC2 instance ที่ผูกอยู่ และผูกกับ elastic network interface ซึ่ง implement โดย hypervisor | ทำหน้าที่เป็นไฟร์วอลล์สำหรับ subnet ที่ผูกอยู่ |
| ควบคุม inbound/outbound traffic ที่ระดับ instance | ควบคุม inbound/outbound traffic ที่ระดับ subnet |
| รองรับเฉพาะกฎ Allow เท่านั้น | รองรับทั้งกฎ Allow และ Deny |
| เป็นไฟร์วอลล์แบบ stateful | เป็นไฟร์วอลล์แบบ stateless |
| ต้องกำหนด (assign) ให้ instance ด้วยตนเอง | ถูกใช้งานโดยอัตโนมัติเมื่อ instance ถูกเพิ่มเข้า subnet |

### Network ACL use case

Network ACL ควบคุมการเข้าถึง instance ใน subnet และทำหน้าที่เป็นชั้นการป้องกันสำรอง (backup layer of defense) กฎของ network ACL จะใช้กับทุก instance ใน subnet นั้น

ตัวอย่าง: instance ใน subnet สามารถสื่อสารกันเองได้ และเข้าถึงได้จาก remote computer ที่เชื่อถือได้ (trusted) ซึ่งอาจเป็นคอมพิวเตอร์ในเครือข่ายภายในหรือ instance ในอีก subnet/VPC หนึ่ง โดยใช้เพื่อเชื่อมต่อเข้า instance สำหรับงานดูแลระบบ (administrative tasks)

Security group rule และ network ACL rule จะอนุญาตการเข้าถึงจาก IP address ของ remote computer นั้นเท่านั้น (เช่น `172.31.1.2/32`) ส่วน traffic อื่นทั้งหมดจากอินเทอร์เน็ตหรือเครือข่ายอื่นจะถูกปฏิเสธ

## Key terms
- Network ACL: ไฟร์วอลล์แบบ stateless ระดับ subnet รองรับทั้งกฎ Allow และ Deny
- Security group: ไฟร์วอลล์เสมือนแบบ stateful ระดับ instance/network interface รองรับเฉพาะกฎ Allow
- Stateless: กฎ inbound/outbound ต้องตรวจสอบแยกกัน ไม่จดจำ state ของ traffic
- Stateful: response ของ traffic ที่ร้องขอ ได้รับอนุญาตอัตโนมัติโดยไม่ต้องมีกฎ inbound/outbound แยก
- Security group chaining: การเชื่อมโยง security group หลายตัวเพื่อควบคุม traffic ระหว่าง tier
