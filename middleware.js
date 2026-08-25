// Vercel Edge Middleware: passphrase gate for the whole site.
// Runs only on Vercel (local static server ignores this file).
// Set SITE_PASSPHRASE in Vercel project env vars; falls back to DEFAULT_PASSPHRASE.

const DEFAULT_PASSPHRASE = "aws-mock-2026";
const COOKIE = "site_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const config = { matcher: "/(.*)" };

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getCookie(req, name) {
  const header = req.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mock Test Trainer — Login</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0f1115;color:#e6e8ee;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  form{background:#171a21;border:1px solid #2a2f3a;border-radius:12px;padding:32px;width:min(360px,90vw);display:flex;flex-direction:column;gap:14px}
  h1{margin:0 0 4px;font-size:1.25rem}
  input{padding:10px 12px;border-radius:8px;border:1px solid #2a2f3a;background:#0f1115;color:inherit;font-size:1rem}
  button{padding:10px;border-radius:8px;border:none;background:#4f8cff;color:#fff;font-size:1rem;cursor:pointer}
  button:hover{background:#2c6fe0}
  .err{color:#ff6b6b;font-size:.9rem;margin:0}
</style></head><body>
<form method="POST" action="/login">
  <h1>Mock Test Trainer</h1>
  <input type="password" name="passphrase" placeholder="Passphrase" autofocus required>
  ${error ? `<p class="err">Passphrase ไม่ถูกต้อง</p>` : ""}
  <button type="submit">Enter</button>
</form></body></html>`;
}

export default async function middleware(req) {
  const url = new URL(req.url);
  const passphrase = process.env.SITE_PASSPHRASE || DEFAULT_PASSPHRASE;
  const token = await sha256(passphrase);

  if (url.pathname === "/login") {
    if (req.method === "POST") {
      const form = await req.formData();
      const input = String(form.get("passphrase") || "");
      if (input === passphrase) {
        return new Response(null, {
          status: 303,
          headers: {
            Location: "/",
            "Set-Cookie": `${COOKIE}=${token}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          },
        });
      }
      return new Response(loginPage(true), { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    return new Response(loginPage(false), { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  if (url.pathname === "/logout") {
    return new Response(null, {
      status: 303,
      headers: { Location: "/login", "Set-Cookie": `${COOKIE}=; Path=/; Max-Age=0` },
    });
  }

  if (getCookie(req, COOKIE) === token) return; // authenticated → serve static file

  return new Response(loginPage(false), { status: 401, headers: { "Content-Type": "text/html; charset=utf-8" } });
}
