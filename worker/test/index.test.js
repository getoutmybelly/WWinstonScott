import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.js";

const ORIGIN = "https://winston-field-notes-publisher.michelle-cb4.workers.dev";

function environment() {
  const values = new Map();
  return {
    ADMIN_PASSWORD: "test-admin-password",
    SESSION_SECRET: "test-session-secret-that-is-long-enough",
    LINKEDIN_CLIENT_ID: "test-client-id",
    LINKEDIN_CLIENT_SECRET: "test-client-secret",
    LINKEDIN_REDIRECT_URI: `${ORIGIN}/linkedin/callback`,
    LINKEDIN_STORE: {
      async get(key, type) {
        const value = values.get(key) ?? null;
        return type === "json" && value ? JSON.parse(value) : value;
      },
      async put(key, value) { values.set(key, value); },
    },
    values,
  };
}

async function unlock(env) {
  const response = await worker.fetch(new Request(`${ORIGIN}/api/login`, {
    method: "POST",
    headers: { Origin: ORIGIN, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ password: env.ADMIN_PASSWORD }),
  }), env);
  assert.equal(response.status, 303);
  return response.headers.get("set-cookie").split(";")[0];
}

test("health endpoint and security headers are available", async () => {
  const response = await worker.fetch(new Request(`${ORIGIN}/health`), environment());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.deepEqual(await response.json(), { ok: true, service: "winston-field-notes-publisher" });
});

test("publisher stays locked until the admin password is supplied", async () => {
  const env = environment();
  const locked = await worker.fetch(new Request(`${ORIGIN}/`), env);
  assert.match(await locked.text(), /Unlock the approval desk/);

  const sessionCookie = await unlock(env);
  const unlocked = await worker.fetch(new Request(`${ORIGIN}/`, { headers: { Cookie: sessionCookie } }), env);
  const body = await unlocked.text();
  assert.match(body, /LinkedIn is not connected/);
  assert.match(body, /Copy &amp; Open Personal Facebook/);
  assert.match(body, /Facebook requires you to make the final post on a personal profile/);
  assert.match(body, /https:\/\/www\.facebook\.com\/WayneScottII/);
  const script = body.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  assert.doesNotThrow(() => new Function(script));
});

test("same-origin login works when the browser serializes Origin as null", async () => {
  const env = environment();
  const response = await worker.fetch(new Request(`${ORIGIN}/api/login`, {
    method: "POST",
    headers: {
      Origin: "null",
      "Sec-Fetch-Site": "same-origin",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ password: env.ADMIN_PASSWORD }),
  }), env);

  assert.equal(response.status, 303);
  assert.match(response.headers.get("set-cookie"), /__Host-wfn_admin=/);
});

test("LinkedIn connection requests the identity and publishing scopes", async () => {
  const env = environment();
  const sessionCookie = await unlock(env);
  const response = await worker.fetch(new Request(`${ORIGIN}/linkedin/connect`, { headers: { Cookie: sessionCookie } }), env);
  assert.equal(response.status, 302);
  const location = new URL(response.headers.get("location"));
  assert.equal(location.origin + location.pathname, "https://www.linkedin.com/oauth/v2/authorization");
  assert.equal(location.searchParams.get("scope"), "openid profile email w_member_social");
  assert.equal(location.searchParams.get("redirect_uri"), env.LINKEDIN_REDIRECT_URI);
});

test("a post is sent only after an authenticated, explicit approval", async () => {
  const env = environment();
  const sessionCookie = await unlock(env);
  env.values.set("linkedin:connection", JSON.stringify({
    accessToken: "test-access-token",
    memberSub: "member-123",
    memberName: "W. Winston Scott",
    expiresAt: Date.now() + 60_000,
  }));

  const originalFetch = globalThis.fetch;
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options, body: JSON.parse(options.body) };
    return new Response("", { status: 201, headers: { "x-restli-id": "urn:li:share:123" } });
  };

  try {
    const response = await worker.fetch(new Request(`${ORIGIN}/api/publish`, {
      method: "POST",
      headers: { Cookie: sessionCookie, Origin: ORIGIN, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ text: "Approved Field Note", visibility: "PUBLIC", confirmed: "yes" }),
    }), env);
    assert.equal(response.status, 200);
    assert.equal(captured.url, "https://api.linkedin.com/v2/ugcPosts");
    assert.equal(captured.body.author, "urn:li:person:member-123");
    assert.equal(captured.body.specificContent["com.linkedin.ugc.ShareContent"].shareCommentary.text, "Approved Field Note");
    assert.equal(captured.options.headers.Authorization, "Bearer test-access-token");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
