// Run: node --test tests/metrics.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../metrics.js");

const canon = (qid) => (qid === 200 ? 5 : qid); // pretend Q200 is a duplicate of Q5
const mock = (o) => ({ status: "completed", answers: {}, confidence: {}, ...o });

test("buildFirstSeen: earliest of completed-mock endings and logged exposures, by canonical id", () => {
  const mocks = [
    mock({ id: "a", questionIds: [1, 2], startedAt: "2026-09-01T00:00:00Z", endedAt: "2026-09-01T02:00:00Z" }),
    mock({ id: "b", questionIds: [200], startedAt: "2026-09-02T00:00:00Z", endedAt: "2026-09-02T02:00:00Z" }),
    mock({ id: "c", status: "in_progress", questionIds: [3], startedAt: "2026-09-03T00:00:00Z", endedAt: null }),
  ];
  const fs = M.buildFirstSeen(mocks, { "2": "2026-08-20T00:00:00Z", "5": "2026-09-05T00:00:00Z" }, canon);
  assert.equal(fs.get("1"), "2026-09-01T02:00:00Z");
  assert.equal(fs.get("2"), "2026-08-20T00:00:00Z"); // flashcard reveal came first
  assert.equal(fs.get("5"), "2026-09-02T02:00:00Z"); // via duplicate Q200
  assert.equal(fs.has("3"), false); // unfinished mock never revealed answers
});

test("isFreshIn: fresh unless revealed before this mock started", () => {
  const fs = new Map([["1", "2026-09-01T02:00:00Z"]]);
  const later = mock({ questionIds: [1, 2], startedAt: "2026-09-10T00:00:00Z" });
  const earlier = mock({ questionIds: [1, 2], startedAt: "2026-08-01T00:00:00Z" });
  const pending = mock({ status: "pending", questionIds: [1, 2], startedAt: null });
  assert.equal(M.isFreshIn(later, 1, fs, canon), false);
  assert.equal(M.isFreshIn(later, 2, fs, canon), true);
  assert.equal(M.isFreshIn(earlier, 1, fs, canon), true); // its own reveal came after
  assert.equal(M.isFreshIn(pending, 1, fs, canon), false);
  assert.equal(M.isFreshIn(pending, 2, fs, canon), true);
});

test("freshSplit: tallies right/total separately for fresh and seen questions", () => {
  const fs = new Map([["1", "2026-09-01T00:00:00Z"], ["2", "2026-09-01T00:00:00Z"]]);
  const m = mock({ questionIds: [1, 2, 3, 4], startedAt: "2026-09-10T00:00:00Z" });
  const right = new Set([1, 3]);
  const s = M.freshSplit(m, fs, canon, (qid) => right.has(qid));
  assert.deepEqual(s, { fresh: { correct: 1, total: 2 }, seen: { correct: 1, total: 2 } });
});

test("confidenceMatrix: buckets answered questions by level x right/wrong; skips unanswered", () => {
  const m = mock({
    questionIds: [1, 2, 3, 4, 5],
    answers: { 1: ["A"], 2: ["B"], 3: ["C"], 4: ["D"] },
    confidence: { 1: "sure", 2: "sure", 3: "guess", 5: "guess" },
  });
  const right = new Set([1, 3]);
  const cm = M.confidenceMatrix(m, (qid) => right.has(qid));
  assert.deepEqual(cm.sure, { right: [1], wrong: [2] });
  assert.deepEqual(cm.guess, { right: [3], wrong: [] });
  assert.deepEqual(cm.unsure, { right: [], wrong: [] });
  assert.deepEqual(cm.none, { right: [], wrong: [4] });
});

test("shakyIds: latest attempt was right but not sure; newest first; later sure attempt clears it", () => {
  const right = () => true;
  const mocks = [
    mock({ id: "a", questionIds: [1, 2, 3], answers: { 1: ["A"], 2: ["A"], 3: ["A"] },
      confidence: { 1: "guess", 2: "unsure", 3: "guess" }, endedAt: "2026-09-01T00:00:00Z" }),
    mock({ id: "b", questionIds: [3, 4], answers: { 3: ["A"], 4: ["A"] },
      confidence: { 3: "sure", 4: "unsure" }, endedAt: "2026-09-02T00:00:00Z" }),
  ];
  const ids = M.shakyIds(mocks, canon, (m, qid) => right(m, qid));
  assert.deepEqual(ids, [4, 1, 2]);
});

