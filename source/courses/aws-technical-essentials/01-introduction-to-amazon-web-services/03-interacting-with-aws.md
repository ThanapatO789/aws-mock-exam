# Interacting with AWS

ทุกการกระทำ (action) บน AWS คือ API call ที่ต้องผ่านการ authenticated และ authorized สามารถเรียก API ไปยัง service และ resource บน AWS ได้ผ่าน 3 ช่องทางหลัก: AWS Management Console, AWS Command Line Interface (AWS CLI), หรือ AWS SDKs

## AWS Management Console
วิธีหนึ่งในการจัดการทรัพยากรบนคลาวด์คือผ่านคอนโซลแบบเว็บ (web-based console) ที่ล็อกอินแล้วเลือก service ที่ต้องการ เป็นวิธีที่ง่ายที่สุดในการสร้างและจัดการทรัพยากรเมื่อเริ่มต้นใช้งานคลาวด์

- มุมซ้ายบน: เลือก **Services** เพื่อดู AWS services แบ่งตามหมวดหมู่ เช่น Compute, Storage, Database, Analytics
- มุมขวาบน: **Region selector** เมื่อเปลี่ยน Region ที่นี่ คำขอ (request) จะถูกส่งไปยัง service ใน Region ที่เลือก และ URL ก็จะเปลี่ยนตามด้วย เพราะการเปลี่ยน Region จะสั่งให้เบราว์เซอร์ส่งคำขอไปยัง AWS Region อื่น ซึ่งแทนด้วย subdomain ที่ต่างกัน

## AWS CLI
ตัวอย่างสถานการณ์: มีเซิร์ฟเวอร์จำนวนมากรันแอปพลิเคชัน frontend อยู่บน AWS และต้องการรันรายงานเพื่อรวบรวมข้อมูลจากเซิร์ฟเวอร์ทั้งหมดทุกวันโดยอัตโนมัติ (เพราะรายละเอียดเซิร์ฟเวอร์อาจเปลี่ยนแปลงได้) แทนที่จะล็อกอินเข้าคอนโซลแล้วคัดลอกข้อมูลด้วยมือ สามารถตั้งเวลาให้สคริปต์ AWS CLI เรียก API เพื่อดึงข้อมูลนี้ได้

**AWS CLI** คือเครื่องมือรวมศูนย์ (unified tool) สำหรับจัดการ AWS services สามารถดาวน์โหลดและตั้งค่าเครื่องมือเดียวเพื่อควบคุมหลาย AWS service จาก command line และ automate ได้ด้วยสคริปต์ AWS CLI เป็น open source และมีตัวติดตั้งสำหรับ Windows, Linux, และ macOS

ตัวอย่าง: รัน API call ต่อไปนี้ผ่าน AWS CLI เพื่อ list buckets ทั้งหมดในบัญชี:

```
aws s3api list-buckets
```

จะได้ผลลัพธ์ (response) เป็น JSON แสดง Owner และรายการ Buckets ในบัญชี AWS

## AWS SDKs
การเรียก API ไปยัง AWS สามารถทำได้ด้วยการรันโค้ดในภาษาโปรแกรมมิ่งต่างๆ ผ่าน **AWS SDKs** ซึ่งเป็น open source และดูแลโดย AWS สำหรับภาษาโปรแกรมมิ่งยอดนิยม เช่น C++, Go, Java, JavaScript, .NET, Node.js, PHP, Python, Ruby, Rust, และ Swift

นักพัฒนามักใช้ AWS SDK เพื่อผสาน source code ของแอปพลิเคชันเข้ากับ AWS services เช่น แอปพลิเคชันที่มี frontend รันด้วย Python ทุกครั้งที่ได้รับรูปภาพ จะอัปโหลดไฟล์ไปยัง storage service ได้ผ่าน AWS SDK for Python (Boto3) ตัวอย่างโค้ด:

```python
import boto3
ec2 = boto3.client('ec2')
response = ec2.describe_instances()
print(response)
```

## Key terms
- AWS Management Console: คอนโซลแบบเว็บสำหรับจัดการทรัพยากร AWS ผ่านหน้าจอ
- AWS CLI (Command Line Interface): เครื่องมือควบคุม AWS services จาก command line
- AWS SDK (Software Development Kit): ชุดเครื่องมือสำหรับเรียกใช้ AWS services ผ่านโค้ดในภาษาโปรแกรมมิ่งต่างๆ
- API call: การกระทำทุกอย่างบน AWS จะถูกส่งเป็น API call ที่ต้องผ่านการ authenticate/authorize
