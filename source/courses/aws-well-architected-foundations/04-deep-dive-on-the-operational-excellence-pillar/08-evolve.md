# Evolve

## Evolve (1.23)
สไลด์เกริ่นนำ: Evolution คือวงจรการปรับปรุงอย่างต่อเนื่องตามเวลา — implement การเปลี่ยนแปลงเล็ก ๆ บ่อยครั้ง (frequent small incremental changes) โดยอิงจากบทเรียนที่ได้จาก operations activities และประเมินความสำเร็จของการปรับปรุงนั้น

## Learn, share, and improve (1.24)
สิ่งสำคัญคือต้องจัดเวลาอย่างสม่ำเสมอสำหรับการวิเคราะห์ operations activities, วิเคราะห์ความล้มเหลว, การทดลอง และการปรับปรุง เมื่อเกิดความล้มเหลว ทีมและ engineering community ที่กว้างขึ้นควรเรียนรู้จากมัน วิเคราะห์ความล้มเหลวเพื่อระบุบทเรียนและวางแผนปรับปรุง ทบทวนบทเรียนร่วมกับทีมอื่นเป็นประจำเพื่อยืนยัน insight

Best practices:

- **Have a process for continuous improvement** — ประเมิน workload เทียบกับ best practices ทั้งภายในและภายนอก จัด workload review อย่างน้อยปีละครั้ง จัดลำดับความสำคัญของโอกาสในการปรับปรุงเข้าสู่ software development cadence
- **Perform post-incident analysis** — ทบทวน customer-impacting events ระบุปัจจัยที่เกี่ยวข้องและมาตรการป้องกัน ใช้ข้อมูลนี้พัฒนา mitigation เพื่อจำกัด/ป้องกันไม่ให้เกิดซ้ำ
- **Perform knowledge management** — ช่วยให้สมาชิกในทีมค้นหาข้อมูลที่ต้องใช้ทำงานได้ ในองค์กรที่เป็น learning organization ข้อมูลจะถูกแชร์อย่างอิสระ ค้นหาได้ ถูกต้องและทันสมัย มีกลไกสร้าง/อัปเดต/archive ข้อมูล ตัวอย่างเช่น content management system อย่าง Wiki
- **Define drivers for improvement** — ช่วยประเมินและจัดลำดับความสำคัญของโอกาสในการปรับปรุง
- **Validate insights** — ทบทวนผลวิเคราะห์และการตอบสนองร่วมกับทีมข้ามสายงานและเจ้าของธุรกิจ เพื่อสร้างความเข้าใจร่วมกัน ระบุผลกระทบเพิ่มเติม และกำหนดแนวทางปฏิบัติ
- **Perform operations metrics reviews** — ทบทวนแบบ retrospective ของ operations metrics ร่วมกับทีมข้ามสายงานเป็นประจำ เพื่อระบุโอกาสปรับปรุงและแชร์บทเรียน มองหาโอกาสปรับปรุงในทุก environment (development, test, production)
- **Document and share lessons learned** — เพื่อใช้ภายในทีมและข้ามทีม เพิ่มประโยชน์ทั่วทั้งองค์กร ช่วยป้องกัน error ที่หลีกเลี่ยงได้และลดความพยายามในการพัฒนา
- **Allocate time to make improvements** — จัดสรรเวลาและ resources ภายในกระบวนการเพื่อให้เกิดการปรับปรุงแบบต่อเนื่อง (incremental) ได้จริง

## Key terms
- Post-incident analysis: การวิเคราะห์หลังเกิดเหตุการณ์เพื่อหาสาเหตุและวางมาตรการป้องกัน
- Knowledge management: การจัดการข้อมูล/ความรู้ให้ทีมเข้าถึงและใช้งานได้
- Retrospective: การทบทวนย้อนหลังเพื่อหาโอกาสปรับปรุง
