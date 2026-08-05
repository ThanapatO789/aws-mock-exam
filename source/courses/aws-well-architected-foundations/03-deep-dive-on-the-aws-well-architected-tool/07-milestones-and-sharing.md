# AWS Well-Architected Tool (milestones) / sharing

## AWS Well-Architected Tool (milestones) (1.11)
**Milestones** เป็นกลไกใช้ติดตามการเปลี่ยนแปลงของ workload เมื่อเวลาผ่านไป

- โดยทั่วไปจะสร้าง milestone หลังจากทำ initial review เสร็จแล้ว
- เมื่อมีการปรับปรุง/เปลี่ยนแปลง workload สามารถอัปเดตคำตอบ, บันทึก (notes) และ best practices เพื่อสะท้อนการเปลี่ยนแปลงนั้น จากนั้นสร้าง **milestone ใหม่** เพื่อช่วยติดตามความคืบหน้าและการปรับปรุงตลอดเวลา
- เลือก milestone ที่สร้างไว้ตามชื่อ (**Milestone names**) แล้วกด **Generate report** — รายงานจะอิงจากสถานะการ review ณ จุดเวลาที่บันทึก milestone นั้น
- สามารถ **View milestone** เพื่อดูรายละเอียด milestone ใด ๆ รวมถึง milestone ปัจจุบันได้

## AWS Well-Architected Tool sharing (1.12)
อีกฟีเจอร์สำคัญคือความสามารถ **แชร์ workload** กับผู้ใช้อื่น, account อื่น หรือแม้แต่ผ่าน AWS Organizations

- หากแชร์ workload กับหลาย principal จะมีตัวเลือก **Search and filter** เพื่อช่วยค้นหา share ที่มีอยู่
- ในรายละเอียดการแชร์ สามารถดู **Principal shared with** ว่าเป็น IAM user, AWS account อื่น หรือ AWS organization
- สามารถตรวจสอบ **Share status** ว่าอยู่ในสถานะ pending หรือ accepted และสิทธิ์ (permissions) ที่มอบให้ principal อื่นคืออะไร
- มีตัวเลือก **New share options** สำหรับสร้างการแชร์ใหม่

## Key terms
- Milestone: จุดบันทึกความคืบหน้าของ workload ณ เวลาใดเวลาหนึ่ง
- Principal: ผู้ใช้/account/organization ที่ได้รับการแชร์ workload
- Share status: สถานะการแชร์ (pending/accepted)
