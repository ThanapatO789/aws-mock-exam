# AWS Technical Essentials — Module 4: AWS Storage — Retry Capture Report

## Setup
- Course: AWS Technical Essentials, Part 2 registration (shares `registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b` with Part 1 — confirmed by prior report).
- Renderer URL used (no `referrer` param): `https://skillbuilder.aws/renderer/?module_id=K3WV65M927%3A001.001.001&product_id=N7Q3SXQCDY%3A001.005.004&registration_id=2a587fad-5ce1-5539-999a-7c736d0f0f2b&navigation=digital`
- Ran solo, no contention this time. First fresh-tab load bounced to a stale bookmark ("Module 5 Knowledge Check"), but clicking the target lesson directly in the sidebar (without re-navigating) landed correctly and stayed correct for the rest of the session — no further redirect-loop issues.
- Used the JS-extraction method (`document.getElementById('renderer_iframe').contentDocument` → nested `#content-frame` iframe → `document.body.innerText`), which worked reliably. Screenshots were not needed at all this run.
- **Confirmed the DOM-contamination bug** described in the task: after several lesson navigations, multiple stale `main.lesson-main` elements accumulated in the DOM (up to 5 by the last lesson) — old lessons' content is not unmounted. Fixed by always scoping queries/clicks to `document.querySelectorAll('main.lesson-main')[0]` (the first one is always the live/current lesson).
- Single-open accordions: clicking a new accordion item auto-closes the previously open one, so each accordion's text was captured immediately after its own click rather than batch-clicking then reading.
- A few `javascript_exec` calls hit a 45s CDP timeout ("renderer may be frozen") but the underlying click/action had actually already succeeded each time — verified by re-querying state afterward. No actual page freeze occurred.

## Lessons captured

1. **02 — File Storage with Amazon EFS and Amazon FSx**: Full lesson text plus all 4 Amazon FSx accordions expanded (NetApp ONTAP, OpenZFS, Windows File Server, Lustre).
2. **03 — Block Storage with Amazon EC2 Instance Store and Amazon EBS**: Full lesson text, both scaling-method tabs (Increase Volume Size / Attach Multiple Volumes), all 4 EBS use-case accordions, and both SSD/HDD volume-type comparison tables (all sub-columns: gp3/gp2/io2 Block Express/io2/io1, st1/sc1).
3. **04 — Object Storage with Amazon S3**: Full lesson text — buckets, bucket naming rules, object key names, 6 use-case accordions, IAM/bucket policies, encryption, full 8-row storage class table (Standard through S3 on Outposts), versioning (including all 3 versioning-state accordions), and lifecycle management. This was the longest lesson (~15.4K chars of scoped text).
4. **05 — Choosing the Right Storage Service**: Full comparison of instance store / EBS / S3 / EFS / FSx with their "key features" bullet lists and the FSx file-system table. Only accordion present was "Transcript" (skipped per skill rule).
5. **06 — Demonstration: Creating an Amazon S3 Bucket**: Genuinely short — intro paragraph + video only, no additional written body content beyond the Transcript block (skipped). Not padded.
6. **07 — Module 4 Knowledge Check**: 3 questions. Notably, on first load these already showed "Incorrect" feedback with explanation text visible — apparently a leftover attempt from earlier account activity (unrelated to this session). Used "TAKE AGAIN" to reset all 3, then selected the correct option per the explanation text and submitted live — all 3 confirmed "Correct" via fresh live submission:
   - Q1: "Object storage for media hosting"
   - Q2: "Configure Amazon CloudFront to deliver the content in the S3 bucket."
   - Q3: "Amazon Elastic Block Store (Amazon EBS)"

## Files written
- `source/courses/aws-technical-essentials/04-aws-storage/02-file-storage-with-amazon-efs-and-amazon-fsx.md`
- `source/courses/aws-technical-essentials/04-aws-storage/03-block-storage-with-amazon-ec2-instance-store-and-amazon-ebs.md`
- `source/courses/aws-technical-essentials/04-aws-storage/04-object-storage-with-amazon-s3.md`
- `source/courses/aws-technical-essentials/04-aws-storage/05-choosing-the-right-storage-service.md`
- `source/courses/aws-technical-essentials/04-aws-storage/06-demonstration-creating-an-amazon-s3-bucket.md`
- `source/courses/aws-technical-essentials/04-aws-storage/07-module-4-knowledge-check.md`
- `manifest.json` unchanged (already listed all 7 lessons correctly with matching slugs).
- Lesson 1 (`01-storage-types.md`) untouched, as instructed.

## Concerns
- None blocking. Module 4 is now fully captured (all 7 lessons).
- Minor note for future agents: the "already Incorrect" pre-existing Knowledge Check state suggests some earlier, unrelated interaction touched this quiz — worth being aware other modules' quizzes might show similar leftover state; always use TAKE AGAIN and submit fresh rather than trusting a pre-existing "Incorrect"/"Correct" banner without re-verifying via a live submission.
