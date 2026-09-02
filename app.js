// Mock Test Trainer - single-file vanilla JS app.
// Persistence: localStorage (browser equivalent of the mock_test/ folder).

const STORAGE_KEY = "mocktest:store:v2";
const QUESTIONS_URL = "source/questions.json";
function examDurationMs(mock) {
  return mock.questionIds.length * 2 * 60 * 1000; // ~2 min/question, matches real exam pacing
}

const state = {
  questions: [],
  byId: new Map(),
  store: loadStore(),
  view: null,           // current view object (with cleanup())
  current: { mockId: null }, // ephemeral selection
};

// ---------- storage ----------
function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mocks: [], favorites: [], criticals: [] };
    const parsed = JSON.parse(raw);
    if (!parsed.mocks) parsed.mocks = [];
    if (!parsed.favorites) parsed.favorites = [];
    if (!parsed.criticals) parsed.criticals = [];
    return parsed;
  } catch {
    return { mocks: [], favorites: [], criticals: [] };
  }
}

// Favorites have two levels: 1 = normal, 2 = critical (repeatedly missed).
// criticals is a subset of favorites — anything critical is also a favorite.
function isFav(qid) {
  return state.store.favorites.includes(qid);
}
function isCritical(qid) {
  return state.store.criticals.includes(qid);
}
function getFavLevel(qid) {
  if (isCritical(qid)) return 2;
  if (isFav(qid)) return 1;
  return 0;
}
function setFavLevel(qid, level) {
  const favs = state.store.favorites;
  const crits = state.store.criticals;
  const fi = favs.indexOf(qid);
  const ci = crits.indexOf(qid);
  if (level <= 0) {
    if (fi >= 0) favs.splice(fi, 1);
    if (ci >= 0) crits.splice(ci, 1);
  } else if (level === 1) {
    if (fi < 0) favs.push(qid);
    if (ci >= 0) crits.splice(ci, 1);
  } else { // 2
    if (fi < 0) favs.push(qid);
    if (ci < 0) crits.push(qid);
  }
  saveStore();
}
function clearFavorites() {
  state.store.favorites = [];
  state.store.criticals = [];
  saveStore();
}
function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.store));
  scheduleProgressSync();
}

