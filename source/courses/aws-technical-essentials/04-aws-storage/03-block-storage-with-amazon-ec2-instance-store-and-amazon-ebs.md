# Block Storage with Amazon EC2 Instance Store and Amazon EBS

คุณสมบัติเฉพาะตัวของ block storage ทำให้เหมาะกับ application ที่เป็น transactional, mission-critical และ I/O-intensive มากที่สุด

## Amazon EC2 instance store

**Amazon EC2 instance store** ให้ block-level storage แบบชั่วคราว (temporary) สำหรับ instance โดย storage นี้อยู่บนดิสก์ที่เชื่อมต่อทางกายภาพกับ host computer โดยตรง ทำให้ lifecycle ของข้อมูลผูกกับ lifecycle ของ EC2 instance นั้นๆ — ถ้าลบ instance ข้อมูลใน instance store ก็จะถูกลบไปด้วย ด้วยเหตุนี้ instance store จึงถือเป็น **ephemeral storage** (storage ชั่วคราว)

Instance store เหมาะสำหรับข้อมูลที่ต้องการ throughput สูง จากการใช้ disk แบบ physically attached และความสามารถในการทนทาน (resiliency) จากการทำ replicated data ช่วยให้กระจายข้อมูล (data distribution) ได้ที่ performance สูง เหมาะอย่างยิ่งสำหรับการเก็บข้อมูลชั่วคราวที่เปลี่ยนแปลงบ่อย เช่น buffer, cache, scratch data และเนื้อหาชั่วคราวอื่นๆ

## Amazon EBS

**Amazon Elastic Block Store (Amazon EBS)** คือ block-level storage ที่สามารถแนบ (attach) เข้ากับ Amazon EC2 instance ได้ เปรียบเทียบได้กับการต่อ external drive เข้ากับ laptop พื้นที่ storage ที่แนบได้นี้เรียกว่า **EBS volume** ซึ่งมีพฤติกรรมคล้าย external drive ในหลายด้าน:

- **Detachable** — สามารถถอด (detach) EBS volume จาก EC2 instance หนึ่งแล้วนำไปแนบ (attach) กับ EC2 instance อื่นใน Availability Zone เดียวกันเพื่อเข้าถึงข้อมูลได้
- **Distinct** — external drive แยกออกจากตัวคอมพิวเตอร์ ถ้าคอมพิวเตอร์เสียหาย ข้อมูลบน external drive ยังอยู่ เช่นเดียวกับ EBS volume
- **Size-limited** — มีข้อจำกัดเรื่องขนาดสูงสุดที่สามารถเก็บข้อมูลได้บน volume
- **1-to-1 connection** — external drive ส่วนใหญ่เชื่อมต่อกับคอมพิวเตอร์ได้ทีละเครื่อง เช่นเดียวกัน EBS volume ส่วนใหญ่มีความสัมพันธ์แบบ one-to-one กับ EC2 instance คือไม่สามารถแชร์หรือแนบกับหลาย instance พร้อมกันได้

AWS ได้ประกาศฟีเจอร์ **Amazon EBS multi-attach** ที่อนุญาตให้ Provisioned IOPS SSD volume (io1 หรือ io2) สามารถแนบกับ EC2 instance ได้หลายตัวพร้อมกัน โดยฟีเจอร์นี้ไม่รองรับทุก instance type และทุก instance ต้องอยู่ใน Availability Zone เดียวกัน

## Scaling Amazon EBS volumes

สามารถขยาย (scale) EBS volume ได้ 2 วิธี:

- **Increase Volume Size** — เพิ่มขนาด volume ได้ตราบใดที่ยังไม่เกินขนาดสูงสุดที่กำหนด สามารถเพิ่มขนาดได้เรื่อยๆ จนถึง 64 TiB
- **Attach Multiple Volumes** — แนบหลาย volume เข้ากับ EC2 instance เดียว เนื่องจาก Amazon EC2 มีความสัมพันธ์แบบ one-to-many กับ EBS volume จึงสามารถเพิ่ม volume เหล่านี้ระหว่างหรือหลังการสร้าง EC2 instance เพื่อเพิ่มพื้นที่ storage ให้กับ host ได้

