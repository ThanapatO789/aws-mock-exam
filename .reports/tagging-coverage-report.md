# Tagging coverage report — 390 ข้อ

- ติด tag แล้ว **390/390** ข้อ (ไม่มีตกหล่น)
- ในนั้นเป็นข้อซ้ำที่คัดลอก tag มา **66** ข้อ (unique จริง 324)
- หมวดหลัก 8 · หัวข้อย่อย 38

## หมวดหลัก (แกน spider)

| หมวด | ข้อ | % | คาดว่าเจอ/mock 65 ข้อ |
|---|---:|---:|---:|
| Storage | 89 | 22.8% | 14.8 |
| Databases | 55 | 14.1% | 9.2 |
| Operations & Resilience | 45 | 11.5% | 7.5 |
| Networking (VPC & Hybrid) | 44 | 11.3% | 7.3 |
| Security & Identity | 42 | 10.8% | 7.0 |
| Serverless & Integration | 40 | 10.3% | 6.7 |
| Compute & Containers | 39 | 10.0% | 6.5 |
| Edge & Content Delivery | 36 | 9.2% | 6.0 |

## Well-Architected pillars

> ⚠️ **คอลัมน์ blueprint เป็นคนละหน่วยวัด ห้ามเทียบตรง ๆ** — blueprint บอกว่า *ข้อสอบกี่ % ตกในแต่ละ domain*
> ส่วน tag ของเราบอกว่า *ข้อนั้นวัดการตัดสินใจเพื่ออะไร* และเรามี Operational Excellence ซึ่ง blueprint ไม่มี (เขากระจายไปอยู่ใน 4 domains)
> ที่เห็น Cost 15% ต่ำกว่า 20% จึงไม่ได้แปลว่าซ้อมเรื่อง cost ไม่พอ

| Pillar | ข้อ | % | (อ้างอิง) blueprint SAA-C03 |
|---|---:|---:|---:|
| Security | 101 | 25.9% | 30% |
| Reliability | 82 | 21.0% | 26% |
| Performance Efficiency | 103 | 26.4% | 24% |
| Cost Optimization | 59 | 15.1% | 20% |
| Operational Excellence | 45 | 11.5% | — (ไม่ใช่ domain) |
| Sustainability | 0 | 0.0% | — (ไม่ใช่ domain) |

## หัวข้อย่อย

**Security & Identity** — 42 ข้อ · module 02  
-  20 — Principals & Identities (IAM user/role/STS)
-   9 — Policies (identity vs resource, evaluation)
-   7 — Multi-account (Organizations, SCP)
-   6 — Detection & threat protection (GuardDuty, Inspector, Macie, Access Analyzer)

**Networking (VPC & Hybrid)** — 44 ข้อ · module 03+10  
-  12 — Hybrid (Direct Connect, Site-to-Site VPN)
-   8 — VPC fundamentals (CIDR, subnet, route table, IGW)
-   8 — VPC Endpoints & PrivateLink
-   6 — Traffic security (SG vs NACL)
-   6 — Inter-VPC connectivity (Peering, Transit Gateway)
-   4 — Elastic IP & NAT Gateway

**Edge & Content Delivery** — 36 ข้อ · module 12  
-  11 — CloudFront (caching, OAC, behaviors)
-  10 — Outposts, Local Zones, Global Accelerator
-   8 — DDoS protection (Shield, WAF)
-   7 — Route 53 (routing policies, health checks)

**Compute & Containers** — 39 ข้อ · module 04+09  
-  15 — EC2 pricing (On-Demand, Spot, RI, Savings Plans)
-  12 — EC2 instances, AMI, instance types
-   7 — Lambda (memory, timeout, concurrency)
-   5 — Containers & microservices (ECS, EKS, Fargate)

**Storage** — 89 ข้อ · module 05  
-  26 — S3 fundamentals & storage classes
-  19 — Shared file systems (EFS, FSx)
-  13 — S3 security (bucket policy, encryption, BPA)
-  12 — Data migration (Snow, DataSync, Storage Gateway, Transfer)
-  10 — Block storage (EBS, instance store)
-   9 — S3 features (versioning, lifecycle, replication)

**Databases** — 55 ข้อ · module 06  
-  31 — RDS & Aurora (Multi-AZ, read replica)
-   8 — Caching (ElastiCache Redis/Memcached)
-   8 — Analytics & ETL (Athena, Glue, Redshift, OpenSearch, QuickSight)
-   4 — DynamoDB (keys, capacity, GSI, DAX)
-   4 — DB migration (DMS, SCT)

**Serverless & Integration** — 40 ข้อ · module 11  
-  18 — SQS (Standard vs FIFO, DLQ, visibility)
-  10 — API Gateway
-   9 — Kinesis (Data Streams, Firehose)
-   3 — Events & orchestration (SNS, EventBridge, Step Functions)

**Operations & Resilience** — 45 ข้อ · module 07+08+13  
-  16 — Auto Scaling (policies, warm pool)
-  13 — Load balancing (ALB, NLB, GWLB)
-   7 — Monitoring, alarms & events (CloudWatch, CloudTrail)
-   5 — IaC & config (CloudFormation, Systems Manager, Beanstalk)
-   4 — Backup & DR (AWS Backup, snapshots, RTO/RPO)
