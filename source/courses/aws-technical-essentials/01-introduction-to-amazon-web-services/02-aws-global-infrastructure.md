# AWS Global Infrastructure

Infrastructure (ศูนย์ข้อมูล, การเชื่อมต่อเครือข่าย) คือรากฐานของทุกแอปพลิเคชันบนคลาวด์ ใน AWS โครงสร้างทางกายภาพเหล่านี้ประกอบกันเป็น **AWS Global Infrastructure** ในรูปแบบของ Regions และ Availability Zones

## Regions
**Regions** คือสถานที่ทางภูมิศาสตร์ทั่วโลกที่ AWS ตั้ง data center ไว้ โดยตั้งชื่อ Region ตามสถานที่ที่ตั้งอยู่ เช่น Region ใน Northern Virginia (สหรัฐฯ) เรียกว่า Northern Virginia Region และ Region ใน Oregon เรียกว่า Oregon Region AWS มี Region อยู่ใน Asia Pacific, China, Europe, Middle East, North America, และ South America และขยายเพิ่มเรื่อยๆ

แต่ละ Region จะมีทั้งชื่อทางภูมิศาสตร์และรหัส Region (Region code) เช่น
- `us-east-1` คือ Region แรกที่สร้างในฝั่งตะวันออกของสหรัฐฯ ชื่อทางภูมิศาสตร์คือ N. Virginia
- `ap-northeast-1` คือ Region แรกที่สร้างในโซนตะวันออกเฉียงเหนือของ Asia Pacific ชื่อทางภูมิศาสตร์คือ Tokyo

ใน AWS Console สามารถเลือก Region ที่ต้องการจาก dropdown menu ได้

## การเลือก AWS Region ที่เหมาะสม (Choosing the right AWS Region)
Region ของ AWS เป็นอิสระต่อกัน หากไม่ได้รับความยินยอมจากลูกค้าอย่างชัดเจน ข้อมูลจะไม่ถูก replicate จาก Region หนึ่งไปอีก Region หนึ่ง เมื่อเลือกว่าจะ host แอปพลิเคชันและ workload ที่ Region ใด ควรพิจารณา 4 ปัจจัยหลัก ได้แก่ latency, price, service availability, และ compliance

- **Latency**: หากแอปพลิเคชัน sensitive ต่อ latency (ความหน่วงระหว่างการร้องขอกับการตอบสนอง) ควรเลือก Region ที่อยู่ใกล้กลุ่มผู้ใช้ เพื่อป้องกันการรอนาน แอปแบบ synchronous เช่น เกม, telephony, WebSockets, IoT ได้รับผลกระทบจาก latency สูงมาก แม้แต่แอปแบบ asynchronous เช่น ecommerce ก็ยังได้รับผลกระทบจากความหน่วงในการเชื่อมต่อของผู้ใช้ได้
- **Pricing**: เนื่องจากเศรษฐกิจท้องถิ่นและลักษณะทางกายภาพของการดูแล data center ราคาจึงแตกต่างกันไปในแต่ละ Region ปัจจัยเช่น การเชื่อมต่ออินเทอร์เน็ต, ต้นทุนอุปกรณ์นำเข้า, ภาษีศุลกากร, อสังหาริมทรัพย์ ล้วนส่งผลต่อราคาของแต่ละ Region แทนที่จะคิดราคาเดียวทั่วโลก AWS คิดราคาตามปัจจัยทางการเงินเฉพาะของแต่ละ Region
- **Service availability**: บาง service อาจไม่มีให้บริการในบาง Region เอกสารของ AWS มีตารางแสดง service ที่มีในแต่ละ Region
- **Data compliance**: บริษัทระดับ enterprise มักต้องปฏิบัติตามกฎระเบียบที่กำหนดให้ข้อมูลลูกค้าต้องถูกเก็บไว้ในอาณาเขตทางภูมิศาสตร์ที่กำหนด หากเกี่ยวข้อง ควรเลือก Region ที่ตรงกับข้อกำหนด compliance

