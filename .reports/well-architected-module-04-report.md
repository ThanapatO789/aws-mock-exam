# Module 4 - Deep Dive on the Operational Excellence Pillar — Capture Report

## Status: BLOCKED

## What worked
- Apollo cache extraction on the outline page
  (`https://skillbuilder.aws/learn/U89MJTNSM8/aws-well-architected-foundations/RCY5NFM8R9`)
  gave a clean module_id map for the whole course, confirming Module 4:
  - `module_id`: `2B77KASG72:001.001.003`
  - Course-correct `product_id`: `RCY5NFM8R9:003.000.000`
    (NOTE: a `N7Q3SXQCDY:001.005.004` product_id was also seen circulating in
    other agents' tabs in this shared browser session — that one belongs to
    a *different* course and produces an S3 "Access Denied" XML error when
    used with this course's modules. `RCY5NFM8R9:003.000.000` — confirmed by
    clicking Module 4 → Start on the outline page and reading the resulting
    URL — is the one that actually works for this course.)
  - `registration_id`: `dcab5ee7-64a3-55f6-8170-d1f38d990ed1` (also saw a
    `2a587fad-...` registration_id circulating from other agents/other
    courses — did not work for this course, produced Access Denied).
  - Working renderer URL (no `&referrer=`):
    `https://skillbuilder.aws/renderer/?module_id=2B77KASG72%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital`
  - This URL DID load past the Access Denied problem (multiple clean
    fresh-tab attempts confirmed the id/product/registration combo is
    correct), and the module's left-sidebar course menu text was readable
    via `document.getElementById('renderer_iframe').contentDocument.body.innerText`
    (same-origin; the top-level `get_page_text` MCP tool returned nothing
    useful, but direct JS extraction worked).
  - Discovered this module's content package is NOT an Articulate Rise
    course (unlike what the skill assumes) — it is an **Articulate
    Storyline** package. Evidence: the iframe loads
    `.../lms/scormdriver.js`, `.../html5/lib/scripts/frame.desktop.min.js`,
    `.../html5/data/js/frame.js`, `.../html5/lib/scripts/slides.min.js`,
    `.../story_content/user.js`. The CDS package id for this module is
    `585b102b-820c-4dfd-b574-61fced01d596`
    (`https://skillbuilder.aws/cds/585b102b-820c-4dfd-b574-61fced01d596/index_lms.html`).
    `html5/data/js/frame.js` (fetched successfully, 200 OK, ~310KB) contains
    a `window.globalProvideData('frame', '<json>')` call with the course
    frame/UI structure, but per-slide text content lives in separate
    per-slide data files whose slide IDs I did not get to enumerate before
    losing the browser connection — this JSON-extraction path is a
    plausible faster alternative to UI-driven capture for this specific
    module but is unproven/incomplete.

## Full lesson list recovered (from sidebar text, NOT lesson content — this
list was truncated by the JS return value size limit; the ellipsis below
marks where the tool truncated output, not where the course ends):
1.1. Welcome!
1.2. Learning objectives
1.3. Operational Excellence Pillar Overview
1.4. Pillars of Well-Architected
1.5. What is the operational excellence pillar?
1.6. Operational Excellence
1.7. Operational excellence
1.8. Operational Excellence Best Practices
1.9. Operational excellence
1.10. Organization
1.11. Organization priorities
1.12. Operating models
1.13. Organizational culture
1.14. Prepare
1.15. Design Telemetry
... (list continues; not fully captured before losing the browser session)

## What blocked progress
1. **Could not advance past the Module 4 cover/title slide ("Welcome!").**
   The slide shows the module title over a black video-cover with a Play
   button. A `NEXT` button (`aria-label="next"`, not disabled, class
   `cs-button btn`) exists in the DOM at a real, non-zero-size, non-hidden
   position, but:
   - Programmatic `.click()` on the button element did nothing visible.
   - A real mouse click (via the `computer` tool) at the button's
     screen-space coordinates (converted from the iframe's internal
     coordinate space, accounting for the outer page's devicePixelRatio)
     also did nothing visible.
   - A "Sidebar Toggle" button and a "Course Menu" button also exist in the
     DOM (the latter positioned off-screen at x=-299, `visibility: hidden`
     — likely an accessibility skip-link, not a real visible control) but
     clicking the Sidebar Toggle's real coordinates instead navigated the
     whole tab away to `skillbuilder.aws/learn` (hit the AWS header logo
     area instead, due to a coordinate-mapping miscalculation).
   - Did not click the video Play button, per the skill's explicit
     instruction never to click play — but for this specific module the
     written-content-below-the-video assumption from the skill (written for
     an Articulate Rise course) may not hold, since this is a Storyline
     title slide with no visible text content beside the video. This is an
     open question for a future attempt: it's possible clicking Play (or
     waiting for the video to auto-advance) is the *only* way to reach the
     `NEXT` control's real visible/clickable state for this specific module,
     which would make it a legitimate required interaction rather than a
     shortcut — but this was not confirmed.
2. **The shared browser session's tab group was extremely volatile.** With
   8 other concurrent agents all working the same course, tabs I created
   were repeatedly and unpredictably closed within 1-2 tool calls (observed
   many times: create tab → do 1-2 actions → tab no longer exists in
   `tabs_context_mcp`). This cost the majority of the tool-call budget on
   this run just re-establishing a live tab.
3. **The Chrome extension itself disconnected entirely** partway through
   (`tabs_context_mcp` started returning "Browser extension is not
   connected...") and did not reconnect after ~2.5 minutes of waiting
   (checked at ~0s, ~60s, ~150s). This is consistent with Chrome crashing
   or being overwhelmed by the cumulative tab count from 9 concurrent
   agents all navigating/creating tabs against the same course. Work
   stopped here per the skill's guidance to cap retries rather than keep
   burning attempts.
4. A sibling module report (`well-architected-module-05-report.md`, same
   session) hit the same BLOCKED outcome for Module 5 via the same
   product_id/registration_id confusion and inability to get past the
   sidebar-only view — corroborating that this is a course/session-wide
   issue, not specific to Module 4.

## Files written
None. No lesson `.md` files were written because no confirmed on-screen
lesson text was ever captured — only the sidebar's lesson-title list (via
`innerText`, not per-lesson body content). Per the skill's explicit
instruction, a missing file is preferred over a fabricated one, so no
lesson files or `manifest.json` were created for this module.

## Suggestions for a retry
- Retry solo, after the other 8 concurrent agents have finished and closed
  their tabs, to avoid the tab-group volatility and possible browser
  overload.
- If the cover-slide Next button is still unclickable, try clicking Play
  once (breaking the skill's general video-avoidance rule) specifically to
  test whether that is what enables/reveals the real Next control for this
  Storyline-based module — then immediately pause and read the following
  slide's on-screen text rather than watching further.
- Alternatively, pursue the `html5/data/js/frame.js` CDS JSON-extraction
  approach further: the frame data parsed via `window.globalProvideData`
  interception should yield a slide list with per-slide IDs, and each
  slide's own `html5/data/js/<slideId>.js` file (same
  `globalProvideData('slide', ...)` pattern) should contain that slide's
  text runs directly — this could let a future agent capture the whole
  module's text via `fetch()` without touching the flaky UI navigation at
  all.
