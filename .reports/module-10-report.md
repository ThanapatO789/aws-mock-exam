# Module 10: Networking-2 — capture report

module_id discovered via Apollo cache: `R4JPEQMVCS:001.000.005`
Renderer URL used (no `referrer` param):
`https://skillbuilder.aws/renderer/?module_id=R4JPEQMVCS%3A001.000.005&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&navigation=digital`

Sidebar lesson list confirmed in-app (7 lessons): Overview, VPC Endpoints, VPC Peering, Hybrid Networking, AWS Transit Gateway, Tech Talk, Knowledge Check.

Course was under heavy concurrent load (multiple sibling agents navigating the same registration simultaneously — tabs kept bouncing to other modules' module_ids). Needed ~4 fresh-tab attempts before the target module URL held. Once loaded, in-module lesson navigation via the sidebar was stable (no further redirect-loop issues within the module itself).

Extraction method: `document.getElementById('renderer_iframe').contentDocument.body.innerText` via `javascript_tool`, pulled in ~1900-char slices per lesson (this worked well — no need to fall back to screenshot-only reading).

## Per-lesson coverage

1. **Overview** — short intro + 4 module learning objectives + video (1:03). Fully captured, nothing hidden.
2. **VPC Endpoints** — video (5:09) + full text on gateway vs. interface endpoints, including the two flip-cards ("Choose each logo to learn more") which were captured directly from the page's innerText (flip-card back content was already present in the DOM text, no separate click needed).
3. **VPC Peering** — video (4:25) + one-to-one relationship, limits/rules, benefits, shared-services example, inter-Region peering, full-mesh peering (nontransitive nature). Fully captured.
4. **Hybrid Networking** — video (5:01) + AWS Site-to-Site VPN (virtual private gateway, customer gateway, static/dynamic routing) + AWS Direct Connect (cross-connect, LOA-CFA). Contained a 3-item accordion ("Capacity" / "Port hours" / "Data Transfer out (DTO)") — expanded all three individually via click and captured each panel's text (visually confirmed via screenshot).
5. **AWS Transit Gateway** — video (4:22) + hub-and-spoke model description, attachments (VPC/VPN/Direct Connect gateway/Transit Gateway Connect/Transit Gateway peering) and route tables (default route table, dynamic/static routes) via a 2-tab widget (ATTACHMENTS/ROUTE TABLES) — both tabs' text were present in the DOM (`textContent`) even though only one was visually active, so both were captured. Transit gateway cross-account setup via AWS Resource Access Manager also captured.
6. **Tech Talk** — video-only lesson (2:22), no additional written body content besides the closing sentence pointing to the Knowledge Check. Captured as-is (short by design, not truncated).
7. **Knowledge Check** — 3 questions. Answered live in-browser and submitted (not inferred from memory) — all three came back "Correct":
   - Q1: "What is a connection to a transit gateway called?" → **Attachment**
   - Q2: "What are the components of an AWS Site-to-Site VPN connection? (Select TWO.)" → **Customer gateway device**, **Virtual private gateway**
   - Q3: "What is TRUE about VPC peering connections? (Select TWO.)" → **Connections are one-to-one.**, **Connections can span accounts.**

## Files written

- `source/courses/architecting-on-aws/10-networking-2/01-overview.md`
- `source/courses/architecting-on-aws/10-networking-2/02-vpc-endpoints.md`
- `source/courses/architecting-on-aws/10-networking-2/03-vpc-peering.md`
- `source/courses/architecting-on-aws/10-networking-2/04-hybrid-networking.md`
- `source/courses/architecting-on-aws/10-networking-2/05-aws-transit-gateway.md`
- `source/courses/architecting-on-aws/10-networking-2/06-tech-talk.md`
- `source/courses/architecting-on-aws/10-networking-2/07-knowledge-check.md`
- `source/courses/architecting-on-aws/10-networking-2/manifest.json`

## Concerns

- None outstanding. All 7 lessons read in full via innerText extraction (no screenshot-only fallback needed for body text). One accordion (Direct Connect pricing) and one tab widget (Transit Gateway attachments/route tables) both fully expanded/captured.
- My own MCP tab kept getting caught up in the shared registration's redirect churn caused by sibling agents (visible via other tabs' module_ids flashing in the tab list on nearly every call) — did not affect content accuracy once the correct module finally loaded, only added a few retries at the start.
- No git commit performed, per instructions.
