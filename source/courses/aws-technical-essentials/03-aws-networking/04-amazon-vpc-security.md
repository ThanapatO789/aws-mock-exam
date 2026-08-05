# Amazon VPC Security

ความปลอดภัยของ cloud ที่ AWS คือสิ่งที่สำคัญที่สุด เราจะได้ประโยชน์จาก data center และ network architecture ที่ถูกสร้างมาเพื่อตอบสนององค์กรที่อ่อนไหวด้านความปลอดภัยมากที่สุด

## Secure subnets with network access control lists (Network ACL)

**Network ACL** เปรียบเสมือน virtual firewall ระดับ subnet ช่วยควบคุมประเภทของ traffic ที่อนุญาตให้เข้า (enter) หรือออก (leave) จาก subnet ได้ โดยตั้งค่ากฎ (rules) เพื่อกำหนดสิ่งที่ต้องการกรอง (filter)

### ตัวอย่าง Default network ACL (สำหรับ VPC ที่รองรับ IPv4)

**Inbound**

| Rule # | Type | Protocol | Port Range | Source | Allow or Deny |
|---|---|---|---|---|---|
| 100 | All IPv4 traffic | All | All | 0.0.0.0/0 | ALLOW |
| * | All IPv4 traffic | All | All | 0.0.0.0/0 | DENY |

**Outbound**

| Rule # | Type | Protocol | Port Range | Destination | Allow or Deny |
|---|---|---|---|---|---|
| 100 | All IPv4 traffic | All | All | 0.0.0.0/0 | ALLOW |
| * | All IPv4 traffic | All | All | 0.0.0.0/0 | DENY |

Default network ACL อนุญาตให้ traffic ทั้งหมดไหลเข้าและออกจาก subnet ได้ ซึ่งเป็นจุดเริ่มต้นที่ดีเพื่อให้ข้อมูลไหลเข้าสู่ subnet ได้อย่างอิสระ

แต่ในบางกรณีเราอาจต้องการจำกัด (restrict) การไหลของข้อมูลที่ระดับ subnet เช่น ถ้ามีเว็บแอปพลิเคชัน เราอาจต้องการจำกัดเครือข่ายให้อนุญาตเฉพาะ HTTPS traffic และ Remote Desktop Protocol (RDP) traffic เข้าสู่ web server เท่านั้น

### ตัวอย่าง Custom network ACL

**Inbound**

| Rule # | Source IP | Protocol | Port | Allow or Deny | Comments |
|---|---|---|---|---|---|
| 100 | All IPv4 traffic | TCP | 443 | ALLOW | อนุญาต inbound HTTPS traffic จากทุกที่ |
| 130 | 192.0.2.0/24 | TCP | 3389 | ALLOW | อนุญาต inbound RDP traffic เข้าสู่ web server จากช่วง public IP ของเครือข่ายบ้าน (ผ่าน internet gateway) |
| * | All IPv4 traffic | All | All | DENY | ปฏิเสธ inbound traffic ทั้งหมดที่ไม่ตรงกับกฎก่อนหน้า (แก้ไขไม่ได้) |

**Outbound**

| Rule # | Destination IP | Protocol | Port | Allow or Deny | Comments |
|---|---|---|---|---|---|
| 120 | 0.0.0.0/0 | TCP | 1025-65535 | ALLOW | อนุญาต outbound response ไปยัง client บนอินเทอร์เน็ต (ตอบกลับผู้ที่เข้าเว็บ server ใน subnet) |
| * | 0.0.0.0/0 | All | All | DENY | ปฏิเสธ outbound traffic ทั้งหมดที่ไม่ตรงกับกฎก่อนหน้า (แก้ไขไม่ได้) |

จากตัวอย่าง custom network ACL ข้างต้น จะเห็นว่าอนุญาต inbound พอร์ต 443 และ outbound ช่วง 1025–65535 เพราะ HTTPS ใช้พอร์ต 443 ในการเริ่มการเชื่อมต่อ (initiate connection) และจะตอบกลับผ่าน ephemeral port **Network ACL เป็นแบบ stateless** จึงต้องกำหนดทั้ง inbound และ outbound port ที่ใช้สำหรับ protocol นั้นๆ ถ้าไม่รวมช่วง outbound ไว้ server จะตอบกลับได้ แต่ traffic จะไม่สามารถออกจาก subnet ได้

