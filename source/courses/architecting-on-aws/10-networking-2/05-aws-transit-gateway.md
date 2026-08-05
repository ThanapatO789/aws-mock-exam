# AWS Transit Gateway

เมื่อใช้ hybrid networking หรือผสมผสาน public/private subnet ในแอปพลิเคชัน จำเป็นต้องมีกลไกที่ route incoming traffic ไปยัง component ที่ถูกต้อง บทเรียนนี้อธิบายวิธีใช้ **AWS Transit Gateway** เพื่อทำหน้าที่นี้ มีวิดีโอผู้สอนความยาว 4 นาที 22 วินาที

## AWS Transit Gateway คืออะไร

**AWS Transit Gateway** ทำหน้าที่เป็น hub ที่ควบคุมการ route traffic ระหว่างเครือข่ายที่เชื่อมต่อทั้งหมด ซึ่งทำงานเหมือน spoke (แบบจำลอง **hub-and-spoke**) โมเดลนี้ช่วยลดความซับซ้อนในการจัดการและลดต้นทุนการดำเนินงานได้มาก เพราะแต่ละเครือข่ายต้องเชื่อมต่อกับ transit gateway เพียงจุดเดียว ไม่ต้องเชื่อมต่อกับทุกเครือข่ายแยกกัน เมื่อมี VPC ใหม่เชื่อมต่อกับ transit gateway ก็จะสื่อสารกับทุกเครือข่ายที่เชื่อมต่ออยู่ได้โดยอัตโนมัติ

**Transit gateway** คือ network transit hub ที่ใช้เชื่อมต่อ VPC และเครือข่าย on-premises เข้าด้วยกัน และ scale แบบ elastic ตามปริมาณ traffic

## องค์ประกอบของ Transit Gateway

Transit Gateway ประกอบด้วย 2 องค์ประกอบสำคัญ: **attachments** และ **route tables**

### Attachments

**Transit gateway attachment** คือจุดต้นทางและปลายทางของ packet สามารถ attach resource ต่อไปนี้ได้หนึ่งรายการขึ้นไป หากอยู่ใน Region เดียวกับ transit gateway:

- VPC
- VPN connection
- Direct Connect gateway
- Transit Gateway Connect
- Transit Gateway peering connection

### Route tables

Transit gateway มี **default route table** และสามารถมี route table เพิ่มเติมได้ (optional) route table ประกอบด้วย dynamic และ static route ที่กำหนด next hop จาก destination IP address ของ packet โดย target ของ route เหล่านี้อาจเป็น transit gateway attachment ใดก็ได้ ตามค่าเริ่มต้น transit gateway attachment จะถูก associate กับ default transit gateway route table

## การตั้งค่า Transit Gateway

Transit gateway ทำงานข้าม AWS account ได้ โดยใช้ **AWS Resource Access Manager** เพื่อแชร์ transit gateway กับ account อื่น หลังจากแชร์ transit gateway กับ account อื่นแล้ว เจ้าของ account นั้นสามารถ attach VPC ของตนเข้ากับ transit gateway ได้ ผู้ใช้จากทั้งสอง account สามารถลบ attachment ได้ตลอดเวลา

บทเรียนถัดไปเป็น tech talk อภิปรายการประเมินสถาปัตยกรรมเครือข่าย (network architecture)

## Key terms
- AWS Transit Gateway: network transit hub สำหรับเชื่อมต่อ VPC และเครือข่าย on-premises แบบ hub-and-spoke
- Attachment: จุดต้นทาง/ปลายทางของ packet ที่เชื่อมต่อกับ transit gateway (เช่น VPC, VPN connection, Direct Connect gateway)
- Transit gateway route table: ตารางเส้นทางที่กำหนด next hop ของ traffic ผ่าน transit gateway
- AWS Resource Access Manager: บริการสำหรับแชร์ transit gateway ข้าม AWS account
