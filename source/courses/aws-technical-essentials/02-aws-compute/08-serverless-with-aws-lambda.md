# Serverless with AWS Lambda

ด้วย **AWS Lambda** ไม่มี server ให้ต้องจัดการ ได้รับการ scale อย่างต่อเนื่อง มีการคิดค่าบริการละเอียดถึงระดับต่ำกว่าวินาที (subsecond metering) และประสิทธิภาพที่สม่ำเสมอ

## Running code on AWS Lambda
หากต้องการ deploy workload และแอปพลิเคชันโดยไม่ต้องจัดการ EC2 instance หรือ container เลย สามารถใช้ Lambda ได้

ด้วย Lambda สามารถรันโค้ดได้โดยไม่ต้อง provision หรือจัดการ server สามารถรันโค้ดสำหรับแอปพลิเคชันหรือ backend service ได้แทบทุกประเภท เช่น data processing, real-time stream processing, machine learning, WebSockets, IoT backend, mobile backend และ web application (เช่น employee directory application)

Lambda รันโค้ดบน compute infrastructure ที่มี high availability และไม่ต้องมีการดูแลจากผู้ใช้เลย เพียงอัปโหลด source code ในภาษาที่ Lambda รองรับ แล้ว Lambda จะจัดการทุกอย่างที่จำเป็นสำหรับการรันและ scale โค้ดให้มี high availability — ไม่มี server ให้ต้องจัดการ ได้รับ continuous scaling พร้อม subsecond metering และประสิทธิภาพที่สม่ำเสมอ

## How Lambda works
**Lambda function** คือหลักการพื้นฐาน (foundational principle) ของ AWS Lambda สามารถตั้งค่า Lambda function ได้หลายวิธี: ผ่าน Lambda console, Lambda API, AWS CloudFormation หรือ AWS Serverless Application Model (AWS SAM) สามารถเรียกใช้ (invoke) function ได้โดยตรงผ่าน Lambda API หรือกำหนดให้ AWS service/resource เรียกใช้ function เพื่อตอบสนองต่อ event ก็ได้

### แนวคิดหลักของ Lambda (7 หมวด)

**Function**: resource ที่สามารถเรียกใช้ (invoke) เพื่อรันโค้ดใน Lambda โดย Lambda จะรัน instance ของ function เพื่อประมวลผล event เมื่อสร้าง Lambda function สามารถทำได้หลายวิธี:
- สร้างจากศูนย์ (from scratch)
- ใช้ blueprint ที่ AWS จัดเตรียมไว้
- เลือก container image เพื่อ deploy สำหรับ function
- เรียกดูจาก AWS Serverless Application Repository

**Trigger**: อธิบายว่า Lambda function ควรจะรันเมื่อใด trigger เชื่อมต่อ Lambda function กับบริการ AWS อื่นๆ และ event source mapping ทำให้สามารถรัน Lambda function เพื่อตอบสนองต่อ API call บางอย่าง หรือโดยการอ่านรายการจาก stream หรือ queue ได้ ช่วยเพิ่มความสามารถในการตอบสนองต่อ event โดยไม่ต้องดำเนินการด้วยตนเอง (manual action)

**Event**: เอกสารรูปแบบ JSON ที่มีข้อมูลให้ Lambda function ประมวลผล runtime จะแปลง event เป็น object แล้วส่งเข้าโค้ดของ function เมื่อ invoke function ผู้ใช้เป็นผู้กำหนดโครงสร้างและเนื้อหาของ event เอง

**Application Environment**: จัดเตรียม runtime environment ที่ปลอดภัยและแยกเดี่ยว (isolated) สำหรับ Lambda function จัดการ process และ resource ที่จำเป็นสำหรับการรัน function

**Deployment package**: วิธี deploy โค้ดของ Lambda function มี 2 รูปแบบ:
- **.zip file archive**: บรรจุโค้ดของ function และ dependency โดย Lambda จัดเตรียมระบบปฏิบัติการและ runtime ให้
- **Container image**: ต้องสอดคล้องกับมาตรฐาน Open Container Initiative (OCI) ต้องใส่โค้ด, dependency, ระบบปฏิบัติการ และ Lambda runtime เข้าไปในอิมเมจเอง

**Runtime**: จัดเตรียม environment เฉพาะภาษา (language-specific) ที่รันภายใน application environment เมื่อสร้าง Lambda function ต้องระบุ runtime ที่ต้องการ สามารถใช้ built-in runtime เช่น Python, Node.js, Ruby, Go, Java, .NET Core หรือสร้าง custom runtime เองก็ได้

**Lambda function handler**: เมทอด (method) ในโค้ดของ function ที่ประมวลผล event เมื่อ function ถูก invoke, Lambda จะรัน handler method เมื่อ handler exit หรือ return response แล้ว จะพร้อมสำหรับจัดการ event ถัดไป ตัวอย่าง syntax ทั่วไปสำหรับสร้าง function handler ด้วย Python:
```python
def handler_name(event, context):
    ...
    return some_value
```

## Billing granularity (การคิดค่าบริการ)
ด้วย Lambda สามารถรันโค้ดโดยไม่ต้อง provision หรือจัดการ server และจ่ายเฉพาะสิ่งที่ใช้จริงเท่านั้น โดยคิดค่าบริการตาม:
- จำนวนครั้งที่โค้ดถูกเรียกใช้ (requests)
- เวลาที่โค้ดรัน (ปัดขึ้นเป็นหน่วยละเอียดถึง 1 มิลลิวินาที)

AWS ปัดเวลาการรันขึ้นเป็นหน่วย ms โดยไม่มีเวลาขั้นต่ำ (no minimum run time) ทำให้ประหยัดต้นทุนได้ดีสำหรับ function ที่มีเวลาประมวลผลสั้นมาก เช่น function ที่ใช้เวลาต่ำกว่า 100 ms หรือ low-latency API

> "No server is easier to manage than no server." – Werner Vogels, Amazon CTO

คำกล่าวนี้สรุปความสะดวกของการรัน serverless solution อย่าง AWS Fargate และ AWS Lambda ได้เป็นอย่างดี

## Resources
- AWS website: Building Applications with Serverless Architectures
- AWS blog: Best Practices for Organizing Larger Serverless Applications
- AWS developer guide: Configuring AWS Lambda Functions
- AWS blog: 10 Things Serverless Architects Should Know
- AWS workshop: AWS Alien Attack – A Serverless Adventure
- AWS blog: Resize Images on the Fly with Amazon S3, AWS Lambda, and Amazon API Gateway
- AWS blog: New for AWS Lambda – 1ms Billing Granularity Adds Cost Savings

## Key terms
- AWS Lambda: serverless compute service สำหรับรันโค้ดโดยไม่ต้องจัดการ server
- Function: resource หลักที่ใช้เรียก (invoke) เพื่อรันโค้ดบน Lambda
- Trigger: กลไกที่กำหนดว่า Lambda function จะถูกรันเมื่อใด
- Event: ข้อมูลรูปแบบ JSON ที่ Lambda function ใช้ประมวลผล
- Runtime: environment เฉพาะภาษาที่ Lambda function รันอยู่
- Lambda function handler: เมทอดในโค้ดที่ทำหน้าที่ประมวลผล event ที่ถูกเรียกเข้ามา
- Billing granularity: การคิดค่าบริการแบบละเอียดตามจำนวนครั้งเรียกและเวลาที่รันจริง (หน่วย ms)
