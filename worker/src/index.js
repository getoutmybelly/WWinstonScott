const LINKEDIN_AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const LINKEDIN_POST_URL = "https://api.linkedin.com/v2/ugcPosts";
const CONNECTION_KEY = "linkedin:connection";
const ADMIN_COOKIE = "__Host-wfn_admin";
const OAUTH_COOKIE = "__Host-wfn_oauth";
const MAX_POST_LENGTH = 3000;

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const headers = securityHeaders();

      if (request.method === "GET" && url.pathname === "/") {
        return html(await renderApp(request, env), 200, headers);
      }
      if (request.method === "POST" && url.pathname === "/api/login") {
        return withHeaders(await adminLogin(request, env), headers);
      }
      if (request.method === "POST" && url.pathname === "/api/logout") {
        return withHeaders(adminLogout(), headers);
      }
      if (request.method === "GET" && url.pathname === "/linkedin/connect") {
        return withHeaders(await beginLinkedInOAuth(request, env), headers);
      }
      if (request.method === "GET" && url.pathname === "/linkedin/callback") {
        return withHeaders(await finishLinkedInOAuth(request, env), headers);
      }
      if (request.method === "POST" && url.pathname === "/api/publish") {
        return withHeaders(await publishPost(request, env), headers);
      }
      if (request.method === "GET" && url.pathname === "/health") {
        return json({ ok: true, service: "winston-field-notes-publisher" }, 200, headers);
      }

      return html(renderMessage("Not found", "That page does not exist."), 404, headers);
    } catch (error) {
      console.error(JSON.stringify({ message: "unhandled request error", error: error instanceof Error ? error.message : String(error) }));
      return html(
        renderMessage("Something went wrong", "The publisher could not complete that request."),
        500,
        securityHeaders(),
      );
    }
  },
};

async function renderApp(request, env) {
  if (!(await isAdmin(request, env))) return loginPage();

  const connection = await env.LINKEDIN_STORE.get(CONNECTION_KEY, "json");
  const connected = connection && connection.accessToken && connection.memberSub;
  const expiry = connected ? new Date(connection.expiresAt).toLocaleString("en-US", { timeZone: "America/Chicago" }) : "";
  const memberName = connected ? escapeHtml(connection.memberName || "LinkedIn member") : "";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Winston Field Notes Publisher</title>${styles()}</head>
<body><main class="shell">
  <header><div class="mark">W.</div><div><p class="eyebrow">WINSTON FIELD NOTES</p><h1>LinkedIn Publisher</h1></div></header>
  <section class="card status-card">
    <div><p class="eyebrow">CONNECTION</p>
      <h2>${connected ? `Connected as ${memberName}` : "LinkedIn is not connected"}</h2>
      <p>${connected ? `Access currently expires ${escapeHtml(expiry)} CT.` : "Connect your personal LinkedIn profile before publishing."}</p>
    </div>
    <a class="button secondary" href="/linkedin/connect">${connected ? "Reconnect" : "Connect LinkedIn"}</a>
  </section>
  <section class="card">
    <p class="eyebrow">LINKEDIN APPROVAL</p><h2>Prepare a LinkedIn post</h2>
    <p class="muted">Nothing is published until you press the final Publish button.</p>
    <form method="post" action="/api/publish" id="publisher">
      <label for="text">Post text</label>
      <textarea id="text" name="text" maxlength="${MAX_POST_LENGTH}" required placeholder="Write or paste the approved Field Note here…"></textarea>
      <div class="counter"><span id="count">0</span> / ${MAX_POST_LENGTH}</div>
      <label for="articleUrl">Article link <span>(optional)</span></label>
      <input id="articleUrl" name="articleUrl" type="url" placeholder="https://…">
      <label for="visibility">Visibility</label>
      <select id="visibility" name="visibility"><option value="PUBLIC">Public</option><option value="CONNECTIONS">Connections only</option></select>
      <label class="confirm"><input type="checkbox" name="confirmed" value="yes" required> I reviewed this exact post and approve publishing it now.</label>
      <button class="button primary" type="submit" ${connected ? "" : "disabled"}>Publish to my LinkedIn</button>
    </form>
  </section>
  <section class="card">
    <p class="eyebrow">PERSONAL FACEBOOK</p><h2>Prepare your Facebook version</h2>
    <p class="muted">Facebook requires you to make the final post on a personal profile. This button copies your prepared text, adds the article link if supplied above, and opens Facebook for your final review.</p>
    <label for="facebookText">Facebook post text</label>
    <textarea id="facebookText" maxlength="5000" placeholder="Paste the approved Facebook version here…"></textarea>
    <div class="counter"><span id="facebookCount">0</span> / 5000</div>
    <button class="button secondary" id="facebookShare" type="button">Copy &amp; Open Personal Facebook</button>
    <p class="share-status" id="facebookStatus" role="status" aria-live="polite"></p>
  </section>
  <form method="post" action="/api/logout" class="logout"><button type="submit">Lock publisher</button></form>
</main><script>
const t=document.querySelector('#text'),c=document.querySelector('#count'),f=document.querySelector('#facebookText'),fc=document.querySelector('#facebookCount'),fb=document.querySelector('#facebookShare'),fs=document.querySelector('#facebookStatus'),article=document.querySelector('#articleUrl');
if(t)t.addEventListener('input',()=>c.textContent=t.value.length);
if(f)f.addEventListener('input',()=>fc.textContent=f.value.length);
if(fb)fb.addEventListener('click',async()=>{
  const post=f.value.trim();
  if(!post){fs.textContent='Add your approved Facebook text first.';f.focus();return;}
  const link=article.value.trim();
  const shareText=[post,link].filter(Boolean).join('\n\n');
  window.open('https://www.facebook.com/WayneScottII','_blank','noopener,noreferrer');
  try{await navigator.clipboard.writeText(shareText);fs.textContent='Copied. Paste into the Facebook composer, review it, and press Post when ready.';}
  catch{fs.textContent='Facebook opened, but your browser blocked copying. Select and copy the Facebook text manually.';}
});
</script></body></html>`;
}

function loginPage(message = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Unlock Publisher</title>${styles()}</head>
  <body><main class="shell narrow"><header><div class="mark">W.</div><div><p class="eyebrow">WINSTON FIELD NOTES</p><h1>Publisher</h1></div></header>
  <section class="card"><p class="eyebrow">PRIVATE</p><h2>Unlock the approval desk</h2>${message ? `<p class="error">${escapeHtml(message)}</p>` : ""}
  <form method="post" action="/api/login"><label for="password">Publisher password</label><input id="password" name="password" type="password" autocomplete="current-password" required><button class="button primary" type="submit">Unlock</button></form></section></main></body></html>`;
}

