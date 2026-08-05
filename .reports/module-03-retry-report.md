# Module 3: Networking-1 — Retry Capture Report

## Outcome

SUCCESS on first fresh-tab attempt using the direct deep-link URL (no `&referrer=...` param). No redirect-loop encountered at all. Landed on the module's bookmarked lesson (5 of 6, VPC Traffic Security) immediately, then navigated freely between all 6 lessons via the sidebar with zero bounce-backs.

URL used:
```
https://skillbuilder.aws/renderer/?module_id=ATG65NWJC7%3A001.000.005&product_id=7K1SN4ADEW%3A001.001.006&registration_id=5a581bee-33c7-5b2b-9af0-a7cadd272f66&navigation=digital
```

## Method

Primary content extraction was done via `javascript_tool` reading
`document.getElementById('renderer_iframe').contentDocument.body.innerText`,
sliced in ranges to work around output truncation. This was much faster and
more reliable than screenshot-based reading. Screenshots/computer clicks were
used only for: sidebar navigation clicks, expanding accordions/tabs where a
generic-selector JS click didn't fully register, and the live Knowledge Check
quiz (radio/checkbox selection + Submit).

Accordions and tabs expanded/clicked (per skill guidance — accordions do hide
real content, hotspot icons don't add anything beyond visible labels so were
not deep-clicked):
- Lesson 2 (IP Addressing): "IPv4 addresses" / "IPv6 addresses" accordion,
  "CIDR" / "Subnet Mask" tab pair.
- Lesson 3 (VPC Fundamentals): 5-tab "VPC Components" selector (Public
  Subnets, Internet Gateways, Route Tables, Private Subnets, Default VPC).
- Lesson 4 (Elastic IP Addresses and NAT Gateways): 3-tab selector (Elastic
  IP Addresses, Elastic Network Interface, NAT Gateways).
- Lesson 5 (VPC Traffic Security): 4-item accordion (Security groups,
  Default and new security groups, Custom security group rules, Security
  group chaining) — all multi-open, all captured.

## Per-lesson summary

1. **Overview** — short intro paragraph + 4-bullet "what you'll learn" list. Genuinely short, no accordions.
2. **IP Addressing** — IPv4 vs IPv6 basics, both expanded from accordion; CIDR block sizing; CIDR vs Subnet Mask tabs; AWS-supported CIDR ranges (16-28 bits network / 4-16 bits host).
3. **VPC Fundamentals** — Amazon VPC + Subnets intro with a worked 4-subnet CIDR example; all 5 VPC Components tabs captured (Public Subnets, Internet Gateways w/ NAT explanation, Route Tables, Private Subnets, Default VPC).
4. **Elastic IP Addresses and NAT Gateways** — all 3 tabs captured (Elastic IP Addresses, Elastic Network Interface, NAT Gateways); plus route-table-based private-to-internet connection steps and a multi-AZ VPC deployment example.
5. **VPC Traffic Security** — Network ACLs (stateless, rule components, default-deny catch-all rule) and Security Groups (stateful, all 4 accordion sub-topics), full Security-Group-vs-Network-ACL comparison table, and a network ACL use-case example.
6. **Knowledge Check** — 5 questions answered live in-browser and confirmed correct via the page's own "Correct"/"Correctly selected/unselected" feedback text (read through JS, not inferred): VPC single-Region (False), making a subnet public (route outbound to IGW), NAT gateway function (allows internet traffic initiated by private subnet instances), traffic filtering tool (Network ACL), default new-security-group ports (nothing inbound + everything outbound, select two). Final check: 7 "Correct" markers, 0 "Incorrect" markers in the DOM text.

## Concerns

- None. No blocking, no redirect loop, no fabricated content — every lesson's markdown was written from text actually read off the page (via innerText or screenshot-confirmed accordion/tab expansions).
- One near-miss: on the first submit pass I skipped Question 3 (NAT gateway function) by an indexing mistake with the SUBMIT buttons; caught it because the completion check showed "Please answer the question to continue" for that question, then answered and confirmed correct before finishing.

## Files written

- `source/courses/architecting-on-aws/03-networking-1/01-overview.md`
- `source/courses/architecting-on-aws/03-networking-1/02-ip-addressing.md`
- `source/courses/architecting-on-aws/03-networking-1/03-vpc-fundamentals.md`
- `source/courses/architecting-on-aws/03-networking-1/04-elastic-ip-addresses-and-nat-gateways.md`
- `source/courses/architecting-on-aws/03-networking-1/05-vpc-traffic-security.md`
- `source/courses/architecting-on-aws/03-networking-1/06-knowledge-check.md`
- `source/courses/architecting-on-aws/03-networking-1/manifest.json`

No git commit performed, per instructions.
