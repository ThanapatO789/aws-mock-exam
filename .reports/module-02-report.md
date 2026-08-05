# Module 2: Account Security — capture report

## Access notes (important for future runs)
- The course session was NOT authenticated on first load; had to click "Sign in" in the top-right and wait through the redirect (skill doc's assumption held true once triggered manually).
- **Severe navigation instability was encountered** on the outline page (`/learn/...`) and is worth documenting for next time:
  - The outline page has an aggressive "resume last activity" behavior that auto-navigates away (to whatever module/lesson was last visited, in this session Module 6) within ~1-3 seconds of load, or immediately after clicking a sidebar item's Review button. This made outline-based navigation to Module 2 fail dozens of times (landed on Module 4/6/7/8/Course-Welcome instead).
  - **Fix found:** navigate directly to the renderer URL with the `referrer` query param stripped, e.g.
    `https://skillbuilder.aws/renderer/?module_id=<CODE>:001.000.005&product_id=7K1SN4ADEW:001.001.006&registration_id=<reg>&navigation=digital`
    (no `referrer=...` param). With referrer present, clicking any lesson in the module sidebar bounced back to the outline and then auto-redirected to Module 6. Without it, in-module lesson navigation worked normally and stayed put.
  - Module 2's module_id was discovered to be `47AZQ9RYDF` (activity slug `http://dc-arch-on-aws-m2_account_security`). Other module IDs discovered along the way: Module 4 = `3PNV29BBPB`, Module 6 = `TSXPJPAXYN`, Module 7 = `CZZWRSJ8V9`, Module 8 = `2CFAQHKVZC`, Course Welcome = `7XNU5N13DC`.
  - Occasional screenshot/zoom-glitch (viewport rendered smaller than the screenshot canvas, coordinates mismatched) happened once; fixed by closing the tab and opening a fresh one, matching the skill doc's existing guidance.
- This all cost a large number of tool calls (~150+) before reaching stable navigation. Recommend adding the "strip referrer param" trick to the skill doc.

## Lessons captured (6 total)

1. **Overview** — short: intro paragraph, 3 bullet objectives, video. Fully captured.
2. **Principals and Identities** — long lesson: root user, IAM intro, Authentication/Authorization accordion (both expanded), IAM users, IAM policies, IAM roles + AssumeRole diagram, 3-hotspot "Assuming a role" diagram (all 3 clicked), IAM user access (2 tabs, both read), AWS CLI section. Fully captured.
3. **Security Policies** — long lesson: policy types overview, "Security policy categories" diagram, 2 flip-cards (both flipped), 5-category accordion (Identity-based / Resource-based / IAM permissions boundaries / SCPs / ACLs — all 5 expanded), Defense in depth, Policy elements table, "Using an identity-based policy" JSON with 5 hotspots (all 5 clicked), "Using a resource-based policy" JSON with 2 hotspots (both clicked), explicit allow/deny examples, "How IAM policies are evaluated" flowchart + Venn diagram. Fully captured.
4. **Managing Multiple Accounts** — reasons-to-use-multiple-accounts diagram with 5 hotspots (all 5 clicked), AWS Organizations overview + key features, Without/With Organizations tabs (both read), SCP diagram, "How IAM policies interact with SCPs" 3-hotspot Venn diagram (all 3 clicked). Fully captured.
5. **Tech Talk** — video only, no accompanying text (consistent with skill doc's expectation — narration duplicates written content elsewhere, and here there simply wasn't separate written content, only the video itself).
6. **Knowledge Check** — all 5 questions answered live in-browser and submitted; every answer confirmed "Correct" by the system before moving to the next question. Answer key captured verbatim in the lesson file.

## Concerns
- None regarding content completeness — all accordions, hotspots, tabs, and flip-cards were located and expanded; no content appears to have been missed.
- The navigation instability described above is a process risk for future modules and should be handled with the referrer-stripping trick from the start to save time.
