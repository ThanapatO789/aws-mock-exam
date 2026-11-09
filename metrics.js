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

  const api = { CONF_LEVELS, buildFirstSeen, isFreshIn, freshSplit, confidenceMatrix, shakyIds };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Metrics = api;
})(typeof self !== "undefined" ? self : this);
