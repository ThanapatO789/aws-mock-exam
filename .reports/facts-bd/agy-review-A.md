## Errors

- `storage-bd14`: `"รอ Intelligent-Tiering ลง archive tier เอง (ต้อง opt-in และรอ 180 วัน)"` สับสนชื่อ tier กับจำนวนวัน เพราะใน S3 Intelligent-Tiering ตัว **Archive Access tier** ใช้เวลารอขั้นต่ำ **90 วัน** ส่วน **180 วัน** คือ **Deep Archive Access tier** → `"รอ Intelligent-Tiering ย้ายลง Deep Archive Access tier เอง (ต้อง opt-in และรออย่างน้อย 180 วัน; ส่วน Archive Access tier รออย่างน้อย 90 วัน)"`
- `storage-bd12`: `"ตั้ง S3 Lifecycle ให้ expire noncurrent versions (ตามจำนวนวัน หรือเก็บไว้แค่ N version ล่าสุด)"` ใน S3 Lifecycle การลบ noncurrent versions **บังคับต้องระบุจำนวนวัน (`Days after objects become noncurrent`) เสมอ** ส่วนการเก็บ `N newer versions` เป็นเงื่อนไขเสริมที่ใช้ **ร่วมกับ** จำนวนวัน ไม่ใช่ทางเลือกแทนกัน (`หรือ`) → `"ตั้ง S3 Lifecycle ให้ expire noncurrent versions ตามจำนวนวันหลังกลายเป็น noncurrent (และกำหนดจำนวน version ล่าสุดที่ต้องการเก็บควบคู่กันได้สูงสุด 100 version)"`

## Weak spots

- `storage-bd17`: `"EBS ผูก AZ เดียว แชร์ข้าม AZ ไม่ได้ ใช้เป็นพื้นที่ชั่วคราวตอนประมวลผลเท่านั้น"` และบรรทัดท้าย `"เว็บ static ล้วน = S3 static website hosting ถูกที่สุด"` — ประโยคแรกพูดเหมือน EBS เป็น temporary storage (เสี่ยงสับสนกับ EC2 Instance Store ทั้งที่ EBS เป็น persistent block storage ที่ในโจทย์นี้ใช้พักข้อมูลขณะประมวลผลบน EC2 แต่ละตัว) ส่วนบรรทัดท้ายเรื่อง static website ไม่เกี่ยวกับ `cue` เรื่อง EC2 หลาย AZ เข้าถึงไฟล์หลายร้อย TB → `"EBS ผูกกับ AZ เดียว แชร์ข้าม AZ ไม่ได้ (ในโจทย์ลักษณะนี้เหมาะใช้เป็น disk ประจำเครื่องระหว่างดึงไฟล์จาก S3 มาประมวลผลเท่านั้น)"` และตัดบรรทัด `"เว็บ static ล้วน..."` ออกหรือแยกการ์ด
- `storage-bd10`: ตั้ง `"kind": "compare"` (และอยู่ใน deck `"pairs"`) ทั้งที่ `cue` (`"แชร์ข้อมูลใน S3 ให้บริษัทอื่นดึงไปใช้ โดยเจ้าของไม่ต้องจ่ายค่า data transfer ใช้อะไร"`) เป็นคำถามถามหาฟีเจอร์เดียว (`S3 Requester Pays`) พร้อมบอกกับดัก เหมือนการ์ด `storage-bd11` และ `storage-bd13` → เปลี่ยน `"kind"` เป็น `"fact"`
- `storage-bd08`: ตั้ง `"kind": "antipattern"` แต่ `cue` ถามวิธีทำตรง ๆ (`"...ต้องทำอย่างไร"`) และ `fact` เปิดด้วยวิธีที่ถูกก่อนตามด้วย `กับดัก:` รูปแบบเดียวกับการ์ด `"kind": "fact"` อื่น ๆ → เปลี่ยน `"kind"` เป็น `"fact"` หรือปรับ `cue` ให้ถามถึงกับดักของการพักไฟล์ผ่าน S3 / AWS CLI

## Verdict

12/17 cards are fine as-is (2 cards have technical precision errors in `fact`, and 3 cards have minor wording/scope or `kind` issues).
