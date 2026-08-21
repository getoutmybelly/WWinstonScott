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
  assert.match(await locked.text(), /Welcome back/);

  const sessionCookie = await unlock(env);
  const unlocked = await worker.fetch(new Request(`${ORIGIN}/`, { headers: { Cookie: sessionCookie } }), env);
  const body = await unlocked.text();
  assert.match(body, /LinkedIn is not connected/);
  assert.match(body, /Share or copy for Facebook/);
  assert.match(body, /You always make the final post inside Facebook/);
  assert.match(body, /https:\/\/www\.facebook\.com\//);
  assert.match(body, /enctype="multipart\/form-data"/);
  assert.match(body, /name="image" type="file"/);
  assert.match(body, /Image description/);
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

test("an approved picture is uploaded and attached to the LinkedIn post", async () => {
  const env = environment();
  const sessionCookie = await unlock(env);
  env.values.set("linkedin:connection", JSON.stringify({
    accessToken: "test-access-token",
    memberSub: "member-123",
    memberName: "W. Winston Scott",
    expiresAt: Date.now() + 60_000,
  }));

  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    if (String(url).includes("/v2/assets?action=registerUpload")) {
      return Response.json({ value: {
        uploadMechanism: { "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": { uploadUrl: "https://api.linkedin.com/mediaUpload/test" } },
        asset: "urn:li:digitalmediaAsset:image-123",
      } });
    }
    if (String(url).includes("/mediaUpload/test")) return new Response("", { status: 201 });
    return new Response("", { status: 201, headers: { "x-restli-id": "urn:li:share:456" } });
  };

  try {
    const form = new FormData();
    form.set("text", "Approved Field Note");
    form.set("articleUrl", "https://example.com/source");
    form.set("visibility", "PUBLIC");
    form.set("confirmed", "yes");
    form.set("imageAlt", "Winston speaking at a community meeting");
    form.set("image", new File([new Uint8Array([1, 2, 3])], "field-note.jpg", { type: "image/jpeg" }));
    const response = await worker.fetch(new Request(`${ORIGIN}/api/publish`, {
      method: "POST",
      headers: { Cookie: sessionCookie, Origin: ORIGIN },
      body: form,
    }), env);

    assert.equal(response.status, 200);
    assert.equal(calls.length, 3);
    const postBody = JSON.parse(calls[2].options.body);
    const content = postBody.specificContent["com.linkedin.ugc.ShareContent"];
    assert.equal(content.shareMediaCategory, "IMAGE");
    assert.equal(content.media[0].media, "urn:li:digitalmediaAsset:image-123");
    assert.equal(content.media[0].description.text, "Winston speaking at a community meeting");
    assert.equal(content.shareCommentary.text, "Approved Field Note\n\nhttps://example.com/source");
  } finally {
    globalThis.fetch = originalFetch;
  }
});


test("manifest exposes the installable Android share target", async () => {
  const response = await worker.fetch(new Request(`${ORIGIN}/manifest.webmanifest`), environment());
  assert.equal(response.status, 200);
  const manifest = await response.json();
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.share_target.action, "/share-target");
  assert.equal(manifest.share_target.method, "POST");
  assert.equal(manifest.share_target.enctype, "multipart/form-data");
  assert.deepEqual(manifest.share_target.params.files[0].accept, ["image/jpeg", "image/png", "image/gif"]);
});

test("share target rejects unsupported image formats", async () => {
  const form = new FormData();
  form.set("text", "Shared Field Note");
  form.set("image", new File(["bad"], "picture.webp", { type: "image/webp" }));
  const response = await worker.fetch(new Request(`${ORIGIN}/share-target`, { method: "POST", body: form }), environment());
  assert.equal(response.status, 400);
});
