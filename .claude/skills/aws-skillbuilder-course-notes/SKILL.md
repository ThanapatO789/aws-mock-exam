---
name: aws-skillbuilder-course-notes
description: Use when extracting/summarizing an AWS Skill Builder Digital Classroom course module into Thai-language study notes for this repo (source/courses/). Triggers on requests like "สรุปคอร์ส AWS module N", "ทำ course notes ให้ module ...", or any task that reads skillbuilder.aws lesson content into source/courses/<course-slug>/.
---

# AWS Skill Builder → Thai course notes

Turns one module of an AWS Skill Builder Digital Classroom course into
Thai-language markdown notes (English technical terms kept as-is), written to
`source/courses/<course-slug>/<module-slug>/`. Learned from doing Module 1 of
"Digital Classroom - Architecting on AWS" — that took ~24 min / ~180 tool
calls for 5 lessons, mostly from re-discovering the points below by trial and
error. Read this first and skip the rediscovery.

## CRITICAL: an already-100%-complete course can self-redirect-loop, even solo

Discovered running 7 modules concurrently, then confirmed with a single
agent alone: on a course the account has **already completed** (shows
"Congratulations! You completed this training on <date>"), the outline
page's "Review" flow can auto-navigate into a module renderer within 1-3
seconds **independent of any click** — it resumes the account's SCORM
"bookmark" position, not whatever module you asked for. Once inside a
module, almost any interaction (sidebar click, scroll, keypress) triggers
another top-level navigation that kills the JS execution context and
bounces back to the outline, restarting the loop. This reproduced with
**zero concurrent agents**, so it is a platform/account-state bug for
completed courses, not purely a parallel-race artifact — though running
several agents concurrently makes it much worse (each agent's navigation
also perturbs the shared bookmark that other agents are fighting over).

**Rules:**
- Never dispatch two module-reading agents concurrently against the same
  course/registration — confirmed 4 of 7 parallel modules came back fully
  BLOCKED, burning 250-370 tool calls each with zero output, some of it
  from agents fighting over the same drifting bookmark.
- Even solo, budget for this course specifically being hard to navigate.
  Cap retries at ~5 clean fresh-tab attempts per module; if it won't hold,
  report BLOCKED with whatever module_id map / partial content you have
  rather than burning 50+ attempts (one solo run did this and still only
  got 1 of 6 lessons).
