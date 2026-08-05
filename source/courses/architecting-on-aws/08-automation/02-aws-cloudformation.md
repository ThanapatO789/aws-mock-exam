# AWS CloudFormation

การสร้าง cloud infrastructure ด้วยมือ (manual) อาจนำไปสู่ human error ในการ deploy ได้ ดังนั้นควร automate การ deploy cloud infrastructure แทน **AWS CloudFormation** คือบริการที่ automate การสร้าง cloud infrastructure ให้

## Infrastructure as Code (IaC)

IaC คือการใช้โค้ดในการ define, deploy, configure, update และ remove infrastructure ผ่าน template โดย template คือไฟล์ text ที่อธิบายและ define resource ที่จะถูก deploy ในสภาพแวดล้อมของคุณ

Template สามารถใช้เพื่อ:
- Define ทั้ง application stack (resource ทั้งหมดที่ต้องใช้สำหรับ application) ในไฟล์ template แบบ JSON หรือ YAML โดยปฏิบัติต่อ template เหมือนโค้ด และจัดการด้วยระบบ version control
- Define runtime parameter สำหรับ template เช่น ขนาดของ **Amazon EC2** instance และ EC2 key pair

**ประโยชน์ของ IaC:**
- **Speed and safety** – infrastructure ถูกสร้างแบบ programmatic ทำให้เร็วกว่าการ deploy ด้วยมือ และลดโอกาสเกิด error
- **Reusability** – สามารถจัดระเบียบ infrastructure เป็น module ที่นำกลับมาใช้ซ้ำได้
- **Documentation and version control** – template ทำหน้าที่เป็นเอกสารของ resource ที่ deploy ไปแล้ว และ version control ช่วยเก็บประวัติของ infrastructure ตามเวลา รวมถึงสามารถ rollback กลับไปยัง version ก่อนหน้าที่ใช้งานได้ปกติ หากเกิด error
- **Validation** – สามารถทำ code review ของ template ได้ ซึ่งช่วยลดโอกาสเกิด error

## AWS CloudFormation

ด้วย **AWS CloudFormation** คุณสามารถสร้างและจัดการ AWS infrastructure deployment ได้อย่าง predictable และทำซ้ำได้ (repeatable) โดยใช้ CloudFormation กับผลิตภัณฑ์ AWS อย่าง **Amazon EC2**, **Amazon EBS** ฯลฯ เพื่อสร้าง application ที่ reliable, scalable และคุ้มค่า โดยไม่ต้องสร้างหรือ configure underlying AWS infrastructure ด้วยมือ

ด้วย CloudFormation คุณ declare resource และ dependency ทั้งหมดไว้ใน template file โดย template จะ define กลุ่มของ resource เป็นหน่วยเดียวที่เรียกว่า **stack** CloudFormation จะสร้างและลบ member resource ทั้งหมดของ stack พร้อมกัน และจัดการ dependency ระหว่าง resource เหล่านั้น

ตัวอย่างเช่น web application stack อาจประกอบด้วย EC2 instance, database และ networking rule หากไม่ต้องการ web application นั้นแล้ว สามารถลบ stack เพื่อลบ resource ที่เกี่ยวข้องทั้งหมดได้ในครั้งเดียว

CloudFormation ปฏิบัติต่อ resource ใน stack เป็นหน่วยเดียว (single unit) — resource ทั้งหมดต้องถูกสร้างหรือลบสำเร็จทั้งหมดจึงจะถือว่า stack ถูกสร้างหรือลบสำเร็จ หาก resource ใด resource หนึ่งสร้างไม่สำเร็จ CloudFormation จะ roll back stack และลบ resource ที่สร้างไปแล้วทิ้ง

## Key terms
- AWS CloudFormation: บริการ automate การสร้าง/จัดการ AWS infrastructure ผ่าน template
- Infrastructure as Code (IaC): การใช้โค้ด/template ในการ define, deploy, update และ remove infrastructure
- Stack: กลุ่มของ resource ที่ CloudFormation จัดการเป็นหน่วยเดียว ตาม template ที่ define ไว้
- Template: ไฟล์ text (JSON/YAML) ที่อธิบาย resource และ dependency ที่จะ deploy
