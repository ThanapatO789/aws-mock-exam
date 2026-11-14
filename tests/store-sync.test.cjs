// Regression test for lost mock answers (2026-11-14): when the store was
// replaced mid-exam (another tab saved, or a sync adopted the server copy), the
// exam view kept writing to an orphaned mock object and every later answer,
// plus endedAt, was lost. Runs the real store functions from app.js.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const src = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const grab = (name) => {
  const m = src.match(new RegExp("^function " + name + "[(][^]*?^}", "m"));
  assert.ok(m, "function " + name + " not found in app.js");
  return m[0];
};
const code = ["loadStore", "saveStore", "reloadStore", "attachLiveMock", "adoptRemote", "getMock"].map(grab).join("\n");

function examWithSwap(swap) {
  const ls = new Map();
  const ctx = {
    STORAGE_KEY: "s", SYNC_META_KEY: "m", SYNC_KEYS: ["s"],
    localStorage: { getItem: (k) => (ls.has(k) ? ls.get(k) : null), setItem: (k, v) => ls.set(k, String(v)), removeItem: (k) => ls.delete(k) },
    scheduleProgressSync() {},
    state: { store: null, liveMock: null },
  };
  vm.createContext(ctx);
  vm.runInContext(code, ctx);
  ls.set("s", JSON.stringify({ mocks: [{ id: "m1", questionIds: [1, 2, 3], answers: {} }] }));
  ctx.state.store = ctx.loadStore();
  const mock = ctx.getMock("m1");
  ctx.state.liveMock = mock; // what renderExam does
  mock.answers[1] = ["A"]; ctx.saveStore();
  swap(ctx, ls); // store replaced mid-exam
  mock.answers[2] = ["B"]; ctx.saveStore();
  mock.answers[3] = ["C"]; mock.endedAt = "2026-11-14T12:00:00Z"; ctx.saveStore(); // finalize
  return JSON.parse(ls.get("s")).mocks.find((m) => m.id === "m1");
}

test("another tab saving mid-exam keeps every answer", () => {
  const saved = examWithSwap((c, ls) => {
    const o = JSON.parse(ls.get("s")); o.favorites = [9]; ls.set("s", JSON.stringify(o));
    c.reloadStore(); // the storage-event handler
  });
  assert.deepStrictEqual(Object.keys(saved.answers), ["1", "2", "3"]);
  assert.ok(saved.endedAt);
});

test("sync adopting the server copy mid-exam keeps every answer", () => {
  const saved = examWithSwap((c, ls) => c.adoptRemote({ s: ls.get("s") }, 1));
  assert.deepStrictEqual(Object.keys(saved.answers), ["1", "2", "3"]);
  assert.ok(saved.endedAt);
});

test("any other store swap is caught by saveStore", () => {
  const saved = examWithSwap((c) => { c.state.store = c.loadStore(); });
  assert.deepStrictEqual(Object.keys(saved.answers), ["1", "2", "3"]);
  assert.ok(saved.endedAt);
});