- If several consecutive modules are blocking the same way, stop and tell
  the user — this may need a different approach entirely (see "If the
  course is fully stuck" below) rather than more retries.
- **Multi-part courses ("Part 1" / "Part 2" under one product) may share a
  single `registration_id` even if the parts show different progress
  states** (e.g. Part 1 "Completed", Part 2 "In progress") — don't assume
  they're independent contention domains just because they look like
  separate products. Confirmed on "AWS Technical Essentials": once several
  module agents were concurrently active across both parts, one agent's
  clicks landed on and nearly answered a *different* agent's live quiz
  question — not just a redirect, actual cross-agent interference inside
  a lesson. If you don't already know two parts share a registration_id,
  treat them as one contention domain (no concurrent agents) until proven
  otherwise.

## Fast module_id lookup — do this FIRST, skip outline clicking entirely

Outline-page clicking is unreliable in general on an already-100%-complete
registration (not just under parallel load — it's just slower and dodgier
than the alternative below). Instead, get every module's `module_id:version`
+ real title in ~2 tool calls by reading the Apollo Client cache directly:

1. Navigate to the course outline URL and let it settle (~3s).
2. Run via `javascript_tool`:
   ```js
   const cache = window.__APOLLO_CLIENT__.cache.extract();
   const results = [];
   for (const key in cache) {
     if (key.startsWith('CatalogItem:')) {
       const obj = cache[key];
       if (obj.outline) {
         const parsed = JSON.parse(obj.outline);
         const name = Array.isArray(parsed) ? parsed[0]?.name : parsed?.name;
         results.push({id: obj.id, versionedId: obj.versionedId, name});
       }
     }
   }
   JSON.stringify(results, null, 1)
   ```
3. Build the renderer URL directly with the target module's `versionedId` as
   `module_id`:
   ```
   https://skillbuilder.aws/renderer/?module_id=<ID>%3A<VERSION>&product_id=<PRODUCT_ID>%3A<PRODUCT_VERSION>&registration_id=<REGISTRATION_ID>&referrer=<ENCODED_OUTLINE_URL>&navigation=digital
   ```
   `product_id`, `product_version`, and `registration_id` are stable for the
   whole course — grab them once from any working renderer URL (your own or
   a prior report's) and reuse for every module.
4. Navigate straight to that URL in a **fresh tab**. This still occasionally
   gets redirected by the same resume-pointer bug even one-at-a-time — if a
   module won't stay loaded after 2-3 clean fresh-tab attempts, treat it as
   a genuine site-side glitch for that specific module, stop, and report
   BLOCKED with the module_id map you found (don't burn more than ~5
   attempts on one module).

## Hard technical constraints (don't re-verify these — they're settled)

- **`get_page_text` and `read_page` return nothing useful** — but the reason
  isn't necessarily cross-origin (that was an earlier wrong guess; for at
  least one module the iframe was confirmed same-origin). Try this FIRST,
  it's much better than screenshots when it works — full lesson text
  including the video transcript in one call:
  ```js
  document.getElementById('renderer_iframe').contentDocument.body.innerText
  ```
  via `javascript_tool`. If that throws (genuinely cross-origin for that
  module) or returns empty, fall back to reading every lesson **visually
  via `computer` screenshot/zoom actions** — don't burn more than one retry
  on the JS method before falling back.
- **Do not attempt to play/transcribe the instructor videos.** They're
  optional narration of content that's *also* written out below the video on
  the same page. Read the written content instead — it covers the same
  material (confirmed by the user: "AWS สรุปเนื้อหาที่สอนในคลิปไว้ด้านล่าง
  core เดียวกับในคลิป"). A paused video frame is fine to glance at for
  on-screen bullet text, but never click play / open captions / hunt for a
  transcript panel — it's a dead end (cross-origin, and in testing the video
  got stuck loading anyway).
- **A fresh tab to a deep `renderer/?module_id=...` URL usually bounces
  through a sign-in redirect that auto-completes** (the user's Chrome
  profile is already authenticated) — just `wait` ~2-3s and screenshot
  again, don't treat the "Sign in" tab title as a real blocker. If it
  doesn't auto-complete after ~10s, that's a real auth problem — stop and
  report BLOCKED. If the header still shows a "Sign in" button after
  waiting, click it explicitly and wait through the OAuth redirect — this
  was required at least once (Module 2 run) and is not always automatic.
- **Outline-page navigation has a "resume last activity" bug that will
  waste dozens of calls if you don't route around it (learned the hard
  way on Module 2 — cost ~150 tool calls).** Clicking a module in the left
  Outline list, then clicking Review, then clicking a lesson in that
  module's own sidebar, unpredictably bounces back to the outline and
  auto-redirects to whatever module/lesson was last visited in the
  session — landing you on the wrong module entirely, repeatedly. **Fix:**
  once you land on ANY module's renderer URL (however you got there),
  copy the URL and strip the `&referrer=...` query parameter, then
  navigate directly to that trimmed URL:
  `https://skillbuilder.aws/renderer/?module_id=<CODE>:001.000.005&product_id=<PRODUCT_ID>&registration_id=<REG_ID>&navigation=digital`
  (no `referrer=` param). With `referrer` present, clicking lesson items
  in the sidebar bounces back to the outline; without it, in-module
  lesson navigation works normally and stays on the correct module. You
  still need the correct `module_id` for the target module — get it by
  clicking that module in the Outline list once and reading the
  resulting (buggy) redirect URL, or by trial. Don't bother diagnosing
  further; just strip `referrer` and move on.
- **Occasional page zoom/scale glitch** can happen after a scrollbar drag or
  large scroll jump (the whole iframe renders zoomed/shifted). Fix: close
  the tab, open a fresh one, use smaller scroll increments (`scroll_amount`
  3-4, not 10) and prefer clicking sidebar lesson links over scrollbar
  dragging.

## Reading one module

