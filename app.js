// Mock Test Trainer - single-file vanilla JS app.
// Persistence: localStorage (browser equivalent of the mock_test/ folder).

const STORAGE_KEY = "mocktest:store:v1";
const QUESTIONS_URL = "source/questions.json";
const EXAM_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

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
    if (!raw) return { mocks: [], favorites: [] };
    const parsed = JSON.parse(raw);
    if (!parsed.mocks) parsed.mocks = [];
    if (!parsed.favorites) parsed.favorites = [];
    return parsed;
  } catch {
    return { mocks: [], favorites: [] };
  }
}

function isFav(qid) {
  return state.store.favorites.includes(qid);
}
function toggleFav(qid) {
  const i = state.store.favorites.indexOf(qid);
  if (i >= 0) state.store.favorites.splice(i, 1);
  else state.store.favorites.push(qid);
  saveStore();
  return i < 0; // returns new state
}
function clearFavorites() {
  state.store.favorites = [];
  saveStore();
}
function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.store));
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

function generateMock() {
  const ids = shuffle(state.questions.map((q) => q.id));
  const mock = {
    id: nextMockId(),
    createdAt: new Date().toISOString(),
    questionIds: ids,
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

  let mode = "all"; // "all" | "fav"
  let studyMode = "study"; // "study" | "quiz"
  let order = baseOrder();
  let idx = 0;
  // Per-session quiz state, keyed by question id.
  // { ans: [letters], submitted: bool, correct: bool }
  const quizState = new Map();
  let sessionCorrect = 0;
  let sessionAttempted = 0;

  const card = $("#flashcard", root);
  const front = $(".card-front", root);
  const back = $(".card-back", root);
  const counter = $("#card-counter", root);
  const favBtn = $("#card-fav", root);
  const favCount = $("#fav-count", root);
  const modeAll = $("#mode-all", root);
  const modeFav = $("#mode-fav", root);
  const studyBtn = $("#study-mode", root);
  const quizBtn = $("#quiz-mode", root);
  const scoreEl = $("#quiz-score", root);
  const favListWrap = $("#fav-list-wrap", root);
  const favList = $("#fav-list", root);
  const favListCount = $("#fav-list-count", root);

  function baseOrder() {
    if (mode === "fav") {
      // Preserve favorite-add order from the store.
      return state.store.favorites.slice();
    }
    return state.questions.map((q) => q.id);
  }

  function refreshFavCount() {
    favCount.textContent = state.store.favorites.length;
  }

  function show() {
    card.classList.remove("flipped");
    if (order.length === 0) {
      front.innerHTML = `<h3>Favorites</h3><div class="qtext muted">No favorites yet. Star a card from "All" mode to add it here.</div>`;
      back.innerHTML = "";
      counter.textContent = `0 / 0`;
      favBtn.style.display = "none";
      return;
    }
    favBtn.style.display = "";
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
            if (submitted && isCorrect) cls += " reveal-correct";
            if (submitted && isC && !isCorrect) cls += " reveal-wrong";
            const mark = submitted ? (isCorrect ? " ✓" : (isC ? " ✗" : "")) : "";
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
      ? `<button class="primary" id="quiz-flip-btn">Flip for explanation →</button>`
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
      });
    }
    const flipBtn = $("#quiz-flip-btn", front);
    if (flipBtn) {
      flipBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.add("flipped");
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
    const fav = isFav(order[idx]);
    favBtn.classList.toggle("active", fav);
    favBtn.textContent = fav ? "★" : "☆";
    favBtn.title = fav ? "Remove from favorites (F)" : "Mark as favorite (F)";
  }

  function refreshFavList() {
    const ids = state.store.favorites;
    favListCount.textContent = `(${ids.length})`;
    if (ids.length === 0) {
      favList.innerHTML = `<span class="empty">No favorites yet.</span>`;
      return;
    }
    favList.innerHTML = ids.map((qid) => {
      const q = state.byId.get(qid);
      if (!q) return "";
      return `<li data-qid="${qid}">
        <span class="star">★</span>
        <div><div class="qid">Q${q.id}</div><div class="qtxt">${escapeHtml(q.question)}</div></div>
        <button class="ghost remove-fav" data-qid="${qid}" title="Remove from favorites">✕</button>
      </li>`;
    }).join("");
    favList.querySelectorAll("li").forEach((li) => {
      const qid = parseInt(li.dataset.qid, 10);
      li.addEventListener("click", (e) => {
        if (e.target.closest(".remove-fav")) return;
        const i = order.indexOf(qid);
        if (i >= 0) { idx = i; show(); }
        else { // Not in current order (e.g. mode=fav and list is stale); rebuild
          order = baseOrder();
          idx = Math.max(0, order.indexOf(qid));
          show();
        }
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    favList.querySelectorAll(".remove-fav").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const qid = parseInt(btn.dataset.qid, 10);
        toggleFav(qid);
        afterFavChange();
      });
    });
  }

  function afterFavChange() {
    refreshFavCount();
    refreshFavList();
    if (mode === "fav") {
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
    favListWrap.hidden = mode !== "fav";
    order = baseOrder();
    idx = 0;
    show();
    if (mode === "fav") refreshFavList();
  }

  function next() { if (order.length === 0) return; idx = (idx + 1) % order.length; show(); }
  function prev() { if (order.length === 0) return; idx = (idx - 1 + order.length) % order.length; show(); }
  function flip() { if (order.length === 0) return; card.classList.toggle("flipped"); }

  card.addEventListener("click", (e) => {
    if (e.target.closest(".fav-btn")) return;
    if (studyMode === "quiz") {
      // In quiz mode, only allow flipping after the user has submitted via the
      // explicit "Flip for explanation" button — prevents accidental flips
      // while choosing options.
      return;
    }
    flip();
  });
  favBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (order.length === 0) return;
    toggleFav(order[idx]);
    afterFavChange();
  });
  $("#card-flip", root).addEventListener("click", (e) => { e.stopPropagation(); flip(); });
  $("#card-next", root).addEventListener("click", next);
  $("#card-prev", root).addEventListener("click", prev);
  $("#card-shuffle", root).addEventListener("click", () => { order = shuffle(order); idx = 0; show(); });
  $("#card-reset", root).addEventListener("click", () => { order = baseOrder(); idx = 0; show(); });
  modeAll.addEventListener("click", () => setMode("all"));
  modeFav.addEventListener("click", () => setMode("fav"));
  studyBtn.addEventListener("click", () => setStudyMode("study"));
  quizBtn.addEventListener("click", () => setStudyMode("quiz"));
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
      toggleFav(order[idx]);
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
      const scoreText = m.status === "completed" && m.score != null
        ? `${m.score.correct}/${m.score.total} (${m.score.pct}%)`
        : "—";
      li.innerHTML = `
        <div>
          <div class="mname">${m.id}</div>
          <div class="meta">${fmtDate(m.createdAt)} · ${m.questionIds.length} questions · Score: ${scoreText}</div>
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

  $("#generate-mock", root).addEventListener("click", () => {
    const m = generateMock();
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
    progressEl.textContent = `${answeredCount()} of ${mock.questionIds.length} answered`;
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
    qpane.innerHTML = `
      <div class="qhead">
        <span class="qid">Question ${curIdx + 1} / ${mock.questionIds.length} · Source #${q.id}</span>
      </div>
      <div class="qtext">${escapeHtml(q.question)}</div>
      ${q.multi ? `<div class="multi-hint">Select all that apply.</div>` : ""}
      <div class="choices">
        ${q.choices.map((c) => `
          <label class="choice ${chosen.has(c.letter) ? "selected" : ""}">
            <input type="${inputType}" name="ans" value="${c.letter}" ${chosen.has(c.letter) ? "checked" : ""} />
            <span><b>${c.letter}.</b> ${escapeHtml(c.text)}</span>
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
    const remaining = q.choices.filter((c) => !placed.has(c.letter));

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
  const endMs = startMs + EXAM_DURATION_MS;
  let timerHandle = null;
  function tick() {
    const remaining = endMs - Date.now();
    timerEl.textContent = fmtClock(remaining);
    timerEl.classList.toggle("warn", remaining > 0 && remaining < 15 * 60 * 1000);
    timerEl.classList.toggle("crit", remaining > 0 && remaining < 5 * 60 * 1000);
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
      const yourAns = ans.length ? ans.join(isOrdering(q) ? " → " : ", ") : "—";
      const correctStr = q.correct.join(isOrdering(q) ? " → " : ", ");
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
        body = `
          <div>${q.choices.map((c) => {
            const isCorrect = q.correct.includes(c.letter);
            const chosen = ans.includes(c.letter);
            let cls = "opt";
            if (isCorrect) cls += " correct";
            else if (chosen) cls += " chosen-wrong";
            const mark = isCorrect ? "✓" : (chosen ? "✗" : "");
            return `<div class="${cls}"><b>${c.letter}.</b> ${escapeHtml(c.text)} ${mark}</div>`;
          }).join("")}</div>
          <div class="muted small" style="margin-top:8px;">Your answer: ${yourAns} · Correct: ${correctStr}</div>
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

  const failIds = allFailedIds();
  const info = $("#mini-info", root);
  const pane = $("#mini-pane", root);

  if (failIds.length === 0) {
    info.textContent = "No failed questions yet. Complete a mock test first, then come back here.";
    return;
  }

  info.textContent = `Drilling ${failIds.length} unique question(s) you previously got wrong or skipped (most-missed first).`;

  let idx = 0;
  const answers = {}; // qid -> [letters]
  const decided = new Set(); // qid -> revealed

  function render() {
    const qid = failIds[idx];
    const q = state.byId.get(qid);
    const revealed = decided.has(qid);
    const typeLabel = isOrdering(q) ? "Ordering" : q.multi ? "Multi-answer" : "Single answer";

    if (isOrdering(q)) {
      const seq = (answers[qid] || []).slice();
      const placed = new Set(seq);
      const remaining = q.choices.filter((c) => !placed.has(c.letter));
      const isCorrect = revealed && arrayEqual(seq, q.correct);

      pane.innerHTML = `
        <div class="qpane">
          <div class="qhead">
            <span class="qid">Practice ${idx + 1} / ${failIds.length} · Source #${q.id}</span>
            <span class="muted small">${typeLabel}</span>
          </div>
          <div class="qtext">${escapeHtml(q.question)}</div>
          <div class="multi-hint">Click options below in the correct order.</div>

          <div class="order-section">
            <label class="order-label">Your order (${seq.length} / ${q.choices.length})${revealed ? (isCorrect ? ` · <span class="ok">Correct!</span>` : ` · <span class="bad">Not quite</span>`) : ""}</label>
            <ol class="order-slots">
              ${seq.length === 0
                ? `<li class="order-empty">Click options below to start.</li>`
                : seq.map((letter, i) => {
                    const c = q.choices.find((x) => x.letter === letter);
                    const cls = revealed ? (q.correct[i] === letter ? "correct" : "wrong") : "";
                    return `<li class="order-slot ${cls}">
                      <span class="order-num">${i + 1}.</span>
                      <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                      ${revealed
                        ? `<span class="order-mark">${q.correct[i] === letter ? "✓" : "✗"}</span>`
                        : `<button class="order-remove" data-pos="${i}" title="Remove">✕</button>`}
                    </li>`;
                  }).join("")}
            </ol>
          </div>

          ${!revealed ? `
            <div class="order-section">
              <label class="order-label">Remaining options</label>
              <div class="order-pool">
                ${remaining.length === 0
                  ? `<div class="muted small" style="padding:10px;">All options placed. Click "Check / Reveal" to verify.</div>`
                  : remaining.map((c) => `
                    <button class="order-option" data-letter="${c.letter}">
                      <b>${c.letter}.</b> ${escapeHtml(c.text)}
                    </button>`).join("")}
              </div>
            </div>` : `
            <div class="order-section">
              <label class="order-label">Correct order</label>
              <ol class="order-slots compact correct-list">
                ${q.correct.map((letter, i) => {
                  const c = q.choices.find((x) => x.letter === letter);
                  return `<li class="order-slot">
                    <span class="order-num">${i + 1}.</span>
                    <span class="order-text"><b>${letter}.</b> ${escapeHtml(c ? c.text : "")}</span>
                  </li>`;
                }).join("")}
              </ol>
            </div>`}

          ${revealed && q.explanation ? `<div class="explanation muted" style="margin-top:12px; font-style:italic;">${escapeHtml(q.explanation)}</div>` : ""}
          <div class="qfoot">
            <button id="mini-prev" ${idx === 0 ? "disabled" : ""}>← Prev</button>
            <button id="mini-check">${revealed ? "Hide answer" : "Check / Reveal"}</button>
            <button id="mini-next" class="primary" ${idx === failIds.length - 1 ? "disabled" : ""}>Next →</button>
          </div>
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
            <span class="qid">Practice ${idx + 1} / ${failIds.length} · Source #${q.id}</span>
            <span class="muted small">${typeLabel}</span>
          </div>
          <div class="qtext">${escapeHtml(q.question)}</div>
          <div class="choices">
            ${q.choices.map((c) => {
              const isCorrect = q.correct.includes(c.letter);
              const isChosen = chosen.has(c.letter);
              let cls = "choice";
              if (isChosen) cls += " selected";
              if (revealed && isCorrect) cls += " selected";
              return `<label class="${cls}">
                <input type="${inputType}" name="mini" value="${c.letter}" ${isChosen ? "checked" : ""} ${revealed ? "disabled" : ""} />
                <span><b>${c.letter}.</b> ${escapeHtml(c.text)} ${revealed && isCorrect ? "✓" : ""} ${revealed && isChosen && !isCorrect ? "✗" : ""}</span>
              </label>`;
            }).join("")}
          </div>
          ${revealed && q.explanation ? `<div class="explanation muted" style="margin-top:12px; font-style:italic;">${escapeHtml(q.explanation)}</div>` : ""}
          <div class="qfoot">
            <button id="mini-prev" ${idx === 0 ? "disabled" : ""}>← Prev</button>
            <button id="mini-check">${revealed ? "Hide answer" : "Check / Reveal"}</button>
            <button id="mini-next" class="primary" ${idx === failIds.length - 1 ? "disabled" : ""}>Next →</button>
          </div>
        </div>
      `;
      pane.querySelectorAll('input[name="mini"]').forEach((input) => {
        input.addEventListener("change", () => {
          const inputs = pane.querySelectorAll('input[name="mini"]');
          const selected = Array.from(inputs).filter((i) => i.checked).map((i) => i.value);
          answers[qid] = selected;
          pane.querySelectorAll(".choice").forEach((label, i) => {
            label.classList.toggle("selected", inputs[i].checked);
          });
        });
      });
    }

    $("#mini-prev", pane).addEventListener("click", () => { if (idx > 0) { idx--; render(); } });
    $("#mini-next", pane).addEventListener("click", () => { if (idx < failIds.length - 1) { idx++; render(); } });
    $("#mini-check", pane).addEventListener("click", () => {
      if (decided.has(qid)) decided.delete(qid);
      else decided.add(qid);
      render();
    });
  }
  render();
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

// ---------- boot ----------
async function boot() {
  try {
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
