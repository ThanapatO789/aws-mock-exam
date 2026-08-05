# Storage for EC2 Instances

บทเรียนนี้พูดถึงการ configure storage สำหรับ EC2 instance โดยจะเรียนรู้ประเภทของ storage volume ต่าง ๆ

## Amazon Elastic Block Store (Amazon EBS)

**Amazon EBS** volume ให้ block-level storage ที่ทนทาน (durable) และถอดแนบได้ (detachable) สำหรับ EC2 instance เนื่องจาก mount เข้ากับ instance โดยตรง จึงให้ latency ต่ำมากระหว่างตำแหน่งที่เก็บข้อมูลกับตำแหน่งที่ใช้งานข้อมูลบน instance ด้วยเหตุนี้จึงเหมาะกับการรัน database บน EC2 instance

สามารถสร้าง **Amazon EBS snapshot** เป็น point-in-time copy ของข้อมูลได้ และยังใช้เก็บข้อมูลสำหรับ AMI ด้วย snapshot จะถูกเก็บไว้ใน Amazon S3 และสามารถนำกลับมาใช้สร้าง EC2 instance ใหม่ในภายหลังได้

ตัวเลือก block storage สำหรับ EC2 instance มี 2 แบบหลัก คือ **Amazon EBS** และ **Amazon EC2 instance store**

## Amazon EBS (โดยละเอียด)

Amazon EBS ให้ block storage volume ที่ทนทานและแนบกับ instance ได้ เหมาะใช้เป็น primary storage device สำหรับข้อมูลที่ต้องอัปเดตบ่อยและละเอียด (frequent and granular updates)

EBS volume ทำงานเหมือน raw, unformatted, external block device ที่แนบกับ instance เดียวได้ volume จะคงอยู่ต่อไปแม้ instance จะหยุดทำงาน (persists independently from the running life of an instance) หลังแนบ EBS volume เข้ากับ instance แล้ว สามารถใช้งานได้เหมือน hard drive จริง

- สามารถแนบหลาย EBS volume เข้ากับ instance เดียวได้
- volume และ instance ต้องอยู่ใน Availability Zone เดียวกัน
- ขึ้นอยู่กับประเภท volume และ instance สามารถใช้ **Multi-Attach** เพื่อ mount volume เข้ากับหลาย instance พร้อมกันได้
- EBS volume มีความยืดหยุ่นสูง: สำหรับ current-generation volume ที่แนบกับ current-generation instance type สามารถเพิ่มขนาด, ปรับ provisioned IOPS capacity และเปลี่ยน volume type บน live production volume ได้แบบ dynamic

### ประเภทของ EBS volume

Amazon EBS มี volume type หลายแบบ ต่างกันด้าน performance และราคา เพื่อให้เลือกปรับ storage performance และ cost ให้เหมาะกับแอปพลิเคชัน แบ่งเป็น 2 กลุ่มหลัก (เลือกดูผ่าน tab):

**Solid State Drives (SSD)**
เหมาะกับ transactional workload ที่มีการ read/write บ่อยและขนาด I/O เล็ก โดยตัวชี้วัดประสิทธิภาพหลักคือ IOPS SSD-backed volume type ได้แก่:
- **General Purpose SSD (gp2, gp3)** — storage คุ้มค่า เหมาะกับ use case หลากหลาย เช่น boot volume, database ขนาดเล็ก-กลาง, development/test environment
- **Provisioned IOPS SSD (io1, io2)** — ออกแบบสำหรับ workload ที่ต้องการ I/O สูง เช่น database workload ที่ sensitive ต่อ storage performance และ consistency ใช้ IOPS rate คงที่ตามที่ระบุตอนสร้าง volume Amazon EBS รับประกันส่ง provisioned performance ได้ 99.9% ของเวลา

**Hard Disk Drives (HDD)**
เหมาะกับ large streaming workload โดยตัวชี้วัดประสิทธิภาพหลักคือ throughput:
- **Throughput-optimized HDD (st1)** — magnetic storage ต้นทุนต่ำ วัดประสิทธิภาพด้วย throughput แทน IOPS เหมาะกับ workload แบบ large sequential เช่น Amazon EMR, ETL (extract, transform, load), data warehouse และ log processing
- **Cold HDD (sc1)** — magnetic storage ต้นทุนต่ำ วัดประสิทธิภาพด้วย throughput เช่นกัน เหมาะกับ large, sequential cold-data workload ให้ block storage ราคาประหยัดสำหรับข้อมูลที่เข้าถึงไม่บ่อย

## Amazon EC2 instance store

Instance บางประเภทสามารถเข้าถึง storage จาก disk ที่แนบอยู่กับ host computer โดยตรง เรียกว่า **instance store**

Instance store ให้ temporary block-level storage สำหรับ instance ข้อมูลบน instance store volume จะคงอยู่เฉพาะช่วงอายุของ instance ที่เกี่ยวข้องเท่านั้น หาก stop, hibernate หรือ terminate instance ข้อมูลบน instance store volume จะสูญหาย

Instance store เหมาะกับการเก็บข้อมูลชั่วคราวที่เปลี่ยนแปลงบ่อย เช่น buffer, cache, scratch data และเนื้อหาชั่วคราวอื่น ๆ รวมถึงเหมาะกับข้อมูลที่ replicate ข้าม fleet ของ instance เช่น load-balanced pool ของ web server

instance type เป็นตัวกำหนดขนาดของ instance store ที่มีให้ใช้และประเภท hardware ที่ใช้สำหรับ instance store volume ต้องระบุ instance store volume ที่ต้องการใช้ตอน launch instance (ยกเว้น NVMe instance store volume ซึ่งมีให้ใช้เป็นค่าเริ่มต้น) จากนั้นต้อง format และ mount instance store volume ก่อนใช้งาน และไม่สามารถเพิ่ม instance store volume ได้ภายหลังจาก launch instance ไปแล้ว

## Key terms
- Amazon EBS (Elastic Block Store): บริการ block-level storage ที่แนบกับ EC2 instance ได้ ข้อมูลคงอยู่ถาวรแม้ instance หยุดทำงาน
- EBS snapshot: point-in-time copy ของข้อมูลบน EBS volume เก็บไว้บน Amazon S3
- Multi-Attach: ความสามารถ mount EBS volume หนึ่งไปยังหลาย instance พร้อมกัน
- gp2/gp3: General Purpose SSD volume
- io1/io2: Provisioned IOPS SSD volume
- st1: Throughput Optimized HDD volume
- sc1: Cold HDD volume
- Instance store: temporary block-level storage ที่แนบกับ host computer โดยตรง ข้อมูลหายเมื่อ instance หยุด/terminate
