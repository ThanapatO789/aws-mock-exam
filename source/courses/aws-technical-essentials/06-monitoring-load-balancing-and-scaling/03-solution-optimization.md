# Solution Optimization

ออกแบบระบบให้ไม่มี single point of failure โดยใช้ automated monitoring, failure detection, และ failover mechanisms การตั้ง alarm เพื่อแจ้งเตือนเมื่อมีปัญหา capacity, performance หรือ availability เป็นจุดเริ่มต้น แต่เป้าหมายต่อไปคือการ **ป้องกัน** หรือ **ตอบสนองอัตโนมัติ** ต่อปัญหาเหล่านั้น

โครงสร้างเดิมของ Employee Directory Application: EC2 instance หนึ่งตัวใน Availability Zone เดียว, DynamoDB เป็นฐานข้อมูล, S3 สำหรับเก็บ static asset แม้ DynamoDB และ S3 จะ highly available แต่ถ้า EC2 instance เดียวใช้งานไม่ได้ ลูกค้าก็เชื่อมต่อแอปไม่ได้ — **EC2 instance ตัวเดียวคือ single point of failure ของแอปพลิเคชัน**

## Availability

Availability ของระบบมักแสดงเป็นเปอร์เซ็นต์ uptime ต่อปี หรือจำนวน "nines":

| Availability (%) | Downtime ต่อปี |
|---|---|
| 90% (หนึ่งเลขเก้า) | 36.53 วัน |
| 99% (สองเลขเก้า) | 3.65 วัน |
| 99.9% (สามเลขเก้า) | 8.77 ชั่วโมง |
| 99.95% (สามเลขเก้าครึ่ง) | 4.38 ชั่วโมง |
| 99.99% (สี่เลขเก้า) | 52.60 นาที |
| 99.995% (สี่เลขเก้าครึ่ง) | 26.30 นาที |
| 99.999% (ห้าเลขเก้า) | 5.26 นาที |

การเพิ่ม availability มักหมายถึงต้องมี infrastructure ซ้ำซ้อน (redundancy) มากขึ้น เช่น data center, server, database และการ replicate ข้อมูลมากขึ้น ซึ่งหมายถึงต้นทุนที่สูงขึ้น ลูกค้าต้องการให้แอปพลิเคชันพร้อมใช้งานเสมอ แต่ต้องหาจุดสมดุลที่การเพิ่ม redundancy ไม่คุ้มค่าในแง่รายได้อีกต่อไป

## เพิ่ม Availability ด้วยการเพิ่ม Availability Zone ที่สอง

ตำแหน่งทางกายภาพของ server สำคัญ นอกจากปัญหาระดับ OS/application แล้วต้องพิจารณาปัญหาด้าน hardware ด้วย (physical server, rack, data center, หรือแม้แต่ Availability Zone ที่ virtual machine อยู่) วิธีแก้คือ deploy EC2 instance ตัวที่สองใน Availability Zone ที่สอง ซึ่งช่วยแก้ปัญหาระดับ OS และ application ได้ด้วย

การมี instance มากกว่าหนึ่งตัวสร้างความท้าทายใหม่:

- **Replication process** — ต้องสร้างกระบวนการ replicate configuration file, software patch, และแอปพลิเคชันข้าม instance โดยควร automate ให้มากที่สุด
- **Customer redirection** — ต้องแจ้ง client ว่ามี server หลายตัว วิธีที่นิยมคือใช้ **DNS** ที่ record หนึ่งชี้ไปยัง IP ของ server ที่พร้อมใช้งานทั้งหมด แต่วิธีนี้ไม่เหมาะเสมอไปเพราะปัญหาเรื่อง propagation (เวลาที่การเปลี่ยนแปลง DNS จะกระจายไปทั่วอินเทอร์เน็ต) อีกทางเลือกคือใช้ **load balancer** ซึ่งทำ health check และกระจาย load ไปยังแต่ละ server อยู่ระหว่าง client กับ server จึงหลีกเลี่ยงปัญหาเรื่อง propagation time ได้ (รายละเอียดเพิ่มเติมในบทถัดไป)
- **Types of high availability** — ต้องเลือกระหว่าง active-passive หรือ active-active

### Active-passive systems
มีเพียง instance เดียวจากสองตัวที่ให้บริการในเวลาหนึ่ง ข้อดีคือเหมาะกับแอปพลิเคชันแบบ stateful (ข้อมูล session ของ client ถูกเก็บที่ server) เพราะลูกค้าจะถูกส่งไปยัง server ที่เก็บ session ของตนเองเสมอ

### Active-active systems
ข้อเสียของ active-passive คือเรื่อง scalability ซึ่ง active-active แก้ปัญหานี้ได้ดีกว่า เพราะทั้งสอง server พร้อมใช้งาน server ตัวที่สองสามารถรับ load ได้ ทำให้ทั้งระบบรับ load ได้มากขึ้น แต่ถ้าแอปพลิเคชันเป็น stateful จะมีปัญหาถ้า session ของลูกค้าไม่พร้อมใช้งานบนทั้งสอง server — แอปพลิเคชันแบบ **stateless** เหมาะกับ active-active system มากกว่า

## Scaling: Vertical vs Horizontal

เมื่อความต้องการเพิ่มขึ้น (เช่นบริษัทเติบโตเร็ว มีพนักงานหลายพันคนเข้าถึงแอปพร้อมกัน) สามารถ scale ได้สองแบบ:
- **Vertical scaling** — เพิ่มขนาดของ instance ที่มีอยู่ แต่จะมีขีดจำกัดบนของ scalability ในที่สุด
- **Horizontal scaling** — เพิ่มจำนวน instance เข้าไปในกลุ่ม (fleet) ไม่มีข้อจำกัดแบบเดียวกับ vertical scaling สามารถเพิ่ม instance ได้ตามต้องการ (แต่ถ้าทำ manual ต้อง launch/shutdown เองซึ่งไม่ efficient — ควร automate การ scale ซึ่งจะกล่าวถึงในบทถัดไปเรื่อง EC2 Auto Scaling)

เมื่อมี server หลายตัวรับ request ควรใช้ **load balancer** เพื่อกระจาย request ไปยังกลุ่ม resource แทน และเมื่อเชื่อมต่อผ่าน load balancer แล้วก็ไม่จำเป็นต้องใช้ public IP ของแต่ละ EC2 instance โดยตรงอีกต่อไป

## Resources (แหล่งข้อมูลเพิ่มเติมที่ระบุในบทเรียน)

- AWS whitepaper: High availability and scalability on AWS
- AWS documentation: Reliability Pillar – AWS Well-Architected Framework
- AWS website: Amazon EC2 Auto Scaling

## Key terms
- Single point of failure: จุดเดียวในระบบที่ถ้าล้มเหลวจะทำให้ทั้งระบบใช้งานไม่ได้
- Availability: สัดส่วนเวลาที่ระบบพร้อมใช้งาน มักแสดงเป็น "nines" เช่น 99.99%
- Active-passive / Active-active: รูปแบบการทำงานร่วมกันของ server สำรองสองตัวขึ้นไป
- Vertical scaling: เพิ่มขนาด (spec) ของ instance เดิม
- Horizontal scaling: เพิ่มจำนวน instance ในกลุ่ม
- Load balancer: อุปกรณ์/บริการที่กระจาย request ไปยังหลาย server พร้อมทำ health check
