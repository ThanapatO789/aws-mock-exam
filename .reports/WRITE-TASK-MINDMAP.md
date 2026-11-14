# Write task: Mindmap summary for one exam category (Thai)

The learner (exam SAA-C03 on 2026-11-23, 9 days left) wants, per category, a **distilled summary of what the exam actually asks**. It should be quick to read and organised as a tree. It is NOT a list of flash cards, and NOT a textbook chapter.

## Input
`.review/mindmap/<cat>.json` holds the category's sub-topics, sorted by how often they're asked. For each sub-topic you get:
- `questions`: how many bank questions are tagged with it;
- `braindump`: how many of those come from the Braindump sets, which are closest to the real exam;
- its fact cards, each with:
  - `asked`: how many questions the rule decided;
  - `asked_braindump`;
  - `cue`, `fact` and `note`.

The fact cards are verified. Treat them as your source of truth, and as the measure of what gets asked.

## What to produce
Write a JSON object to the output path given in the prompt:
```json
{"intro": "1–2 Thai sentences: how to think about this category",
 "subs": [ {"sub": "<sub id>", "points": [ <node>, ... ]}, ... ]}
```
Node: `{"t": "label", "d": "detail (optional)", "k": "tip|num|trap|vs (optional)", "src": ["<card id>", ...], "table": {"head": [...], "rows": [[...]]} (optional), "c": [child nodes] (optional)}`

- `src` is **required on every leaf**. It lists the card ids whose rule the leaf distills. The app shows "ออก N ข้อ" from the union of those cards' questions, so cite only cards the leaf really covers. A parent's count is computed from its children.
- `k`:
  - `tip` = the deciding rule;
  - `num` = a number to memorise;
  - `trap` = a wrong answer the exam baits;
  - `vs` = a comparison group.

## Rules for distilling
1. **Order by frequency.** Keep the sub-topic order from the input. Inside a sub-topic, put the rules that decided the most questions first, weighting `asked_braindump` roughly double.
2. **Merge, don't list.** Combine cards about the same decision into one point, e.g. "Windows+SMB → FSx Windows · Linux shared → EFS · HPC → FSx Lustre". When 3 or more options are compared, use a small `table`.
3. **Cut what's rarely asked.** A card asked once, with no Braindump use, belongs in the summary only if it completes a comparison. Target 5–12 points per sub-topic, whatever the card count.
4. **Show the trap next to the rule.** If the exam baits a wrong service, say so in a `trap` child or in the detail.
5. **Keep every claim correct as of today.** Copy numbers from the cards, and don't invent new ones. Follow the cards on retired services (Snowcone and Snowmobile are discontinued; Snowball Edge is closed to new customers; check what the cards say).
6. **Write natural, short Thai**, with AWS service names in English. A label is a short phrase. A detail is one or two lines. No option letters and no question numbers.

## Validate, then reply
Write a short script that checks:
- the output is valid JSON;
- the sub ids exactly match the input, in the same order;
- every leaf has a non-empty `src`, and every src id exists in the input;
- every `k` is one of tip, num, trap or vs.

Reply with only:
- the number of points per sub;
- how many input cards were cited at least once, out of the total;
- the validation result.

## Additions after the Storage pilot (apply from the first draft)
The reader is weak: mock scores are around 20–50%. Storage was reviewed from the reader's side (`.reports/mindmap/agy-storage-reader.md`) and rewritten. **`.reports/mindmap/storage.json` is the model to follow.** Match its shape and tone.

1. **Intro**: explain in plain Thai how to sort a question in this category (e.g. "object vs file vs block"). Add the symbol key: ✓ กฎตอบ · ⚠ ตัวหลอก · # ตัวเลขต้องจำ · ⇄ เทียบ.
2. **`cheat`** (top level, at most 12 rows): `{"s": "words or situation the learner sees in the question", "a": "answer", "not": "the usual wrong pick and why, briefly"}`. Cover the most-asked rules, and check every row against the cards.
3. **`flows`** (per sub-topic, only where the exam makes you choose between several services): `{"title", "flow": {"q", "opts": [{"a", "r"} | {"a", "to": {...}}]}}`. Each option has exactly one of `r` or `to`. At most 3 levels deep and about 8 results. Short, plain labels. Don't also keep a table that repeats the flow.
4. **Explain jargon** in plain Thai the first time it appears (e.g. CDC, POSIX, iSCSI, prefix, WORM). Split crammed lines; a weak reader can't decode long chains joined with "·" and "→".
5. **High value first.** Elimination traps and the most-asked rules go at the top of each sub-topic. Put low-value items (asked once, real-world trivia) in a final `"เก็บตก (ออกน้อย)"` group, or cut them.
6. **Use the current card text.** The dump is regenerated from `source/facts-th.json`, so don't rely on anything you remember about earlier versions. Where a card notes a change (e.g. KMS rotation period, retired services), keep that change.
