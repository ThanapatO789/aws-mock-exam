# Module 9 - Deep Dive on the Sustainability Pillar — capture report

## Method
Used the raw-data-file method directly against the Storyline package, per the skill's
recommended default. Renderer URL loaded correctly on the first attempt (landed on the
correct "Module 9 - Deep Dive on the Sustainability Pillar" title slide, no resume-bookmark
redirect this time). Sidebar confirmed 26 real lesson slides (1.1-1.26), matching the
prior attempt's count.

- product_id: `RCY5NFM8R9:003.000.000`
- registration_id: `dcab5ee7-64a3-55f6-8170-d1f38d990ed1`
- module_id: `127VPJ1K6M:001.001.003`
- package-id (discovered via network requests): `6187f726-aced-4870-af4e-13ef00805eb1`
- data.js: `https://skillbuilder.aws/cds/6187f726-aced-4870-af4e-13ef00805eb1/html5/data/js/data.js`
- Per-slide: `https://skillbuilder.aws/cds/6187f726-aced-4870-af4e-13ef00805eb1/html5/data/js/<slideId>.js`

Parsing note: the JSON payload is wrapped as `window.globalProvideData('data'|'slide', '<json>')`
where the JSON was escaped as a single-quoted JS string literal. Correct unescape order:
replace `\\` (double backslash) with `\`, then replace `\'` with `'`, THEN `JSON.parse`. An
earlier naive `\\'` -> `'` replace alone broke on slides whose title HTML contained
`style=\"...\"` (double-escaped quotes) — fixed by doing the full two-step unescape first.

Renderer visual navigation froze/timed out (CDP `Page.captureScreenshot` timeout) twice when
attempting to click into sidebar lessons or Play — consistent with the skill's documented
zoom/freeze glitch. Recovered each time via fresh tab; ultimately relied entirely on the raw
JSON fetch method (which does not require the renderer to stay responsive once the
package-id is known), so no content was lost.

## Knowledge Check — embedded answer key search
Searched all 3 Question slides' JSON for common answer-key indicators (`correct`, `Correct`,
`Incorrect`, `isCorrect`, `score`, `points`, `weight`, alt-text hints, layer/object `name`
fields) — none found. This module's Storyline package does not embed a discoverable answer
key in the static slide JSON (grading logic likely lives in compiled JS not present in the
per-slide data files). Live "Show Answers" click-through was attempted but blocked by the
renderer freeze described above (capped at 2 clean attempts before falling back, per the
skill's retry-budget guidance). Fell back to labelled inference from same-module content,
matching the format used in `06-deep-dive-on-the-reliability-pillar/09-knowledge-check.md`.

- Q1 (drivers for sustainability, select 3): inferred A/D/E (Customer demand, Government
  regulations, Cost savings) — **lower confidence**, no direct in-module bullet list backs
  this one (general AWS-course-knowledge inference, clearly flagged as such in the file).
- Q2 (sustainability design principle): inferred D (Understand your impact) — **high
  confidence**, verbatim match to the design-principles list in lesson 1.7.
- Q3 (hardware pattern best practices, select 3): inferred B/C/D (Use managed services /
  Use instance types with the least impact / Use the minimum amount of hardware to meet your
  needs) — **high confidence**, near-verbatim match to the Hardware and services bullets in
  lesson 1.19; A/E/F cross-checked against and ruled out via Data patterns (1.17) and
  Software and architecture patterns (1.15) bullets.

## Per-lesson summary
1. `01-welcome-and-objectives.md` — title slide + 2 learning objectives.
2. `02-pillar-overview.md` — overview divider, 6-pillar icon graphic (labels only, no
   popup text), "What is the Sustainability pillar?" full paragraph.
3. `03-design-principles.md` — divider + all 6 design principles (verbatim).
4. `04-best-practices-overview.md` — divider + list of the 6 best-practice areas.
5. `05-region-selection.md` — divider + single core statement.
6. `06-alignment-to-demand.md` — divider + 5 bullets.
7. `07-software-and-architecture-patterns.md` — divider + 5 bullets.
8. `08-data-patterns.md` — divider + 8 bullets.
9. `09-hardware-and-services.md` — divider + 4 bullets.
10. `10-process-and-culture.md` — divider + 4 bullets.
11. `11-knowledge-check.md` — 3 questions, all choices, answers inferred and clearly labelled
    (not confirmed via live "Show Answers").
12. `12-summary.md` — Summary bullets + Thank-you closing slide text.

## Concerns
- Knowledge Check answers are inferred, not confirmed via a live "Show Answers" click,
  because the renderer repeatedly froze when attempting in-app navigation to the quiz
  slides. Q1 in particular has weaker evidentiary support than Q2/Q3 — flagged inline in
  the file itself.
- A handful of graphic-only sub-elements (e.g., decorative icons/lines with empty alt text
  `[ALT]""`) were skipped as pure decoration, consistent with the skill's guidance on
  hotspot graphics not carrying extra text.
- No git commit made, per instructions.

## Tabs
All Chrome tabs opened during this run were closed before finishing (confirmed no MCP tab
group remains open).
