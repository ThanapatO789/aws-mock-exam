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

**Integrity check:** after extraction, verify each set has exactly 65
questions, every question has a non-empty `correct` array, and every
`correct` letter exists among that question's `choices`. Report any set that
fails the check instead of silently shipping bad data (the old PDF pipeline
had an equivalent ✓-count sanity check; this is the analogous check for the
browser-driven extraction).

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

## Storage migration

`STORAGE_KEY` bumps from `mocktest:store:v1` to `mocktest:store:v2`. On load,
if only a `v1` key exists, it is ignored (not migrated) — its `favorites`
and `mocks[].questionIds` reference the old Arise ids 1-136, which now
collide with different AWS SAA questions, so silently reusing them would
corrupt review/favorites data. The app starts fresh under `v2`; the old `v1`
entry is left untouched in localStorage (harmless dead data) rather than
deleted, in case the user wants to manually recover something from it via
devtools.

## App changes

### Mock Test generation (`/mocks`)
- Add an **Exam Set** selector before "Generate New Mock Test": `Set 1` …
  `Set 6`, or **Random (all sets)**.
  - `Set N` generates a shuffled 65-question mock from that set only
    (same as today's "full mock" behavior, just scoped to 65 instead of 136).
  - `Random` shuffles across all 390 questions. A number input (default 65,
    min 1, max 390) lets the user pick how many questions to include.
- `generateMock()` (app.js) changes signature to accept a question-id pool
  (filtered by `set`, or the full 390 for Random) and a count, instead of
  always using `state.questions.map(q => q.id)` unfiltered. All call sites
  are updated to pass the selector's choice through.
- Persisted mock records gain an `examSet` field (`1`-`6` or `"random"`) so
  the mock list can show which set (or Random) a given mock was generated
  from. Existing `mocks[]` shape otherwise unchanged.
- **Timer**: `EXAM_DURATION_MS` (currently a flat 2h for 136 Q) becomes
  proportional to question count, matching the real exam's ~2 min/question
  pace (65 Q ⇒ 130 min, matching Udemy's own "Exam mode" duration). Formula:
  `Math.round(questionCount * 2) minutes`, applied whether the mock is a
  single Set or a Random N.

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
