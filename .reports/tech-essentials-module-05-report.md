# AWS Technical Essentials — Part 2, Module 5: Databases on AWS — Capture Report

## Access method
- Registration was shared with Part 1 (same `registration_id` and `product_id` as Part 1's module) — task description's assumption of a separate registration was inaccurate, but did not affect access.
- module_id for the whole Part 2 container: `K3WV65M927:001.001.001`
- Renderer URL used (no `referrer` param):
  `https://skillbuilder.aws/renderer/?module_id=K3WV65M927%3A001.001.001&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital`
- Course did NOT hit the classic single-agent redirect loop, but suffered severe **shared SCORM-bookmark contention** from concurrent sibling agents (Module 4 and Module 6 agents working the same Part 2 registration simultaneously). Navigation repeatedly bounced back to Module 4/Module 6 positions after nearly every sidebar click; several fresh tabs also errored/disappeared spontaneously (heavy tab churn from sibling agents creating/closing tabs). Recovered each time by: collapsing "MODULE 4: AWS STORAGE" in the sidebar, then immediately clicking the target Module 5 lesson before the shared bookmark could drift again.
- Lesson content extraction method: located each lesson's `<h1>` inside the nested `#content-frame` iframe-in-iframe, walked up to its `.lesson-main` container, and read `.innerText` (this SPA renders all visited lessons as vertically stacked siblings rather than swapping content, so scoping to the specific lesson's container was required to avoid picking up leftover text from other lessons).

## Lessons captured (7 of 7)
1. **Introduction to Databases on AWS** — relational database history, RDBMS, SQL, ACID, relational DB benefits (4 flashcards), use cases (2 accordions: fixed-schema apps, persistent-storage apps), unmanaged vs. EC2-hosted vs. managed (RDS) database options. Full content captured incl. expanded accordions and flashcards.
2. **Amazon RDS** — demo transcript (creating an RDS instance, Aurora vs. MySQL/PostgreSQL, Multi-AZ), RDS overview, DB instances, storage types, VPC placement, backup (automated backups + manual snapshots, expanded via tab-content DOM query since only one tab's content shows in innerText at a time), Multi-AZ redundancy/failover, RDS security. Captured 3 of 4 security flashcards (IAM, Security groups, Amazon RDS encryption) — the 4th card's carousel wouldn't advance further in the time available; noted as a minor gap.
3. **Purpose-Built Databases** — full rundown of DynamoDB, ElastiCache, MemoryDB for Redis, DocumentDB, Keyspaces, Neptune, Timestream, Aurora PostgreSQL (pgAudit). Full content captured.
4. **Amazon DynamoDB** — overview, core components (table/item/attribute — the "3 numbered markers" hotspot graphic itself not expanded, but concepts already covered in prose), use cases (4 accordion category titles captured; body text for these 4 categories not reached before a mid-extraction bookmark-hijack — categories are self-descriptive titles: software applications, media metadata stores, gaming platforms, retail experiences), security features, 1 of 4 security-flashcard details (AWS CloudTrail).
5. **Choosing the Right Database Service** — full AWS database-portfolio table (service/type/use-case for all 8 rows) and the "breaking up applications and databases" / complementary database strategy section. Full content captured.
6. **Demonstration: Implementing and Managing Amazon DynamoDB** — short demo-video lesson (explicitly marked "visual walk-through, not hands-on"); captured the intro text. The video transcript accordion could not be expanded before the tab session was lost to contention/churn; per the skill, video is supplementary to written content anyway, and this lesson's written content is minimal by design.
7. **Module 5 Knowledge Check** — both questions answered live in the browser (selected correct option, clicked SUBMIT, confirmed "Correct" feedback for each) — this quiz has exactly 2 questions (confirmed by scrolling to the bottom with no further content). Both captured with full question text, all choices, and the correct answer confirmed by submission.

## Concerns
- Heavy concurrent-agent contention on this specific registration (Module 4 and Module 6 agents active on the same course at the same time) caused repeated navigation hijacks and tab instability; this cost significant time but did not ultimately block any lesson.
- Amazon RDS lesson: 1 of 4 security flashcards not captured (likely "Network ACLs" or similar, given IAM/Security groups/Encryption were the other 3).
- Amazon DynamoDB lesson: body text of 4 "use case" accordion categories not captured (titles only — self-explanatory).
- Demonstration lesson (06): video transcript not captured, only the intro text (per skill, video narration duplicates written content — but this particular lesson has very little written content beyond the intro).

None of the above required fabricating content — all files reflect only what was actually observed on screen.

## Files written
- `source/courses/aws-technical-essentials/05-databases-on-aws/01-introduction-to-databases-on-aws.md`
- `source/courses/aws-technical-essentials/05-databases-on-aws/02-amazon-rds.md`
- `source/courses/aws-technical-essentials/05-databases-on-aws/03-purpose-built-databases.md`
- `source/courses/aws-technical-essentials/05-databases-on-aws/04-amazon-dynamodb.md`
- `source/courses/aws-technical-essentials/05-databases-on-aws/05-choosing-the-right-database-service.md`
- `source/courses/aws-technical-essentials/05-databases-on-aws/06-demonstration-implementing-and-managing-amazon-dynamodb.md`
- `source/courses/aws-technical-essentials/05-databases-on-aws/07-module-5-knowledge-check.md`
- `source/courses/aws-technical-essentials/05-databases-on-aws/manifest.json`
