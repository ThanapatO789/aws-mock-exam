# AWS Technical Essentials Part 1 — Module 2: AWS Compute — Capture Report

## Status: BLOCKED

## What happened

Followed the skill's documented redirect-loop fix (fresh tab, no `&referrer=` param) and
navigated directly to the given Module 2 renderer URL:

```
https://skillbuilder.aws/renderer/?module_id=W9A4VFJXSF%3A001.000.001&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital
```

This hit the "fully stuck redirect loop" scenario the skill warns about, likely worsened by
concurrent agents (Module 3 on the same Part 1 package, Modules 4/5/6 on a separate Part 2
registration) perturbing the shared SCORM bookmark:

- Attempts 1, 2, 4, 6: within 2-4 seconds of navigating to the Module 2 URL, the tab
  auto-redirected (with no click/scroll from me) to `module_id=K3WV65M927:001.001.001`,
  which renders as **"AWS Technical Essentials Part 2"** content (e.g. "Demonstration:
  Implementing and Managing Amazon DynamoDB", Module 4: AWS Storage) — an entirely
  different course/module than requested, despite the URL's `product_id` staying
  `N7Q3SXQCDY:001.005.004` throughout.
- Attempt 3: URL held for several seconds while the page showed a loading spinner, then
  also redirected to the same Part 2 module_id before any interaction occurred.
- Attempt 5: URL held and the page successfully rendered — but as **"Module 1 Knowledge
  Check"** (the registration's current SCORM bookmark, i.e. right where Module 1 left off,
  not Module 2). A single sidebar scroll attempt (to locate the Module 2 section) was enough
  to immediately trigger another redirect to the Part 2 module_id.

6 clean fresh-tab attempts were made in total, exceeding the skill's ~5-attempt cap with
zero successful entry into Module 2 content. No interaction beyond navigation and one
scroll was performed on any successfully-loaded page, ruling out my own navigation as the
trigger for at least attempts 1, 2, 4, and 6.

## Files written

None. Per the skill's explicit instruction, no lesson `.md` files or `manifest.json` were
fabricated from prior knowledge — a missing file is honest, a plausible-sounding fabricated
one is not.

## Suggested next steps (per skill's "If the course is fully stuck" section)

- Retry later — the SCORM resume-bookmark state may be transient, and may improve once
  concurrent Module 3 / Part 2 agents have finished and stopped perturbing the shared
  registration state.
- Consider trying the `/lrs/activities/state` and `/cds/<package-id>/` endpoints (seen in
  network requests for this Articulate Rise-authored SCORM package) as a direct-fetch
  alternative to the broken renderer wrapper — not attempted in this run.
- A fresh Chrome profile/registration may not carry the same stuck bookmark — not attempted.

## Concerns

- Do not run a Module 2 retry concurrently with any other agent touching the same
  `registration_id` (2a587fad-5ce1-5539-999a-7c736d0f0f2b) — this run's evidence suggests
  cross-agent bookmark interference is a real contributor, consistent with the skill's
  parallel-run warnings.
