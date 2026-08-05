# Shared File Systems

บทเรียนนี้เกี่ยวกับ shared file system โดยเรียนรู้เรื่อง **Amazon Elastic File System (EFS)** และ **Amazon FSx**

## Amazon Elastic File System (Amazon EFS)

Amazon EFS มอบระบบไฟล์แบบ scalable และ elastic สำหรับ workload ที่ใช้ Linux เพื่อใช้งานร่วมกับบริการ AWS Cloud และทรัพยากรแบบ on-premises

สามารถสร้าง file system, mount file system นั้นบน Amazon EC2 instance แล้วอ่าน/เขียนข้อมูลเข้า-ออกจาก file system ได้ โดย mount Amazon EFS file system ใน VPC ผ่านโปรโตคอล **Network File System (NFS) version 4.0 และ 4.1 (NFSv4)** ไม่จำเป็นต้องดำเนินการใด ๆ เพื่อขยาย file system เมื่อความต้องการพื้นที่จัดเก็บเพิ่มขึ้น

ตัวอย่าง: VPC หนึ่งใช้ Amazon EFS standard storage class โดย VPC มี private subnet 3 subnet แต่ละ subnet อยู่คนละ Availability Zone ด้วย standard storage class แต่ละ subnet จะมี mount target ของตัวเอง โดย EC2 instance ในแต่ละ subnet สามารถเข้าถึง file system ผ่าน mount target ที่อยู่ใน AZ เดียวกัน

## Amazon FSx

Amazon FSx ช่วยให้เปิดใช้งานและรัน file system ที่มีฟีเจอร์ครบครันและประสิทธิภาพสูงได้อย่างรวดเร็ว บริการนี้มีให้เลือก 4 ประเภท โดยเลือกตามความคุ้นเคยกับ file system นั้น หรือตามชุดฟีเจอร์ โปรไฟล์ประสิทธิภาพ และความสามารถด้านการจัดการข้อมูลที่ต้องการ

### ประเภทของ Amazon FSx (flashcard 4 ใบ)

- **FSx for Windows File Server**: ให้บริการ Microsoft Windows file server แบบ fully managed ที่รองรับด้วย native Windows file system สร้างบน Windows Server มีฟีเจอร์ด้านการดูแลระบบมากมาย เช่น data deduplication, end-user file restore และ Microsoft Active Directory
- **FSx for Lustre**: บริการ fully managed ที่ให้ storage ประสิทธิภาพสูงและคุ้มค่า เข้ากันได้กับ Linux-based AMI ยอดนิยม เช่น Amazon Linux, Amazon Linux 2, Red Hat Enterprise Linux (RHEL), CentOS, SUSE Linux และ Ubuntu
- **FSx for NetApp ONTAP**: ให้บริการ shared storage แบบ fully managed บน AWS Cloud พร้อมความสามารถด้านการเข้าถึงและจัดการข้อมูลของ ONTAP
- **FSx for OpenZFS**: ให้บริการ shared file storage แบบ fully managed สร้างบนระบบไฟล์ OpenZFS ขับเคลื่อนด้วยตระกูลโปรเซสเซอร์ AWS Graviton เข้าถึงได้ผ่านโปรโตคอล NFS (v3, v4, v4.1, v4.2)

บทเรียนถัดไปจะพูดถึงเครื่องมือสำหรับการย้ายข้อมูล (data migration tools) ระหว่าง file system ต่าง ๆ

## Key terms
- Amazon EFS: บริการ file storage แบบ elastic สำหรับ Linux workload บน AWS
- NFSv4: โปรโตคอล Network File System เวอร์ชัน 4.0/4.1 ที่ใช้ mount Amazon EFS
- Mount target: จุดเชื่อมต่อของ EFS file system ในแต่ละ Availability Zone/subnet
- Amazon FSx: กลุ่มบริการ managed file system 4 ประเภท (Windows File Server, Lustre, NetApp ONTAP, OpenZFS)
- AWS Graviton: ตระกูลโปรเซสเซอร์ ARM ที่ AWS พัฒนาเอง
