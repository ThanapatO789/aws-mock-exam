# Module 4 Knowledge Check

แบบทดสอบท้ายบท Module 4 มีทั้งหมด 3 ข้อ (ตอบและ submit จริงในเบราว์เซอร์ ยืนยันคำตอบที่ถูกต้องแล้ว)

## Question 1

**Which of the following is a typical use case for Amazon S3?**
(ข้อใดต่อไปนี้เป็น use case ทั่วไปของ Amazon S3)

- **Object storage for media hosting** ✅ (ถูกต้อง — ยืนยันจากการ submit จริง)
- Object storage for a boot drive
- Block storage for an Amazon EC2 instance
- File storage for multiple Amazon EC2 instances

**คำอธิบาย:** Amazon S3 เป็น object storage service ที่ออกแบบมาสำหรับไฟล์ขนาดใหญ่ เช่น media file เนื่องจากสามารถเก็บ object ได้ไม่จำกัดจำนวน และแต่ละ object มีขนาดได้สูงสุดถึง 5 TB ทำให้ Amazon S3 เป็นบริการที่เหมาะสำหรับ host video, photo, และ music

## Question 2

**A company that works with customers around the globe in multiple Regions hosts a static website in an Amazon S3 bucket. The company has decided that they want to reduce latency and increase data transfer speed by storing cache. Which solution should they choose to make their content more accessible?**
(บริษัทที่มีลูกค้าทั่วโลกในหลาย Region host เว็บไซต์ static บน Amazon S3 bucket ต้องการลด latency และเพิ่มความเร็วในการส่งข้อมูลด้วยการเก็บ cache ควรเลือกโซลูชันใดเพื่อให้เข้าถึงเนื้อหาได้ง่ายขึ้น)

- **Configure Amazon CloudFront to deliver the content in the S3 bucket.** ✅ (ถูกต้อง — ยืนยันจากการ submit จริง)
- Create multiple S3 buckets and put Amazon EC2 and Amazon S3 in the same AWS Region.
- Enable cross-Region replication to several AWS Regions to serve customers from different locations.
- Use S3 Intelligent-Tiering to automatically move their website to a bucket that would reduce their latency.

**คำอธิบาย:** Amazon CloudFront สามารถเก็บเนื้อหาที่ถูกเข้าถึงบ่อยไว้เป็น cache ทำให้ performance ถูก optimize

## Question 3

**Which of the following storage services is recommended if a customer needs a storage layer for a high-transaction relational database on an Amazon EC2 instance?**
(บริการ storage ใดที่แนะนำ หากลูกค้าต้องการ storage layer สำหรับ relational database ที่มี transaction สูงบน Amazon EC2 instance)

- Amazon S3
- Amazon Elastic File System (Amazon EFS)
- **Amazon Elastic Block Store (Amazon EBS)** ✅ (ถูกต้อง — ยืนยันจากการ submit จริง)
- Amazon S3 Glacier Deep Archive

**คำอธิบาย:** Amazon EBS เหมาะที่สุดสำหรับ storage layer ของ database ที่มี transaction สูง ส่วน Amazon S3 เหมาะสำหรับ write once, read many (WORM) storage, Amazon EFS เหมาะเมื่อมีหลาย server ที่ต้องเข้าถึงชุดไฟล์เดียวกันร่วมกัน และ Amazon S3 Glacier Deep Archive ไม่ใช่ storage service แต่เป็น storage class ของ Amazon S3

## Key terms
- Amazon CloudFront: บริการ CDN ของ AWS ที่ cache เนื้อหาไว้ใกล้ผู้ใช้เพื่อลด latency
- WORM (write once, read many): รูปแบบการเก็บข้อมูลที่เขียนครั้งเดียวแต่อ่านได้หลายครั้ง เหมาะกับ Amazon S3
