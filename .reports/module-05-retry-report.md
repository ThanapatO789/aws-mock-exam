# Module 5: Storage — retry capture report

## Status: DONE

This was a retry using the fixed deep-link URL (no `&referrer=...` param). Unlike the
original ~20+ attempt failure, the module loaded cleanly on the first fresh-tab
navigation and never redirect-looped. All 9 lessons were captured in one continuous
session.

## Navigation approach

- Used a single fresh tab navigated directly to the given renderer URL.
- One visual/zoom glitch occurred after a `computer.scroll` call mid-way through
  Lesson 3 (Amazon S3) — the whole iframe rendered zoomed out, matching the
  known "occasional page zoom/scale glitch" in the skill notes. Fixed per the
  skill: closed the tab, opened a fresh one, re-navigated to the same deep
  link (landed back on the last-viewed lesson thanks to SCORM bookmark),
  and continued.
- After the glitch, switched lesson-to-lesson navigation from pixel-coordinate
  sidebar clicks to JS-driven clicks on
  `doc.querySelectorAll('a.nav-sidebar__outline-item__link')` matched by
  `textContent.trim()`. This avoided all further coordinate/zoom-drift issues
  for the remaining lessons.
- Content extraction used `renderer_iframe.contentDocument.body.innerText`
  sliced between `Lesson N of 9` markers (the app keeps prior lessons' text
  in the DOM, so naive full-body reads pick up stale content — slicing to the
  current lesson's marker range was necessary). For collapsed
  accordions/hotspots not present in `innerText`, `textContent` was used
  instead (hidden panels are present in the DOM, just not visible) — this
  worked directly for all cases except one true lazy-rendered tab component
  (see below).

## Per-lesson summary

1. **Overview** — short intro lesson, module objectives. Full text captured directly.
2. **Storage Services** — block/object/file storage comparison (EBS/S3/EFS). Full text captured.
3. **Amazon S3** — S3 basics, buckets/objects/keys. One accordion ("5 use-case categories": Backup and restore, Data lakes for analytics, Media storage and streaming, Static website, Archiving and compliance) expanded via `textContent` without needing clicks.
4. **Securing Objects** — access control, bucket policies, access points, one hotspot (server-side encryption key types: SSE-S3, SSE-KMS, SSE-C) captured via `textContent`.
5. **Storing Objects** — storage classes hotspot (Intelligent-Tiering, Glacier, Lifecycle policies) plus a nested "replicating S3 objects" accordion (4 categories) — all captured via `textContent`.
6. **Additional Amazon S3 Features** — event notifications, multipart upload, Transfer Acceleration, one accordion ("S3 cost factors": 5 categories) via `textContent`.
7. **Shared File Systems** — EFS + Amazon FSx, one 4-card flashcard set (FSx for Windows File Server, Lustre, NetApp ONTAP, OpenZFS) — flashcard backs were already present in `innerText` without clicking.
8. **Data Migration Tools** — Storage Gateway (with nested "architecture" hotspot: transfer protocols, appliance modes, storage service destinations), a 3-card Storage Gateway type flashcard set, AWS DataSync, and AWS Snow Family. The Snow Family section used a real tab component (Snowball Edge / Snowmobile) whose inactive tab content is NOT in the DOM until clicked (only case where `textContent` alone didn't work) — resolved by JS-clicking each tab button (`doc.querySelectorAll('button')` matched by text) to reveal and capture both.
9. **Knowledge Check** — 4 questions, answered and submitted live in-browser (not inferred from memory):
   - Q1 (S3 auto-copy to different Region): **Cross-Region Replication (CRR)** — Correct
   - Q2 (S3 feature to trigger action after bucket event): **Event notification** — Correct
   - Q3 (2 Linux apps, different AZs, shared file system): **Amazon EFS** — Correct
   - Q4 (Storage Gateway appliance modes, select 3): **Tape Gateway, Volume Gateway, Amazon S3 File Gateway** — Correct

All 4 questions were answered correctly on first submission (confirmed via on-screen "Correct" indicators after each submit, not inferred).

## Files written

- `source/courses/architecting-on-aws/05-storage/01-overview.md`
- `source/courses/architecting-on-aws/05-storage/02-storage-services.md`
- `source/courses/architecting-on-aws/05-storage/03-amazon-s3.md`
- `source/courses/architecting-on-aws/05-storage/04-securing-objects.md`
- `source/courses/architecting-on-aws/05-storage/05-storing-objects.md`
- `source/courses/architecting-on-aws/05-storage/06-additional-amazon-s3-features.md`
- `source/courses/architecting-on-aws/05-storage/07-shared-file-systems.md`
- `source/courses/architecting-on-aws/05-storage/08-data-migration-tools.md`
- `source/courses/architecting-on-aws/05-storage/09-knowledge-check.md`
- `source/courses/architecting-on-aws/05-storage/manifest.json`

## Concerns

- None substantive. No content was fabricated — every hidden accordion/hotspot/tab
  was either read via `textContent` (still same-DOM, same-origin) or, for the one
  true lazy-rendered tab case (Snow Family), explicitly clicked to reveal before
  reading. No lesson was skipped or padded.
- Video content was intentionally not transcribed, per the skill's guidance (written
  content below each video covers the same material).
- Tab was closed cleanly at the end; no lingering browser state.
