## Disagree

- **Q540**: proposed **D** → should be **C**, because options B (`Single-AZ deployment`), C (`Multi-AZ cluster deployment`), and D (`Multi-AZ instance deployment`) are explicitly contrasting the three RDS deployment modes: only a Multi-AZ DB cluster provides both high availability and readable standby instances (`reader instance in the cluster deployment`) to offload reporting. While the exam author overlooked that RDS Multi-AZ DB clusters only support MySQL and PostgreSQL (not Oracle), D is even more flawed: "RDS in a Multi-AZ instance deployment" is a non-Aurora mode whose standby cannot serve reads, and migrating an Oracle database to Aurora requires a heterogeneous engine/schema migration that contradicts **MOST operationally efficient**.

## Agree but reason is wrong

- **Q108** (agree with **D**): SNS-to-SQS fan-out is the intended exam pattern for multiple target systems, but the reason/explanation should note that **RDS event notifications** only fire for database-level operational events (failover, backup, stop/start), not table row updates ("when an automobile is sold").
- **Q511** (agree with **C**): The verdict notes `C = Aurora Serverless`, but in AWS terminology **Aurora On-Demand** means provisioned instances billed at On-Demand hourly rates (as opposed to Reserved Instances), not Aurora Serverless. C remains the intended exam key only because the author used "On-Demand" to match the part-time ("half of the 8-hour workday") cue in the stem.

## Verdict

Agree with 30 of 31 (all 6 in Section A, all 9 in Section B, 10 of 11 non-exhibit questions in Section C, and all 5 policy-exhibit questions 96=C, 253=C, 423=A,B, 429=D, 494=D; factual claims for Q239, Q394, and Q419 verified correct).
