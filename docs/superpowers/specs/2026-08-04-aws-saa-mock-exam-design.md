# AWS SAA Mock Exam — Design

## Context

The app currently studies the Arise Assessment Lead question bank (136 Q,
`source/questions.json`, extracted from a PDF via `source/extract.py`). The
user wants to reuse this app to study for the **AWS Certified Solutions
Architect Associate (SAA-C03)** exam instead, using the question bank from
their Udemy course:
https://www.udemy.com/course/practice-exams-aws-certified-solutions-architect-associate/

The Udemy course contains 6 Practice Tests × 65 questions = **390 questions
total**, each single- or multi-answer (no ordering-type questions, unlike the
old Arise bank), with an explanation revealed via "Practice mode → Check
answer".

The Arise data is being fully replaced, not kept alongside.

## Data extraction

Browser automation (already-authenticated Udemy session) walks each of the 6
Practice Tests in **Practice mode**, and per question captures:
- question text
- choices (with letters)
- correct answer(s) — single vs multi determined by how many are marked
  correct / "select N" phrasing
- explanation text

Given the scale (390 questions), extraction runs in batches per set,
saving incrementally to disk so it's resumable if interrupted mid-way.

## Data schema

Replaces `source/questions.json` with the same shape plus a `set` field, and
a global `id` across all 390 questions (so existing favorites / mock /
mini-practice records keep referencing a stable id):

```jsonc
{
  "id": 1,          // global, 1-390
  "set": 1,          // 1-6, which Practice Test this came from
  "type": "single",  // "single" | "multi"
  "question": "...",
  "choices": [{ "letter": "A", "text": "..." }, ...],
  "correct": ["A"],
  "explanation": "...",
  "multi": false
}
```

The old `source/Exam_Arise_Assessment_Lead_Q1_Q136.pdf` and
`source/extract.py` are removed (they're specific to the retired PDF-based
Arise pipeline). `source/questions.json` is overwritten with the new AWS SAA
data (390 questions, `set` 1-6).

## App changes

### Mock Test generation (`/mocks`)
- Add an **Exam Set** selector before "Generate New Mock Test": `Set 1` …
  `Set 6`, or **Random (all sets)**.
  - `Set N` generates a shuffled 65-question mock from that set only
    (same as today's "full mock" behavior, just scoped to 65 instead of 136).
  - `Random` shuffles across all 390 questions; user picks how many questions
    (default 65).
- Persisted mock records gain an `examSet` field (`1`-`6` or `"random"`) so
  the mock list can show which set (or Random) a given mock was generated
  from. Existing `mocks[]` shape otherwise unchanged.

### Flash Cards (`/learn`)
- No structural change — cards continue to page through the full 390-question
  pool. (Set filter for flash cards is out of scope; can be added later if
  wanted.)

### Mini Practice (`/mini`)
- No change — already works off `failedIds` aggregated across completed
  mocks, which continue to reference global question ids.

### README
- Update question counts (136 → 390), source description, and remove
  references to the Arise PDF / `extract.py` re-extraction steps.

## Out of scope

- Keeping the Arise bank available as a second, selectable question source.
- Per-set filtering in Flash Cards / Mini Practice.
- Ordering-type questions (none exist in the AWS SAA bank).
