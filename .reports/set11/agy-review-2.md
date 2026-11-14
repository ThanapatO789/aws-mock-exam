## Errors
- None.

## Weak spots
- Q693: ย่อหน้า `"เลือก CloudFront ตัวเดียว (ตามคำตอบเดิมของเว็บ) ไม่พอ เพราะไม่ได้แก้เรื่องไฟล์ raw ที่ใหญ่ และโจทย์ให้เลือก 2 ข้อ"` มีหมายเหตุเบื้องหลังการตรวจคำตอบ (`ตามคำตอบเดิมของเว็บ`) ติดเข้าไปในคำอธิบายสำหรับผู้เรียน → ตัดย่อหน้านี้ออก หรือแก้เป็น `"การใช้ CloudFront เพียงอย่างเดียวไม่พอ เพราะช่วยเรื่องการกระจายและ cache เท่านั้น แต่ไม่ได้ลดขนาดไฟล์ raw ที่ใหญ่เกินสำหรับมือถือ จึงต้องใช้คู่กับการทำ transcode"`
- Q693: `"Elastic Transcoder เป็นบริการ managed ไม่ต้องดูแล server (ปัจจุบัน AWS ให้ใช้ AWS Elemental MediaConvert แทน)"` — Amazon Elastic Transcoder ถูกยุติการให้บริการ (retired) ไปแล้วเมื่อ พ.ย. 2025 → ระบุเพิ่มสั้น ๆ ว่า `"(ปัจจุบัน Elastic Transcoder ยุติการให้บริการแล้ว โดย AWS ให้ใช้ AWS Elemental MediaConvert แทน)"`

## Verdict
21 of 22 questions (Q674–Q692, Q694–Q695) are fine as-is; only Q693 has minor weak spots.
