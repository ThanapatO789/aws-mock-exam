# AWS Technical Essentials — Module 3: AWS Networking — Capture Report (retry 2, solo run)

## Summary
Ran solo (no concurrent module agents), navigated directly to the Part 1 renderer URL, signed in via "Create or Sign in" (AWS Builder ID), which auto-completed after a short wait. Landed on the resume-bookmark lesson (Module 2 Knowledge Check), then navigated the left sidebar (no `referrer=` param present in the URL) to Module 3: AWS Networking. No redirect-loop bug encountered this run — sidebar navigation across all 6 lessons was stable and direct.

Used the JS extraction method throughout: `document.getElementById('renderer_iframe').contentDocument.getElementById('content-frame').contentDocument.querySelector('main.lesson-main').innerText`, read in ~1000-char slices to avoid tool output truncation. No DOM-contamination (leftover-lesson-text) issues observed on any lesson transition in this run.

## Lessons captured (6/6)

1. **Introduction to Networking** — networking basics (letter/address analogy), IP addresses, IPv4 notation/octets, CIDR notation, AWS CIDR size limits (/28 smallest, /16 largest). No accordions besides the (skipped) video transcript toggle. Full lesson captured.
2. **Amazon VPC** — VPC creation factors (name/Region/CIDR), subnets, high availability (2+ AZs), reserved IPs (5 per subnet, worked example with /22 VPC), Internet gateway, Virtual private gateway + customer gateway + VPN, AWS Direct Connect. No accordions to expand (video transcript only, skipped per skill guidance). Full lesson captured.
3. **Amazon VPC Routing** — main route table (rules, cannot delete, default allow-local), custom route tables (per-subnet routing, local route). No accordions. Full lesson captured.
4. **Amazon VPC Security** — Network ACL (stateless, subnet-level) with full Default network ACL and Custom network ACL rule tables expanded (3 accordion buttons found: "Default network ACL", "Custom network ACL", "Security group inbound rules" — all clicked and captured as markdown tables); Security groups (stateful, EC2-instance level) with full inbound rules table; 3-tier isolation example. Full lesson + all 3 tables captured.
5. **Demonstration: Relaunching the Employee Directory Application in Amazon EC2** — video-only demo lesson. Initial JS read returned only the intro text (357 chars); clicking the "Transcript" accordion did not immediately reflect in a follow-up JS read (still 357), but a screenshot taken shortly after showed the transcript had rendered, and a subsequent JS read picked up the full transcript (8717 chars) — captured in full: step-by-step demo of creating a VPC (`app-vpc`, 10.1.0.0/16), 4 subnets (2 public/2 private across 2 AZs), internet gateway (`app-igw`), custom route table with 0.0.0.0/0 → IGW route associated to the 2 public subnets, and relaunching the EC2 instance ("Launch more like this") into the new VPC/public subnet with a newly-created security group (HTTP 80 + HTTPS 443). Note for future runs: this course's transcript accordion can render with a delay — if a JS length-check right after clicking looks unchanged, wait/screenshot before concluding there's no transcript.
6. **Module 3 Knowledge Check** — 3 questions, answered and submitted live in-browser (not inferred): Q1 route table attach target → **Subnets** (Correct); Q2 security group default → **blocks inbound, allows outbound** (Correct); Q3 True/False "network ACL filters at EC2 instance level" → **False** (Correct). All confirmed via on-screen "Correct" feedback after each submit. Note: on first load the quiz DOM briefly reported stale "Incorrect"/explanation text mixed into an early innerText read before the questions were actually answered by this session — ignored that reading and answered fresh via UI clicks + Submit to get authoritative results, per skill guidance.

## Files written
- `source/courses/aws-technical-essentials/03-aws-networking/01-introduction-to-networking.md`
- `source/courses/aws-technical-essentials/03-aws-networking/02-amazon-vpc.md`
- `source/courses/aws-technical-essentials/03-aws-networking/03-amazon-vpc-routing.md`
- `source/courses/aws-technical-essentials/03-aws-networking/04-amazon-vpc-security.md`
- `source/courses/aws-technical-essentials/03-aws-networking/05-demonstration-relaunching-the-employee-directory-application-in-amazon-ec2.md`
- `source/courses/aws-technical-essentials/03-aws-networking/06-module-3-knowledge-check.md`
- `source/courses/aws-technical-essentials/03-aws-networking/manifest.json`

## Concerns
- None blocking. Minor: the demo-lesson transcript timing quirk noted above (JS read lag after clicking an accordion) — worth a beat of `wait` + re-read if a future module hits the same pattern.
- Tab closed at end of run; no leftover Chrome tabs.
