// Progress sync endpoint backed by Upstash Redis (Vercel Marketplace integration).
// Auth is handled by middleware.js: unauthenticated requests never reach here.

const KEY = "progress:v1";

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
        res.status(400).json({ error: "expected { updatedAt: number, data: object }" });
        return;
      }
      await redis(["SET", KEY, JSON.stringify({ updatedAt: body.updatedAt, data: body.data })]);
      res.status(200).json({ ok: true });
    } else {
      res.setHeader("Allow", "GET, PUT, POST");
      res.status(405).json({ error: "method not allowed" });
    }
  } catch (err) {
    res.status(502).json({ error: String(err.message || err) });
  }
}
