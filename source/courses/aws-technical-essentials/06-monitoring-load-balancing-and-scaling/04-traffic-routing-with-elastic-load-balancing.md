# Traffic Routing with Elastic Load Balancing

**Elastic Load Balancing (ELB)** เป็นบริการที่กระจาย incoming application traffic ไปยัง EC2 instances, containers, IP addresses และ Lambda functions ได้ ELB จะอยู่ตรงกลาง (ในเส้นทาง) ของ traffic โดยตรง — request จาก client browser จะไปยัง load balancer ก่อน แล้ว load balancer จะตัดสินใจว่าจะส่งไปยัง EC2 instance ตัวไหน จากนั้น return traffic ก็จะกลับผ่าน load balancer ไปยัง client เช่นกัน

## ELB features

ข้อดีหลักของการใช้ ELB แทนการติดตั้ง load balancing software เองบน EC2 คือไม่ต้องจัดการหรือดูแล ELB เอง:

- **Hybrid mode** — เนื่องจาก ELB สามารถ load balance ไปยัง IP address ได้ จึงทำงานในโหมด hybrid ได้ด้วย (load balance ไปยัง on-premises server ได้)
- **High availability** — ELB มีความพร้อมใช้งานสูงในตัวเอง สิ่งที่ต้องทำเองคือให้แน่ใจว่า target ของ load balancer กระจายอยู่หลาย Availability Zone
- **Scalability** — ELB scale อัตโนมัติตามปริมาณ traffic ที่เข้ามา

## Health checks

Monitoring เป็นส่วนสำคัญของ load balancer เพราะควรส่ง traffic ไปยัง EC2 instance ที่ healthy เท่านั้น ELB รองรับ health check 2 แบบ:
- เชื่อมต่อกับ backend EC2 instance ผ่าน TCP แล้วถือว่า instance พร้อมใช้งานถ้าเชื่อมต่อสำเร็จ
- ส่ง HTTP/HTTPS request ไปยังหน้าเว็บที่กำหนด แล้วตรวจสอบ HTTP response code ที่ได้กลับมา

การกำหนด health check ที่เหมาะสมสำคัญมาก การตรวจแค่ว่า port เปิดอยู่ไม่ได้แปลว่าแอปพลิเคชันทำงานถูกต้อง และการเรียกหน้า home page ก็ไม่ใช่วิธีที่ถูกต้องเสมอไป เช่น Employee Directory Application พึ่งพา database และ Amazon S3 — health check ควร validate องค์ประกอบทั้งหมด เช่นสร้างหน้า monitoring page อย่าง `/monitor` ที่เรียก database และ S3 เพื่อยืนยันว่าเชื่อมต่อและดึงข้อมูลได้ แล้วชี้ health check ของ load balancer ไปที่หน้านั้น

หากพบว่า EC2 instance ตัวใดไม่ทำงานแล้ว load balancer จะหยุดส่ง traffic ไปยัง instance นั้นและแจ้งไปยัง **Amazon EC2 Auto Scaling** ซึ่งมีหน้าที่ลบ instance นั้นออกจากกลุ่มและแทนที่ด้วย instance ใหม่ (traffic จะถูกส่งไปยัง instance ใหม่ก็ต่อเมื่อผ่าน health check เท่านั้น) และเมื่อจะยกเลิก instance ใด ๆ ระบบจะรอจนกว่าการเชื่อมต่อทั้งหมดไปยัง instance นั้นจะสิ้นสุดก่อน (ไม่รับ connection ใหม่ระหว่างนั้น) เรียกฟีเจอร์นี้ว่า **connection draining**

## ELB components (hotspot 3 จุด)

ELB ประกอบด้วย 3 ส่วนหลัก:
- **Listener**: จุดที่ client เชื่อมต่อเข้ามา (client side) ต้องกำหนด port และ protocol เช่น เว็บทราฟฟิกที่ใช้ port 80 กับ HTTP โดย load balancer หนึ่งตัวมีได้หลาย listener
- **Rule**: ใช้เชื่อม target group เข้ากับ listener ประกอบด้วย 2 เงื่อนไข: source IP ของ client และเงื่อนไขว่าจะส่ง traffic ไปยัง target group ไหน แต่ละ listener มี default rule และสามารถกำหนด rule เพิ่มเติมได้ (เช่นถ้า traffic เข้ามาที่ `/info` ให้ส่งไปยัง target group B)
- **Target group**: กำหนด backend server (server side) ว่าจะส่ง traffic ไปยังประเภทใด เช่น EC2 instances, Lambda functions, หรือ IP addresses ต้องกำหนด health check สำหรับแต่ละ target group ด้วย

## ประเภทของ Load Balancer

### Application Load Balancer (ALB)
ทำงานที่ **Layer 7** ของ OSI model เหมาะสำหรับ load balance HTTP/HTTPS traffic เมื่อได้รับ request จะประเมิน listener rule ตามลำดับความสำคัญ (priority) แล้วส่ง traffic ไปยัง target ตามเนื้อหาของ request คุณสมบัติหลัก (accordion 6 หมวด):

