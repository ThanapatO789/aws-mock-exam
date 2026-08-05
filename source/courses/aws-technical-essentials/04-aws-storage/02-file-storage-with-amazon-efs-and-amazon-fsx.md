# File Storage with Amazon EFS and Amazon FSx

ใช้บริการ cloud storage หลายแบบเพื่อย้ายไปใช้ managed file storage ได้โดยไม่ต้องเปลี่ยนแปลง application หรือ workflow เดิม

## Amazon Elastic File System (Amazon EFS)

**Amazon EFS** เป็น file system แบบ "set-and-forget" ที่ขยาย (grow) และหด (shrink) ขนาดโดยอัตโนมัติเมื่อมีการเพิ่ม/ลบไฟล์ ไม่ต้อง provision หรือจัดการ storage capacity และ performance เอง ใช้งานร่วมกับ AWS compute services และ on-premises resources ได้ สามารถเชื่อมต่อ compute instance ได้พร้อมกันหลักสิบ หลักร้อย ไปจนถึงหลักพัน instance เข้ากับ Amazon EFS file system เดียวกันได้ในเวลาเดียวกัน โดยยังคง performance ที่สม่ำเสมอให้กับแต่ละ compute instance

ผ่านหน้าเว็บ interface ที่เรียบง่ายของ Amazon EFS สามารถสร้างและกำหนดค่า file system ได้อย่างรวดเร็วโดยไม่มีค่าธรรมเนียมขั้นต่ำหรือค่าใช้จ่ายในการติดตั้ง จ่ายเฉพาะพื้นที่ storage ที่ใช้จริง และเลือก storage class ได้ตามความเหมาะสมกับ use case:

- **Standard storage classes** — EFS Standard และ EFS Standard-Infrequent Access (Standard-IA) ให้ความทนทานระดับ Multi-AZ resilience และระดับ durability/availability สูงสุด
- **One zone storage classes** — EFS One Zone และ EFS One Zone-Infrequent Access (EFS One Zone-IA) ช่วยประหยัดค่าใช้จ่ายเพิ่มเติมโดยเก็บข้อมูลไว้ใน availability zone เดียว

## Amazon FSx

**Amazon FSx** เป็น fully managed service ที่ให้ความน่าเชื่อถือ (reliability) ความปลอดภัย (security) ความสามารถในการขยายตัว (scalability) และชุดความสามารถที่หลากหลาย ทำให้สะดวกและคุ้มค่าในการเปิดใช้ ดำเนินการ และขยาย high-performance file system บน cloud ได้ ผู้ใช้สามารถเลือกใช้ file system ได้ 4 แบบที่นิยมใช้กันอย่างแพร่หลาย ได้แก่ **Lustre**, **NetApp ONTAP**, **OpenZFS** และ **Windows File Server** โดยเลือกตามความคุ้นเคยกับ file system นั้นๆ หรือตามความต้องการของ workload ในด้าน feature sets, performance profiles และ data management capabilities

### Amazon FSx for NetApp ONTAP (เนื้อหาจาก accordion ที่ขยายแล้ว)
**Amazon FSx for NetApp ONTAP** เป็น fully managed service ที่รวมความสามารถ, performance, และ API operations ที่คุ้นเคยของ NetApp file system แบบ on-premises เข้ากับความคล่องตัว (agility), ความสามารถในการขยายตัว (scalability) และความง่ายของ fully managed AWS service สามารถใช้เป็น drop-in replacement สำหรับ ONTAP deployment เดิมได้ ทำให้ลูกค้าสามารถเปิดใช้และรัน ONTAP file system บน cloud ได้ทันที มี data management feature ที่หลากหลายและ shared file storage ที่เข้าถึงได้จาก Linux, Windows และ macOS compute instance ทั้งที่รันบน AWS หรือ on-premises

### Amazon FSx for OpenZFS (เนื้อหาจาก accordion ที่ขยายแล้ว)
**Amazon FSx for OpenZFS** เป็น fully managed file storage service ที่ช่วยย้ายข้อมูลจาก on-premises ZFS หรือ Linux-based file server อื่นๆ มายัง AWS ได้โดยไม่ต้องเปลี่ยน application code หรือวิธีจัดการข้อมูล ไม่ต้องกังวลเรื่องการตั้งค่าและ provision file server กับ storage volume ไม่ต้อง replicate ข้อมูล ติดตั้ง/patch software ของ file server เอง ตรวจจับและแก้ปัญหา hardware failure หรือทำ backup ด้วยตนเอง FSx for OpenZFS ให้ performance ชั้นนำสำหรับ workload ที่ latency-sensitive และไฟล์ขนาดเล็ก พร้อม NAS data management capability ยอดนิยม (snapshots และ cloning) ในราคาที่ต่ำกว่าทางเลือกที่ต้องซื้อ license เชิงพาณิชย์

### Amazon FSx for Windows File Server (เนื้อหาจาก accordion ที่ขยายแล้ว)
**Amazon FSx for Windows File Server** ให้บริการ Microsoft Windows file server แบบ fully managed ที่มีความน่าเชื่อถือและขยายตัวได้ โดยใช้ native Windows file system เป็นพื้นฐาน เข้าถึงได้ผ่าน protocol SMB (Service Message Block) และสามารถใช้เป็น drop-in replacement สำหรับ Windows file server deployment เดิม ในฐานะ fully managed service จะช่วยลดงาน administrative ในการตั้งค่าและ provision file server กับ storage volume และช่วยให้ลูกค้าที่สร้างและรัน Windows application ใช้งานได้ง่ายขึ้น

### Amazon FSx for Lustre (เนื้อหาจาก accordion ที่ขยายแล้ว)
**Amazon FSx for Lustre** ใช้ open-source Lustre file system ซึ่งออกแบบมาสำหรับ application ที่ต้องการ storage ความเร็วสูง ที่สามารถตามทัน compute ได้ ช่วยให้เปิดใช้ ดำเนินการ และขยาย high-performance file system ยอดนิยมนี้ได้อย่างคุ้มค่า สามารถเชื่อมโยง FSx for Lustre file system เข้ากับ data repository บน **Amazon S3** หรือกับ on-premises data store ได้ FSx for Lustre ให้ throughput สูงสุดถึง 1+ TB/s และ IOPS ระดับหลายล้าน ลูกค้าสามารถ integrate เข้าถึง และประมวลผล dataset บน Amazon S3 ได้อย่างไร้รอยต่อผ่าน high-performance Lustre file system

## Key terms
- Amazon EFS: managed elastic file system ที่ขยาย/หดขนาดอัตโนมัติ ใช้ร่วมกับ compute instance จำนวนมากพร้อมกันได้
- Amazon FSx: managed service สำหรับ high-performance file system หลายชนิด (Lustre, NetApp ONTAP, OpenZFS, Windows File Server)
- Standard-IA / One Zone-IA: EFS storage class สำหรับข้อมูลที่เข้าถึงไม่บ่อย (Infrequent Access) เพื่อลดต้นทุน
- SMB (Service Message Block): protocol ที่ FSx for Windows File Server ใช้ในการเข้าถึงไฟล์
