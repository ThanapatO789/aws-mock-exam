# AWS Technical Essentials, Part 1 — Module 3: AWS Networking — Capture Report

## Status: BLOCKED

## What happened

Attempted to navigate to the Part 1 shared SCORM package
(`module_id=W9A4VFJXSF:001.000.001`, `product_id=N7Q3SXQCDY:001.005.004`,
`registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b`) to reach Module 3:
AWS Networking, following the skill's redirect-loop fix (fresh tab, no
`&referrer=` param).

Made **7 fresh-tab navigation attempts** to the exact target URL (well over
the skill's ~5-attempt cap). Every single one auto-redirected away from
`module_id=W9A4VFJXSF:001.000.001` to `module_id=K3WV65M927:001.001.001`
within 1-3 seconds of load, independent of any click/interaction on my
part — consistent with the skill's documented "resume bookmark" bug, but
far more aggressive than described, likely because **another agent was
concurrently working Module 2 against the same registration_id** at the
same time (a `03-aws-networking` and `02-aws-compute` directory both
existed pre-task, both still empty at time of this report, implying a
Module 2 agent was also actively fighting the same shared bookmark).

Additional instability observed beyond the documented bug:
- Several of my own tab groups were wiped out entirely between tool calls
  (tab IDs became invalid, replaced with an unrelated fresh empty tab
  group) — not just URL redirects, but the whole MCP tab group churning,
  suggesting heavy concurrent contention on the shared browser session.
- On the one attempt that held the correct `module_id` in the URL long
  enough for a screenshot, the SCORM package had internally resumed to
  **"Module 1 Knowledge Check"** content (part of the same shared
  package), not Module 3 — confirming the URL can be "correct" while the
  in-package lesson position still drifts to wherever the shared bookmark
  points.
- A cookie-consent banner appeared on at least one load, adding another
  layer of noise to the DOM extraction JS.

No Module 3 lesson content (Introduction to Networking, Amazon VPC, Amazon
VPC Routing, Amazon VPC Security, the EC2 relaunch demo, or the Module 3
Knowledge Check) was successfully viewed or captured. Per the skill's
explicit rule, no `.md` files were fabricated from general AWS knowledge.

## Files written
None — `source/courses/aws-technical-essentials/03-aws-networking/`
remains empty. No manifest.json was written.

## Known-good identifiers (for a retry)
```
module_id: W9A4VFJXSF:001.000.001
product_id: N7Q3SXQCDY:001.005.004
registration_id: 2a587fad-5ce1-5539-999a-7c736d0f0f2b
```
Target renderer URL (no referrer param):
```
https://skillbuilder.aws/renderer/?module_id=W9A4VFJXSF%3A001.000.001&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital
```

## Recommendation
- **Retry solo**, not concurrently with any other agent touching the same
  `registration_id` (this includes the Module 2 agent on this same Part 1
  package — Modules 1/2/3 all share this one registration/module_id, so
  they cannot safely run in parallel per the skill's explicit warning).
- If solo retry still redirect-loops, this may need the LRS/CDS direct-fetch
  approach mentioned in the skill's "If the course is fully stuck" section,
  or simply trying again later once the shared bookmark state settles.
