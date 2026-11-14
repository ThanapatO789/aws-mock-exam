## Errors

- None.

## Weak spots

- Q461: `"ต้องตรวจ HTTP error ของแอป = health check แบบ layer 7 ของ ALB"` และใน ANALYSIS note `"'not detecting HTTP errors' → ต้องใช้ health check ระดับ layer 7 ของ ALB"` ทำให้เข้าใจว่า NLB ทำ HTTP health check ไม่ได้ และขัดกับคำอธิบายตัวเลือกผิดข้อแรกเอง → จริง ๆ แล้ว target group ของ NLB รองรับ HTTP/HTTPS health check เช่นกัน เหตุผลที่ตัดข้อ A คือไม่ได้ตั้งให้ Auto Scaling แทนที่ instance ที่ unhealthy จึงยังต้องคอย restart ด้วยมือ (ตามที่ระบุไว้ถูกต้องแล้วในหัวข้อตัวเลือกที่ผิด)

## Verdict

21 of 22 questions (Q457–Q478) are fine as-is; 0 errors and 1 minor weak spot (Q461).
