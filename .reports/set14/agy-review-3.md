## Errors
- ไม่มี

## Weak spots
- Q903: `"Step Functions เกินความจำเป็นสำหรับงาน resize ธรรมดา และ RDS ไม่เหมาะเก็บไฟล์รูป"` → เสริมได้สั้น ๆ ว่า Step Functions เป็นบริการจัดลำดับ workflow ไม่ได้ประมวลผล/resize รูปด้วยตัวเอง (ยังต้องเรียก compute อย่าง Lambda อยู่ดี) และ CloudFront เป็น CDN ไม่ใช่ที่ host static website โดยตรง
- Q904: `"เช่น pull image จาก Amazon ECR (ecr.api, ecr.dkr และ S3 gateway endpoint สำหรับ layer), EC2 และ STS"` → ควรระบุ interface endpoint ของ EKS (`com.amazonaws.<region>.eks`) เพิ่มด้วย เพราะสคริปต์ bootstrap ของ node ต้องเรียก `DescribeCluster` ไปยัง EKS API ซึ่งตรงกับคำในตัวเลือก B ที่บอกว่า `"allow nodes to access the control plane"`

## Verdict
ไม่มีข้อผิดพลาดที่ต้องแก้ (Errors = 0); ใช้ได้ทันที 19/21 ข้อ (อีก 2 ข้อเป็นจุดปรับปรุงเล็กน้อย)
