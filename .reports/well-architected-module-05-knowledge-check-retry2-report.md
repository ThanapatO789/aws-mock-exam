# Module 5 (Security Pillar) Knowledge Check — retry 2 report

## Outcome
Success. Got full text + confirmed answers for all 3 Knowledge Check questions.

## What changed vs. the prior failed attempt
- Extension was confirmed connected (`tabs_context_mcp`) before starting.
- Direct deep-link navigation to the renderer URL repeatedly hit the "resume last activity"
  bug (bounced to Module 8 - Cost Optimization / module_id HMQX2PG25K), even before any
  click, on a completed/mixed-progress registration.
- Fix: navigated to the course outline page
  (`https://skillbuilder.aws/learn/U89MJTNSM8/aws-wellarchitected-foundations/RCY5NFM8R9`),
  clicked "Module 5 - Deep Dive on the Security Pillar" in the left outline list, then
  clicked the module's own "Resume" button. That landed correctly on
  `module_id=64KFR9QKU7:001.001.003` (with `&referrer=...`). Re-navigating to the same URL
  with `referrer` stripped kept it stable on the correct module afterward.
- On the correctly-loaded module, clicked the module's "Play" button once (per skill doc's
  known fix) — after that click, ALL subsequent raw-data-file fetches to
  `html5/data/js/*.js` returned 200, no 403s (this is what failed 100% of the time in the
  prior attempt).

## Method
1. Landed on module renderer for `64KFR9QKU7:001.001.003`, package id
   `f02eeb6d-db43-4b4a-90b0-5159a322752c` (from network requests).
2. Clicked Play once.
3. Fetched `html5/data/js/data.js`, located the 3 Question slides by `"title":"Question N"`,
   extracting their `html5url` filenames:
   - Question 1 → `6CAiIHNLmY8.js`
   - Question 2 → `5u6HNTma5om.js`
   - Question 3 → `6EMBJut2TIc.js`
4. Fetched each per-slide JS file (all 200 OK) and extracted all `"text":"..."` fields to
   get question text and answer choices verbatim.
5. **Found an embedded answer key in each Question slide's JSON**: each correct-choice
   object has a field `"altText":"Choice X is the correct answer."` (accessibility text for
   the correct-answer feedback overlay). Used this as a confirmed answer key — no need to
   click "Show answers" live.

## Confirmed answers (from embedded data, not inferred)
- Q1: A
- Q2 (select 3): B, C, D
- Q3 (select 3): A, B, D

All three checked for internal consistency against real AWS Well-Architected Security
Pillar best-practice-area and design-principle names — they match cleanly.

## File written
`source/courses/aws-well-architected-foundations/05-deep-dive-on-the-security-pillar/12-knowledge-check.md`
— replaced the prior diagnostic-only placeholder with full question text, choices, and the
embedded-confirmed answers (marked as confirmed-from-embedded-data in the note).

No other lesson files or the manifest were touched. No git commit made.

## Concerns
None. All 3 questions got verbatim on-screen text and a confirmed (not inferred) answer
key. Chrome tab opened for this task was closed at the end.
