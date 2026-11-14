# Braindump answer-key check — verdict (2026-11-14)

Method: Claude (5 subagents) and agy (5 runs) each solved all 550 questions **blind** (no key). `compare.py` → `disagreements.md`.
Result: on 523/550 neither blind solver objected to the key (this is "no objection found", not proof). Also checked: the site's `data-correct` matches `Answer(s):` on all 550; only 6 questions have images (96, 253, 423, 429, 477, 494). 27 reviewed by hand below. Nothing applied to `questions.json` yet — waiting for the user's OK.

## A. Change key — clear-cut (6)
| Q | key → new | why |
|---|---|---|
| 88 | B → **A** | Requester Pays: the requester pays transfer, so the owner's cost is lowest. CRR makes the owner pay inter-Region transfer + storage. |
| 110 | B,D → **C,D** | A presigned URL uploads straight from the browser to S3, so the web server isn't in the path (decoupled + faster). B still sends uploads through EC2. |
| 239 | A → **B** | A Lambda function URL with AWS_IAM is HTTPS + IAM auth with nothing extra to deploy. API Gateway is an extra layer. |
| 302 | A → **A,C** (type → multi) | The question says "Choose two"; the site's key gave only one answer. CloudFront + Elastic Transcoder. |
| 308 | B,D → **B,C** | The instances are "active" for 90 days, so the RDS RI Optimization check applies. The Idle DB check doesn't match. |
| 539 | B → **C** | Elastic Disaster Recovery: RPO in seconds, RTO in minutes, pilot light = cheapest. RDS warm standby + DMS costs more. |

## B. Change key — debated on the exam, but settled by the question's wording or the docs (6)
| Q | key → new | why |
|---|---|---|
| 275 | C → **A** | The slowdown is a predictable daily ramp. A scheduled action raises desired capacity before opening and can still scale in later. D locks min = 20, so it costs more. |
| 390 | A,D → **B,D** | "Which solutions" (not "combination"), so each pick must store sessions durably on its own. Sticky sessions don't store anything. |
| 482 | B → **A** | 100 GB over 100 Mbps ≈ 2–3 h, a one-time copy. `aws s3 sync` uses TLS and needs no agent → least overhead. |
| 515 | B,C,E → **A,B,C** | The AWS docs describe the Redshift Data API in nearly the same words as A ("traditional, cloud-native, containerized… event-driven applications"). E describes DynamoDB. |
| 394 | D → **B** | Docs: RDS MySQL gp3 at ≥400 GiB has a 12,000 IOPS baseline and can be provisioned at 12,000–64,000 in place, so 20,000+ is reachable. D isn't possible on RDS. The explanation should note that C (io2) also works but costs more and the question has no cost qualifier. |
| 419 | C,E → **A,C** | Docs: Organizations declarative policies for EC2 have 7 types and none is EBS encryption by default; that setting is per account + Region. Note in the explanation that A is also per-account, so C (SCP) is what enforces it org-wide. |

## C. Contested / flawed question — user decides (4)
Both blind solvers agree with each other but the question's own wording doesn't settle it. Whichever answer we keep, the Thai explanation must state the rival answer and why it's debated.
| Q | site key | blind solvers | issue |
|---|---|---|---|
| 108 | A | D | D is the fan-out pattern for "multiple targets", but RDS event notifications don't fire on row updates ("when a car is sold"). A's "Lambda triggered when RDS is updated" isn't native to RDS either. |
| 167 | D | C | "without any downtime" can be argued both ways once an RI baseline exists. C is cheaper (SQS tolerates Spot); D is safer. |
| 523 | D | A | Neither side's reason addresses "no impact on the baseline performance". AppSync (A) is a natural fit for multiple tables; Athena Federated Query (D) suits analytics without loading DynamoDB. |
| 540 | D | C (+ agy's 2nd pass = C) | Wrong either way: RDS Multi-AZ DB clusters don't support Oracle (C), and D requires Oracle → Aurora. The choices contrast the 3 RDS deployment modes, so C fits the intent better. Recommend C + mark as a flawed question. |

## C2. Keep the key
- One solver disagreed; key confirmed: 30 (C), 102 (B,E), 134 (C), 202 (B), 225 (B), 366 (D), 373 (D: trillions of objects → Intelligent-Tiering monitoring fee is high), 507 (A), 511 (C — note: "Aurora On-Demand" really means provisioned instances at On-Demand rates; C stays because it's the question's intent), 543 (A,D).
- **253**: key C confirmed against the policy image (Policy1 allows `ec2:*`; Policy2 denies `ds:Delete*`).

## D. Data fixes (needed before importing)
- Add the policy JSON (from the images in `source/other/braindumps/images/`) to the question text for **96, 253, 423, 429, 494**. Keys checked against the policies: 96=C, 253=C, 423=A,B, 429=D, 494=D, all correct.
- **477**: the site has no choice text at all (in the HTML the `<li>` elements are empty, and the explanation is generic) → **drop it** → 549 questions.
- 302: type single → multi.
- Clean up garbled text: `VPModify` (549), lone `.` lines (332), `�` → `'`, `AW'S`, `Sealing`, `kays`, `Savings Pian`, `bled`.

## E. agy's second-opinion review of these verdicts (`agy-verdict-review.md`)
- agy agrees with 30 of 31, including all of A and all of B, and checked that the facts for Q239, Q394 and Q419 are correct.
- **Q540** (moved to section C): agy says C (the choices contrast the 3 RDS deployment modes; only a Multi-AZ DB cluster has a readable standby; D requires an Oracle→Aurora migration). → **Contested: both blind solvers + agy = C, site key = D.** The question is flawed either way. Let the user decide, or leave it out of scoring.
- Notes to carry into the Thai explanation: Q108 — RDS event notifications fire only on operational events (failover, backup, etc.), not on row updates. Q511 — "Aurora On-Demand" really means provisioned instances at On-Demand rates, not Serverless; C stays because it's the question's intent.

## F. User decisions on section C (2026-11-14)
- Q108 → **D** · Q167 → **C** · Q523 → **A** · Q540 → **C** + mark as a flawed question
- The Thai explanations for all 4 must state the rival answer and why it's debated.
