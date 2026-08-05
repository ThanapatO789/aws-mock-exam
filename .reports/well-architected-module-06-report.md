# Module 6 - Deep Dive on the Reliability Pillar — Capture Report

## Status: BLOCKED

## What happened

Ran under heavy concurrent load: 8 other agents were simultaneously working the
same "AWS Well-Architected Foundations" course registration in the same shared
Chrome tab group. This produced severe cross-agent interference well beyond
what the skill doc describes for a "Not started" course:

- My own tabs were repeatedly closed out from under me by unrelated activity
  (tab count in the shared group spiked past 10-15 at times).
- Direct `renderer/?module_id=...` navigations to Module 6 initially returned
  `AccessDenied` (S3-level) 4 times in a row using `product_id=N7Q3SXQCDY:...`
  — which turned out to be the wrong product_id, apparently belonging to a
  different course a sibling agent had open in the same tab group.
- Found the correct `product_id=RCY5NFM8R9:003.000.000` /
  `registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1` pair by reading a
  sibling agent's already-working tab URL. With this pair the module shell
  (header, "COURSE MENU" sidebar, video player chrome) loaded successfully
  and the module title "Module 6 - Deep Dive on the Reliability Pillar"
  rendered correctly.
- However, the actual lesson content pane (an Articulate Storyline-style
  `#slide` element inside `#frame-blocker`) rendered completely blank/black
  for every lesson tried (1.1 Welcome!, 1.2 Learning objectives), across a
  fresh page reload and multiple lesson-sidebar clicks. No video element was
  present in the DOM (`doc.querySelectorAll('video')` returned empty), no
  console errors were logged, and `body.innerText` only ever returned the
  course-menu/sidebar text, never lesson body text.
- On a later attempt, mid-script, my tab's URL was silently swapped by the
  platform to a *different* module (`9PB8EX6Q6M`, Module 7) — the classic
  "resume last activity" / shared-bookmark redirect bug described in the
  skill doc, this time hitting my own tab directly rather than just
  neighboring tabs.
- Total clean navigation attempts to Module 6's renderer URL: 6 (over the
  skill's suggested cap of ~5), plus several in-module content-load retries
  that also failed to render visible content.

## What was captured

The module's full lesson/section outline (from the in-page "COURSE MENU"
sidebar, confirmed via JS extraction of `body.innerText`, and cross-checked
visually against a screenshot of the open sidebar):

1. Module 6 - Deep Dive on the Reliability Pillar
   1.1. Welcome!
   1.2. Learning objectives
   1.3. Reliability Pillar Overview
   1.4. Pillars of AWS Well-Architected
   1.5. What is the reliability pillar?
   1.6. Reliability Design Principles
   1.7. Reliability design principles
   1.8. Reliability Best Practices
   1.9. Reliability best practice areas
   1.10. Foundations
   1.11. Manage service quotas and constraints
   1.12. Plan your network topology
   1.13. Workload Architecture
   1.14. Design your workload service architecture
   1.15. Design interactions in a distributed system to prevent failures
   1.16. Design interactions in a distributed system to mitigate [failures]
   1.17. Change Management
   1.18. Monitor workload resources
   1.19. Design a workload to adapt to changes in demand
   1.20. Implement change
   1.21. Failure Management
   1.22. Back up data
   1.23. Use fault isolation to protect your workload
   1.24. Design workload to withstand component failures
   1.25. Test reliability
   1.26. Plan for disaster recovery
   1.27. Question 1 (Knowledge Check)
   1.28. Question 2 (Knowledge Check)
   1.29. Question 3 (Knowledge Check)
   1.30. Summary
   1.31. Thank you
2. Keyboard Shortcuts (site chrome, not course content)

No lesson body content (text, bullets, or knowledge-check questions/answers)
could actually be read — the content pane never rendered anything visible
despite the shell loading correctly. Per the skill's explicit rule, no
lesson `.md` files were written from general AWS knowledge as a substitute.

## Working access parameters (for a retry)

```
module_id=AQZ844D4ZR:001.001.003
product_id=RCY5NFM8R9:003.000.000
registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1
```//
Renderer URL (no `referrer=` param, per skill fix):
```
https://skillbuilder.aws/renderer/?module_id=AQZ844D4ZR%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital
```

Note: an earlier `product_id=N7Q3SXQCDY:001.005.004` (paired with the same
outline page) reliably produced S3 `AccessDenied` for this module_id — do not
reuse that product_id for this course; it appears to belong to a different
course/session that was active in the shared tab group at the time.

## Recommendation

Retry this module solo (no concurrent sibling agents in the same tab group),
or with each agent given its own isolated browser profile/tab group, since
the failures observed here go beyond the documented "resume bookmark"
redirect loop and include outright blank content rendering that was not
present in the single-agent runs described in the skill doc.

## Files written

None (no lesson `.md` files or `manifest.json` — no verifiable content was
captured).

## Tabs

All tabs created by this agent during the run were closed. Tabs belonging to
sibling agents in the shared tab group were left untouched.
