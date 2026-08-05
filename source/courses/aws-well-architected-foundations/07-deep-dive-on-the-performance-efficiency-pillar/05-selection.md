# Selection

## Selection (1.10)
Selection คือ best practice area แรกของ performance efficiency pillar

## Performance architecture selection (1.11)
ใช้แนวทางที่ขับเคลื่อนด้วยข้อมูล (**data-driven approach**) ในการเลือก patterns และ implementation สำหรับสถาปัตยกรรมของคุณ เพื่อให้ได้ solution ที่คุ้มค่าด้านต้นทุน (cost-effective) สถาปัตยกรรมของคุณมักจะผสมผสานหลายแนวทางเข้าด้วยกัน โดย implementation จะใช้ services ที่เจาะจงเพื่อ optimize ประสิทธิภาพของสถาปัตยกรรม

แนวปฏิบัติที่ดีมีดังนี้:

- **Understand the available services and resources** — ทำความเข้าใจ services และ resources ที่มีอยู่ ทั้ง instances, containers และ functions
- **Define a process for architectural choices** — ทำความเข้าใจ configuration options ต่าง ๆ ว่าเหมาะกับ workload อย่างไร เช่น instance family, sizes, ฟีเจอร์อย่าง GPU หรือ I/O, function sizes, container instances และ single เทียบกับ multi-tenancy
- **Factor cost requirements into decisions** — พิจารณา cost requirements เป็นส่วนหนึ่งของการตัดสินใจ เพื่อลดภาระงานด้าน operations และโฟกัสทรัพยากรไปที่ business outcomes
- **Use policies or reference architectures** — เพิ่มประสิทธิภาพสูงสุดโดยประเมินจาก internal policies และ reference architectures ที่มีอยู่ แล้วใช้ผลวิเคราะห์นั้นเลือก services และ configurations ให้ workload
- **Use guidance from your cloud provider or an appropriate partner** — ค้นคว้าทรัพยากรจากบริษัท cloud เช่น solutions architects, professional services หรือ partner ที่เหมาะสม เพื่อช่วยตรวจสอบและปรับปรุงสถาปัตยกรรมให้มีประสิทธิภาพสูงสุด
- **Benchmark existing workloads** — วัดผล (benchmark) ประสิทธิภาพของ workload ที่มีอยู่เพื่อเข้าใจว่ามันทำงานอย่างไรบน cloud แล้วใช้ข้อมูลจาก benchmark ขับเคลื่อนการตัดสินใจด้านสถาปัตยกรรม โดยทั่วไป benchmarking ตั้งค่าได้เร็วกว่า load testing และใช้ประเมินเทคโนโลยีของ component เฉพาะจุด
- **Load test your workload** — deploy สถาปัตยกรรม workload ล่าสุดบน cloud โดยใช้ resource types และขนาดต่าง ๆ แล้วเฝ้าติดตามการ deploy เพื่อจับ performance metrics ที่ระบุ bottlenecks หรือ capacity ส่วนเกิน แล้วใช้ข้อมูลนี้ในการออกแบบหรือปรับปรุงสถาปัตยกรรมและการเลือก resources

## Key terms
- Data-driven approach: แนวทางการตัดสินใจโดยอ้างอิงจากข้อมูลที่วัดผลได้จริง
- Benchmarking: การทดสอบวัดประสิทธิภาพของระบบด้วย synthetic tests เพื่อเปรียบเทียบ
- Load testing: การทดสอบ workload จริงภายใต้สภาวะการใช้งานเพื่อหา bottleneck และ capacity ที่เหมาะสม
