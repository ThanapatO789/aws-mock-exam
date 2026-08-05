# AWS Step Functions

**AWS Step Functions** คือ flowchart ที่ทำงานได้จริง เป็นบริการสำหรับ orchestrate multistep workflow บทเรียนนี้อธิบายวิธีใช้งาน

**AWS Step Functions** เป็น visual workflow service ที่ช่วยนักพัฒนาใช้บริการต่าง ๆ ของ AWS เพื่อสร้างแอปพลิเคชันแบบ distributed, automate กระบวนการ, orchestrate microservices และสร้าง data/machine learning (ML) pipeline

AWS Step Functions ให้ serverless orchestration สำหรับแอปพลิเคชันยุคใหม่ orchestration บริหารจัดการ workflow แบบรวมศูนย์ด้วยการแบ่งเป็นหลายขั้นตอน (step) เพิ่ม flow logic และติดตาม input/output ระหว่างแต่ละ step เมื่อแอปพลิเคชันของคุณรัน Step Functions จะรักษา application state, ติดตามว่า workflow อยู่ที่ step ใด และเก็บ event log ของข้อมูลที่ส่งผ่านระหว่าง component ต่าง ๆ ของแอปพลิเคชัน หมายความว่าหาก network ล่มหรือ component ค้าง แอปพลิเคชันของคุณสามารถทำงานต่อจากจุดที่ค้างไว้ได้

## State machine

**state machine** คือ object ที่มีเงื่อนไขการทำงาน (operating condition) จำนวนหนึ่งซึ่งขึ้นอยู่กับเงื่อนไขก่อนหน้าเพื่อกำหนด output ตัวอย่างที่พบบ่อยของ state machine คือ ตู้ขายน้ำอัดลม (soda vending machine) — เครื่องเริ่มที่ operating state (รอ transaction) จากนั้นเปลี่ยนไปยัง soda selection เมื่อใส่เงิน หลังจากนั้นเข้าสู่ vending state ที่น้ำอัดลมถูกส่งมอบให้ลูกค้า เมื่อเสร็จสิ้น state จะกลับไปที่ operating อีกครั้ง ด้วย Step Functions คุณสามารถสร้างและ automate state machine ของตัวเองภายใน AWS ได้

**State** คือ element ใน state machine ที่ทำหน้าที่ได้หลากหลาย เช่น:

- ตัดสินใจเลือกระหว่าง branch ต่าง ๆ ที่จะรัน (Choice state)
- หยุดทำงานด้วยความล้มเหลวหรือความสำเร็จ (Fail หรือ Succeed state)
- ส่งต่อ input ไปเป็น output หรือแทรกข้อมูลคงที่เข้าไป (Pass state)
- หน่วงเวลาตามระยะเวลาที่กำหนดหรือจนถึงเวลา/วันที่ที่ระบุ (Wait state)
- เริ่ม branch แบบขนาน (Parallel state)
- วนซ้ำ step แบบ dynamic (Map state)

## ประเภทของ workflow

Step Functions รองรับการสร้าง workflow สองประเภท:

**Standard workflows** — ใช้สำหรับ workflow ที่รันนาน (long-running) ทนทาน (durable) และตรวจสอบย้อนหลังได้ (auditable) workflow ประเภทนี้รันได้นานถึง 1 ปี และสามารถเข้าถึงประวัติกิจกรรมทั้งหมดของ workflow ได้นานถึง 90 วันหลัง workflow เสร็จสิ้น Standard workflows ใช้โมเดล exactly-once คือ task และ state จะไม่ถูกรันซ้ำเกินหนึ่งครั้ง เว้นแต่จะระบุพฤติกรรม Retry ไว้

**Express workflows** — ใช้สำหรับ workload ที่ต้องประมวลผล event ปริมาณสูง เช่น IoT data ingestion, streaming data processing/transformation และ mobile application backend รันได้นานสูงสุด 5 นาที Express workflows ใช้โมเดล at-least-once ซึ่งมีความเป็นไปได้ที่ execution หนึ่งจะถูกรันมากกว่าหนึ่งครั้ง

**ตัวอย่างการใช้งาน:** client ทำ transaction สำเร็จ ซึ่งส่ง POST request ไปยัง API Gateway event นี้ใน API Gateway จะสั่งให้ Step Functions workflow เริ่มทำงานเพื่อบันทึก transaction ลงใน **DynamoDB** workflow จะเดินผ่านแต่ละ state จนกระทั่งเสร็จสมบูรณ์และจบ workflow

บทเรียนนี้สรุปวิธีใช้บริการต่าง ๆ ของ AWS เพื่อออกแบบและ implement serverless application บน AWS infrastructure

## Key terms
- AWS Step Functions: visual workflow service สำหรับ orchestrate multistep workflow ระหว่าง function/บริการต่าง ๆ
- State machine: object ที่กำหนด flow การทำงานเป็นลำดับ state ต่าง ๆ
- Standard workflow: workflow ที่รันได้นานถึง 1 ปี ใช้โมเดล exactly-once
- Express workflow: workflow ที่รันได้สูงสุด 5 นาที ใช้โมเดล at-least-once เหมาะกับ event ปริมาณสูง
