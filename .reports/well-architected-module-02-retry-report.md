# Module 2 - How to Run a Well-Architected Framework Review — capture report

## Result
DONE — all 21 lesson slides captured and written.

## Module/content type notes
- This module renders via **Articulate Storyline on a `<canvas>`** inside `#preso` (confirmed: 1 canvas element, 720x540, no video tags). The `iframe.contentDocument.body.innerText` trick returns only the course-menu sidebar chrome text, never actual slide content — for this module it is NOT useful as a primary source, contrary to the "confirmed technique" note in the skill for other modules. All 21 lessons were read **visually via screenshot**, which was the only reliable method here.
- The per-module "COURSE TRANSCRIPT" link does resolve to a real `.../story_content/external_files/Module2_Transcript_PDF.pdf` URL when clicked from inside the module UI, but a direct/automation navigation to that same URL returns S3 `AccessDenied` (likely a Referer check tied to same-origin clicks). Not usable as a scripted primary source.
- The module gates each fresh load behind a black "Resume"/title screen with an "Autoplay slides" toggle; turning autoplay off and using NEXT/sidebar clicks gives clean manual control.

## Session-wide contention (confirmed, matches skill warning)
With 3 concurrent module agents sharing one `registration_id`, repeated attempts to load Module 2's URL got redirected within 1-2 seconds to Module 3's URL (the other agent's SCORM "resume bookmark" kept overwriting mine). This happened 5-6 times in a row, including one tab that closed itself / one CDP screenshot timeout (renderer briefly unresponsive) — consistent with the skill's documented instability under concurrent load. Recovered by: opening a fresh tab, navigating to the Module 2 URL, and immediately (within ~1s, before the next bookmark-write from the other agent) driving lesson navigation via `javascript_tool` DOM clicks on sidebar `<li>` text instead of relying on screenshot-then-click round trips, which are too slow to win the race.

## Lessons captured (21/21)
1. AWS Well-Architected — module title slide.
2. Learning objectives — 3 bullets (complete a review, understand design-decision impact, evaluate/mitigate risk).
3. What Is the Well-Architected Framework Review? — section divider, title only.
4. A mechanism — "mechanism for continuous improvement" Learn→Measure→Improve cycle around Workloads.
5. Intent of a review — Not an audit / Not theoretical / Not a one-time check, each with a sub-label.
6. Learnings — Pre-launch only? / Make bad decisions? / Findings? with sub-labels.
7. Use cases — Learning best practices for the cloud / Technology governance / Portfolio management.
8. Three review phases — Prepare / Review / Improve, each with 2 sub-bullets.
9. Prepare — section divider ("Three Phases of Review: Prepare").
10. Best practices for preparing reviews — Define workload / Identify core team / Hold scoping session.
11. Best practices for preparing reviews (cont.) — Determine review type / Gather data / Schedule session.
12. Review preparation steps — detailed timeline, ~3 weeks before through 1 day before.
13. Review — section divider ("Three Phases of Review: Review").
14. Best practices for running reviews — One person moderates / Use tool to record results / Focus on highest priority.
15. Improve — section divider ("Three Phases of Review: Improve").
16. Risk prioritization methodology and considerations — HRI (high-risk, red) / MRI (medium-risk, orange).
17. Well-Architected improvement workflow — 5-stage circular workflow diagram.
18. Question 1 — "What are the three phases...?" Correct answer confirmed via Show answers: **B, Prepare, review, and improve**.
19. Question 2 — "A review of a larger workload can be broken into multiple reviews" (True/False). Correct answer confirmed via Show answers: **A, True**.
20. Summary — restates the 3 learning objectives as accomplished.
21. Thank you — closing slide, Training and Certification contact info.

No accordions were present in this module (all content was direct on-slide text/diagrams, no expandable `+`/`−` rows). Hotspot-style icon graphics (risk flags, workflow icons) were not clicked repeatedly per the skill's guidance since their labels were already self-explanatory in the surrounding layout.

## Files written
- `source/courses/aws-well-architected-foundations/02-how-to-run-a-well-architected-framework-review/01-aws-well-architected.md` through `21-thank-you.md` (21 files)
- `source/courses/aws-well-architected-foundations/02-how-to-run-a-well-architected-framework-review/manifest.json` — reused the pre-existing manifest as-is (titles verified correct against the actual sidebar); no changes needed.

## Concerns
- None regarding content completeness — all 21 lessons have verified, on-screen content (no fabrication from memory).
- Minor: slide 12's timeline layout (two staggered rows connected by a vertical line) was described in prose rather than reproduced as an exact visual table, since the connecting-line pairing between icon boxes and content boxes was somewhat ambiguous in the screenshot; the underlying facts (which items go with which time marker) are captured faithfully based on left-to-right/top-to-bottom reading order.
- Browser tabs opened during this run were all closed before finishing.
