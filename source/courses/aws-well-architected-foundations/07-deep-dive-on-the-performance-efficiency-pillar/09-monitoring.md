# Monitoring

## Monitoring (1.18)
Monitoring คือ best practice area ที่สาม ของ performance efficiency pillar

## Monitor resources to ensure expected performance (1.19)
เมื่อ implement workload แล้ว ให้เฝ้าติดตาม (monitor) resources เพื่อแก้ไขปัญหาหรือความเบี่ยงเบนจากระดับประสิทธิภาพที่คาดหวังไว้

แนวปฏิบัติที่ดีมีดังนี้:

- **Record performance-related metrics** — ใช้ monitoring และ observability service บันทึก metrics ที่เกี่ยวกับประสิทธิภาพ เช่น database transactions, slow queries, I/O latency, HTTP request throughput, service latency หรือข้อมูลสำคัญอื่น ๆ
- **Analyze metrics when events or incidents occur** — ใช้ monitoring dashboards หรือ reports เพื่อทำความเข้าใจและวินิจฉัยผลกระทบเมื่อเกิดเหตุการณ์หรือ incident โดย views เหล่านี้ช่วยให้เห็นว่าส่วนใดของ workload ที่ทำงานไม่เป็นไปตามที่คาดหวัง
- **Establish KPIs to measure workload performance** — กำหนด key performance indicators (KPIs) เพื่อวัดประสิทธิภาพของ workload เช่น workload แบบ API อาจใช้ overall response latency เป็นตัวชี้วัดประสิทธิภาพโดยรวม หรือเว็บไซต์ e-commerce อาจเลือกใช้จำนวนการซื้อ (purchases) เป็น KPI จากนั้นใช้ระบบ monitoring ที่สร้าง alarm อัตโนมัติเมื่อค่าที่วัดได้อยู่นอกขอบเขตที่คาดไว้
- **Use monitoring to generate alarm-based notifications** — ใช้ KPIs ร่วมกับระบบ monitoring และ alerting เพื่อสร้าง alarm อัตโนมัติ
- **Review metrics at regular intervals** — ทบทวน metrics ที่เก็บรวบรวมเป็นประจำ ทั้งในฐานะการบำรุงรักษาตามปกติหรือเพื่อตอบสนองต่อเหตุการณ์/incident เพื่อระบุว่า metrics ใดสำคัญต่อการแก้ไขปัญหา และ metrics เพิ่มเติมใดที่ควรติดตามเพื่อช่วยระบุ แก้ไข หรือป้องกันปัญหาในอนาคต
- **Monitor and alarm proactively** — ใช้ KPIs ร่วมกับระบบ monitoring และ alerting เพื่อแก้ไขปัญหาด้านประสิทธิภาพเชิงรุก (proactively) ใช้ alarms เพื่อ automate การดำเนินการและแก้ไขปัญหาเมื่อเป็นไปได้ หากไม่สามารถ automate ได้ ให้ escalate alarm ไปยังผู้ที่สามารถตอบสนองได้ เช่น ระบบที่คาดการณ์ค่า KPI ที่คาดหวังและส่ง alarm เมื่อค่าเกินขอบเขตที่กำหนด หรือระบบที่หยุดหรือ rollback การ deploy โดยอัตโนมัติเมื่อ KPI อยู่นอกค่าที่คาดไว้

## Key terms
- KPI (Key Performance Indicator): ตัวชี้วัดหลักที่ใช้ประเมินประสิทธิภาพการทำงานของระบบหรือ workload
- Observability: ความสามารถในการมองเห็นสถานะภายในของระบบผ่านข้อมูลที่ระบบผลิตออกมา เช่น logs, metrics, traces
