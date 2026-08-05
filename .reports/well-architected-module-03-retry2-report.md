# Module 3 - Deep Dive on the AWS Well-Architected Tool — capture report (retry 2, solo)

## Outcome
DONE_WITH_CONCERNS. All 21 sidebar items (1.1 Welcome! through 1.21 Thank you) were
identified and their content captured, but NOT via the normal visual renderer —
the module hit a reproducible rendering bug (see below) that made every fresh-tab
attempt (5 clean attempts) freeze on slide 1's content pane regardless of navigation
method used. Content was instead recovered from the underlying Storyline HTML5
package's raw data files (same-origin fetches, using the session's own authenticated
cookies — no credentials handled, no bypass of any auth).

## The rendering bug
- Confirmed via `document.getElementById('renderer_iframe').contentDocument`
  inspection: after landing on slide 1.1 ("Welcome!"), the slide's root `<div class="slide ...">`
  was stuck with `opacity:0` and classes `transparent transitioning` that Storyline
  normally clears once the entrance transition completes. It never cleared on its
  own even after 8+ second waits.
- Removing those CSS classes via JS revealed slide 1.1's real content (AWS-branded
  background, no bullet text — matches the narration for that slide).
- However, all subsequent navigation attempts — sidebar item clicks, the NEXT
  button (both via real `computer` clicks with carefully recomputed screen
  coordinates, and JS-dispatched pointer events), and keyboard Right-arrow — left
  the content pane frozen on slide 1's DOM content while only the sidebar
  "visited"/checkmark state advanced. Confirmed via an accessibility-only
  `"slide: Welcome!"` label in the DOM that never changed even after clicking
  through to "1.2 Learning objectives" and pressing NEXT.
- No fatal JS console errors were present, only benign warnings
  (`could not find acc_settings/slide in string table ...`).
- Reproduced across a full fresh-tab reload (not just repeated interaction in one
  tab), so this is not simply a stale-state/multi-agent-contention issue — this
  looks like a genuine site-side rendering bug for this specific module.

## Recovery method used
The module is an Articulate Storyline HTML5 package served from
`https://skillbuilder.aws/cds/<package-id>/html5/`. Using the browser's own
authenticated session (`fetch(..., {credentials:'include'})`, no scraping of
credentials, no third-party endpoint):
- `html5/data/js/data.js` — the package's structural JSON. Regex-extracted the
  ordered list of 21 slide titles and, for each slide, its per-slide JS file name
  (`html5/data/js/<slideId>.js`).
- Each per-slide JS file contains the slide's actual on-screen text objects
  (`"text":"..."` fields, HTML-escaped). Extracted and HTML-stripped these to
  recover bullet/label text exactly as authored (this is the same text a learner
  would see on screen — not inferred).
- `story_content/<captionId>_captions.js` — per-slide WebVTT narration captions
  (17 of the 21 slides have narration; the 4 Question slides and the
  Welcome/Thank-you title cards do not). Fetched, URL-decoded, and stripped
  timestamps to get full narration transcripts. Per the skill notes, narration
  covers "the same core content" as on-screen text, and was used to substantially
  enrich lessons where on-screen text alone was sparse (icon labels only).
- Confirmed the caption/slide-id → title mapping by content-matching narration
  text against known slide titles (e.g. "Welcome to module three of AWS
  Well-Architected..." → Welcome!; "Thank you for taking the time..." → Thank you).

This was NOT the "COURSE TRANSCRIPT PDF" approach (confirmed separately broken /
AccessDenied per the task brief) — it is a different, working data source (the
Storyline package's own JS/JSON slide data + WebVTT captions), fetched same-origin
with the existing session.

## Knowledge Check (Questions 1-4) — limitation
Because the renderer never actually advanced past slide 1 in any live session,
**it was not possible to click "Show answers" and confirm the correct choice for
Question 1-4 live**, as the skill requires for an authoritative answer key. The
question text and all answer choices were recovered verbatim from the slide's raw
JS data (same reliable source as the rest of the content), but
`10-knowledge-check.md` intentionally leaves the correct answer unmarked, with an
explicit note explaining why, rather than guessing from general AWS knowledge.

## Files written
`source/courses/aws-well-architected-foundations/03-deep-dive-on-the-aws-well-architected-tool/`
- `01-welcome-and-objectives.md` — 1.1 Welcome!, 1.2 Learning objectives
- `02-continuous-improvement.md` — 1.3 A mechanism for continuous improvement
- `03-components-of-the-framework.md` — 1.4 Components of the Well-Architected Framework
- `04-tool-overview.md` — 1.5 AWS Well-Architected Tool, 1.6 ...Tool overview
- `05-new-workload.md` — 1.7, 1.8 new workload (+ cont.)
- `06-workload-details.md` — 1.9, 1.10 workload details (+ cont.)
- `07-milestones-and-sharing.md` — 1.11 milestones, 1.12 sharing
- `08-tool-content-and-custom-lenses.md` — 1.13 content, 1.14 custom lenses
- `09-whats-new.md` — 1.15 What's new with AWS WA?
- `10-knowledge-check.md` — 1.16-1.19 Questions 1-4 (answers NOT confirmed — see above)
- `11-summary.md` — 1.20 Summary, 1.21 Thank you
- `manifest.json`

## Concerns for the controller
1. Knowledge Check answers are unconfirmed — if authoritative answers are needed,
   this module's Question slides should be retried live once the rendering bug is
   fixed/gone, or answered from a trusted external source and the file updated.
2. Content for slides 1.4, 1.7-1.14 leans more heavily on on-screen labels +
   narration transcript than a literal screenshot read would have produced, since
   visual screenshots were not usable for this module. Narration is AWS's own
   voiceover script for the same slide, so it should be faithful, but it wasn't
   cross-checked against a rendered screenshot the way the skill normally requires.
3. Chrome tab opened during this session was closed at the end; no lingering tabs.
