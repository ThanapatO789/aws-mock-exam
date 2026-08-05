# Database Caching

บทเรียนนี้สอนวิธี implement **database caching** ในแอปพลิเคชัน

เนื้อหาหลักนำเสนอผ่านวิดีโอผู้สอน (ความยาว 8 นาที 18 วินาที) หัวข้อ "Database caching" ตั้งคำถามนำว่า "How can we cache databases in the cloud to maximize performance?"

## Caching architecture

**Database cache** ช่วยเสริม (supplement) ฐานข้อมูลหลัก (primary database) โดยลดแรงกดดัน (pressure) ที่ไม่จำเป็นต่อฐานข้อมูล มักอยู่ในรูปแบบของข้อมูลที่ถูกอ่านบ่อย (frequently accessed read data) หากไม่มี caching, EC2 instance จะอ่านและเขียนข้อมูลตรงไปยังฐานข้อมูล แต่เมื่อมี caching, instance จะพยายามอ่านจาก cache ก่อน ซึ่งใช้หน่วยความจำประสิทธิภาพสูง (high performance memory)

ตัวอย่างสถาปัตยกรรม: VPC มี app subnet และ data subnet อยู่ใน 2 Availability Zone แต่ละแห่ง application server ใน app subnet ทั้งสองเชื่อมต่อไปยัง primary database ใน data subnet หนึ่ง ส่วน data subnet อีกแห่งเก็บ replica database ไว้ ส่วน cache cluster ครอบคลุม (span) ทั้งสอง application subnet โดยมี cache node อยู่ในแต่ละแห่ง

## Common caching strategies

มีหลายกลยุทธ์ในการทำให้ข้อมูลใน cache sync กับฐานข้อมูล กลยุทธ์ที่พบบ่อยสองแบบคือ **lazy loading** และ **write-through**

### Lazy loading

ใน lazy loading การอัปเดต (update) จะทำกับฐานข้อมูลโดยไม่อัปเดต cache ในกรณีที่เกิด cache miss ข้อมูลที่ดึงมาจากฐานข้อมูลจะถูกเขียนต่อไปยัง cache ในภายหลัง lazy loading โหลดเฉพาะข้อมูลที่แอปพลิเคชันต้องการเข้า cache แต่ก็อาจทำให้เกิด cache-miss-to-cache-hit ratio สูงในบาง use case

ขั้นตอนของ lazy loading caching strategy:
1. Data request ถูกส่งไปที่ cache
2. หากข้อมูลไม่มีอยู่ใน cache จะเกิด cache miss
3. Data request จะถูกส่งไปยัง database instance ต่อ
4. Data request ถูก serve จากฐานข้อมูล
5. ข้อมูลที่ได้จากฐานข้อมูลจะถูกบันทึกลงใน cache ด้วย

### Write-through

ใน write-through caching ทุกการเขียน (write) ไปยัง database instance จะถูกเขียนไปยัง cache ด้วยเช่นกัน ทำให้เกิด cache miss น้อยลง

ขั้นตอนของ write-through caching strategy:
1. Application เขียนข้อมูลไปยังฐานข้อมูล
2. Application เขียนข้อมูลไปยัง cache ด้วย

## Amazon ElastiCache

**Amazon ElastiCache** เป็น web service ที่ช่วยให้ตั้งค่า จัดการ และ scale distributed in-memory data store หรือ cache environment บนคลาวด์ได้ง่าย ให้ caching solution ที่มีประสิทธิภาพสูง scalable และคุ้มค่า พร้อมช่วยลดความซับซ้อนในการ deploy และจัดการ distributed cache environment

ElastiCache ทำงานร่วมกับ in-memory data store แบบ open-source compatible สองตัวคือ **Redis** และ **Memcached**

**ElastiCache for Redis** เป็น in-memory data store ที่ให้ latency ระดับ sub-millisecond ในระดับ internet scale ElastiCache for Redis รวมความเร็ว ความง่าย และความยืดหยุ่นของ open-source Redis เข้ากับความสามารถในการจัดการ (manageability) security และ scalability จาก Amazon เข้าด้วยกัน สามารถรองรับแอปพลิเคชัน real-time ที่ต้องการประสิทธิภาพสูงที่สุดได้

**ElastiCache for Memcached** เป็น managed, scalable และ secure เหมาะสำหรับ use case ที่ต้องการให้ข้อมูลที่เข้าถึงบ่อยอยู่ใน memory engine นี้ให้ caching model ที่เรียบง่ายพร้อม multi-threading เป็นตัวเลือกยอดนิยมสำหรับ use case เช่น web, mobile app, gaming, ad tech และ ecommerce บริการที่ compatible กับ Memcached ยังรองรับ Auto Discovery ด้วย

## DynamoDB Accelerator (DAX)

DynamoDB ถูกออกแบบมาเพื่อ scale และ performance โดยส่วนใหญ่ response time ของ DynamoDB วัดได้ในระดับ single-digit millisecond แต่บาง use case ต้องการ response time ระดับ microsecond สำหรับ use case เหล่านั้น **DynamoDB Accelerator (DAX)** ให้ response time ที่รวดเร็วสำหรับการเข้าถึงข้อมูลแบบ eventually consistent

DAX เป็น caching service ที่ compatible กับ DynamoDB ให้ performance แบบ in-memory ที่รวดเร็วสำหรับแอปพลิเคชันที่ต้องการประสิทธิภาพสูง

ผู้ใช้สร้าง DAX cluster ใน Amazon VPC เพื่อเก็บ cached data ให้ใกล้กับแอปพลิเคชันมากขึ้น แล้วติดตั้ง DAX client บน Amazon EC2 instance ที่รันแอปพลิเคชันใน VPC นั้น เมื่อรันจริง (at runtime) DAX client จะส่งคำขอ (request) DynamoDB ทั้งหมดของแอปพลิเคชันไปยัง DAX cluster หาก DAX สามารถประมวลผล request นั้นได้โดยตรง ก็จะทำเลย มิฉะนั้นจะส่งต่อ (pass) request ไปยัง DynamoDB

บทเรียนถัดไปจะเรียนรู้วิธีใช้ database migration tools เพื่อ migrate ข้อมูลจากฐานข้อมูลหนึ่งไปยังอีกฐานข้อมูลหนึ่ง

## Key terms
- Database caching: การเก็บผลลัพธ์ของข้อมูลที่ถูกเรียกใช้บ่อยไว้ในหน่วยความจำที่เข้าถึงเร็ว เพื่อลดโหลดของฐานข้อมูลหลักและเพิ่ม performance
- Lazy loading: caching strategy ที่โหลดข้อมูลเข้า cache เฉพาะตอนเกิด cache miss (เขียนต่อจากฐานข้อมูล)
- Write-through: caching strategy ที่เขียนข้อมูลเข้า cache พร้อมกับเขียนเข้าฐานข้อมูลทุกครั้ง
- Amazon ElastiCache: managed in-memory data store/cache service รองรับ Redis และ Memcached
- ElastiCache for Redis: engine ที่ให้ sub-millisecond latency รองรับ feature ขั้นสูง เช่น sorting/ranking
- ElastiCache for Memcached: engine caching แบบเรียบง่าย รองรับ multi-threading และ Auto Discovery
- DAX (DynamoDB Accelerator): caching service สำหรับ DynamoDB ให้ response time ระดับ microsecond