async function adminLogin(request, env) {
  requireSameOrigin(request);
  const form = await request.formData();
  const supplied = String(form.get("password") || "");
  if (!env.ADMIN_PASSWORD || !(await safeEqual(supplied, env.ADMIN_PASSWORD))) {
    return html(loginPage("That password did not match."), 401);
  }

  const token = await createSession(env.SESSION_SECRET);
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
      "Set-Cookie": cookie(ADMIN_COOKIE, token, 8 * 60 * 60, "Strict"),
    },
  });
}

function adminLogout() {
  return new Response(null, {
    status: 303,
    headers: { Location: "/", "Set-Cookie": clearCookie(ADMIN_COOKIE) },
  });
}

async function beginLinkedInOAuth(request, env) {
  if (!(await isAdmin(request, env))) return redirect("/");
  requireEnv(env, ["LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET", "LINKEDIN_REDIRECT_URI"]);

  const state = randomToken(32);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.LINKEDIN_CLIENT_ID,
    redirect_uri: env.LINKEDIN_REDIRECT_URI,
    state,
    scope: "openid profile email w_member_social",
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${LINKEDIN_AUTHORIZE_URL}?${params}`,
      "Set-Cookie": cookie(OAUTH_COOKIE, state, 10 * 60, "Lax"),
    },
  });
}

async function finishLinkedInOAuth(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = parseCookies(request.headers.get("Cookie"))[OAUTH_COOKIE];
  if (!code || !state || !expectedState || !(await safeEqual(state, expectedState))) {
    return html(renderMessage("Connection stopped", "The LinkedIn security check did not match. Return to the publisher and try again."), 400);
  }

  const tokenResponse = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: env.LINKEDIN_CLIENT_ID,
      client_secret: env.LINKEDIN_CLIENT_SECRET,
      redirect_uri: env.LINKEDIN_REDIRECT_URI,
    }),
  });
  const tokens = await tokenResponse.json();
  if (!tokenResponse.ok || !tokens.access_token) {
    console.error(JSON.stringify({ message: "LinkedIn token exchange failed", status: tokenResponse.status, error: tokens.error || null }));
    return html(renderMessage("LinkedIn did not connect", "The authorization code could not be exchanged. Try connecting again."), 502);
  }

  const profileResponse = await fetch(LINKEDIN_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileResponse.json();
  if (!profileResponse.ok || !profile.sub) {
    console.error(JSON.stringify({ message: "LinkedIn userinfo failed", status: profileResponse.status }));
    return html(renderMessage("Profile unavailable", "LinkedIn connected, but the member profile could not be confirmed."), 502);
  }

  const expiresIn = Number(tokens.expires_in || 5_184_000);
  await env.LINKEDIN_STORE.put(CONNECTION_KEY, JSON.stringify({
    accessToken: tokens.access_token,
    memberSub: profile.sub,
    memberName: profile.name || [profile.given_name, profile.family_name].filter(Boolean).join(" "),
    connectedAt: Date.now(),
    expiresAt: Date.now() + expiresIn * 1000,
    scopes: tokens.scope || "openid profile email w_member_social",
  }));

  return new Response(null, {
    status: 303,
    headers: { Location: "/?connected=1", "Set-Cookie": clearCookie(OAUTH_COOKIE) },
  });
}

async function publishPost(request, env) {
  if (!(await isAdmin(request, env))) return redirect("/");
  requireSameOrigin(request);
  const form = await request.formData();
  const text = String(form.get("text") || "").trim();
  const articleUrl = String(form.get("articleUrl") || "").trim();
  const visibility = form.get("visibility") === "CONNECTIONS" ? "CONNECTIONS" : "PUBLIC";
  const confirmed = form.get("confirmed") === "yes";

  if (!confirmed || !text || text.length > MAX_POST_LENGTH) {
    return html(renderMessage("Post not published", "Review the post, keep it within 3,000 characters, and check the approval box."), 400);
  }
  if (articleUrl && !isHttpUrl(articleUrl)) {
    return html(renderMessage("Post not published", "The article link must begin with https:// or http://."), 400);
  }

  const connection = await env.LINKEDIN_STORE.get(CONNECTION_KEY, "json");
  if (!connection?.accessToken || !connection?.memberSub || connection.expiresAt <= Date.now()) {
    return html(renderMessage("Reconnect LinkedIn", "The LinkedIn connection is missing or expired. Return to the publisher and reconnect."), 401);
  }

  const media = articleUrl ? [{ status: "READY", originalUrl: articleUrl }] : undefined;
  const body = {
    author: `urn:li:person:${connection.memberSub}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: articleUrl ? "ARTICLE" : "NONE",
        ...(media ? { media } : {}),
      },
    },
    visibility: { "com.linkedin.ugc.MemberNetworkVisibility": visibility },
  };

  const linkedInResponse = await fetch(LINKEDIN_POST_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${connection.accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });
  if (!linkedInResponse.ok) {
    console.error(JSON.stringify({ message: "LinkedIn publish failed", status: linkedInResponse.status }));
    return html(renderMessage("LinkedIn did not publish the post", `LinkedIn returned status ${linkedInResponse.status}. No retry was attempted, so this cannot create a duplicate.`), 502);
  }

  const postId = linkedInResponse.headers.get("x-restli-id") || "Published";
  return html(renderMessage("Published to LinkedIn", `LinkedIn confirmed the post. Reference: ${postId}`, "/"), 200);
}

