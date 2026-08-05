# Amazon Kinesis

บทเรียนนี้อธิบายวิธีใช้ **Amazon Kinesis** เพื่อรับ (ingest) และประมวลผลข้อมูล streaming แบบ real-time

ด้วย Amazon Kinesis คุณสามารถ:

- รวบรวม ประมวลผล และวิเคราะห์ data stream แบบ real time — Kinesis มีขีดความสามารถประมวลผล streaming data ได้แทบทุก scale พร้อมความยืดหยุ่นในการเลือกเครื่องมือที่เหมาะกับความต้องการของแอปพลิเคชันอย่างคุ้มค่า
- รับข้อมูล real-time เช่น video, audio, application log, website clickstream และข้อมูล IoT telemetry — ข้อมูลที่รับเข้ามาสามารถนำไปใช้ต่อกับ machine learning, analytics และแอปพลิเคชันอื่น ๆ ได้
- ประมวลผลและวิเคราะห์ข้อมูลทันทีที่มาถึงและตอบสนองได้ทันที — ไม่ต้องรอให้ข้อมูลมาครบก่อนจึงเริ่มประมวลผล

## Kinesis Data Streams

การเริ่มต้นใช้งาน Kinesis Data Streams ทำได้โดยสร้าง stream และระบุจำนวน shard โดยแต่ละ shard คือลำดับของ data record ที่มี unique identifier ใน stream หนึ่ง stream สามารถรับข้อมูลได้ 1 MB ต่อวินาทีต่อ shard และแต่ละ shard มี read limit ที่ 2 MB ต่อวินาทีสำหรับแอปพลิเคชันของคุณ ความจุรวมของ stream คือผลรวมความจุของทุก shard สามารถใช้ resharding เพื่อเพิ่มหรือลดจำนวน shard ใน stream ได้ตามต้องการ

## Kinesis Data Firehose

**Amazon Kinesis Data Firehose** เป็นวิธี capture, transform และ load data stream เข้าสู่ AWS data store เพื่อทำ near-real-time analytics ร่วมกับเครื่องมือ business intelligence ที่มีอยู่

## Key terms
- Amazon Kinesis: บริการสำหรับ ingest และประมวลผลข้อมูล streaming แบบ real-time
- Shard: หน่วยลำดับของ data record ใน Kinesis Data Stream ที่มี capacity เฉพาะตัว (1 MB/s write, 2 MB/s read)
- Resharding: การเพิ่ม/ลดจำนวน shard ใน stream เพื่อปรับ capacity
- Kinesis Data Firehose: บริการสำหรับ capture, transform และโหลด data stream เข้า AWS data store เพื่อทำ near-real-time analytics