1. Enter the module either via a known deep `renderer_iframe` URL (fastest —
   reuse one from a prior run's report if available, adjusting `module_id`),
   or the normal path: navigate to the course outline URL
   (`https://skillbuilder.aws/learn/<PRODUCT_ID>/<slug>/<REGISTRATION>`),
   click the module's radio/heading in the left outline list, then click the
   orange **Review** button that appears to enter the module viewer.
2. The module viewer has a left sidebar listing that module's lessons
   (e.g. Overview, AWS Services, ..., Knowledge Check). Click each lesson in
   turn — don't rely on "next lesson" auto-advance.
3. Per lesson, scroll down the content pane in small increments and
   screenshot as you go, until you reach the bottom. Lessons vary a lot in
   length — a lesson with only an intro paragraph and a bullet list is
   genuinely that short; don't pad it.
4. **Accordions vs. hotspot graphics — treat them differently:**
   - **Accordion rows with a `+`/`−` toggle and a text row label** (e.g.
     "Plan / Research / Build" under "AWS Architect responsibilities") DO
     hide real bullet content. Click every one open and capture the text —
     these are never decorative.
   - **Numbered hotspot icons on an illustration** (service-category icons,
     "benefits of AWS" icon row, pillar icons, etc.) in practice do **not**
     reveal extra popup text beyond a numbered badge, even on repeated
     clicks — across every lesson tested, their labels were already
     self-explanatory or duplicated in the surrounding prose. Click one
     **once** to confirm nothing appears; if nothing new shows up, stop
     re-clicking that graphic type for the rest of the module and just use
     the visible labels. Don't burn tool calls re-testing this per icon.
5. **Knowledge Check lessons:** answer and submit the quiz live in the
   browser to get an authoritative correct-answer key (don't infer answers
   from memory) — capture full question text, all choices, and which one(s)
   were marked correct after submitting.

## If the course is fully stuck (redirect-loops on every module)

If a module won't hold after ~5 clean fresh-tab attempts, don't keep
grinding (one run burned 50+ attempts and still only got 1 of 6 lessons).
Report BLOCKED with whatever partial content and module_id map you have,
and suggest to the controller/user one of:

- Try again later — the SCORM "resume bookmark" state may be transient.
- Try the `/lrs/activities/state` and `/cds/<package-id>/` endpoints seen in
  network requests — this course is an Articulate Rise-authored SCORM
  package; its content may be directly fetchable via the LRS/CDS API rather
  than through the broken renderer wrapper (not yet attempted/proven — a
  lead, not a confirmed fix).
- A completely fresh Chrome profile/registration may not carry the same
  stuck bookmark (also not yet proven).
- Never write a lesson's `.md` file from general AWS knowledge as a
  substitute for content you couldn't actually see on screen — a missing
  file is honest; a plausible-sounding fabricated one is worse.

## Output format

One `.md` file per lesson at
`source/courses/<course-slug>/<module-slug>/<NN>-<lesson-slug>.md`:

```markdown
# <Lesson title (English, as-is)>

<Thai summary — headings/bullets as the source content warrants, covering
everything substantive including expanded accordion content. Keep AWS
service names / technical terms in English inline, e.g. "ใช้ **Amazon EC2**
เพื่อ...". Don't translate proper nouns or AWS terminology.>

## Key terms
- <English term>: <short Thai explanation>
```

Knowledge Check lessons additionally include, per question: the Thai
translation of the question, the original English answer choices, and the
correct one(s) marked (confirmed by submitting, not inferred).

Plus one `manifest.json` per module directory:

```json
{
  "slug": "<module-slug>",
  "title": "Module N: <Title>",
  "lessons": [
    { "slug": "<NN>-<lesson-slug>", "title": "<Lesson title>" }
  ]
}
```

No git commit from the extraction agent — the controller handles commits
after reviewing.

## Report format

Write a short capture report (what was covered per lesson, any accordions
expanded, any content that couldn't be reached, any concerns — not the full
text) to a report file the dispatcher specifies, then reply with the short
DONE/DONE_WITH_CONCERNS/BLOCKED/NEEDS_CONTEXT status contract.
