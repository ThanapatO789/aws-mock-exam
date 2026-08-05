# Containers

เมื่อสร้างแอปพลิเคชันด้วย microservices คุณต้องแพ็กเกจ microservices ทั้งหมดของแอปพลิเคชันเป็นหน่วยเดียว (logical unit) — Container คือหน่วยบรรจุนั้นสำหรับแพ็กเกจ microservices บทเรียนนี้สอนประโยชน์ของ container และวิธีที่ container ทำงานร่วมกับ microservices

Container เป็นวิธีมาตรฐานในการแพ็กเกจ code, configuration และ dependency ของแอปพลิเคชันไว้เป็น object เดียว container ใช้ operating system ร่วมกันบน server และรันเป็น process ที่แยก (resource-isolated) จากกัน container ถูกออกแบบมาให้ deploy ได้อย่างรวดเร็ว เชื่อถือได้ และสม่ำเสมอไม่ว่าจะรันบน environment ใด

Container มี process isolation ซึ่งหมายความว่าคุณสามารถแยกแอปพลิเคชันออกเป็น component อิสระที่เรียกว่า microservices ได้

## Containers และ microservices

Container เป็นตัวเลือกที่ดีสำหรับ microservice architecture เพราะ scalable, portable และ deploy ได้อย่างต่อเนื่อง (continuously deployable) ด้วย microservice environment คุณสามารถ iterate ได้เร็วขึ้น พร้อมความ resilience, efficiency และ agility ที่มากขึ้น

คุณสามารถ build แต่ละ microservice บน container หนึ่งตัวได้ เพราะแต่ละ microservice เป็น component แยกกัน จึงทนต่อความล้มเหลวได้ดีกว่า หาก container ล่ม สามารถ shut down แล้วสร้าง container ใหม่ขึ้นมาแทนที่ได้อย่างรวดเร็วสำหรับ service นั้น หาก service ใดมี traffic สูง คุณสามารถ scale out container สำหรับ microservice นั้นได้ ซึ่งลดความจำเป็นในการ deploy server เพิ่มเพื่อรองรับทั้งแอปพลิเคชัน

## Levels of abstraction and virtualization

Virtualization สามารถ implement ได้หลายระดับของ abstraction (มี 3 hotspot ให้เลือกดูรายละเอียด):

1. **Bare metal servers** — bare metal server รัน standalone OS ตัวเดียวพร้อมแอปพลิเคชันหนึ่งหรือหลายตัวโดยใช้ library ร่วมกัน ค่าใช้จ่ายคงที่ไม่ว่าจะใช้งาน 0% หรือ 100% การ scale ต้องซื้อและ configure server เพิ่ม และยาก ที่จะ build แอปพลิเคชันให้ทำงานได้บนหลาย server เพราะ OS ของแต่ละ server ต้องเหมือนกัน รวมถึงต้อง sync เวอร์ชันของ library ด้วย
2. **Virtual machines (VMs)** — VM แยก application และ library ด้วย OS เต็มรูปแบบของตัวเอง ข้อเสียคือ virtualization layer นี้ "หนัก" เพราะแต่ละ VM มี OS ของตัวเอง ทำให้ต้องใช้ host CPU และ RAM มากขึ้น ลด efficiency และ performance การมี OS แยกสำหรับแต่ละ VM ยังหมายถึงต้อง patch, update มากขึ้น และใช้พื้นที่บน physical host มากขึ้น
3. **Containers** — ด้วย containerization, container ใช้ OS kernel ของเครื่องร่วมกัน และ OS file system ถูก expose ออกมา การใช้ OS kernel ร่วมกันทำให้แชร์ shared library ได้ แต่ก็อนุญาตให้มี library เฉพาะตามต้องการได้ ทำให้ container portable สูง และสามารถ start/stop ได้เร็วกว่า VM container จึงเบา (lightweight), efficient และรวดเร็ว

## Containers on AWS

การ deploy managed container solution บน AWS เกี่ยวข้องกับการเลือกและ configure 3 องค์ประกอบ: registry, orchestration tool และ container hosting (มี 2 แท็บให้เลือกดู)

**Containers on EC2 instances:** การรัน container บนตัว EC2 instance เป็นแนวทางที่ใช้กันทั่วไป และใช้องค์ประกอบทั้งของ VM deployment และ containerization ร่วมกัน โครงสร้างพื้นฐาน server ประกอบด้วย physical server, hypervisor และ virtual guest OS สองตัว ตัวหนึ่งรัน Docker อีกตัวรันแอปพลิเคชันแยก virtual guest OS ที่มี Docker สามารถ build และรัน container ได้ แม้จะทำได้ แต่การ deploy แบบนี้จะ scale ได้แค่ขนาดของ EC2 instance ที่ใช้อยู่เท่านั้น และคุณต้องจัดการ networking, access และ maintenance ของ container เองอย่างต่อเนื่อง

**Containers with an orchestration tool:** การใช้ orchestration tool เป็น solution ที่ scalable สำหรับรัน container บน AWS โดย orchestration tool ใช้ pool ของ compute resource (ซึ่งอาจมี EC2 instance นับร้อยตัว) เพื่อ host container orchestration tool จะ launch และ shut down container ตามความต้องการที่เปลี่ยนแปลงของแอปพลิเคชัน จัดการ connectivity เข้า-ออก container และช่วยจัดการ deployment และ update ของ container ด้วย

ต่อไปคุณจะขยายความรู้เรื่อง container ด้วยการรีวิว container services

## Key terms
- Container: หน่วยแพ็กเกจมาตรฐานสำหรับ code, configuration และ dependency ที่ใช้ OS kernel ร่วมกันบน host
- Process isolation: การแยก process ของแอปพลิเคชันออกจากกันเพื่อรันเป็น microservice อิสระ
- Bare metal server: server ที่รัน OS เดียวโดยตรงบนฮาร์ดแวร์ ไม่มี virtualization layer
- Virtual machine (VM): เครื่องเสมือนที่มี OS เต็มรูปแบบของตัวเอง แยกด้วย hypervisor
- Docker: เครื่องมือยอดนิยมสำหรับ build และรัน container
- Orchestration tool: เครื่องมือที่จัดการการ launch, scale และ connectivity ของ container จำนวนมากโดยอัตโนมัติ
