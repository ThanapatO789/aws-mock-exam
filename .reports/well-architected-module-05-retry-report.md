# Module 5 — Deep Dive on the Security Pillar — retry capture report

## Status: DONE_WITH_CONCERNS

## What happened

- Renderer for `module_id=64KFR9QKU7:001.001.003` reproducibly froze on the
  title/play screen across 2 clean fresh-tab attempts (clicking Play, and
  separately clicking a sidebar lesson, both left the content pane blank —
  matches the known Storyline-freeze pattern from the skill doc).
- Fell back to raw-data-file fetching. Package id discovered via network
  requests: `f02eeb6d-db43-4b4a-90b0-5159a322752c`.
  - `html5/data/js/data.js` — **worked** (200), gave full slide structure
    (36 slides, matches the previously-confirmed sidebar title list),
    slide IDs, `html5url` paths, and the asset library / slideMap needed to
    resolve caption files per slide.
  - `html5/data/js/<slideId>.js` (the file that normally holds the
    on-screen text objects) — **consistently 403 AccessDenied** for this
    specific package, across ~8 attempts: plain fetch, fetch from inside
    the iframe's own window (correct same-origin credentials), and
    `<script>`-tag injection into the iframe document (correct Referer).
    Verified the filename/path was exactly right (matches the `html5url`
    field in data.js, e.g. `html5/data/js/5tC7WFZTa97.js`), ruling out a
    naming-guess error. Response headers showed `x-cache: Error from
    cloudfront` (vs `Miss from cloudfront` + high `Age` for the working
    `data.js`), consistent with a genuine per-resource access restriction
    on this package rather than a naming or transient-503 issue. This is
    a departure from the skill doc's "confirmed technique" — it evidently
    does not generalize to every Storyline package's ACL configuration.
  - `story_content/<captionId>_captions.js` (WebVTT narration) — **worked**
    (200) for every slide that has narration. Used this as the primary
    content source instead.

## Content coverage

- All 36 slide titles confirmed via `data.js` (`scenes[2].slides`), matching
  the previously-known 36-item outline.
- Narration text (cleaned of VTT timestamps) successfully retrieved for 33
  of 36 slides and used to write the Thai lesson notes.
- The 3 "Question" slides (1.32, 1.33, 1.34 — Knowledge Check) have **no**
  caption/narration asset at all (interactive quiz slides never have
  narration), and the per-slide JS holding their question text/answer
  choices is the exact same 403-blocked resource type described above. So
  there was genuinely no way to recover question text or answer choices
  this session. Per the skill's explicit instruction, the knowledge-check
  file documents this limitation instead of guessing content from general
  AWS knowledge.
- On-screen-only content that might differ from narration (e.g. exact
  bullet wording, any text that appears on screen but isn't spoken) was
  not independently verifiable since the visual renderer never rendered
  and the slide-JS fallback was blocked. The narration is AWS's own
  scripted voiceover and closely mirrors on-screen text per this course's
  established pattern, but this could not be cross-checked visually this
  session.

## Files written

`source/courses/aws-well-architected-foundations/05-deep-dive-on-the-security-pillar/`
- `01-welcome-and-objectives.md` (1.1-1.2)
- `02-pillar-overview.md` (1.3-1.5)
- `03-design-principles.md` (1.6-1.7)
- `04-best-practices-overview.md` (1.8-1.9)
- `05-security-foundations.md` (1.10-1.13)
- `06-identity-and-access-management.md` (1.14-1.16)
- `07-detection.md` (1.17-1.18)
- `08-infrastructure-protection.md` (1.19-1.21)
- `09-data-protection.md` (1.22-1.25)
- `10-incident-response.md` (1.26-1.29)
- `11-application-security.md` (1.30-1.31)
- `12-knowledge-check.md` (1.32-1.34 — content unavailable, documented as such)
- `13-summary.md` (1.35-1.36)
- `manifest.json`

## Concerns / follow-ups

1. The Knowledge Check questions (1.32-1.34) have zero recovered content —
   no question text, no answer choices, no correct answers. If an
   authoritative answer key is needed, this module needs a live retry
   where the renderer actually advances past slide 1 (not achieved in
   either of the 2 clean attempts this session).
2. The raw-data-file fallback's "confirmed technique" for per-slide JS
   files did NOT work for this package — only `data.js` and
   `story_content/*_captions.js` were accessible. Future retries on this
   specific module (or others sharing this ACL behavior) should expect the
   same and go straight to captions rather than re-attempting slide JS.
3. Session had 2 other concurrent module-reading agents sharing the browser
   tab group (other modules' tabs briefly appeared and disappeared in the
   shared group — consistent with the known tab-group-leak issue). This did
   not visibly corrupt this session's data (captions/data.js content matched
   expectations throughout), but is noted per the skill's concurrency
   warning.
4. No Chrome tabs were left open — the one tab used for this module was
   closed at the end.
