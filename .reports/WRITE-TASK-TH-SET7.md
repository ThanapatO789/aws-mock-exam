# Write task: Thai explanations, reading guides and topic tags for Set 7

You are an AWS SAA-C03 tutor writing study material for a Thai learner (exam 2026-11-23). Set 7 is real-exam-style questions (ids 392–456). The answer key has already been verified; **do not change the KEY**. If you believe a key is wrong, still write for the given key and add the id to `"_doubts"` with a one-line reason.

Inputs:
- `.review/set7/examples.txt`: taxonomy and three finished examples in the house style. Read it first and match it closely.
- Your batch file (named in the prompt): each question with its KEY and the site's English explanation. That explanation is AI-written and sometimes wrong or vague. Use it as a hint only; every claim you write must be correct as of today.

For every question, produce three things.

## 1. `th`: Thai explanation (house style)
- Structure: `ตัวเลือกที่ถูก: <correct option text, short>` (multi: `ตัวเลือกที่ถูก (2 ข้อ): (1) … (2) …`) → why, in 1–3 short paragraphs → `**จุดจำ: <the one rule that decides this question>**` → `ตัวเลือกที่ผิด:` then one line per wrong option: `<short paraphrase of the option> - <why it's wrong>`.
- **Never refer to options by letter (A/B/C).** The app shuffles the choices, so refer to them by content.
- Natural Thai. Keep AWS service, feature and technical names in English. Use `**…**` only for the key phrases and the จุดจำ line.
- Teach the deciding concept: which keyword in the question points to the answer, and the trap in each wrong option. Aim for about 600–1,100 characters.
- Be accurate and current: use current service names where useful (e.g. "Kinesis Data Firehose (ปัจจุบันชื่อ Amazon Data Firehose)"), and don't overstate.

## 2. `analysis`: reading guide
- `phrases`: 1–4 phrases copied **exactly** from the question text (character-for-character substrings; they get highlighted). Pick the words that decide the answer (requirements, qualifiers like `LEAST operational overhead`, constraints).
- `note`: one or two short Thai lines on how those phrases rule options out (refer to options by content, not letter).

## 3. `tag`
`{"cat": ..., "sub": ..., "pillar": ..., "domain": ...}`, using only ids and names from the taxonomy in examples.txt. `pillar` is the full pillar name. `domain` is one of secure / resilient / performant / cost.

## Output
Write one JSON file (UTF-8, valid JSON) to the path named in the prompt:
```json
{
  "392": {"th": "...", "analysis": {"phrases": ["..."], "note": "..."}, "tag": {"cat": "storage", "sub": "sto-s3feat", "pillar": "Performance Efficiency", "domain": "performant"}},
  "...": {},
  "_doubts": {"<id>": "reason"}
}
```
Then validate it yourself with a short script: the JSON parses, every id in your range is present, and every phrase is an exact substring of its question (you can load `source/questions.json` for that check). Reply with only: the count written, any `_doubts`, and the validation result.
