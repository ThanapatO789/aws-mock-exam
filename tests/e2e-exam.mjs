// End-to-end check that a mock never loses answers, in a real (headless) Chrome
// with its own throwaway profile and fake data — it never touches your browser
// or the real server.
//
//   node tests/e2e-exam.mjs [rootDir]
//
// Serves rootDir (default: repo) on 127.0.0.1 with the REAL api/progress.js
// handler backed by an in-memory Redis stand-in, then plays the scenarios that
// lost answers on 2026-11-14 plus everything around them:
//   answer · pause/resume x3 · another tab saves · another device pushes an old
//   copy · tab comes back to the foreground (pull) · reload mid-exam + Resume ·
//   submit · old device pushes again after submit.
// Exits 1 on any failed check.
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = path.resolve(process.argv[2] || REPO);
const N = 12; // questions in the test mock
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let failures = 0;
function check(label, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
  if (!ok) failures++;
}

// ---------- server: static files + real /api/progress + fake Upstash ----------
let kv = null; // the "Redis" value
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let body = "";
  for await (const c of req) body += c;
  if (url.pathname === "/kv") { // Upstash REST: ["GET", key] / ["SET", key, value]
    const [cmd, , val] = JSON.parse(body);
    if (cmd === "SET") kv = val;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ result: cmd === "GET" ? kv : "OK" }));
    return;
  }
  if (url.pathname === "/api/progress") {
    const shim = {
      statusCode: 200,
      setHeader: (k, v) => res.setHeader(k, v),
      status(c) { this.statusCode = c; return this; },
      json(o) { res.statusCode = this.statusCode; res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); },
    };
    await handler({ method: req.method, body: body ? JSON.parse(body) : undefined }, shim);
    return;
  }
  const file = path.join(ROOT, decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; res.end(); return; }
  res.setHeader("Content-Type", TYPES[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;
process.env.KV_REST_API_URL = BASE + "/kv";
process.env.KV_REST_API_TOKEN = "test";
const { default: handler } = await import(pathToFileURL(path.join(ROOT, "api/progress.js")).href);

// ---------- headless Chrome over the DevTools protocol ----------
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find((p) => fs.existsSync(p));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "e2e-chrome-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check", "about:blank"], { stdio: "ignore" });
let port;
for (let i = 0; i < 100 && !port; i++) {
  await sleep(100);
  try { port = fs.readFileSync(path.join(profile, "DevToolsActivePort"), "utf8").split("\n")[0]; } catch {}
}

async function openTab(url) {
  const t = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === "Page.javascriptDialogOpening") send("Page.handleJavaScriptDialog", { accept: true });
  });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Runtime.enable");
  await send("Page.enable");
  const ev = async (expr) => {
    const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(expr.slice(0, 80) + ": " + (r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text));
    return r.result.result.value;
  };
  const waitFor = async (expr, label, ms = 10000) => {
    for (let t = 0; t < ms; t += 100) { try { if (await ev(expr)) return; } catch {} await sleep(100); }
    throw new Error("timed out waiting for " + label);
  };
  return { ev, waitFor, send, errors, close: () => ws.close() };
}

// Helpers that act like the user (click the real buttons).
const click = (sel) => `(() => { const b = document.querySelector(${JSON.stringify(sel)}); if (!b) throw new Error(${JSON.stringify("no " + sel)}); b.click(); return true; })()`;
const progressText = `document.querySelector("#exam-progress").textContent`;
const answeredOnScreen = async (A) => parseInt(await A.ev(progressText), 10);
async function answerCurrent(A) { // pick the first choice of the current question, then Next
  await A.ev(`(() => { const i = document.querySelector('#qpane input[name="ans"]'); i.checked = true; i.dispatchEvent(new Event("change")); return true; })()`);
  await A.ev(`(() => { const n = document.querySelector("#q-next"); if (n && !n.disabled) n.click(); return true; })()`);
}
const storedMock = (A) => A.ev(`(() => { const s = JSON.parse(localStorage.getItem("mocktest:store:v2")); const m = s.mocks.find((x) => x.id === state.liveMock?.id || x.id === window.__mockId); return m && { status: m.status, endedAt: m.endedAt, answered: Object.values(m.answers).filter((a) => a.length).length, curIdx: m.curIdx, pausedMs: m.pausedMs || 0 }; })()`);
const serverMock = (id) => { const s = JSON.parse(JSON.parse(kv).data["mocktest:store:v2"]); const m = s.mocks.find((x) => x.id === id); return m && { status: m.status, endedAt: m.endedAt, answered: Object.values(m.answers).filter((a) => a.length).length }; };
// A second device that pulled at some point and now pushes its old copy with a stale base.
async function stalePush(snapshot) {
  await fetch(BASE + "/api/progress", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ updatedAt: Date.now(), base: snapshot.updatedAt, data: snapshot.data }) });
}

