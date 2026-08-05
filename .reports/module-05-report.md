# Module 5: Storage — Capture Report

## Status: BLOCKED

## What happened

The course outline page (`https://skillbuilder.aws/learn/PEXM2Q7XD5/digital-classroom-architecting-on-aws/7K1SN4ADEW`)
was reached successfully and the sign-in redirect auto-completed as expected. Clicking
**"Module 5: Storage"** in the left Outline list reliably shows the correct content panel
(confirmed by screenshot 6 separate times), with the heading "Module 5: Storage" and this
lesson list:

1. Overview
2. Storage Services
3. Amazon S3
4. Securing Objects
5. Storing Objects
6. Additional Amazon S3 Features
7. Shared File Systems
8. Data Migration Tools
9. Knowledge Check

However, **every attempt to actually enter the module viewer** — via the orange "Review"
button, via a lesson-name link inside the Module 5 panel, via "View next"/"View previous",
or via directly navigating to a `renderer/?module_id=...` URL — consistently redirected to
a *different* module instead of Module 5. Across ~20 attempts the app repeatedly resolved
navigation to one of a small set of unrelated module IDs (observed landing pages: "Module 6:
Database Services" lesson 2, "Module 7: Monitoring and Scaling" Knowledge Check, "Module 8:
Automation" Knowledge Check), never to Module 5, regardless of which sidebar item was
actually clicked immediately beforehand. This looks like a stale "resume/continue" bookmark
on this account (the course shows "Congratulations! You completed this training on
December 7, 2025") that the outline's navigation buttons fall back to instead of honoring
the specific module clicked.

Two brute-force attempts at guessing the Module 5 `module_id` prefix directly in a fresh tab
(`3PNV29BBPB`, `ATG65NWJC7`) both resulted in the app falling back to the same stale resume
point rather than an error, so they could not be confirmed as Module 5 either.

The session also hit two hard tab crashes ("Error loading tab") during this investigation,
requiring fresh tabs both times.

## What was NOT captured

No lesson content (screenshots/text) for Module 5: Storage was captured beyond the outline
panel's lesson-title list above. No `.md` files or `manifest.json` were written under
`source/courses/architecting-on-aws/05-storage/`, since writing Thai summaries would require
fabricating content from general AWS knowledge rather than the actual rendered pages, which
the skill explicitly disallows.

## Suggested next step

Retry in a completely fresh browser session/profile (or after the account's course
"resume position" is reset/cleared), since the failure mode appears tied to this specific
account's completed-course state rather than to the module content itself.

## Concerns
- Repeated tab crashes suggest possible extension/session instability independent of the
  app bug.
- The confirmed lesson list (9 items) is accurate and can be used to resume this task
  without re-deriving it, but no lesson bodies have been read yet.
