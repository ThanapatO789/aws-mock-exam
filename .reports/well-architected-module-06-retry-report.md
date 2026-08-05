# Module 6 - Deep Dive on the Reliability Pillar — capture report

## Method
Used the raw-data-file fallback exclusively — did not attempt the visual Storyline renderer at all beyond one brief load to establish session and discover the package id.

1. Found `module_id` (`AQZ844D4ZR:001.001.003`) via `window.__APOLLO_CLIENT__.cache.extract()` on the course outline page.
2. Navigated once to the renderer URL (no `referrer` param) to establish an authenticated session.
3. Read `document.getElementById('renderer_iframe').contentWindow.location.href` to discover the package id: `fbce0ce6-6c36-47e9-a8f9-6542e3789011`.
4. Fetched `https://skillbuilder.aws/cds/fbce0ce6-6c36-47e9-a8f9-6542e3789011/html5/data/js/data.js` via `fetch(url, {credentials:'include'})` — got the Storyline `scenes`/`slides` structure. Scene index 2 (31 slides) is the main content scene.
5. Fetched each of the 31 slides' `.../html5/data/js/<slideId>.js` individually and extracted all `textLib[].vartext.blocks[].spans[].text` values, walking the full `slideLayers` tree (so hidden/click-to-reveal layers are included too, not just the base layer).
6. For the 3 Knowledge Check slides, additionally captured each text object's `xPos`/`yPos` and sorted by position to correctly reconstruct which choice letter (A/B/C/D/...) pairs with which answer text (the raw walk order does not match visual/answer order).

Did not fetch narration captions (`story_content/*_captions.js`) — per the skill, video narration duplicates the on-screen written content, and the written content pulled from `data/js/*.js` was already complete for every slide (no accordions or hotspot-reveal content beyond what showed by default; the 5 design-principle icons and similar icon rows had no additional popup text, consistent with prior modules' findings).

## Files written
- `source/courses/aws-well-architected-foundations/06-deep-dive-on-the-reliability-pillar/manifest.json`
- `01-welcome-and-objectives.md` — Welcome! / Learning objectives
- `02-pillar-overview.md` — Reliability Pillar Overview / Pillars of AWS Well-Architected / What is the reliability pillar?
- `03-design-principles.md` — Reliability Design Principles (5 principles, title-only in raw data, no elaboration text was present on the slide — noted explicitly rather than invented)
- `04-best-practices-overview.md` — Reliability Best Practices / 4 best-practice areas
- `05-foundations.md` — Manage service quotas and constraints / Plan your network topology
- `06-workload-architecture.md` — Design your workload service architecture / Design interactions to prevent failures / Design interactions to mitigate or withstand failures
- `07-change-management.md` — Monitor workload resources / Design a workload to adapt to changes in demand / Implement change
- `08-failure-management.md` — Back up data / Use fault isolation / Design workload to withstand component failures / Test reliability / Plan for disaster recovery
- `09-knowledge-check.md` — 3 questions, all choice text + correct-letter mapping captured via slide-object x/y sort; correct answers **inferred** from matching lesson content (not confirmed via "Show answers" click — this is stated explicitly in the file per skill guidance)
- `10-summary.md` — Summary / Thank you

## Concerns
- Knowledge Check answers are inferred, not system-confirmed (raw data has no explicit correct-answer flag reachable from the client-side JS; only one generic "correct" string hit in the whole slide file, not tied to a specific choice). Flagged clearly in the file per the skill's guidance not to guess silently.
- A few header/divider slides (e.g. "Foundations", "Workload Architecture", "Change Management", "Failure Management") contain only a title + copyright line — genuinely short section-divider slides, not truncated content.
- Design-principle and best-practice-area bullet slides (1.7, 1.9, and most bullet lists throughout) contain only short title/label text in the raw data with no supporting paragraph — this matches the visual slide design for this module (icon + short label, no popup on click), not a data-extraction gap.
- Saw two other agents' tabs in the shared browser session throughout (Module 5: `64KFR9QKU7`, Module 7: `9PB8EX6Q6M`) — did not interact with either, only used my own tabs.

## Status
DONE_WITH_CONCERNS
