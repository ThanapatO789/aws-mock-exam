# Module 7: Monitoring and Scaling — capture report

## Status: BLOCKED (platform instability, not a content/skill issue)

No lesson `.md` files or `manifest.json` were written. Per the extraction skill's own
guidance, a half-read lesson is worse than a clean BLOCKED — nothing was captured with
confidence, so nothing was written to `source/courses/architecting-on-aws/07-monitoring-and-scaling/`.

## What is confirmed about Module 7's structure

From the module viewer's left sidebar (seen clearly and repeatably), Module 7 has 7 lessons:
1. Overview
2. Monitoring
3. Alarms and Events
4. Load Balancing
5. Auto Scaling
6. Tech Talk
7. Knowledge Check

One Knowledge Check question was glimpsed (not submitted — no confirmed answer key):
"Which of these is a valid target for an Application Load Balancer?" — choices: An Amazon
EC2 instance / An Availability Zone / An Amazon S3 bucket / A VPN connection (AWS ALB
targets are EC2 instances, IP addresses, Lambda functions, or containers — EC2 instance is
almost certainly correct, but this was **not verified by submitting live** and must not be
trusted as-is).

No lesson body text was successfully captured — every attempt to read content (via screenshot
scrolling or DOM text extraction) was cut off by a forced navigation (see below) before
meaningful content could be captured or verified as complete.

## The blocker: the page force-navigates away every ~2-6 seconds

This session ("Digital Classroom - Architecting on AWS") is already 100% complete
(completed December 7, 2025), and every module in the outline carries an "UPDATED" badge with
a banner: "A new version of this content was published on April 15, 2026. Your progress may
have changed. If you completed the previous version, your completion status was preserved."
This "completed + content updated" state appears to put the course into a broken review mode.

Symptoms, all reproduced multiple times across multiple fresh tabs/sessions:

1. **The outline sidebar (course outline page, `/learn/...`) cannot be reliably navigated by
   coordinate or `find`-tool `ref` clicks.** The list re-renders/rescrolls between the
   locate-and-click round trip, so clicks land on the wrong module almost every time
   (observed selecting Module 3, 6, 8, 10, 11, Lab 1, Lab 4, and "Course Welcome" while
   targeting Module 7). The only reliable way to select Module 7 found was a single
   `javascript_tool` call that finds the `<span>` with the exact module title text, calls
   `.closest('[role="radio"]').click()`, waits ~700-1000ms, then clicks the one "Review"
   button whose `getBoundingClientRect()` has non-zero size (there are ~20 "Review" buttons
   in the DOM simultaneously, only one visible at a time).

2. **Direct navigation to a `/renderer/?module_id=...` URL (bypassing the outline) always
   redirects straight back to `/learn/...`.** Entering the viewer only works via the click
   sequence above, from the outline page, in the same session/tab.