เนื่องจาก network ACL ถูก configure ให้อนุญาต traffic ทั้งขาเข้าและขาออกโดย default อยู่แล้ว จึงไม่จำเป็นต้องเปลี่ยนการตั้งค่าเริ่มต้น เว้นแต่ต้องการเพิ่มชั้นความปลอดภัย (additional security layers)

## Secure EC2 instances with security groups

ชั้นความปลอดภัยถัดไปคือของ EC2 instance ซึ่งสามารถสร้าง virtual firewall เรียกว่า **security group** ค่า default configuration ของ security group จะ **บล็อก inbound traffic ทั้งหมด** และ **อนุญาต outbound traffic ทั้งหมด**

โดย default security group จะอนุญาตเฉพาะ outbound traffic เท่านั้น หากต้องการอนุญาต inbound traffic ต้องสร้าง inbound rules

คำถามที่อาจเกิดขึ้น: "แล้วแบบนี้จะบล็อก EC2 instance ไม่ให้รับ response ของ customer request หรือไม่?" คำตอบคือไม่ เพราะ **security group เป็นแบบ stateful** หมายความว่ามันจะจดจำว่า connection ถูกเริ่มต้นจาก EC2 instance เองหรือจากภายนอก และจะอนุญาต traffic ตอบกลับชั่วคราวโดยไม่ต้องแก้ไข inbound rules

หากต้องการให้ EC2 instance รับ traffic จากอินเทอร์เน็ต ต้องเปิด inbound port เช่น ถ้ามี web server อาจต้องอนุญาต HTTP และ HTTPS request โดยสร้าง inbound rule ที่อนุญาตพอร์ต 80 (HTTP) และพอร์ต 443 (HTTPS)

### ตัวอย่าง Security group inbound rules

| Type | Protocol | Port Range | Source |
|---|---|---|---|
| HTTP (80) | TCP (4) | 80 | 0.0.0.0/0 |
| HTTP (80) | TCP (6) | 80 | ::/0 |
| HTTPS (443) | TCP (4) | 443 | 0.0.0.0/0 |
| HTTPS (443) | TCP (6) | 443 | ::/0 |

เช่นเดียวกับที่ subnet สามารถใช้แยก (segregate) traffic ระหว่างคอมพิวเตอร์ในเครือข่ายได้ security group ก็สามารถใช้ในลักษณะเดียวกัน รูปแบบการออกแบบทั่วไปคือจัดกลุ่ม resource ออกเป็นกลุ่มต่างๆ และสร้าง security group สำหรับแต่ละกลุ่มเพื่อควบคุมการสื่อสารระหว่างกัน

ตัวอย่างเช่น การแบ่ง 3 tiers และแยก (isolate) แต่ละ tier ด้วย security group rules ที่กำหนดไว้:
- Internet traffic ไปยัง web tier อนุญาตผ่าน HTTPS
- Web tier ไปยัง application tier อนุญาตผ่าน HTTP
- Application tier ไปยัง database tier อนุญาตผ่าน MySQL

สิ่งนี้แตกต่างจากสภาพแวดล้อม on-premises แบบดั้งเดิม ซึ่งแยก resource ด้วยการตั้งค่า VLAN แต่ใน AWS security group ช่วยให้บรรลุการแยกส่วนแบบเดียวกันได้โดยไม่ต้องผูก security group เข้ากับเครือข่ายจริง

## Key terms
- Network ACL (network access control list): virtual firewall ระดับ subnet, เป็นแบบ stateless (ต้องกำหนดทั้ง inbound และ outbound rule แยกกัน)
- Security group: virtual firewall ระดับ EC2 instance, เป็นแบบ stateful (จดจำการเชื่อมต่อและอนุญาต traffic ตอบกลับอัตโนมัติ)
- Stateless: ไม่จดจำสถานะการเชื่อมต่อ ต้องกำหนดกฎ inbound/outbound แยกกันชัดเจน (คุณสมบัติของ network ACL)
- Stateful: จดจำสถานะการเชื่อมต่อ อนุญาต traffic ตอบกลับให้อัตโนมัติ (คุณสมบัติของ security group)
- Ephemeral port: พอร์ตชั่วคราวที่ใช้รับ response ของการเชื่อมต่อที่เริ่มต้นจากฝั่งอื่น
- Default network ACL: อนุญาต traffic ทั้งหมดเข้า/ออกโดย default
- Default security group: บล็อก inbound ทั้งหมด, อนุญาต outbound ทั้งหมดโดย default
