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

  // Put ids into the queue (not already active ones), due on `due`.
  function srsAdd(srs, ids, due, today) {
    const out = { ...(srs || {}) };
    for (const id of ids) {
      const k = String(id), prev = out[k];
      if (prev && !prev.done) continue;
      out[k] = { box: 0, due, lapses: prev ? (prev.lapses || 0) + 1 : 0, done: false, last: today };
    }
    return out;
  }

  // first (optional): canonical id -> priority, lower first (a boolean means
  // true = 0, false = 1). The app passes 0 = answered wrong while sure,
  // 1 = Braindump, 2 = the rest. Within a priority: oldest due first, then most lapses.
  function srsDue(srs, today, first) {
    const rank = (c) => { if (!first) return 0; const r = first(c); return typeof r === "number" ? r : (r ? 0 : 1); };
    return Object.entries(srs || {})
      .filter(([, e]) => e && !e.done && e.due && e.due <= today)
      .sort(([ca, a], [cb, b]) => rank(ca) - rank(cb) || a.due.localeCompare(b.due) || (b.lapses || 0) - (a.lapses || 0))
      .map(([c]) => c);
  }

  // ---------- daily plan (countdown to the exam, ~2h/day) ----------
  function daysBetween(a, b) {
    const t = (s) => { const [y, m, d] = s.split("-").map(Number); return Date.UTC(y, m - 1, d); };
    return Math.round((t(b) - t(a)) / 864e5);
  }

  // Topics ranked by expected points lost: (1 - smoothed accuracy) x sqrt(share),
  // where share is how often the topic is asked (square root so a topic you're
  // already strong in isn't pushed up just for being common) (the app uses Braindump
  // question counts as the exam proxy). Accuracy is smoothed toward the overall
  // mean with k pseudo-answers so a 0/4 topic isn't read as 0%. Topics with
  // < minN answers aren't judged; if fewer than n are, the list is filled with
  // the most-asked topics, skipping `avoid` (reviewed on recent days).
  // Returns { subs: top n, judged, order: every judged topic, acc: smoothed }.
  function rankTopics(stats, share, { minN = 4, n = 3, avoid = [], k = 3 } = {}) {
    let c = 0, t = 0;
    for (const [, e] of stats) { c += e.correct; t += e.total; }
    const mean = t ? c / t : 0.7;
    const acc = {};
    const scored = [...stats].filter(([, e]) => e.total >= minN).map(([id, e]) => {
      acc[id] = (e.correct + k * mean) / (e.total + k);
      return { id, acc: acc[id], loss: (1 - acc[id]) * Math.sqrt(share[id] || 0) };
    }).sort((a, b) => b.loss - a.loss || a.acc - b.acc);
    const order = scored.map((r) => r.id);
    const subs = order.slice(0, n);
    const skip = new Set([...subs, ...avoid]);
    const filler = Object.entries(share).filter(([id]) => !skip.has(id)).sort((a, b) => b[1] - a[1]).map(([id]) => id);
    while (subs.length < n && filler.length) subs.push(filler.shift());
    return { subs, judged: Math.min(scored.length, n), order, acc };
  }

  // SAA-C03 domain weights. Plan mocks are drawn to match them, since the bank
  // itself is skewed differently per source.
  const EXAM_WEIGHTS = { secure: 30, resilient: 26, performant: 24, cost: 20 };

  // n split across domains by weight, largest-remainder rounding.
  function domainQuota(n, weights = EXAM_WEIGHTS) {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);
    const raw = Object.entries(weights).map(([d, w]) => [d, (n * w) / sum]);
    const out = Object.fromEntries(raw.map(([d, x]) => [d, Math.floor(x)]));
    let left = n - Object.values(out).reduce((a, b) => a + b, 0);
    raw.sort((a, b) => (b[1] % 1) - (a[1] % 1));
    for (let i = 0; left > 0; i++, left--) out[raw[i % raw.length][0]]++;
    return out;
  }

  // Up to n ids taken in priority order, honouring each domain's quota first;
  // if a domain runs short, the gap is filled with the next ids in order.
  function pickByDomain(ids, domainOf, n, weights = EXAM_WEIGHTS) {
    const quota = domainQuota(n, weights);
    const out = [];
    const used = new Set();
    for (const id of ids) {
      if (out.length >= n) break;
      const d = domainOf(id);
      if (quota[d] > 0) { quota[d]--; out.push(id); used.add(id); }
    }
    for (const id of ids) {
      if (out.length >= n) break;
      if (!used.has(id)) { out.push(id); used.add(id); }
    }
    return out;
  }

  // Tasks for a day given how many days are left until the exam. The mock comes
  // first: it feeds the weak-topic ranking and the review queue.
  //   >=7 days  "weak":  reviews + 45-question mock + 20 flash cards of the weakest topic
  //                     + 10 facts read on the Map in the weakest sub-topics
  //   3-6 days  "sim":   full 65-question exams on even days, the "weak" day otherwise
  //   2 days    "ready": reviews + full exam from the reserved never-seen Braindump questions (readiness check)
  //   1 day     "light": reviews + 30 fact cards, no new mock
  function planForDay(daysLeft) {
    const srs = { kind: "srs" };
    const weakDay = [{ kind: "mock", size: 45 }, srs, { kind: "weak", size: 20, rank: 0 }, { kind: "map", size: 10 }];
    if (daysLeft < 0) return { phase: "after", tasks: [] };
    if (daysLeft === 0) return { phase: "exam", tasks: [] };
    if (daysLeft === 1) return { phase: "light", tasks: [srs, { kind: "facts", size: 30 }] };
    if (daysLeft === 2) return { phase: "ready", tasks: [{ kind: "mock", size: 65, fresh: true }, srs] };
    if (daysLeft <= 6) return { phase: "sim", tasks: daysLeft % 2 === 0 ? [{ kind: "mock", size: 65 }, srs] : weakDay };
    return { phase: "weak", tasks: weakDay };
  }

  // "Request more": the n-th request adds one bonus task, alternating a
  // next-weakest topic (rank 1, 2, ...) and a 30-question mock.
  function extraTasks(n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(i % 2 === 0 ? { kind: "weak", size: 20, rank: i / 2 + 1, extra: true } : { kind: "mock", size: 30, extra: true });
    }
    return out;
  }

  // Which mock tasks are satisfied by the mocks completed today (their sizes).
  // Largest task first, each taking the smallest mock that is big enough.
  function assignMocks(tasks, mockSizes) {
    const pool = mockSizes.slice().sort((a, b) => a - b);
    const done = tasks.map(() => false);
    tasks.map((t, i) => [t, i]).filter(([t]) => t.kind === "mock")
      .sort(([a], [b]) => b.size - a.size)
      .forEach(([t, i]) => {
        const j = pool.findIndex((s) => s >= t.size);
        if (j >= 0) { done[i] = true; pool.splice(j, 1); }
      });
    return done;
  }

  // Consecutive fully-done days up to today (today counts only once finished).
  function streak(doneDays, today) {
    let day = (doneDays || {})[today] ? today : srsAddDays(today, -1);
    let n = 0;
    while ((doneDays || {})[day]) { n++; day = srsAddDays(day, -1); }
    return n;
  }

  const api = {
    daysBetween, planForDay, extraTasks, EXAM_WEIGHTS, domainQuota, pickByDomain, rankTopics, assignMocks, streak,
    CONF_LEVELS, buildFirstSeen, isFreshIn, freshSplit, confidenceMatrix, shakyIds,
    SRS_SESSION_CAP, srsAddDays, srsEnqueue, srsReview, srsApplyMock, srsAdd, srsDue,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Metrics = api;
})(typeof self !== "undefined" ? self : this);
