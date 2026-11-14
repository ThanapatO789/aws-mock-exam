## Errors

- `serverless-bd03`: ในส่วนกับดักระบุว่า `"ขยาย instance/Multi-AZ ไม่เพิ่มกำลัง write"` ซึ่งไม่ถูกต้องสำหรับกรณีขยายขนาด instance (vertical scaling เพิ่มกำลัง write ได้จริง แต่มี downtime ตอนปรับขนาด แพงเกินจำเป็นสำหรับ spike ชั่วคราว และไม่ช่วยเก็บข้อมูลตอน DB ล่ม/upgrade ส่วนสิ่งที่ **ไม่เพิ่มกำลัง write** คือ **Read Replica** และ **Multi-AZ**) → `"Read Replica/Multi-AZ ไม่เพิ่มกำลัง write, ขยายขนาด instance มี downtime และไม่ช่วยเก็บข้อมูลตอน DB ล่ม/upgrade"`

## Weak spots

- `edge-bd02`: ประโยค `"ไม่มี cache endpoint ได้แค่ ALB, NLB, EC2, Elastic IP"` ไม่มีตัวคั่นระหว่าง `"ไม่มี cache"` กับ `"endpoint ได้แค่..."` ทำให้อ่านรวบเป็น `"ไม่มี cache endpoint"` ได้ง่าย → `"ไม่มี cache และใช้ endpoint ได้แค่ ALB, NLB, EC2, Elastic IP"`
- `serverless-bd05`: `"แก้โดยเพิ่ม visibility timeout ให้ยาวกว่าเวลาประมวลผล (ChangeMessageVisibility) กับ Lambda ให้ตั้งอย่างน้อย 6 เท่าของ function timeout (+ batch window)"` ผูกการเพิ่ม visibility timeout เข้ากับ API `ChangeMessageVisibility` อย่างเดียว ทั้งที่โดยทั่วไป (รวมถึงกรณี Lambda 6x timeout) คือการตั้งค่า default `VisibilityTimeout` ที่ระดับ queue ส่วน `ChangeMessageVisibility` ใช้ขยายเวลาราย message ที่กำลังทำไม่ทัน → `"แก้โดยตั้งค่า VisibilityTimeout ของ queue ให้ยาวกว่าเวลาประมวลผล (หรือขยายเวลาราย message ที่กำลังทำด้วย ChangeMessageVisibility) กับ Lambda ให้ตั้ง VisibilityTimeout ของ queue อย่างน้อย 6 เท่าของ function timeout (+ batch window)"`
- `serverless-bd09`: `"ในข้อสอบ = Amazon Pinpoint (two-way SMS) ส่ง event ออกไป Kinesis Data Streams/Firehose แล้วเก็บใน S3"` ในทางเทคนิคฟีเจอร์ Two-Way SMS ของ Pinpoint จะส่งข้อความที่ผู้ใช้ตอบกลับเข้า **SNS topic** (ส่วนการส่งออก Kinesis Data Streams / Firehose คือ Pinpoint **Event Stream** ซึ่งข้อ 592 รวบไว้ในตัวเลือกเดียว) → `"ในข้อสอบ = Amazon Pinpoint (two-way SMS + event stream) ส่งข้อมูลออกไป Kinesis Data Streams/Firehose แล้วเก็บใน S3 (ของจริง two-way SMS ส่งคำตอบเข้า SNS ก่อน ส่วน event stream ส่งออก Kinesis)"`
- `serverless-bd10`: กำหนด `"kind": "number"` แต่ `cue` (`"SQS message ใหญ่เกิน limit (เช่นต้องส่ง 50 MB) โดยแก้โค้ดน้อยที่สุด ทำอย่างไร"`) ถามวิธีแก้เชิงสถาปัตยกรรม (`fact`) ไม่ได้ถามตัวเลข limit บนหน้าการ์ด → เปลี่ยน `kind` เป็น `"fact"` หรือปรับ `cue` เป็น `"SQS จำกัดขนาด message เท่าไร และถ้าต้องส่งเกิน limit (เช่น 50 MB) โดยแก้โค้ดน้อยที่สุด ทำอย่างไร"`

## Verdict

13 of 18 cards are fine as-is (1 card has a trap accuracy error and 4 cards have minor wording or `kind` weak spots).
