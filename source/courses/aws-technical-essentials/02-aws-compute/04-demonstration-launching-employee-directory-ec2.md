# Demonstration: Launching the Employee Directory Application on Amazon EC2

วิดีโอสาธิต (demonstration) นี้เป็นการเดินผ่าน (visual walk-through) เท่านั้น ไม่ใช่แบบฝึกหัดลงมือทำจริง โดยสาธิตการ launch employee directory application บน Amazon EC2 instance โดยใช้ default VPC

## ขั้นตอนการสาธิต

1. เข้าสู่ EC2 dashboard ใน AWS Console แล้วเลือก **Launch instance** ตั้งชื่อ instance ว่า "employee directory app"
2. เลือก **AMI**: ใช้ Amazon Linux 2023 AMI (AMI คือ template ที่มี software configuration สำหรับ boot instance เช่น OS และแอปพลิเคชันที่ติดตั้งไว้ล่วงหน้า) — สามารถเลือก AMI อื่นจาก AWS Marketplace ได้เช่นกัน
3. เลือก instance type (ใช้ค่าที่กำหนดไว้)
4. เรื่อง **Key pair**: เลือก "proceed without a key pair" เพราะถ้าต้องเชื่อมต่อ instance จะใช้ปุ่ม Connect ใน AWS Console แทน ซึ่งไม่จำเป็นต้องมี key pair
5. **Network settings**: ใช้ default VPC และ default subnet ซึ่งมี internet gateway ที่อนุญาตให้มี internet access เข้าถึง VPC ได้ (เหมาะกับตัวอย่างนี้ แต่ไม่เหมาะกับ use case อื่นที่ควรวาง instance หลัง load balancer แทนที่จะให้เข้าถึง HTTP โดยตรง)
6. **Storage**: ใช้ root volume ตามค่าเริ่มต้น ไม่เพิ่ม EBS volume อื่น
7. **Advanced details – IAM instance profile**: เลือก role "employee web app" ซึ่งมีสิทธิ์ (permissions) ให้เรียกใช้ S3 และ DynamoDB ผ่าน AWS SDK โดยใช้ temporary credentials ที่ผูกกับ role นี้ (จำเป็นเพราะโค้ดแอปพลิเคชันจะเรียก API ไปยัง S3/DynamoDB)
8. **User data**: ใส่ bash script ที่รันตอน launch เพื่อดาวน์โหลดและติดตั้งแอปพลิเคชัน (เขียนด้วย Python ใช้ Flask เป็น web server) โดย script จะ:
   - ติดตั้ง dependency ต่างๆ ตามไฟล์ `requirements.txt`
   - ติดตั้งแพ็กเกจ `stress` เพื่อจำลองการเพิ่มขึ้นของ CPU (ใช้สาธิต autoscaling ในบทเรียนถัดไป)
   - ตั้งค่า environment variables 3 ตัว: photos bucket (S3, ยังไม่มีค่าตอนนี้), default region (Oregon), และโหมด DynamoDB
   - รันแอปพลิเคชันบน port 80
9. เลือก **Launch instance** ระบบจะสร้าง security group และ resource ที่เกี่ยวข้องให้อัตโนมัติ
10. เปิดหน้า instance เพื่อดูรายละเอียด เช่น public IP address, private IP address, public DNS name — สถานะ instance เป็น running แต่ status check ยังต้อง initializing รอสักครู่จนกว่า status check ทั้งสองจะผ่าน
11. เมื่อ status check ผ่านแล้ว เปิด public IP address ในแท็บใหม่ จะเห็นหน้า employee directory application แต่ยังว่างเปล่า เนื่องจากยังไม่มี S3 bucket และ DynamoDB table ให้เก็บรูปภาพและข้อมูลพนักงาน (จะสร้าง custom network, S3 bucket, DynamoDB table และทำให้ระบบ highly available ในบทเรียนถัดไป)

## Key terms
- User data script: bash script ที่รันอัตโนมัติตอน EC2 instance launch เพื่อติดตั้ง/ตั้งค่าแอปพลิเคชัน
- IAM instance profile: กลไกที่ผูก IAM role เข้ากับ EC2 instance เพื่อให้แอปพลิเคชันบน instance เรียกใช้ AWS API ได้โดยไม่ต้องฝัง credential ตายตัว
- Default VPC / Default subnet: เครือข่ายเริ่มต้นของ AWS ที่มี internet gateway ทำให้เข้าถึงอินเทอร์เน็ตได้แบบ public
