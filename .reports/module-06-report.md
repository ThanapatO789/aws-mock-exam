# Module 6: Database Services — capture report

## Status: DONE_WITH_CONCERNS

## Lesson list (confirmed from the module viewer sidebar, 7 lessons)
1. Overview
2. Database Services
3. Amazon RDS
4. Amazon DynamoDB
5. Database Caching
6. Database Migration Tools
7. Knowledge Check

`manifest.json` written listing all 7 lessons (slug `06-database-services`, title `Module 6: Database Services`).

## Files written
- `01-overview.md` — **complete**. Full lesson content captured (intro paragraph + all 5 "you learn how to" bullets), confirmed stable and readable across 3 independent visits.
- `02-database-services.md` — **partial**. Captured the opening paragraph + "To watch the instructor video" line only. Written content that (per this course's usual pattern) normally appears below the video could not be read — see Environment issue below.
- `03-amazon-rds.md` — **partial**. Same pattern: opening paragraph + video reference captured; content below the video not reached.
- `05-database-caching.md` — **partial**. Same pattern: opening paragraph + video reference captured; content below the video not reached.
- `04-amazon-dynamodb.md` — **NOT written**. Could not reach this lesson's actual content at all (see bug below).
- `06-database-migration-tools.md` — **NOT written**. Could not reach this lesson's content at all (see bug below).
- `07-knowledge-check.md` — **NOT written**. Only reached the first question, never confirmed via submission (see below). Per the skill's instructions, a Knowledge Check answer key must be confirmed by submitting, not inferred — so no file was written rather than guess.

## Environment issue (blocking, reproducible)

Within the Module 6 renderer (`skillbuilder.aws/renderer/?module_id=TSXPJPAXYN...`), **any scroll-equivalent input on the content pane immediately kicks the session out to an unrelated module** (mouse wheel scroll, scrollbar drag, `Page_Down`, arrow-down key all reproduced this). The destination module drifts unpredictably between module IDs seen elsewhere in the course (e.g. Module 7's and Module 8's renderer IDs, and one otherwise-unidentified ID `47AZQ9RYDF`), and the browser tab/tab-group itself was also repeatedly destroyed and recreated by the automation bridge during this session, independent of page content. Because of this, no lesson's content below the first screenful (viewport ~812–800px tall) could be read.

The only reliable way to reach Module 6 at all was a same-origin JS click sequence on the outline page (`skillbuilder.aws/learn/...`) — clicking the "Module 6: Database Services" outline radio, then its "Review" button — executed in a single `javascript_exec` call to beat a background instability window of roughly 1–3 seconds. A single follow-up click on a left-sidebar lesson link (no scrolling) usually held; a second click in the same window usually did not.

**A second, separate, reproducible bug in the course itself**: clicking the "Amazon DynamoDB" sidebar entry does not load the DynamoDB lesson — it consistently loads the **Knowledge Check** lesson content instead (reproduced twice). Clicking "Database Migration Tools" consistently routes to a different, unidentified module entirely. These read as genuine content-routing bugs in this course build, not just automation flakiness, since the same wrong destination reproduced across independent attempts.

## Knowledge Check — partial, unconfirmed

Reached lesson 7 of 7 twice (both times via the DynamoDB-link bug above, not deliberately). Only the first question was visible before the environment kicked us out again:

**Q:** What is a benefit of using Amazon RDS in a Multi-AZ configuration?
- It delivers two live copies of the database running concurrently.
- It provides automatic failover across Availability Zones.
- It provides automatic cross-Region replication.
- It eliminates the need for read replicas.

No answer was confirmed as correct (a radio was clicked to test interaction, but the page drifted away before any submit/feedback UI could be reached). Remaining questions (if more than one exists) were never seen. Per the skill's rules, this was **not** written up as a Knowledge Check file since the answer key must come from a confirmed submission.

## Recommendation

Retry this module in a fresh browser session/profile — the instability (tab-group churn, mid-script "Inspected target navigated or closed" errors, and the scroll-triggers-navigation behavior) looked at least partly like automation/CDP-bridge flakiness rather than pure page logic, so a clean environment may behave better. If the scroll-triggers-navigation behavior reproduces again, try: a genuinely tall browser window set *before* first entering the renderer (a mid-session `resize_window` did not help), or driving the course from a non-completed account state (this course was already 100% complete for the signed-in user, which may be related to the odd auto-navigation behavior).
