# Amazon VPC

เพื่อความ redundancy และ fault tolerance ควรสร้างอย่างน้อย 2 subnet ที่ configure ไว้ใน 2 Availability Zones

## Amazon VPC คืออะไร

**Virtual Private Cloud (VPC)** คือเครือข่ายที่แยกตัว (isolated network) ที่สร้างขึ้นใน AWS Cloud คล้ายกับเครือข่ายแบบดั้งเดิมใน data center เมื่อสร้าง Amazon VPC ต้องเลือก 3 ปัจจัยหลัก:
- ชื่อของ VPC
- Region ที่ VPC จะอยู่ — VPC จะครอบคลุมทุก Availability Zone ภายใน Region ที่เลือก
- ช่วง IP (IP range) ของ VPC ในรูปแบบ CIDR notation — กำหนดขนาดของเครือข่าย แต่ละ VPC สามารถมี CIDR ได้สูงสุด 5 ชุด (1 primary + 4 secondary สำหรับ IPv4) แต่ละช่วงมีขนาดตั้งแต่ /28 ถึง /16

จากข้อมูลนี้ AWS จะจัดสรรเครือข่ายและ IP address ให้

## การสร้าง Subnet

หลังจากสร้าง VPC แล้ว ต้องสร้าง **subnet** ภายในเครือข่ายนั้น มองว่า subnet เป็นเครือข่ายย่อยภายใน base network หรือเทียบได้กับ virtual local area networks (VLANs) ในเครือข่าย on-premises แบบดั้งเดิม ใน on-premises การใช้ subnet มักเพื่อแยก (isolate) หรือ optimize การจราจรของเครือข่าย แต่ใน AWS subnet ถูกใช้เพื่อให้ high availability และตัวเลือกการเชื่อมต่อสำหรับ resource ต่างๆ

- ใช้ **public subnet** สำหรับ resource ที่ต้องเชื่อมต่อกับ internet
- ใช้ **private subnet** สำหรับ resource ที่ไม่ต้องเชื่อมต่อกับ internet

เมื่อสร้าง subnet ต้องระบุ:
- VPC ที่ subnet นี้จะอยู่ — เช่น VPC (10.0.0.0/16)
- Availability Zone ที่ subnet จะอยู่ — เช่น Availability Zone 1
- IPv4 CIDR block ของ subnet ซึ่งต้องเป็นส่วนย่อย (subset) ของ VPC CIDR block — เช่น 10.0.0.0/24

เมื่อ launch EC2 instance จะเป็นการ launch ภายใน subnet ซึ่งอยู่ภายใน Availability Zone ที่เลือก

## High availability กับ VPC

เมื่อสร้าง subnet ควรคำนึงถึง high availability เสมอ เพื่อความ redundancy และ fault tolerance ควรสร้างอย่างน้อย 2 subnet ที่ configure ไว้ใน 2 Availability Zones ตามหลักที่ว่า "everything fails all of the time" หาก Availability Zone หนึ่งล่ม resource ยังคงพร้อมใช้งานใน Availability Zone อื่นเป็น backup

## Reserved IPs

AWS จองไว้ 5 IP address ในแต่ละ subnet เพื่อใช้ configure VPC อย่างเหมาะสม (ใช้สำหรับ routing, DNS, และ network management)

ตัวอย่าง: VPC ที่มีช่วง IP `10.0.0.0/22` มี IP address ทั้งหมด 1,024 ตัว แบ่งเป็น 4 subnet ขนาดเท่ากัน แต่ละ subnet มีช่วง `/24` (256 IP address) แต่ในแต่ละช่วงนั้นใช้งานได้จริงเพียง 251 IP address เพราะ AWS จองไว้ 5 ตัว

IP ที่ถูกจองไว้ 5 ตัวนี้มีผลต่อการออกแบบเครือข่าย จุดเริ่มต้นที่นิยมสำหรับผู้เริ่มต้นใช้ cloud คือสร้าง VPC ด้วยช่วง IP `/16` และสร้าง subnet ด้วยช่วง IP `/24` ซึ่งให้จำนวน IP address มากเพียงพอทั้งในระดับ VPC และ subnet

## Gateways

**Internet gateway**
เพื่อเปิดใช้งานการเชื่อมต่ออินเทอร์เน็ตให้ VPC ต้องสร้าง **internet gateway** เปรียบเสมือน modem — เชื่อมต่อ VPC เข้ากับอินเทอร์เน็ต แต่ต่างจาก modem ที่บ้านซึ่งบางครั้ง down หรือ offline internet gateway มีความพร้อมใช้งานสูง (highly available) และปรับขนาดได้ (scalable) หลังสร้าง internet gateway แล้วต้อง attach เข้ากับ VPC

**Virtual private gateway**
เชื่อมต่อ VPC กับเครือข่าย private อื่น เมื่อสร้างและ attach virtual private gateway กับ VPC แล้ว gateway นี้จะทำหน้าที่เป็นจุดยึด (anchor) ฝั่ง AWS ของการเชื่อมต่อ ส่วนอีกฝั่งต้องเชื่อมต่อ **customer gateway** เข้ากับเครือข่าย private อีกฝั่งหนึ่ง customer gateway device คืออุปกรณ์จริงหรือซอฟต์แวร์ฝั่งของผู้ใช้เอง เมื่อมี gateway ทั้งสองฝั่งแล้ว จะสามารถสร้างการเชื่อมต่อ **VPN (virtual private network)** แบบเข้ารหัสระหว่างสองฝั่งได้

## AWS Direct Connect

เพื่อสร้างการเชื่อมต่อทางกายภาพ (physical connection) ที่ปลอดภัยระหว่าง on-premises data center กับ Amazon VPC สามารถใช้ **AWS Direct Connect** ซึ่งเชื่อมเครือข่ายภายในองค์กรเข้ากับ AWS Direct Connect location ผ่านสาย fiber-optic Ethernet มาตรฐาน การเชื่อมต่อนี้ช่วยให้สร้าง virtual interface เชื่อมตรงไปยัง public AWS service หรือ VPC ได้

## Key terms
- VPC (Virtual Private Cloud): เครือข่ายส่วนตัวแบบแยกตัวที่สร้างใน AWS Cloud
- Subnet: เครือข่ายย่อยภายใน VPC ผูกกับ Availability Zone หนึ่งๆ
- Public subnet: subnet สำหรับ resource ที่ต้องเชื่อมต่อ internet
- Private subnet: subnet สำหรับ resource ที่ไม่เชื่อมต่อ internet
- Reserved IPs: IP address 5 ตัวต่อ subnet ที่ AWS จองไว้สำหรับ routing/DNS/network management
- Internet gateway: component ที่เชื่อม VPC เข้ากับอินเทอร์เน็ต
- Virtual private gateway: component ฝั่ง AWS สำหรับเชื่อมต่อ VPC กับเครือข่าย private ภายนอกผ่าน VPN
- Customer gateway: อุปกรณ์/ซอฟต์แวร์ฝั่งผู้ใช้สำหรับเชื่อมต่อ VPN เข้ากับ AWS
- VPN (Virtual Private Network): การเชื่อมต่อแบบเข้ารหัสระหว่างเครือข่ายสองฝั่ง
- AWS Direct Connect: บริการเชื่อมต่อทางกายภาพโดยตรงระหว่าง on-premises กับ AWS ผ่านสาย fiber-optic
