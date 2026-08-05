# Module 3: Networking-1 — Capture attempt report

## Status: BLOCKED

Could not reach a stable, readable view of Module 3's lesson content despite
an extremely large number of attempts (~250+ tool calls). This report exists
so the next attempt doesn't repeat the same dead ends.

## What's confirmed working

- Course outline URL:
  `https://skillbuilder.aws/learn/PEXM2Q7XD5/digital-classroom-architecting-on-aws/7K1SN4ADEW`
- The user's Chrome profile auto-authenticates on a fresh tab within a few
  seconds (confirmed — dashboard shows "thanapat.o@infinitaskt.com" signed
  in, course shows "Congratulations! You completed this training on
  December 7, 2025").
- Module viewer URL template (confirmed working for modules 4, 6, 7, 8, and
  Course Welcome — all loaded and were fully readable/scrollable):
  ```
  https://skillbuilder.aws/renderer/?module_id=<ID>%3A<VERSION>&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&referrer=https%3A%2F%2Fskillbuilder.aws%2Flearn%2FPEXM2Q7XD5%2Fdigital-classroom-architecting-on-aws%2F7K1SN4ADEW&navigation=digital
  ```
- Module `module_id:version` map, extracted directly from the Apollo Client
  cache in the browser (see method below) — this is the authoritative
  source, more reliable than clicking:
  - Course Welcome: `7XNU5N13DC:001.000.005`
  - Module 1: `VZ62XN3ZYZ:001.000.005`
  - Module 2: `47AZQ9RYDF:001.000.005`
  - **Module 3: `ATG65NWJC7:001.000.005`** (outline name confirmed:
    "Module 3: Networking-1"; its `outline` JSON in cache lists lessons
    Overview, IP Addressing, VPC Fundamentals, Elastic IP Addresses and NAT
    Gateways, VPC Traffic Security, Knowledge Check — matches the outline
    panel exactly)
  - Module 4: `3PNV29BBPB:001.000.005`
  - Module 5: `4DT2W42W6X:001.000.005`
  - Module 6: `TSXPJPAXYN:001.000.005`
  - Module 7: `CZZWRSJ8V9:001.000.005`
  - Module 8: `2CFAQHKVZC:001.000.005`
  - (more IDs were dumped but not all labeled — see extraction method below
    to regenerate the full map any time)

### How to extract the ID map (fast, ~2 calls, do this FIRST next time)

Load `javascript_tool`, navigate to the outline URL, then run:
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
This instantly gives every module's `id:version` + real title, no clicking
required. Wish I'd done this before ~150 calls of clicking around.

## What's broken (the actual blocker)

**Module 3 specifically will not stay loaded.** Every method tried
eventually redirects away from it:

1. **Outline-page row clicks are unreliable in general** for this
   100%-complete registration. Clicking the "Module 3: Networking-1" row
   (by coordinate, by accessibility-tree `ref`, by radio dot, via
   `View previous`/`View next` stepping) landed on a *different* module
   most of the time — 6, 7, 8, 4, 5, Course Welcome — never reliably on 3.
   The outline page appears to have some kind of stale-closure or
   resume-pointer bug: after any navigation, the page (and even the exact
   same click coordinate) resolves to whatever module was cached/"current"
   rather than what's visually at that position. This got so bad that
   clicking the Module 3 row 4 separate times in a row, from a fresh page
   load each time, deterministically landed on Module 6
   (`TSXPJPAXYN`) every single time — visiting sequential lessons within
   Module 6 (Overview → Database Services → Amazon RDS) as if a
   server-side "resume last incomplete lesson" pointer is stuck there and
   any outline interaction just resumes it, ignoring the actual click
   target.
2. **Direct full-page `navigate` to the Module 3 renderer URL
   (`module_id=ATG65NWJC7:001.000.005` + the working param set) does not
   stay** — it either bounces straight back to
   `/learn/PEXM2Q7XD5/...` (outline), or briefly shows a loading spinner
   before auto-redirecting to Module 6 without any click from us. This
   happened on ~6 separate clean attempts (fresh tabs, generous 5-8s
   waits).
3. Full-page `navigate` to a KNOWN-GOOD module (e.g. Module 7's URL)
   *does* work sometimes when done fresh, confirming the mechanism isn't
   "navigate never works" — Module 3 is specifically singled out.
4. Tried `history.pushState` + `popstate` dispatch (client-side nav without
   full reload) to Module 3's URL from inside an already-loaded module
   viewer — same outcome, bounced back to outline.
5. One wrong-version load (`3PNV29BBPB:001.000.001`, i.e. Module 4 at an
   older/stale version) rendered a raw S3 **`AccessDenied` XML error**,
   confirming this catalog has multiple content versions in play and some
   are no longer servable — it's plausible Module 3's "current" registered
   version differs from the `.005` shown in the Apollo cache, but I could
   not find a second/older version string for `ATG65NWJC7` anywhere in the
   cache to test.

## Recommendations for the next attempt

- Don't bother with outline-page clicking at all — it's unreliable for
  every module on this specific (100%-complete) registration, not just
  Module 3.
- Try logging out and back in, or find a way to reset/clear whatever
  server-side "resume" bookmark is stuck (possibly tied to
  `registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66`) — this looks like
  a genuine site bug tied to registration state, not a client cache issue
  (survived fresh tabs, hard navigation, and pushState).
- Worth trying: `Get an annual subscription to enroll` is showing on this
  course card despite it being "completed" — possibly the registration is
  in a weird half-state. Check if there's a "reset progress" or re-enroll
  option in Account settings that might unstick it.
- Worth trying: AWS support/`Support` menu on the module viewer page, in
  case this is a known reportable bug.
- If Module 3 remains unreachable, consider extracting its written lesson
  content from the AWS Skill Builder search/preview, or from the course
  description PDF/other public materials, as a fallback rather than
  burning another 100+ calls on the same redirect loop.

## Files written

None — no lesson `.md` files or `manifest.json` were written for
`source/courses/architecting-on-aws/03-networking-1/` because no lesson
content was ever actually visible on screen. The directory exists (empty)
as part of the pre-scaffolded course structure, not from this run.

## Time/cost note

This attempt used roughly 250 tool calls without success, versus ~180 for
the working Module 1 run. Nearly all of the excess was spent rediscovering
that outline clicks are unreliable in slightly different ways each time,
before finally reading the Apollo cache directly (which took 2 calls and
should be step 1 next time, even just to sanity-check IDs).