## Amazon EBS use cases (accordion ที่ขยายแล้ว)

Amazon EBS มีประโยชน์เมื่อต้องเรียกดูข้อมูลได้อย่างรวดเร็วและต้องการให้ข้อมูลคงอยู่ในระยะยาว (persist long term) use case ที่พบบ่อย:

- **Operating systems** — boot และ root volume ใช้เก็บ operating system ได้ โดย root device ของ instance ที่ launch จาก Amazon Machine Image (AMI) มักจะเป็น EBS volume เรียกว่า EBS-backed AMI
- **Databases** — ใช้เป็น storage layer สำหรับ database ที่รันบน Amazon EC2 ซึ่งขยายตามความต้องการด้าน performance และให้ performance ที่คงที่และ low-latency
- **Enterprise applications** — Amazon EBS ให้ high availability และ high durability block storage สำหรับรัน business-critical application
- **Big data analytics engines** — Amazon EBS มี data persistence, ปรับ performance แบบ dynamic ได้ และสามารถ detach/reattach volume ได้ ทำให้ resize cluster สำหรับ big data analytics ได้

## EBS volume types

EBS volume แบ่งเป็น 2 หมวดหลัก: **solid-state drives (SSD)** และ **hard-disk drives (HDD)** โดย SSD ใช้กับ transactional workload ที่มีการอ่าน/เขียนบ่อยและขนาด I/O เล็ก ส่วน HDD ใช้กับ large streaming workload ที่ต้องการ throughput สูง AWS มีให้เลือก 2 ชนิดในแต่ละหมวด

### SSD volumes (accordion ที่ขยายแล้ว)

| | General Purpose SSD (gp3 / gp2) | Provisioned IOPS SSD (io2 Block Express / io2 / io1) |
|---|---|---|
| Description | ให้ความสมดุลระหว่างราคาและ performance สำหรับ transactional workload หลากหลายประเภท | SSD ประสิทธิภาพสูง ออกแบบสำหรับ transactional workload ที่ latency-sensitive |
| Volume size | 1 GiB – 16 TiB | 4 GiB – 64 TiB (io2 Block Express), 4 GiB – 16 TiB (io2/io1) |
| Max IOPS ต่อ volume | 16,000 | 256,000 |
| Max throughput ต่อ volume | 1,000 MiB/s | 250 MiB/s – 4,000 MiB/s |
| Amazon EBS Multi-attach | ไม่รองรับ | รองรับ |

### HDD volumes (accordion ที่ขยายแล้ว)

| | Throughput Optimized HDD (st1) | Cold HDD (sc1) |
|---|---|---|
| Description | HDD ต้นทุนต่ำ ออกแบบสำหรับ workload ที่เข้าถึงบ่อยและเน้น throughput | HDD ต้นทุนต่ำที่สุด ออกแบบสำหรับ workload ที่เข้าถึงไม่บ่อย |
| Volume size | 125 GiB – 16 TiB | 125 GiB – 16 TiB |
| Max IOPS ต่อ volume | 500 | 250 |
| Max throughput ต่อ volume | 500 MiB/s | 250 MiB/s |
| Amazon EBS Multi-attach | ไม่รองรับ | ไม่รองรับ |

## Key terms
- Amazon EC2 instance store: block-level storage ชั่วคราว (ephemeral) ที่ผูกกับ lifecycle ของ EC2 instance
- Amazon EBS: block storage ที่ attach/detach กับ EC2 instance ได้ คงอยู่แยกจาก instance
- Amazon EBS multi-attach: ฟีเจอร์ที่ให้ io1/io2 volume แนบกับหลาย EC2 instance ได้พร้อมกัน (ใน AZ เดียวกัน)
- SSD volume (gp3/gp2/io2/io1): เหมาะกับ transactional workload, I/O ขนาดเล็ก, ต้องการ IOPS สูง
- HDD volume (st1/sc1): เหมาะกับ large streaming workload ที่ต้องการ throughput สูงแต่ราคาต่ำ
