# Joy Chen — Portfolio (Next.js Rebuild)

Modern rebuild of the personal portfolio with a web-driven stack.

## Stack

- **Next.js 14** (App Router, RSC)
- **TypeScript** (strict)
- **Tailwind CSS** — design tokens for Klein Blue + Gold theme
- **Framer Motion** — declarative animations (replaces GSAP)
- **lucide-react** — icon system (replaces Font Awesome)
- **next/font** — self-hosted Inter + Playfair Display

## Architecture

```
src/
├─ app/
│  ├─ layout.tsx         # root layout + fonts + metadata
│  ├─ page.tsx           # home — composes sections from content
│  └─ globals.css        # Tailwind base + tokens
├─ components/           # presentation only, no data
│  ├─ Nav.tsx            # sticky glass nav with mobile drawer
│  ├─ Hero.tsx           # animated hero w/ scroll cue
│  ├─ Stats.tsx          # CountUp animated stats band
│  ├─ Marquee.tsx        # CSS-only skills marquee
│  ├─ Orbit.tsx          # orbital portfolio map (replaces SVG roadmap)
│  ├─ ProjectSection.tsx # alternating split sections
│  ├─ Newsletter.tsx     # validated email form
│  └─ Footer.tsx
└─ content/
   └─ portfolio.ts       # ⭐ single source of truth — edit this to update site
```

## Develop

```bash
cd next
npm install
npm run dev    # http://localhost:3001
```

## Build

```bash
npm run build
npm start
```

## Editing content

All copy, project links, stats, and skills live in **`src/content/portfolio.ts`**.
Change a value there and it updates everywhere — no markup edits needed.

## Deploy

- **Vercel** (recommended): `vercel` from this folder, or import the repo and set root dir to `next`.
- **Static export**: add `output: "export"` to `next.config.mjs` and `next build`.

## What changed vs. the original site

| Original | New |
|---|---|
| Plain HTML + jQuery | Next.js + React Server Components |
| Bootstrap 5 | Tailwind CSS w/ custom tokens |
| GSAP + ScrollTrigger | Framer Motion `whileInView` |
| Font Awesome via CDN | lucide-react (tree-shaken) |
| `nav.html` + `footer.html` partials loaded by jQuery | Reusable React components |
| Inline content in markup | Typed content module |
| Custom SVG roadmap | Orbit layout (responsive, mobile fallback) |
| jQuery email form | React form w/ validation states |

The original site at `../index.html` is untouched.