test("shakyIds: a wrong latest attempt is not shaky (it belongs to most-missed)", () => {
  const mocks = [
    mock({ id: "a", questionIds: [1], answers: { 1: ["A"] }, confidence: { 1: "guess" }, endedAt: "2026-09-01T00:00:00Z" }),
    mock({ id: "b", questionIds: [1], answers: { 1: ["B"] }, confidence: { 1: "guess" }, endedAt: "2026-09-02T00:00:00Z" }),
  ];
  const ids = M.shakyIds(mocks, canon, (m, qid) => m.id === "a");
  assert.deepEqual(ids, []);
});

// ---------- spaced repetition ----------
test("srsAddDays: calendar math on YYYY-MM-DD, across month ends", () => {
  assert.equal(M.srsAddDays("2026-11-09", 1), "2026-11-10");
  assert.equal(M.srsAddDays("2026-11-28", 7), "2026-12-05");
});

test("srsReview: 1 -> 3 -> 7 day ladder, graduates on the third correct review; wrong resets", () => {
  let e = M.srsEnqueue(undefined, "2026-11-01");
  assert.deepEqual(e, { box: 0, due: "2026-11-02", lapses: 0, done: false, last: "2026-11-01" });
  e = M.srsReview(e, true, "2026-11-02");
  assert.equal(e.box, 1); assert.equal(e.due, "2026-11-05");
  e = M.srsReview(e, true, "2026-11-05");
  assert.equal(e.box, 2); assert.equal(e.due, "2026-11-12");
  const wrong = M.srsReview(e, false, "2026-11-12");
  assert.deepEqual([wrong.box, wrong.due, wrong.lapses, wrong.done], [0, "2026-11-13", 1, false]);
  e = M.srsReview(e, true, "2026-11-12");
  assert.equal(e.done, true); assert.equal(e.due, null);
});

test("srsEnqueue: re-entering an existing item resets it and counts a lapse", () => {
  const e = M.srsEnqueue({ box: 2, due: "2026-11-20", lapses: 1, done: false, last: "2026-11-05" }, "2026-11-09");
  assert.deepEqual(e, { box: 0, due: "2026-11-10", lapses: 2, done: false, last: "2026-11-09" });
});

test("srsApplyMock: wrong/skipped reset, right-but-unsure enqueued only if not already queued, right+sure untouched", () => {
  const srs = {
    "2": { box: 2, due: "2026-11-20", lapses: 0, done: false, last: "2026-11-01" },
    "3": { box: 1, due: "2026-11-12", lapses: 0, done: false, last: "2026-11-01" },
    "4": { box: 1, due: "2026-11-12", lapses: 0, done: false, last: "2026-11-01" },
  };
  const m = mock({
    questionIds: [1, 2, 3, 4, 6],
    answers: { 1: ["A"], 2: ["A"], 3: ["A"], 4: ["A"] },
    confidence: { 3: "guess", 4: "sure", 6: "guess" },
  });
  const right = new Set([3, 4]);
  const out = M.srsApplyMock(srs, m, canon, (qid) => right.has(qid), "2026-11-09");
  assert.equal(out["1"].box, 0); assert.equal(out["1"].due, "2026-11-10");           // wrong, new
  assert.equal(out["2"].box, 0); assert.equal(out["2"].lapses, 1);                   // wrong, reset
  assert.equal(out["3"].box, 1);                                                     // shaky but already queued
  assert.equal(out["4"].box, 1);                                                     // right + sure
  assert.equal(out["6"].box, 0);                                                     // skipped
  assert.equal(srs["1"], undefined, "input is not mutated");
});

test("srsDue: due on/before today, not done, oldest due first then most lapses", () => {
  const srs = {
    a: { box: 0, due: "2026-11-09", lapses: 0, done: false },
    b: { box: 1, due: "2026-11-05", lapses: 0, done: false },
    c: { box: 0, due: "2026-11-09", lapses: 3, done: false },
    d: { box: 2, due: "2026-11-10", lapses: 0, done: false },
    e: { box: 2, due: null, lapses: 0, done: true },
  };
  assert.deepEqual(M.srsDue(srs, "2026-11-09"), ["b", "c", "a"]);
});
