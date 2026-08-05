# AWS Technical Essentials — Module 1 capture report

## Course/registration IDs (reusable by other module agents)

Shared for the whole course (both parts):
- `product_id`: `N7Q3SXQCDY:001.005.004`
- `registration_id`: `2a587fad-5ce1-5539-999a-7c736d0f0f2b`

Per-part `module_id` (this is the CatalogItem versionedId for the whole SCORM package of that part — NOT a per-lesson id; the renderer navigates between a part's modules/lessons internally via its own sidebar):
- **Part 1** ("AWS Technical Essentials Part 1", covers Modules 1-3, marked Completed): `module_id=W9A4VFJXSF:001.000.001`
- **Part 2** ("AWS Technical Essentials Part 2", covers Modules 4-6, marked In Progress): `module_id=K3WV65M927:001.001.001`

Renderer URL pattern used successfully (no `referrer` param, per skill's fix):
```
https://skillbuilder.aws/renderer/?module_id=<PART_MODULE_ID>&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital
```
e.g. for Part 1:
```
https://skillbuilder.aws/renderer/?module_id=W9A4VFJXSF%3A001.000.001&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital
```

This loaded cleanly on the first fresh-tab attempt, no redirect loop encountered (despite Part 1 being "Completed" — the skill's redirect-loop warning did not manifest here). It resumed to whatever lesson was last visited in that part's SCORM bookmark; navigate to the same renderer URL again to resume in-place, then use the left sidebar to jump to any lesson within that part.

## New finding not in the skill: DOM contamination on lesson navigation

Reading `document.getElementById('renderer_iframe').contentDocument.getElementById('content-frame').contentDocument.body.innerText` sometimes returns text belonging to a **previously visited lesson**, appended after the current lesson's real content, with no separator. This happened on "Demonstration: Implementing Security with IAM" — body text at first looked like it started with the demo's own content, then several thousand characters of the *previous* "AWS Identity and Access Management" lesson content appeared after it, even though the demo lesson visually only had a video + one transcript accordion.

**Root cause (probable):** the Rise SPA doesn't fully unmount/clear the previous lesson's panel from the DOM before mounting the next one; leftover nodes remain in document flow (not `display:none`) and get concatenated into `body.innerText`.

**Fix used:** don't trust a full-body innerText dump wholesale on lessons that are short/video-only. Verify with a screenshot first. When a lesson has a `Transcript` (or other) accordion, target the panel directly instead of scraping the whole body:
```js
const el = [...doc.querySelectorAll('*')].find(e => e.children.length===0 && e.textContent.trim()==='Transcript');
let anc = el; while(anc && anc.tagName!=='BUTTON') anc = anc.parentElement;
const panel = doc.getElementById(anc.getAttribute('aria-controls'));
panel.innerText // clean, scoped to just that accordion's content
```
This was much more reliable and is worth using as the default technique for transcript/accordion content generally (not just as a contamination workaround).

## Accordion expansion technique confirmed

Plain `element.click()` via `javascript_tool` does **not** trigger Rise's accordion toggle (`aria-expanded` stays `false`) — confirmed on this course too, matching prior findings. Real mouse clicks via the `computer` tool's `left_click` do work reliably. Used real clicks throughout for all "Six advantages" (What Is AWS?), the 4 Region-selection tabs (AWS Global Infrastructure), AWS/Customer responsibility table (Security and Shared Responsibility), "IAM features" (6 items) and "IAM best practices" (6 items) accordions.

## Zoom/scroll glitch

Hit the known zoom-glitch once (screenshot rendered at a different, zoomed-in resolution after a large `scroll` action, and mouse clicks stopped registering visually). Fixed exactly as the skill describes: closed the tab, opened a fresh one, re-navigated to the trimmed renderer URL (no referrer), and used smaller scroll increments / `scrollIntoView` via JS instead of large wheel-scrolls thereafter. No further recurrence.

## Concurrent-agent contamination observed

Despite being told "you are the first agent, nobody else is running concurrently," several new tabs (`K3WV65M927` — Part 2 — renderer URLs, some with `referrer=` params) kept appearing in the shared MCP tab group throughout this run, not opened by this agent. This confirms other module agents (dispatched for Modules 2-6) were in fact running in parallel in the same Chrome session/tab group. This did not block Module 1's extraction (Part 1 and Part 2 are separate SCORM packages/tabs), but the shared registration_id / underlying account progress means the "% complete" banner is a shared, moving value — ignore it as a completion signal for your own module. Only tabs this agent explicitly created (`tabs_create_mcp`) were closed by this agent; other agents' tabs were left alone.

## Per-lesson capture summary

| # | Lesson | Notes |
|---|---|---|
| 1 | What Is AWS? | Full text + all 6 "Six advantages of cloud computing" accordions expanded and captured. |
| 2 | AWS Global Infrastructure | Full text + all 4 Region-selection tabs (Latency/Pricing/Service Availability/Data Compliance) clicked and captured. |
| 3 | Interacting with AWS | Full text, no accordions to expand (video transcript was inline). |
| 4 | Security and the AWS Shared Responsibility Model | Full text + "AWS responsibility" accordion (with the Infrastructure/Abstracted services table) expanded; "Customer responsibility" accordion was already open by default. |
| 5 | Protecting the AWS Root User | Full text including MFA device table (Virtual/Hardware TOTP/FIDO), no accordions needed beyond inline content. |
| 6 | AWS Identity and Access Management | Longest lesson. Full text + IAM roles video transcript (separate accordion, had to be expanded) + all 6 "IAM features" accordions + all 6 "IAM best practices" accordions expanded and captured. |
| 7 | Demonstration: Implementing Security with IAM | Video-only lesson; transcript accordion expanded and captured via the aria-controls panel technique (see contamination note above). |
| 8 | Hosting the Employee Directory Application on AWS | Video-only lesson; transcript accordion expanded and captured cleanly (short lesson, no contamination this time). |
| 9 | Module 1 Knowledge Check | 3 questions, all answered live and submitted for authoritative correct-answer confirmation (not inferred from memory). All 3 answers confirmed "Correct" on submit. |

## Concerns

- None blocking. The DOM-contamination issue above is worth flagging to future module agents as a technique refinement, not a data-quality problem here — all content in the written .md files was verified against the scoped/clean extraction, not the contaminated raw body dump.
- Module 1's "AWS Identity and Access Management" and its Demonstration lesson share a lot of conceptual overlap by design (the Demonstration recaps/extends the lesson) — this is intentional course structure, not a scraping artifact.

## Files written

- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/01-what-is-aws.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/02-aws-global-infrastructure.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/03-interacting-with-aws.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/04-security-and-the-aws-shared-responsibility-model.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/05-protecting-the-aws-root-user.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/06-aws-identity-and-access-management.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/07-demonstration-implementing-security-with-iam.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/08-hosting-the-employee-directory-application-on-aws.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/09-module-1-knowledge-check.md`
- `source/courses/aws-technical-essentials/01-introduction-to-amazon-web-services/manifest.json`

No git commit made (per skill instructions — controller handles commits after review).
