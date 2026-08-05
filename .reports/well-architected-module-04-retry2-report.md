# Module 4 - Deep Dive on the Operational Excellence Pillar — Capture Report (retry 2)

## Outcome
DONE via raw-data-file fallback. The visual Storyline renderer reproducibly froze
(screenshot timed out with "renderer may be frozen or unresponsive") across 2 clean
fresh-tab attempts, both after clicking the intro Play button — matches the skill's
documented stuck-renderer bug. Switched to the confirmed fallback: fetched the
Storyline package's own data files directly via same-origin `fetch(..., {credentials:'include'})`.

## Method
- package-id discovered from network requests: `585b102b-820c-4dfd-b574-61fced01d596`
- Fetched `html5/data/js/data.js`, unescaped the JS-single-quoted JSON string
  (custom char-by-char unescaper — `\'` → `'`, `\\` → `\`; naive global regex replace
  corrupted embedded `\"` sequences on the first attempt, so this needed a real scan),
  then `JSON.parse`.
- Scene `6VfnfibWvrB` (28 slides) matched the module's known 28-item slide list from
  the sidebar `innerText` menu.
- For each of the 28 slide IDs, fetched `html5/data/js/<slideId>.js` (same unescape +
  parse) and extracted all on-screen `"text":"..."` fields.
- For slides with audio, found `audiolib` asset IDs in the slide JSON and fetched
  `story_content/<audioId>_captions.js` for the WebVTT narration — decoded and stripped
  timestamps. This filled in full paragraph-level detail for slides whose on-screen text
  was sparse (bullet labels only), which is most slides in this module (icon/bullet-label
  slides with rich narration).
- Cross-checked slide count (28) and titles against the earlier confirmed sidebar list —
  exact match, no gaps.

## Content covered (all 28 slides / all 10 lesson files)
1. `01-welcome-and-objectives.md` — Welcome!, Learning objectives (1.1-1.2)
2. `02-pillar-overview.md` — Pillar Overview, 6 Pillars of Well-Architected, what OE is (1.3-1.5)
3. `03-design-principles.md` — 5 operational excellence design principles, full narration (1.6-1.7)
4. `04-best-practices-overview.md` — 4 focus areas (Organization/Prepare/Operate/Evolve) (1.8-1.9)
5. `05-organization.md` — Organization priorities (7 best practices), Operating models diagram, Organizational culture (7 best practices) (1.10-1.13)
6. `06-prepare.md` — Design telemetry (5 practices), Design for operations (10 practices), Mitigate deployment risks (8 practices), Operational readiness & change management (ORR, runbooks, playbooks) (1.14-1.18)
7. `07-operate.md` — Understanding workload health, Understanding operational health, Responding to events (event/incident/problem management) (1.19-1.22)
8. `08-evolve.md` — Learn/share/improve (8 best practices) (1.23-1.24)
9. `09-knowledge-check.md` — Question 1 (select 3) and Question 2, full text + choices captured verbatim; **correct answers NOT marked** — could not click "Show answers" via the fallback method. Left an explanatory note per skill guidance, with an unconfirmed content-correlation hint (not presented as authoritative).
10. `10-summary.md` — Summary, Thank you (1.27-1.28)

No accordions/hotspot layer content was missed — checked `slideLayers` array length per
slide; all 28 slides had exactly one base layer (no hidden click-to-reveal layers in this
module), so the on-screen text + caption narration is complete.

## Files written
- `source/courses/aws-well-architected-foundations/04-deep-dive-on-the-operational-excellence-pillar/01-welcome-and-objectives.md`
- `.../02-pillar-overview.md`
- `.../03-design-principles.md`
- `.../04-best-practices-overview.md`
- `.../05-organization.md`
- `.../06-prepare.md`
- `.../07-operate.md`
- `.../08-evolve.md`
- `.../09-knowledge-check.md`
- `.../10-summary.md`
- `.../manifest.json`

## Concerns
- Knowledge Check correct answers are unconfirmed (renderer never became interactive
  enough to submit the quiz). Flagged clearly in `09-knowledge-check.md` for a live
  retry later if an authoritative answer key is needed.
- Tab was closed at the end; no lingering Chrome tabs from this run.
