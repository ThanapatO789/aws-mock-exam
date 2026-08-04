# AWS SAA Mock Exam Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the app's Arise question bank with the 390-question AWS Certified Solutions Architect Associate (SAA-C03) bank from the user's Udemy course (6 sets × 65 Q), and add a Set / Random selector to Mock Test generation.

**Architecture:** Extraction is a one-time data-migration step (browser automation reads the Udemy "Practice mode" per question, dumps raw per-set JSON to the scratchpad, a Node merge script validates and combines them into `source/questions.json`). The app itself (`app.js`, `index.html`) is a single-file vanilla-JS static site with no build step and no test runner — verification throughout is "run the local dev server, drive it with the browser automation tools, check the DOM/state directly."

**Tech Stack:** Vanilla HTML/CSS/JS (no framework, no bundler), Node.js (for the one merge/validation script only — not shipped to the browser), `.serve.cjs` static file server for manual verification.

## Global Constraints

- No Arise data or Arise-specific tooling (PDF, `extract.py`) remains after this work — full replacement per spec.
- Global `id` 1-390 assigned in set order (set 1 → ids 1-65, set 2 → 66-130, … set 6 → 326-390); every question also carries `set` (1-6).
- `STORAGE_KEY` bumps `mocktest:store:v1` → `mocktest:store:v2`; the old `v1` entry is left untouched in localStorage, never migrated or deleted.
- Exam timer is `questionCount * 2 minutes` (matches the 65Q → 130min real-exam pacing), not a flat constant.
- No ordering-type questions exist in this bank — only `"single"` and `"multi"`.
- Every extracted question must pass: `choices.length >= 2`, `correct.length >= 1`, every letter in `correct` exists in `choices`, and `type === "multi"` iff `correct.length > 1`.

---

### Task 1: Question merge/validation script

**Files:**
- Create: `source/build_questions.mjs`
- Test: manual run against fixture files (see steps below; no fixture files are kept in the repo)

**Interfaces:**
- Produces: CLI `node source/build_questions.mjs check <file>` (validate one raw per-set JSON file) and `node source/build_questions.mjs merge <set1.json> ... <set6.json> -o <outFile>` (merge all 6, assign global `id`/`set`, validate, write). Both exit 0 on success, 1 on any validation failure, printing one line per problem found.
- Consumes: raw per-set JSON shape `[{ "question": str, "choices": [{ "letter": str, "text": str }], "correct": [str], "explanation": str, "type": "single"|"multi" }, ...]` (produced by Tasks 2-7).

- [ ] **Step 1: Write the script**

```js
#!/usr/bin/env node
// source/build_questions.mjs
import fs from "node:fs";

function validateRawQuestion(q, idx, errors, ctx) {
  const where = `${ctx} #${idx + 1}`;
  if (!q.question || typeof q.question !== "string") errors.push(`${where}: missing question text`);
  if (!Array.isArray(q.choices) || q.choices.length < 2) errors.push(`${where}: needs >=2 choices`);
  const letters = new Set((q.choices || []).map((c) => c.letter));
  if (!Array.isArray(q.correct) || q.correct.length < 1) errors.push(`${where}: missing correct answer(s)`);
  for (const letter of q.correct || []) {
    if (!letters.has(letter)) errors.push(`${where}: correct letter "${letter}" not among choices`);
  }
  const expectMulti = (q.correct || []).length > 1;
  if (q.type !== (expectMulti ? "multi" : "single")) {
    errors.push(`${where}: type "${q.type}" inconsistent with ${q.correct.length} correct answer(s)`);
  }
  if (!q.explanation || typeof q.explanation !== "string") errors.push(`${where}: missing explanation`);
}

function loadRawSet(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data)) throw new Error(`${file}: expected a JSON array`);
  return data;
}

function checkFile(file) {
  const data = loadRawSet(file);
  const errors = [];
  if (data.length !== 65) errors.push(`${file}: expected 65 questions, found ${data.length}`);
  data.forEach((q, i) => validateRawQuestion(q, i, errors, file));
  return errors;
}

