// Pure helpers for "fresh vs seen" scoring and answer-confidence analytics.
// No DOM, no app state: loaded before app.js in the browser (globals) and
// require()-able from node for tests (tests/metrics.test.cjs).
//
// "Seen" means the answer to a question was revealed: a completed mock (its
// results page), a flash-card flip/quiz submit, or a Mini Practice summary.
// A question is FRESH in a mock if it had never been revealed before that mock
// started — the score on fresh questions is the one that predicts the real
// exam, because the score on seen ones is inflated by memory.
(function (root) {
  const CONF_LEVELS = ["sure", "unsure", "guess"];

  // canonical id (string) -> ISO time the answer was first revealed.
  // mocks: every stored mock (only completed ones count); exposures: the
  // non-mock reveal log { "<canonId>": "<ISO>" }.
  function buildFirstSeen(mocks, exposures, canon) {
    const first = new Map();
    const put = (c, at) => {
      if (!at) return;
      const k = String(c);
      const cur = first.get(k);
      if (!cur || at < cur) first.set(k, at);
    };
    for (const m of mocks || []) {
      if (m.status !== "completed") continue;
      const at = m.endedAt || m.startedAt;
      for (const qid of m.questionIds) put(canon(qid), at);
    }
    for (const [c, at] of Object.entries(exposures || {})) put(c, at);
    return first;
  }

  function isFreshIn(mock, qid, firstSeen, canon) {
    const at = firstSeen.get(String(canon(qid)));
    if (!at) return true;
    return !!mock.startedAt && at >= mock.startedAt;
  }

  function freshSplit(mock, firstSeen, canon, isRight) {
    const out = { fresh: { correct: 0, total: 0 }, seen: { correct: 0, total: 0 } };
    for (const qid of mock.questionIds) {
      const b = isFreshIn(mock, qid, firstSeen, canon) ? out.fresh : out.seen;
      b.total++;
      if (isRight(qid)) b.correct++;
    }
    return out;
  }

  // { sure|unsure|guess|none: { right: [qid], wrong: [qid] } }.
  // Unanswered questions are left out: there is no confidence to judge.
  function confidenceMatrix(mock, isRight) {
    const m = {};
    for (const l of [...CONF_LEVELS, "none"]) m[l] = { right: [], wrong: [] };
    const conf = mock.confidence || {};
    for (const qid of mock.questionIds) {
      if (!(mock.answers[qid] || []).length) continue;
      const lvl = CONF_LEVELS.includes(conf[qid]) ? conf[qid] : "none";
      m[lvl][isRight(qid) ? "right" : "wrong"].push(qid);
    }
    return m;
  }

  // Questions whose LATEST attempt (across completed mocks) was right but
  // answered "unsure" or "guess" — knowledge that isn't there yet even though
  // the score counted it. Newest first. isRightIn(mock, qid).
  function shakyIds(mocks, canon, isRightIn) {
    const done = (mocks || []).filter((m) => m.status === "completed")
      .sort((a, b) => (a.endedAt || "").localeCompare(b.endedAt || ""));
    const latest = new Map(); // canon -> { qid, at, shaky }
    for (const m of done) {
      const conf = m.confidence || {};
      for (const qid of m.questionIds) {
        const answered = (m.answers[qid] || []).length > 0;
        const shaky = answered && (conf[qid] === "unsure" || conf[qid] === "guess") && isRightIn(m, qid);
        latest.set(String(canon(qid)), { qid, at: m.endedAt || "", shaky });
      }
    }
    return [...latest.values()].filter((e) => e.shaky)
      .sort((a, b) => b.at.localeCompare(a.at))
      .map((e) => e.qid);
  }

  // ---------- spaced repetition (Leitner) ----------
  // Entry: { box, due: "YYYY-MM-DD" | null, lapses, done, last }.
  // A missed question is due the next day (box 0). Each correct review moves it
  // up a box and pushes the next review out: box0 -> +3d, box1 -> +7d, and a
  // correct review in box 2 graduates it (3 correct reviews on 3 different
  // days). A wrong review drops it back to box 0, due the next day.
  const SRS_NEXT = [3, 7]; // days until the next review after a correct answer at box 0 / 1
  const SRS_SESSION_CAP = 30;

  function srsAddDays(day, n) {
    const [y, m, d] = day.split("-").map(Number);
    const t = new Date(Date.UTC(y, m - 1, d + n));
    return t.toISOString().slice(0, 10);
  }

  // (Re-)enter the queue: a miss in a mock, or a right-but-unsure answer.
  function srsEnqueue(prev, today) {
    return { box: 0, due: srsAddDays(today, 1), lapses: prev ? (prev.lapses || 0) + 1 : 0, done: false, last: today };
  }

  function srsReview(e, correct, today) {
    if (!correct) return { box: 0, due: srsAddDays(today, 1), lapses: (e.lapses || 0) + 1, done: false, last: today };
    if (e.box >= SRS_NEXT.length) return { ...e, box: SRS_NEXT.length, due: null, done: true, last: today };
    return { ...e, box: e.box + 1, due: srsAddDays(today, SRS_NEXT[e.box]), done: false, last: today };
  }

  // Fold one completed mock into the queue (returns a new object).
  function srsApplyMock(srs, mock, canon, isRight, today) {
    const out = { ...(srs || {}) };
    const conf = mock.confidence || {};
    for (const qid of mock.questionIds) {
      const c = String(canon(qid));
      const answered = (mock.answers[qid] || []).length > 0;
      const right = answered && isRight(qid);
      if (!right) { out[c] = srsEnqueue(out[c], today); continue; }
      const shaky = conf[qid] === "unsure" || conf[qid] === "guess";
      if (shaky && (!out[c] || out[c].done)) out[c] = srsEnqueue(out[c], today);
    }
    return out;
  }

  function srsDue(srs, today) {
    return Object.entries(srs || {})
      .filter(([, e]) => e && !e.done && e.due && e.due <= today)
      .sort(([, a], [, b]) => a.due.localeCompare(b.due) || (b.lapses || 0) - (a.lapses || 0))
      .map(([c]) => c);
  }

  const api = {
    CONF_LEVELS, buildFirstSeen, isFreshIn, freshSplit, confidenceMatrix, shakyIds,
    SRS_SESSION_CAP, srsAddDays, srsEnqueue, srsReview, srsApplyMock, srsDue,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Metrics = api;
})(typeof self !== "undefined" ? self : this);
