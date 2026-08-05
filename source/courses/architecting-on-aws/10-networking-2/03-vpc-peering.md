# VPC Peering

**VPC peering** คือการเชื่อมต่อ VPC หลายตัวให้สื่อสารและทำงานร่วมกันได้ตามความต้องการของแอปพลิเคชัน บทเรียนนี้อธิบายวิธี route traffic แบบ private ระหว่าง VPC มีวิดีโอผู้สอนความยาว 4 นาที 25 วินาที

## แนวคิดพื้นฐาน

**VPC peering connection** เป็นความสัมพันธ์แบบ **one-to-one** ระหว่างสอง VPC — มี peering resource ได้เพียงหนึ่งเดียวระหว่าง VPC คู่ใดคู่หนึ่ง แต่สามารถสร้าง VPC peering connection หลายรายการสำหรับแต่ละ VPC ที่คุณเป็นเจ้าของได้

ข้อจำกัดและกฎของ VPC peering:

- มีขีดจำกัดจำนวน active และ pending VPC peering connection ต่อ VPC
- มี VPC peering connection ได้เพียงหนึ่งรายการระหว่าง VPC คู่เดียวกัน
- **Maximum transmission unit (MTU)** ข้าม VPC peering connection อยู่ที่ 1,500 bytes

ในไดอะแกรมตัวอย่าง VPC A และ VPC B ถูก peer กัน โดย route table ของแต่ละ VPC มี route ที่ระบุ CIDR range ของอีกฝั่ง targeting ไปยัง peering connection ทำให้เชื่อมต่อกันได้โดยตรง

## ประโยชน์ของ VPC peering

- **หลีกเลี่ยง single point of failure และ bandwidth bottleneck** — inter-Region traffic ทั้งหมดถูกเข้ารหัส ไม่มี single point of failure หรือ bandwidth bottleneck traffic จะอยู่บน AWS global backbone เสมอ ไม่ผ่านอินเทอร์เน็ตสาธารณะ ช่วยลดความเสี่ยงจาก exploit และ distributed denial of service (DDoS) attack
- **ใช้ private IP address** ในการ route traffic — traffic ของ VPC peering อยู่ใน private IP space

### VPC peering สำหรับ shared services

ตัวอย่าง: ทีม security จัดเตรียม shared services VPC ให้แต่ละแผนก peer เข้ามาใช้งาน ทำให้ resource ต่าง ๆ เชื่อมต่อกับ shared directory service, security scanning tools, monitoring/logging tools และ service อื่น ๆ ได้

### Inter-Region VPC peering

**Inter-Region VPC peering** ทำให้ resource ใน VPC ที่รันอยู่คนละ AWS Region สื่อสารกันได้ด้วย private IP address โดยไม่ต้องใช้ gateway, VPN connection หรือ hardware แยกต่างหากในการส่ง traffic ข้าม Region

### Full mesh VPC peering

สามารถออกแบบเครือข่ายแบบ **full mesh** ด้วย VPC peering เพื่อเชื่อมต่อทุก VPC เข้ากับ VPC อื่นทั้งหมดในองค์กรได้ แต่ในสถาปัตยกรรมนี้ แต่ละ VPC ต้องมี connection แบบ one-to-one กับทุก VPC ที่ได้รับอนุญาตให้สื่อสารด้วย เพราะ **VPC peering connection แต่ละอันเป็น nontransitive** — ไม่อนุญาตให้ traffic ไหลผ่านจาก peering connection หนึ่งไปยังอีกอันหนึ่งได้

จำนวน connection ที่ต้องสร้างส่งผลโดยตรงต่อจำนวน potential point of failure และภาระในการ monitor

บทเรียนถัดไปจะกล่าวถึง hybrid networking

## Key terms
- VPC peering connection: การเชื่อมต่อแบบ one-to-one ระหว่างสอง VPC
- MTU (Maximum transmission unit): ขนาดแพ็กเก็ตสูงสุดที่ส่งผ่าน VPC peering ได้ (1,500 bytes)
- Inter-Region VPC peering: VPC peering ข้าม AWS Region โดยใช้ private IP address
- Full mesh VPC peering: การ peer ทุก VPC เข้าหากันทั้งหมดในองค์กร
- Nontransitive: คุณสมบัติของ VPC peering ที่ traffic ไม่สามารถไหลผ่านต่อจาก peering connection หนึ่งไปยังอีกอันได้
