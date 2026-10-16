// Progress sync endpoint backed by Upstash Redis (Vercel Marketplace integration).
// Auth is handled by middleware.js: unauthenticated requests never reach here.
//
// Snapshot = { updatedAt, data: { "<localStorage key>": "<json string>" } }.
// A PUT carries `base` = the server updatedAt the client last synced against.
// If base matches the current snapshot the write replaces it. If base is stale
// (another device wrote in between) or missing (old client), the incoming
// snapshot is MERGED into the stored one instead of overwriting it, so a tab
// left open on one device can no longer wipe out favorites marked on another.

const KEY = "progress:v1";
const STORE_KEY = "mocktest:store:v2";
const SET_KEYS = ["favorites", "criticals", "factFavs", "factKnown"];

async function redis(command) {
  const res = await fetch(process.env.KV_REST_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);
  return (await res.json()).result;
}

function parse(json) {
  try { return json ? JSON.parse(json) : null; } catch { return null; }
}

// Merge the app store `mine` (incoming) on top of `base` (stored).
// Sets are unioned; maps keyed by id keep both sides with incoming winning;
// everything else: incoming wins when present.
export function mergeStore(base, mine) {
  const out = { ...(base || {}), ...(mine || {}) };
  for (const k of SET_KEYS) {
    const a = Array.isArray(mine && mine[k]) ? mine[k] : [];
    const b = Array.isArray(base && base[k]) ? base[k] : [];
    out[k] = [...a, ...b.filter((x) => !a.includes(x))];
  }
  out.notes = { ...((base && base.notes) || {}), ...((mine && mine.notes) || {}) };
  const mocks = Array.isArray(mine && mine.mocks) ? mine.mocks.slice() : [];
  const seen = new Set(mocks.map((m) => m && m.id));
  for (const m of (base && Array.isArray(base.mocks)) ? base.mocks : []) {
    if (m && !seen.has(m.id)) mocks.push(m);
  }
  out.mocks = mocks;
  return out;
}

export function mergeSnapshot(stored, incoming) {
  const data = { ...((stored && stored.data) || {}) };
  for (const [k, v] of Object.entries(incoming || {})) {
    if (k === STORE_KEY) {
      const base = parse(data[k]), mine = parse(v);
      if (base && mine) data[k] = JSON.stringify(mergeStore(base, mine));
      else if (typeof v === "string") data[k] = v;
    } else if (typeof v === "string") {
      data[k] = v;
    }
  }
  return data;
}

export default async function handler(req, res) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    res.status(503).json({ error: "KV not configured" });
    return;
  }
  try {
    if (req.method === "GET") {
      const raw = await redis(["GET", KEY]);
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(raw ? JSON.parse(raw) : null);
    } else if (req.method === "PUT" || req.method === "POST") {
      const body = req.body;
      if (!body || typeof body.updatedAt !== "number" || typeof body.data !== "object") {
        res.status(400).json({ error: "expected { updatedAt: number, data: object, base?: number }" });
        return;
      }
      const stored = parse(await redis(["GET", KEY]));
      const fresh = stored && typeof body.base === "number" && body.base >= stored.updatedAt;
      const merged = !!stored && !fresh;
      const data = merged ? mergeSnapshot(stored, body.data) : body.data;
      const updatedAt = Math.max(body.updatedAt, (stored && stored.updatedAt + 1) || 0);
      await redis(["SET", KEY, JSON.stringify({ updatedAt, data })]);
      res.setHeader("Cache-Control", "no-store");
      // When merged, hand the result back so the client can adopt it.
      res.status(200).json(merged ? { ok: true, merged: true, updatedAt, data } : { ok: true, merged: false, updatedAt });
    } else {
      res.setHeader("Allow", "GET, PUT, POST");
      res.status(405).json({ error: "method not allowed" });
    }
  } catch (err) {
    res.status(502).json({ error: String(err.message || err) });
  }
}
