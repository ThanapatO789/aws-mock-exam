# What Is AWS?

**Cloud computing** คือการให้บริการทรัพยากร IT แบบออนดีมานด์ โดยคิดค่าใช้จ่ายแบบ pay-as-you-go เป็นหลัก

## รูปแบบการ deploy (Cloud computing deployment models)
Cloud computing ช่วยให้ทีมพัฒนาและ IT มุ่งเน้นสิ่งสำคัญได้มากขึ้น โดยไม่ต้องยุ่งกับงาน procurement, maintenance, และ capacity planning มีรูปแบบ deployment หลักๆ ดังนี้

- **On-premises**: ก่อนยุคคลาวด์ องค์กรต้องซื้อและดูแลฮาร์ดแวร์ (compute, storage, networking) ในศูนย์ข้อมูลของตัวเอง มักมีแผนก infrastructure แยกต่างหากดูแล ทำให้ต้นทุนสูงและบางงาน/การทดลองทำไม่ได้เลย
- **Cloud**: การส่งมอบทรัพยากร IT แบบออนดีมานด์ผ่านอินเทอร์เน็ต คิดเงินแบบ pay-as-you-go เป็นหลัก บริษัทไม่ต้องดูแลฮาร์ดแวร์/data center เอง แต่ผู้ให้บริการอย่าง AWS จะดูแลและให้บริการ virtual data center ผ่านอินเทอร์เน็ตแทน
- **Hybrid**: เชื่อมโยง infrastructure และแอปพลิเคชันระหว่างทรัพยากรบนคลาวด์กับทรัพยากรเดิมที่ไม่ได้อยู่บนคลาวด์ วิธีที่พบบ่อยที่สุดคือเชื่อมทรัพยากรคลาวด์เข้ากับระบบ on-premises เพื่อขยาย infrastructure ขององค์กรเข้าสู่คลาวด์

ตัวอย่างเปรียบเทียบ: การสร้าง environment สำหรับทดสอบ (QA) ฟีเจอร์ใหม่ — แบบ on-premises ต้องซื้อและติดตั้งฮาร์ดแวร์ เดินสายไฟ จัดการ power และติดตั้ง OS ซึ่งใช้เวลานานและมีค่าใช้จ่ายสูง ทำให้ time-to-market ของฟีเจอร์ช้าลง ในขณะที่บนคลาวด์สามารถจำลอง production environment ทั้งชุดได้ในไม่กี่นาทีหรือวินาที เพราะทุกอย่างจัดการผ่านอินเทอร์เน็ต

Cloud computing ช่วยลดเวลาและงานซ้ำซ้อนที่ไม่ได้สร้างความแตกต่างให้ธุรกิจ เช่น การติดตั้ง virtual machine (VM) หรือการสำรองข้อมูล เมื่อ AWS รับภาระงานเหล่านี้ไป (เรียกว่า "**removing undifferentiated heavy lifting**") ทีมงานจะสามารถโฟกัสกับสิ่งที่สร้างความแตกต่างเชิงกลยุทธ์ให้ธุรกิจได้จริง

AWS ให้บริการ cloud computing services โดยทรัพยากร IT ที่กล่าวถึงในนิยาม cloud computing ก็คือ **AWS services** นั่นเอง สำหรับแอปพลิเคชัน corporate directory ที่ใช้ตลอดคอร์สนี้ จะใช้ AWS services เพื่อสร้าง infrastructure ที่ scalable, highly available, และ cost-effective เพื่อ host แอปนี้ ทำให้สามารถเปิดตัวแอปได้อย่างรวดเร็วโดยไม่ต้องดูแลฮาร์ดแวร์เอง

## ข้อดี 6 ประการของ Cloud computing (Six advantages of cloud computing)

- **Pay-as-you-go**: โมเดล cloud computing คือจ่ายเฉพาะทรัพยากรที่ใช้จริง ต่างจากโมเดล on-premises ที่ต้องลงทุนใน data center และฮาร์ดแวร์ที่อาจไม่ได้ใช้เต็มที่
- **Benefit from massive economies of scale**: การใช้ cloud computing ทำให้ได้ต้นทุนที่ต่ำกว่าที่ทำเองได้ เพราะการใช้งานจากลูกค้าหลายแสนรายถูกรวมกันบนคลาวด์ ทำให้ AWS ได้ economies of scale ที่สูงขึ้น ซึ่งแปลงเป็นราคา pay-as-you-go ที่ต่ำลง
- **Stop guessing capacity**: ไม่ต้องเดา capacity โครงสร้างพื้นฐานอีกต่อไป เพราะการตัดสินใจเรื่อง capacity ก่อน deploy แอปมักจบลงด้วยการมีทรัพยากรเกินความจำเป็น (idle) หรือขาดแคลน (limited) แต่ cloud computing ทำให้เข้าถึง capacity ได้มากหรือน้อยตามต้องการ และ scale ขึ้น-ลงได้ในไม่กี่นาที
- **Increase speed and agility**: ทรัพยากร IT อยู่แค่ปลายนิ้วคลิก ลดเวลาในการจัดเตรียมทรัพยากรให้นักพัฒนาจากหลักสัปดาห์เหลือหลักนาที ส่งผลให้ความคล่องตัวขององค์กรเพิ่มขึ้นอย่างมาก เพราะต้นทุนและเวลาในการทดลอง/พัฒนาต่ำลงมาก
- **Realize cost savings**: บริษัทสามารถโฟกัสกับโปรเจกต์ที่สร้างความแตกต่างให้ธุรกิจและตัด "undifferentiated heavy lifting" ออกไป แทนที่จะต้องดูแล data center เอง ด้วย cloud computing สามารถโฟกัสที่ลูกค้าแทนที่จะต้อง racking, stacking, และดูแลไฟฟ้าของฮาร์ดแวร์จริง
- **Go global in minutes**: สามารถ deploy แอปพลิเคชันไปยังหลาย Region ทั่วโลกได้ด้วยการคลิกไม่กี่ครั้ง ทำให้ latency ต่ำลงและประสบการณ์ผู้ใช้ดีขึ้นด้วยต้นทุนต่ำ

## Key terms
- Cloud computing: การส่งมอบทรัพยากร IT แบบออนดีมานด์ผ่านอินเทอร์เน็ต คิดเงินแบบ pay-as-you-go
- On-premises: การดูแลฮาร์ดแวร์และ data center เองในองค์กร
- Hybrid deployment: การเชื่อมทรัพยากรคลาวด์เข้ากับ infrastructure เดิมที่ไม่ได้อยู่บนคลาวด์
- Undifferentiated heavy lifting: งานซ้ำซ้อนที่ไม่ได้สร้างความแตกต่างให้ธุรกิจ ซึ่ง AWS ช่วยรับภาระแทน
