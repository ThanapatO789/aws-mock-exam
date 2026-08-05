# Performance Efficiency — Design Principles

## Performance Efficiency Design Principles (1.6)
สไลด์เกริ่นนำเข้าสู่หัวข้อ **design principles** ของ performance efficiency pillar

## Performance efficiency design principles (1.7)
มี design principles ทั้งหมด **5 ข้อ** สำหรับ performance efficiency บน cloud:

1. **Democratize advanced technologies** (ทำให้เทคโนโลยีขั้นสูงเข้าถึงได้ง่ายขึ้น)
   ทำให้ทีมของคุณ implement เทคโนโลยีขั้นสูงได้ง่ายขึ้น โดยมอบหมายงานที่ซับซ้อนให้ cloud vendor แทนที่จะให้ทีม IT ของคุณต้อง host เทคโนโลยีใหม่เอง ให้พิจารณาใช้เป็น service แทน ในระบบ cloud เทคโนโลยีที่ปกติต้องใช้ผู้เชี่ยวชาญเฉพาะทาง เช่น machine learning และ NoSQL databases จะกลายเป็น services ที่ทีมสามารถใช้งานได้เลย ทำให้มีเวลาโฟกัสกับการพัฒนา product มากขึ้นแทนที่จะเสียเวลาไปกับการ provision และจัดการ resources

2. **Go global in minutes** (ขยายสู่ระดับโลกได้ในไม่กี่นาที)
   การ deploy ไปยังหลาย Regions ช่วยให้ workload อยู่ใกล้กับผู้ใช้งานทั่วโลกมากขึ้น ส่งผลให้ latency ต่ำลงและประสบการณ์ใช้งานดีขึ้น เช่น การใช้ **AWS CloudFormation** ช่วยให้สามารถสร้าง resources ในภูมิภาคต่าง ๆ ได้อย่างรวดเร็วโดยมี overhead น้อย

3. **Use serverless architectures** (ใช้สถาปัตยกรรมแบบ serverless)
   Serverless architectures ช่วยขจัดภาระในการดำเนินงานและจัดการ physical servers ทำให้ได้ประโยชน์จากต้นทุนธุรกรรม (transactional costs) ที่ต่ำลง เนื่องจาก managed services ทำงานในระดับ cloud scale

4. **Experiment more often** (ทดลองบ่อยขึ้น)
   ด้วย resources ที่แทบไม่จำกัดบน cloud คุณสามารถเปรียบเทียบ configurations ของ workload ได้อย่างรวดเร็ว ไม่ว่าจะเป็นการทดลองเปลี่ยนขนาด instance หรือประเภทของ storage หรือแม้แต่การลองใช้ service ที่ต่างออกไปโดยสิ้นเชิง เช่น การรันโค้ดบน **AWS Lambda** แทนการรันบน **Amazon EC2** instance

5. **Consider mechanical sympathy** (คำนึงถึง mechanical sympathy)
   จัดแนวทางเทคโนโลยี (technology approach) ให้สอดคล้องกับเป้าหมายทางธุรกิจโดยรวม ไม่ใช่ในทางกลับกัน สิ่งสำคัญคือต้องเข้าใจว่า cloud services ถูกใช้งานอย่างไร และเลือกแนวทางเทคโนโลยีที่สอดคล้องกับเป้าหมายของ workload มากที่สุด เช่น ควรพิจารณา data access patterns เสมอเมื่อเลือก database หรือ storage approach

## Key terms
- Design principle: หลักการออกแบบระดับสูงที่เป็นแนวทางสำหรับสถาปัตยกรรมของ workload ในแต่ละ pillar
- Serverless: สถาปัตยกรรมที่ผู้ใช้ไม่ต้องจัดการ server เอง โดย cloud provider จัดการ infrastructure ให้
- Mechanical sympathy: การเข้าใจกลไกการทำงานเบื้องหลังของเทคโนโลยี เพื่อเลือกใช้งานให้สอดคล้องและมีประสิทธิภาพสูงสุด
