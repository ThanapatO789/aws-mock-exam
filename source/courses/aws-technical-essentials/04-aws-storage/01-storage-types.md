# Storage Types

AWS storage services แบ่งออกเป็น 3 ประเภทหลัก ได้แก่ file storage, block storage, และ object storage

- **File storage**: เก็บข้อมูลเป็นไฟล์ในโครงสร้างแบบลำดับชั้น (hierarchy)
- **Block storage**: เก็บข้อมูลเป็นบล็อกขนาดคงที่ (fixed-size blocks)
- **Object storage**: เก็บข้อมูลเป็น objects ใน buckets

## File storage

คล้ายกับระบบไฟล์ที่คุ้นเคย เช่น Windows File Explorer หรือ Finder บน macOS ไฟล์ถูกจัดเรียงเป็นโครงสร้างแบบต้นไม้ (tree-like hierarchy) ที่ประกอบด้วย folders และ subfolders แต่ละไฟล์มี metadata เช่น ชื่อไฟล์ ขนาดไฟล์ และวันที่สร้าง รวมถึงมี path สำหรับใช้ค้นหาไฟล์ในโครงสร้าง

File storage เหมาะสำหรับกรณีที่ต้องการ centralized access ไปยังไฟล์ที่ต้องแชร์และจัดการโดย host computers หลายเครื่อง โดยทั่วไป storage นี้จะถูก mount เข้ากับหลาย hosts และต้องมี file locking รวมถึง integration กับ file system communication protocols ที่มีอยู่

### Use cases สำหรับ file storage

- **Web serving**: cloud file storage รองรับ file-level protocols, file naming conventions และ permissions ที่นักพัฒนาคุ้นเคย จึงสามารถ integrate เข้ากับ web applications ได้
- **Analytics**: workload ด้าน analytics จำนวนมากต้องการ interact กับข้อมูลผ่าน file interface และต้องใช้ features เช่น file lock หรือการเขียนบางส่วนของไฟล์ cloud-based file storage รองรับ file-level protocols และสามารถ scale capacity/performance ได้ จึงเหมาะกับ analytics workflows
- **Media and entertainment**: ธุรกิจจำนวนมากใช้ hybrid cloud deployment และต้องการ standardized access ผ่าน file system protocols (NFS หรือ SMB) หรือ concurrent protocol access เพื่อรองรับ content production, digital supply chains, media streaming, broadcast playout, analytics และ archive
- **Home directories**: ธุรกิจที่ต้องการใช้ประโยชน์จาก scalability และ cost benefits ของ cloud สามารถขยาย home directories ให้ผู้ใช้จำนวนมาก โดย cloud file storage รองรับ file-level protocols และ standard permissions models ทำให้สามารถ lift-and-shift applications ที่ต้องการ capability นี้ขึ้น cloud ได้

## Block storage

ต่างจาก file storage ที่มองไฟล์เป็นหน่วยเดียว block storage แบ่งไฟล์ออกเป็นชิ้นข้อมูลขนาดคงที่ (fixed-size chunks) เรียกว่า blocks ซึ่งแต่ละ block มี address ของตัวเอง เป็นหน่วยข้อมูลที่ addressable ทำให้สามารถดึงข้อมูลได้อย่างมีประสิทธิภาพ เปรียบเสมือนเส้นทางตรงในการเข้าถึงข้อมูล เมื่อมีการร้องขอข้อมูล ระบบจะใช้ address ของแต่ละ block เพื่อจัดเรียงลำดับให้กลับมาเป็นไฟล์ที่สมบูรณ์ โดยไม่มี metadata เพิ่มเติมนอกเหนือจาก address ที่ผูกกับแต่ละ block

**การเปลี่ยนแปลง 1 ตัวอักษรในไฟล์ขนาด 1-GB**: ด้วย block storage หากต้องการเปลี่ยนตัวอักษรเดียวในไฟล์ เพียงแค่เปลี่ยน block (ชิ้นส่วนของไฟล์) ที่มีตัวอักษรนั้นอยู่ ความง่ายในการเข้าถึงนี้ทำให้ block storage รวดเร็วและใช้ bandwidth น้อยกว่า

### Use cases สำหรับ block storage

Block storage เหมาะกับ workload ที่ต้องการ low-latency จึงเป็นตัวเลือกที่นิยมสำหรับ high-performance enterprise workloads และงานที่เป็น transactional, mission-critical และ I/O-intensive

