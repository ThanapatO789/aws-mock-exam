# Amazon CloudFront

บทเรียนนี้สอนวิธีใช้ **Amazon CloudFront** เพื่อลด data latency ในแอปพลิเคชัน

## Content delivery networks

การ replicate infrastructure ทั้งหมดไปทั่วโลกเมื่อ web traffic กระจายตามภูมิศาสตร์ (geo-dispersed) ไม่สามารถทำได้เสมอไป และก็ไม่คุ้มค่าใช้จ่ายด้วย เมื่อใช้ content delivery network (CDN) จะสามารถใช้เครือข่าย edge location ทั่วโลกของมันเพื่อส่งมอบสำเนา (cached copy) ของ web content ไปยังลูกค้าได้

เพื่อลดเวลาตอบสนอง (response time) CDN จะใช้ edge location ที่ใกล้ที่สุดกับลูกค้าหรือตำแหน่งที่มาของ request การใช้ edge location ที่ใกล้ที่สุดช่วยเพิ่ม throughput อย่างมาก เพราะ web asset ถูกส่งมอบจาก cache สำหรับข้อมูลแบบ dynamic สามารถกำหนดค่า CDN จำนวนมากให้ดึงข้อมูลจาก origin server ได้

**Amazon CloudFront** เป็นบริการ CDN ระดับ global ที่เร่งการส่งมอบเว็บไซต์ ก่อนใช้งาน CloudFront ต้องกำหนด origin ก่อน ซึ่งเป็นที่ที่ CloudFront ไปดึงไฟล์ของคุณมา เช่น S3 bucket หรือ HTTP server ของคุณ ไฟล์เหล่านี้จะถูกกระจายจาก CloudFront edge location ทั่วโลก

จากนั้นจึงสร้าง CloudFront distribution ซึ่งบอกว่า CloudFront ควรดึงไฟล์จาก origin server ใดเมื่อผู้ใช้ร้องขอไฟล์ผ่านเว็บไซต์หรือแอปพลิเคชัน พร้อมทั้งระบุรายละเอียด เช่น ต้องการให้ CloudFront บันทึก log ของทุก request หรือไม่ และต้องการให้ distribution เริ่มทำงานทันทีที่สร้างเสร็จหรือไม่

## Improving performance with CloudFront

Amazon CloudFront เป็น managed service ควรเข้าใจว่า AWS ช่วยอะไรบ้างในการปรับปรุงประสิทธิภาพ และผู้ใช้ก็มีหน้าที่ต้องกำหนดค่า CloudFront เพื่อปรับให้ประสิทธิภาพของแอปพลิเคชันดีที่สุดด้วยเช่นกัน

**สิ่งที่ AWS ทำให้ (What AWS does):**
- **TCP optimization** — CloudFront ใช้ TCP optimization เพื่อสังเกตว่าเครือข่ายส่ง traffic ได้เร็วแค่ไหน และ latency ของ round trip ปัจจุบัน แล้วนำข้อมูลนั้นไปใช้ปรับปรุงประสิทธิภาพโดยอัตโนมัติ
- **TLS 1.3 support** — CloudFront รองรับ TLS 1.3 ซึ่งให้ประสิทธิภาพที่ดีกว่าด้วยกระบวนการ handshake ที่ง่ายกว่าและใช้ round trip น้อยกว่า พร้อมเพิ่มฟีเจอร์ด้านความปลอดภัย
- **Dynamic content placement** — ใช้ CloudFront เพื่อให้บริการ dynamic content เช่น web application หรือ API จาก Elastic Load Balancing (ELB) load balancer หรือ Amazon EC2 instance เพื่อปรับปรุงประสิทธิภาพ ความพร้อมใช้งาน และความปลอดภัยของ content

**สิ่งที่ผู้ใช้ทำได้ (What you can do):**
- **Define your cache strategy** — การเลือก TTL ที่เหมาะสมสำคัญมาก นอกจากนี้ควรพิจารณา caching ตาม query string parameter, cookie หรือ request header
- **Improve your cache hit ratio** — สามารถดูเปอร์เซ็นต์ของ viewer request ที่เป็น hit, miss และ error ได้ใน CloudFront console และปรับปรุง distribution ตามสถิติที่เก็บไว้ใน CloudFront cache statistics report
- **Use Origin Shield** — เพิ่ม layer ของการ cache ระหว่าง regional edge cache กับ origin ไม่จำเป็นต้องเหมาะกับทุก use case แต่มีประโยชน์สำหรับผู้ใช้ที่กระจายตามภูมิภาคต่าง ๆ หรือ on-premises origin ที่มีข้อจำกัดด้าน capacity/bandwidth

Amazon CloudFront มอบการส่งมอบ content ที่มีประสิทธิภาพและ latency ต่ำ บทเรียนถัดไปจะเรียนรู้วิธีป้องกันแอปพลิเคชันจากการโจมตีแบบ distributed denial of service (DDoS)

## Key terms
- CDN (Content Delivery Network): เครือข่าย edge location ที่ใช้กระจาย cached content ไปยังผู้ใช้งาน
- Origin: แหล่งข้อมูลต้นทางที่ CloudFront ดึงไฟล์มา เช่น S3 bucket หรือ HTTP server
- Origin Shield: ชั้น cache เพิ่มเติมระหว่าง regional edge cache กับ origin
