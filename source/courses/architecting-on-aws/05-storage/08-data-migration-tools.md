# Data Migration Tools

หลังจากเรียนรู้เรื่อง storage services แล้ว บทเรียนนี้จะพูดถึงวิธีย้ายข้อมูลเข้าสู่บริการเหล่านั้น

## AWS Storage Gateway

**AWS Storage Gateway** เป็นบริการที่ช่วยให้แอปพลิเคชันเชื่อมต่อกันได้อย่างราบรื่นและปลอดภัยระหว่าง on-premises environment กับ AWS storage

AWS Storage Gateway เชื่อมต่อ software appliance แบบ on-premises เข้ากับ cloud-based storage เพื่อให้เกิดการผสานรวมข้อมูลอย่างราบรื่น พร้อมฟีเจอร์ด้านความปลอดภัยข้อมูล ระหว่าง on-premises IT environment กับ AWS storage infrastructure

### Storage Gateway architecture (hotspot)

- **Transfer protocols supported**: Storage Gateway Appliance รองรับโปรโตคอลต่อไปนี้ในการเชื่อมต่อกับข้อมูล local:
  - NFS หรือ SMB สำหรับไฟล์ (files)
  - iSCSI สำหรับ volume
  - iSCSI VTL สำหรับ tape
- **Storage Gateway appliance**: storage gateway appliance รันได้ 1 ใน 4 โหมด ได้แก่ Amazon S3 File Gateway, Amazon FSx File Gateway, Tape Gateway หรือ Volume Gateway
- **Storage services**: ข้อมูลที่ย้ายเข้าสู่ AWS ผ่าน Storage Gateway สามารถส่งไปยังปลายทางต่อไปนี้ผ่าน Storage Gateway managed service:
  - Amazon S3 (Amazon S3 File Gateway, Tape Gateway)
  - Amazon S3 Glacier (Amazon S3 File Gateway, Tape Gateway)
  - Amazon FSx for Windows File Server (Amazon FSx File Gateway)
  - Amazon EBS (Volume Gateway)

### AWS Storage Gateway types (flashcard)

- **Amazon S3 File Gateway**: มี file interface ให้ใช้เก็บไฟล์เป็น object ใน Amazon S3 โดยใช้โปรโตคอลไฟล์มาตรฐานอุตสาหกรรม NFS และ SMB สามารถเข้าถึงไฟล์ผ่าน NFS/SMB จาก data center หรือ Amazon EC2 หรือเข้าถึงไฟล์เหล่านั้นในรูปแบบ object โดยตรงใน Amazon S3
- **Tape Gateway**: มี iSCSI-based virtual tape library (VTL) ของ virtual tape drive และ virtual media changer ให้กับแอปพลิเคชัน backup แบบ on-premises Tape Gateway เก็บ virtual tape ใน Amazon S3 และสร้างเทปใหม่ให้อัตโนมัติ ช่วยลดความยุ่งยากในการบริหารจัดการและการย้ายไปใช้ AWS
- **Volume Gateway**: มี block storage volume ให้แอปพลิเคชันใช้งานผ่านโปรโตคอล iSCSI สามารถสำรองข้อมูลที่เขียนลง volume เหล่านี้แบบ asynchronous เป็น point-in-time snapshot และเก็บไว้บนคลาวด์ในรูปแบบ Amazon EBS snapshot

## AWS DataSync

**AWS DataSync** ช่วยย้ายข้อมูลปริมาณมากระหว่าง on-premises storage กับ Amazon S3, Amazon EFS หรือ FSx for Windows File Server โดยค่าเริ่มต้นข้อมูลจะถูกเข้ารหัสระหว่างส่งด้วย Transport Layer Security (TLS) 1.2 DataSync จัดการ scripting ของ copy job, การตั้งเวลาและติดตามการโอนย้าย, การตรวจสอบข้อมูล (validating data) และการปรับใช้เครือข่ายให้เหมาะสม (optimizing network usage) โดยอัตโนมัติ

