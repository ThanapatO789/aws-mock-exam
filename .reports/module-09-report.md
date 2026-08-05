# Module 9: Containers — Capture Report

## Discovery
- Ran concurrently with several other module-reading agents on the same course/registration; outline page and renderer tabs redirected/closed themselves repeatedly (classic resume-bookmark bug), took ~6 fresh-tab attempts before one held.
- Apollo-cache extraction gave `module_id: DDNFA6ARWF`, but with version `001.000.005` — that version returned AccessDenied. Re-queried the cache and found the actual live entry was `DDNFA6ARWF:001.000.006`. Using the `.006` version worked and held (title "Module 9: Containers").
- No `&referrer=` param was used at any point, per skill guidance.

## Sidebar confirmed
Overview, Microservices, Containers, Container Services, Tech Talk, Knowledge Check (6 lessons total).

## Per-lesson coverage
1. **Overview** — short intro paragraph + module objectives. No accordions/hotspots.
2. **Microservices** — loosely coupled architecture + microservices definition + monolith-to-microservices refactor example (Lambda/EC2/containers). No accordions/hotspots.
3. **Containers** — container definition, containers+microservices section, "Levels of abstraction and virtualization" (3-hotspot graphic: Bare metal servers / Virtual machines / Containers — all 3 clicked and captured), "Containers on AWS" (2-tab component: EC2 instances / orchestration tool — both tabs captured).
4. **Container Services** — Amazon ECR, Kubernetes intro, Amazon EKS, Amazon ECS, 4-item accordion under ECS features (Service discovery, AWS integrations, Flexible hosting options, Compatibility with common development workflows — all 4 expanded and captured), AWS Fargate.
5. **Tech Talk** — short closing transcript only (video content, no extra written detail beyond transcript).
6. **Knowledge Check** — 4 questions, answered live in-browser and confirmed correct after submit:
   - Microservices characteristics (select 2): Loosely coupled + Autonomous and independent
   - Container characteristics (select 2): Portable and scalable + Repeatable
   - ECS containers organized in: A cluster
   - Why Fargate over EC2: To avoid manual infrastructure updates

## Concerns
- None outstanding. All hotspot/accordion/tab interactive content was expanded and captured (this course's hotspots, unlike the general skill note, did contain real substantive text — captured all of it).
- Scrolling inside the renderer iframe required directly setting `.page-wrap` element's `scrollTop` via JS; mouse-wheel `scroll` actions on the outer page did not propagate into the iframe content reliably.

## Files written
- `source/courses/architecting-on-aws/09-containers/01-overview.md`
- `source/courses/architecting-on-aws/09-containers/02-microservices.md`
- `source/courses/architecting-on-aws/09-containers/03-containers.md`
- `source/courses/architecting-on-aws/09-containers/04-container-services.md`
- `source/courses/architecting-on-aws/09-containers/05-tech-talk.md`
- `source/courses/architecting-on-aws/09-containers/06-knowledge-check.md`
- `source/courses/architecting-on-aws/09-containers/manifest.json`

No git commit performed (per instructions).
