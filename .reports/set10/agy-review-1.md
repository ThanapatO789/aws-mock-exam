## Errors

None.

## Weak spots

- Q592: `"SNS FIFO topic ส่งได้เฉพาะ SQS queue (Kinesis subscribe ไม่ได้) และ SNS ส่ง SMS แบบทางเดียว"` → มี 2 จุดที่ควรปรับให้แม่นขึ้น: (1) Kinesis Data Streams subscribe กับ SNS ไม่ได้ทุกชนิด (ทั้ง Standard และ FIFO — ที่ subscribe ได้คือ Amazon Data Firehose ซึ่งปัจจุบันรองรับทั้ง Standard และ FIFO topic) และ (2) SNS FIFO topic ไม่รองรับการส่ง SMS เลย (SMS subscribe ได้เฉพาะ Standard topic เท่านั้น)

## Verdict

21 of 22 questions are fine as-is (0 errors, 1 minor weak spot in Q592).
