# Database and Network Architecture Selection

## Database architecture selection (1.14)
การเลือก database solution และฟีเจอร์ที่ผิดพลาดสำหรับระบบสามารถลดประสิทธิภาพ (performance efficiency) ลงได้ ดังนั้นเมื่อตัดสินใจเลือก database solution ที่เหมาะสม จึงควรพิจารณา requirements เช่น availability, consistency, partition tolerance, latency, durability, scalability และ query capability

แนวปฏิบัติที่ดีมีดังนี้:

- **Understand data characteristics** — เลือก database ที่รับประกันได้ว่าคุณลักษณะด้าน querying, scaling และ storage ตอบโจทย์ data requirements ของ workload เรียนรู้ว่าตัวเลือก database ตรงกับ data models อย่างไร และ configuration option ใดเหมาะกับกรณีใช้งานที่สุด
- **Evaluate the available options** — ทำความเข้าใจตัวเลือก database ที่มีอยู่ และตัวเลือกเหล่านั้นช่วย optimize ประสิทธิภาพอย่างไรก่อนเลือก data management solution ใช้ load testing เพื่อระบุ database metrics ที่สำคัญต่อ workload พิจารณาตัวเลือกต่าง ๆ เช่น parameter groups, storage, memory, compute, read replica, eventual consistency, connection pooling และ caching
- **Collect and record database performance metrics** — เก็บและบันทึก metrics เพื่อเข้าใจว่าระบบจัดการข้อมูลทำงานอย่างไร ใช้ metrics เหล่านี้ optimize resources ให้ตรงตาม workload requirements และมองเห็นภาพรวมประสิทธิภาพ ใช้ tools, libraries และระบบที่บันทึกค่า performance ของ database
- **Choose data storage based on access patterns** — ใช้ access patterns ของ workload และ requirements ของ applications ตัดสินใจเลือก data services และเทคโนโลยีที่เหมาะสม
- **Optimize data storage based on access patterns and metrics** — ใช้ performance characteristics และ access patterns เพื่อ optimize วิธีจัดเก็บหรือ query ข้อมูลให้ได้ประสิทธิภาพสูงสุด วัดผลว่าการ optimize เช่น indexing, key distribution, data warehouse design หรือ caching strategies ส่งผลต่อประสิทธิภาพหรือความคุ้มค่าโดยรวมอย่างไร

## Network architecture selection (1.15)
การเลือกสถาปัตยกรรม network มีผลกระทบอย่างมาก (ทั้งด้านบวกและลบ) ต่อประสิทธิภาพและพฤติกรรมของ workload เพราะ network เชื่อมโยงทุก component ของ workload เข้าด้วยกัน บาง workload พึ่งพา network performance สูงมาก เช่น high-performance computing (HPC) ซึ่งต้องเข้าใจ network อย่างลึกซึ้งเพื่อเพิ่มประสิทธิภาพ นอกจาก workload performance แล้ว ประสบการณ์ผู้ใช้ยังได้รับผลกระทบจาก network latency, bandwidth, protocols, location, network congestion, jitter, throughput และ routing rules ด้วย

แนวปฏิบัติที่ดีมีดังนี้:

- **Understand how networking impacts performance** — เข้าใจว่า network ส่งผลต่อประสิทธิภาพของ workload และประสบการณ์ผู้ใช้อย่างไร
- **Evaluate available networking features** — ประเมินฟีเจอร์ระดับ network บน cloud ที่อาจเพิ่มประสิทธิภาพได้ โดยวัดผลกระทบผ่านการทดสอบ metrics และการวิเคราะห์ เช่น ใช้ฟีเจอร์ระดับ network ที่มีอยู่เพื่อลด latency, network distance หรือ jitter
- **Choose appropriately sized dedicated connectivity or VPN for hybrid workloads** — เมื่อจำเป็นต้องเชื่อมต่อ on-premises กับ cloud resources บน AWS ต้องมี bandwidth เพียงพอสำหรับ performance requirements โดยประเมิน bandwidth และ latency requirements ของ hybrid workload เพื่อกำหนดขนาดของ connectivity options
- **Leverage load-balancing and encryption offloading** — Load balancer ช่วยให้ resources เป้าหมายมีประสิทธิภาพสูงสุดและปรับปรุง responsiveness ของระบบ ควรประเมิน performance requirements แล้วเลือก network protocols ที่ optimize ประสิทธิภาพโดยรวม (มีความสัมพันธ์ระหว่าง latency และ bandwidth ที่ส่งผลต่อ throughput เช่น การโอนไฟล์ผ่าน TCP ที่ latency สูงจะลด throughput ลง สามารถแก้ไขได้ด้วย TCP tuning หรือ optimized transfer protocols เช่น UDP หรือ Scalable Reliable Datagram (SRD) ซึ่งต่างจาก TCP ตรงที่ SRD สามารถส่ง packet แบบไม่เรียงลำดับ (out-of-order) ผ่านหลายเส้นทางพร้อมกันเพื่อเพิ่ม throughput)
- **Choose network protocols to improve performance** — เลือก network protocol ที่เหมาะกับความต้องการด้านประสิทธิภาพ
- **Choose your workload's location based on network requirements** — ประเมินตัวเลือกตำแหน่ง resource เพื่อลด network latency และเพิ่ม throughput ให้ประสบการณ์ผู้ใช้ที่ดีที่สุด ลดเวลาโหลดหน้าเว็บและเวลาถ่ายโอนข้อมูล
- **Optimize network configuration based on metrics** — Network configuration ที่ไม่เหมาะสมส่งผลต่อประสิทธิภาพ ความคุ้มค่า และต้นทุน โดยทั่วไปในช่วง deploy ระยะแรกมักไม่ได้พิจารณาเรื่อง network performance อย่างเต็มที่ การจะ optimize network configuration ได้ ต้องมีข้อมูลและการมองเห็น (visibility) เกี่ยวกับ network environment ก่อน โดยเก็บและวิเคราะห์ข้อมูลเพื่อประกอบการตัดสินใจปรับปรุง configuration และวัดผลกระทบของการเปลี่ยนแปลงเพื่อใช้ตัดสินใจในอนาคต

## Key terms
- HPC (High-Performance Computing): การประมวลผลสมรรถนะสูงที่ต้องพึ่งพา network performance อย่างมาก
- Jitter: ความแปรปรวนของ latency ในการส่งข้อมูลผ่าน network
- SRD (Scalable Reliable Datagram): protocol ของ AWS ที่ส่งข้อมูลแบบขนานผ่านหลายเส้นทางเพื่อเพิ่ม throughput