async function isAdmin(request, env) {
  if (!env.SESSION_SECRET) return false;
  const token = parseCookies(request.headers.get("Cookie"))[ADMIN_COOKIE];
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await sign(payload, env.SESSION_SECRET);
  if (!(await safeEqual(signature, expected))) return false;
  try {
    const data = JSON.parse(fromBase64Url(payload));
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

async function createSession(secret) {
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  const payload = toBase64Url(JSON.stringify({ exp: Date.now() + 8 * 60 * 60 * 1000, nonce: randomToken(16) }));
  return `${payload}.${await sign(payload, secret)}`;
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function safeEqual(a, b) {
  const [left, right] = await Promise.all([crypto.subtle.digest("SHA-256", new TextEncoder().encode(a)), crypto.subtle.digest("SHA-256", new TextEncoder().encode(b))]);
  if (typeof crypto.subtle.timingSafeEqual === "function") {
    return crypto.subtle.timingSafeEqual(left, right);
  }
  const x = new Uint8Array(left), y = new Uint8Array(right);
  let difference = 0;
  for (let index = 0; index < x.length; index++) difference |= x[index] ^ y[index];
  return difference === 0;
}

function requireSameOrigin(request) {
  const origin = request.headers.get("Origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== "null") {
    if (origin !== requestOrigin) throw new Error("Cross-origin request blocked");
    return;
  }

  // Browsers can serialize Origin as "null" when a strict referrer policy is
  // active. Fetch Metadata still identifies a genuine same-origin form post.
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (origin === "null" && fetchSite !== "same-origin") {
    throw new Error("Cross-origin request blocked");
  }
}

function requireEnv(env, names) {
  const missing = names.filter((name) => !env[name]);
  if (missing.length) throw new Error(`Missing configuration: ${missing.join(", ")}`);
}

function isHttpUrl(value) {
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
}

function randomToken(bytes) {
  const data = new Uint8Array(bytes); crypto.getRandomValues(data); return bytesToBase64Url(data);
}

function bytesToBase64Url(bytes) {
  let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function toBase64Url(value) { return bytesToBase64Url(new TextEncoder().encode(value)); }
function fromBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

function parseCookies(header) {
  if (!header) return {};
  return Object.fromEntries(header.split(";").map((item) => item.trim()).filter((item) => item.includes("=")).map((item) => { const index = item.indexOf("="); return [item.slice(0, index), decodeURIComponent(item.slice(index + 1))]; }));
}

function cookie(name, value, maxAge, sameSite) { return `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=${sameSite}`; }
function clearCookie(name) { return `${name}=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax`; }
function redirect(location) { return new Response(null, { status: 303, headers: { Location: location } }); }
function json(value, status = 200, headers = {}) { return new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } }); }
function html(body, status = 200, headers = {}) { return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", ...headers } }); }
function withHeaders(response, headers) { const output = new Response(response.body, response); for (const [key, value] of Object.entries(headers)) output.headers.set(key, value); return output; }

function securityHeaders() {
  return {
    "Content-Security-Policy": "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
    "Referrer-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

function renderMessage(title, message, returnTo = "/") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>${styles()}</head><body><main class="shell narrow"><header><div class="mark">W.</div><div><p class="eyebrow">WINSTON FIELD NOTES</p><h1>Publisher</h1></div></header><section class="card"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p><a class="button secondary" href="${returnTo}">Return to publisher</a></section></main></body></html>`;
}

function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]); }

function styles() {
  return `<style>:root{--ink:#13273a;--paper:#f4efe5;--card:#fffdf7;--gold:#b18442;--line:#d8cdbb;--muted:#68727b}*{box-sizing:border-box}body{margin:0;background:linear-gradient(135deg,#ede4d5,#f7f4ec);color:var(--ink);font:16px/1.55 Georgia,serif;min-height:100vh}.shell{width:min(900px,92vw);margin:48px auto}.narrow{width:min(560px,92vw)}header{display:flex;align-items:center;gap:16px;margin-bottom:24px}.mark{display:grid;place-items:center;width:62px;height:62px;background:var(--ink);border:3px solid var(--gold);border-radius:14px;color:#fff;font:700 27px Georgia}h1,h2,p{margin-top:0}h1{margin-bottom:0;font-size:clamp(1.8rem,4vw,2.7rem)}h2{font-size:1.45rem}.eyebrow{font:700 .74rem/1.2 Arial,sans-serif;letter-spacing:.18em;color:var(--gold);margin-bottom:6px}.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:clamp(22px,4vw,38px);box-shadow:0 14px 40px #2d24151a;margin-bottom:22px}.status-card{display:flex;align-items:center;justify-content:space-between;gap:25px}.muted,.counter,label span{color:var(--muted)}label{display:block;font-weight:700;margin:20px 0 8px}textarea,input,select{width:100%;border:1px solid #aeb6ba;border-radius:10px;padding:13px;background:#fff;font:inherit;color:var(--ink)}textarea{min-height:250px;resize:vertical}.counter{text-align:right;font:13px Arial,sans-serif;margin-top:5px}.confirm{display:flex;align-items:flex-start;gap:10px;font-weight:400;background:#f2eadb;padding:14px;border-radius:10px}.confirm input{width:auto;margin-top:5px}.button{display:inline-block;border:0;border-radius:10px;padding:12px 18px;font:700 15px Arial,sans-serif;text-decoration:none;cursor:pointer}.primary{background:var(--ink);color:#fff;margin-top:18px}.secondary{border:1px solid var(--ink);color:var(--ink);background:transparent;white-space:nowrap}.button:disabled{opacity:.45;cursor:not-allowed}.share-status{min-height:1.5em;margin:12px 0 0;color:var(--muted);font-weight:700}.logout{text-align:center}.logout button{border:0;background:transparent;color:var(--muted);text-decoration:underline;cursor:pointer}.error{color:#9d2f2f;font-weight:700}@media(max-width:650px){.shell{margin:26px auto}.status-card{align-items:flex-start;flex-direction:column}}</style>`;
}
