# AWS Technical Essentials — Module 6 Knowledge Check capture report (completion pass)

Course: AWS Technical Essentials, Part 2 (registration_id `2a587fad-5ce1-5539-999a-7c736d0f0f2b`, product_id `N7Q3SXQCDY:001.005.004`, module_id `K3WV65M927:001.001.001`).

Ran solo, no concurrent sibling agents this time — no contention issues encountered.

## Approach

1. Navigated to the course outline (`https://skillbuilder.aws/learn/K8C2FNZM6X/aws-technical-essentials/N7Q3SXQCDY`), read `window.__APOLLO_CLIENT__.cache.extract()` to reconfirm Part 2's module_id (`K3WV65M927:001.001.001`) — matches the module_id used in the prior partial-completion run.
2. Navigated directly to the renderer URL (no `referrer` param). Landed on the SCORM "resume bookmark" (Module 4 Knowledge Check) as expected.
3. Instead of scrolling the sidebar visually (risk of the known page-zoom glitch — hit it once and had to close/reopen the tab), used `javascript_tool` to locate the "Module 6 Knowledge Check" sidebar `<a>` element (`href="#/lessons/JQFW0EnYMBeWdtpaFhjj-vuH3nMrIQn8"`) inside the nested content iframe (`window.frames[0].frames[0]`) and called `.click()` on it directly. This landed cleanly on the Module 6 Knowledge Check with no redirect bounce.
4. All 3 questions for this Knowledge Check are on one scrollable page (not a stepper). Confirmed via DOM (`.quiz-card` count = 3) that there are exactly 3 questions — no more beyond what was previously known.
5. Answered and submitted each question live via JS (clicking radio/checkbox inputs then the SUBMIT button), then read the `.quiz-card__feedback-label` text after each submit to get an authoritative "Correct"/"Incorrect" verdict. Also visually confirmed Q3 via screenshot showing a checkmark on the correct choice.

Note: initial `textContent` scrape of the page (before interacting) showed "Incorrect" feedback text for all 3 questions — this turned out to be a decoy: the feedback DOM nodes exist for both outcomes with `opacity:0` regardless of answered state, so `textContent` alone is not a reliable signal here. Confirmed via `getComputedStyle` that these were hidden templates (radios were all `checked:false` — quiz was actually unanswered). Correct answers were only trusted after live submission when `opacity` became `1`.

## Confirmed answers (all 3 questions, live submit)

1. **What are the three components of Amazon EC2 Auto Scaling?** → "Launch template, scaling policies, Amazon EC2 Auto Scaling group" (previously confirmed in an earlier run; re-verified this run).
2. **Which features are included with Elastic Load Balancing (ELB)? (Select TWO.)** → "Integrating with Amazon EC2 Auto Scaling" + "Directing incoming traffic to instances" (newly confirmed).
3. **What are the possible states of an Amazon CloudWatch alarm?** → "OK, ALARM, INSUFFICIENT_DATA" (newly confirmed).

## File updated

`source/courses/aws-technical-essentials/06-monitoring-load-balancing-and-scaling/08-module-6-knowledge-check.md` — replaced the partial (Q1-only) answer key with the complete, confirmed 3-question answer key. No other lesson files in this module were touched.

## Concerns

None. All questions confirmed live, no redirect/contention issues this run. Browser tab opened during this task was closed at the end.
