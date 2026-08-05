# Hybrid Networking

บางแอปพลิเคชันจำเป็นต้องเก็บไว้ on-premises ต่อไป แต่ต้องเชื่อมต่อเครือข่าย on-premises เข้ากับ cloud infrastructure บทเรียนนี้อธิบายตัวเลือกต่าง ๆ ในการเชื่อมต่อเครือข่าย on-premises กับ component ของแอปพลิเคชันบน cloud มีวิดีโอผู้สอนความยาว 5 นาที 1 วินาที

## AWS Site-to-Site VPN

**AWS Site-to-Site VPN connection** มี VPN tunnel สองเส้นระหว่าง virtual private gateway (หรือ transit gateway) ฝั่ง AWS กับ customer gateway ฝั่ง on-premises

- **Virtual private gateway** คือ VPN concentrator ฝั่ง AWS ของ Site-to-Site VPN connection
- VPN tunnel ทั้งสองเส้นของ VPN connection หนึ่งอันจะ terminate ใน Availability Zone ที่ต่างกัน
- **Customer gateway** คือ resource ที่สร้างขึ้นใน AWS แทน customer gateway device ในเครือข่าย on-premises ของคุณ ผู้ดูแลเครือข่ายเป็นผู้ตั้งค่า customer gateway device หรือ application ในเครือข่ายรีโมต โดย AWS จะให้ข้อมูล configuration ที่จำเป็น
- เลือกใช้ static routing หรือ dynamic routing ได้ตามความสามารถของ customer gateway device — dynamic routing ใช้ **Border Gateway Protocol (BGP)** เพื่อค้นหาเส้นทางโดยอัตโนมัติ

## AWS Direct Connect

**AWS Direct Connect** เชื่อมต่อเครือข่ายภายในองค์กรเข้ากับ Direct Connect location ผ่านสาย fiber-optic Ethernet มาตรฐาน ปลายด้านหนึ่งเชื่อมกับ router ของคุณ อีกด้านเชื่อมกับ Direct Connect router เรียกการเชื่อมต่อนี้ว่า **cross-connect** ด้วยการเชื่อมต่อนี้ สามารถสร้าง virtual interface ตรงไปยัง public AWS service (เช่น Amazon S3) หรือ Amazon VPC ได้โดยข้าม internet service provider (ISP) ในเส้นทางเครือข่าย

ต้องมี **Letter of Authorization and Connecting Facility Assignment (LOA-CFA)** เพื่อเริ่มกระบวนการสร้าง cross-connect ใน data center

### ปัจจัยด้านราคาของ Direct Connect

- **Capacity** — อัตราสูงสุดของข้อมูลที่ส่งผ่าน network connection ได้ วัดเป็น megabits per second (Mbps) หรือ gigabits per second (Gbps)
- **Port hours** — ระยะเวลาที่ port ถูก provision ให้ใช้งานกับ AWS หรืออุปกรณ์เครือข่ายของ AWS Direct Connect Delivery Partner ภายใน Direct Connect location แม้ไม่มีข้อมูลไหลผ่าน port ก็ยังถูกคิดค่า port hours ราคาต่อ port hour ขึ้นอยู่กับประเภทการเชื่อมต่อ (dedicated หรือ hosted)
- **Data Transfer out (DTO)** — network traffic สะสมที่ส่งผ่าน AWS Direct Connect ไปยังปลายทางนอก AWS คิดค่าบริการต่อ GB โดย DTO วัดจากปริมาณข้อมูลที่ส่ง ไม่ใช่ความเร็ว ราคาที่แน่นอนขึ้นอยู่กับ AWS Region และ Direct Connect location ที่ใช้งาน

บทเรียนถัดไปจะอธิบายวิธี route incoming traffic สำหรับ hybrid networking โดยใช้ AWS Transit Gateway

## Key terms
- AWS Site-to-Site VPN: การเชื่อมต่อ VPN สองเส้นระหว่าง AWS กับเครือข่าย on-premises
- Virtual private gateway: VPN concentrator ฝั่ง AWS
- Customer gateway: resource ใน AWS ที่แทน customer gateway device ฝั่ง on-premises
- BGP (Border Gateway Protocol): โปรโตคอลสำหรับ dynamic routing
- AWS Direct Connect: การเชื่อมต่อเครือข่าย on-premises กับ AWS ผ่านสาย fiber-optic โดยตรง
- Cross-connect: จุดเชื่อมต่อสายเคเบิลระหว่าง router ของลูกค้ากับ Direct Connect router
- LOA-CFA: เอกสารที่จำเป็นสำหรับเริ่มสร้าง cross-connect
- Capacity / Port hours / DTO: ปัจจัยด้านราคาหลักของ AWS Direct Connect