function mergeFiles(files, outFile) {
  const errors = [];
  let nextId = 1;
  const merged = [];
  files.forEach((file, setIdx) => {
    const data = loadRawSet(file);
    if (data.length !== 65) errors.push(`${file}: expected 65 questions, found ${data.length}`);
    data.forEach((q, i) => {
      validateRawQuestion(q, i, errors, file);
      merged.push({
        id: nextId++,
        set: setIdx + 1,
        type: q.type,
        question: q.question,
        choices: q.choices,
        correct: q.correct,
        explanation: q.explanation,
        multi: q.type === "multi",
      });
    });
  });
  if (errors.length) return { errors };
  fs.writeFileSync(outFile, JSON.stringify(merged, null, 2) + "\n");
  return { errors: [], count: merged.length };
}

const [, , cmd, ...rest] = process.argv;

if (cmd === "check") {
  const errors = checkFile(rest[0]);
  errors.forEach((e) => console.error(e));
  console.log(errors.length ? `FAIL: ${errors.length} problem(s)` : `OK: ${rest[0]}`);
  process.exit(errors.length ? 1 : 0);
} else if (cmd === "merge") {
  const oIdx = rest.indexOf("-o");
  if (oIdx === -1) { console.error("merge requires -o <outFile>"); process.exit(1); }
  const outFile = rest[oIdx + 1];
  const files = rest.filter((_, i) => i !== oIdx && i !== oIdx + 1);
  const { errors, count } = mergeFiles(files, outFile);
  errors.forEach((e) => console.error(e));
  console.log(errors.length ? `FAIL: ${errors.length} problem(s)` : `OK: wrote ${count} questions to ${outFile}`);
  process.exit(errors.length ? 1 : 0);
} else {
  console.error("usage: build_questions.mjs check <file> | merge <f1> ... <f6> -o <outFile>");
  process.exit(1);
}
```

- [ ] **Step 2: Verify it catches bad data**

Create two tiny fixture files in the scratchpad dir (not the repo) and confirm the script rejects them:

```bash
mkdir -p /tmp/bq-fixture
cat > /tmp/bq-fixture/bad.json <<'EOF'
[{"question":"Q1","choices":[{"letter":"A","text":"x"}],"correct":["B"],"explanation":"e","type":"single"}]
EOF
node source/build_questions.mjs check /tmp/bq-fixture/bad.json
```

Expected: exits 1, prints errors for "needs >=2 choices", "correct letter \"B\" not among choices", and the 65-count mismatch.

- [ ] **Step 3: Verify it accepts good data**

```bash
node -e '
const fs=require("fs");
const qs=Array.from({length:65},(_,i)=>({question:"Q"+i,choices:[{letter:"A",text:"a"},{letter:"B",text:"b"}],correct:["A"],explanation:"e",type:"single"}));
fs.writeFileSync("/tmp/bq-fixture/good.json", JSON.stringify(qs));
'
node source/build_questions.mjs check /tmp/bq-fixture/good.json
```

Expected: exits 0, prints `OK: /tmp/bq-fixture/good.json`.

- [ ] **Step 4: Commit**

```bash
git add source/build_questions.mjs
git commit -m "Add question set merge/validation script"
```

---

### Task 2-7: Extract Practice Tests 1-6 from Udemy

One task per set (repeat this task 6 times, N = 1..6). Best run as separate subagents in parallel (each needs browser-automation tool access) since they're independent.

**Files:**
- Create: `<scratchpad>/set{N}.json` (scratchpad dir, NOT the repo — see the session's configured scratchpad path)

**Interfaces:**
- Produces: `<scratchpad>/set{N}.json`, an array of exactly 65 objects matching `{ question, choices: [{letter, text}], correct: [letters], explanation, type }` — this is the "raw per-set JSON" Task 1's script consumes.

- [ ] **Step 1: Open Practice Test N in Practice mode**

Use the claude-in-chrome tools (`tabs_context_mcp` → `navigate` to `https://www.udemy.com/course/practice-exams-aws-certified-solutions-architect-associate/learn/quiz/4726080#overview`, then click "Practice Test N" in the right-hand course-content list, then click "Practice mode" → "Begin test"). The user is already authenticated in their normal Chrome profile.

