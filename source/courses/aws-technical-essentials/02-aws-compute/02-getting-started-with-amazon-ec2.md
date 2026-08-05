# Getting Started with Amazon EC2

เมื่อออกแบบสถาปัตยกรรมแอปพลิเคชันเพื่อความพร้อมใช้งานสูง (high availability) ควรพิจารณาใช้ EC2 instance อย่างน้อย 2 ตัวใน 2 Availability Zones ที่แยกกัน

## Amazon EC2
**Amazon EC2** เป็นบริการเว็บที่ให้ compute capacity ที่ปลอดภัยและปรับขนาดได้บนคลาวด์ สามารถ provision virtual server ที่เรียกว่า EC2 instance ได้

ด้วย Amazon EC2 คุณสามารถ:
- Provision และ launch EC2 instance หนึ่งตัวหรือมากกว่าได้ภายในไม่กี่นาที
- Stop หรือ shut down EC2 instance เมื่อรัน workload เสร็จแล้ว
- จ่ายเป็นรายชั่วโมงหรือรายวินาทีตาม instance type (ขั้นต่ำ 60 วินาที)

สามารถสร้างและจัดการ EC2 instance ผ่าน AWS Management Console, AWS CLI, AWS SDKs, automation tools และ infrastructure orchestration services

การสร้าง EC2 instance ต้องกำหนด:
- **Hardware specifications**: CPU, memory, network, storage
- **Logical configurations**: ตำแหน่ง networking, กฎ firewall, การยืนยันตัวตน (authentication), และระบบปฏิบัติการที่เลือก

## Amazon Machine Image (AMI)
เมื่อ launch EC2 instance การตั้งค่าแรกที่ต้องกำหนดคือระบบปฏิบัติการ โดยเลือกผ่าน **Amazon Machine Image (AMI)**

ใน infrastructure แบบดั้งเดิม การตั้งค่า server ต้องติดตั้งระบบปฏิบัติการจากแผ่นติดตั้งหรือผ่านเครือข่าย แต่บน AWS Cloud การติดตั้งระบบปฏิบัติการไม่ใช่ความรับผิดชอบของผู้ใช้ แต่ถูกฝังไว้ใน AMI ที่เลือก

AMI ประกอบด้วย: ระบบปฏิบัติการ, storage mapping, ประเภทสถาปัตยกรรม (architecture type), launch permissions และซอฟต์แวร์เพิ่มเติมที่ติดตั้งไว้ล่วงหน้า

### ความสัมพันธ์ระหว่าง AMI กับ EC2 instance
EC2 instance คือการสร้างขึ้นจริง (live instantiation) ของสิ่งที่กำหนดไว้ใน AMI เปรียบเหมือนเค้กที่อบจริงจากสูตรเค้ก (recipe) หรือเปรียบเหมือนความสัมพันธ์ระหว่าง class และ object ในการพัฒนาซอฟต์แวร์ — AMI คือแบบจำลอง (model) ของ instance ส่วน EC2 instance คือสิ่งที่โต้ตอบได้จริง ซึ่งสามารถติดตั้ง web server และให้บริการเนื้อหาแก่ผู้ใช้ได้

เมื่อ launch instance ใหม่ AWS จะจัดสรร virtual machine ที่รันอยู่บน hypervisor จากนั้น AMI ที่เลือกจะถูกคัดลอกไปยัง root device volume ซึ่งบรรจุ image ที่ใช้บูตวอลุ่ม ผลลัพธ์คือ server ที่สามารถเชื่อมต่อและติดตั้งแพ็กเกจหรือซอฟต์แวร์เพิ่มเติมได้ (ตัวอย่างเช่น ติดตั้ง web server พร้อม source code ของ employee directory application)

ข้อดีของ AMI คือสามารถนำกลับมาใช้ซ้ำ (reusable) ได้ เช่น เลือก Linux-based AMI และตั้งค่า HTTP server, application packages ตามต้องการ หากต้องการสร้าง EC2 instance ใหม่ที่มีการตั้งค่าเดียวกัน สามารถสร้าง AMI จาก instance ที่กำลังรันอยู่ แล้วใช้ AMI นั้นเพื่อเริ่ม instance ใหม่ที่มีการตั้งค่าเหมือนเดิมได้

### ประเภทของ AMI (accordion)
- **Quick Start AMIs**: AMI ที่ AWS สร้างไว้และใช้กันทั่วไป เพื่อเริ่มต้นใช้งานได้อย่างรวดเร็ว
- **AWS Marketplace AMIs**: ให้ซอฟต์แวร์โอเพนซอร์สและซอฟต์แวร์เชิงพาณิชย์ยอดนิยมจากผู้ให้บริการรายอื่น (third-party)
- **My AMIs**: AMI ที่สร้างจาก EC2 instance ของผู้ใช้เอง
- **Community AMIs**: AMI ที่จัดทำโดยชุมชนผู้ใช้ AWS
- **Custom image**: สร้าง custom image เองด้วย EC2 Image Builder

## Amazon EC2 instance types
EC2 instance คือการรวมกันของ virtual processors (vCPUs), memory, network และในบางกรณีคือ instance storage และ graphics processing units (GPUs) เมื่อสร้าง EC2 instance ต้องเลือกปริมาณของแต่ละองค์ประกอบเหล่านี้

AWS มี instance หลากหลายที่แตกต่างกันตามประสิทธิภาพ instance type ประกอบด้วย prefix ที่ระบุประเภท workload ที่เหมาะสม ตามด้วยขนาด (size) ตัวอย่างเช่น `c5n.xlarge`:
- **ตำแหน่งแรก (c)**: ระบุ instance family — ในตัวอย่างนี้คือกลุ่ม compute optimized
- **ตำแหน่งที่สอง (5)**: ระบุ generation ของ instance — รุ่นที่ 5
- **ตัวอักษรที่เหลือก่อนจุด (n)**: ระบุคุณสมบัติเพิ่มเติม เช่น local NVMe storage
- **หลังจุด (xlarge)**: ระบุขนาดของ instance

