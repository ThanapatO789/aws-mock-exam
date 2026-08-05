# Data Protection

## Data Protection (1.22)
best practice area ต่อไปคือ **data protection** ก่อนออกแบบ workload ใด ๆ ควรมี foundational practices ด้าน security พร้อมอยู่แล้ว เช่น **data classification** (จัดประเภทข้อมูลตามระดับ sensitivity) และ **encryption** (ทำให้ข้อมูลอ่านไม่ออกสำหรับผู้ที่ไม่ได้รับอนุญาต) วิธีเหล่านี้สำคัญเพราะช่วยจำกัด mishandling และสนับสนุนการปฏิบัติตามข้อกำหนด

## Classifying data (1.23)
**Data classification** ช่วยจัดประเภทข้อมูลตาม criticality และ sensitivity เพื่อกำหนด protection/retention controls ที่เหมาะสม

- **Identify the data** — เข้าใจประเภท/classification ของข้อมูลใน workload, business process ที่เกี่ยวข้อง, ตำแหน่งจัดเก็บ, เจ้าของข้อมูล รวมถึงข้อกำหนดทางกฎหมาย/compliance ที่เกี่ยวข้อง
- **Define data protection controls** — ปกป้องข้อมูลตาม classification level และใช้ automation ในการระบุ/จัดประเภทข้อมูลเพื่อลด human error
- **Define data lifecycle management** — กำหนด lifecycle strategy ตาม sensitivity level และข้อกำหนดทางกฎหมาย/องค์กร ครอบคลุมระยะเวลาเก็บข้อมูล, กระบวนการทำลายข้อมูล, การจัดการ access, การแปลงข้อมูล และการแชร์ข้อมูล

## Protecting data at rest (1.24)
**Data at rest** คือข้อมูลใดก็ตามที่ถูกเก็บใน nonvolatile storage ไม่ว่าจะช่วงเวลาใด (block storage, object storage, databases, archives, IoT devices ฯลฯ) การปกป้อง data at rest ช่วยลดความเสี่ยงจาก unauthorized access เมื่อมี encryption และ access controls ที่เหมาะสม

Best practices:

1. **Implement secure key management** — กำหนดแนวทาง encryption ครอบคลุมการจัดเก็บ, rotation และ access control ของ keys
2. **Enforce encryption at rest** — บังคับใช้ encryption สำหรับข้อมูลที่พัก เพื่อรักษาความลับของข้อมูลในกรณีถูกเข้าถึงโดยไม่ได้รับอนุญาต
3. **Automate data-at-rest protection** — ใช้ automated tools เพื่อ validate และบังคับใช้ controls อย่างต่อเนื่อง
4. **Enforce access control** — ใช้กลไกเช่น isolation และ versioning พร้อมหลัก least privilege และป้องกันการ grant public access
5. **Use mechanisms to distance people from data** — ป้องกันไม่ให้ users เข้าถึงข้อมูล/ระบบที่ sensitive โดยตรงในสภาวะปกติ

## Protecting data in transit (1.25)
**Data in transit** คือข้อมูลที่ถูกส่งจากระบบหนึ่งไปยังอีกระบบหนึ่ง (รวมถึงการสื่อสารระหว่าง resources ใน workload และระหว่าง services กับ end users) การให้ระดับการป้องกันที่เหมาะสมช่วยรักษา confidentiality และ integrity ของข้อมูล

Best practices:

1. **Implement secure key and certificate management** — จัดเก็บ encryption keys/certificates อย่างปลอดภัย และ rotate ตามช่วงเวลาที่เหมาะสมพร้อม access control ที่เข้มงวด
2. **Enforce encryption in transit** — บังคับใช้ตามนโยบายองค์กร/ข้อกำหนด ใช้ protocol ที่มี encryption เมื่อส่งข้อมูล sensitive ออกนอก VPC
3. **Automate detection of unintended data access** — ใช้เครื่องมือเช่น **Amazon GuardDuty** เพื่อตรวจจับกิจกรรมที่น่าสงสัยหรือความพยายามย้ายข้อมูลออกนอกขอบเขตที่กำหนดไว้อัตโนมัติ
4. **Authenticate network communications** — ยืนยันตัวตนของการสื่อสารด้วย protocol ที่รองรับ authentication เช่น TLS (Transport Layer Security) หรือ IPsec

## Key terms
- Data classification: การจัดประเภทข้อมูลตามระดับความสำคัญและความอ่อนไหว
- Data at rest / Data in transit: ข้อมูลที่พัก (จัดเก็บ) / ข้อมูลระหว่างส่ง
- Amazon GuardDuty: บริการตรวจจับภัยคุกคามอัตโนมัติของ AWS
- TLS / IPsec: โปรโตคอลสำหรับเข้ารหัสและยืนยันตัวตนการสื่อสารเครือข่าย
