# Mock Test Trainer

A single-page web app for studying and self-testing against the **AWS Certified
Solutions Architect Associate (SAA-C03)** question bank: 651 questions in 10 sets. Sets 1–6 (ids 1–391) come from Udemy
practice tests. Sets 7–10 (ids 392–651) are real-exam-style questions scraped from
free-braindumps (`source/other/braindumps/`); 289 more are staged in
`questions-fixed.json` as Sets 11–15 and are added one set at a time, once the Thai
explanations are written (`python -I -X utf8 .reports/answer-check/sync_bank.py <N>`).
Their answer key was checked blind by Claude and Antigravity: 17 keys were
corrected, the original is kept as `siteCorrect`, and the reasons are in
`.reports/answer-check/VERDICT.md`. No build step, no backend — just open it in a browser.

## Quick start

The app reads `source/questions.json` over HTTP, so you need to serve the
folder (opening `index.html` with `file://` won't work because of browser
fetch security).

```bash
python3 -m http.server 8765
# then open http://localhost:8765/
```

## Features

### Flash Cards (`/learn`)
- **Study mode** — flip the card to reveal the answer and explanation.
- **Quiz mode** — try to answer first; the card shows ✓ / ✗ then offers a
  "Flip for explanation" button. Per-session score tracker.
- **★ Favorites** — star cards you want to revisit; switch to a Favorites-only
  view; **Reset All** to clear.
- Keyboard: `←` / `→` navigate, `Space` flips (Study mode), `F` favorites.

### Full Mock Test (`/mocks`)
- **Generate New Mock Test** — choose an exam set (1–10) or Random mode, then
  creates `mocktest_YYYYMMDD_NN` (auto-incremented per day) with the selected
  questions shuffled. Set mode uses all 65 questions from that set; Random mode
  lets you pick a custom count (1–651, default 65).
- **Exam timer** — starts when you press ▶ Start (questions are hidden on the
  briefing screen). Timer is proportional to question count (~2 minutes per
  question). Timer turns orange at 15m, red at 5m. Auto-submits at 0.
- **Previous mocks** — listed newest-first; resume in-progress mocks or open
  completed ones for review.
- Answers auto-save to `localStorage` on every change, so reloading mid-exam
  keeps your progress.
- **Download JSON** lets you archive a mock to `mock_test/` on disk.

### Fresh vs seen score + answer confidence
- **Seen** = the answer was revealed before (a completed mock, a Flash Card
  flip / quiz submit, or a Mini Practice summary). Results and History split the
  score into **fresh** (never seen — the one that predicts the real exam) and
  **seen** (inflated by memory). Mock Tests shows how many questions are still
  unseen, and Random mode can draw from unseen questions only.
