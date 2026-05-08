# Joy Chen — Interactive Portfolio (Next.js)

A 3D-immersive, stacked-album-style portfolio built with Next.js 14, Three.js (R3F), GSAP, and Framer Motion.

## Highlights

- **Immersive 3D background** — particle star field with mouse parallax (Three.js + React Three Fiber).
- **Album stack interaction** — click / drag / keyboard ← → / scroll to flip through 5 themed "albums" (About, Photography, Projects, Writing, Contact).
- **Dedicated pages** for each album with editorial layouts.
- **Email subscription** — code-verified signup, migrated from the old `server.js` into Next.js API routes.
- **Deployable to Vercel** out of the box.

## Getting started

```bash
cd next
npm install
cp .env.example .env.local   # fill in Gmail app password if you want contact form
npm run dev                  # http://localhost:3001
```

## Project structure

```
next/
├─ public/images/          # static assets (tree1–4.jpg, favicon)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx        # root layout, fonts, Nav, grain overlay
│  │  ├─ page.tsx          # Home: 3D scene + Hero + AlbumStack
│  │  ├─ about/            # About / Resume
│  │  ├─ photography/      # Gallery
│  │  ├─ projects/         # Project grid
│  │  ├─ writing/          # Blog list + [slug]
│  │  ├─ contact/          # Contact form
│  │  ├─ api/
│  │  │  ├─ send-verification/route.ts
│  │  │  └─ verify-code/route.ts
│  │  └─ globals.css
│  ├─ components/
│  │  ├─ Scene3D.tsx       # Three.js star field / nebula
│  │  ├─ SceneBackground.tsx   # client-only dynamic wrapper
│  │  ├─ Hero.tsx
│  │  ├─ AlbumStack.tsx    # ★ core interaction
│  │  ├─ PageHeader.tsx
│  │  ├─ ContactForm.tsx
│  │  ├─ Nav.tsx
│  │  └─ Footer.tsx
│  ├─ content/portfolio.ts # ALL editable content lives here
│  └─ lib/
│     ├─ cn.ts             # class-name helper
│     └─ verificationStore.ts # in-memory code store (swap for Redis in prod)
├─ tailwind.config.ts
├─ next.config.mjs
└─ package.json
```

## Editing content

Open `src/content/portfolio.ts` and edit:

- `site` — name, tagline, bio, email, social links
- `albums` — the 5 cards on the homepage
- `experiences` / `skills` — About page
- `projects` — Projects page
- `photos` — Photography page
- `writings` — Writing index (add `.md` / MDX files later if you want real posts)

## Deployment (Vercel)

1. Push to GitHub.
2. Import the `next/` folder as the project root in Vercel.
3. Add env vars `EMAIL_USER` and `EMAIL_PASS` if you're using the contact form.
4. Ship.

## Tech stack

| Layer        | Choice                                   |
| ------------ | ---------------------------------------- |
| Framework    | Next.js 14 App Router, React 18, TS      |
| Styling      | Tailwind CSS v3 + custom CSS utilities   |
| 3D           | Three.js + @react-three/fiber + drei     |
| Animation    | Framer Motion + GSAP (optional)          |
| Icons        | lucide-react                             |
| Email        | nodemailer (Gmail SMTP)                  |
| Fonts        | Instrument Serif (display) + Geist (UI)  |

## Design tokens

- **Background**: `#050508` (near-black, space)
- **Foreground**: `#f5f5f0` (warm white)
- **Accent**: Klein Blue `#002FA7`
- **Grain overlay**: animated SVG noise at 8% opacity
