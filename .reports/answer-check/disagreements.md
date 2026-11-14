# Answer-key disagreements

```
{
 "all_agree": 523,
 "one_disagrees": 11,
 "both_disagree_with_key": 16
}
```


## both_disagree_with_key 

- **Q88** key=B | claude=A (high) | agy=A (high)
- **Q108** key=A | claude=D (med) — D vs A: RDS event notifications don't fire on data changes, but SNS-to-SQS fan-out to multiple targets is the intended pattern | agy=D (med) — D vs A: D uses the SNS-to-SQS fan-out pattern for multiple targets, though RDS event notifications only cover DB-level events
- **Q110** key=B,D | claude=C,D (high) | agy=C,D (high)
- **Q167** key=D | claude=C (med) — C vs D: "without any downtime" could argue On-Demand burst, but SQS work tolerates Spot interruption | agy=C (high)
- **Q239** key=A | claude=B (med) — B (Lambda function URL with AWS_IAM, simplest) vs A (API Gateway REST API with IAM auth, older key) | agy=B (high)
- **Q275** key=C | claude=A (high) | agy=A (high)
- **Q302** key=A | claude=A,C (low) — header says [pick 1] but stem says choose two; A,C are the two correct choices | agy=A,C (low) — Header says [pick 1] but question prompt says (Choose two.); both A and C are required
- **Q308** key=B,D | claude=B,C (med) — B vs A: RI optimization check is meaningful from the consolidated billing (payer) account | agy=B,C (med) — A,C vs B,C: depends on whether Trusted Advisor RI optimization is viewed from the consolidated billing account or member account
- **Q390** key=A,D | claude=B,D (high) | agy=B,D (high)
- **Q394** key=D | claude=B (med) — B vs C: RDS gp3 now scales to 64,000 IOPS; older answer assumes gp3 16,000 cap and picks io2 | agy=B (med) — B vs C: RDS for MySQL gp3 volumes at 2,000 GB support scaling up to 64,000 IOPS in-place (B), though some keys assume EC2's 16,000 IOPS gp3 limit and pick io2 (C)
- **Q419** key=C,E | claude=A,C (high) | agy=A,C (med) — A,C vs C,E: Default EBS encryption is a per-account/per-Region EC2 attribute (A) combined with an SCP (C), not an Organizations management account setting (E)
- **Q482** key=B | claude=A (high) | agy=A (high)
- **Q515** key=B,C,E | claude=A,B,C (med) — A vs E/F: Redshift Data API matches A; E reads like DynamoDB, F not a Redshift feature | agy=A,B,C (high)
- **Q523** key=D | claude=A (med) — A vs C: AppSync pipeline resolvers fetch multiple tables without custom Lambda | agy=A (med) — A vs C: AppSync pipeline resolvers natively aggregate data from multiple DynamoDB tables in one request, though API Gateway with Lambda is also used
- **Q539** key=B | claude=C (high) | agy=C (high)
- **Q540** key=D | claude=C (low) — RDS Multi-AZ DB cluster does not support Oracle; D requires migrating Oracle to Aurora; all options flawed | agy=C (low) — C vs D: RDS for Oracle does not support Multi-AZ DB clusters (uses Active Data Guard read replicas), while Aurora does not run Oracle without migration

## one_disagrees 

- **Q30** key=C | claude=C (high) | agy=A (med) — A vs C: A preserves the instance and Performance Insights data, though RDS stop only lasts 7 days at a time
- **Q102** key=B,E | claude=A,B (high) | agy=B,E (high)
- **Q134** key=C | claude=A (med) — A vs C: CRR does not copy existing objects so a new bucket is implied; SSE-S3 (C) would be less overhead otherwise | agy=C (high)
- **Q202** key=B | claude=A (high) | agy=B (high)
- **Q225** key=B | claude=A (med) — A vs B: data stream needs Firehose to reach S3; S3+Athena vs Redshift cluster for petabytes | agy=B (high)
- **Q253** key=C | claude=C (low) — policy documents missing from the question; cannot evaluate Policy1/Policy2 | agy=B (low) — Missing Policy1 and Policy2 JSON exhibit; in the standard version of this question only directory deletion (ds) is allowed without an explicit deny
- **Q366** key=D | claude=D (high) | agy=C (med) — C vs D: Fine-grained IAM permissions work with Cognito identity/groups to restrict DynamoDB content, whereas API Gateway usage plans and API keys (D) are also tested for subscription gating
- **Q373** key=D | claude=A (high) | agy=D (med) — D vs A: Predictable access pattern (30 days daily, then quarterly up to 1 year, then archive) with trillions of objects avoids Intelligent-Tiering monitoring fees, though some keys pick A
- **Q507** key=A | claude=B (med) — B vs A: single primary + global consistency favors Aurora cross-Region replicas over multi-active global tables | agy=A (high)
- **Q511** key=C | claude=C (med) — C vs A: "Aurora On-Demand" read as Aurora Serverless for part-time use | agy=B (med) — B vs C: RDS Single-AZ is cheaper and can be stopped when idle, though C may intend Aurora Serverless despite saying On-Demand
- **Q543** key=A,D | claude=A,D (med) — D vs E: new payer management account (best practice) vs org in existing account | agy=A,E (med) — A,E vs B,E: Savings Plan discount sharing is controlled in the management account billing preferences after creating the organization