3. **Once inside the module viewer, content is genuinely rendered correctly** (confirmed
   visually at least twice — once showing Module 7's Knowledge Check page cleanly, once
   showing Module 8's Overview page cleanly with real lesson text) — but the page
   force-navigates back to the outline (or all the way to the Dashboard) roughly 2-6 seconds
   after entry, **regardless of whether any interaction happens**. A plain 3-6 second `wait`
   with zero clicks was enough to trigger the bounce on its own. Toward the end of
   troubleshooting, even a `javascript_tool` execution was interrupted mid-`await` by Chrome
   DevTools Protocol error `-32000 Inspected target navigated or closed`, meaning the
   navigation can fire in the middle of a single synchronous-looking script run, not just
   between tool calls.

4. **`document.visibilityState` reported `"hidden"` while `document.hasFocus()` reported
   `true`** at one point (and both `false`/`hidden` at another), suggesting the automated tab
   is not treated as OS-foreground by the page. This is a plausible trigger for an
   auto-resume/heartbeat/kiosk-style timer that fires on a backgrounded tab, but this could
   not be confirmed or fixed — no available tool reliably brings the Chrome tab to true
   OS-level foreground (`resize_window` was tried and did not help, and once corrupted the
   tab group requiring a fresh one).

5. **The `module_id` for "Module 7" was NOT stable across attempts** — the same click sequence
   variously produced `module_id=CZZWRSJ8V9:001.000.005` (confirmed correct: showed Module 7
   content), `TSXPJPAXYN:001.000.005` / `:001.000.002` (the `.002` version returned a literal
   "AccessDenied" page), `2CFAQHKVZC:001.000.005` / `:001.000.001` (this one is Module 8:
   Automation, not Module 7 — likely a stale/leftover DOM node matched by the text-based
   selector), and `ATG65NWJC7:001.000.005`. This instability is consistent with duplicate/stale
   React nodes accumulating in the DOM after repeated outline↔renderer navigation within the
   same tab, on top of the "content updated" duplicate-version state noted above.
   `product_id=7K1SN4ADEW:001.001.006` and `registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66`
   were stable throughout.

## What was tried (in order)

- Coordinate-based sidebar clicks (multiple retries, scroll-then-click) — unreliable, wrong
  module selected almost every time.
- `find`-tool + `ref`-based clicks — same unreliability; refs frequently went stale between
  find and click.
- `browser_batch` chaining click+screenshot — confirmed the click itself sometimes lands
  correctly but the page has already re-rendered by execution time.
- Single-shot `javascript_tool` DOM click (find span → `.closest('[role="radio"]')` →
  click one visible "Review" button) — this was the **only reliable way to enter Module 7**,
  succeeding at least twice with the confirmed-correct `CZZWRSJ8V9` module ID.
- Polling `document.getElementById('renderer_iframe').src` to try bypassing the wrapper by
  navigating directly to the iframe's inner URL — the iframe turned out to be same-origin
  (`skillbuilder.aws/cds/auth?...`), i.e. an auth-redirect step, not a stable standalone
  content URL, and by the time it was inspected the iframe had already gone to
  `about:blank` (meaning the real lesson content renders directly into the top-level
  document after the auth iframe finishes, not inside a persistent iframe).
- A single mega-script meant to enter Module 7 and walk all 7 lessons via `.innerText`
  extraction in one uninterrupted script execution (to dodge the presumed per-tool-call
  redirect trigger) — this **also got interrupted mid-execution** by the forced navigation,
  disproving the "only happens between tool calls" theory; the redirect is a genuine
  background timer independent of our automation cadence.
- Fresh tabs / fresh navigation (closing and recreating the tab group entirely) — did not
  help; the same bounce recurred within a few seconds regardless of tab freshness.

## Recommendation for a future run

- Do **not** repeat the coordinate/ref-click approach on the outline sidebar — it's a known
  dead end for this specific course state.
- The `javascript_tool` radio+Review click sequence (documented above) is the fastest way to
  re-enter Module 7, but expect only a ~2-6 second window before an automatic bounce, and
  expect the resolved `module_id` to sometimes be wrong (verify `location.href` contains
  `CZZWRSJ8V9` before trusting the content, or re-derive by checking the sidebar module
  title/lesson list matches Module 7's expected 7 lessons).
- Worth trying next: a real logged-in Chrome profile / tab that is the actual foreground
  window at the OS level (not just the active tab within a background automation tab group),
  to test the `document.visibilityState` theory — if that alone fixes the bounce, everything
  else above becomes moot.
- Also worth trying: waiting a day in case the "content updated April 15, 2026" migration is
  still propagating server-side and causing this specific module's review state to be
  inconsistent; other modules (1-6) were navigable via the normal outline flow earlier in this
  same session without the aggressive bounce, so this may be specific to Module 7 (or to
  modules 7 onward) rather than universal.

## Cleanup

All Chrome tabs opened during this session were closed (the last tab group was already gone
by the end of troubleshooting; no open tabs remain to close).
