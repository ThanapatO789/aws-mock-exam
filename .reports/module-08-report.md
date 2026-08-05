# Module 8: Automation — Capture Report

## Status: BLOCKED (partial capture)

## What was captured

- **Lesson list confirmed** (from the outline panel, seen twice independently): Overview,
  AWS CloudFormation, Infrastructure Management, Amazon Q Developer, Tech Talk, Knowledge Check
  (6 lessons total, matching the `Lesson N of 6` counter seen in the module viewer).
- **01-overview.md** — written in full. Captured via a working same-origin JS extraction
  (`iframe.contentDocument.body.innerText`) while briefly inside the module viewer. Content:
  module intro paragraph + "In this module, you learn how to" bullets (use AWS CloudFormation
  to automate infrastructure deployment; identify tools that automate deployment and help
  manage resources once deployed).
- **Knowledge Check, Question 1 only** (not written as a lesson file — answer not confirmed by
  submission, so it doesn't meet the skill's bar for a Knowledge Check file):
  "What is a AWS CloudFormation stack?"
  - All of the provisioned resources defined in a CloudFormation template
  - All of the resources identified as drifted in a CloudFormation template
  - A condition when resources are added on top of each other
  - The properties of a single resource
  (Correct answer not confirmed — never reached the point of submitting.)

## Not captured

AWS CloudFormation, Infrastructure Management, Amazon Q Developer, Tech Talk lessons, and the
full Knowledge Check (remaining questions + confirmed answers) were **not captured**. No files
were written for these — writing plausible-looking summaries from general AWS knowledge was
avoided per the skill's guidance, since that would be worse than no file.

## Root cause: the course viewer for this course is not navigable

This course ("Digital Classroom - Architecting on AWS") is already marked 100% complete on this
account (completed December 7, 2025). Revisiting it in "Review" mode triggers a self-redirect
loop:

- Landing on the course outline page (`/learn/...`) auto-navigates into a module renderer
  (`/renderer/?module_id=...`) within roughly 1–3 seconds, **independent of any user action** —
  confirmed by navigating and doing absolutely nothing (no click, scroll, or key) and still
  getting redirected into a module every time.
- The module it auto-lands on is not the one requested — it's the account's SCORM "bookmark"
  (repeatedly landed on Module 6: Database Services, activity id
  `dc-architecting-on-aws-module-6_database-services`, per LRS network calls), regardless of
  which module's Review button was clicked moments earlier.
- The `module_id` query parameter in the renderer URL is a single-use, server-resolved launch
  token, not a stable identifier — re-navigating to a previously-successful renderer URL gets
  silently rewritten to a different module_id by the server.
- Once *inside* a module (Module 8 was reached successfully exactly once, via
  find-ref-click on the outline's Module 8 "Review" button), any further interaction
  (sidebar lesson click, scroll, keypress, or even a fresh JS-driven click) triggers another
  top-level navigation that kills the JS execution context (`Inspected target navigated or
  closed`) and bounces back to the outline, restarting the redirect loop.
- The one successful Module 8 entry only lasted long enough to confirm the module title, the
  6-lesson sidebar list, and the Knowledge Check page (lesson 6 of 6, which happened to be the
  resume point that time) — not enough time to click through to Overview, extract it, and move
  to the next lesson before the next bounce. Overview was captured on a *separate* successful
  entry a few tries later.
- Roughly 50+ distinct navigation/click strategies were tried (pixel-coordinate clicks,
  accessibility-tree `find` + ref clicks, raw DOM JS clicks with spatial matching, keyboard
  paging, direct deep-link URL replay, batched action sequences) — all either landed on the
  wrong module or were killed mid-script by the auto-redirect.

## Technique that did work (for future attempts)

`javascript_tool` can read `document.getElementById('renderer_iframe').contentDocument.body.innerText`
directly — the iframe is same-origin (`skillbuilder.aws`), so `get_page_text`/`read_page` failing
is not actually a cross-origin issue for this course (contradicts the general skill note, which
may be accurate for other courses but isn't for this one). When it worked, this returned the
**full lesson text including the video transcript**, in one shot, far better than screenshot
scrolling. The blocker is entirely getting into a module and holding it long enough to click
through lessons, not the extraction itself.

## Suggestion for a retry

The self-redirect makes screenshot/click-based navigation unworkable for this specific course.
A retry should either: (a) attempt this weeks/months from now in case account-side SCORM state
changes, (b) try a completely fresh Chrome profile/session (the bookmark bug may be tied to this
specific registration_id), or (c) pursue the `/lrs/activities/state` and `/cds/<package-id>/`
endpoints seen in network requests — this is an Articulate Rise-authored SCORM package, and its
content may be directly fetchable via the LRS/CDS API rather than through the broken renderer
wrapper, though this wasn't pursued further given time spent.

## Files written

- `source/courses/architecting-on-aws/08-automation/01-overview.md`
- `source/courses/architecting-on-aws/08-automation/manifest.json` (lists only Overview)