- [ ] **Step 2: Walk all 65 questions, capturing each one**

For each question in order:
1. Use `get_page_text` (or `read_page`) to capture the question text and all answer choices with their letters.
2. Click "Check answer" (or equivalent reveal control).
3. Use `get_page_text` again to capture: which choice letter(s) are marked correct, and the explanation text shown.
4. Determine `type`: `"multi"` if more than one letter is correct (Udemy phrases these as "select TWO"/"select THREE" etc. in the question text), else `"single"`.
5. Click "Next" to advance.

Accumulate each question as `{ question, choices: [{letter, text}, ...], correct: [letters...], explanation, type }`.

- [ ] **Step 3: Save the raw JSON**

Write the 65-element array to `<scratchpad>/set{N}.json` using the Write tool.

- [ ] **Step 4: Validate the file**

```bash
node source/build_questions.mjs check <scratchpad>/set{N}.json
```

Expected: `OK: <scratchpad>/set{N}.json`. If it fails, re-check the flagged question(s) against the live page and fix the JSON before moving on — don't carry known-bad rows forward.

(No commit — this file is scratch data, consumed by Task 8 and then discardable.)

---

### Task 8: Merge sets into `source/questions.json`

**Files:**
- Modify: `source/questions.json` (fully overwritten)

**Interfaces:**
- Consumes: `<scratchpad>/set1.json` … `set6.json` from Tasks 2-7, `source/build_questions.mjs` from Task 1.

- [ ] **Step 1: Run the merge**

```bash
node source/build_questions.mjs merge \
  <scratchpad>/set1.json <scratchpad>/set2.json <scratchpad>/set3.json \
  <scratchpad>/set4.json <scratchpad>/set5.json <scratchpad>/set6.json \
  -o source/questions.json
```

