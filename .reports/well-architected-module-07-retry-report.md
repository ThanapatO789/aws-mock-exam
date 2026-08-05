# Module 7 — Deep Dive on the Performance Efficiency Pillar — capture report

## Method
Skipped the visual renderer per instructions. Navigated once to the module renderer URL
(`module_id=9PB8EX6Q6M:001.001.003`, product `RCY5NFM8R9:003.000.000`, registration
`dcab5ee7-64a3-55f6-8170-d1f38d990ed1`) to establish session + discover package-id
(`337e04ee-c637-4f86-8fd4-eb08e1aaabcb`, found via the inner iframe's
`analytics-frame.html` src). Confirmed the renderer is genuinely stuck for this module too
(a `Page.captureScreenshot` call timed out after 30s / "renderer may be frozen").

Fetched all 26 real content slides' raw JS (`html5/data/js/<slideId>.js`) via same-origin
`fetch(..., {credentials:'include'})`. Note: the very first slide fetch succeeds
immediately on page load, but subsequent slides 403 (`AccessDenied`) until the on-screen
"Play" button is clicked once — after that click, all further slide fetches (already
enumerated from `data.js`'s scene/slide list, not requiring real navigation) succeeded
with 200. Worth recording in the skill for future modules that hit this pattern.

Also discovered narration captions this time: each slide's audio object has a `kind:
"audio"` node with an `id`; captions live at `story_content/<audioId>_captions.js` (keyed
by the **audio asset id**, not the slide id) as URL-encoded WebVTT. All 23 non-quiz slides
had narration; the 3 Knowledge Check question slides had none (expected).

**Answer key found in raw data**: each Knowledge Check slide contains a "correct" feedback
layer whose objects have an `altText` field reading e.g. `"Choice A is correct."` — this is
the same text the real UI shows after clicking "Show Answers," just exposed as
accessibility alt text in the slide JSON. Used this as an authoritative (not inferred)
answer key for all 3 questions, and cross-checked A/B/C/D/E/F choice-letter-to-text mapping
by sorting each choice's text object by its `xPos`/`yPos` in the slide layout.

## Files written
- `source/courses/aws-well-architected-foundations/07-deep-dive-on-the-performance-efficiency-pillar/01-welcome-and-objectives.md`
- `02-pillar-overview.md`
- `03-design-principles.md`
- `04-best-practices-overview.md`
- `05-selection.md`
- `06-compute-and-storage-selection.md`
- `07-database-and-network-selection.md`
- `08-review.md`
- `09-monitoring.md`
- `10-trade-offs.md`
- `11-knowledge-check.md`
- `12-summary.md`
- `manifest.json`

## Per-lesson summary
1. Welcome / Learning objectives — intro + 2 module objectives.
2. Pillar Overview — the 6 WA pillars, definition of performance efficiency pillar.
3. Design Principles — all 5 design principles with full narration detail (democratize
   advanced tech, go global in minutes, serverless, experiment more often, mechanical
   sympathy).
4. Best Practices Overview — the 4 areas (Selection, Review, Monitoring, Trade-offs); icon
   row, no extra popup text on click (consistent with prior modules' finding).
5. Selection — intro + "Performance architecture selection" best practices (7 bullets,
   full narration).
6. Compute and Storage Selection — full narration for both sub-topics (6 + 3 bullets).
7. Database and Network Selection — full narration for both sub-topics (5 + 7 bullets);
   longest lesson (network narration ~3.5k chars, covers TCP/UDP/SRD tradeoffs).
8. Review — intro + "Evolve your workload" best practices (3 bullets).
9. Monitoring — intro + "Monitor resources" best practices (6 bullets).
10. Trade-offs — intro + "Using trade-offs to improve performance" best practices (5
    bullets).
11. Knowledge Check — all 3 questions, all choices correctly ordered by position, **all
    correct answers confirmed** via the alt-text method above (Q1: A,C,D — select three;
    Q2: D; Q3: B).
12. Summary / Thank you.

## Concerns
- No accordions encountered in this module (all sections are flat bullet/narration
  slides).
- The renderer freeze was confirmed via an actual screenshot timeout, not assumed —
  matches the pattern described in the task for 2 of the last 3 modules.
- Two other agents' tabs were visible in the shared MCP tab group throughout (Module 5 and
  Module 6 renderer tabs); did not interact with them, only used tabs I created myself, and
  closed my own tab when done.
- The "click Play once, then all subsequent raw slide fetches succeed" behavior was
  discovered ad hoc and is not yet documented in the skill file — recommend adding it as a
  known step for the raw-data-file fallback (first slide fetch works pre-Play, but a single
  Play-button click is needed before slides 2+ stop 403ing, even though no further clicking
  or real navigation is required afterward).
