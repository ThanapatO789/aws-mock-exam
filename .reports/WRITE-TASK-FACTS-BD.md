# Write task: supplement fact cards from the Braindump sets (ids 392–940)

The app's 640 fact cards (`source/facts-th.json`) were distilled from the Udemy sets (ids 1–391) only. The Braindump sets test some topics and services the cards cover thinly or not at all. Your job is to write **new** cards that fill those gaps, for a Thai learner whose exam is 2026-11-23.

Inputs:
- `.review/facts-bd/examples.json`: existing cards. Match their style and schema exactly.
- Your group file (named in the prompt): the target sub-topics, the services that have no card yet, the existing card cues in those sub-topics (**don't duplicate them**), and the Braindump questions with their verified Thai explanations.

## What makes a good card
- A card is one decision rule the exam tests. `cue` is the front: a short Thai question or prompt (e.g. "ต้องการ X แบบ Y ใช้อะไร"). `fact` is the back: 2–4 short lines that answer it and say why the usual trap is wrong.
- Prefer rules that decided several of the Braindump questions in your file. Skip one-off trivia.
- Every claim must be correct as of today. Mention retired or renamed services where relevant (e.g. Snowcone was discontinued; Kinesis Data Firehose is now Amazon Data Firehose).
- Natural Thai; AWS names in English. No option letters.

## Schema (one object per card)
```json
{"id": "<cat>-bdNN", "cat": "<category id>", "sub": "<sub id>", "kind": "fact|compare|antipattern|number",
 "tier": "A|B|C", "cue": "...", "fact": "...", "note": "", "services": ["Amazon S3", "..."],
 "sources": [<braindump question ids this rule decided>], "decks": ["<cat>", "+ pairs for compare, numbers for number, traps for antipattern"], "patched": false}
```
- `id`: use the prefix given in the prompt plus a running number (e.g. `storage-bd01`).
- `tier`: A = must-know, appears in several questions; B = useful; C = detail.
- `sources`: only Braindump ids from your file that the card actually explains.

## Output
Write a JSON array of **12–18 cards** to the path in the prompt. Then validate it with a short script: valid JSON, unique ids with the given prefix, `cat`/`sub` valid (the sub-topics in your group, or another sub in the same taxonomy, see `source/taxonomy.json`), every source id is ≥ 392 and appears in your group file. Reply with only: the count written, the tier split, and the validation result.
