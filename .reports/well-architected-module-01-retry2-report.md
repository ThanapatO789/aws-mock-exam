# AWS Well-Architected Foundations — Module 1 retry (Storyline technique validation)

## Outcome: SUCCESS — technique found and validated end-to-end

Read all 19 slides (1.1–1.19) of Module 1 "AWS Well-Architected Framework
Overview" solo, single tab, ~1 hour. Wrote 9 lesson `.md` files + manifest.
This course confirmed to use **Articulate Storyline**, not Rise.

## The confirmed technique (replaces the skill's placeholder)

### 1. Getting into the module
- Stale `module_id` from a prior run's report returned `AccessDenied` — this
  is expected/normal, not a blocker. Always re-derive the module_id via the
  Apollo cache lookup in the skill (navigate to the course outline URL, run
  the `window.__APOLLO_CLIENT__.cache.extract()` snippet). `product_id`,
  `product_version`, and `registration_id` were still valid/reusable from
  the stale URL — only the per-module `module_id:version` had changed.
- Fresh tab to the renderer URL (no `&referrer=`) → auto-redirects through
  "Sign in" → auto-completes in ~5s (per existing skill guidance, confirmed
  again here).
- First screen is a splash/cover slide with a **big center play button**
  and an "Autoplay slides" toggle. Clicking it advances into the actual
  module viewer with the left sidebar TOC. This splash is the module's own
  title slide (slide 1.1 "Welcome!"), not a separate course-intro video —
  don't confuse it with lesson content; just click through it once.

### 2. Reading each slide — layered approach required
**No single method reliably captures 100% of a Storyline slide's content.**
Use both, always:

