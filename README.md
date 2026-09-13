# joylism.com

Personal portfolio of Joy Chen. This repository contains two deployable projects:

- the Next.js portfolio at the repository root;
- a dependency-free static reading microsite in `reading-collection/`.

Live site: <https://joylism.com>

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript and Tailwind CSS
- Framer Motion
- React Three Fiber
- Nodemailer
- Plain HTML, CSS, and JavaScript for Reading Collection

## Local development

Copy `.env.example` to `.env.local`. Set `EMAIL_USER` and `EMAIL_PASS` if the
contact verification flow is needed.

Run the static reading project in one terminal:

```bash
python3 -m http.server 3002 --directory reading-collection
```

Run the portfolio in another:

```bash
npm install
npm run dev
```

`READING_COLLECTION_ORIGIN` defaults to the documented local value
`http://127.0.0.1:3002` in `.env.example`. Open <http://localhost:3001>.

## Deployment

The same Git repository is connected to two Vercel projects:

| Project | Root Directory | Framework |
| --- | --- | --- |
| Portfolio | repository root | Next.js |
| Reading Collection | `reading-collection` | Other / Static |

Deploy Reading Collection first, then set its stable production URL as
`READING_COLLECTION_ORIGIN` in the portfolio project and deploy the portfolio.
The main site proxies `/reading-collection/*` to that origin while `/reading`
keeps the portfolio shell and embeds the collection.

See [`DEPLOY.md`](./DEPLOY.md) for the complete Vercel and Cloudflare runbook.

## Repository layout

```text
src/app/                  # App Router pages and API routes
src/components/           # React UI, animation, and 3D components
src/content/              # domain-specific content modules
src/lib/                  # shared utilities and verification state
public/                   # portfolio images and static assets
reading-collection/       # independently deployable static microsite
docs/                     # project plans and supporting documentation
ARCHITECTURE.md            # technical architecture
DEPLOY.md                  # deployment and DNS runbook
```
