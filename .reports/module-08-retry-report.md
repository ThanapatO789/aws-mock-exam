# Module 8: Automation — retry capture report

## Approach
Used the fast module_id lookup provided in the task (no outline-page visit). Navigated directly to
`https://skillbuilder.aws/renderer/?module_id=2CFAQHKVZC%3A001.000.005&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&navigation=digital`
in a fresh tab (no `&referrer=`).

**Heavy tab churn observed**: because several other agents were concurrently creating/closing tabs in
the same shared MCP tab group, my own tab was involuntarily closed/lost 5-6 times in a row before one
navigation + immediate follow-up action landed inside a batch call fast enough to survive. Once a tab
survived one round-trip, it stayed stable for the rest of the run (no redirect-loop bug was ever hit —
the churn was purely tab-group contention, not the SCORM resume-bookmark bug the skill describes).
Confirmed sidebar lesson list: Overview, AWS CloudFormation, Infrastructure Management, Amazon Q
Developer, Tech Talk, Knowledge Check (6 lessons, matches expectation).

## Per-lesson notes

1. **Overview** — short intro, matches previously-captured content (module goals: automate infra
   deployment with CloudFormation, identify tools that automate deployment/manage resources).
2. **AWS CloudFormation** — IaC concept, benefits of IaC (speed/safety, reusability, documentation
   and version control, validation), and CloudFormation stack concept (single-unit create/delete,
   rollback on failure). No accordions/hotspots on this lesson.
3. **Infrastructure Management** — "choose each hotspot" graphic for 4 tools (Elastic Beanstalk, AWS
   Solutions Library, AWS CDK, AWS Systems Manager). All four tools' full body text was already
   present inline in `innerText` (consistent with skill's note that hotspot icons rarely hide extra
   text) — captured all four without needing to click.
4. **Amazon Q Developer** — longest lesson (~7.5k chars of real content). Covers SDLC hotspots: Code
   Generation, Feature Development (with a 5-step demonstration: open extension → Plan → review diff
   → Insert code → Test/BUILD SUCCESS), and Security Scan. Also covers supported IDEs/languages and
   responsible-AI notes. Text description said "five numbered hotspots" but only 3 named sections
   with substantial content appeared in the extracted text (Code Generation, Feature Development,
   Security Scan) — the "5" may refer to the 5 demo steps rather than 5 separate topic hotspots;
   no additional hidden hotspot content was found in the continuous character range fetched (0-7480).
5. **Tech Talk** — video only (10:50), no separate written transcript content beyond the standard
   wrap-up text (module recap, pointer to next module on containers).
6. **Knowledge Check** — 2 questions, both answered live and submitted for an authoritative key:
   - Q1 "What is a AWS CloudFormation stack?" → correct: "All of the provisioned resources defined
     in a CloudFormation template."
   - Q2 "Which of the following are benefits of using AWS CDK with AWS CloudFormation? (Select TWO.)"
     → correct: "Developers can use common programming languages." + "Developers can call
     preconfigured resources with proven defaults."
   Both confirmed "Correct" by the live UI after submission (note: this quiz had residual "Incorrect"
   state from the earlier partial attempt before I answered — re-answering and submitting overwrote
   it with fresh, confirmed-correct results).

## Files written
- `source/courses/architecting-on-aws/08-automation/01-overview.md` (pre-existing, left as-is — already correct)
- `source/courses/architecting-on-aws/08-automation/02-aws-cloudformation.md` (new)
- `source/courses/architecting-on-aws/08-automation/03-infrastructure-management.md` (new)
- `source/courses/architecting-on-aws/08-automation/04-amazon-q-developer.md` (new)
- `source/courses/architecting-on-aws/08-automation/05-tech-talk.md` (new)
- `source/courses/architecting-on-aws/08-automation/06-knowledge-check.md` (new)
- `source/courses/architecting-on-aws/08-automation/manifest.json` (updated to list all 6 lessons)

## Concerns
- No accordions were found needing manual expansion in this module (all content was already visible
  in `innerText`).
- The "five numbered hotspots" phrase in Amazon Q Developer's SDLC section vs. only 3 distinctly
  headed content sections found is a minor discrepancy worth a spot-check if precision matters, but
  no additional hidden content was located across the full contiguous text range examined.
- Tab-group contention from concurrent agents cost significant tool-call overhead early in the run
  (tab created and closed ~6 times before one stuck) but did not affect content accuracy — no partial
  or fabricated content was written.
