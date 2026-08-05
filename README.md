# W. Winston Scott

Personal site and Field Notes publishing tools.

## LinkedIn publisher

The `worker/` directory contains a dedicated Cloudflare Worker for approving
and publishing posts to W. Winston Scott's personal LinkedIn profile. It keeps
LinkedIn credentials and access tokens server-side and never auto-publishes a
draft. The same approval desk also prepares a separate personal-Facebook
version, copies it with the optional article link, and opens Facebook so the
account owner can make the platform-required final post manually.

### One-time Cloudflare setup

Cloudflare Workers Builds can deploy the `worker/` directory directly from
this repository. Use these deployment settings:

- Project name: `winston-field-notes-publisher`
- Production branch: `main`
- Root directory: `worker`
- Build command: leave blank
- Deploy command: `npx wrangler deploy`

The `LINKEDIN_STORE` KV namespace is declared without an account-specific ID,
so current Wrangler versions provision and bind it automatically on the first
deployment. After that deployment, create these four encrypted Worker secrets
in the Cloudflare dashboard:

```bash
npx wrangler secret put LINKEDIN_CLIENT_ID
npx wrangler secret put LINKEDIN_CLIENT_SECRET
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

- `LINKEDIN_CLIENT_ID` is the app's LinkedIn Client ID.
- `LINKEDIN_CLIENT_SECRET` is copied directly from LinkedIn Developer Auth.
- `ADMIN_PASSWORD` is a new password used only to unlock the publisher.
- `SESSION_SECRET` should be a new random value of at least 32 characters.

Do not commit any of these values. Local validation commands are:

```bash
npm run check
npm run deploy
```

The LinkedIn app must list this exact authorized redirect URL:

```text
https://winston-field-notes-publisher.michelle-cb4.workers.dev/linkedin/callback
```

After deployment, open
`https://winston-field-notes-publisher.michelle-cb4.workers.dev`, unlock the
publisher, and choose **Connect LinkedIn**. LinkedIn access currently expires
after about two months, so the publisher displays the expiration time and
supports deliberate reconnection.
W. Winston Scott - Personal platform site. Social worker, advocate, bariatric surgery survivor, and creator behind GetOutMyBelly. Bridging lived experience with professional credibility in mental health, behavior change, and systems advocacy. Incoming MSW, NASW-Illinois