try {
  const A = await openTab(BASE + "/");
  await A.waitFor(`state.questions.length > 0 && state.routeName === "home"`, "boot");
  // Create a 12-question random mock through the Mock Tests page.
  await A.ev(click(`[data-nav="mocks"]`));
  await A.waitFor(`!!document.querySelector("#generate-mock")`, "mocks page");
  await A.ev(`(() => { const s = document.querySelector("#mock-set-select"); s.value = "random"; s.dispatchEvent(new Event("change")); document.querySelector("#mock-random-count").value = "${N}"; return true; })()`);
  await A.ev(click("#generate-mock"));
  await A.waitFor(`!!document.querySelector("#mock-start-btn")`, "mock start page");
  const mockId = await A.ev(`window.__mockId = state.store.mocks[state.store.mocks.length - 1].id`);
  await A.ev(click("#mock-start-btn"));
  await A.waitFor(`!!document.querySelector("#qpane input[name=ans]")`, "exam");

  await answerCurrent(A); await answerCurrent(A); // Q1, Q2
  await sleep(2000); // let the sync push go out
  const oldDevice = JSON.parse(kv); // "phone" pulls now: it holds a copy with 2 answers

  // Pause / resume #1
  await A.ev(click("#exam-pause")); await sleep(300);
  check("pause hides the questions", await A.ev(`document.querySelector(".exam-body").classList.contains("paused")`));
  await A.ev(click("#exam-pause"));
  await answerCurrent(A); // Q3

  // Another tab of the app saves something mid-exam (the trigger on 2026-11-14).
  const B = await openTab(BASE + "/");
  await B.waitFor(`state.questions.length > 0`, "tab B boot");
  await B.ev(`state.store.favorites.push(1); saveStore(); true`);
  await sleep(300);
  await answerCurrent(A); await answerCurrent(A); // Q4, Q5 — written after the other tab's save
  check("after another tab saved: screen shows 5 answered", (await answeredOnScreen(A)) === 5, await A.ev(progressText));
  check("after another tab saved: storage holds 5 answers", (await storedMock(A)).answered === 5, JSON.stringify(await storedMock(A)));

  // Pause / resume #2, then the old device pushes its 2-answer copy.
  await A.ev(click("#exam-pause")); await sleep(300); await A.ev(click("#exam-pause"));
  await sleep(2000);
  await stalePush(oldDevice);
  check("old device push doesn't cut answers on the server", serverMock(mockId).answered >= 5, JSON.stringify(serverMock(mockId)));
  // Tab comes back to the foreground: pulls (and may adopt) the server copy.
  await A.ev(`document.dispatchEvent(new Event("visibilitychange")); true`);
  await sleep(500);
  await answerCurrent(A); await answerCurrent(A); // Q6, Q7
  await sleep(2000); // push → server merges → client adopts the merged copy
  await answerCurrent(A); // Q8
  check("after sync merge + adopt: storage holds 8 answers", (await storedMock(A)).answered === 8, JSON.stringify(await storedMock(A)));

  // Reload mid-exam (or close and come back), then Resume.
  await A.send("Page.reload");
  await sleep(500);
  await A.waitFor(`state.questions.length > 0 && state.routeName === "home"`, "reboot");
  await A.ev(`window.__mockId = ${JSON.stringify(mockId)}; navigate("mockStart", { mockId: window.__mockId }); true`);
  await A.waitFor(`!!document.querySelector("#mock-start-btn")`, "mock start after reload");
  await A.ev(click("#mock-start-btn"));
  await A.waitFor(`!!document.querySelector("#qpane input[name=ans]")`, "exam after reload");
  check("after reload: screen still shows 8 answered", (await answeredOnScreen(A)) === 8, await A.ev(progressText));
  check("after reload: reopens at question 9 (where it was)", (await A.ev(`document.querySelector("#qpane .qid").textContent`)).startsWith("Question 9 "), await A.ev(`document.querySelector("#qpane .qid").textContent`));
  check("after reload: not paused, clock running", !(await A.ev(`document.querySelector(".exam-body").classList.contains("paused")`)));

  // Pause / resume #3, finish, submit.
  await A.ev(click("#exam-pause")); await sleep(300); await A.ev(click("#exam-pause"));
  for (let i = 8; i < N; i++) await answerCurrent(A);
  check(`before submit: screen shows ${N} answered`, (await answeredOnScreen(A)) === N, await A.ev(progressText));
  await A.ev(click("#exam-submit"));
  await A.waitFor(`!!document.querySelector("#review-submit")`, "review screen");
  await A.ev(`window.confirm = () => true; document.querySelector("#review-submit").click(); true`);
  await A.waitFor(`state.routeName === "results"`, "results");
  await sleep(2500);
  check("results page: 0 unanswered", (await A.ev(`document.querySelector("#result-unanswered").textContent.trim()`)) === "0", await A.ev(`document.querySelector("#result-unanswered").textContent`));
  const fin = await storedMock(A);
  check(`storage: completed with ${N} answers and an end time`, fin.status === "completed" && fin.answered === N && !!fin.endedAt, JSON.stringify(fin));
  check("storage: pauses recorded", fin.pausedMs > 0, `pausedMs ${fin.pausedMs}`);
  check(`server: completed with ${N} answers`, serverMock(mockId).status === "completed" && serverMock(mockId).answered === N, JSON.stringify(serverMock(mockId)));

  // The old device pushes its stale in-progress copy again, after the submit.
  await stalePush(oldDevice);
  check("old device after submit: server keeps the submitted mock", serverMock(mockId).status === "completed" && serverMock(mockId).answered === N, JSON.stringify(serverMock(mockId)));
  await A.ev(`document.dispatchEvent(new Event("visibilitychange")); true`);
  await sleep(800);
  const after = await A.ev(`(() => { const m = JSON.parse(localStorage.getItem("mocktest:store:v2")).mocks.find((x) => x.id === window.__mockId); return { status: m.status, answered: Object.values(m.answers).filter((a) => a.length).length }; })()`);
  check("old device after submit: this tab still has the submitted mock", after.status === "completed" && after.answered === N, JSON.stringify(after));

  if (fs.existsSync(path.join(ROOT, "source/summary-th.json"))) {
    await A.ev(click(`[data-nav="summary"]`));
    await A.waitFor(`document.querySelectorAll(".mm-sub").length > 0`, "summary page");
    if (process.env.SHOT) { // optional: save a screenshot of the Summary page for a visual check
      await A.send("Emulation.setDeviceMetricsOverride", { width: 1100, height: 1800, deviceScaleFactor: 1, mobile: false });
      await sleep(300);
      const shot = await A.send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(process.env.SHOT, Buffer.from(shot.result.data, "base64"));
    }
    check("summary page renders sub-topics with question counts", await A.ev(`document.querySelectorAll(".mm-sub").length > 0 && [...document.querySelectorAll(".mm-n")].some((b) => /ออก [1-9]/.test(b.textContent))`));
  }
  check("no JavaScript errors in the page",A.errors.length === 0 && B.errors.length === 0, [...A.errors, ...B.errors].join(" | "));
  A.close(); B.close();
} catch (e) {
  check("scenario ran to the end", false, e.message);
} finally {
  chrome.kill();
  server.close();
  await sleep(300);
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
}
console.log(failures ? `\n${failures} check(s) FAILED` : "\nall checks passed");
process.exit(failures ? 1 : 0);
