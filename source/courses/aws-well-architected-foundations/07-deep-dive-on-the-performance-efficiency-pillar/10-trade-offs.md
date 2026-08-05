# Trade-offs

## Trade-offs (1.20)
Trade-offs คือ best practice area สุดท้าย ของ performance efficiency pillar

## Using trade-offs to improve performance (1.21)
การใช้ trade-offs เพื่อปรับปรุงประสิทธิภาพเมื่อออกแบบ solution ช่วยให้เลือกแนวทางที่เหมาะสมที่สุดได้ บ่อยครั้งคุณสามารถปรับปรุงประสิทธิภาพได้โดยการแลกเปลี่ยน (trading) consistency, durability และ พื้นที่ (space) เพื่อแลกกับเวลา (time) และ latency ที่ดีขึ้น

แนวปฏิบัติที่ดีมีดังนี้:

- **Understand areas where performance is most critical** — ทำความเข้าใจและระบุพื้นที่ที่การเพิ่มประสิทธิภาพของ workload จะส่งผลบวกต่อประสิทธิภาพโดยรวมหรือประสบการณ์ลูกค้ามากที่สุด เช่น เว็บไซต์ที่มี customer interaction สูงอาจได้ประโยชน์จากการใช้ edge services เพื่อย้าย content delivery ให้เข้าใกล้ลูกค้ามากขึ้น
- **Learn about design patterns and services** — ศึกษาและทำความเข้าใจ design patterns และ services ต่าง ๆ ที่ช่วยปรับปรุงประสิทธิภาพของ workload เป็นส่วนหนึ่งของการวิเคราะห์ว่าอะไรที่สามารถแลกเปลี่ยนได้เพื่อให้ได้ประสิทธิภาพที่สูงขึ้น เช่น การใช้ cache service ช่วยลด load ที่เกิดกับระบบ database ได้ แต่ก็อาจต้องใช้ engineering เพิ่มเติมเพื่อ implement caching อย่างปลอดภัย หรืออาจทำให้เกิด eventual consistency ในบางส่วน
- **Identify how trade-offs impact customers and efficiency** — ประเมินว่าตัวเลือกด้านประสิทธิภาพส่งผลต่อลูกค้าและประสิทธิภาพของ workload อย่างไร เช่น หากใช้ key-value data store เพื่อเพิ่มประสิทธิภาพของระบบ ต้องประเมินด้วยว่าธรรมชาติแบบ eventually consistent ของมันจะส่งผลต่อลูกค้าอย่างไร
- **Measure impact of performance improvements** — เมื่อมีการเปลี่ยนแปลงเพื่อปรับปรุงประสิทธิภาพ ให้ประเมิน metrics และข้อมูลที่เก็บรวบรวมได้ ใช้ข้อมูลนี้พิจารณาผลกระทบที่การปรับปรุงประสิทธิภาพมีต่อ workload, components ของ workload และลูกค้า การวัดผลนี้ช่วยให้เข้าใจการปรับปรุงที่เกิดจาก trade-off และช่วยระบุผลข้างเคียงเชิงลบที่อาจเกิดขึ้นได้ด้วย
- **Use various performance-related strategies** — ใช้กลยุทธ์ด้านประสิทธิภาพที่หลากหลายตามความเหมาะสม เช่น caching ข้อมูลเพื่อลดการเรียก network หรือ database ที่มากเกินไป ใช้ read replicas สำหรับ database engines เพื่อเพิ่มอัตราการอ่าน ใช้กลยุทธ์อย่าง sharding หรือการบีบอัดข้อมูล (compressing) เพื่อลดปริมาณข้อมูล และใช้ buffering กับ streaming ผลลัพธ์เมื่อพร้อมใช้งานเพื่อหลีกเลี่ยงการ blocking

## Key terms
- Eventual consistency: รูปแบบความสอดคล้องของข้อมูลที่ระบบจะ sync ข้อมูลให้ตรงกันในที่สุด แต่ไม่ได้รับประกันความสอดคล้องแบบทันที
- Sharding: การแบ่งข้อมูลออกเป็นส่วนย่อย (shards) เพื่อกระจายโหลดและเพิ่มประสิทธิภาพ
- Read replica: สำเนาของ database ที่ใช้สำหรับรองรับการอ่านข้อมูล เพื่อลดภาระของ database หลัก
