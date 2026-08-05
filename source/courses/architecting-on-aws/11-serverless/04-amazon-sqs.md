# Amazon SQS

บทเรียนนี้อธิบายวิธีใช้ **Amazon SQS** เพื่อ implement queue ใน serverless application

**Amazon Simple Queue Service (Amazon SQS)** เป็นบริการแบบ fully managed ที่ไม่ต้องใช้ administrative overhead และตั้งค่าน้อยมาก บริการนี้ทำงานได้ในระดับ scale มหาศาล สามารถประมวลผลข้อความหลายพันล้านข้อความต่อวัน โดยเก็บ message queue และข้อความทั้งหมดไว้ใน AWS Region เดียวที่มี availability สูง กระจายอยู่หลาย Availability Zone

Amazon SQS ใช้เพื่อ integrate และ decouple ระบบ software และ component ที่กระจายตัวกัน (distributed) และมี construct พื้นฐาน เช่น dead-letter queue และ cost allocation tag

**ตัวอย่าง:** producer application สร้าง customer order แล้วส่งไปยัง SQS queue จากนั้น consumer application จะ process order จาก producer application tier โดย consumer application จะ poll queue และรับข้อความ แล้วบันทึกข้อความลงใน **Amazon RDS** database และลบข้อความที่ประมวลผลแล้วออกจาก SQS queue ข้อความที่ประมวลผลไม่สำเร็จจะถูกส่งไปยัง dead-letter queue เพื่อประมวลผลในภายหลัง

## ประโยชน์ของ Amazon SQS queue

**Loose coupling** — เมื่อเกิด application exception หรือ transaction ล้มเหลว การประมวลผล order สามารถลองใหม่ (retry) ได้ เมื่อ retry ครบจำนวนสูงสุด SQS จะส่งข้อความไปยัง dead-letter queue เพื่อ reprocess หรือ debug ภายหลัง การสูญเสีย node หรือ job เดียวใน workload แบบ loosely coupled มักไม่ทำให้การคำนวณทั้งหมดล่าช้า

**Absorbs spikes** — SQS queue ช่วยให้ระบบทนทานต่อความผันผวนมากขึ้น (resilient) queue ทำหน้าที่เป็น buffer ดูดซับ traffic ที่พุ่งสูงขึ้นกะทันหัน ทำให้แอปพลิเคชันมีเวลาเพิ่มเติมในการ scale-out นอกจากนี้ยังคุ้มค่าใช้จ่าย เพราะไม่ต้อง provision compute สำรองไว้เผื่อรองรับ spike มากเกินไป

**Failure tolerance** — เมื่อเกิด application exception หรือ transaction ล้มเหลว การประมวลผล order สามารถ retry ได้ เมื่อครบจำนวน retry สูงสุด SQS จะ redirect ข้อความไปยัง dead-letter queue เพื่อ reprocess หรือ debug ภายหลัง การสูญเสีย node หรือ job เดียวใน workload แบบ loosely coupled มักไม่ทำให้การคำนวณล่าช้า

## ประเภทของ SQS queue

**Standard queue** — รองรับการส่งข้อความแบบ at-least-once delivery และมี best-effort ordering (เรียงลำดับตามความพยายามที่ดีที่สุด) โดยทั่วไปข้อความจะถูกส่งตามลำดับที่ส่งมา แต่เนื่องจาก architecture แบบ distributed สูง อาจมีสำเนาข้อความมากกว่าหนึ่งชุดถูกส่งแบบไม่เรียงลำดับได้ Standard queue รองรับจำนวน API call ต่อวินาทีได้เกือบไม่จำกัด เหมาะกับแอปพลิเคชันที่รับข้อความซ้ำหรือไม่เรียงลำดับได้

**FIFO queue** — ออกแบบมาเพื่อเพิ่มความน่าเชื่อถือของการส่งข้อความระหว่างแอปพลิเคชัน เมื่อลำดับของ operation และ event มีความสำคัญ หรือกรณีที่ไม่สามารถทนต่อข้อความซ้ำได้ FIFO queue ให้ exactly-once processing แต่มีข้อจำกัดด้านจำนวน API call ต่อวินาที

## การ optimize การตั้งค่า queue

**Visibility timeout** — เมื่อ consumer รับข้อความจาก SQS ข้อความนั้นจะยังคงอยู่ใน queue จนกว่า consumer จะลบมันออก คุณสามารถตั้งค่า visibility timeout เพื่อทำให้ข้อความนั้น invisible ต่อ consumer รายอื่นชั่วคราว ป้องกันไม่ให้ consumer อื่นประมวลผลข้อความเดียวกันซ้ำ ค่า default คือ 30 วินาที consumer จะลบข้อความหลังประมวลผลเสร็จ หากไม่ลบก่อนหมดเวลา visibility timeout ข้อความจะกลับมา visible อีกครั้งและถูกประมวลผลซ้ำได้ ควรตั้งค่า visibility timeout ให้เท่ากับเวลาสูงสุดที่แอปพลิเคชันใช้ประมวลผลและลบข้อความ — ตั้งสั้นเกินไปจะเพิ่มโอกาสประมวลผลซ้ำ ตั้งนานเกินไปจะทำให้การส่งข้อความล่าช้าเมื่อเกิดปัญหา

**Polling type** — สามารถตั้งค่า SQS queue ให้ใช้ short polling หรือ long polling ได้
- Short polling: ตอบกลับ consumer ทันทีหลังรับ request ทำให้ตอบสนองเร็ว แต่เพิ่มจำนวนการตอบกลับ (และค่าใช้จ่าย)
- Long polling: ไม่ตอบกลับจนกว่าจะมีอย่างน้อยหนึ่งข้อความมาถึง หรือจนกว่าจะหมดเวลา poll ทำให้ตอบกลับถี่น้อยลง แต่ลดค่าใช้จ่าย

## Key terms
- Amazon SQS: fully managed message queue service สำหรับ decouple component ของระบบ
- Dead-letter queue: queue ปลายทางสำหรับข้อความที่ประมวลผลไม่สำเร็จหลัง retry ครบจำนวน
- Visibility timeout: ช่วงเวลาที่ข้อความถูกซ่อนจาก consumer อื่นหลังถูกดึงออกมาประมวลผล
- Long polling: การ poll ที่รอจนมีข้อความหรือหมดเวลา ช่วยลดจำนวนการตอบกลับที่ว่างเปล่าและลดค่าใช้จ่าย
- FIFO queue: queue ที่รับประกันลำดับข้อความและ exactly-once processing
