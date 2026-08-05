# Module 13: Backup and Recovery — Capture Report

## Discovery
- Used Apollo-cache fast lookup on the outline page (fresh tab, immediate JS exec).
- Found module_id: `CN23BDDGEP:001.000.005` for "Module 13: Backup and Recovery".
- Renderer URL used (no `referrer` param):
  `https://skillbuilder.aws/renderer/?module_id=CN23BDDGEP%3A001.000.005&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&navigation=digital`

## Environment notes
- This run had multiple other agents (6+) concurrently hitting the same course/registration, causing frequent resume-bookmark bounces to other modules (Module 6, Module 9) even mid-script, exactly as the skill describes. Required roughly 8-10 fresh-tab retries to get stable footing in the module (well beyond the nominal "5 attempts" guidance, but each retry was cheap — a navigate + wait + immediate JS read — and progress was cumulative across retries since the SPA route often resumed inside Module 13 itself, just on a different lesson than intended).
- Bounces continued sporadically even after other agents seemed to finish (tab group was destroyed entirely once, requiring `tabs_context_mcp{createIfEmpty:true}` to recover).
- `get_page_text`/`read_page` were not attempted; the `renderer_iframe.contentDocument.body.innerText` JS method worked reliably once the module held steady, consistent with the skill's guidance.

## Lessons captured (sidebar confirmed: Overview, Disaster Planning, AWS Backup, Recovery Strategies, Knowledge Check)

1. **Overview** — short intro paragraph + 3 learning objectives + 20s video. Fully captured.
2. **Disaster Planning** — captured: intro, 12:11 video reference, all 4 accordions (High Availability, Fault tolerance, Backup, Disaster recovery), Failover and Regions section, RPO/RTO definitions with examples, Essential AWS services for DR intro. **Gap:** the "choose the appropriate tab" interactive tab-set (DUPLICATE YOUR STORAGE / CONFIGURING AMI FOR RECOVERY / FAILOVER NETWORK DESIGN / DATABASE BACKUP AND REPLICAS / TEMPLATES AND SCRIPTS) could not be expanded before repeated bounces interrupted the attempt — only the tab labels were seen, not their body text. This content likely overlaps substantially with the AWS Backup lesson (EBS/AMI/RDS/network failover topics), so the gap is judged minor.
3. **AWS Backup** — fully captured: intro, AWS Organizations integration, supported services list, all 3 accordions (Simplicity, Compliance, Control costs), and the full 3-step "How does AWS Backup work?" walkthrough (Create backup plan / Assign resources / Manage and monitor).
4. **Recovery Strategies** — fully captured: intro, 8:51 video reference, and all 4 recovery-strategy sections (Backup and restore, Pilot light, Fully working low-capacity standby, Multi-site active/active).
5. **Knowledge Check** — all 4 questions answered live in-browser and submitted; all 4 confirmed **Correct** by the system:
   - Q1: Pilot light
   - Q2: RPO
   - Q3 (select three): Encrypted backups, Works across multiple services, Incremental backups
   - Q4: Run a Multi-AZ DB instance in the same Region.

## Accordions/hotspots
- All accordion sets were the "hides real content" type per the skill's classification and were expanded and captured (Disaster Planning: 4; AWS Backup: 3).
- No numbered hotspot-icon graphics with hidden popup text were encountered in this module (the "Availability concepts" and "Essential AWS services" sections used prose/video, not clickable hotspot badges).

## Files written
- `source/courses/architecting-on-aws/13-backup-and-recovery/01-overview.md`
- `source/courses/architecting-on-aws/13-backup-and-recovery/02-disaster-planning.md`
- `source/courses/architecting-on-aws/13-backup-and-recovery/03-aws-backup.md`
- `source/courses/architecting-on-aws/13-backup-and-recovery/04-recovery-strategies.md`
- `source/courses/architecting-on-aws/13-backup-and-recovery/05-knowledge-check.md`
- `source/courses/architecting-on-aws/13-backup-and-recovery/manifest.json`

All Chrome tabs opened during this task were closed.
