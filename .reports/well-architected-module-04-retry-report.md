# Module 4 - Deep Dive on the Operational Excellence Pillar — Retry Capture Report

## Status: BLOCKED

## What worked
- Apollo cache extraction on the outline page
  (`https://skillbuilder.aws/learn/U89MJTNSM8/aws-well-architected-foundations/RCY5NFM8R9`)
  confirmed Module 4's `module_id`: `2B77KASG72:001.001.003`
  (product_id `RCY5NFM8R9:003.000.000`, registration_id
  `dcab5ee7-64a3-55f6-8170-d1f38d990ed1` — both match this run's task brief).
- Working renderer URL (no `&referrer=`):
  `https://skillbuilder.aws/renderer/?module_id=2B77KASG72%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital`
- Once loaded (not redirected away), `document.getElementById('renderer_iframe').contentDocument.body.innerText`
  worked immediately (same-origin, no cross-origin error) and returned the
  full 28-item lesson menu tree for the module (confirms this is the
  Storyline/Rise-hybrid renderer described in the skill, with menu + content
  sharing one iframe document):
  1.1 Welcome!, 1.2 Learning objectives, 1.3 Operational Excellence Pillar
  Overview, 1.4 Pillars of Well-Architected, 1.5 What is the operational
  excellence pillar?, 1.6 Operational Excellence, 1.7 Operational excellence,
  1.8 Operational Excellence Best Practices, 1.9 Operational excellence,
  1.10 Organization, 1.11 Organization priorities, 1.12 Operating models,
  1.13 Organizational culture, 1.14 Prepare, 1.15 Design Telemetry,
  1.16 Design for operations, 1.17 Mitigate deployment risks,
  1.18 Operational readiness and change management, 1.19 Operate,
  1.20 Understanding workload health, 1.21 Understanding operational health,
  1.22 Responding to events, 1.23 Evolve, 1.24 Learn, share, and improve,
  1.25 Question 1, 1.26 Question 2, 1.27 Summary, 1.28 Thank you
  (plus a "2. Keyboard Shortcuts" section, not course content).
- Clicking the sidebar entry for "1.1. Welcome!" successfully selected it
  (checkmark appeared, no redirect) confirming in-module lesson navigation
  can work without bouncing to the outline, when the tab survives long
  enough.

## What blocked progress
1. **The "1.1. Welcome!" slide's content pane rendered fully blank** (solid
   dark background, confirmed via zoomed screenshot — no text, no visible
   graphic) even after waiting several seconds and clicking the small
   play/scrub control at the bottom of the pane. This matches a prior run's
   finding for this same module: the cover/title slide is a video-only
   Storyline slide with no on-DOM text content. I did not click the video's
   main Play button, per the skill's rule against transcribing narration —
   but never got to test whether a later lesson (e.g. 1.2 "Learning
   objectives") has real visible text, because of blocker #2 below.
2. **Severe, repeated tab-group instability**, worse than a normal redirect
   loop:
   - Multiple times, `tabs_context_mcp` returned "No tab group exists for
     this session" entirely — i.e. every tab I owned vanished between tool
     calls, not just navigated away. Had to recreate the tab group from
     scratch and start over each time.
   - When a tab did survive, navigating directly to the Module 4 renderer
     URL repeatedly redirected instead to **Module 2** (`XY3A1YQY8V`) or
     **Module 3** (`HGFX4J46UN`) — both of which were also seen loaded in
     tabs at the very start of this run before I created my own tab,
     strongly suggesting other concurrent agents were actively working
     Module 2 and Module 3 against the *same* registration_id at the same
     time, and their navigation/bookmark writes were bleeding into mine
     (the shared-bookmark contention this skill's "already-100%-complete
     course" section warns about, but observed here even though this
     course may not be fully complete).
   - On one attempt, the tab reached the Module 4 cover slide, held through
     a clean load, but then a single click on the visible Play button
     immediately navigated the tab to a Module 3 loading screen (confirmed
     via screenshot: a generic "loading" illustration, URL showed
     `module_id=HGFX4J46UN`).
   - On the final attempt, a tab that had just successfully loaded Module 4
     and received one click was found to no longer exist at all one tool
     call later (`tabs_context_mcp` → "No tab with id").
3. Total clean fresh-tab attempts at the Module 4 URL: 5, all either
   redirected away or hit the blank-cover-slide / vanishing-tab problems
   above, consistent with the skill's guidance to cap retries at ~5 and
   report BLOCKED rather than keep grinding.

## Files written
None. No lesson `.md` files or `manifest.json` were written — no confirmed
on-screen lesson body text was captured for any of the 28 lessons (only the
sidebar's lesson-title list, which is not lesson content). Per the skill's
explicit instruction, a missing file is preferred over a fabricated one.

## Suggestions for a future retry
- Retry solo, with no other agents concurrently active against this same
  registration_id (`dcab5ee7-64a3-55f6-8170-d1f38d990ed1`) — this run's
  evidence (Module 2 and Module 3 tabs/redirects appearing unprompted)
  strongly suggests the module-04 agent was not actually alone on this
  registration this time, despite the task brief describing only 2-3
  concurrent agents.
- If the "Welcome!" cover slide is still blank on a clean load, treat it as
  a genuine content-free title slide (skip it, note "no text content" in
  its .md file) and move straight to 1.2 "Learning objectives" — don't burn
  retries trying to extract text that likely doesn't exist in the DOM for
  that specific slide.
- If tab-group wipes recur even solo, that points to a session-wide Chrome
  extension issue rather than anything module-specific — worth flagging to
  the user/controller directly rather than continuing to retry.
