# Module 3 - Deep Dive on the AWS Well-Architected Tool — retry capture report

Status: BLOCKED

## What was confirmed

- Course: AWS Well-Architected Foundations
  - product_id: `RCY5NFM8R9:003.000.000`
  - registration_id: `dcab5ee7-64a3-55f6-8170-d1f38d990ed1`
- Module 3 versionedId (re-verified via Apollo cache extract on the outline
  page, matches the prior blocked attempt's value):
  `HGFX4J46UN:001.001.003`
- Renderer URL used (no `&referrer=` param):
  `https://skillbuilder.aws/renderer/?module_id=HGFX4J46UN%3A001.001.003&product_id=RCY5NFM8R9%3A003.000.000&registration_id=dcab5ee7-64a3-55f6-8170-d1f38d990ed1&navigation=digital`
- Confirmed full 21-item lesson/slide sidebar list for Module 3 (from
  `renderer_iframe.contentDocument.body.innerText` when the module did
  briefly load):
  1. 1.1 Welcome!
  2. 1.2 Learning objectives
  3. 1.3 A mechanism for continuous improvement
  4. 1.4 Components of the Well-Architected Framework
  5. 1.5 AWS Well-Architected Tool
  6. 1.6 AWS Well-Architected Tool overview
  7. 1.7 AWS Well-Architected Tool new workload
  8. 1.8 AWS Well-Architected Tool new workload cont.
  9. 1.9 AWS Well-Architected Tool workload details
  10. 1.10 AWS Well-Architected Tool workload details cont.
  11. 1.11 AWS Well-Architected Tool (milestones)
  12. 1.12 AWS Well-Architected Tool sharing
  13. 1.13 AWS Well-Architected Tool content
  14. 1.14 AWS Well-Architected Tool custom lenses
  15. 1.15 What's new with AWS WA?
  16. 1.16 Question 1 (knowledge check)
  17. 1.17 Question 2 (knowledge check)
  18. 1.18 Question 3 (knowledge check)
  19. 1.19 Question 4 (knowledge check)
  20. 1.20 Summary
  21. 1.21 Thank you
  (plus a "2. Keyboard Shortcuts" utility entry, not course content)

## What blocked capture

This account's registration for the course is already complete, and this
module hit the documented "resume bookmark" redirect bug hard, on every
one of 5 clean fresh-tab attempts:

1. Attempt 1: loaded Module 3 fine, sidebar visible, clicked into 1.1 and
   1.2 — but slide content pane stayed visually black and
   `renderer_iframe` innerText stayed stuck reporting `slide: Welcome!`
   (title only, no body text ever appeared) even after clicking 1.2. Then
   the entire Chrome MCP tab group was destroyed out from under the agent
   between two tool calls (tab group id changed, all 3 tabs — mine plus
   two other concurrently-running agents' tabs — vanished). This matches
   the skill's documented extension-overload symptom under concurrent
   load (there were 2 sibling module agents active on this same course at
   the time, tabIds seen: one on Module 2 `XY3A1YQY8V`, one on Module 4
   `2B77KASG72`).
2. Attempts 2-5: fresh tab, fresh navigate to the trimmed Module 3
   renderer URL (no `referrer`). Each time the tab briefly loaded Module 3
   correctly, but on the very next interaction (a click, or even just a
   subsequent tool round-trip) it silently redirected to a *different*
   module — Module 2 once, Module 4 twice — matching whatever module a
   sibling concurrent agent was actively working in. This is the
   documented shared-bookmark cross-agent interference: with other module
   agents active on the same registration_id, each agent's navigation
   perturbs the shared SCORM bookmark that the others get redirected back
   to.

No lesson body content beyond the sidebar title list and one fragmentary
`slide: Welcome!` title-only read was ever reliably captured, so per the
skill's rule ("never write a lesson's .md file from general AWS knowledge
as a substitute for content you couldn't actually see"), no lesson `.md`
files or `manifest.json` were written for this module.

## Recommendation

- Re-run Module 3 solo (zero other concurrently-running agents against
  this same registration_id `dcab5ee7-64a3-55f6-8170-d1f38d990ed1`,
  across ALL modules of this course, not just Module 3) — the skill notes
  this bug reproduces even solo but is "much worse" with concurrent
  agents, and this run had 2 siblings active throughout every attempt.
  the SCORM bookmark now sits on whatever module was last touched
  (Module 4, `2B77KASG72`, as of the last attempt) — worth checking
  before the next run.
