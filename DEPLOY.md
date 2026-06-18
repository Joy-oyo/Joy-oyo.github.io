# Deploying to Vercel (with Cloudflare-registered domain)

This repository contains two things:

- The **legacy static site** at the repo root (`index.html`, `css/`, `js/`, `images/`, `server.js`, …) — currently served by GitHub Pages on `joylism.com`.
- The **new Next.js portfolio** in `next/` — what we are deploying to Vercel.

After following this guide, `joylism.com` will point to the Next.js app on Vercel. The old GitHub Pages content stops being served, but the files stay in the repo (history preserved).

---

## 1. Push current state to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

## 2. Import the project on Vercel

1. Go to <https://vercel.com/new>.
2. Import the GitHub repo `Joy-oyo/Joy-oyo.github.io`.
3. **Important — set the project root**:
   - **Root Directory**: `next`
   - Framework Preset: `Next.js` (auto-detected)
   - Build Command, Output Directory, Install Command: leave defaults.
4. Click **Deploy**. First build takes ~2 minutes.

You should now have a working URL like `joy-oyo-github-io.vercel.app`.

## 3. Add environment variables

In **Vercel → Project → Settings → Environment Variables**, add (for `Production`, `Preview`, `Development`):

| Key          | Value                              | Notes                                                                 |
| ------------ | ---------------------------------- | --------------------------------------------------------------------- |
| `EMAIL_USER` | `your-gmail@gmail.com`             | Gmail address that sends verification codes                           |
| `EMAIL_PASS` | `your-gmail-app-password`          | Gmail **App Password**, not your real password. Generate one at <https://myaccount.google.com/apppasswords> |

Trigger a redeploy so the API routes pick up the new vars.

> ⚠️ Without these vars, `/api/send-verification` will fall back to logging the code to the server console (visible only in Vercel logs).

## 4. Add the custom domain on Vercel

1. **Vercel → Project → Settings → Domains → Add**.
2. Enter `joylism.com`. Vercel will also offer to add `www.joylism.com` (accept it; Vercel will redirect www → apex or vice versa).
3. Vercel shows you the DNS records to set. Typical values:
   - `A   @   76.76.21.21`
   - `CNAME   www   cname.vercel-dns.com`

Leave this tab open while you configure Cloudflare.

## 5. Update DNS in Cloudflare

> Cloudflare-registered domains use Cloudflare DNS by default. We just need to swap the records.

1. Cloudflare dashboard → select `joylism.com` → **DNS → Records**.
2. **Delete or replace** the existing GitHub Pages records (these point to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` and a CNAME for www).
3. Add the records from Vercel:
   - Type `A`, Name `@` (or `joylism.com`), Content `76.76.21.21`, **Proxy status: DNS only** (gray cloud).
   - Type `CNAME`, Name `www`, Content `cname.vercel-dns.com`, **Proxy status: DNS only** (gray cloud).
4. Save.

> 💡 **Why DNS only (gray cloud)?**
> Vercel issues its own SSL certificate via Let's Encrypt and serves through its global CDN. Putting Cloudflare's proxy in front (orange cloud) creates double-CDN, can break SSL handshake and Next.js features (ISR, streaming). Use DNS-only — it's simpler and faster. You still keep Cloudflare's domain registration, DNSSEC, and email forwarding.

## 6. Wait for SSL & verify

- Back on Vercel, the domain status will move from `Invalid Configuration` → `Valid Configuration` → certificate issued (usually < 5 minutes).
- Open <https://joylism.com> — should show the Next.js site.
- Test `/contact` to confirm the verification-code flow works end-to-end (you'll receive a real email).

## 7. Disable GitHub Pages

After the new site is live and verified:

1. GitHub repo → **Settings → Pages** → set Source to **None**.
2. (Optional) delete the root `CNAME` file in the repo — it's only used by GitHub Pages and no longer needed:
   ```bash
   git rm CNAME
   git commit -m "Remove GitHub Pages CNAME"
   git push
   ```

That's it. Every push to `main` now triggers an automatic Vercel deployment.

---

## Notes on the verification-code API

`src/lib/verificationStore.ts` is an **in-memory `Map`**. On Vercel, each API route runs in a serverless function whose memory does **not** persist across cold starts or scale-out instances. In practice it usually still works because the same warm instance handles both `send-verification` and `verify-code` if the user is fast, but it is **not reliable**. For a production-grade store, swap it for:

- [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (Redis, free tier available), or
- [Upstash Redis](https://upstash.com/) (free tier, works on Vercel), or
- A signed JWT containing the code (no storage needed).

Not blocking for launch — flag it as a follow-up.

## Rollback

If anything goes wrong:

1. In Cloudflare DNS, restore the GitHub Pages records (4 × A records to `185.199.108-111.153` and CNAME `www → joy-oyo.github.io`).
2. Re-enable GitHub Pages in repo settings.
3. Restore `CNAME` if you deleted it.
DNS propagation back is also a few minutes.
