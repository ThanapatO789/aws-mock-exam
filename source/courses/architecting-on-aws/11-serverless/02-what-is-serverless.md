# What is Serverless?

การพัฒนาแอปพลิเคชันแบบ serverless เป็นวิธีที่คล่องตัวและยืดหยุ่น ช่วยลดภาระด้าน operations และ optimize ค่าใช้จ่ายของ resource ได้ บทเรียนนี้อธิบายแนวคิดการ architect serverless application

## Serverless คืออะไร

Serverless คือคำที่ใช้อธิบายบริการ แนวปฏิบัติ และกลยุทธ์ต่าง ๆ ที่ช่วยให้สร้างแอปพลิเคชันได้คล่องตัวยิ่งขึ้น ด้วย serverless computing คุณสามารถ innovate และตอบสนองต่อการเปลี่ยนแปลงได้เร็วขึ้น เพราะ AWS จัดการงานด้าน infrastructure management ให้ (เช่น การ provision capacity และการ patch) ทำให้ทีมมุ่งเน้นไปที่การเขียนโค้ดที่ตอบโจทย์ลูกค้าได้เต็มที่

ข้อดีของการใช้ serverless ได้แก่:

- ไม่ต้อง provision หรือจัดการ infrastructure เอง
- ไม่ต้อง provision, operate หรือ patch server เอง
- scale อัตโนมัติตามหน่วยของการใช้งาน (unit of consumption) แทนที่จะ scale ตามหน่วยของ server
- รูปแบบการเรียกเก็บเงินแบบ pay-for-value
- มี availability และ fault tolerance ในตัว

AWS มีชุดบริการแบบ fully managed ที่ใช้สร้างและรัน serverless application ได้ โดยไม่ต้อง provision, maintain และดูแล server สำหรับ backend component ต่าง ๆ เช่น compute, database, storage, stream processing, messaging และ queueing

## Key terms
- Serverless application: แอปพลิเคชันที่ไม่ต้อง provision/maintain/administer server สำหรับ backend เอง
- Pay-for-value: รูปแบบการเรียกเก็บเงินตามการใช้งานจริง ไม่ใช่ตามขนาด server ที่ provision ไว้
