# Module 7: Monitoring and Scaling — Retry Capture Report

## Result
SUCCESS. The direct deep-link URL (no `&referrer=...` param) held stably for the entire session — no redirect-loop bounce occurred on the main working tab. All 7 lessons were read and captured.

## Method
- Navigated fresh tab directly to the provided renderer URL (module_id=CZZWRSJ8V9:001.000.005).
- Confirmed lesson list from left sidebar: Overview, Monitoring, Alarms and Events, Load Balancing, Auto Scaling, Tech Talk, Knowledge Check (matches the prior outline read).
- Used `document.getElementById('renderer_iframe').contentDocument.body.innerText` (sliced in chunks to work around tool output truncation) as the primary extraction method — worked throughout, no cross-origin issues.
- Discovered the SPA keeps all previously-visited lessons mounted in the iframe DOM simultaneously (not unmounted on navigation), which is why later innerText dumps contained bleed-through from earlier lessons; slicing around unique heading text isolated each lesson correctly.
- Expanded all real accordions (rise `blocks-accordion__header` buttons) one at a time via targeted `button.click()` with short waits, verifying via `aria-expanded` — naive rapid-fire clicking of all items in one batch left only the last one open (they behave as a single-open accordion), so each had to be expanded and read individually.
- Confirmed the "hotspot" icon tiles in Monitoring's "Types of logs" section do not reveal extra text beyond their caption (per the skill's documented icon-vs-accordion distinction) — one test click opened a decorative CloudWatch metrics graph popup with no added text, consistent with prior findings.
- Answered and submitted the Knowledge Check quiz live (5 questions) to get an authoritative answer key rather than inferring from memory.

## Per-lesson summary
1. **Overview** — short intro paragraph + 4 learning objectives. Full capture.
2. **Monitoring** — CloudWatch overview, CloudWatch metrics, "Types of logs" hotspot section (4 tiles: CloudWatch Logs, CloudTrail, VPC Flow Logs, Custom logs), full AWS CloudTrail section incl. 4 worked log examples and summary, full VPC Flow Logs section. Full capture; hotspot icons tested, no hidden text confirmed.
3. **Alarms and Events** — CloudWatch alarms overview, all 3 alarm-state accordions expanded and captured (OK / ALARM / INSUFFICIENT_DATA), alarm components example, full Amazon EventBridge section with worked example. Full capture.
4. **Load Balancing** — ELB overview, all 5 feature-category accordions expanded and captured (High availability, Layer 4/7, Security features, Health checks, Monitoring operations), all 3 load-balancer-type tabs clicked and captured (ALB, NLB, GWLB). One gap: the comparison table image ("Features of different types of load balancers") never rendered (broken/lazy-load image, likely due to many background tabs competing for resources) — noted honestly in the file rather than fabricated; the narrative content already covers each type's key features.
5. **Auto Scaling** — AWS Auto Scaling overview, Amazon EC2 Auto Scaling overview + all 3 components (Launch Template, Auto Scaling group, Scaling policy) with the 4 scaling-invocation tools, all 3 "Ways to scale" accordions expanded and captured (Scheduled, Dynamic, Predictive scaling). Full capture.
6. **Tech Talk** — short video-summary lesson, one paragraph of on-screen text captured in full (no accordions/hotspots).
7. **Knowledge Check** — 5 questions answered and submitted live; all correct on first submission for the answer set used. Answer key: Q1 EC2 instance; Q2 Dynamic; Q3 Amazon EventBridge; Q4 ALARM + INSUFFICIENT DATA; Q5 "Store log data as a record of account usage" + "Capture root login failures".

## Concerns
- One broken/unloaded image (load-balancer comparison table) in Load Balancing lesson — content gap is disclosed inline in `04-load-balancing.md` rather than fabricated.
- Background tabs kept spontaneously opening to other modules' renderer URLs during this session (unrelated navigation, titles like "Module 9: Containers") — did not affect the main working tab's stability or content; all were closed at the end along with the main tab.

## Files written
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/01-overview.md`
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/02-monitoring.md`
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/03-alarms-and-events.md`
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/04-load-balancing.md`
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/05-auto-scaling.md`
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/06-tech-talk.md`
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/07-knowledge-check.md`
- `source/courses/architecting-on-aws/07-monitoring-and-scaling/manifest.json`
