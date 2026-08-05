# Module 2 - How to Run a Well-Architected Framework Review — Capture Report

## Status: BLOCKED (partial data only)

## What was obtained (verified, real data)

- Confirmed IDs (via Apollo cache extraction + successful renderer load):
  - `module_id = XY3A1YQY8V:001.001.003`
  - `product_id = RCY5NFM8R9:003.000.000`
  - `registration_id = dcab5ee7-64a3-55f6-8170-d1f38d990ed1`
  - Working renderer URL (loads the correct module title screen and sidebar
    with no `AccessDenied`):
    `https://skillbuilder.aws/renderer/?module_id=XY3A1YQY8V%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital`
  - Note: two other `product_id`/`registration_id` combinations seen in
    other agents' tabs (`N7Q3SXQCDY:001.005.004` and
    `2a587fad-5ce1-5539-999a-7c736d0f0f2b`) consistently returned
    `AccessDenied` for this module — do not reuse those for Module 2.
  - The module's CDS package UUID is `b1f25bc8-3b53-4df9-ab9d-870c28f3c4ad`;
    its transcript file is named `Module2_Transcript_PDF.pdf` (found via the
    in-app "Course Transcript" button, which opens
    `https://skillbuilder.aws/cds/b1f25bc8-3b53-4df9-ab9d-870c28f3c4ad/story_content/external_files/Module2_Transcript_PDF.pdf`)
    — but every direct navigation to that URL (fresh tab or reload) returned
    an S3 `AccessDenied` XML error, so the transcript could not actually be
    read.

- Full, confirmed lesson list for Module 2 (read directly from the course
  menu sidebar DOM text, not guessed) — 21 lessons:
  1.1 AWS Well-Architected
  1.2 Learning objectives
  1.3 What Is the Well-Architected Framework Review?
  1.4 A mechanism
  1.5 Intent of a review
  1.6 Learnings
  1.7 Use cases
  1.8 Three review phases
  1.9 Prepare
  1.10 Best practices for preparing reviews
  1.11 Best practices for preparing reviews (cont.)
  1.12 Review preparation steps
  1.13 Review
  1.14 Best practices for running reviews
  1.15 Improve
  1.16 Risk prioritization methodology and considerations
  1.17 Well-Architected improvement workflow
  1.18 Question 1
  1.19 Question 2
  1.20 Summary
  1.21 Thank you

  (plus a non-content "2. Keyboard Shortcuts" menu entry, correctly
  excluded from the manifest)

## What could NOT be obtained

No lesson body content (text, accordions, Knowledge Check questions/answers)
was captured for any of the 21 lessons. Per the skill's explicit rule, no
lesson `.md` files were written from general knowledge as a substitute —
only `manifest.json` (titles only, confirmed real) was written.

## Why it was blocked

Two compounding problems, both outside normal retry-and-fix territory:

1. **Severe cross-agent tab contention.** This run was one of 9 concurrent
   agents (modules 1, 3-9) sharing the *same* Chrome MCP tab group. Tabs I
   created and navigated were repeatedly closed or force-navigated to a
   *different* agent's module within 1-3 seconds, over roughly 20+ fresh-tab
   attempts (well beyond the skill's ~5-attempt cap). This is a more severe
   version of the "resume bookmark" cross-agent interference the skill
   already documents for a *different* (previously-completed) course; here
   it reproduced on a "Not started" course purely from tab-pool contention
   with 9 simultaneous agents.
2. **Content pane not rendering even when a tab briefly survived.** On the
   one occasion the module loaded cleanly into a lesson (1.1, then 1.3 via
   sidebar click), the sidebar/menu rendered correctly but the main content
   pane stayed fully black with only a video scrubber bar at the bottom —
   `document.getElementById('renderer_iframe').contentDocument.body.innerText`
   returned only the 21-item menu text (~1.4 KB), never lesson body text.
   This module appears to be an Articulate Storyline package (body classes
   like `cs-HTML theme-unified ff-...`) rather than the Rise-style package
   the skill's `get_page_text`/`innerText` trick was validated against, so
   slide content may only populate the DOM after the embedded
   audio/video actually plays — never confirmed either way before the
   browser extension itself disconnected.
3. Finally, mid-task, the Claude-in-Chrome browser extension reported
   "not connected" and stopped responding to any tool call (`tabs_context_mcp`
   itself failed), which hard-stopped further attempts — almost certainly
   from the combined load of 9 agents each cycling through dozens of tabs.

## Recommendation

- Re-run Module 2 capture solo (no concurrent siblings), or at least after
  the other 8 agents have finished and closed their tabs.
- Once solo, reuse the confirmed working URL/IDs above to skip straight to
  the renderer without re-deriving them.
- If the content pane is still black after clicking the play button and
  waiting several seconds, try letting the narration audio actually play
  for a few seconds (this module may require it, unlike the Rise-style
  course the skill was written against) before reading
  `body.innerText` again, or inspect for a nested Storyline "slide" iframe
  that may only mount after playback starts.
