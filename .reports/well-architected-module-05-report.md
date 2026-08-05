# Module 5 - Deep Dive on the Security Pillar — Capture Report

## Status: BLOCKED

## What worked
- Apollo cache extraction on the outline page
  (`https://skillbuilder.aws/learn/U89MJTNSM8/aws-well-architected-foundations/RCY5NFM8R9`)
  gave a clean module_id map for the whole course, confirming Module 5:
  - `module_id`: `64KFR9QKU7:001.001.003`
  - Course-correct `product_id`: `RCY5NFM8R9:003.000.000`
    (NOTE: an `N7Q3SXQCDY:001.005.004` product_id was also seen circulating in
    other agents' tabs in this shared browser session — that one belongs to a
    *different* course and causes an "Access Denied" S3 XML error if used
    with this course's modules. `RCY5NFM8R9:003.000.000` is the one that
    actually loads this course.)
  - `registration_id`: `dcab5ee7-64a3-55f6-8170-d1f38d990ed1` (also saw a
    `2a587fad-...` registration_id circulating from other agents/other
    courses — did not work for this course, produced Access Denied).
  - Working renderer URL (no `&referrer=`):
    `https://skillbuilder.aws/renderer/?module_id=64KFR9QKU7%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital`
  - This URL DID load past the Access Denied problem (several clean
    fresh-tab attempts confirmed the id/product/registration combo is
    correct), and the module's left-sidebar course menu was readable via
    `document.getElementById('renderer_iframe').contentDocument` (same-origin,
    `get_page_text` did not work but direct JS `.innerText` extraction did).

## Full lesson list recovered (from sidebar, NOT lesson content)
1.1 Welcome!
1.2 Learning objectives
1.3 Security Pillar Overview
1.4 Pillars of Well-Architected
1.5 What is the security pillar?
1.6 Security Design Principles
1.7 Security
1.8 Security Best Practices
1.9 Security
1.10 Security Foundations
1.11 Shared responsibility
1.12 AWS account management and separation
1.13 Operating your workloads securely
1.14 Identity and Access Management
1.15 Identity management
1.16 Permissions management
1.17 Detection
1.18 Detection
1.19 Infrastructure Protection
1.20 Protecting networks
1.21 Protecting compute
1.22 Data Protection
1.23 Classifying data
1.24 Protecting data at rest
1.25 Protecting data in transit
1.26 Incident Response
1.27 Design goals of cloud response
1.28 Educate
1.29 Prepare, simulate, iterate
1.30 Application Security
1.31 Application security
1.32 Question 1 (Knowledge Check)
1.33 Question 2 (Knowledge Check)
1.34 Question 3 (Knowledge Check)
1.35 Summary
1.36 Thank you
(2.1 Keyboard Shortcuts — not real course content, a player help pane)

## What blocked lesson-content capture
Every fresh-tab load of the module 5 renderer URL landed on the same first
slide (a full-screen black video-cover slide reading "Module 5 - Deep Dive
on the Security Pillar" with a center Play button) and **would not advance**:
- Clicking the sidebar lesson `<li>` items via JS `.click()` and via full
  synthetic pointerdown/mousedown/pointerup/mouseup/click MouseEvent
  sequences produced no visible change.
- Clicking the "COURSE MENU" tab button (JS-dispatched) produced no visible
  change (sidebar never visibly opened on screen, even though its DOM nodes
  and text are present/readable).
- Clicking "NEXT" the same way had no effect. The NEXT button's
  `getBoundingClientRect()` also reported `x≈1589`, outside the 1512px-wide
  viewport, suggesting a layout/CSS issue in addition to the click problem.
- A **real mouse click** (via the `computer` tool, not JS) directly on the
  visible Play button circle at its screen coordinates also produced no
  visible change after a 2-4s wait.
- This was reproduced across 4 separate fresh tabs / page loads, all landing
  on the identical stuck cover frame.
- innerText extraction of the whole iframe body never exceeded ~2100-2150
  characters (just the sidebar menu list + player chrome text), i.e. no
  actual lesson body text was ever rendered/reachable, consistent with the
  video simply never starting/loading.

This matches the skill's own prior note ("the video got stuck loading
anyway") but here it blocked the *very first* slide of the module, so no
lesson content at all (not even lesson 1.1) could be captured this run.

## Heavy contention from concurrent agents
This session ran concurrently with (per the task) 8 other agents on other
modules of the same course, all sharing the same Chrome tab group. Observed
effects, independent of the video-stuck issue above:
- Other agents repeatedly closed tabs I had just created/navigated
  (`tabs_context_mcp` would come back with my tab missing seconds after I'd
  navigated it), forcing many fresh-tab retries just to get a stable window
  to test in.
- The tab group churned constantly with other agents' renderer tabs for
  modules 1, 2, 3, 4, 6, 7, 9 appearing and disappearing.
- I incidentally observed (in other agents' tabs, not mine) that per-module
  video transcript PDFs are fetchable directly from
  `https://skillbuilder.aws/cds/<package-id>/story_content/external_files/<name>.pdf`
  when a valid signed session/query exists — e.g.
  `AWS_WA_Module1_FrameworkOverview_Transcript.pdf`,
  `Module-9_Transcript.pdf`, `Module-3_Transcript.pdf`. I do not have Module
  5's correct package id or transcript filename (guessed
  `f02eeb6d-db43-4b4a-90b0-5159a322752c` from the module's
  `analytics-frame` iframe src, and guessed `Module-5_Transcript.pdf` as the
  filename by analogy with Module 9 — both guesses returned S3
  `AccessDenied`, i.e. wrong package id and/or wrong filename and/or needed
  a signed query string I don't have). This is an unconfirmed lead for a
  retry, not a working fallback — and per the skill, video transcripts
  should only be a last resort, not a substitute for the "written content
  below the video" the skill says these lessons should also have.

## Files written
None. Per the skill's explicit instruction ("Never write a lesson's `.md`
file from general AWS knowledge as a substitute for content you couldn't
actually see on screen — a missing file is honest; a plausible-sounding
fabricated one is worse"), no lesson `.md` files or `manifest.json` were
written for `source/courses/aws-well-architected-foundations/05-deep-dive-on-the-security-pillar/`
since zero lesson body content was actually viewed.

## Recommendation for retry
- Retry solo (no concurrent agents on this course) — the tab-closing churn
  observed here would go away.
- If the video-cover-stuck issue reproduces even solo, try: reload the same
  URL in place (not a fresh tab) after the stuck state, or try appending
  `navigation=digital` variations, or wait longer (10s+) before any
  interaction in case the video asset itself was slow/throttled under the
  concurrent load from 8 other agents hammering the same CDN.
- The confirmed-correct `module_id` / `product_id` / `registration_id` /
  renderer URL above should save the next attempt the id-discovery work.
