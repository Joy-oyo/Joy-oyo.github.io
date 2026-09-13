# Deploying joylism.com

This repository contains two deployable projects:

| Project | Vercel Root Directory | Purpose |
| --- | --- | --- |
| Portfolio | repository root | Next.js application served at `joylism.com` |
| Reading Collection | `reading-collection` | Static HTML microsite proxied below `/reading-collection/*` |

The ASR Transcriber remains a third, external repository and Vercel project.

## 1. Deploy Reading Collection

Import `Joy-oyo/Joy-oyo.github.io` as a new Vercel project and configure:

- **Root Directory:** `reading-collection`
- **Framework Preset:** Other
- **Build Command:** empty
- **Output Directory:** `.`
- **Deployment Protection:** disabled for the production deployment

Deploy it and keep its stable production URL, for example:

```text
https://reading-collection.vercel.app
```

Verify these paths directly on that origin:

- `/index.html`
- `/good-to-great-summary.html`
- `/influence-book-summary.html`
- `/no-rules-rules-summary.html`
- `/skin-in-the-game-summary.html`
- `/the-hard-thing-about-hard-things-summary.html`
- `/the-lean-startup-summary.html`

Do not enable clean URLs. The pages intentionally use `.html` filenames and
same-directory relative links.

## 2. Configure the portfolio project

Import the same GitHub repository, or update the existing portfolio project:

- **Root Directory:** empty (repository root)
- **Framework Preset:** Next.js
- **Build Command, Output Directory, Install Command:** defaults

If the project was linked before September 2026, remove the old `next` Root
Directory under **Settings → Build and Deployment**.

## 3. Add portfolio environment variables

In **Vercel → Portfolio Project → Settings → Environment Variables**, configure:

| Key | Required | Value |
| --- | --- | --- |
| `READING_COLLECTION_ORIGIN` | Production | Stable HTTPS origin from step 1, with no path or trailing data |
| `ASR_DEMO_ORIGIN` | If the ASR route is enabled | Stable HTTPS origin of the external ASR project |
| `EMAIL_USER` | For contact verification | Gmail sender address |
| `EMAIL_PASS` | For contact verification | Gmail App Password, never the account password |

Set values for the environments that need each feature, then redeploy. The
portfolio production build intentionally fails when
`READING_COLLECTION_ORIGIN` is missing or invalid, preventing a deployment with
an empty Reading page.

The origin variables are deploy-time configuration, not request input. In
production only public HTTPS origins are accepted; local HTTP is limited to
loopback addresses.

## 4. Deploy and verify the integration

Deploy Reading Collection before the portfolio. Then verify on the portfolio
origin:

- `/`
- `/reading`
- `/reading-collection/index.html`
- each summary URL under `/reading-collection/`
- navigation from the collection to a book and back
- chapter hash navigation such as `/skin-in-the-game-summary.html#19`
- mobile layout and the top-edge navigation reveal on `/reading`
- `/asrtranscriber`, when `ASR_DEMO_ORIGIN` is configured
- `/contact`, including receiving and verifying a real email code

## 5. Add the custom domain

In the portfolio Vercel project:

1. Open **Settings → Domains** and add `joylism.com`.
2. Add `www.joylism.com` and choose the preferred redirect direction.
3. In Cloudflare DNS, remove old GitHub Pages records.
4. Add the values Vercel provides. Typical records are:
   - `A @ 76.76.21.21`
   - `CNAME www cname.vercel-dns.com`
5. Keep both records **DNS only** (grey cloud), avoiding a second CDN proxy in
   front of Vercel.

No custom DNS record is required for Reading Collection; the portfolio accesses
its Vercel production origin through a server rewrite.

## Local integration test

Serve Reading Collection:

```bash
python3 -m http.server 3002 --directory reading-collection
```

Set this in `.env.local`:

```dotenv
READING_COLLECTION_ORIGIN=http://127.0.0.1:3002
```

Then restart `npm run dev` and open <http://localhost:3001/reading>. Test through
the main site rather than only opening the static files directly; that verifies
the rewrite and iframe integration.

## Verification-code API limitation

`src/lib/verificationStore.ts` stores codes in an in-memory `Map`. Vercel route
handlers can execute in different serverless instances, so a code written by
`send-verification` is not guaranteed to be visible to `verify-code`.

Before treating this flow as production-reliable, replace the store with one of:

- Upstash Redis or Vercel-supported Redis;
- another shared TTL key-value store;
- a short-lived signed token that requires no server-side persistence.

## Rollback

### Reading Collection

Point `READING_COLLECTION_ORIGIN` back to the previous stable static deployment
and redeploy the portfolio. Because the public URL prefix remains unchanged, no
HTML links need to change.

### Portfolio domain

Use Vercel's previous deployment rollback. If a full DNS rollback is required,
restore the former provider's records in Cloudflare; DNS propagation may take a
few minutes.
