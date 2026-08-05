# Module 6: Database Services — retry capture report

## Environment conditions

This run confirmed the redirect-loop bug described in the skill, but at much higher severity than
"solo" runs: 6+ other agents were navigating renderer URLs in the *same shared tab group* and (more
importantly) the *same `registration_id`* concurrently. Because the SCORM "resume bookmark" lives
server-side per registration, every other agent's lesson change bounced this session's tab to
whatever module/lesson that agent had just landed on — independent of anything this agent did.
Confirmed once even a read-only `innerText` query (no click) triggered a bounce mid-script.

Tabs were also being closed/created outside this agent's control (tab count and IDs shifted
between almost every call), and the whole MCP tab group was destroyed and had to be recreated once.

Net effect: successful reads happened in short, unpredictable windows right after a fresh
`navigate` to the trimmed (`referrer`-stripped) URL. Some navigations landed cleanly and stayed for
7+ consecutive read calls; others bounced within 1 request. No amount of retrying "fixed" this —
it was a function of what other concurrent agents were doing at that instant, not of this agent's
technique. `browser_batch` reduced round-trip exposure and materially helped hit rate.

Additionally: clicking the **SUBMIT** button on the Knowledge Check consistently triggered an
immediate bounce (confirmed twice), which is consistent with SUBMIT firing a SCORM interaction
write to the shared registration that itself perturbs the shared bookmark. This made getting an
authoritative Knowledge Check answer key infeasible in this run.

## Per-lesson outcome

1. **Overview** — confirmed complete and accurate against a fresh capture (unchanged from prior
   partial run).
2. **Database Services** — substantially expanded (AWS database services intro, relational vs
   non-relational explanation, full Relational-vs-NoSQL comparison table, managed/unmanaged
   services, wrap-up). One paragraph body ("Non-relational or NoSQL databases" detail text) could
   not be captured before a bounce; noted explicitly as a gap in the file.
3. **Amazon RDS** — could not be improved this run; every navigate+click attempt at this lesson
   bounced before content could be read. Left as the prior partial file (intro paragraph only,
   with existing honest gap note).
4. **Amazon DynamoDB** — NEW, substantial capture: DynamoDB overview, tables/primary
   keys/secondary indexes (simple vs composite key), capacity & scaling, ON-DEMAND capacity mode,
   consistency options (partial), global tables (full). Gaps noted in-file: PROVISIONED tab detail,
   full "strongly consistent reads" accordion body, and the tables/items/attributes hotspot detail.
5. **Database Caching** — could not be improved this run; every attempt at this lesson bounced
   before content could be read. Left as the prior partial file (intro paragraph only, with
   existing honest gap note).
6. **Database Migration Tools** — NEW, complete capture: AWS DMS (full) and AWS Schema Conversion
   Tool (full), including the migration constraints (no on-prem-to-on-prem) and SCT's code-scanning
   / Redshift migration capabilities.
7. **Knowledge Check** — NEW: all 4 questions and all answer choices captured verbatim from the
   live page. Could NOT confirm the correct answer for any question — SUBMIT reliably triggered an
   immediate redirect bounce before the correctness feedback could be read, across multiple clean
   attempts. Per the skill's explicit instruction not to substitute general knowledge for content
   that could not actually be verified, the file marks all four questions as unconfirmed rather
   than guessing.

## Files written

- `source/courses/architecting-on-aws/06-database-services/01-overview.md` (unchanged, verified)
- `source/courses/architecting-on-aws/06-database-services/02-database-services.md` (expanded)
- `source/courses/architecting-on-aws/06-database-services/03-amazon-rds.md` (unchanged, still partial)
- `source/courses/architecting-on-aws/06-database-services/04-amazon-dynamodb.md` (new)
- `source/courses/architecting-on-aws/06-database-services/05-database-caching.md` (unchanged, still partial)
- `source/courses/architecting-on-aws/06-database-services/06-database-migration-tools.md` (new)
- `source/courses/architecting-on-aws/06-database-services/07-knowledge-check.md` (new, answers unconfirmed)
- `source/courses/architecting-on-aws/06-database-services/manifest.json` (already correct, no change needed)

## Recommendation for a future retry

Lessons 3 (Amazon RDS) and 5 (Database Caching) and the Knowledge Check answer key are the
remaining gaps. Given that the SUBMIT-triggers-bounce behavior looks structural (not just a
concurrency artifact), a clean single-agent run — with no other agents hitting the same
`registration_id` at the same time — is recommended before re-attempting, especially for the
Knowledge Check answer key.
