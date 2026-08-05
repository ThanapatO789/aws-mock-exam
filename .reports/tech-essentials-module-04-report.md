# AWS Technical Essentials — Module 4: AWS Storage — Capture Report

## Setup
- Course: AWS Technical Essentials, **Part 2** registration.
- Outline URL: `https://skillbuilder.aws/learn/K8C2FNZM6X/aws-technical-essentials/N7Q3SXQCDY`
- Apollo cache lookup found the whole "AWS Technical Essentials Part 2" course is served as a **single module_id** (`K3WV65M927:001.001.001`) with an internal Rise-authored outline (COURSE INTRODUCTION, MODULE 4-6, etc.) — not one module_id per AWS module like some other courses.
- Renderer URL used (no `referrer` param, per skill fix):
  `https://skillbuilder.aws/renderer/?module_id=K3WV65M927%3A001.001.001&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital`
- **Important correction to task assumption**: Part 1 and Part 2 do NOT have separate registrations — both use the same `registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b`. Confirmed by inspecting the Apollo cache (`Registration:2a587fad-...` was the only Registration object) and by the "Resume"/redirect URL for Part 2 resolving to that same registration_id. This module was therefore fully exposed to the shared-bookmark redirect bug, not lower-risk as assumed.

## Lesson list confirmed from in-module sidebar (Module 4: AWS Storage)
1. Storage Types
2. File Storage with Amazon EFS and Amazon FSx
3. Block Storage with Amazon EC2 Instance Store and Amazon EBS
4. Object Storage with Amazon S3
5. Choosing the Right Storage Service
6. Demonstration: Creating an Amazon S3 Bucket
7. Module 4 Knowledge Check

(Matches the list given in the task.)

## What was captured

### Lesson 1 — Storage Types (DONE, complete)
File written: `source/courses/aws-technical-essentials/04-aws-storage/01-storage-types.md`
Captured in full: file/block/object storage definitions, the "changing one character" block-vs-object illustration, all use-case accordions expanded (file storage: Web serving / Analytics / Media and entertainment / Home directories; block storage: Transactional workloads / Containers / Virtual machines; object storage: Data archiving / Backup and recovery / Rich media), and the "relating back to traditional storage systems" (DAS/SAN/NAS) closing section. Lesson completed cleanly with zero redirect issues (this was captured before other concurrent agents began actively navigating Module 5/6 on the shared registration).

### Lessons 2-7 — NOT captured (BLOCKED)
Once other agents (working Module 5: Databases and Module 6: Monitoring/Load Balancing/Scaling of this same Part 2 registration, and possibly Module 1 of the separate Part 1 registration) began actively navigating, every attempt to scroll/click inside the "File Storage with Amazon EFS and Amazon FSx" lesson content pane got hijacked mid-session:
- Repeated fresh-tab / fresh sidebar-click attempts (6+) all started correctly on the right lesson, but any interaction (mouse-wheel scroll, keyboard Down, or even a single click) inside the content pane caused the page to jump to unrelated content — observed jumping to "Module 6 Knowledge Check" and "Choosing the Right Database Service" (Module 5), i.e. content from other agents' active tabs.
- Confirmed this is not just a stale screenshot: a click intended as a "scroll trigger" actually **landed on and selected a radio-button answer** ("Launch template, scaling policies, Amazon EC2 Auto Scaling group") on what appeared to be another agent's live Module 6 Knowledge Check quiz. This means the interference is not cosmetic — my actions could have altered another agent's in-progress quiz state.
- Given that real risk of cross-agent corruption, further interaction was stopped immediately rather than continuing to retry.

## Files written
- `source/courses/aws-technical-essentials/04-aws-storage/01-storage-types.md`
- `source/courses/aws-technical-essentials/04-aws-storage/manifest.json` (lists all 7 lessons per the confirmed sidebar; only lesson 1 has a corresponding content file so far)

## Recommendation
- This registration (`2a587fad-...`) is being hit concurrently by at least 2-3 other agents (Module 1, Module 5, Module 6). The task's premise that Part 2 is "a different registration ... lower risk" is incorrect — it's the same registration as Part 1, so all modules across both parts are contending for the same SCORM bookmark.
- Recommend **not running further Module 4 sub-agents concurrently with Module 5/6 agents** on this course. Retry Module 4 lessons 2-7 solo, after the other Module 5/6 agents have finished, using the same renderer URL above (no `referrer` param) and the down-arrow-click scroll technique (avoid mouse-wheel scroll and avoid clicking inside the content pane beyond the scroll arrows) which worked cleanly for Lesson 1.
