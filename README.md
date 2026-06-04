# Mock Test Trainer

A single-page web app for studying and self-testing against the **Arise Lead
Engineer Assessment** question bank (Q1–Q136). No build step, no backend —
just open it in a browser.

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
- **Generate New Mock Test** — creates `mocktest_YYYYMMDD_NN` (auto-incremented
  per day) with the full 136 questions shuffled.
- **Previous mocks** — listed newest-first; resume in-progress mocks or open
  completed ones for review.
- **2-hour timer** starts when you press ▶ Start (questions are hidden on the
  briefing screen). Timer turns orange at 15m, red at 5m. Auto-submits at 0.
- Answers auto-save to `localStorage` on every change, so reloading mid-exam
  keeps your progress.
- **Download JSON** lets you archive a mock to `mock_test/` on disk.

### Question types supported
| Type      | Count | UI                                                |
|-----------|------:|---------------------------------------------------|
| Single    |    98 | Radio buttons                                     |
| Multi     |    23 | Checkboxes (exact-set match required)             |
| Ordering  |    15 | Click-to-rank with remove (✕) on placed items     |

### Results
- Scoreboard: correct, wrong, unanswered, % score, time taken.
- Filter: all / wrong only / right only.
- Per-question expansion shows your answer vs the correct answer, with the
  explanation. Ordering questions show "Your order" vs "Correct order" side
  by side with ✓/✗ per step.

### Mini Practice (`/mini`)
- Aggregates every failed question id across all *completed* mocks
  (most-missed first, deduped).
- Walks them with the same input UI as the exam, plus a **Check / Reveal**
  toggle that flips the question into review mode.

## Folder structure

```
mock-test-trainer/
├── index.html              # view shell (<template> for each screen)
├── style.css
├── app.js                  # all logic in one file
├── mock_test.md            # original spec
├── source/                 # master question pool
│   ├── Exam_Arise_Assessment_Lead_Q1_Q136.pdf
│   ├── extract.py          # PDF → questions.json
│   └── questions.json      # 136 questions (single / multi / ordering)
└── mock_test/              # optional disk dump target (Download JSON)
```

## Re-extracting questions

```bash
pip3 install pypdf
python3 source/extract.py
```

The extractor:
- Splits on `Question N` headers.
- Parses `A./B./C./...` choice lines, marking those with `✓` as correct.
- Detects the `Correct order:` section for ordering questions and stores the
  sequence as `correct: ["B", "C", "A"]`.
- Has a small `OVERRIDES` map for cases where the PDF lost its `✓` glyph
  during text extraction (currently just Q22 → `J`, inferred from the
  printed Explanation).

Sanity-check passes: PDF contains 211 `✓` marks; the JSON has 211 correct
entries across all question types.

## Data model

Persisted in `localStorage` under key `mocktest:store:v1`:

```jsonc
{
  "favorites": [12, 3, 88],
  "mocks": [
    {
      "id": "mocktest_20260604_01",
      "createdAt": "2026-06-04T...",
      "questionIds": [/* shuffled */],
      "status": "pending|in_progress|completed",
      "startedAt": null,
      "endedAt": null,
      "answers": { "12": ["A"], "52": ["B", "C", "A"] },
      "score": { "correct": 0, "wrong": 0, "unanswered": 0, "total": 136, "pct": 0 },
      "failedIds": []
    }
  ]
}
```

Scoring:
- Single / multi answer: exact set match (no partial credit).
- Ordering: exact array match.
- Unanswered counts as failed for mini-practice purposes.

## Tech notes

- **No dependencies, no build step.** Vanilla HTML, CSS, JS.
- Routing is a `{ name → renderFn }` map; views are HTML `<template>` blocks.
- Each view's `cleanup()` (e.g. for the exam timer interval) runs before the
  next view renders, so there's no leaked state between screens.
- Flip card uses CSS Grid (both faces share the same grid cell) so each card
  expands to fit its tallest face — Quiz-mode answer panes don't get clipped.
