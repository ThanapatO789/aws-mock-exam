# Purpose-Built Databases

AWS มีบริการฐานข้อมูล purpose-built (ออกแบบมาเฉพาะทาง) มากกว่า 15 engine เพื่อรองรับ data model ที่หลากหลาย เช่น relational, key-value, document, in-memory, graph, time series, wide column และ ledger databases

## แนวคิด "purpose-built databases"
ฐานข้อมูลเชิงสัมพันธ์ (relational database) เคยเป็นตัวเลือกเริ่มต้นและถูกใช้อย่างแพร่หลายในแทบทุกแอปพลิเคชัน เปรียบเหมือน "multi-tool" ที่ทำได้หลายอย่างแต่ไม่ได้เหมาะที่สุดกับงานใดงานหนึ่งโดยเฉพาะ แนวทาง "one-size-fits-all" ที่ใช้ relational database กับทุกกรณีไม่ตอบโจทย์อีกต่อไป จึงเกิดการเปลี่ยนแปลงในวงการฐานข้อมูลที่ทำให้ purpose-built database ได้รับความนิยมมากขึ้น นักพัฒนาสามารถพิจารณาความต้องการของแอปแล้วเลือกฐานข้อมูลที่เหมาะสมที่สุด แทนที่จะถูกจำกัดด้วยฐานข้อมูลเชิงพาณิชย์แบบเดิม ๆ

## บริการฐานข้อมูล purpose-built ของ AWS

### Amazon DynamoDB
ฐานข้อมูล NoSQL แบบ fully managed ที่ให้ประสิทธิภาพเร็วและสม่ำเสมอในทุกระดับ scale มีรูปแบบการคิดเงินที่ยืดหยุ่น ผสานรวมกับ infrastructure as code (IaC) ได้ดี และมีโมเดลการดำเนินงานแบบ hands-off เป็นฐานข้อมูลที่นิยมใช้กับแอปพลิเคชัน high-scale และ serverless แต่ก็ใช้ได้กับ OLTP (online transaction processing) workload เกือบทุกประเภท (จะอธิบายเพิ่มเติมในบทเรียนถัดไป)

### Amazon ElastiCache
บริการ in-memory caching แบบ fully managed รองรับ open-source cache engine 2 ตัวคือ **Redis** และ **Memcached** ไม่ต้องรับผิดชอบเรื่อง instance failover, backup/restore หรืออัปเกรดซอฟต์แวร์เอง

### Amazon MemoryDB for Redis
ฐานข้อมูล in-memory ที่เข้ากันได้กับ Redis ให้ความทนทาน (durable) และประสิทธิภาพเร็วมาก อ่านข้อมูลด้วย latency ระดับ microsecond เขียนข้อมูลด้วย latency ระดับ millisecond เดียว มี throughput สูง และรองรับ Multi-AZ durability เหมาะกับแอปสมัยใหม่ เช่นที่สร้างด้วยสถาปัตยกรรม microservices ใช้เป็นฐานข้อมูลหลัก (primary database) แบบ fully managed ได้โดยไม่ต้องจัดการ cache, durable database หรือโครงสร้างพื้นฐานแยกต่างหาก

### Amazon DocumentDB (รองรับ MongoDB)
ฐานข้อมูลประเภท document database แบบ fully managed ใช้เก็บและ query เอกสาร (document) ที่มีโครงสร้างซับซ้อนในแอปพลิเคชัน เหมาะกับ use case เช่น content management system, profile management, และเว็บ/มือถือแอป มี API ที่เข้ากันได้กับ MongoDB ทำให้ใช้ไลบรารี open-source ยอดนิยมได้ หรือย้ายฐานข้อมูลเดิมมาได้ง่าย

### Amazon Keyspaces (สำหรับ Apache Cassandra)
บริการฐานข้อมูลที่เข้ากันได้กับ Apache Cassandra แบบ scalable, highly available และ managed เหมาะกับแอป high-scale ที่ต้องการประสิทธิภาพระดับสูงและมี access pattern แบบตรงไปตรงมา (high-volume) ใช้ Cassandra Query Language (CQL) โค้ดเดิม, ไดรเวอร์ที่ใช้ license Apache 2.0 และเครื่องมือที่ใช้อยู่แล้วได้เลย

### Amazon Neptune
ฐานข้อมูลประเภท graph database แบบ fully managed เหมาะกับข้อมูลที่มีความเชื่อมโยงสูงและมีความสัมพันธ์หลากหลายรูปแบบ บริษัทมักใช้กับ recommendation engine, fraud detection และ knowledge graph

### Amazon Timestream
ฐานข้อมูลประเภท time series แบบ serverless ที่รวดเร็วและ scale ได้ เหมาะกับงาน IoT และแอปพลิเคชันด้านปฏิบัติการ (operational applications) จัดเก็บและวิเคราะห์ข้อมูลได้หลักล้านล้าน event ต่อวัน เร็วกว่าและถูกกว่า relational database มาก (เร็วขึ้นถึง 1,000 เท่า ค่าใช้จ่ายต่ำเพียง 1 ใน 10) ข้อมูล time series คือลำดับข้อมูลที่บันทึกตามช่วงเวลา เช่น ราคาหุ้นหรืออุณหภูมิที่เปลี่ยนแปลงตามเวลา

### Amazon Aurora PostgreSQL
ฐานข้อมูลเชิงสัมพันธ์แบบ fully managed ที่เข้ากันได้กับ PostgreSQL สำหรับองค์กรที่ต้องการ audit trail ที่ครบถ้วน เช่น ระบบธนาคาร บันทึกทางการเงิน หรือ supply chain — Aurora PostgreSQL ที่ใช้ extension **pgAudit** ให้ความสามารถบันทึก audit log แบบละเอียด บันทึกทุกกิจกรรมของฐานข้อมูล (ใครเข้าถึงข้อมูล เมื่อไร ทำอะไร) และผสานกับ CloudWatch Logs เพื่อเก็บข้อมูลระยะยาว เหมาะกับอุตสาหกรรมที่ต้องปฏิบัติตามกฎระเบียบ เช่น การเงิน สาธารณสุข และภาครัฐ

## Key terms
- Purpose-built database: ฐานข้อมูลที่ออกแบบมาเฉพาะสำหรับ data model/use case แบบใดแบบหนึ่ง แทนการใช้ relational database แบบ one-size-fits-all
- NoSQL: ฐานข้อมูลที่ไม่ใช้โครงสร้างตารางแบบ relational เช่น key-value, document, graph
- Amazon DynamoDB: บริการ NoSQL แบบ fully managed ประสิทธิภาพสูงทุก scale
- Amazon ElastiCache: บริการ in-memory caching แบบ fully managed (Redis/Memcached)
- Amazon MemoryDB for Redis: ฐานข้อมูล in-memory ที่เข้ากันได้กับ Redis
- Amazon DocumentDB: ฐานข้อมูล document แบบ fully managed ที่เข้ากันได้กับ MongoDB
- Amazon Keyspaces: บริการที่เข้ากันได้กับ Apache Cassandra
- Amazon Neptune: ฐานข้อมูล graph แบบ fully managed
- Amazon Timestream: ฐานข้อมูล time series แบบ serverless
- Amazon Aurora PostgreSQL: ฐานข้อมูลเชิงสัมพันธ์ที่เข้ากันได้กับ PostgreSQL พร้อมความสามารถ audit logging