## Availability Zones
ภายในแต่ละ Region จะมีกลุ่มของ **Availability Zones (AZ)** ซึ่งประกอบด้วย data center หนึ่งแห่งหรือมากกว่า ที่มีระบบไฟฟ้า, เครือข่าย, และการเชื่อมต่อสำรอง (redundant) แยกจากกัน โดย data center เหล่านี้ตั้งอยู่ในสถานที่แยกกันซึ่งไม่เปิดเผยตำแหน่งที่ตั้ง และเชื่อมต่อกันด้วยลิงก์ความเร็วสูงและ latency ต่ำแบบ redundant

Availability Zone มีชื่อรหัสเช่นกัน โดยการเติมตัวอักษรต่อท้ายรหัส Region เช่น
- `us-east-1a` คือ Availability Zone ใน `us-east-1` (N. Virginia Region)
- `sa-east-1b` คือ Availability Zone ใน `sa-east-1` (São Paulo Region)

ดังนั้นหากเห็นทรัพยากรอยู่ใน `us-east-1c` ก็สามารถอนุมานได้ว่าทรัพยากรนั้นอยู่ใน Availability Zone c ของ `us-east-1` Region

## ขอบเขต (Scope) ของ AWS services
ขึ้นอยู่กับ service ที่ใช้งาน ทรัพยากรจะถูก deploy ในระดับ Availability Zone, Region, หรือ Global แต่ละ service มีความแตกต่างกัน จึงต้องเข้าใจว่า scope ของ service นั้นๆ ส่งผลต่อสถาปัตยกรรมแอปพลิเคชันอย่างไร

เมื่อใช้ service ที่มี scope ระดับ Region เพียงแค่เลือก Region ที่ต้องการใช้ ถ้าไม่ได้ถูกถามให้ระบุ Availability Zone แสดงว่า service นั้นทำงานในระดับ Region สำหรับ service ที่มี scope ระดับ Region AWS จะจัดการเพิ่ม data durability และ availability ให้อัตโนมัติ

ในทางกลับกัน บาง service จะให้ระบุ Availability Zone เอง ซึ่งในกรณีนี้ผู้ใช้มักต้องรับผิดชอบเรื่อง data durability และ high availability ของทรัพยากรนั้นด้วยตัวเอง

## การรักษา Resiliency
เพื่อให้แอปพลิเคชันพร้อมใช้งานอยู่เสมอ ต้องรักษา high availability และ resiliency แนวปฏิบัติที่ดีที่สุด (best practice) สำหรับสถาปัตยกรรมคลาวด์คือการใช้ managed service ที่มี scope ระดับ Region ซึ่งมาพร้อม availability และ resiliency ในตัว หากทำไม่ได้ ควรทำให้ workload ถูก replicate ข้าม Availability Zone หลายแห่ง อย่างน้อยที่สุดควรใช้ 2 Availability Zones เพื่อว่าหาก AZ หนึ่งล่ม แอปพลิเคชันจะยังมี infrastructure ทำงานอยู่ใน AZ ที่สองเพื่อรับ traffic แทน

## Edge locations
**Edge locations** คือสถานที่ทั่วโลกที่ใช้ cache เนื้อหา (content) ตัวอย่างเช่น หากมีไฟล์วิดีโออยู่ที่ลอนดอนและต้องการแชร์ให้ลูกค้าที่ซิดนีย์ สามารถ cache วิดีโอไว้ที่ edge location ที่ใกล้ซิดนีย์ที่สุดได้ ทำให้ลูกค้าเข้าถึงวิดีโอที่ cache ไว้ได้เร็วขึ้น

## Key terms
- Region: สถานที่ทางภูมิศาสตร์ที่ AWS ตั้ง data center หลายกลุ่มไว้
- Availability Zone (AZ): กลุ่มของ data center หนึ่งแห่งขึ้นไปภายใน Region ที่มีระบบไฟฟ้า/เครือข่ายแยกจากกัน
- Edge location: สถานที่ทั่วโลกที่ใช้ cache เนื้อหาเพื่อลด latency ให้ผู้ใช้
- Region-scoped service: บริการที่ระบุแค่ Region โดย AWS จัดการ durability/availability ให้เอง
