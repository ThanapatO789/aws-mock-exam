# Module 9 - Deep Dive on the Sustainability Pillar — capture report

## Result: BLOCKED

No lesson `.md` files or manifest.json were written — no lesson text content
could actually be read on screen, and the skill explicitly forbids writing
notes from general knowledge as a substitute.

## What was confirmed

- Course: AWS Well-Architected Foundations
  - product_id: `RCY5NFM8R9:003.000.000`
  - registration_id: `dcab5ee7-64a3-55f6-8170-d1f38d990ed1`
  - (Caution: a *different* course was also live in the shared browser tab
    group this run, using product_id `N7Q3SXQCDY:001.005.004` /
    registration_id `2a587fad-...` — don't reuse those IDs for this course.)
- Module 9 module_id: `127VPJ1K6M:001.001.003`
- Working renderer URL (no `referrer` param):
  `https://skillbuilder.aws/renderer/?module_id=127VPJ1K6M%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital`
- Confirmed full lesson list from the module's own left sidebar (26 items):
  1.1 AWS Well-Architected · 1.2 Learning objectives · 1.3 Sustainability
  Pillar Overview · 1.4 Pillars of AWS Well-Architected · 1.5 What is the
  Sustainability pillar? · 1.6 Sustainability · 1.7 Sustainability design
  principles · 1.8 Sustainability · 1.9 Sustainability best practice areas ·
  1.10 Region Selection · 1.11 Region selection · 1.12 Alignment to Demand ·
  1.13 Alignment to demand · 1.14 Software and Architecture Patterns · 1.15
  Software and architecture patterns · 1.16 Data Patterns · 1.17 Data
  patterns · 1.18 Hardware and Services · 1.19 Hardware and services · 1.20
  Process and Culture · 1.21 Process and culture · 1.22 Question 1 · 1.23
  Question 2 · 1.24 Question 3 · 1.25 Summary · 1.26 Thank you.

## Why it's blocked (new failure mode, not the known redirect-loop bug)

This course is **not** the Rise-authored SCORM package the skill was written
against — the console shows it's an **Articulate Storyline HTML5** export
(`frame.desktop.min.js`, `bootstrapper.min.js`). Symptoms:

1. Heavy cross-agent tab contention (this course was being read by ~8-9
   concurrent agents sharing one Chrome tab group). Several fresh tabs got
   silently closed or redirected to a different module mid-task before any
   interaction — consistent with the skill's documented "resume bookmark"
   contention, but worse: tabs vanished outright, not just redirected.
2. Even on tabs that survived, the module title screen ("Module 9 - Deep
   Dive on the Sustainability Pillar" + a Play button) loads fine, and
   clicking Play successfully reveals the left lesson sidebar (matches the
   26-item list above). But the right-hand **content pane stays permanently
   black on every lesson**, whether reached by clicking a sidebar item or
   Play — confirmed via full-pane zoom screenshots (no near-invisible text
   either). `document.getElementById('renderer_iframe').contentDocument`
   shows the slide DOM has 120 SVGs + 1 canvas (a real Storyline slide got
   mounted) but nothing paints.
3. Console errors on lesson-link clicks:
   `TypeError: Cannot read properties of undefined (reading 'absoluteId')`
   at `frame.desktop.min.js` `onClickLink`, and a second `TypeError: Cannot
   read properties of undefined (reading 'progress')` at `onClickBtn`. This
   reproduced on more than one lesson (1.1 and 1.3), so it isn't one broken
   slide — the whole module's Storyline player is failing to resolve slide
   state when entered via a direct deep renderer URL instead of the normal
   in-app click path.
4. Investigated a fallback: the module has an official transcript PDF
   reachable via the in-app "COURSE TRANSCRIPT" button (URL pattern
   `https://skillbuilder.aws/cds/<package-id>/story_content/external_files/Module-9_Transcript.pdf`).
   Opening it in a new tab returns a raw S3 `<Error><Code>AccessDenied</Code>`
   response — the link needs signed-cookie/query auth that isn't carried
   over to a manually opened tab. Other concurrent agents on this same
   course hit an **identical AccessDenied** on their own modules' transcript
   PDFs (Module 1, 2, 3 transcript tabs all showed the same error during
   this run), so this is a systemic issue for the whole course, not
   module-9-specific.

## Attempts made

5 clean fresh-tab attempts with the correct product_id/registration_id/
module_id were made (plus 2 earlier attempts using an incorrect product_id
copied from a different course's tabs, before the mistake was caught). Per
the skill's cap, stopping here rather than continuing to grind.

## Suggestion for a retry

- Retry later when fewer/no concurrent agents are hitting this same course
  (registration `dcab5ee7-...`) — the tab-closing/redirect contention alone
  may resolve.
- Even under low contention, the Storyline black-content-pane bug and the
  transcript-PDF AccessDenied both need to be re-tested standalone (solo,
  no concurrency) to determine if they're load-induced or a persistent
  site-side issue with this particular module package
  (`6187f726-aced-4870-af4e-13ef00805eb1`).
- If the black-pane bug persists solo, the `/lrs/activities/state` or
  direct `/cds/<package-id>/` asset endpoints (mentioned as an unconfirmed
  lead in the skill) may be worth trying to fetch the raw Storyline slide
  data/text directly, bypassing the broken player UI.

All Chrome tabs opened during this run have been closed.
