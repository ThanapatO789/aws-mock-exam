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

## CRITICAL: never run multiple modules in parallel

Discovered the hard way running 7 modules concurrently: this course's
outline page has a server-side "resume where you left off" pointer tied to
`registration_id` (account-level state, not per-tab, not per-Chrome-profile
session). Every module-viewer visit reads/moves that shared pointer. With
several agents clicking around at once, each agent's navigation kept
getting silently redirected to whatever module *another* agent had most
recently opened — one agent trying to open Module 4 landed on Module 6, 7,
8, 9 in rotation, never once reaching Module 4, across 15+ attempts. Four
of seven parallel modules (3, 4, 5, 7) came back fully BLOCKED this way,
burning 250-370 tool calls each with zero output, while the module the
pointer kept drifting toward (Module 6) got redundant duplicate attention
from multiple agents.

**Rule: process modules one at a time, sequentially, never dispatch two
module-reading agents concurrently against the same course/registration.**
This cost roughly 10x the tool calls of just going sequentially would have.

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

- **`get_page_text` and `read_page` return nothing useful.** The lesson
  content lives in a cross-origin iframe (`id="renderer_iframe"`) that these
  tools cannot see into. Read every lesson **visually via
  `computer` screenshot/zoom actions**. Don't waste a call re-trying text
  extraction "just in case."
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
  report BLOCKED.
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