1. **Routes traffic based on request data** — ตัดสินใจ routing จาก protocol HTTP/HTTPS เช่น URL path (`/upload`), host, HTTP header/method, หรือ source IP ของ client เพื่อ routing แบบละเอียด
2. **Sends responses directly to the client** — ตอบกลับ client โดยตรงด้วย fixed response เช่น custom HTML page หรือส่ง redirect (เช่น redirect จาก HTTP ไป HTTPS) ช่วยลดภาระ backend server
3. **Uses TLS offloading** — เข้าใจ HTTPS traffic โดยต้องมี SSL certificate (import ผ่าน IAM/ACM หรือสร้างฟรีผ่าน ACM) เพื่อให้ traffic ระหว่าง client กับ ALB เข้ารหัส
4. **Authenticates users** — ยืนยันตัวตนผู้ใช้ก่อนผ่าน load balancer ได้ ผ่าน protocol OpenID Connect (OIDC) และ integrate กับบริการอื่นที่รองรับ SAML, LDAP, Microsoft Active Directory และอื่น ๆ
5. **Secures traffic** — กำหนด security group เพื่อระบุช่วง IP address ที่รองรับ ป้องกันไม่ให้ traffic ที่ไม่ได้รับอนุญาตเข้าถึง load balancer
6. **Supports sticky sessions** — ถ้าแอปพลิเคชันเป็น stateful และต้องการให้ request ถูกส่งไปยัง backend server เดิม ใช้ฟีเจอร์ sticky session ซึ่งใช้ HTTP cookie จำว่าจะส่ง traffic ไปยัง server ใด

### Network Load Balancer (NLB)
เหมาะสำหรับ load balance TCP/UDP traffic ทำงานที่ **Layer 4** ของ OSI model routing connection ไปยัง target ใน target group ตาม IP protocol data คุณสมบัติหลัก (flashcard):
- **Sticky sessions** — ส่ง request จาก client เดิมไปยัง target เดิม
- **Low latency** — latency ต่ำ เหมาะกับแอปที่ sensitive ต่อ latency
- **Source IP address** — รักษา source IP address ฝั่ง client ไว้
- **Static IP support** — ให้ static IP address อัตโนมัติต่อ Availability Zone (subnet)
- **Elastic IP address support** — ให้ผู้ใช้กำหนด custom fixed IP address ต่อ Availability Zone (subnet) ได้
- **DNS failover** — ใช้ Amazon Route 53 เพื่อ direct traffic ไปยัง load balancer node ใน zone อื่นเมื่อจำเป็น

### Gateway Load Balancer (GLB)
ช่วย deploy, scale, และจัดการ third-party appliances เช่น firewall, intrusion detection/prevention systems, deep packet inspection systems ให้ gateway สำหรับกระจาย traffic ไปยัง virtual appliance หลายตัวพร้อม scale ขึ้นลงตามความต้องการ คุณสมบัติหลัก (flashcard):
- **High availability** — ให้ความพร้อมใช้งานและความน่าเชื่อถือสูงโดย routing traffic ผ่าน virtual appliance ที่ healthy
- **Monitoring** — monitor ได้ผ่าน CloudWatch metrics
- **Streamlined deployments** — (ระบุในบทเรียน แต่รายละเอียดเพิ่มเติมไม่ปรากฏชัดในเนื้อหา)
- **Private connectivity** — เชื่อมต่อ internet gateway, VPC และ network resource อื่น ๆ ผ่าน private network

## เปรียบเทียบ ELB แต่ละประเภท

| Feature | ALB | NLB | GLB |
|---|---|---|---|
| Load Balancer Type | Layer 7 | Layer 4 | Layer 3 gateway + Layer 4 load balancing |
| Target Type | IP, instance, Lambda | IP, instance, ALB | IP, instance |
| Protocol Listeners | HTTP, HTTPS | TCP, UDP, TLS | IP |
| Static IP / Elastic IP Address | – | Yes | – |
| Preserve Source IP Address | – | Yes | Yes |
| Fixed Response | Yes | – | – |
| User Authentication | Yes | – | – |

(สำหรับ Employee Directory Application ในบทเรียนใช้ **Application Load Balancer** เพราะเป็น web traffic โดย listener ฟังที่ port 80 ด้วย HTTP protocol และตั้งค่า security group ให้อนุญาต traffic port 80 จากทุกที่ พร้อมสร้าง target group สำหรับ EC2 instance ทั้งสองตัวใน 2 Availability Zone)

## Resources (แหล่งข้อมูลเพิ่มเติมที่ระบุในบทเรียน)

- AWS website: Elastic Load Balancing features
- AWS website: AWS Certificate Manager
- AWS documentation: Authenticate users using an Application Load Balancer
- AWS developer guide: How AWS WAF works
- AWS blog: Introducing AWS Gateway Load Balancer

## Key terms
- Elastic Load Balancing (ELB): บริการกระจาย traffic ไปยัง EC2, container, IP address, Lambda function
- Health check: กลไกตรวจสอบว่า target/instance พร้อมรับ traffic หรือไม่
- Connection draining: การรอให้ connection ที่มีอยู่จบก่อน terminate instance โดยไม่รับ connection ใหม่
- Listener / Rule / Target group: 3 ส่วนประกอบหลักของ ELB
- Application Load Balancer (ALB): load balancer ที่ทำงานที่ Layer 7 สำหรับ HTTP/HTTPS
- Network Load Balancer (NLB): load balancer ที่ทำงานที่ Layer 4 สำหรับ TCP/UDP/TLS
- Gateway Load Balancer (GLB): load balancer สำหรับ third-party virtual appliance ที่ Layer 3/4
- Sticky sessions: ฟีเจอร์ที่ส่ง request จาก client เดิมไปยัง backend server เดิมเสมอ
