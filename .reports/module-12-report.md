# Module 12: Edge Services — capture report

module_id discovered via Apollo-cache method: `NAGGPPKJ29:001.000.005`
renderer URL used (no referrer param):
`https://skillbuilder.aws/renderer/?module_id=NAGGPPKJ29%3A001.000.005&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&navigation=digital`

Got in cleanly on the first navigation attempt (took ~15s to load past a "Your content is loading." interstitial, then landed mid-module on Lesson 6 due to resume-bookmark behavior — confirmed correct module from sidebar, then navigated lesson-by-lesson from Overview). Content extraction used the `document.getElementById('renderer_iframe').contentDocument.body.innerText` JS method throughout — no visual/screenshot reading was needed except to locate hotspot/accordion/tab UI elements.

Sidebar lesson list confirmed (8 lessons): Overview, Edge Fundamentals, Amazon Route 53, Amazon CloudFront, DDoS Protection, AWS Outposts, Tech Talk, Knowledge Check.

## Per-lesson notes

1. **Overview** — short intro + module objectives list. No interactive elements.
2. **Edge Fundamentals** — has a 5-hotspot infographic ("AWS infrastructure components", image itself failed to load/broken img icon but hotspot buttons still worked). Clicked all 5 via JS (`button.labeled-graphic-marker`) and read each `aria-controls` bubble element directly (innerText via full-page scrape was unreliable/empty for 2 of 5 until read via bubble id). Captured: AWS Regions, Edge locations, AWS Local Zones, AWS Snow Family. The 5th hotspot (**AWS Outposts**) had an aria-label confirming its title but its bubble content div was genuinely empty in the source (0 chars) — noted honestly in the .md rather than fabricated, since AWS Outposts is covered in full in its own lesson (#6) anyway.
3. **Amazon Route 53** — has a 2-tab component (Public/Private hosted zones, both captured) and a 7-item accordion of routing policies (Simple, Failover, Geolocation, Geoproximity, Latency, Multivalue answer, Weighted — all expanded and captured).
4. **Amazon CloudFront** — has a 2-tab component ("What AWS does" / "What you can do" for performance), both captured in full.
5. **DDoS Protection** — has a 2-item accordion ("Infrastructure layer attacks" / "Application layer attacks"), both expanded and captured. Covers AWS Shield, AWS WAF (Web ACLs, Rules, Rule groups, Rule statements, IP sets, Regex pattern sets, monitoring/logging), and AWS Firewall Manager.
6. **AWS Outposts** — short lesson, fully captured (matches content already seen mid-navigation on first load).
7. **Tech Talk** — very short closing video-summary lesson, no interactive elements.
8. **Knowledge Check** — 4 questions, all answered live and submitted via JS (checkbox/radio `.click()` + SUBMIT button clicks), all 4 came back "Correct" on the first submission. Correct answers documented in the .md, confirmed by the graded UI state (not inferred):
   - Q1 (CloudFront benefits, select 2): Increased application security + Reduced latency for access to application content
   - Q2 (DDoS protection services, select 2): AWS Shield + AWS WAF
   - Q3 (80/20 traffic split routing policy): Weighted routing
   - Q4 (Outposts servers vs. rack benefit): A smaller-sized device can be placed in your own rack

## Concerns
- None blocking. Only minor gap: the AWS Outposts hotspot bubble in lesson 2 (Edge Fundamentals) had no text content in the source itself (confirmed via DOM inspection, not a scraping failure) — documented as such in the .md rather than guessed at.
- Multiple other agents were confirmed running concurrently against the same course/registration during this session (visible via shared tab group showing other modules' renderer URLs cycling). This agent's own tab and navigation stayed isolated to Module 12 throughout with no cross-module bleed observed in the captured text.

## Files written
- `source/courses/architecting-on-aws/12-edge-services/manifest.json`
- `source/courses/architecting-on-aws/12-edge-services/01-overview.md`
- `source/courses/architecting-on-aws/12-edge-services/02-edge-fundamentals.md`
- `source/courses/architecting-on-aws/12-edge-services/03-amazon-route-53.md`
- `source/courses/architecting-on-aws/12-edge-services/04-amazon-cloudfront.md`
- `source/courses/architecting-on-aws/12-edge-services/05-ddos-protection.md`
- `source/courses/architecting-on-aws/12-edge-services/06-aws-outposts.md`
- `source/courses/architecting-on-aws/12-edge-services/07-tech-talk.md`
- `source/courses/architecting-on-aws/12-edge-services/08-knowledge-check.md`