- During a mock each question takes an optional confidence: ✓ sure / ≈ unsure /
  ? guess (no Source # is shown while the exam runs). Results show a
  confidence × right/wrong matrix: **wrong-but-sure** = misconception,
  **right-but-unsure** = luck. The latter feed Mini Practice → "≈ ถูกแต่ไม่ชัวร์".
- **Spaced repetition** (Mini Practice → 📅 ทบทวนวันนี้, opened by default when
  something is due): mock misses and right-but-unsure answers enter a Leitner
  queue, due the next day; correct reviews push it out 3 → 7 days and the third
  correct review (on three different days) retires it; a wrong review restarts it.
  Max 30 per session. Only this tab moves items; existing mocks are replayed
  once on first load to build the initial queue, and starred questions are
  imported once too (🔥 critical due today, the rest spread over 4 days so each
  can finish its 3 reviews before the exam). Questions starred later join the
  queue the next day.
- **Daily plan** (Home → "วันนี้"): countdown to the exam date (default
  2026-11-23, editable) with today's tasks for a ~2h day, ticked automatically
  from what was done — reviews due, a 30-question mock (65 on full-exam days),
  20 flash cards of the weakest topic, 30 fact cards the day before. Two days
  out it runs a readiness mock from 65 never-seen questions reserved for it.
  "➕ ขอเพิ่มอีก" adds bonus tasks (not counted in the streak).
- **Exam domains**: every question carries a SAA-C03 `domain` in
  `source/topics.json` (secure / resilient / performant / cost — straight from
  its pillar, except the 53 Operational Excellence questions, which were placed
  one by one). Results and History show per-domain accuracy and a score
  weighted 30/26/24/20 like the real exam, since the bank itself is skewed
  (≈31% high-performing, 25% secure).
- Pure logic lives in `metrics.js`; tests: `node --test tests/metrics.test.cjs`.

### Question types supported
| Type      | Count | UI                                                |
|-----------|------:|---------------------------------------------------|
| Single    |   316 | Radio buttons                                     |
| Multi     |    74 | Checkboxes (exact-set match required)             |

### Results
- Scoreboard: correct, wrong, unanswered, % score, time taken.
- Filter: all / wrong only / right only.
- Per-question expansion shows your answer vs the correct answer, with the
  explanation.

### Mini Practice (`/mini`)
- Aggregates every failed question id across all *completed* mocks
  (most-missed first, deduped).
- Walks them with the same input UI as the exam, plus a **Check / Reveal**
  toggle that flips the question into review mode.

## Folder structure

```
dev_trail/
├── index.html              # view shell (<template> for each screen)
├── style.css
├── app.js                  # all logic in one file
├── mock_test.md            # original spec
├── source/                 # master question pool & build tools
│   ├── build_questions.mjs # merge/validate raw per-set JSON files
│   └── questions.json      # 390 questions (single / multi only)
└── mock_test/              # optional disk dump target (Download JSON)
```

## Building the question bank

The question bank is built from 6 raw per-set JSON files (one per practice test)
into a single merged `source/questions.json` file using `source/build_questions.mjs`:

```bash
# Validate a single set file
node source/build_questions.mjs check <file>

# Merge 6 sets into questions.json
node source/build_questions.mjs merge set1.json set2.json set3.json set4.json set5.json set6.json -o source/questions.json
```

Each raw set file must be a JSON array of exactly 65 questions with shape:
```json
[
  {
    "question": "What is...",
    "choices": [
      { "letter": "A", "text": "..." },
      { "letter": "B", "text": "..." }
    ],
    "correct": ["A"],
    "explanation": "...",
    "type": "single"
  }
]
```

The merge script:
- Validates each question (2+ choices, 1+ correct answers, correct letters exist in choices).
- Assigns global question IDs 1–390 in set order (set 1 → 1–65, set 2 → 66–130, etc.).
- Stores the source set number on each question for later filtering.
- Ensures `type` matches the answer count (multi iff 2+ correct).
- Writes the merged, validated output to `source/questions.json`.

## Data model

Persisted in `localStorage` under key `mocktest:store:v2`:

```jsonc
{
  "favorites": [12, 3, 88],
  "exposures": { "12": "2026-11-09T..." },  // canonical qid -> first non-mock answer reveal
  "exposuresSince": "2026-11-09T...",       // when that log started
  "srs": { "12": { "box": 1, "due": "2026-11-12", "lapses": 0, "done": false, "last": "2026-11-09" } },
  "mocks": [
    {
      "id": "mocktest_20260604_01",
      "createdAt": "2026-06-04T...",
      "examSet": 1,
      "questionIds": [/* shuffled */],
      "status": "pending|in_progress|completed",
      "startedAt": null,
      "endedAt": null,
      "answers": { "12": ["A"], "52": ["B", "C", "A"] },
      "confidence": { "12": "sure", "52": "guess" },   // sure | unsure | guess
      "score": { "correct": 0, "wrong": 0, "unanswered": 0, "total": 65, "pct": 0 },
      "failedIds": []
    }
  ]
}
```

Scoring:
- Single / multi answer: exact set match (no partial credit).
- Unanswered counts as failed for mini-practice purposes.

## Tech notes

- **No dependencies, no build step.** Vanilla HTML, CSS, JS.
- Routing is a `{ name → renderFn }` map; views are HTML `<template>` blocks.
- Each view's `cleanup()` (e.g. for the exam timer interval) runs before the
  next view renders, so there's no leaked state between screens.
- Flip card uses CSS Grid (both faces share the same grid cell) so each card
  expands to fit its tallest face — Quiz-mode answer panes don't get clipped.
