# Mock Test Trainer

A single-page web app for studying and self-testing against the **AWS Certified
Solutions Architect Associate (SAA-C03)** question bank (390 questions across 6
sets of 65 each). No build step, no backend — just open it in a browser.

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
- **Generate New Mock Test** — choose an exam set (1–6) or Random mode, then
  creates `mocktest_YYYYMMDD_NN` (auto-incremented per day) with the selected
  questions shuffled. Set mode uses all 65 questions from that set; Random mode
  lets you pick a custom count (1–390, default 65).
- **Exam timer** — starts when you press ▶ Start (questions are hidden on the
  briefing screen). Timer is proportional to question count (~2 minutes per
  question). Timer turns orange at 15m, red at 5m. Auto-submits at 0.
- **Previous mocks** — listed newest-first; resume in-progress mocks or open
  completed ones for review.
- Answers auto-save to `localStorage` on every change, so reloading mid-exam
  keeps your progress.
- **Download JSON** lets you archive a mock to `mock_test/` on disk.

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