- **Transactional workloads**: องค์กรที่ประมวลผล transaction ที่ time-sensitive และ mission-critical จะเก็บ workload เหล่านี้ไว้ใน database ที่มี low-latency, high-capacity และ fault-tolerant block storage ช่วยให้นักพัฒนาสร้าง database ที่ robust, scalable และมีประสิทธิภาพสูงได้ เพราะแต่ละ block เป็นหน่วยที่ self-contained ทำให้ database ทำงานได้ดีแม้ข้อมูลจะเติบโต
- **Containers**: นักพัฒนาใช้ block storage เก็บ containerized applications บน cloud containers คือ software packages ที่รวม application และ resource files ไว้สำหรับ deploy ในสภาพแวดล้อม computing ใดก็ได้ block storage มีความยืดหยุ่น, scalable และมีประสิทธิภาพเช่นเดียวกับ containers ทำให้นักพัฒนาสามารถย้าย containers ระหว่าง servers, locations และ operating environments ได้อย่างราบรื่น
- **Virtual machines**: block storage รองรับ VM hypervisors ยอดนิยม ผู้ใช้สามารถติดตั้ง operating system, file system และ computing resources อื่นๆ บน block storage volume โดย format volume นั้นให้กลายเป็น VM file system จึงสามารถเพิ่ม/ลดขนาด virtual drive และย้าย virtualized storage จาก host หนึ่งไปอีก host หนึ่งได้ง่าย

## Object storage

ใน object storage ไฟล์ถูกเก็บเป็น objects ซึ่งเหมือนไฟล์ตรงที่เป็นหน่วยข้อมูลเดี่ยว (single, distinct unit) แต่ต่างจาก file storage ตรงที่ object ถูกเก็บใน bucket โดยใช้โครงสร้างแบบ flat ไม่มี folders, directories หรือ hierarchy ที่ซับซ้อน แต่ละ object มี unique identifier ซึ่งถูก bundle ไปพร้อมกับข้อมูลและ metadata เพิ่มเติมแล้วจัดเก็บไว้ด้วยกัน

**การเปลี่ยนแปลง 1 ตัวอักษรในไฟล์ขนาด 1-GB**: การเปลี่ยนตัวอักษรเดียวใน object ทำได้ยากกว่า block storage เพราะเมื่อต้องการเปลี่ยนตัวอักษรใน object ทั้ง object จะต้องถูก update ใหม่ทั้งหมด

### Use cases สำหรับ object storage

Object storage สามารถเก็บข้อมูลได้แทบทุกประเภท และไม่มีขีดจำกัดจำนวน objects ที่เก็บได้ ทำให้ scalable ได้ง่าย เหมาะกับการเก็บ large หรือ unstructured data sets

- **Data archiving**: cloud object storage เหมาะสำหรับการเก็บข้อมูลระยะยาว (long-term data retention) สามารถ archive rich media content จำนวนมากอย่างคุ้มค่า และเก็บ regulatory data ตามที่กฎหมายกำหนดได้เป็นเวลานาน รวมถึงใช้แทน on-premises tape และ disk archive infrastructure ได้ โดยให้ durability, immediate retrieval times, security/compliance และ data accessibility ที่ดีกว่า
- **Backup and recovery**: สามารถ configure object storage ให้ replicate content เพื่อให้มี duplicate object storage devices พร้อมใช้งานหากอุปกรณ์จริงล่ม ทำให้ระบบและ applications ทำงานต่อได้โดยไม่สะดุด และสามารถ replicate ข้าม data centers และภูมิภาคต่างๆ ได้
- **Rich media**: object storage ช่วยเร่งความเร็ว applications และลดต้นทุนในการเก็บไฟล์ rich media เช่น videos, digital images และ music โดยใช้ storage classes และ replication features สามารถสร้าง architecture ที่ cost-effective และ replicate ทั่วโลกเพื่อส่ง media ไปยังผู้ใช้ที่กระจายตัวอยู่

## เชื่อมโยงกับระบบ storage แบบดั้งเดิม

หากเคยใช้งาน on-premises storage มาก่อน อาจคุ้นเคยกับ block, file และ object storage อยู่แล้ว โดยเทียบได้ดังนี้

- **Block storage** บน cloud เทียบได้กับ direct-attached storage (DAS) หรือ storage area network (SAN)
- **File storage** systems มักถูกรองรับด้วย network-attached storage (NAS) server

การเพิ่ม storage ใน data center แบบดั้งเดิมเป็นกระบวนการที่ค่อนข้างตายตัว (rigid) ต้องซื้อ ติดตั้ง และ configure storage solutions แต่ด้วย cloud computing กระบวนการมีความยืดหยุ่นมากขึ้น สามารถสร้าง ลบ และแก้ไข storage solutions ได้ภายในไม่กี่นาที

## Key terms
- File storage: การเก็บข้อมูลแบบไฟล์ในโครงสร้างลำดับชั้น (folders/subfolders)
- Block storage: การเก็บข้อมูลเป็นชิ้นขนาดคงที่ (blocks) ที่ addressable แยกกัน
- Object storage: การเก็บข้อมูลเป็น objects ใน flat structure (buckets) พร้อม unique identifier และ metadata
- DAS (direct-attached storage): storage ที่เชื่อมต่อโดยตรงกับเครื่อง
- SAN (storage area network): เครือข่าย storage แบบ block-level
- NAS (network-attached storage): server สำหรับ file storage ผ่านเครือข่าย
