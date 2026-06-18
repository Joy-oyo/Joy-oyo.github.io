# joylism.com

Personal portfolio of Joy Chen — built with Next.js, deployed on Vercel.

🌐 Live site: <https://joylism.com>

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion + GSAP
- React Three Fiber (3D)
- Nodemailer (contact-form verification)

## Local development

```bash
cd next
npm install
npm run dev
```

Then open <http://localhost:3001>.

To use the email verification feature locally, copy `next/.env.example` to
`next/.env.local` and fill in `EMAIL_USER` / `EMAIL_PASS` (Gmail App Password).

## Deployment

Every push to `main` is auto-deployed to Vercel.
See [`DEPLOY.md`](./DEPLOY.md) for the full setup (Vercel + Cloudflare DNS).

## Repo layout

```
next/                  # the Next.js app (all production code lives here)
├─ src/app/            # routes (App Router)
├─ src/components/     # React components
├─ src/content/        # portfolio data
├─ src/lib/            # utilities
└─ public/             # static assets

DEPLOY.md              # deployment & DNS guide
```