DataSync ถูก deploy เป็น software agent ตัวเดียวที่สามารถเชื่อมต่อกับ shared file system หลายระบบและรันหลาย task ได้ โดยทั่วไป software agent จะถูก deploy แบบ on-premises ผ่าน virtual machine เพื่อจัดการการโอนย้ายข้อมูลผ่าน wide area network (WAN) ไปยัง AWS ฝั่ง AWS agent จะเชื่อมต่อกับ DataSync service infrastructure เนื่องจาก DataSync เป็นบริการ (service) ลูกค้าจึงไม่ต้องตั้งค่าหรือดูแล infrastructure บนคลาวด์เอง การกำหนดค่า DataSync จัดการได้โดยตรงจาก console

## AWS Snow Family

**AWS Snow Family** เป็นกลุ่มอุปกรณ์ทางกายภาพที่ช่วยย้ายข้อมูลปริมาณมากเข้า/ออกจากคลาวด์โดยไม่ต้องพึ่งเครือข่าย ช่วยให้นำบริการ AWS หลากหลายด้าน analytics, file systems และ archive มาใช้กับข้อมูลได้

- **AWS Snowball Edge**: เป็นตัวเลือกขนส่งข้อมูลระดับ petabyte ที่ไม่ต้องเขียนโค้ดหรือซื้อฮาร์ดแวร์เพื่อโอนย้ายข้อมูล เพียงสร้าง job ใน console แล้วอุปกรณ์ Snowball จะถูกจัดส่งมาให้ เชื่อมต่ออุปกรณ์เข้ากับเครือข่ายท้องถิ่นแล้วโอนย้ายไฟล์ลงไปโดยตรง เมื่ออุปกรณ์พร้อมส่งคืน ป้ายจัดส่งแบบ E Ink จะอัปเดตที่อยู่ส่งคืนให้อัตโนมัติ เพื่อให้อุปกรณ์ถูกส่งไปยัง AWS facility ที่ถูกต้อง
  - **Snowball Edge Optimized** เหมาะกับงานประเภท edge processing ที่ต้องการพลังประมวลผล หน่วยความจำ และพื้นที่จัดเก็บเพิ่มเติม ในสภาพแวดล้อมที่ห่างไกล ไม่มีการเชื่อมต่อ หรือสภาพแวดล้อมที่ทำงานหนัก (remote, disconnected, or harsh environments)
- **AWS Snowmobile**: เป็นตู้คอนเทนเนอร์ขนส่งแบบแข็งแรงทนทาน (ruggedized shipping container) ที่ลากโดยรถบรรทุกกึ่งพ่วง (semi-trailer truck) สามารถโอนย้ายข้อมูลได้ถึง 100 petabytes (PB) ต่อ Snowmobile หนึ่งคัน โดย Snowmobile ใช้การรักษาความปลอดภัยหลายชั้นเพื่อปกป้องข้อมูล

เนื้อหาเรื่อง storage จบเพียงเท่านี้ บทเรียนถัดไปคือ Knowledge Check สั้น ๆ และโมดูลถัดไปจะเจาะลึกเรื่อง database services

## Key terms
- AWS Storage Gateway: บริการเชื่อมต่อ on-premises กับ AWS storage ผ่าน software appliance (S3 File Gateway, FSx File Gateway, Tape Gateway, Volume Gateway)
- AWS DataSync: บริการย้ายข้อมูลปริมาณมากระหว่าง on-premises กับ AWS storage แบบอัตโนมัติ
- AWS Snow Family: กลุ่มอุปกรณ์ทางกายภาพสำหรับย้ายข้อมูลแบบ offline (Snowball Edge, Snowmobile, Snowcone)
- TLS 1.2: โปรโตคอลเข้ารหัสข้อมูลระหว่างส่ง (encryption in transit)
- iSCSI: โปรโตคอลสำหรับเข้าถึง block storage ผ่านเครือข่าย