// ---------- utilities ----------
function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}
function dateStamp(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const DISPLAY_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// Reorder a question's choices by `orderLetters` (an array of original
// letters). Null/empty order => original order. Any choice missing from the
// order is appended so nothing is ever dropped.
function orderedChoices(q, orderLetters) {
  if (!orderLetters || !orderLetters.length) return q.choices.slice();
  const byLetter = new Map(q.choices.map((c) => [c.letter, c]));
  const out = orderLetters.map((l) => byLetter.get(l)).filter(Boolean);
  for (const c of q.choices) if (!out.includes(c)) out.push(c);
  return out;
}
// For single/multi questions: reorder AND relabel A/B/C/... by display
// position so labels read top-to-bottom. `value` stays the ORIGINAL letter,
// since answers are stored and scored by it.
function displayChoices(q, orderLetters) {
  return orderedChoices(q, orderLetters).map((c, i) => ({
    value: c.letter,
    label: DISPLAY_LETTERS[i] || c.letter,
    text: c.text,
  }));
}
// Translate original letters into their display labels for a given order, so
// review screens ("Correct: B") match what the user actually saw.
function toDisplayLabels(q, orderLetters, letters) {
  const map = new Map(displayChoices(q, orderLetters).map((d) => [d.value, d.label]));
  return letters.map((l) => map.get(l) || l);
}
function setEqual(a, b) {
  if (a.length !== b.length) return false;
  const A = new Set(a);
  for (const x of b) if (!A.has(x)) return false;
  return true;
}
function arrayEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function isOrdering(q) { return q.type === "ordering"; }
function matches(q, ans) {
  // ans is the user's answer array.
  if (!ans || ans.length === 0) return false;
  return isOrdering(q) ? arrayEqual(ans, q.correct) : setEqual(ans, q.correct);
}
function fmtClock(ms) {
  if (ms < 0) ms = 0;
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}
function fmtDuration(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h}h ${m}m ${s}s`;
  if (m) return `${m}m ${s}s`;
  return `${s}s`;
}

// ---------- mock creation ----------
function nextMockId() {
  const stamp = dateStamp();
  const prefix = `mocktest_${stamp}_`;
  let max = 0;
  for (const m of state.store.mocks) {
    if (m.id.startsWith(prefix)) {
      const n = parseInt(m.id.slice(prefix.length), 10);
      if (!isNaN(n) && n > max) max = n;
    }
  }
  const seq = String(max + 1).padStart(2, "0");
  return prefix + seq;
}

function generateMock(ids, examSet) {
  const shuffled = shuffle(ids);
  // Per-question display order for the choices, so the answer isn't always in
  // the same spot. Stored on the mock so resume/review stay consistent.
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
    status: "pending", // pending | in_progress | completed
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

// Choice display order for a mock, generated lazily for mocks created before
// this feature existed.
function examChoiceOrder(mock, q) {
  if (!mock.choiceOrders) mock.choiceOrders = {};
  if (!mock.choiceOrders[q.id]) {
    mock.choiceOrders[q.id] = shuffle(q.choices.map((c) => c.letter));
    saveStore();
  }
  return mock.choiceOrders[q.id];
}

function getMock(id) {
  return state.store.mocks.find((m) => m.id === id);
}

function deleteMock(id) {
  state.store.mocks = state.store.mocks.filter((m) => m.id !== id);
  saveStore();
}

function scoreMock(mock) {
  let correct = 0;
  let unanswered = 0;
  const failed = [];
  for (const qid of mock.questionIds) {
    const q = state.byId.get(qid);
    const ans = mock.answers[qid] || [];
    if (ans.length === 0) {
      unanswered++;
      failed.push(qid);
      continue;
    }
    if (matches(q, ans)) correct++;
    else failed.push(qid);
  }
  const total = mock.questionIds.length;
  const wrong = total - correct - unanswered;
  return {
    correct,
    wrong,
    unanswered,
    total,
    pct: total ? Math.round((correct / total) * 1000) / 10 : 0,
    failed,
  };
}

function allFailedIds() {
  const set = new Map(); // qid -> count
  for (const m of state.store.mocks) {
    if (m.status !== "completed") continue;
    for (const qid of m.failedIds) {
      set.set(qid, (set.get(qid) || 0) + 1);
    }
  }
  return [...set.entries()].sort((a, b) => b[1] - a[1]).map(([qid]) => qid);
}

// ---------- routing ----------
const ROUTES = {
  home: renderHome,
  learn: renderLearn,
  mocks: renderMocks,
  mockStart: renderMockStart,
  exam: renderExam,
  results: renderResults,
  mini: renderMini,
  courses: renderCourses,
  courseModules: renderCourseModules,
  courseLesson: renderCourseLesson,
};

function navigate(name, params = {}) {
  if (state.view && state.view.cleanup) {
    try { state.view.cleanup(); } catch {}
  }
  state.view = null;
  const root = $("#view");
  root.innerHTML = "";
  const renderer = ROUTES[name];
  if (!renderer) {
    root.textContent = "Unknown view: " + name;
    return;
  }
  state.view = renderer(root, params) || {};
}

function mountTemplate(id) {
  const tpl = document.getElementById(id);
  return tpl.content.firstElementChild.cloneNode(true);
}

// Top-bar nav delegation.
document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-nav]");
  if (!target) return;
  e.preventDefault();
  navigate(target.dataset.nav);
});

// ---------- HOME ----------
function renderHome(root) {
  const el = mountTemplate("tpl-home");
  root.appendChild(el);
  const stats = $("#home-stats", root);
  const mocks = state.store.mocks;
  const completed = mocks.filter((m) => m.status === "completed").length;
  const failed = allFailedIds().length;
  stats.innerHTML = `
    <span>${state.questions.length} questions loaded</span>
    <span>${mocks.length} mock${mocks.length === 1 ? "" : "s"} generated</span>
    <span>${completed} completed</span>
    <span>${failed} unique failed questions for mini-practice</span>
  `;
}

// ---------- LEARN (flashcards) ----------
function renderLearn(root) {
  const el = mountTemplate("tpl-learn");
  root.appendChild(el);

  let mode = "all"; // "all" | "fav" | "critical" | "unfav"
  let setFilter = "all"; // "all" | "1".."6"
  let studyMode = "study"; // "study" | "quiz"
  let order = baseOrder();
  let idx = 0;
  // Per-session quiz state, keyed by question id.
  // { ans: [letters], submitted: bool, correct: bool }
  const quizState = new Map();
  let sessionCorrect = 0;
  let sessionAttempted = 0;
  // Per-session "studied" tracking (study mode): a card counts once its answer
  // has been revealed by flipping. Resets on navigation/reload.
  const seen = new Set();

  const card = $("#flashcard", root);
  const front = $(".card-front", root);
  const back = $(".card-back", root);
  const counter = $("#card-counter", root);
  const favBtn = $("#card-fav", root);
  const critBtn = $("#card-critical", root);
  const favCount = $("#fav-count", root);
  const critCount = $("#crit-count", root);
  const modeAll = $("#mode-all", root);
  const modeFav = $("#mode-fav", root);
  const modeCritical = $("#mode-critical", root);
  const modeUnfav = $("#mode-unfav", root);
  const setSelect = $("#learn-set-select", root);
  const studyBtn = $("#study-mode", root);
  const quizBtn = $("#quiz-mode", root);
  const scoreEl = $("#quiz-score", root);
  const progressEl = $("#learn-progress", root);
  const favListWrap = $("#fav-list-wrap", root);
  const favListCount = $("#fav-list-count", root);

  function baseOrder() {
    let ids;
    if (mode === "fav") {
      // Preserve favorite-add order from the store.
      ids = state.store.favorites.slice();
    } else if (mode === "critical") {
      ids = state.store.criticals.slice();
    } else if (mode === "unfav") {
      // Everything not starred yet — the part still to review.
      const favSet = new Set(state.store.favorites);
      ids = state.questions.map((q) => q.id).filter((id) => !favSet.has(id));
    } else {
      ids = state.questions.map((q) => q.id);
    }
    if (setFilter !== "all") {
      const setNum = parseInt(setFilter, 10);
      ids = ids.filter((id) => state.byId.get(id).set === setNum);
    }
    return ids;
  }

  function refreshFavCount() {
    favCount.textContent = state.store.favorites.length;
    critCount.textContent = state.store.criticals.length;
  }

  function show() {
    card.classList.remove("flipped");
    if (order.length === 0) {
      const emptyMsg = mode === "fav"
        ? `No favorites yet. Star a card from "All" mode to add it here.`
        : mode === "critical"
        ? `No critical questions yet. Cycle the star to 🔥 on cards you keep missing.`
        : mode === "unfav"
        ? `All caught up — every question is starred.`
        : `No questions loaded.`;
      const heading = mode === "fav" ? "Favorites" : mode === "critical" ? "Critical" : mode === "unfav" ? "Not starred" : "Flash Cards";
      front.innerHTML = `<h3>${heading}</h3><div class="qtext muted">${emptyMsg}</div>`;
      back.innerHTML = "";
      counter.textContent = `0 / 0`;
      favBtn.style.display = "none";
      critBtn.style.display = "none";
      updateProgress();
      return;
    }
    favBtn.style.display = "";
    critBtn.style.display = "";
    const q = state.byId.get(order[idx]);
    const tag = isOrdering(q) ? " · ordering" : q.multi ? " · multi-answer" : "";

    if (studyMode === "quiz") {
      renderQuizFront(q);
    } else {
      front.innerHTML = `
        <h3>Question ${q.id}${tag}</h3>
        <div class="qtext">${escapeHtml(q.question)}</div>
        <ol class="choices" type="A">
          ${q.choices.map((c) => `<li><b>${c.letter}.</b> ${escapeHtml(c.text)}</li>`).join("")}
        </ol>
      `;
    }

    if (isOrdering(q)) {
      back.innerHTML = `
        <h3>Correct order · Question ${q.id}</h3>
        <ol class="choices ordered-answer">
          ${q.correct.map((letter) => {
            const c = q.choices.find((x) => x.letter === letter);
            return `<li><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</li>`;
          }).join("")}
        </ol>
        ${q.explanation ? `<div class="explanation">${escapeHtml(q.explanation)}</div>` : ""}
      `;
    } else {
      back.innerHTML = `
        <h3>Answer · Question ${q.id}</h3>
        <div class="answer-block"><b>Correct:</b> ${q.correct.join(", ")}</div>
        <ol class="choices" type="A">
          ${q.choices.map((c) => {
            const ok = q.correct.includes(c.letter);
            return `<li><b>${c.letter}.</b> ${escapeHtml(c.text)} ${ok ? "✓" : ""}</li>`;
          }).join("")}
        </ol>
        ${q.explanation ? `<div class="explanation">${escapeHtml(q.explanation)}</div>` : ""}
      `;
    }
    counter.textContent = `${idx + 1} / ${order.length}`;
    syncFavBtn();
    updateScore();
    updateProgress();
  }

  function updateProgress() {
    const total = order.length;
    if (total === 0) { progressEl.textContent = ""; return; }
    let done, label;
    if (studyMode === "quiz") {
      label = "Answered";
      done = order.filter((qid) => { const qs = quizState.get(qid); return qs && qs.submitted; }).length;
    } else {
      label = "Studied";
      done = order.filter((qid) => seen.has(qid)).length;
    }
    progressEl.textContent = `${label} ${done} / ${total} · ${total - done} left`;
  }

  function getQuiz(qid) {
    if (!quizState.has(qid)) quizState.set(qid, { ans: [], submitted: false, correct: false });
    return quizState.get(qid);
  }

  function renderQuizFront(q) {
    const tag = isOrdering(q) ? " · ordering" : q.multi ? " · multi-answer" : "";
    const qs = getQuiz(q.id);
    const submitted = qs.submitted;

    let inputsHtml;
    if (isOrdering(q)) {
      const placed = new Set(qs.ans);
      const remaining = q.choices.filter((c) => !placed.has(c.letter));
      inputsHtml = `
        <div class="quiz-hint muted small">Click options in the order you think is correct.</div>
        <div class="order-section">
          <label class="order-label">Your order (${qs.ans.length} / ${q.choices.length})</label>
          <ol class="order-slots">
            ${qs.ans.length === 0
              ? `<li class="order-empty">Click options below to start.</li>`
              : qs.ans.map((letter, i) => {
                  const c = q.choices.find((x) => x.letter === letter);
                  const cls = submitted ? (q.correct[i] === letter ? "correct" : "wrong") : "";
                  return `<li class="order-slot ${cls}">
                    <span class="order-num">${i + 1}.</span>
                    <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                    ${submitted
                      ? `<span class="order-mark">${q.correct[i] === letter ? "✓" : "✗"}</span>`
                      : `<button class="order-remove" data-pos="${i}" title="Remove">✕</button>`}
                  </li>`;
                }).join("")}
          </ol>
        </div>
        ${!submitted ? `
          <div class="order-section">
            <label class="order-label">Remaining options</label>
            <div class="order-pool">
              ${remaining.length === 0
                ? `<div class="muted small" style="padding:8px;">All placed. Press Check.</div>`
                : remaining.map((c) => `
                  <button class="order-option" data-letter="${c.letter}">
                    <b>${c.letter}.</b> ${escapeHtml(c.text)}
                  </button>`).join("")}
            </div>
          </div>` : ""}
      `;
    } else {
      const chosen = new Set(qs.ans);
      const inputType = q.multi ? "checkbox" : "radio";
      inputsHtml = `
        ${q.multi ? `<div class="quiz-hint muted small">Select all that apply.</div>` : ""}
        <div class="choices quiz-choices">
          ${q.choices.map((c) => {
            const isC = chosen.has(c.letter);
            const isCorrect = q.correct.includes(c.letter);
            let cls = "choice";
            if (isC) cls += " selected";
            if (submitted && isCorrect && isC) cls += " reveal-correct";
            if (submitted && isCorrect && !isC) cls += " reveal-missed";
            if (submitted && isC && !isCorrect) cls += " reveal-wrong";
            let mark = "";
            if (submitted) {
              if (isCorrect && isC) mark = " ✓";
              else if (isCorrect && !isC) mark = " ✓ (you missed this)";
              else if (isC) mark = " ✗";
            }
            return `<label class="${cls}">
              <input type="${inputType}" name="quiz-${q.id}" value="${c.letter}" ${isC ? "checked" : ""} ${submitted ? "disabled" : ""} />
              <span><b>${c.letter}.</b> ${escapeHtml(c.text)}${mark}</span>
            </label>`;
          }).join("")}
        </div>
      `;
    }

    const verdict = submitted
      ? (qs.correct
          ? `<div class="verdict ok">✓ Correct!</div>`
          : `<div class="verdict bad">✗ Not quite${isOrdering(q) ? "" : ` — correct: ${q.correct.join(", ")}`}</div>`)
      : "";

    const actions = submitted
      ? `<button id="quiz-retry-btn">↺ Try again</button>
         <button class="primary" id="quiz-flip-btn">Flip for explanation →</button>`
      : `<button class="primary" id="quiz-submit">Check answer</button>`;

    front.innerHTML = `
      <h3>Question ${q.id}${tag}</h3>
      <div class="qtext">${escapeHtml(q.question)}</div>
      ${inputsHtml}
      ${verdict}
      <div class="quiz-actions">${actions}</div>
    `;

    if (isOrdering(q)) {
      front.querySelectorAll(".order-option").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          qs.ans = qs.ans.concat(btn.dataset.letter);
          renderQuizFront(q);
        });
      });
      front.querySelectorAll(".order-remove").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const pos = parseInt(btn.dataset.pos, 10);
          qs.ans = qs.ans.slice(0, pos).concat(qs.ans.slice(pos + 1));
          renderQuizFront(q);
        });
      });
    } else {
      front.querySelectorAll(`input[name="quiz-${q.id}"]`).forEach((input) => {
        input.addEventListener("click", (e) => e.stopPropagation());
        input.addEventListener("change", () => {
          const inputs = front.querySelectorAll(`input[name="quiz-${q.id}"]`);
          qs.ans = Array.from(inputs).filter((i) => i.checked).map((i) => i.value);
          // light update without full rerender
          front.querySelectorAll(".quiz-choices .choice").forEach((label, i) => {
            label.classList.toggle("selected", inputs[i].checked);
          });
        });
      });
      front.querySelectorAll(".quiz-choices .choice").forEach((label) => {
        label.addEventListener("click", (e) => e.stopPropagation());
      });
    }

    const submitBtn = $("#quiz-submit", front);
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (qs.ans.length === 0) return;
        qs.submitted = true;
        qs.correct = matches(q, qs.ans);
        sessionAttempted++;
        if (qs.correct) sessionCorrect++;
        renderQuizFront(q);
        updateScore();
        updateProgress();
      });
    }
    const flipBtn = $("#quiz-flip-btn", front);
    if (flipBtn) {
      flipBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.add("flipped");
      });
    }
    const retryBtn = $("#quiz-retry-btn", front);
    if (retryBtn) {
      retryBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Undo this question's previous attempt from the session tally so the
        // retry is scored fresh rather than double-counted.
        if (qs.submitted) {
          sessionAttempted = Math.max(0, sessionAttempted - 1);
          if (qs.correct) sessionCorrect = Math.max(0, sessionCorrect - 1);
        }
        qs.ans = [];
        qs.submitted = false;
        qs.correct = false;
        card.classList.remove("flipped");
        renderQuizFront(q);
        updateScore();
        updateProgress();
      });
    }
  }

  function updateScore() {
    if (studyMode === "quiz") {
      scoreEl.hidden = false;
      scoreEl.textContent = `Session: ${sessionCorrect}/${sessionAttempted}${sessionAttempted ? ` (${Math.round((sessionCorrect / sessionAttempted) * 100)}%)` : ""}`;
    } else {
      scoreEl.hidden = true;
    }
  }

  function syncFavBtn() {
    if (order.length === 0) return;
    const level = getFavLevel(order[idx]);
    favBtn.classList.toggle("active", level >= 1);
    favBtn.textContent = level >= 1 ? "★" : "☆";
    favBtn.title = level >= 1 ? "Remove from favorites (F)" : "Mark as favorite (F)";
    critBtn.classList.toggle("active", level === 2);
    critBtn.title = level === 2 ? "Remove critical mark (C)" : "Mark as critical (C)";
  }

  function refreshFavList() {
    let ids = state.store.favorites;
    if (setFilter !== "all") {
      const setNum = parseInt(setFilter, 10);
      ids = ids.filter((id) => state.byId.get(id).set === setNum);
    }
    favListCount.textContent = `(${ids.length})`;
  }

  function afterFavChange() {
    refreshFavCount();
    refreshFavList();
    if (mode === "fav" || mode === "critical" || mode === "unfav") {
      // The active deck changes whenever the level changes: fav/critical/unfav
      // may gain or lose the current card.
      const currentQid = order[idx];
      order = baseOrder();
      // try to stay close to where we were
      const newIdx = order.indexOf(currentQid);
      idx = newIdx >= 0 ? newIdx : Math.min(idx, Math.max(0, order.length - 1));
      show();
    } else {
      syncFavBtn();
    }
  }

  function setMode(next) {
    if (mode === next) return;
    mode = next;
    modeAll.classList.toggle("active", mode === "all");
    modeFav.classList.toggle("active", mode === "fav");
    modeCritical.classList.toggle("active", mode === "critical");
    modeUnfav.classList.toggle("active", mode === "unfav");
    favListWrap.hidden = mode !== "fav";
    order = baseOrder();
    idx = 0;
    show();
    if (mode === "fav") refreshFavList();
  }

  function next() { if (order.length === 0) return; idx = (idx + 1) % order.length; show(); }
  function prev() { if (order.length === 0) return; idx = (idx - 1 + order.length) % order.length; show(); }
  function flip() {
    if (order.length === 0) return;
    card.classList.toggle("flipped");
    // Reveal in study mode marks the card as studied.
    if (studyMode === "study" && card.classList.contains("flipped")) {
      seen.add(order[idx]);
      updateProgress();
    }
  }

  card.addEventListener("click", (e) => {
    if (e.target.closest(".fav-btn")) return;
    if (studyMode === "quiz") {
      // In quiz mode, flipping forward to the explanation is done via the
      // explicit "Flip for explanation" button — prevents accidental reveals
      // while choosing options. But once flipped, clicking the card flips back.
      if (card.classList.contains("flipped")) flip();
      return;
    }
    flip();
  });
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (order.length === 0) return;
    // Star toggles the favorite status. Removing the star also drops critical.
    const qid = order[idx];
    setFavLevel(qid, isFav(qid) ? 0 : 1);
    afterFavChange();
  });
  critBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (order.length === 0) return;
    // Critical toggle: ON → level 2 (also a favorite). OFF → level 1 (keeps the
    // normal star) so users can demote without losing the favorite mark.
    const qid = order[idx];
    setFavLevel(qid, isCritical(qid) ? 1 : 2);
    afterFavChange();
  });
  $("#card-flip", root).addEventListener("click", (e) => { e.stopPropagation(); flip(); });
  $("#card-next", root).addEventListener("click", next);
  $("#card-prev", root).addEventListener("click", prev);
  $("#card-shuffle", root).addEventListener("click", () => { order = shuffle(order); idx = 0; show(); });
  $("#card-reset", root).addEventListener("click", () => { order = baseOrder(); idx = 0; show(); });
  modeAll.addEventListener("click", () => setMode("all"));
  modeFav.addEventListener("click", () => setMode("fav"));
  modeCritical.addEventListener("click", () => setMode("critical"));
  modeUnfav.addEventListener("click", () => setMode("unfav"));
  setSelect.addEventListener("change", () => {
    setFilter = setSelect.value;
    order = baseOrder();
    idx = 0;
    show();
    if (mode === "fav") refreshFavList();
  });
  studyBtn.addEventListener("click", () => setStudyMode("study"));
  quizBtn.addEventListener("click", () => setStudyMode("quiz"));
  $("#fav-shuffle", root).addEventListener("click", () => {
    // Shuffle only the favorites deck (the fav panel is shown in fav mode only).
    if (order.length === 0) return;
    order = shuffle(baseOrder());
    idx = 0;
    show();
  });
  $("#fav-reset-order", root).addEventListener("click", () => {
    // Restore the original favorite-add order (baseOrder in fav mode).
    if (order.length === 0) return;
    order = baseOrder();
    idx = 0;
    show();
  });
  $("#fav-reset", root).addEventListener("click", () => {
    const n = state.store.favorites.length;
    if (n === 0) return;
    if (!confirm(`Remove all ${n} favorite${n === 1 ? "" : "s"}? This cannot be undone.`)) return;
    clearFavorites();
    afterFavChange();
  });

  function setStudyMode(next) {
    if (studyMode === next) return;
    studyMode = next;
    studyBtn.classList.toggle("active", studyMode === "study");
    quizBtn.classList.toggle("active", studyMode === "quiz");
    show();
  }

  function onKey(e) {
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else if (e.key === " " || e.key === "Enter") {
      // Skip flip in quiz mode; user uses the explicit button to flip after submit.
      if (studyMode === "quiz") return;
      e.preventDefault();
      flip();
    }
    else if (e.key === "f" || e.key === "F") {
      if (order.length === 0) return;
      const qid = order[idx];
      setFavLevel(qid, isFav(qid) ? 0 : 1);
      afterFavChange();
    }
    else if (e.key === "c" || e.key === "C") {
      if (order.length === 0) return;
      const qid = order[idx];
      setFavLevel(qid, isCritical(qid) ? 1 : 2);
      afterFavChange();
    }
  }
  document.addEventListener("keydown", onKey);

  refreshFavCount();
  refreshFavList();
  show();
  return { cleanup() { document.removeEventListener("keydown", onKey); } };
}

// ---------- MOCKS LIST ----------
function renderMocks(root) {
  const el = mountTemplate("tpl-mocks");
  root.appendChild(el);

  const list = $("#mock-list", root);
  function refresh() {
    const mocks = state.store.mocks.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (mocks.length === 0) {
      list.innerHTML = `<li class="muted" style="display:block; text-align:center;">No mock tests yet. Click "Generate New Mock Test".</li>`;
      return;
    }
    list.innerHTML = "";
    for (const m of mocks) {
      const li = document.createElement("li");
      const total = m.questionIds.length;
      const answered = m.questionIds.filter((qid) => (m.answers[qid] || []).length > 0).length;
      let progressText;
      if (m.status === "completed" && m.score != null) {
        progressText = `Score: ${m.score.correct}/${m.score.total} (${m.score.pct}%)`;
      } else if (m.status === "in_progress") {
        progressText = `Answered ${answered} / ${total} · ${total - answered} left`;
      } else {
        progressText = `Not started · ${total} left`;
      }
      const setLabel = m.examSet == null ? "" : (m.examSet === "random" ? "Random · " : "Set " + m.examSet + " · ");
      li.innerHTML = `
        <div>
          <div class="mname">${m.id}</div>
          <div class="meta">${fmtDate(m.createdAt)} · ${setLabel}${total} questions · ${progressText}</div>
        </div>
        <span class="badge ${m.status}">${m.status.replace("_", " ")}</span>
        <button class="open">Open</button>
        <button class="danger del">Delete</button>
      `;
      li.querySelector(".open").addEventListener("click", () => {
        if (m.status === "completed") navigate("results", { mockId: m.id });
        else navigate("mockStart", { mockId: m.id });
      });
      li.querySelector(".del").addEventListener("click", () => {
        if (confirm(`Delete ${m.id}?`)) { deleteMock(m.id); refresh(); }
      });
      list.appendChild(li);
    }
  }

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

  refresh();
}

// ---------- MOCK START (briefing) ----------
function renderMockStart(root, { mockId }) {
  const mock = getMock(mockId);
  if (!mock) { navigate("mocks"); return; }
  const el = mountTemplate("tpl-mock-start");
  root.appendChild(el);

  $("#mock-name", root).textContent = mock.id;
  $("#mock-count", root).textContent = mock.questionIds.length;
  $("#mock-time", root).textContent = fmtDuration(examDurationMs(mock));
  $("#mock-created", root).textContent = fmtDate(mock.createdAt);
  $("#mock-status", root).textContent = mock.status.replace("_", " ");

  const startBtn = $("#mock-start-btn", root);
  if (mock.status === "completed") {
    startBtn.textContent = "▶ Review Results";
    startBtn.addEventListener("click", () => navigate("results", { mockId }));
  } else {
    startBtn.addEventListener("click", () => {
      mock.status = "in_progress";
      mock.startedAt = new Date().toISOString();
      saveStore();
      navigate("exam", { mockId });
    });
    if (mock.status === "in_progress") {
      startBtn.textContent = "▶ Resume Exam";
    }
  }

  $("#mock-delete", root).addEventListener("click", () => {
    if (confirm(`Delete ${mock.id}?`)) { deleteMock(mock.id); navigate("mocks"); }
  });

  $("#mock-download", root).addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(mock, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = mock.id + ".json"; a.click();
    URL.revokeObjectURL(url);
  });
}

// ---------- EXAM ----------
function renderExam(root, { mockId }) {
  const mock = getMock(mockId);
  if (!mock) { navigate("mocks"); return; }
  if (!mock.startedAt) {
    mock.startedAt = new Date().toISOString();
    mock.status = "in_progress";
    saveStore();
  }

  const el = mountTemplate("tpl-exam");
  root.appendChild(el);

  $("#exam-name", root).textContent = mock.id;
  const timerEl = $("#exam-timer", root);
  const qpane = $("#qpane", root);
  const qnav = $("#qnav", root);
  const progressEl = $("#exam-progress", root);
  const submitBtn = $("#exam-submit", root);

  let curIdx = 0;

  function answeredCount() {
    return mock.questionIds.filter((qid) => (mock.answers[qid] || []).length > 0).length;
  }
  function refreshNav() {
    qnav.innerHTML = "";
    mock.questionIds.forEach((qid, i) => {
      const b = document.createElement("button");
      b.textContent = i + 1;
      if ((mock.answers[qid] || []).length > 0) b.classList.add("answered");
      if (i === curIdx) b.classList.add("current");
      b.addEventListener("click", () => { curIdx = i; renderQ(); });
      qnav.appendChild(b);
    });
    progressEl.textContent = `${answeredCount()} of ${mock.questionIds.length} answered · ${mock.questionIds.length - answeredCount()} left`;
  }

  function renderQ() {
    const qid = mock.questionIds[curIdx];
    const q = state.byId.get(qid);

    if (isOrdering(q)) {
      renderOrderingQ(qid, q);
      return;
    }

    const chosen = new Set(mock.answers[qid] || []);
    const inputType = q.multi ? "checkbox" : "radio";
    const dcs = displayChoices(q, examChoiceOrder(mock, q));
    qpane.innerHTML = `
      <div class="qhead">
        <span class="qid">Question ${curIdx + 1} / ${mock.questionIds.length} · Source #${q.id}</span>
      </div>
      <div class="qtext">${escapeHtml(q.question)}</div>
      ${q.multi ? `<div class="multi-hint">Select all that apply.</div>` : ""}
      <div class="choices">
        ${dcs.map((c) => `
          <label class="choice ${chosen.has(c.value) ? "selected" : ""}">
            <input type="${inputType}" name="ans" value="${c.value}" ${chosen.has(c.value) ? "checked" : ""} />
            <span><b>${c.label}.</b> ${escapeHtml(c.text)}</span>
          </label>`).join("")}
      </div>
      <div class="qfoot">
        <button id="q-prev" ${curIdx === 0 ? "disabled" : ""}>← Previous</button>
        <button id="q-clear">Clear answer</button>
        <button id="q-next" class="primary" ${curIdx === mock.questionIds.length - 1 ? "disabled" : ""}>Next →</button>
      </div>
    `;
    qpane.querySelectorAll('input[name="ans"]').forEach((input) => {
      input.addEventListener("change", () => {
        const inputs = qpane.querySelectorAll('input[name="ans"]');
        const selected = Array.from(inputs).filter((i) => i.checked).map((i) => i.value);
        mock.answers[qid] = selected;
        saveStore();
        qpane.querySelectorAll(".choice").forEach((label, i) => {
          label.classList.toggle("selected", inputs[i].checked);
        });
        refreshNav();
      });
    });
    $("#q-prev", qpane).addEventListener("click", () => { if (curIdx > 0) { curIdx--; renderQ(); refreshNav(); } });
    $("#q-next", qpane).addEventListener("click", () => { if (curIdx < mock.questionIds.length - 1) { curIdx++; renderQ(); refreshNav(); } });
    $("#q-clear", qpane).addEventListener("click", () => {
      delete mock.answers[qid];
      saveStore();
      renderQ();
      refreshNav();
    });
    refreshNav();
  }

  function renderOrderingQ(qid, q) {
    const sequence = (mock.answers[qid] || []).slice();
    const placed = new Set(sequence);
    // Ordering keeps original letters (the answer is a letter sequence); only
    // the pool's starting arrangement is shuffled.
    const remaining = orderedChoices(q, examChoiceOrder(mock, q)).filter((c) => !placed.has(c.letter));

    qpane.innerHTML = `
      <div class="qhead">
        <span class="qid">Question ${curIdx + 1} / ${mock.questionIds.length} · Source #${q.id}</span>
        <span class="muted small">Ordering</span>
      </div>
      <div class="qtext">${escapeHtml(q.question)}</div>
      <div class="multi-hint">Click the options below in the order you think is correct.</div>

      <div class="order-section">
        <label class="order-label">Your order (${sequence.length} / ${q.choices.length})</label>
        <ol class="order-slots">
          ${sequence.length === 0
            ? `<li class="order-empty">Click options below to start building your sequence.</li>`
            : sequence.map((letter, i) => {
                const c = q.choices.find((x) => x.letter === letter);
                return `<li class="order-slot" data-pos="${i}">
                  <span class="order-num">${i + 1}.</span>
                  <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                  <button class="order-remove" data-pos="${i}" title="Remove">✕</button>
                </li>`;
              }).join("")}
        </ol>
      </div>

      <div class="order-section">
        <label class="order-label">Remaining options</label>
        <div class="order-pool">
          ${remaining.length === 0
            ? `<div class="muted small" style="padding:10px;">All options placed.</div>`
            : remaining.map((c) => `
              <button class="order-option" data-letter="${c.letter}">
                <b>${c.letter}.</b> ${escapeHtml(c.text)}
              </button>`).join("")}
        </div>
      </div>

      <div class="qfoot">
        <button id="q-prev" ${curIdx === 0 ? "disabled" : ""}>← Previous</button>
        <button id="q-clear">Clear order</button>
        <button id="q-next" class="primary" ${curIdx === mock.questionIds.length - 1 ? "disabled" : ""}>Next →</button>
      </div>
    `;

    function persist(newSeq) {
      if (newSeq.length === 0) delete mock.answers[qid];
      else mock.answers[qid] = newSeq;
      saveStore();
      renderOrderingQ(qid, q);
      refreshNav();
    }

    qpane.querySelectorAll(".order-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newSeq = sequence.concat(btn.dataset.letter);
        persist(newSeq);
      });
    });
    qpane.querySelectorAll(".order-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pos = parseInt(btn.dataset.pos, 10);
        const newSeq = sequence.slice(0, pos).concat(sequence.slice(pos + 1));
        persist(newSeq);
      });
    });
    $("#q-prev", qpane).addEventListener("click", () => { if (curIdx > 0) { curIdx--; renderQ(); refreshNav(); } });
    $("#q-next", qpane).addEventListener("click", () => { if (curIdx < mock.questionIds.length - 1) { curIdx++; renderQ(); refreshNav(); } });
    $("#q-clear", qpane).addEventListener("click", () => persist([]));
    refreshNav();
  }

  // Timer
  const startMs = new Date(mock.startedAt).getTime();
  const durationMs = examDurationMs(mock);
  const endMs = startMs + durationMs;
  let timerHandle = null;
  function tick() {
    const remaining = endMs - Date.now();
    timerEl.textContent = fmtClock(remaining);
    timerEl.classList.toggle("warn", remaining > 0 && remaining < durationMs * (15 / 130));
    timerEl.classList.toggle("crit", remaining > 0 && remaining < durationMs * (5 / 130));
    if (remaining <= 0) {
      clearInterval(timerHandle);
      timerHandle = null;
      finalize(true);
    }
  }
  timerHandle = setInterval(tick, 500);
  tick();

  function finalize(timeExpired) {
    mock.endedAt = new Date().toISOString();
    const s = scoreMock(mock);
    mock.score = { correct: s.correct, wrong: s.wrong, unanswered: s.unanswered, total: s.total, pct: s.pct };
    mock.failedIds = s.failed;
    mock.status = "completed";
    saveStore();
    if (timeExpired) alert("Time's up. The exam has been submitted automatically.");
    navigate("results", { mockId });
  }

  submitBtn.addEventListener("click", () => {
    const remaining = mock.questionIds.length - answeredCount();
    const msg = remaining > 0
      ? `${remaining} question(s) are unanswered. Submit anyway?`
      : "Submit your exam?";
    if (confirm(msg)) finalize(false);
  });

  renderQ();

  return {
    cleanup() {
      if (timerHandle) clearInterval(timerHandle);
    },
  };
}

// ---------- RESULTS ----------
function renderResults(root, { mockId }) {
  const mock = getMock(mockId);
  if (!mock) { navigate("mocks"); return; }
  const el = mountTemplate("tpl-results");
  root.appendChild(el);

  const s = mock.score || scoreMock(mock);
  $("#result-name", root).textContent = mock.id;
  $("#result-score", root).innerHTML = `${s.pct}% <span class="muted small" style="font-size:14px;">(${s.correct}/${s.total})</span>`;
  $("#result-correct", root).textContent = s.correct;
  $("#result-wrong", root).textContent = s.wrong;
  $("#result-unanswered", root).textContent = s.unanswered;
  const elapsed = (new Date(mock.endedAt || Date.now())) - (new Date(mock.startedAt));
  $("#result-time", root).textContent = fmtDuration(elapsed);

  const list = $("#result-list", root);
  function render(filter) {
    list.innerHTML = "";
    mock.questionIds.forEach((qid, i) => {
      const q = state.byId.get(qid);
      const ans = mock.answers[qid] || [];
      const right = matches(q, ans);
      const kind = right ? "right" : "wrong";
      if (filter === "wrong" && right) return;
      if (filter === "right" && !right) return;
      const item = document.createElement("div");
      item.className = "result-item " + kind;
      const typeBadge = isOrdering(q) ? `<span class="muted small" style="margin-right:8px;">[Ordering]</span>` : "";

      let body;
      if (isOrdering(q)) {
        body = `
          <div class="order-review">
            <div class="order-review-col">
              <div class="muted small">Your order</div>
              <ol class="order-slots compact">
                ${ans.length === 0 ? `<li class="order-empty">Skipped</li>` : ans.map((letter, idx) => {
                  const c = q.choices.find((x) => x.letter === letter);
                  const isRight = q.correct[idx] === letter;
                  return `<li class="order-slot ${isRight ? "correct" : "wrong"}">
                    <span class="order-num">${idx + 1}.</span>
                    <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                    <span class="order-mark">${isRight ? "✓" : "✗"}</span>
                  </li>`;
                }).join("")}
              </ol>
            </div>
            <div class="order-review-col">
              <div class="muted small">Correct order</div>
              <ol class="order-slots compact correct-list">
                ${q.correct.map((letter, idx) => {
                  const c = q.choices.find((x) => x.letter === letter);
                  return `<li class="order-slot">
                    <span class="order-num">${idx + 1}.</span>
                    <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                  </li>`;
                }).join("")}
              </ol>
            </div>
          </div>
          ${q.explanation ? `<div class="explanation">${escapeHtml(q.explanation)}</div>` : ""}
        `;
      } else {
        const order = mock.choiceOrders && mock.choiceOrders[q.id];
        const dcs = displayChoices(q, order);
        const yourDisp = ans.length ? toDisplayLabels(q, order, ans).join(", ") : "—";
        const correctDisp = toDisplayLabels(q, order, q.correct).join(", ");
        body = `
          <div>${dcs.map((c) => {
            const isCorrect = q.correct.includes(c.value);
            const chosen = ans.includes(c.value);
            let cls = "opt";
            if (isCorrect) cls += " correct";
            else if (chosen) cls += " chosen-wrong";
            const mark = isCorrect ? "✓" : (chosen ? "✗" : "");
            return `<div class="${cls}"><b>${c.label}.</b> ${escapeHtml(c.text)} ${mark}</div>`;
          }).join("")}</div>
          <div class="muted small" style="margin-top:8px;">Your answer: ${yourDisp} · Correct: ${correctDisp}</div>
          ${q.explanation ? `<div class="explanation">${escapeHtml(q.explanation)}</div>` : ""}
        `;
      }

      item.innerHTML = `
        <div class="head">
          <span class="qid">${i + 1}. Q${q.id}</span>
          <span class="qtxt">${typeBadge}${escapeHtml(q.question)}</span>
          <span class="badge ${right ? "completed" : ""}" style="${right ? "color:var(--ok); border-color:var(--ok);" : "color:var(--bad); border-color:var(--bad);"}">${right ? "Correct" : (ans.length ? "Wrong" : "Skipped")}</span>
        </div>
        <div class="body">${body}</div>
      `;
      item.querySelector(".head").addEventListener("click", () => item.classList.toggle("open"));
      list.appendChild(item);
    });
  }

  $$("input[name='filter']", root).forEach((r) => {
    r.addEventListener("change", () => render(r.value));
  });
  render("all");
}

// ---------- MINI PRACTICE ----------
function renderMini(root) {
  const el = mountTemplate("tpl-mini");
  root.appendChild(el);

  const info = $("#mini-info", root);
  const progressEl = $("#mini-progress", root);
  const pane = $("#mini-pane", root);
  const srcFailedBtn = $("#mini-src-failed", root);
  const srcFavBtn = $("#mini-src-fav", root);
  const srcCriticalBtn = $("#mini-src-critical", root);
  const srcUnfavBtn = $("#mini-src-unfav", root);

  let source = "failed"; // "failed" | "fav" | "critical" | "unfav"
  let viewing = "practice"; // "practice" | "summary"
  let ids = [];
  let idx = 0;
  const answers = {}; // qid -> [letters]
  const choiceOrders = {}; // qid -> [letters], stable across this practice session
  function miniChoiceOrder(q) {
    if (!choiceOrders[q.id]) choiceOrders[q.id] = shuffle(q.choices.map((c) => c.letter));
    return choiceOrders[q.id];
  }

  function computeIds() {
    // "failed": most-missed across completed mocks (kept in that order).
    // "fav": starred questions (normal + critical), shuffled.
    // "critical": only critical-level questions, shuffled.
    // "unfav": questions not starred yet, shuffled.
    if (source === "fav") return shuffle(state.store.favorites);
    if (source === "critical") return shuffle(state.store.criticals);
    if (source === "unfav") {
      const favSet = new Set(state.store.favorites);
      return shuffle(state.questions.map((q) => q.id).filter((id) => !favSet.has(id)));
    }
    return allFailedIds();
  }

  // Human-readable noun for the current source, used in the info messages.
  function srcWord() {
    return source === "fav" ? "favorite"
      : source === "critical" ? "critical"
      : source === "unfav" ? "not-starred"
      : "most-missed";
  }

  function resetAnswers() {
    for (const k of Object.keys(answers)) delete answers[k];
  }

  function answeredCount() {
    return ids.filter((qid) => (answers[qid] || []).length > 0).length;
  }

  function updateProgress() {
    const total = ids.length;
    if (total === 0) { progressEl.textContent = ""; return; }
    if (viewing === "summary") {
      const correct = ids.filter((qid) => matches(state.byId.get(qid), answers[qid] || [])).length;
      progressEl.textContent = `Result: ${correct} / ${total} correct`;
      return;
    }
    const done = answeredCount();
    progressEl.textContent = `Answered ${done} / ${total} · ${total - done} left`;
  }

  // Footer shared by both question types (no reveal during the test).
  function miniFoot() {
    return `
      <div class="qfoot">
        <button id="mini-prev" ${idx === 0 ? "disabled" : ""}>← Prev</button>
        <button id="mini-next" ${idx === ids.length - 1 ? "disabled" : ""}>Next →</button>
        <button id="mini-submit" class="primary">🏁 Submit</button>
      </div>
    `;
  }

  function submit() {
    const remaining = ids.length - answeredCount();
    const msg = remaining > 0
      ? `${remaining} question(s) are unanswered. Submit anyway?`
      : "Submit and see your result?";
    if (!confirm(msg)) return;
    viewing = "summary";
    idx = 0;
    render();
  }

  function render() {
    if (ids.length === 0) {
      info.textContent = source === "fav"
        ? "No favorites yet. Star questions in Flash Cards, then come back here."
        : source === "critical"
        ? "No critical questions yet. Cycle the star to 🔥 on cards you keep missing."
        : source === "unfav"
        ? "Nothing to review here — every question is starred."
        : "No failed questions yet. Complete a mock test first, then come back here.";
      pane.innerHTML = "";
      updateProgress();
      return;
    }
    if (viewing === "summary") { renderSummary(); return; }

    info.textContent = `Answer all ${ids.length} ${srcWord()} question(s), then Submit to see your result.`;

    const qid = ids[idx];
    const q = state.byId.get(qid);
    const typeLabel = isOrdering(q) ? "Ordering" : q.multi ? "Multi-answer" : "Single answer";

    if (isOrdering(q)) {
      const seq = (answers[qid] || []).slice();
      const placed = new Set(seq);
      const remaining = orderedChoices(q, miniChoiceOrder(q)).filter((c) => !placed.has(c.letter));

      pane.innerHTML = `
        <div class="qpane">
          <div class="qhead">
            <span class="qid">Question ${idx + 1} / ${ids.length} · Source #${q.id}</span>
            <span class="muted small">${typeLabel}</span>
          </div>
          <div class="qtext">${escapeHtml(q.question)}</div>
          <div class="multi-hint">Click options below in the correct order.</div>

          <div class="order-section">
            <label class="order-label">Your order (${seq.length} / ${q.choices.length})</label>
            <ol class="order-slots">
              ${seq.length === 0
                ? `<li class="order-empty">Click options below to start.</li>`
                : seq.map((letter, i) => {
                    const c = q.choices.find((x) => x.letter === letter);
                    return `<li class="order-slot">
                      <span class="order-num">${i + 1}.</span>
                      <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                      <button class="order-remove" data-pos="${i}" title="Remove">✕</button>
                    </li>`;
                  }).join("")}
            </ol>
          </div>

          <div class="order-section">
            <label class="order-label">Remaining options</label>
            <div class="order-pool">
              ${remaining.length === 0
                ? `<div class="muted small" style="padding:10px;">All options placed.</div>`
                : remaining.map((c) => `
                  <button class="order-option" data-letter="${c.letter}">
                    <b>${c.letter}.</b> ${escapeHtml(c.text)}
                  </button>`).join("")}
            </div>
          </div>

          ${miniFoot()}
        </div>
      `;

      pane.querySelectorAll(".order-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          answers[qid] = seq.concat(btn.dataset.letter);
          render();
        });
      });
      pane.querySelectorAll(".order-remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pos = parseInt(btn.dataset.pos, 10);
          answers[qid] = seq.slice(0, pos).concat(seq.slice(pos + 1));
          render();
        });
      });
    } else {
      const chosen = new Set(answers[qid] || []);
      const inputType = q.multi ? "checkbox" : "radio";
      pane.innerHTML = `
        <div class="qpane">
          <div class="qhead">
            <span class="qid">Question ${idx + 1} / ${ids.length} · Source #${q.id}</span>
            <span class="muted small">${typeLabel}</span>
          </div>
          <div class="qtext">${escapeHtml(q.question)}</div>
          <div class="choices">
            ${displayChoices(q, miniChoiceOrder(q)).map((c) => {
              const isChosen = chosen.has(c.value);
              return `<label class="choice ${isChosen ? "selected" : ""}">
                <input type="${inputType}" name="mini" value="${c.value}" ${isChosen ? "checked" : ""} />
                <span><b>${c.label}.</b> ${escapeHtml(c.text)}</span>
              </label>`;
            }).join("")}
          </div>
          ${miniFoot()}
        </div>
      `;
      pane.querySelectorAll('input[name="mini"]').forEach((input) => {
        input.addEventListener("change", () => {
          const inputs = pane.querySelectorAll('input[name="mini"]');
          answers[qid] = Array.from(inputs).filter((i) => i.checked).map((i) => i.value);
          pane.querySelectorAll(".choice").forEach((label, i) => {
            label.classList.toggle("selected", inputs[i].checked);
          });
        });
      });
    }

    $("#mini-prev", pane).addEventListener("click", () => { if (idx > 0) { idx--; render(); } });
    $("#mini-next", pane).addEventListener("click", () => { if (idx < ids.length - 1) { idx++; render(); } });
    $("#mini-submit", pane).addEventListener("click", submit);
    updateProgress();
  }

  // Results screen shown only after Submit — this is where answers are revealed.
  function renderSummary() {
    let correct = 0, wrong = 0, skipped = 0;
    ids.forEach((qid) => {
      const ans = answers[qid] || [];
      if (ans.length === 0) skipped++;
      else if (matches(state.byId.get(qid), ans)) correct++;
      else wrong++;
    });
    const total = ids.length;
    const pct = total ? Math.round((correct / total) * 1000) / 10 : 0;
    info.textContent = source === "fav"
      ? "Favorites practice — result"
      : source === "critical"
      ? "Critical practice — result"
      : source === "unfav"
      ? "Not-starred practice — result"
      : "Most-missed practice — result";

    pane.innerHTML = `
      <div class="scoreboard">
        <div class="score-card"><label>Score</label><div class="score">${pct}%</div></div>
        <div class="score-card"><label>Correct</label><div class="score ok">${correct}</div></div>
        <div class="score-card"><label>Wrong</label><div class="score bad">${wrong}</div></div>
        <div class="score-card"><label>Skipped</label><div class="score">${skipped}</div></div>
      </div>
      <div class="filter-row">
        <label><input type="radio" name="mini-filter" value="all" checked /> All</label>
        <label><input type="radio" name="mini-filter" value="wrong" /> Wrong only</label>
        <label><input type="radio" name="mini-filter" value="right" /> Correct only</label>
      </div>
      <div id="mini-result-list"></div>
      <div class="qfoot" style="margin-top:16px;">
        <button id="mini-retry" class="primary">↺ Retry these questions</button>
      </div>
    `;

    const listEl = $("#mini-result-list", pane);
    function renderList(filter) {
      listEl.innerHTML = "";
      ids.forEach((qid, i) => {
        const q = state.byId.get(qid);
        const ans = answers[qid] || [];
        const right = matches(q, ans);
        if (filter === "wrong" && right) return;
        if (filter === "right" && !right) return;
        const item = document.createElement("div");
        item.className = "result-item " + (right ? "right" : "wrong");
        const typeBadge = isOrdering(q) ? `<span class="muted small" style="margin-right:8px;">[Ordering]</span>` : "";

        let body;
        if (isOrdering(q)) {
          body = `
            <div class="order-review">
              <div class="order-review-col">
                <div class="muted small">Your order</div>
                <ol class="order-slots compact">
                  ${ans.length === 0 ? `<li class="order-empty">Skipped</li>` : ans.map((letter, j) => {
                    const c = q.choices.find((x) => x.letter === letter);
                    const isRight = q.correct[j] === letter;
                    return `<li class="order-slot ${isRight ? "correct" : "wrong"}">
                      <span class="order-num">${j + 1}.</span>
                      <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                      <span class="order-mark">${isRight ? "✓" : "✗"}</span>
                    </li>`;
                  }).join("")}
                </ol>
              </div>
              <div class="order-review-col">
                <div class="muted small">Correct order</div>
                <ol class="order-slots compact correct-list">
                  ${q.correct.map((letter, j) => {
                    const c = q.choices.find((x) => x.letter === letter);
                    return `<li class="order-slot">
                      <span class="order-num">${j + 1}.</span>
                      <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                    </li>`;
                  }).join("")}
                </ol>
              </div>
            </div>
            ${q.explanation ? `<div class="explanation">${escapeHtml(q.explanation)}</div>` : ""}
          `;
        } else {
          const order = miniChoiceOrder(q);
          const dcs = displayChoices(q, order);
          const yourDisp = ans.length ? toDisplayLabels(q, order, ans).join(", ") : "—";
          const correctDisp = toDisplayLabels(q, order, q.correct).join(", ");
          body = `
            <div>${dcs.map((c) => {
              const isCorrect = q.correct.includes(c.value);
              const chosen = ans.includes(c.value);
              let cls = "opt";
              if (isCorrect) cls += " correct";
              else if (chosen) cls += " chosen-wrong";
              const mark = isCorrect ? "✓" : (chosen ? "✗" : "");
              return `<div class="${cls}"><b>${c.label}.</b> ${escapeHtml(c.text)} ${mark}</div>`;
            }).join("")}</div>
            <div class="muted small" style="margin-top:8px;">Your answer: ${yourDisp} · Correct: ${correctDisp}</div>
            ${q.explanation ? `<div class="explanation">${escapeHtml(q.explanation)}</div>` : ""}
          `;
        }

        item.innerHTML = `
          <div class="head">
            <span class="qid">${i + 1}. Q${q.id}</span>
            <span class="qtxt">${typeBadge}${escapeHtml(q.question)}</span>
            <span class="badge" style="${right ? "color:var(--ok); border-color:var(--ok);" : "color:var(--bad); border-color:var(--bad);"}">${right ? "Correct" : (ans.length ? "Wrong" : "Skipped")}</span>
          </div>
          <div class="body">${body}</div>
        `;
        item.querySelector(".head").addEventListener("click", () => item.classList.toggle("open"));
        listEl.appendChild(item);
      });
    }

    pane.querySelectorAll("input[name='mini-filter']").forEach((r) => {
      r.addEventListener("change", () => renderList(r.value));
    });
    renderList("all");

    $("#mini-retry", pane).addEventListener("click", () => {
      resetAnswers();
      viewing = "practice";
      idx = 0;
      render();
    });
    updateProgress();
  }

  function setSource(next) {
    if (source === next) return;
    source = next;
    srcFailedBtn.classList.toggle("active", source === "failed");
    srcFavBtn.classList.toggle("active", source === "fav");
    srcCriticalBtn.classList.toggle("active", source === "critical");
    srcUnfavBtn.classList.toggle("active", source === "unfav");
    viewing = "practice";
    resetAnswers();
    ids = computeIds();
    idx = 0;
    render();
  }
  srcFailedBtn.addEventListener("click", () => setSource("failed"));
  srcFavBtn.addEventListener("click", () => setSource("fav"));
  srcCriticalBtn.addEventListener("click", () => setSource("critical"));
  srcUnfavBtn.addEventListener("click", () => setSource("unfav"));

  ids = computeIds();
  render();
}

// ---------- COURSES ----------
const COURSES_MANIFEST_URL = "source/courses/manifest.json";
const COURSE_BOOKMARKS_KEY = "mocktest:courseBookmarks";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
  return res.json();
}

// ---------- course lesson bookmarks ----------
function loadCourseBookmarks() {
  try {
    const raw = localStorage.getItem(COURSE_BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCourseBookmarks(bookmarks) {
  localStorage.setItem(COURSE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
  scheduleProgressSync();
}
function bookmarkKey({ courseSlug, moduleSlug, lessonIdx }) {
  return `${courseSlug}::${moduleSlug}::${lessonIdx}`;
}
function findCourseBookmark(bookmarks, entry) {
  const key = bookmarkKey(entry);
  return bookmarks.find((b) => bookmarkKey(b) === key);
}
function toggleCourseBookmark(entry) {
  const bookmarks = loadCourseBookmarks();
  const existing = findCourseBookmark(bookmarks, entry);
  let bookmarked;
  if (existing) {
    saveCourseBookmarks(bookmarks.filter((b) => b !== existing));
    bookmarked = false;
  } else {
    bookmarks.push({ ...entry, addedAt: new Date().toISOString() });
    saveCourseBookmarks(bookmarks);
    bookmarked = true;
  }
  return bookmarked;
}
function removeCourseBookmark(entry) {
  const bookmarks = loadCourseBookmarks();
  saveCourseBookmarks(bookmarks.filter((b) => bookmarkKey(b) !== bookmarkKey(entry)));
}

// ---------- course lesson "studied" progress ----------
const COURSE_PROGRESS_KEY = "mocktest:courseProgress";
function loadCourseProgress() {
  try {
    const raw = localStorage.getItem(COURSE_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveCourseProgress(done) {
  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(done));
  scheduleProgressSync();
}
function isLessonDone(entry) {
  return loadCourseProgress().includes(bookmarkKey(entry));
}
function setLessonDone(entry, done) {
  const key = bookmarkKey(entry);
  const list = loadCourseProgress();
  const i = list.indexOf(key);
  if (done && i < 0) list.push(key);
  else if (!done && i >= 0) list.splice(i, 1);
  saveCourseProgress(list);
}

function renderCourses(root) {
  const el = mountTemplate("tpl-courses");
  root.appendChild(el);
  const list = $("#courses-list", root);
  const bookmarksWrap = $("#course-bookmarks-wrap", root);
  const bookmarksList = $("#course-bookmarks-list", root);
  list.innerHTML = `<p class="muted">Loading…</p>`;

  function renderBookmarks() {
    const bookmarks = loadCourseBookmarks();
    if (bookmarks.length === 0) {
      bookmarksWrap.hidden = true;
      return;
    }
    bookmarksWrap.hidden = false;
    bookmarksList.innerHTML = bookmarks.map((b, i) => `
      <li data-idx="${i}">
        <div class="bookmark-info">
          <div class="bookmark-lesson">${escapeHtml(b.lessonTitle)}${isLessonDone(b) ? ` <span class="done-badge">✓ Studied</span>` : ""}</div>
          <div class="muted small">${escapeHtml(b.courseTitle)} · ${escapeHtml(b.moduleTitle)}</div>
        </div>
        <button class="ghost remove-bookmark" data-idx="${i}" title="Remove bookmark">✕</button>
      </li>
    `).join("");
    bookmarksList.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
        if (e.target.closest(".remove-bookmark")) return;
        const b = bookmarks[parseInt(li.dataset.idx, 10)];
        navigate("courseLesson", { courseSlug: b.courseSlug, moduleSlug: b.moduleSlug, lessonIdx: b.lessonIdx });
      });
    });
    bookmarksList.querySelectorAll(".remove-bookmark").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const b = bookmarks[parseInt(btn.dataset.idx, 10)];
        removeCourseBookmark(b);
        renderBookmarks();
      });
    });
  }
  renderBookmarks();

  fetchJson(COURSES_MANIFEST_URL)
    .then((courses) => {
      if (courses.length === 0) {
        list.innerHTML = `<p class="muted">No courses yet.</p>`;
        return;
      }
      list.innerHTML = "";
      for (const c of courses) {
        const card = document.createElement("button");
        card.className = "card course-card";
        card.innerHTML = `<h2>${escapeHtml(c.title)}</h2><p class="muted small">${escapeHtml(c.sourceUrl)}</p><p class="muted small course-progress"></p>`;
        card.addEventListener("click", () => navigate("courseModules", { courseSlug: c.slug }));
        list.appendChild(card);

        const progressEl = $(".course-progress", card);
        fetchJson(`source/courses/${c.slug}/manifest.json`)
          .then((course) => {
            let total = 0, done = 0;
            for (const m of course.modules) {
              m.lessons.forEach((l, i) => {
                total++;
                if (isLessonDone({ courseSlug: c.slug, moduleSlug: m.slug, lessonIdx: i })) done++;
              });
            }
            const { badge, bar, complete } = progressCardHtml(done, total);
            card.classList.toggle("complete", complete);
            card.insertAdjacentHTML("afterbegin", badge);
            progressEl.textContent = done > 0 ? `${done} / ${total} lessons studied` : `${total} lessons`;
            card.insertAdjacentHTML("beforeend", bar);
          })
          .catch(() => { progressEl.textContent = ""; });
      }
    })
    .catch((err) => {
      list.innerHTML = `<p class="muted">Failed to load courses: ${escapeHtml(err.message)}</p>`;
    });
}

// Progress bar + "Complete" badge markup shared by course and module cards.
function progressCardHtml(done, total) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;
  const badge = complete ? `<span class="complete-badge">✓ Complete</span>` : "";
  const bar = `<div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>`;
  return { badge, bar, complete };
}

function renderCourseModules(root, { courseSlug }) {
  const el = mountTemplate("tpl-course-modules");
  root.appendChild(el);
  const titleEl = $("#course-title", root);
  const sourceEl = $("#course-source", root);
  const list = $("#module-list", root);
  list.innerHTML = `<p class="muted">Loading…</p>`;

  fetchJson(`source/courses/${courseSlug}/manifest.json`)
    .then((course) => {
      titleEl.textContent = course.title;
      sourceEl.textContent = course.sourceUrl;
      list.innerHTML = "";
      course.modules.forEach((m) => {
        const doneCount = m.lessons.filter((l, i) => isLessonDone({ courseSlug, moduleSlug: m.slug, lessonIdx: i })).length;
        const { badge, bar, complete } = progressCardHtml(doneCount, m.lessons.length);
        const card = document.createElement("button");
        card.className = "card module-card" + (complete ? " complete" : "");
        card.innerHTML = `
          ${badge}
          <h2>${escapeHtml(m.title)}</h2>
          <p class="muted small">${m.lessons.length} lesson${m.lessons.length === 1 ? "" : "s"}${doneCount > 0 ? ` · ${doneCount} studied` : ""}</p>
          ${bar}
        `;
        card.addEventListener("click", () => navigate("courseLesson", { courseSlug, moduleSlug: m.slug, lessonIdx: 0 }));
        list.appendChild(card);
      });
    })
    .catch((err) => {
      list.innerHTML = `<p class="muted">Failed to load course: ${escapeHtml(err.message)}</p>`;
    });
}

const LESSON_FONT_SIZE_KEY = "mocktest:lessonFontSize";
const LESSON_FONT_SIZE_DEFAULT = 19;
const LESSON_FONT_SIZE_MIN = 12;
const LESSON_FONT_SIZE_MAX = 24;

function renderCourseLesson(root, { courseSlug, moduleSlug, lessonIdx }) {
  const el = mountTemplate("tpl-course-lesson");
  root.appendChild(el);
  const moduleTitleEl = $("#lesson-module-title", root);
  const navEl = $("#lesson-nav", root);
  const contentEl = $("#lesson-content", root);
  $("#lesson-back", root).addEventListener("click", () => navigate("courseModules", { courseSlug }));

  function applyLessonFontSize(px) {
    contentEl.style.setProperty("--lesson-font-size", px + "px");
  }
  let fontSize = parseInt(localStorage.getItem(LESSON_FONT_SIZE_KEY), 10);
  if (!fontSize || fontSize < LESSON_FONT_SIZE_MIN || fontSize > LESSON_FONT_SIZE_MAX) fontSize = LESSON_FONT_SIZE_DEFAULT;
  applyLessonFontSize(fontSize);
  function setFontSize(px) {
    fontSize = Math.min(LESSON_FONT_SIZE_MAX, Math.max(LESSON_FONT_SIZE_MIN, px));
    localStorage.setItem(LESSON_FONT_SIZE_KEY, String(fontSize));
    applyLessonFontSize(fontSize);
  }
  $("#font-size-dec", root).addEventListener("click", () => setFontSize(fontSize - 1));
  $("#font-size-inc", root).addEventListener("click", () => setFontSize(fontSize + 1));
  $("#font-size-reset", root).addEventListener("click", () => setFontSize(LESSON_FONT_SIZE_DEFAULT));

  contentEl.innerHTML = `<p class="muted">Loading…</p>`;

  fetchJson(`source/courses/${courseSlug}/manifest.json`)
    .then((course) => {
      const mod = course.modules.find((m) => m.slug === moduleSlug);
      if (!mod) throw new Error("Module not found: " + moduleSlug);
      moduleTitleEl.textContent = mod.title;

      function renderNav() {
        navEl.innerHTML = mod.lessons.map((l, i) => `
          <button class="lesson-nav-item ${i === lessonIdx ? "active" : ""}" data-idx="${i}">${isLessonDone({ courseSlug, moduleSlug, lessonIdx: i }) ? "✓ " : ""}${escapeHtml(l.title)}</button>
        `).join("");
        navEl.querySelectorAll(".lesson-nav-item").forEach((btn) => {
          btn.addEventListener("click", () => {
            navigate("courseLesson", { courseSlug, moduleSlug, lessonIdx: parseInt(btn.dataset.idx, 10) });
          });
        });
      }
      renderNav();

      const lesson = mod.lessons[lessonIdx];
      const lessonEntry = { courseSlug, moduleSlug, lessonIdx };

      const bookmarkBtn = $("#lesson-bookmark", root);
      const bookmarkEntry = { ...lessonEntry, courseTitle: course.title, moduleTitle: mod.title, lessonTitle: lesson.title };
      function syncBookmarkBtn() {
        const bookmarked = !!findCourseBookmark(loadCourseBookmarks(), bookmarkEntry);
        bookmarkBtn.classList.toggle("active", bookmarked);
        bookmarkBtn.textContent = bookmarked ? "★ Bookmarked" : "☆ Bookmark";
      }
      syncBookmarkBtn();
      bookmarkBtn.addEventListener("click", () => {
        toggleCourseBookmark(bookmarkEntry);
        syncBookmarkBtn();
      });

      const doneCheckbox = $("#lesson-done", root);
      doneCheckbox.checked = isLessonDone(lessonEntry);
      doneCheckbox.addEventListener("change", () => {
        setLessonDone(lessonEntry, doneCheckbox.checked);
        renderNav();
      });

      return fetch(`source/courses/${courseSlug}/${moduleSlug}/${lesson.slug}.md`)
        .then((res) => {
          if (!res.ok) throw new Error("HTTP " + res.status);
          return res.text();
        })
        .then((md) => {
          contentEl.innerHTML = mdToHtml(md);
          const prevBtn = lessonIdx > 0
            ? `<button id="lesson-prev">← ${escapeHtml(mod.lessons[lessonIdx - 1].title)}</button>` : "";
          const nextBtn = lessonIdx < mod.lessons.length - 1
            ? `<button id="lesson-next">${escapeHtml(mod.lessons[lessonIdx + 1].title)} →</button>` : "";
          contentEl.insertAdjacentHTML("beforeend", `<div class="lesson-footnav">${prevBtn}${nextBtn}</div>`);
          $("#lesson-prev", contentEl)?.addEventListener("click", () => navigate("courseLesson", { courseSlug, moduleSlug, lessonIdx: lessonIdx - 1 }));
          $("#lesson-next", contentEl)?.addEventListener("click", () => navigate("courseLesson", { courseSlug, moduleSlug, lessonIdx: lessonIdx + 1 }));
        });
    })
    .catch((err) => {
      contentEl.innerHTML = `<p class="muted">Failed to load lesson: ${escapeHtml(err.message)}</p>`;
    });
}

// Minimal markdown → HTML converter (headings, bold, bullet/numbered lists,
// paragraphs). Only handles the subset used by the course-notes files —
// not a general-purpose parser.
function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const htmlLines = [];
  let listType = null; // "ul" | "ol" | null
  function closeList() {
    if (listType) { htmlLines.push(listType === "ul" ? "</ul>" : "</ol>"); listType = null; }
  }
  function inline(text) {
    let out = escapeHtml(text);
    out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/`(.+?)`/g, "<code>$1</code>");
    return out;
  }
  for (const raw of lines) {
    const line = raw.trim();
    if (line === "") { closeList(); continue; }
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      closeList();
      const level = heading[1].length + 1; // markdown h1 -> html h2 (h1 is the page's own module title)
      htmlLines.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      if (listType !== "ul") { closeList(); htmlLines.push("<ul>"); listType = "ul"; }
      htmlLines.push(`<li>${inline(bullet[1])}</li>`);
      continue;
    }
    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      if (listType !== "ol") { closeList(); htmlLines.push("<ol>"); listType = "ol"; }
      htmlLines.push(`<li>${inline(numbered[1])}</li>`);
      continue;
    }
    closeList();
    htmlLines.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  return htmlLines.join("\n");
}

// ---------- helpers ----------
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// ---------- cross-device progress sync (via /api/progress on Vercel) ----------
// Last-write-wins whole-snapshot sync. Silently no-ops when the API is absent
// (local dev) or unreachable (offline).
const SYNC_META_KEY = "mocktest:syncMeta";
const SYNC_KEYS = [STORAGE_KEY, COURSE_BOOKMARKS_KEY, COURSE_PROGRESS_KEY];
let syncTimer = null;
let syncDirty = false;

function syncMeta() {
  try {
    return JSON.parse(localStorage.getItem(SYNC_META_KEY)) || { updatedAt: 0 };
  } catch {
    return { updatedAt: 0 };
  }
}
function syncSnapshot() {
  const data = {};
  for (const k of SYNC_KEYS) data[k] = localStorage.getItem(k);
  return data;
}
async function pushProgress() {
  syncDirty = false;
  clearTimeout(syncTimer);
  const updatedAt = Date.now();
  try {
    const res = await fetch("api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updatedAt, data: syncSnapshot() }),
      keepalive: true,
    });
    if (res.ok) localStorage.setItem(SYNC_META_KEY, JSON.stringify({ updatedAt }));
  } catch { /* offline or local dev */ }
}
function scheduleProgressSync() {
  syncDirty = true;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(pushProgress, 1500);
}
async function pullProgress() {
  try {
    const res = await fetch("api/progress", { cache: "no-store" });
    if (!res.ok) return;
    const remote = await res.json();
    if (!remote || !remote.data) {
      // Server is empty: seed it with whatever this device already has.
      if (SYNC_KEYS.some((k) => localStorage.getItem(k) != null)) pushProgress();
      return;
    }
    if (remote.updatedAt > syncMeta().updatedAt) {
      for (const k of SYNC_KEYS) {
        const v = remote.data[k];
        if (typeof v === "string") localStorage.setItem(k, v);
        else localStorage.removeItem(k);
      }
      localStorage.setItem(SYNC_META_KEY, JSON.stringify({ updatedAt: remote.updatedAt }));
      state.store = loadStore();
    }
  } catch { /* offline or local dev */ }
}
window.addEventListener("pagehide", () => {
  if (syncDirty) pushProgress();
});

// ---------- boot ----------
async function boot() {
  try {
    await pullProgress();
    const res = await fetch(QUESTIONS_URL);
    if (!res.ok) throw new Error("HTTP " + res.status);
    state.questions = await res.json();
    state.byId = new Map(state.questions.map((q) => [q.id, q]));
    navigate("home");
  } catch (err) {
    $("#view").innerHTML = `
      <div style="padding:24px; border:1px solid var(--bad); border-radius:10px; color:var(--bad);">
        <h2>Failed to load questions</h2>
        <p>${escapeHtml(err.message)}</p>
        <p class="muted">Serve this folder over HTTP (e.g. <code>python3 -m http.server</code>) and open <code>http://localhost:8000</code>. Opening <code>index.html</code> with <code>file://</code> won't load the question JSON due to browser security.</p>
      </div>
    `;
  }
}

boot();
