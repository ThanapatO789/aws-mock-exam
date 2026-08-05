# IP Addressing

บทเรียนนี้อธิบายแนวคิดพื้นฐานของการกำหนด IP address ครอบคลุมรูปแบบ **IPv4** และ **IPv6**

IP address ใช้ระบุตำแหน่งของ resource ภายในเครือข่าย โดยแบ่งเป็นสองส่วน คือส่วนที่ระบุเครือข่าย (network) และส่วนที่ระบุ host ภายในเครือข่ายนั้น

## IPv4 addresses

IPv4 ถูกพัฒนาขึ้นในช่วงต้นทศวรรษ 1980 ใช้ address ขนาด 32 บิต โดยแบ่งบิตออกเป็น 4 กลุ่ม กลุ่มละ 8 บิต เรียกว่า octet

- เขียนในรูปแบบ numeric dot-decimal notation
- สามารถสร้าง address ได้ 4.3 พันล้านรายการ (4.3 billion) จึงต้องมีการใช้ address ซ้ำและทำ masking

## IPv6 addresses

IPv6 ถูกพัฒนาขึ้นในปี 1998 เพื่อทดแทน IPv4 ใช้ address ขนาด 128 บิต

- IPv6 address ประกอบด้วย 8 กลุ่ม กลุ่มละ 4 hexadecimal digit (รวม 128 บิต) คั่นด้วยเครื่องหมาย colon (:)
- สามารถย่อรูปแบบเต็มให้สั้นลงได้ เช่น `50b2:6400:0000:0000:0000:6c3a:b17d:0:10a9` เขียนย่อเป็น `50b2:6400::6c3a:b17d:0:10a9`
- รองรับ address ได้มากถึง 340 trillion trillion trillion รายการ ทำให้แต่ละอุปกรณ์มี address เฉพาะตัวได้
- รองรับการตั้งค่าอัตโนมัติ (automatic configuration)

## CIDR (Classless Inter-Domain Routing)

เมื่อสร้างเครือข่ายใน AWS ด้วย VPC ต้องระบุ CIDR block ให้กับ VPC และ subnets โดยต้องจัดสรร IP address ให้เพียงพอกับ resource บนเครือข่าย VPC หนึ่งตัวสามารถมี CIDR block ได้สูงสุด 5 รายการ และช่วง address ต้องไม่ทับซ้อนกัน

**CIDR** เป็นวิธีการกำหนด IP address ที่ช่วยเพิ่มประสิทธิภาพการกระจาย address โดยระบุเป็น CIDR block เช่น `10.0.0.0/16` ซึ่งเป็น primary CIDR block ของ VPC

- กำหนดขนาด block ได้ตั้งแต่ `/28` (16 IP addresses) ถึง `/16` (65,536 IP addresses)
- Amazon VPC รองรับทั้ง IPv4 และ IPv6 addressing โดยมีข้อจำกัดขนาด CIDR block ต่างกัน
- ทุก VPC และ subnet ต้องมี IPv4 CIDR block เสมอ (เปลี่ยนแปลงไม่ได้) ส่วน IPv6 CIDR block เป็นตัวเลือก (optional) ที่สามารถผูกเพิ่มได้

### Subnet Mask

CIDR block ระบุเครือข่ายด้วย dot notation และระบุ subnet mask ด้วย slash notation

Subnet mask กำหนดว่าส่วนใดของ IP address ใช้ระบุเครือข่าย (network) และส่วนใดใช้ระบุ host เช่น IPv4 address มี 32 บิต แบ่งเป็น 4 octets, subnet mask `/16` จะสงวน 16 บิตแรก (2 octets) ไว้สำหรับระบุเครือข่าย ส่วนที่เหลือ 16 บิตใช้ระบุ host

**AWS supported CIDR ranges:** จาก 32 บิตของ IPv4 address, AWS อนุญาตให้ใช้สูงสุด 28 บิตระบุเครือข่าย (เหลือ 4 บิตระบุ resource ได้สูงสุด 16 รายการในแต่ละ subnet) และควรใช้อย่างน้อย 16 บิตระบุเครือข่าย (เหลือ 16 บิตระบุ resource ได้สูงสุด 65,536 รายการ) สรุปคือสามารถใช้ 16-28 บิตระบุเครือข่าย และ 4-16 บิตระบุ resource ใน subnet

## Key terms
- IPv4: มาตรฐาน IP address แบบ 32 บิต เขียนด้วย dot-decimal notation
- IPv6: มาตรฐาน IP address แบบ 128 บิต เขียนด้วย hexadecimal คั่นด้วย colon
- CIDR (Classless Inter-Domain Routing): วิธีกำหนดช่วง IP address ด้วย CIDR block เช่น 10.0.0.0/16
- Subnet mask: ตัวกำหนดว่าส่วนใดของ IP address เป็น network และส่วนใดเป็น host
