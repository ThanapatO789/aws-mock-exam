Q331 | A | high | 
Q332 | B | high | 
Q333 | C | high | 
Q334 | A | high | 
Q335 | B | high | 
Q336 | A | high | 
Q337 | A | high | 
Q338 | B | med | B vs D: Aurora Global Database supports headless secondary clusters with no DB instance for cost-effective DR, though some keys require one instance (D)
Q339 | C | high | 
Q340 | A | high | 
Q341 | D | high | 
Q342 | C | med | C vs B: Predictive scaling forecasts CPU load and supports pre-launching instances 30 minutes early without manual capacity analysis, though some keys pick scheduled scaling (B)
Q343 | C | high | 
Q344 | A | high | 
Q345 | A | high | 
Q346 | D | high | 
Q347 | A | high | 
Q348 | B | med | B vs A: Provisioned mode fits constant predictable workloads and Reserved Capacity is not supported on Standard-IA, though some keys pick A for the reserved capacity keyword
Q349 | B | high | 
Q350 | A,C | high | 
Q351 | D | high | 
Q352 | B | high | 
Q353 | B | high | 
Q354 | B | high | 
Q355 | D | med | D vs B: 64 vCPU and 512 GiB memory exceeds AWS Fargate task limits so AWS Batch on EC2 is required, though some keys pick B for serverless operational overhead
Q356 | B | high | 
Q357 | A,D | high | 
Q358 | C | high | 
Q359 | C | high | 
Q360 | B | high | 
Q361 | C | high | 
Q362 | B,E | high | 
Q363 | B | high | 
Q364 | B,D | high | 
Q365 | C | high | 
Q366 | C | med | C vs D: Fine-grained IAM permissions work with Cognito identity/groups to restrict DynamoDB content, whereas API Gateway usage plans and API keys (D) are also tested for subscription gating
Q367 | A | high | 
Q368 | A | high | 
Q369 | A | high | 
Q370 | C | high | 
Q371 | C,D | high | 
Q372 | B | high | 
Q373 | D | med | D vs A: Predictable access pattern (30 days daily, then quarterly up to 1 year, then archive) with trillions of objects avoids Intelligent-Tiering monitoring fees, though some keys pick A
Q374 | D | high | 
Q375 | A | high | 
Q376 | A | high | 
Q377 | B | high | 
Q378 | B | high | 
Q379 | B | high | 
Q380 | D | high | 
Q381 | B | high | 
Q382 | A | high | 
Q383 | A | high | 
Q384 | C | high | 
Q385 | C | high | 
Q386 | B | high | 
Q387 | D,E | high | 
Q388 | D | high | 
Q389 | A | high | 
Q390 | B,D | high | 
Q391 | C | high | 
Q392 | A | high | 
Q393 | C | high | 
Q394 | B | med | B vs C: RDS for MySQL gp3 volumes at 2,000 GB support scaling up to 64,000 IOPS in-place (B), though some keys assume EC2's 16,000 IOPS gp3 limit and pick io2 (C)
Q395 | C | high | 
Q396 | A | high | 
Q397 | C | high | 
Q398 | C | high | 
Q399 | B | high | 
Q400 | C | high | 
Q401 | A | high | 
Q402 | A | high | 
Q403 | D | high | 
Q404 | D | high | 
Q405 | D,E | high | 
Q406 | C,D | high | 
Q407 | D | high | 
Q408 | B | high | 
Q409 | C | high | 
Q410 | B | high | 
Q411 | C | high | 
Q412 | D | high | 
Q413 | B | high | 
Q414 | B | high | 
Q415 | A | high | 
Q416 | B,D | high | 
Q417 | C | high | 
Q418 | B | high | 
Q419 | A,C | med | A,C vs C,E: Default EBS encryption is a per-account/per-Region EC2 attribute (A) combined with an SCP (C), not an Organizations management account setting (E)
Q420 | D | high | 
Q421 | B | med | B vs C: Transfer Family VPC internet-facing endpoints with Elastic IPs and security groups (B) support IP allowlisting and EFS POSIX permissions, whereas public endpoints (C) do not support security groups
Q422 | D | high | 
Q423 | A,B | high | 
Q424 | B | med | B vs A: Spot Instances for short-lived variable backend EC2 nodes paired with RIs for 24/7 frontend nodes is most cost-effective, though some keys pick Fargate (A)
Q425 | C | high | 
Q426 | A | high | 
Q427 | B | high | 
Q428 | B | high | 
Q429 | D | med | Missing JSON policy in question text, but options match the classic IAM policy allowing ec2:* in us-east-1 with an explicit MFA-absent deny on StopInstances/TerminateInstances
Q430 | B,C | high | 
Q431 | B | high | 
Q432 | B | high | 
Q433 | C | high | 
Q434 | A | high | 
Q435 | A | high | 
Q436 | A | high | 
Q437 | B | high | 
Q438 | D | high | 
Q439 | A | high | 
Q440 | A,C | med | A,C vs A,E: Aurora imports RDS MySQL snapshots directly (A) and imports S3 backups (C), though some keys pick DMS from S3 (E) for logical dumps
