# AWS Technical Essentials — Module 6 capture report

Course: AWS Technical Essentials, Part 2 (registration_id `2a587fad-5ce1-5539-999a-7c736d0f0f2b`, product_id `N7Q3SXQCDY:001.005.004`).

Note: unlike what the task brief assumed, Part 1 and Part 2 are **not** separate registrations — the Apollo cache showed a single `Registration` object for both. Part 2 is delivered as one Articulate Rise SCORM package (`module_id K3WV65M927:001.001.001`) containing all of Modules 4-8 as sections within one long scrollable course, navigated via `#/lessons/<lessonId>` hash routes inside the nested content iframe (not via separate `module_id` values per module as the skill's fast-lookup method assumes for other courses).

Renderer URL used (no `referrer` param):
`https://skillbuilder.aws/renderer/?module_id=K3WV65M927%3A001.001.001&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital`

Extraction technique: read `main.textContent` (not `innerText`, which is truncated by the page's viewport-windowed/virtualized rendering) from inside the doubly-nested content iframe, normalizing whitespace. This reliably captured full lesson text including accordion/flashcard/hotspot back-content without needing to click to expand anything (`textContent` ignores CSS-hidden state).

## Lessons captured (8/8 confirmed from outline; sidebar list matched exactly)

1. **Monitoring** — purpose of monitoring, metrics/statistics, per-service metric examples (S3/RDS/EC2 flashcards), 5 monitoring benefits (accordion), resources list. Full content captured.
2. **Amazon CloudWatch** — CloudWatch overview, basic vs detailed vs high-resolution custom metrics, metric/timestamp/dimension hotspots, CloudWatch dashboards, CloudWatch Logs (log event/stream/group hotspots), CloudWatch alarms (3 states flashcard, 3-step alarm example). Full content captured (18.5k chars, longest lesson).
3. **Solution Optimization** — availability percentage/nines table, adding a second AZ, active-passive vs active-active accordion, vertical vs horizontal scaling. Full content captured.
4. **Traffic Routing with Elastic Load Balancing** — ELB features, health checks, connection draining, ELB components (rule/listener/target group hotspots), ALB (6-category accordion), NLB and GLB (flashcards), comparison table. Full content captured (17.2k chars).
5. **Amazon EC2 Auto Scaling** — active-passive/active-active recap, traditional vs auto scaling, auto scaling features flashcards, 3 main components, launch template vs launch configuration, ASG capacity settings (min/desired/max hotspots), 3 scaling policy types (tabbed content). Full content captured (21.5k chars, longest lesson).
6. **Demonstration: Making the Employee Directory Application Highly Available** — this lesson is a pure video walkthrough (no separate written article); summarized the full transcript's step-by-step console workflow (2nd EC2 instance, ALB, launch template, ASG with target-tracking policy at 60% CPU, stress-test verification).
7. **Employee Directory Application Redesign** — course closing lesson, also transcript-only; summarized the three-tier breakdown and serverless redesign (S3 static site + API Gateway + Lambda + DynamoDB, Route 53 + CloudFront).
8. **Module 6 Knowledge Check** — **only 1 of the quiz's questions could be confirmed.** Question 1 ("What are the three components of Amazon EC2 Auto Scaling?") was answered and submitted live; confirmed correct answer: "Launch template, scaling policies, Amazon EC2 Auto Scaling group." Could not reach/answer further questions — see Concerns below.

## Accordions/hotspots/flashcards handled
All accordion, flashcard, and numbered-hotspot back-content across all 8 lessons was captured via `textContent` extraction (confirmed present in the raw text dumps) without needing manual click-to-expand, since the technique bypasses CSS visibility state entirely.

## Concerns

- **Module 6 Knowledge Check is incomplete.** After confirming question 1's correct answer via a live submit, the shared course registration (contended by other concurrently-running agents working Modules 4/5 of the same Part 2 registration, and possibly a Part 1 agent) began redirect-looping / auto-navigating away from the Knowledge Check lesson on almost every subsequent attempt — matching the skill doc's documented "resume bookmark" redirect-loop bug, but occurring **within this single Part 2 registration itself**, not across separate registrations as the task brief assumed. Made well over 5 fresh-tab / hash-navigation attempts (exceeding the skill's suggested cap) with no more than a few seconds of stable access at a time; tabs were also repeatedly closed unexpectedly (likely from cross-agent tab-group contention). Stopped per the skill's guidance rather than continuing to grind.
- Lessons 1-7 were captured cleanly with no redirect issues — the instability was specific to the Knowledge Check page, encountered only after other agents' concurrent activity had had time to build up.
- The task brief's claim that Part 1 and Part 2 are "different registrations" does not match what the Apollo cache showed (single shared `Registration` id) — flagging this in case it affects how other concurrent Module 4/5/Part-1 agents were coordinated.
