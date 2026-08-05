# Module 11: Serverless — capture report

module_id used: `2NPQV77GBQ:001.000.005`
Renderer URL (no referrer): `https://skillbuilder.aws/renderer/?module_id=2NPQV77GBQ%3A001.000.005&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&navigation=digital`

Discovered via Apollo-cache extraction on the outline page (`https://skillbuilder.aws/learn/PEXM2Q7XD5/digital-classroom-architecting-on-aws/7K1SN4ADEW`), filtered for `/module 1[0-2]|serverless/i`. Took 2 fresh-tab attempts before the renderer held (first attempt got stuck on the "Your content is loading." screen for ~20s and was abandoned; second fresh tab loaded cleanly).

Sidebar confirmed 9 lessons: Overview, What is Serverless?, Amazon API Gateway, Amazon SQS, Amazon SNS, Amazon Kinesis, AWS Step Functions, Tech Talk, Knowledge Check.

## Extraction method

Used `document.getElementById('renderer_iframe').contentDocument.body.innerText` via `javascript_tool` instead of screenshots — worked reliably (confirmed same-origin for this module). Visual scrolling via `computer scroll` did not move the page (scroll target was a nested `.page-wrap` div, not the window); worked around this by reading/slicing `innerText` directly and, for the Knowledge Check lazy content, by scrolling `.page-wrap.scrollTop` via JS.

Accordions and tabs were expanded by finding leaf DOM elements with matching `textContent` inside the iframe and calling `.click()` on them (not via on-screen coordinate clicks), which was more reliable given concurrent-session iframe state churn. Accordion groups behaved as single-open toggles in a few cases (SQS "Visibility timeout"/"Polling type", Step Functions "Standard/Express workflows") — each item was clicked individually and re-checked until its expanded text was confirmed present.

## Per-lesson notes

1. **Overview** — short intro + learning objectives list. No accordions/hotspots.
2. **What is Serverless?** — intro + advantages list. One "numbered hotspots" prompt referenced but per skill guidance these are decorative; not clicked (skipped per skill's established finding that hotspot icons rarely reveal extra text).
3. **Amazon API Gateway** — intro, example flow (S3 → API Gateway → Lambda → DynamoDB), CloudWatch metrics list. No accordions.
4. **Amazon SQS** — intro, producer/consumer example, 3 benefit accordions (Loose coupling / Absorbs spikes / Failure tolerance) — all expanded and captured. Standard vs FIFO Queues tab component — both tabs' content captured (had to click the actual `<button class="blocks-tabs__header-item">` element; visible label is uppercase via CSS but real textContent is "Standard queues"/"FIFO Queues"). Visibility timeout / Polling type accordions — both expanded and captured. "Amazon SQS use cases" hotspot section — not expanded (no hotspot-class elements found in DOM; skipped per skill guidance).
5. **Amazon SNS** — intro, characteristics list, fan-out (SNS→multiple SQS) example, ownership/subscription-confirmation note. Two hotspot sections ("Use cases for Amazon SNS", "Comparing Amazon SNS and Amazon SQS") were not expanded — no hotspot-class elements found; consistent with skill's finding that these rarely add content beyond visible labels.
6. **Amazon Kinesis** — intro, Kinesis Data Streams overview (shards, throughput), Kinesis Data Firehose overview. Two "numbered markers" hotspot prompts referenced but not expanded (same reasoning as above).
7. **AWS Step Functions** — intro, state machine explanation (vending-machine analogy), state types list, Standard vs Express workflow accordions (both expanded and captured), example workflow (API Gateway → Step Functions → DynamoDB).
8. **Tech Talk** — video-only lesson, short intro text, no additional body content beyond the video prompt (consistent with other Tech Talk lessons in this course).
9. **Knowledge Check** — 3 questions total. Quiz was already in a "100% COMPLETE / Incorrect" bookmarked state from prior activity; per skill instructions, clicked "TAKE AGAIN" on all 3, selected the answer indicated by the embedded video-transcript walkthrough (a second instructor narrates the correct answer for each question), and clicked SUBMIT. All 3 confirmed "Correct" by the live UI (`Correctly selected` / `Correct` shown in DOM) before recording the answer key:
   - Q1: Standard queue
   - Q2: "Long polling reduces the cost of using Amazon SQS by reducing the number of empty responses and false empty responses."
   - Q3: "Amazon SNS can push messages to multiple subscribers."

## Concerns

- None of the lessons appeared truncated or unreachable — all 9 lessons were fully read via `innerText` extraction (cross-checked lengths/offsets to make sure no mid-sentence cutoffs were missed).
- Several concurrent agents were clearly active against the same course/registration during this run (tab list constantly showed other modules' renderer tabs appearing/disappearing); despite the shared "resume bookmark" bug described in the skill, my own tab held on the correct module_id URL for the whole session once past the first stuck-loading attempt.
- Hotspot sections in lessons 2, 4, 5, and 6 were not clicked individually (no `[class*="hotspot"]` elements were found in the DOM at all, unlike accordions/tabs which used discoverable classes) — consistent with the skill's guidance that these are decorative, but noting it explicitly since it affects lessons 2, 4, 5, 6.

## Files written

- `source/courses/architecting-on-aws/11-serverless/manifest.json`
- `source/courses/architecting-on-aws/11-serverless/01-overview.md`
- `source/courses/architecting-on-aws/11-serverless/02-what-is-serverless.md`
- `source/courses/architecting-on-aws/11-serverless/03-amazon-api-gateway.md`
- `source/courses/architecting-on-aws/11-serverless/04-amazon-sqs.md`
- `source/courses/architecting-on-aws/11-serverless/05-amazon-sns.md`
- `source/courses/architecting-on-aws/11-serverless/06-amazon-kinesis.md`
- `source/courses/architecting-on-aws/11-serverless/07-aws-step-functions.md`
- `source/courses/architecting-on-aws/11-serverless/08-tech-talk.md`
- `source/courses/architecting-on-aws/11-serverless/09-knowledge-check.md`
