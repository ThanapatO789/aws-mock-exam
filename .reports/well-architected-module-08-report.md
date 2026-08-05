# Module 8 - Deep Dive on the Cost Optimization Pillar — Capture Report

## Status: BLOCKED

## What happened

1. Loaded the outline URL `https://skillbuilder.aws/learn/U89MJTNSM8/aws-well-architected-foundations/RCY5NFM8R9` in a fresh tab.
2. Successfully extracted the Apollo cache and confirmed the module map for this course. Module 8 identified as:
   - `module_id`: `HMQX2PG25K:001.001.003`
   - `name`: "Module 8 - Deep Dive on the Cost Optimization Pillar"
   - `product_id`: `N7Q3SXQCDY:001.005.004`
   - `registration_id`: `2a587fad-5ce1-5539-999a-7c736d0f0f2b`
3. Navigated directly to the renderer URL (no `&referrer=` param, per the skill's fix):
   `https://skillbuilder.aws/renderer/?module_id=HMQX2PG25K%3A001.001.003&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital`
4. Every attempt (6 clean fresh-tab attempts, exceeding the skill's ~5 cap) returned a raw XML-style **"AccessDenied" "Access Denied"** page instead of the module content — a different failure mode than the "resume bookmark" redirect loop described in the skill. This looks like an S3/CDS-backed content-serving error, not a navigation/bookmark issue.
5. Cross-checked other agents' tabs (visible in the shared Chrome tab group, since 8 other agents are working the same course concurrently) — several of *their* module renderer tabs (Module 1, 2, 5, 6, 7, etc., using a different `registration_id` of `dcab5ee7-64a3-55f6-8170-d1f38d990ed1` and `product_id=RCY5NFM8R9:003.000.000`) were also showing the same "AccessDenied" page at the same time. This suggests the content-serving backend was overloaded or rate-limited by the 9 concurrent agents hammering the same course, not a problem specific to Module 8 or to my module_id/registration_id combo.
6. Also observed heavy tab churn/instability in the shared tab group (tabs disappearing, "Error loading tab" states) — consistent with contention from the other concurrently running agents, as warned about in the skill for parallel dispatch even though this course is "Not started" (lowest risk category, but that risk category applies to the bookmark-redirect bug specifically, not to a service-level overload).

## Files written

None — no lesson content was ever visible on screen, so no `.md` files or `manifest.json` were written for this module (per skill's rule: never fabricate content from general knowledge).

## Concerns / recommendations

- This is a different bug signature than the one documented in the skill (raw S3 AccessDenied vs. SCORM bookmark redirect loop). Worth appending to the skill once confirmed reproducible, since it appeared to correlate with heavy concurrent load (9 agents on one course at once).
- Suggest retrying Module 8 alone (no concurrent agents on this course) once the other 8 agents have finished, or retrying after a delay.
- The module_id map entry for Module 8 (`HMQX2PG25K:001.001.003`) is confirmed correct and reusable for a future retry — no need to re-derive it from the Apollo cache.
