# Module 3 - Deep Dive on the AWS Well-Architected Tool — Capture Report

## Status: BLOCKED

## What was confirmed
- Course outline URL: `https://skillbuilder.aws/learn/U89MJTNSM8/aws-well-architected-foundations/RCY5NFM8R9`
- Module 3 `module_id:version` (from Apollo cache extraction): `HGFX4J46UN:001.001.003`
- Correct `product_id` for this course: `RCY5NFM8R9:003.000.000`
- Correct `registration_id`: `dcab5ee7-64a3-55f6-8170-d1f38d990ed1`
  - Note: a stale tab left open in the browser session (unrelated prior task) had a
    *different* course's product_id (`N7Q3SXQCDY:001.005.004`) and registration_id
    (`2a587fad-5ce1-5539-999a-7c736d0f0f2b`). Using that pairing for this course's
    renderer URL produced `AccessDenied` / bounce-to-dashboard every time. The
    correct pairing above was confirmed by cross-checking multiple *other* concurrent
    agents' successfully-loaded renderer tabs for this same course (they all
    consistently used `RCY5NFM8R9:003.000.000` / `dcab5ee7-...`).
- Working renderer URL for Module 3 (loads the course menu correctly):
  `https://skillbuilder.aws/renderer/?module_id=HGFX4J46UN%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital`
- Full confirmed lesson list from the module's left sidebar (21 items):
  1. 1.1. Welcome!
  2. 1.2. Learning objectives
  3. 1.3. A mechanism for continuous improvement
  4. 1.4. Components of the Well-Architected Framework
  5. 1.5. AWS Well-Architected Tool
  6. 1.6. AWS Well-Architected Tool overview
  7. 1.7. AWS Well-Architected Tool new workload
  8. 1.8. AWS Well-Architected Tool new workload cont.
  9. 1.9. AWS Well-Architected Tool workload details
  10. 1.10. AWS Well-Architected Tool workload details cont.
  11. 1.11. AWS Well-Architected Tool (milestones)
  12. 1.12. AWS Well-Architected Tool sharing
  13. 1.13. AWS Well-Architected Tool content
  14. 1.14. AWS Well-Architected Tool custom lenses
  15. 1.15. What's new with AWS WA?
  16. 1.16. Question 1 (Knowledge Check)
  17. 1.17. Question 2 (Knowledge Check)
  18. 1.18. Question 3 (Knowledge Check)
  19. 1.19. Question 4 (Knowledge Check)
  20. 1.20. Summary
  21. 1.21. Thank you

## What blocked content capture
No lesson content could actually be read. Symptoms observed across many attempts:

1. **Wrong-pairing attempts (before I found the correct product_id/registration_id):**
   3 fresh-tab attempts returned `AccessDenied` (S3 XML error rendered full-page) or
   silently bounced back to the course dashboard.
2. **Correct-pairing attempts:** the renderer loaded properly (course menu with all
   21 lessons visible, sidebar navigation worked, lessons could be clicked and were
   marked "visited"), but the actual slide/content pane stayed **completely blank**
   for every lesson tried (1.1, 1.2, 1.3) — no text, no canvas, no SVG, empty
   `<main class="slide-container">`. Console showed JS exceptions from the
   Storyline player (`frame.desktop.min.js`): `TypeError: Cannot read properties of
   undefined (reading 'absoluteId')` and `(reading 'progress')`, thrown from
   `onClickLink`/`onClickBtn` handlers — consistent with corrupted player state.
3. **`get_page_text` / `document.getElementById('renderer_iframe').contentDocument`**
   worked for reading the sidebar/menu text, but the actual lesson body is rendered
   into an essentially-empty `<main>` node with no text content — nothing to extract.
4. **"COURSE TRANSCRIPT" link** opens a per-module PDF
   (`.../story_content/external_files/Module-3_Transcript.pdf`) which would have
   been an excellent bypass, but every attempt (fresh click, reload, re-click for a
   new signed URL) returned S3 `AccessDenied` XML — same failure pattern as #1.
5. **Confirmed cross-agent interference (the redirect-loop bug from the skill,
   empirically reproduced):** on one attempt, clicking the "play" button on Module
   3's title slide caused the tab to jump to **Module 7 - Deep Dive on the
   Performance Efficiency Pillar** (a different concurrently-running agent's
   module), because this session runs 9 agents concurrently sharing the same
   `registration_id`. This matches the skill's documented "resume bookmark" bug,
   confirmed here even though this course showed "Not started" status going in.

Given the course was run with 8 other concurrent module agents on the *same*
registration_id, and this reproduced the exact shared-state interference pattern
the skill warns about, I stopped after well beyond the ~5 clean-attempt budget
(roughly 8-9 fresh-tab/reload attempts total, several past the correct
product_id/registration_id was found) rather than continue grinding.

## Files written
None. No lesson `.md` files or `manifest.json` were written for this module,
per the skill's explicit instruction never to fabricate lesson content from
general knowledge as a substitute for content that could not actually be read
on screen.

## Suggested next steps
- Retry this module solo (no other concurrent agents on this course) once the
  other 8 modules' agents have finished and released the shared
  `registration_id`/browser tab-group contention.
- If it still fails solo, try the `/lrs/activities/state` or `/cds/<package-id>/`
  endpoints directly (this is confirmed to be an Articulate Storyline/Rise-style
  SCORM package under `/cds/0aadd79f-dd47-4566-920b-e0fe047189cb/...`) — not yet
  attempted here.
- The transcript-PDF route (`Module-3_Transcript.pdf` under the same `/cds/`
  package id) is worth retrying solo too — the AccessDenied there may also be a
  contention artifact rather than a permissions issue, since sibling modules'
  transcript PDFs (e.g. Module 1, Module 2, Module 9) were seen opening
  successfully in other agents' tabs during this same session.