Expected: `OK: wrote 390 questions to source/questions.json`. If it prints `FAIL`, fix the offending scratchpad file(s) (re-visit Task 2-7's Step 4 for that set) and re-run — do not hand-edit `source/questions.json` directly, it's a generated artifact.

- [ ] **Step 2: Spot-check the merged file**

```bash
node -e '
const qs = JSON.parse(require("fs").readFileSync("source/questions.json","utf8"));
console.log("total:", qs.length);
console.log("first id/set:", qs[0].id, qs[0].set);
console.log("last id/set:", qs[389].id, qs[389].set);
console.log("set counts:", [1,2,3,4,5,6].map(s => qs.filter(q=>q.set===s).length));
'
```

Expected: `total: 390`, first is `id 1 / set 1`, last is `id 390 / set 6`, and set counts are `[65,65,65,65,65,65]`.

- [ ] **Step 3: Commit**

```bash
git add source/questions.json
git commit -m "Replace Arise question bank with AWS SAA 390-question bank"
```

---

### Task 9: Remove retired Arise assets

**Files:**
- Delete: `source/Exam_Arise_Assessment_Lead_Q1_Q136.pdf`
- Delete: `source/extract.py`

- [ ] **Step 1: Remove the files**

```bash
git rm source/Exam_Arise_Assessment_Lead_Q1_Q136.pdf source/extract.py
```

- [ ] **Step 2: Verify nothing else references them**

```bash
grep -rn "extract.py\|Exam_Arise" --include="*.js" --include="*.html" --include="*.md" .
```

Expected: no matches outside `README.md` (which Task 12 updates) and this plan/spec doc.

- [ ] **Step 3: Commit**

```bash
git commit -m "Remove retired Arise PDF and extractor"
```

---

### Task 10: Storage key bump + proportional exam timer

**Files:**
- Modify: `app.js:4` (STORAGE_KEY), `app.js:6` (EXAM_DURATION_MS), `app.js:1025` (its usage)

**Interfaces:**
- Produces: `examDurationMs(mock)` — takes a mock object, returns `mock.questionIds.length * 2 * 60 * 1000`. Used by Task 11's mock-start briefing screen too.

- [ ] **Step 1: Bump the storage key**

```js
// app.js:4
const STORAGE_KEY = "mocktest:store:v2";
```

- [ ] **Step 2: Replace the flat exam duration with a proportional helper**

```js
// app.js:6 — replace:
// const EXAM_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
// with:
function examDurationMs(mock) {
  return mock.questionIds.length * 2 * 60 * 1000; // ~2 min/question, matches real exam pacing
}
```

- [ ] **Step 3: Update the one call site**

```js
// app.js:1025 — replace:
// const endMs = startMs + EXAM_DURATION_MS;
// with:
const endMs = startMs + examDurationMs(mock);
```

(`mock` is already in scope at that line — it's the exam-view's active mock object.)

- [ ] **Step 4: Manual verification**

```bash
node .serve.cjs
```

Then in the browser: open `http://localhost:8765/`, open devtools console, run `localStorage.getItem("mocktest:store:v2")` (should be `null` on a fresh profile — confirms the app is reading/writing the new key, not `v1`). This is covered further end-to-end in Task 11's verification once a mock can actually be generated against the new data.

- [ ] **Step 5: Commit**

```bash
git add app.js
git commit -m "Bump storage key to v2 and make exam timer proportional to question count"
```

---

### Task 11: Exam Set selector + Random mode

**Files:**
- Modify: `index.html:93-104` (`tpl-mocks` template), `index.html:114` (`tpl-mock-start` time-limit span)
- Modify: `app.js:146-167` (`generateMock`), `app.js:761-811` (`renderMocks`), `app.js:814-844` (`renderMockStart`)

**Interfaces:**
- Consumes: `examDurationMs(mock)` from Task 10.
- Produces: `generateMock(ids, examSet)` — now takes an explicit array of question ids to shuffle into the mock, and an `examSet` tag (`1`-`6` or `"random"`) stored on the mock record.

- [ ] **Step 1: Update `tpl-mocks` to add the Set/Random selector**

```html
<!-- index.html — replace the tpl-mocks template's <header> block -->
<template id="tpl-mocks">
  <section class="mocks">
    <header class="page-head">
      <h1>Mock Test</h1>
    </header>
    <div class="mock-generate-bar">
      <label>Exam set:
        <select id="mock-set-select">
          <option value="1">Set 1</option>
          <option value="2">Set 2</option>
          <option value="3">Set 3</option>
          <option value="4">Set 4</option>
          <option value="5">Set 5</option>
          <option value="6">Set 6</option>
          <option value="random">Random (all sets)</option>
        </select>
      </label>
      <label id="mock-random-count-wrap" hidden>Questions:
        <input id="mock-random-count" type="number" min="1" max="390" value="65">
      </label>
      <button id="generate-mock" class="primary">+ Generate New Mock Test</button>
    </div>
    <div class="mock-list-wrap">
      <h2>Previous Mock Tests</h2>
      <ul id="mock-list" class="mock-list"></ul>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Give the mock-start time-limit span an id**

```html
<!-- index.html:114 — replace: -->
<!-- <div class="metric"><label>Time limit</label><span>2h 00m</span></div> -->
<div class="metric"><label>Time limit</label><span id="mock-time"></span></div>
```

- [ ] **Step 3: Change `generateMock` to take an explicit id pool + examSet tag**

```js
// app.js — replace generateMock (was app.js:146-167)
function generateMock(ids, examSet) {
  const shuffled = shuffle(ids);
  const choiceOrders = {};
  for (const qid of shuffled) {
    const q = state.byId.get(qid);
    choiceOrders[qid] = shuffle(q.choices.map((c) => c.letter));
  }
  const mock = {
    id: nextMockId(),
    createdAt: new Date().toISOString(),
    examSet, // 1-6 or "random"
    questionIds: shuffled,
    choiceOrders,
    status: "pending",
    startedAt: null,
    endedAt: null,
    answers: {},
    score: null,
    failedIds: [],
  };
  state.store.mocks.push(mock);
  saveStore();
  return mock;
}
```

- [ ] **Step 4: Wire up the selector in `renderMocks`**

```js
// app.js — inside renderMocks(root), replace the existing
// $("#generate-mock", root).addEventListener(...) block (was app.js:805-808)
const setSelect = $("#mock-set-select", root);
const randomWrap = $("#mock-random-count-wrap", root);
const randomCount = $("#mock-random-count", root);
setSelect.addEventListener("change", () => {
  randomWrap.hidden = setSelect.value !== "random";
});

$("#generate-mock", root).addEventListener("click", () => {
  const sel = setSelect.value;
  let ids, examSet;
  if (sel === "random") {
    const n = Math.min(390, Math.max(1, parseInt(randomCount.value, 10) || 65));
    ids = shuffle(state.questions.map((q) => q.id)).slice(0, n);
    examSet = "random";
  } else {
    const setNum = parseInt(sel, 10);
    ids = state.questions.filter((q) => q.set === setNum).map((q) => q.id);
    examSet = setNum;
  }
  const m = generateMock(ids, examSet);
  navigate("mockStart", { mockId: m.id });
});
```

- [ ] **Step 5: Show the exam set on each row in the mock list**

```js
// app.js — inside renderMocks' refresh(), in the li.innerHTML template
// (was app.js:785-793), add the set/random label into the meta line:
li.innerHTML = `
  <div>
    <div class="mname">${m.id}</div>
    <div class="meta">${fmtDate(m.createdAt)} · ${m.examSet === "random" ? "Random" : "Set " + m.examSet} · ${total} questions · ${progressText}</div>
  </div>
  <span class="badge ${m.status}">${m.status.replace("_", " ")}</span>
  <button class="open">Open</button>
  <button class="danger del">Delete</button>
`;
```

Mocks created before this change won't have `examSet` — guard the label: `m.examSet == null ? "" : (m.examSet === "random" ? "Random · " : "Set " + m.examSet + " · ")` prepended to the meta line (adjust the template literal above accordingly).

- [ ] **Step 6: Populate the dynamic time-limit text in `renderMockStart`**

```js
// app.js — inside renderMockStart, after the existing
// $("#mock-count", root).textContent = ... line (was app.js:821)
$("#mock-time", root).textContent = fmtDuration(examDurationMs(mock));
```

- [ ] **Step 7: Manual end-to-end verification**

```bash
node .serve.cjs
```

Using the browser automation tools: navigate to `http://localhost:8765/`, go to Mock Test, select "Set 2", click "+ Generate New Mock Test" — confirm the briefing screen shows "65" questions and a "2h 10m" time limit, and that starting the exam shows only questions whose `source #` falls in the 66-130 range (open devtools and inspect, or cross-reference against `source/questions.json`). Then go back, select "Random", set count to 20, generate, and confirm the briefing shows "20" questions and "40m" time limit. Confirm `localStorage.getItem("mocktest:store:v2")` now contains both mocks with correct `examSet` values.

- [ ] **Step 8: Commit**

```bash
git add app.js index.html
git commit -m "Add exam set selector and random-mode mock generation"
```

---

### Task 12: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update the question bank description and counts**

Replace references to "Arise Lead Engineer Assessment" (136 Q) with the AWS SAA-C03 bank (390 Q across 6 sets), update the "Question types supported" table (remove the Ordering row — none exist in this bank; update Single/Multi counts once known from `source/questions.json`), remove the "Re-extracting questions" section (references the retired `extract.py`), and add a short note describing `source/build_questions.mjs` (merge/validate raw per-set JSON into `source/questions.json`) in its place. Update the "Folder structure" block to drop the PDF/`extract.py` lines and add `build_questions.mjs`. Add a line under "Full Mock Test" describing the new Exam Set / Random selector.

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Update README for AWS SAA question bank"
```

## Self-Review Notes

- **Spec coverage:** data extraction (Tasks 2-7), schema + integrity check (Task 1, 8), Arise removal (Task 9), storage migration (Task 10), timer (Task 10), Set/Random selector + `examSet` (Task 11), README (Task 12) — all spec sections have a task.
- **Type consistency:** `generateMock(ids, examSet)` signature introduced in Task 11 Step 3 is used identically in Step 4; `examDurationMs(mock)` introduced in Task 10 is reused in Task 11 Step 6 with the same name/shape.
- **No placeholders:** every step has literal code or an exact runnable command with an expected output to check against.