**A. `document.getElementById('renderer_iframe').contentDocument.body.innerText`**
  (via `javascript_tool`) — works immediately after a slide loads, **no
  waiting and no clicking a transport/play button was needed** for any of
  the 19 slides in this module. This directly contradicts the skill's
  placeholder hypothesis ("wait for entrance timeline to finish" / "click a
  small transport play button") — that was not needed here at all. It's
  possible other Storyline courses behave differently, but for this course
  the accessibility-text mirror is populated on slide load, not gated by
  animation completion.
  - This method captured full slide text (including duplicate title/body
    text and a near-duplicate low-fidelity OCR-like second copy with
    ligature artifacts like "aliates" for "affiliates", "ecient" for
    "efficient" — cosmetic, ignorable) for most slides: text-only slides,
    icon+label slides, timelines, Venn diagrams, flow diagrams all came
    through completely and were spot-checked pixel-for-pixel correct
    against screenshots.

**B. Screenshot — mandatory cross-check, not optional.** Two categories of
  content were found completely **absent from the DOM** (`innerHTML` search
  confirmed zero matches, not just an innerText quirk):
  1. **Honeycomb/infographic vector-art labels** (e.g. the "Well-Architected
     lenses" slide's 12 lens names — Data Analytics Lens, Games Industry
     Lens, etc.) — rendered as pure vector graphics with no accessibility
     text mirror at all.
  2. **"Layer" content that flies in over a base slide** (e.g. the
     "Questions and best practices" slide, which showed a full worked
     example — SEC 8 "How do you protect your data at rest?" with 3
     detailed best-practice paragraphs) — the base slide's accessibility
     text only describes the generic labels ("Question text / Question
     context / Best practices"); the layer's actual detailed content that
     visually replaces/covers those labels is **not in the DOM at all**,
     confirmed via `documentElement.innerHTML.includes(...)` returning
     `false` for known on-screen phrases.

  **Rule going forward: screenshot every slide and treat it as ground
  truth; use innerText as a fast first draft/typing aid, but always
  visually diff it against the screenshot before trusting it complete.**
  In this run, roughly 2 of 19 slides (~10%) had meaningfully incomplete
  innerText.

### 3. Sidebar navigation
- Real UI clicks (`computer` tool, `left_click` on sidebar TOC entries)
  work reliably and instantly advance the slide — no redirect-loop bug hit
  in this session (course is presumably not yet 100%-complete on this
  account, or this course type doesn't trigger it).
- **Synthetic JS clicks (`element.click()`) on the TOC's `span.linkText`
  or its ancestors do NOT navigate the slide** — confirmed by testing:
  the JS call reported "clicked" but the slide never changed. Storyline's
  nav must be listening for real pointer events, not programmatic
  `.click()`. Don't waste time trying to script navigation via JS; use
  real coordinate clicks.
- The TOC list is discoverable via
  `document.getElementById('renderer_iframe').contentDocument.body.innerText`
  — it includes a `COURSE MENU` section listing every `N.M. Title` entry
  (each appears twice due to a "visited" accessibility duplicate), which
  is a fast way to get the full lesson list without clicking through
  first.

### 4. Knowledge Check slides
- Multiple-choice questions render a "Show answers"/"Show Answers" button.
  Clicking it highlights the correct choice(s) with a red/pink border —
  confirmed working exactly as the skill instructs (don't infer from
  memory). Captured both questions this way:
  - Q1 (single-select): correct answer D.
  - Q2 (select THREE): correct answers A, B, D.

### 5. Bonus/unexpected find: standalone transcript PDF
- At one point a `javascript_tool` call (querying the top-level document,
  not even the iframe) coincided with a new tab opening to
  `https://skillbuilder.aws/cds/<package-id>/story_content/external_files/AWS_WA_Module1_FrameworkOverview_Transcript.pdf`
  — an "Articulate Word Output" transcript of the whole module, organized
  by the same `N.M` section numbers as the TOC. Cause is unclear (possibly
  an accidental click-through on the "COURSE TRANSCRIPT" link visible in
  the renderer's top bar). This PDF is a **useful secondary reference but
  not sufficient on its own** — spot-checking showed it's a condensed
  narration summary, missing detail present on-slide (e.g. it doesn't
  include the "Improve/Learn/Measure" cycle-diagram labels or the
  honeycomb lens names, and its bullet lists were shorter than the
  on-slide bullets in places). Treat it as a fast orientation aid /
  fallback if the renderer becomes unavailable, not a replacement for
  screenshot+innerText reading of the live renderer.
- The CDS path pattern (`/cds/<package-id>/story_content/external_files/`)
  might be worth deliberately probing for other useful package assets in
  future runs (e.g. images, other exported PDFs) if this happens again —
  not pursued further here due to time budget.

## What to update in the skill
Replace the "Some courses use Articulate Storyline..." placeholder
paragraph with a summary of the above: no transport-button click or wait
was needed for this course; the real requirement is **always
screenshot-verify every slide** because some content (vector-art labels,
flown-in example layers) never reaches the DOM at all, regardless of
timing. Also add the "JS synthetic click doesn't work on Storyline nav,
use real coordinate clicks" note, and the Apollo-cache-derived TOC list
trick (`innerText` after `COURSE MENU` gives the full `N.M title` list in
one call).

## Files written
- `source/courses/aws-well-architected-foundations/01-well-architected-framework-overview/01-welcome-and-objectives.md`
- `.../02-what-is-well-architected.md`
- `.../03-why-use-and-history.md`
- `.../04-components-of-the-framework.md`
- `.../05-pillars-and-lenses.md`
- `.../06-design-principles.md`
- `.../07-questions-and-best-practices.md`
- `.../08-knowledge-check.md`
- `.../09-summary.md`
- `.../manifest.json`

All 19 TOC slides (1.1–1.19) are covered across these 9 files (grouped by
logical sub-topic since individual Storyline slides are much more granular
than a typical Rise "lesson" — several slides are single-sentence section
dividers or single-diagram slides).

## Concerns / caveats
- No accordions were present in this module (unlike Rise courses per the
  skill) — nothing to click-expand; the only "hidden" content was the
  layer-based fly-in example, which was already visible without
  interaction (visible by default on slide load, not gated by a click).
- Didn't verify whether the "resume bookmark" redirect-loop bug (documented
  in the skill for other courses) applies to this course — never hit it in
  this solo run, but this course's completion status was not checked
  beforehand.
- Module_id map for other modules (2–7+) was captured in the Apollo cache
  dump but not recorded verbatim in this report since only Module 1 was in
  scope — future runs should re-derive via the same Apollo cache lookup
  rather than assume the IDs given in a task prompt are still valid.
