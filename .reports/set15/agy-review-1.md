## Errors

None.

## Weak spots

- 913: `โดยไม่ต้องสร้าง server หรือเขียนโค้ดรวมข้อมูลเอง` / `โดยไม่ต้องเขียนโค้ด aggregate` — overstates how automatic AppSync pipeline resolvers are; you avoid managing Lambda/compute infrastructure, but you still write VTL or JavaScript resolver code (e.g., passing data via `ctx.stash` / `ctx.prev.result` and shaping the response in the `after` step) → `โดยไม่ต้องดูแล server หรือสร้าง Lambda function มารวมข้อมูลเอง (กำหนดลำดับการดึงและรวมผลใน resolver ของ AppSync ได้เลย)`.
- 917: `(RTO ระดับนาที)` and `เพิ่ม cross-Region Aurora Replica แบบ PostgreSQL - Aurora PostgreSQL ไม่มี cross-Region replica แบบนี้` — Aurora Global Database RTO is typically **under 1 minute** (`ต่ำกว่า 1 นาที`), and the explanation misses the most direct reason option B loses to D: the prompt states the architecture **already has** an `Amazon Aurora global database cluster` → mention `RTO ปกติต่ำกว่า 1 นาที` and note in the reading guide/wrong-option reason that the existing setup already uses Aurora Global Database.
- 920: `TAG` uses `"sub": "edge-hybrid"` — AWS Global Accelerator is an edge networking / traffic acceleration service, not hybrid edge (Outposts/Snow/Local Zones) → use the repo's edge/CDN/networking sub-tag (e.g., `edge-cf` / `edge-net`) instead of `edge-hybrid`.

## Verdict

7 of 10 questions (Q912, Q914, Q915, Q916, Q918, Q919, Q921) are fine as-is; 3 (Q913, Q917, Q920) have minor weak spots only.
