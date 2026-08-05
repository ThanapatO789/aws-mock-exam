# Module 2: AWS Compute — Capture Report (retry, solo run)

## Status: DONE

Navigated directly to the Part 1 renderer URL (module_id W9A4VFJXSF:001.000.001), which
resumed on the Module 1 Knowledge Check bookmark as expected. Per the skill, collapsed
"Module 1" in the sidebar (click on section header) to reveal Module 2's lesson list, then
navigated lesson-by-lesson by clicking each `<a>` inside the sidebar `<li>` via JS
(`li.querySelector('a').click()`), since URL had no `&referrer=` param and stayed on the
correct module throughout — no redirect-loop bug encountered this run.

## Content extraction method

- `document.getElementById('renderer_iframe').contentDocument.body.innerText` returned
  only the sidebar navigation text, not lesson content — the actual lesson content lives in
  a **second, nested iframe** inside the renderer iframe. Found it by recursively descending
  into `iframe.contentDocument` looking for a `document` whose `body.innerText.length > 100`.
- Confirmed DOM-contamination bug described in the task: after some lesson transitions,
  `document.querySelectorAll('main.lesson-main')` returned 2 elements — the current lesson's
  content plus a stale leftover `<main>` from the previous lesson. Fixed by always taking
  `document.querySelectorAll('main.lesson-main')[0]` (the first/current one) and verifying
  its opening text matched the expected lesson title before extracting.
- Accordion content (`.blocks-accordion__content`) was present in the DOM and readable via
  `.innerText` even while visually collapsed — did not need to click any accordion open.
- Tool output per JS call truncates around ~1000 characters; extracted long lesson bodies in
  overlapping `.slice()` chunks and stitched them together, verifying no gaps at each seam.

## Known site glitch encountered (new, worth flagging for future runs)

Starting around lesson 5 (Container Services) and continuing through the rest of the module,
clicking a sidebar lesson `<a>` intermittently triggered a runaway tab-spawning bug: the
browser opened many new tabs pointing at an unrelated course ("AWS Well-Architected
Foundations", product_id RCY5NFM8R9, a different registration_id `dcab5ee7-...`) and its
individual module renderer/PDF-transcript URLs. This was **not caused by our own
`&referrer=` URL** (main tab never had one) — looked like a stray `target="_blank"` /
`window.open` handler on the page itself firing repeatedly, unrelated to the redirect-loop
bug described in the skill. It never affected the main working tab's content or navigation
state; only cost extra `tabs_close_mcp` calls to clean up (closed in batches via
`browser_batch`). All stray tabs were fully closed by the end of the run.

## Lessons captured (10 files + manifest.json)

1. **Compute as a Service** — 3 compute categories (VM/container/serverless), servers,
   hypervisor, Amazon EC2, AMI relationship. No accordions besides video transcript.
2. **Getting Started with Amazon EC2** — EC2 basics, AMI concept + 5-way AMI source
   accordion (Quick Start/Marketplace/My AMIs/Community/Custom), instance types & naming
   (c5n.xlarge breakdown), EC2 instance families accordion table (6 families, captured in
   full), default VPC, high-availability architecture guidance.
3. **Amazon EC2 Instance Lifecycle** — 5 lifecycle states, stop vs stop-hibernate, and the
   5-way pricing accordion (On-Demand/Spot/Savings Plans/Reserved/Dedicated Hosts), captured
   in full.
4. **Demonstration: Launching the Employee Directory Application on Amazon EC2** — pure
   video-demo lesson; only content was a 7285-char accordion transcript walking through the
   EC2 console launch flow (AMI, key pair, network, IAM instance profile, user data script).
   Summarized narratively in Thai rather than reproduced verbatim.
5. **Container Services** — Docker containerization, VM vs container comparison, Amazon ECS
   (task definitions, JSON example), Amazon EKS/Kubernetes, ECS vs EKS terminology
   differences.
6. **Introduction to Serverless** — undifferentiated heavy lifting, "go serverless" 4
   properties, shared-responsibility-model shift, convenience/control spectrum. Note: this
   lesson's transcript accordion was NOT included in `main.lesson-main.innerText` (unlike
   other lessons) — had to query the accordion element directly and merge separately.
7. **Serverless with AWS Fargate** — Fargate as serverless compute engine for ECS/EKS,
   workflow (build image → ECR → define task/pod → run), pricing flexibility, use cases.
8. **Serverless with AWS Lambda** — Lambda function model, 7-part accordion (Function,
   Trigger, Event, Application Environment, Deployment package, Runtime, Lambda function
   handler — all captured), billing granularity (1ms rounding), Werner Vogels quote.
9. **Choosing the Right Compute Service** — video-only "game show" format lesson (title +
   transcript accordion only, no other written body); 3 use-case scenarios summarized
   (Lambda for infrequent inventory updates via S3 PutEvent trigger; EC2 for lift-and-shift
   migration; ECS/EKS for new microservices build).
10. **Module 2 Knowledge Check** — genuinely only 2 questions (confirmed by scrolling to the
    "23 - Introduction to Networking" next-module link with nothing further below). Both
    answered and submitted live in-browser:
    - Q1 "What does an Amazon EC2 instance type indicate?" → **Instance family and instance
      size** (Correct)
    - Q2 "Which of the following is true about serverless?" → **You never pay for idle
      resources.** (Correct)

## Concerns

- None blocking. The only anomaly was the unrelated-course tab-spawning glitch (see above),
  fully contained and cleaned up; did not corrupt any extracted content (each extraction was
  verified against the current lesson's title before use).
- Lesson 6's accordion-not-in-main-innerText behavior differed from every other lesson in
  the module — flagging in case a future agent hits confusing short `main.innerText` totals
  again; the fix is to query `.blocks-accordion__content` directly rather than assuming it's
  folded into `main.lesson-main.innerText`.

All Chrome tabs opened during this session (main + strays) were closed before finishing.
