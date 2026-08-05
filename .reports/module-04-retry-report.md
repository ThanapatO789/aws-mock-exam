# Module 4: Compute — Retry Capture Report

## Outcome
DONE — full clean run using the referrer-stripped deep link. The URL held
through all 8 lessons with zero redirect-loop bounces. No retries needed.

## URL used
```
https://skillbuilder.aws/renderer/?module_id=3PNV29BBPB%3A001.000.005&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&navigation=digital
```
(no `&referrer=...` param — confirmed fix). Landed straight on the module
viewer (resumed at Lesson 8/Knowledge Check per the account's bookmark), and
sidebar navigation between lessons worked reliably for the rest of the
session.

## Method notes
- `document.getElementById('renderer_iframe').contentDocument.body.innerText`
  worked throughout — no cross-origin issue this time, no need to fall back
  to screenshots for lesson body text.
- The `computer` tool's `scroll`/`Page_Down` actions stopped affecting the
  page after the first couple of screenshots (screen appeared to
  auto-zoom/resize once, then scroll had no visible effect). Did not block
  progress since all content was reachable via JS text extraction and
  interactive-element `.click()` calls instead of visual scrolling.
- Lessons use several interactive component types, all handled via JS:
  - **Labeled-graphic hotspot markers** (`.labeled-graphic-marker`) — real
    content behind every one this module (unlike the "decorative, no extra
    text" pattern seen in some other modules). Clicked each one, closed via
    `.bubble__close`, and read the surrounding `body.innerText` around the
    marker's label.
  - **Flashcards** (front/back) — front-side text was already present in
    `innerText` without flipping; used as-is.
  - **Accordions** (`.blocks-accordion`) — the 5-category instance-type
    accordion (General purpose / Compute optimized / Memory optimized /
    Accelerated computing / Storage optimized) and the EBS vs. instance
    store accordion were genuinely collapsed (title-only in `innerText`
    until clicked) — clicked each `.blocks-accordion__header` to expand and
    re-read.
  - **Tabs** (`.blocks-tabs__header-item`) — Tenancy (Shared / Dedicated
    instance / Dedicated host) and EBS volume types (SSD / HDD) each needed
    every tab clicked to capture non-active tab content.
- Did not play/transcribe any instructor videos, per skill guidance — all
  written content duplicates video narration.

## Lessons captured (8/8)
1. **Overview** — module intro, learning objectives list.
2. **Compute Services** — evolution-of-compute-services hotspot graphic (5
   points: Amazon EC2, Containerization, AWS Lambda, AWS Fargate, AWS
   Graviton processors).
3. **EC2 Instances** — longest lesson: EC2 basics, 8-point launch
   considerations hotspot, AMI concept + AMI-source flashcards, instance
   type naming (4-point hotspot: family/generation/properties/size),
   5-category instance-family accordion, AWS Compute Optimizer, key pairs,
   3-way tenancy tabs, placement groups (cluster/spread/partition), user
   data.
4. **Storage for EC2 Instances** — Amazon EBS overview + snapshots,
   EBS-vs-instance-store accordion, EBS volume types via SSD/HDD tabs
   (gp2/gp3, io1/io2, st1, sc1), instance store details.
5. **Amazon EC2 Pricing Options** — On-Demand/Savings Plans/Spot flashcards,
   Spot Instance interruption behavior, 3-point Spot use-case hotspot
   (rendering, big data/analytics, web services).
6. **AWS Lambda** — Lambda concept/event-source model, 6-point use-case
   hotspot (web apps, backends, data processing, chatbots, Alexa, IT
   automation).
7. **Tech Talk** — video-only lesson, no written body content beyond the
   intro line; noted as such rather than padded.
8. **Knowledge Check** — 3 questions, all answered live and submitted
   (confirmed "Correct" per question via the graded DOM state, not
   inferred): AMI true/false select-two, `m6g.2xlarge` family-letter
   multiple-choice, Lambda true/false select-two (10 GB max memory / 15 min
   max timeout).

## Concerns
None. Content coverage feels complete and every interactive component type
present in the module was checked and expanded where it hid real content.

## Files written
- `source/courses/architecting-on-aws/04-compute/manifest.json`
- `source/courses/architecting-on-aws/04-compute/01-overview.md`
- `source/courses/architecting-on-aws/04-compute/02-compute-services.md`
- `source/courses/architecting-on-aws/04-compute/03-ec2-instances.md`
- `source/courses/architecting-on-aws/04-compute/04-storage-for-ec2-instances.md`
- `source/courses/architecting-on-aws/04-compute/05-amazon-ec2-pricing-options.md`
- `source/courses/architecting-on-aws/04-compute/06-aws-lambda.md`
- `source/courses/architecting-on-aws/04-compute/07-tech-talk.md`
- `source/courses/architecting-on-aws/04-compute/08-knowledge-check.md`

No git commit made, per instructions.
