# Infrastructure Management

หลังจากสร้าง cloud infrastructure ด้วย **AWS CloudFormation** แล้ว ขั้นต่อไปคือการ deploy, maintain และ scale application บน cloud บทเรียนนี้แนะนำการจัดการ cloud infrastructure

## Infrastructure tools

เมื่อเลือกเครื่องมือ deploy infrastructure ต้องหาสมดุลระหว่าง convenience (ความสะดวก) และ control (การควบคุม) บางเครื่องมือให้การควบคุมแบบเต็มที่ ให้คุณเลือก component และ configuration ทุกอย่างเอง — customize deployment ให้ตรงกับความต้องการทางธุรกิจได้ แต่ต้องใช้ความเชี่ยวชาญและ resource ในการจัดการ/บำรุงรักษามากกว่า ส่วนเครื่องมืออื่น ๆ ออกแบบมาเพื่อความสะดวก มี infrastructure template ที่ preconfigured ไว้สำหรับ solution ทั่วไป ใช้งานง่ายกว่าและบำรุงรักษาน้อยกว่า แต่ปรับแต่ง component ของ infrastructure ได้ไม่เต็มที่เสมอไป

### AWS Elastic Beanstalk

Elastic Beanstalk configure EC2 instance แต่ละตัวใน environment ด้วย component ที่จำเป็นสำหรับรัน application ตาม application type ที่เลือก โดยไม่ต้องกังวลเรื่อง login เข้า instance เพื่อติดตั้งและ configure application stack เอง สามารถใช้ Elastic Beanstalk เพื่อ provision infrastructure ที่รองรับ application design ทั่วไป เช่น web application และ worker service

### AWS Solutions Library

AWS Solutions Library ช่วยแก้ปัญหาทั่วไปและสร้างได้เร็วขึ้น solution ต่าง ๆ ผ่านการตรวจสอบจาก AWS architect และออกแบบมาให้มีประสิทธิภาพในการดำเนินงาน (operationally effective), reliable, secure และคุ้มค่า AWS solution จำนวนมากมาพร้อม prebuilt CloudFormation template และอาจรวมถึง architecture โดยละเอียด, deployment guide และคำแนะนำสำหรับการ deploy ทั้งแบบ automated และ manual

### AWS Cloud Development Kit (AWS CDK)

AWS CDK คือ software development framework ที่ define cloud application resource ผ่าน declarative model และภาษาโปรแกรมมิ่งที่คุ้นเคย CDK มี library ของ construct ที่ customize ได้ ซึ่งเป็น building block ประกอบด้วย resource ตั้งแต่หนึ่งตัวขึ้นไปพร้อม configuration ทั่วไป สามารถใช้ AWS CDK เพื่อ generate CloudFormation template และ deploy infrastructure พร้อมกับ application runtime asset ได้ รองรับภาษาโปรแกรมมิ่งยอดนิยม เช่น Python, JavaScript, TypeScript, Java หรือ C#

### AWS Systems Manager

AWS Systems Manager คือชุดความสามารถ (collection of capabilities) ที่ช่วยจัดการ application และ infrastructure ที่รันอยู่บน AWS Cloud ช่วยลดความซับซ้อนในการจัดการ application/resource ลดเวลาในการตรวจจับและแก้ปัญหาด้าน operation และช่วยจัดการ AWS resource อย่างปลอดภัยในระดับ scale

Systems Manager เป็นศูนย์กลางในการดูและจัดการ AWS resource ทำให้มองเห็นและควบคุม operation ได้ ด้วย Systems Manager คุณสามารถ:
- สร้างกลุ่มของ resource แบบ logical เช่น application, layer ต่าง ๆ ของ application stack หรือ development/production environment
- เลือก resource group แล้วดู API activity ล่าสุด, การเปลี่ยนแปลง resource configuration, notification ที่เกี่ยวข้อง, operational alert, software inventory และสถานะ patch compliance
- ดำเนินการ (take action) กับแต่ละ resource group ตามความต้องการด้าน operation
- รวมศูนย์ operational data จากหลาย AWS service และ automate task ต่าง ๆ ข้าม AWS resource

## Key terms
- AWS Elastic Beanstalk: บริการที่ configure EC2 instance ให้อัตโนมัติตาม application type เพื่อรัน application โดยไม่ต้องจัดการ infrastructure เอง
- AWS Solutions Library: แหล่งรวม solution ที่ผ่านการตรวจสอบจาก AWS พร้อม prebuilt CloudFormation template
- AWS Cloud Development Kit (AWS CDK): framework สำหรับ define infrastructure ด้วยภาษาโปรแกรมมิ่งทั่วไป แล้ว generate เป็น CloudFormation template
- AWS Systems Manager: บริการรวมศูนย์สำหรับดูและจัดการ AWS resource/operation อย่างปลอดภัยในระดับ scale
