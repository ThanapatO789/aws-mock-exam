# Module 1 - AWS Well-Architected Framework Overview — Capture Report

## Status: BLOCKED

No lesson `.md` files were written. The Chrome extension/browser disconnected
entirely partway through this run ("Browser extension is not connected...")
and did not recover after ~45s of waiting, most likely because 9 concurrent
agents each opening many tabs against this shared browser session
overwhelmed Chrome (tab counts observed climbing past 10-15 simultaneously,
with tabs opening/closing every few seconds from other agents' activity).

## Key IDs for this course (share with other 8 module agents — this took a
lot of trial and error to pin down, please reuse rather than rediscovering):

- **product_id**: `RCY5NFM8R9:003.000.000`
- **registration_id**: `dcab5ee7-64a3-55f6-8170-d1f38d990ed1`
- Module 1 **module_id**: `5SMVUZPRX5:001.001.003`

**IMPORTANT WARNING**: tabs already open in the shared browser group when I
started showed a *different*, WRONG product_id (`N7Q3SXQCDY:001.005.004`,
paired with registration_id `2a587fad-5ce1-5539-999a-7c736d0f0f2b`) — that
combination gives `AccessDenied` on every module renderer URL for this
course. That product_id/registration belongs to a different course another
agent had open. The correct pair is the `RCY5NFM8R9:003.000.000` /
`dcab5ee7-64a3-55f6-8170-d1f38d990ed1` one above, confirmed working (loaded
the actual module viewer with the full lesson sidebar). If you see
`AccessDenied`, double check you're not reusing a stray tab's product_id
from a different course.

Full module_id map extracted from the Apollo cache on the outline page
(`https://skillbuilder.aws/learn/U89MJTNSM8/aws-well-architected-foundations/RCY5NFM8R9`):

| Module | module_id |
|---|---|
| Module 1 - AWS Well-Architected Framework Overview | `5SMVUZPRX5:001.001.003` |
| Module 2 - How to Run a Well-Architected Framework Review | `XY3A1YQY8V:001.001.003` |
| Module 3 - Deep Dive on the AWS Well-Architected Tool | `HGFX4J46UN:001.001.003` |
| Module 4 - Deep Dive on the Operational Excellence Pillar | `2B77KASG72:001.001.003` |
| Module 5 - Deep Dive on the Security Pillar | `64KFR9QKU7:001.001.003` |
| Module 6 - Deep Dive on the Reliability Pillar | `AQZ844D4ZR:001.001.003` |
| Module 7 - Deep Dive on the Performance Efficiency Pillar | `9PB8EX6Q6M:001.001.003` |
| Module 8 (id seen, name truncated in extraction) | `HMQX2PG25K:001.001.003` |
| Module 9 (id seen, name truncated in extraction) | `127VPJ1K6M:001.001.003` |

(There should be 9 modules per the outline; only the first 7 names were
captured before truncation — modules 8/9 ids are listed but need name
confirmation, likely Sustainability and a wrap-up/summary module.)

## Confirmed lesson list (module 1 sidebar, left-to-right as shown)

1.1 Welcome!
1.2 Learning objectives
1.3 What is the Well-Architected Framework?
1.4 Are you Well-Architected?
1.5 What is the Well-Architected Framework? (a second, distinct slide with the same title)
1.6 Why use the Well-Architected Framework?
1.7 A brief history of the Well-Architected Framework
1.8 Components of the Well-Architected Framework
1.9 Components of the Well-Architected Framework (second slide, same title)
1.10 Well-Architected Framework content
1.11 Pillars of AWS Well-Architected
1.12 Well-Architected lenses
1.13 General design principles
1.14 Design principles
1.15 Questions and best practices
1.16 Question 1
(list continues below the fold — at least "Question 2", and likely Summary/Thank you per the task brief; not confirmed on screen before the extension dropped)

## Technical finding: this course's renderer template differs from prior courses

This course ("AWS Well-Architected Foundations") is **not** the same
Rise-style renderer as "Architecting on AWS" / "AWS Technical Essentials".
It is an **Articulate Storyline** package rendered via `<canvas>` inside
`#renderer_iframe`. Consequences for future agents on this course:

- `document.getElementById('renderer_iframe').contentDocument.body.innerText`
  DOES return text (no cross-origin block), but it only returns the
  **course-menu sidebar** text (lesson titles) plus UI chrome — the actual
  slide content is drawn to a `<canvas>` and is NOT present as plain DOM
  text or SVG text nodes. `get_page_text` similarly returns nothing useful
  for the slide body.
- The canvas itself is rendered off-screen (`getBoundingClientRect().x ===
  -9999`) — it's a legacy/fallback canvas, not what's visually shown.
- There ARE Storyline accessibility shadow-text elements
  (`.acc-shadow-el.acc-text`) that mirror on-screen text for screen
  readers, but on a freshly-loaded slide they are **empty** — Storyline only
  populates them as the slide's entrance-timeline animations fire. On a
  fresh slide load (frame 0, paused), nothing has appeared yet, so both the
  visual screenshot AND `.acc-text` are blank.
- Getting real content therefore requires **advancing the slide's own
  timeline** (not just navigating to the lesson) — e.g. clicking the small
  transport play button (bottom-left of the control bar, NOT the big
  center circle which is a separate module-intro splash) and waiting a few
  seconds for bullets/animations to finish appearing, then screenshotting
  (and/or re-reading `.acc-text`). I was not able to fully validate this
  before the extension disconnected — one attempt with mute+play appeared
  to reset the slide back to the module-intro splash screen instead of
  advancing lesson 1.2's own timeline, so the click coordinates/sequence
  need more care (possibly: click the lesson in the sidebar, wait for the
  slide to fully mount, THEN click play — I may have raced this).
- A "COURSE TRANSCRIPT" link (top-right of the toolbar) opens a per-module
  PDF transcript (e.g.
  `.../story_content/external_files/AWS_WA_Module1_FrameworkOverview_Transcript.pdf`)
  in a new tab. This looked like a promising shortcut (one PDF = full
  narration text for the whole module) but every attempt to read it via
  `get_page_text` returned `AccessDenied` (looks like CloudFront
  referer/cookie hotlink protection rejecting direct/programmatic
  navigation even though the tab was opened via a real click). Not solved;
  could be worth another agent trying to screenshot the PDF viewer instead
  of extracting its text, or clicking through the PDF.js UI if it renders.

## Recommendation for retry

- The course-level access is confirmed working (correct product_id /
  registration_id above) — this is NOT the redirect-loop bug the skill
  describes for completed courses, and this course is genuinely "Not
  started" as expected.
- The blocker was (a) figuring out the canvas/timeline rendering model
  (now documented above, should save the next attempt significant time),
  and (b) the shared browser session becoming unstable/disconnecting under
  9-way concurrent tab load.
- Suggest a retry either after other agents' tab load has settled down, or
  with more conservative tab usage (single dedicated tab, close it
  immediately after each lesson before opening the next, avoid leaving
  many tabs open in the shared group at once).