### EC2 instance families (accordion)
| Instance family | Description | ตัวอย่าง Use case |
|---|---|---|
| General purpose | ให้ความสมดุลระหว่าง compute, memory และ networking resources | เหมาะกับแอปพลิเคชันที่ใช้ทรัพยากรเหล่านี้ในสัดส่วนเท่าๆ กัน เช่น web server และ code repository |
| Compute optimized | เหมาะกับแอปพลิเคชันที่ต้องการ compute สูง (compute-bound) ด้วยโปรเซสเซอร์ประสิทธิภาพสูง | batch processing, media transcoding, high performance web server, HPC, scientific modeling, dedicated gaming server, ad server engine, machine learning inference |
| Memory optimized | ออกแบบมาเพื่อประสิทธิภาพสูงสำหรับ workload ที่ประมวลผลชุดข้อมูลขนาดใหญ่ใน memory | high-performance database, distributed web-scale in-memory cache |
| Accelerated computing | ใช้ hardware accelerator หรือ co-processor เพื่อประมวลผลฟังก์ชันบางอย่าง (เช่น floating-point, graphics processing, data pattern matching) ได้มีประสิทธิภาพกว่าใช้ CPU ล้วน | machine learning, HPC, computational fluid dynamics, computational finance, seismic analysis, speech recognition, autonomous vehicles, drug discovery |
| Storage optimized | ออกแบบสำหรับ workload ที่ต้องการ sequential read/write เข้าถึงชุดข้อมูลขนาดใหญ่บน local storage ในระดับสูง ให้ IOPS latency ต่ำจำนวนมาก | NoSQL database (Cassandra, MongoDB, Redis), in-memory database, scale-out transactional database, data warehousing, Elasticsearch, analytics |
| HPC optimized | ออกแบบมาเพื่อให้ price-performance ที่ดีที่สุดสำหรับรัน HPC workload ในระดับ scale บน AWS | แอปพลิเคชันที่ได้ประโยชน์จาก high-performance computing เช่นการจำลองและ deep learning workload |

## EC2 instance locations
เมื่อ launch EC2 instance โดยไม่ระบุ จะถูกวางไว้ใน default virtual private cloud (VPC) ซึ่งเหมาะสำหรับการเริ่มต้นใช้งานอย่างรวดเร็วและ launch public EC2 instance โดยไม่ต้องสร้าง/กำหนดค่า VPC เอง

ทรัพยากรใดๆ ที่วางไว้ใน default VPC จะเป็น public และเข้าถึงได้จากอินเทอร์เน็ต จึงไม่ควรวางข้อมูลลูกค้าหรือข้อมูลสำคัญไว้ในนั้น เมื่อคุ้นเคยกับ networking บน AWS มากขึ้น ควรเปลี่ยนมาใช้ custom VPC ของตนเองและจำกัดการเข้าถึงด้วยกลไก routing และ connectivity เพิ่มเติม

## Architecting for high availability
ในเครือข่าย instance จะอยู่ใน Availability Zone ที่เลือกไว้ บริการ AWS ที่ทำงานในระดับ Availability Zone ต้องออกแบบโดยคำนึงถึง high availability

แม้ EC2 instance โดยทั่วไปจะเชื่อถือได้ แต่การมี 2 ตัวย่อมดีกว่า 1 ตัว และ 3 ตัวย่อมดีกว่า 2 ตัว การกำหนดขนาด instance ให้เหมาะสมช่วยให้ได้เปรียบในการออกแบบสถาปัตยกรรม เพราะสามารถใช้ instance ขนาดเล็กจำนวนมากแทนที่จะใช้ instance ขนาดใหญ่จำนวนน้อย

หาก frontend มี instance เดียวและ instance นั้นล้มเหลว แอปพลิเคชันจะล่มทั้งหมด แต่ถ้า workload กระจายอยู่บน 10 instances และตัวหนึ่งล้มเหลว จะสูญเสียเพียง 10% ของ fleet เท่านั้น โดยความพร้อมใช้งานของแอปพลิเคชันแทบไม่ได้รับผลกระทบ

ดังนั้นเมื่อออกแบบแอปพลิเคชันเพื่อ high availability ควรใช้ EC2 instance อย่างน้อย 2 ตัวใน 2 Availability Zones ที่แยกกัน

## Resources
- AWS website: Amazon EC2
- AWS user guide: Amazon Machine Images

## Key terms
- Amazon EC2: บริการ virtual server ที่ปรับขนาดได้บน AWS
- AMI (Amazon Machine Image): แม่แบบที่กำหนดระบบปฏิบัติการและซอฟต์แวร์สำหรับสร้าง EC2 instance
- Instance type: การกำหนดขนาดและกลุ่มของทรัพยากร (vCPU, memory, network, storage/GPU) ของ EC2 instance
- Instance family: กลุ่มของ instance type ที่ optimize สำหรับ use case ต่างกัน เช่น general purpose, compute optimized, memory optimized, accelerated computing, storage optimized, HPC optimized
- Default VPC: เครือข่ายเสมือนเริ่มต้นที่ AWS สร้างให้ ซึ่งทรัพยากรภายในจะเป็น public โดยค่าเริ่มต้น
- Availability Zone (AZ): พื้นที่แยกต่างหากภายใน Region ที่ใช้ในการออกแบบระบบให้มี high availability
