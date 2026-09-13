# Technical Architecture

**Repo and app root:** `Joy-oyo.github.io/` · **Live:** <https://joylism.com> (Vercel)
**Last verified against source:** September 2026

This document describes what the code *currently does*, not what it should do. Where the
code and the existing docs disagree, the code wins and the disagreement is flagged in
[§11 Debt register](#11-debt-register).

---

## 1. What this repository is

A single-author portfolio with two deployable projects in one repository: the root Next.js
application and a dependency-free static Reading Collection. There is no monorepo tooling,
backend service, or database. Portfolio content is compiled from domain-specific TypeScript
modules; the only application server logic is a two-route email-verification API plus
external rewrites for Reading Collection and ASR Transcriber.

The site has an unusual amount of client-side 3D for a portfolio — three independent WebGL
canvases, one of which is a walkable procedural city — so the dominant architectural
concern is **keeping WebGL off the server and off the critical path**, not data flow.

### Repo layout

```
Joy-oyo.github.io/           # repository and Next.js application root
├─ src/
│  ├─ app/                  # App Router routes and API handlers
│  ├─ components/           # React components (flat + demos/ subfolder)
│  ├─ content/              # site, timeline, about, demos, writing, and media data
│  └─ lib/                  # cn(), verificationStore
├─ public/                  # portfolio images and cyber signage
├─ reading-collection/      # independent static project (HTML + vercel.json)
├─ docs/                    # project plans and supporting documentation
├─ .env.example
├─ next.config.mjs
├─ package.json
├─ package-lock.json
├─ tailwind.config.ts
├─ tsconfig.json
├─ ARCHITECTURE.md
├─ DEPLOY.md                # Vercel + Cloudflare DNS runbook
└─ README.md
```

There is **no CI configuration** (`.github/` does not exist). Deployment is entirely
Vercel's Git integration. There is no test suite and no test runner installed.

---

## 2. Stack

| Layer | Choice | Version |
| --- | --- | --- |
| Framework | Next.js App Router | `14.2.15` |
| Runtime | React / React DOM | `18.3.1` |
| Language | TypeScript, `strict: true`, `target: ES2022` | `5.6.3` |
| Styling | Tailwind CSS + hand-written CSS layer | `3.4.14` |
| Animation | Framer Motion | `11.11.9` |
| 3D | three · @react-three/fiber · @react-three/drei · @react-three/postprocessing | `0.169.0` · `8.17.10` · `9.114.3` · `^2.16.3` |
| Class merging | clsx + tailwind-merge (via `lib/cn.ts`) | `2.1.1` · `2.5.4` |
| Email | nodemailer (Gmail SMTP) | `6.9.15` |

**Declared but unused — zero imports anywhere in `src/`:** `gsap`, `lucide-react`,
`dotenv`.

Path alias: `@/*` → `./src/*`.

---

## 3. Rendering model

This is the load-bearing decision in the codebase, so it's worth stating plainly.

**Every route is a React Server Component by default.** Interactivity is pushed into leaf
client components, and anything touching WebGL is additionally deferred past SSR.

```
Server (RSC)                        Client boundary                  Client-only (ssr:false)
─────────────────────────────────   ──────────────────────────────   ────────────────────────
app/layout.tsx                  →   Nav              ("use client")
app/page.tsx                    →   Landing          ("use client")
                                    TimelineSection  ("use client")
                                →   SceneBackground  ("use client") →  Scene3D    (dynamic)
                                                                       MouseGlow
                                →   PortalMount      ("use client") →  Portal     (dynamic)
app/demos/page.tsx              →   SectionNav, CopyBlock
app/writing/**, photography,
contact, demos                  →   ContactForm, PageHeader
app/reading/page.tsx            →   ReadingCollectionEmbed → external static project
app/cyber/page.tsx ("use client")                                  →  CyberCity   (dynamic)
```

Three rules follow from this and should be preserved:

1. **WebGL never runs during SSR.** `Scene3D`, `Portal`, and `CyberCity` are all loaded via
   `next/dynamic(..., { ssr: false })` behind a thin `"use client"` wrapper
   (`SceneBackground`, `PortalMount`, and the `/cyber` page itself). Importing any of them
   directly into a server component will break the build.
2. **Page shells stay server components** so content, metadata, and layout ship as HTML.
   `PageHeader` is the one exception — it is a client component purely for its entrance
   animation, which is a cost worth knowing about.
3. **No portfolio content fetching exists.** Content is statically imported, so pages are
   prerendered at build time. Dynamic boundaries are the two API routes and the external
   rewrites for Reading Collection and ASR Transcriber.

---

## 4. Route map

| Route | Component kind | Notes |
| --- | --- | --- |
| `/` | RSC | `SceneBackground` (3D) + `Landing` + `TimelineSection`. Anchors `#trajectory`, `#about`. |
| `/demos` | RSC | Academic project-page layout. See [§7](#7-the-demos-project-page). |
| `/photography` | RSC | CSS multi-column masonry over `photos`. |
| `/writing` | RSC | Index, sorted newest-first, computes reading time. |
| `/writing/[slug]` | RSC + `generateStaticParams` | Statically generated per `writings` entry. `notFound()` on miss. |
| `/contact` | RSC | Wraps the `ContactForm` client island. |
| `/reading` | RSC shell + client iframe | Embeds the independent static Reading Collection full-screen; the site nav auto-hides. |
| `/reading-collection/*` | External rewrite | Proxies to `READING_COLLECTION_ORIGIN`, stripping the local prefix upstream. |
| `/asrtranscriber/*` | External rewrite | Multi-zone proxy to `ASR_DEMO_ORIGIN`; the upstream keeps its base path. |
| `/cyber` | **Client** | Full-screen immersive world; `Nav` and `Portal` self-hide here. |
| `/api/send-verification` | Route handler, `runtime = "nodejs"` | POST. |
| `/api/verify-code` | Route handler, `runtime = "nodejs"` | POST. |

`app/about/` and `app/work/` exist as **empty directories** — dead routes left over from an
earlier structure. About and Work were merged into `/` as the `#about` and `#trajectory`
sections.

Global chrome adapts by pathname. `Portal` is absent on `/cyber` and `/reading`.
`Nav` is absent on `/cyber`; on `/reading` it parks above the viewport and reveals on a
top-edge pointer hover or keyboard focus. This lets the paper-white static microsite keep
its original visual system without removing portfolio navigation entirely.

`/cyber` therefore has no global navigation back except the links rendered by that page.

---

## 5. Content layer

Portfolio content is split by domain under `src/content/`. There is no CMS, MDX, or runtime
filesystem read; these typed modules are compiled into the routes that consume them.

| Module | Main exports | Consumed by |
| --- | --- | --- |
| `site.ts` | `site` | Nav, Footer, Landing, contact, timeline mail link |
| `albums.ts` | `albums`, `Album` | AlbumStack |
| `timeline.ts` | work/research tracks, education, talks | TimelineSection |
| `about.ts` | story, current questions, elsewhere, toolkit | TimelineSection About block |
| `demos.ts` | `demoProjects`, `demoLab`, demo types | `/demos`, FigureFrame |
| `photography.ts` | `photos` | `/photography` |
| `writing.ts` | `writings`, `Writing` | `/writing`, `/writing/[slug]` |
| `projects.ts` | legacy selected-project data | currently unconsumed |

The former TypeScript `reading` array was removed: Reading Collection now owns its content
inside its independent static project. Editing a blog post still requires only one entry in
`writing.ts`; `generateStaticParams` picks it up on the next build.

**Types worth knowing:** `TrackItem`, `DemoProject`, `Writing`, `Album`, and the demo-lab
set `LabFigure` / `LabResource` / `LabStat`.

`LabFigure` deserves a note because it encodes a deliberate pattern: `src` is optional, and
`FigureFrame` renders a designed placeholder when it's absent. Unshot figures read as
intentional rather than broken, and swapping in a real asset is a one-field change.

---

## 6. Design system

Tokens live in two places that must be kept in sync: `tailwind.config.ts` (for utilities)
and the `:root` blocks in `app/globals.css` (for the hand-written CSS layer).

### Palette

| Token | Value | Role |
| --- | --- | --- |
| `ink-950` / `--bg` | `#050508` | Page background |
| `ink-900` | `#0a0a12` | Yang / near-black surface |
| `ink-50` / `--fg` | `#f5f5f0` | Foreground, warm white |
| `klein` / `--klein` | `#002FA7` | Accent, focus rings, blooms |
| `--yang` / `--yin` / `--stone` | — | Taiji section theme |

### The clay ("glass") surface system

Despite the class names, this is **claymorphism, not glassmorphism** — opaque fills, no
backdrop blur, and a dual shadow pair (light highlight up-left, soft dark shadow down-right)
that reads as a pressed, pillowy surface. Four tiers escalate in depth:

```
.glass-chip  <  .glass  <  .glass-card  <  .glass-strong
   pills          panels     content cards   forms / modals
```

Three composable modifiers:

- `.glass-sheen` — a masked 1px top rim highlight (the detail that sells the moulded look)
- `.glass-lift` — hover translate + shadow escalation, gated behind `@media (hover: hover)`
- `.glass-bloom` — a Klein-blue radial glow on `::after` at `z-index: -1`, revealed on hover

Any element using `.glass-bloom` **must** also establish a stacking context (`isolate`),
otherwise the negative-z glow escapes behind the page background.

The system degrades on its own: `@media (prefers-reduced-transparency: reduce)` flattens
every tier to an opaque fill and removes sheen and bloom.

### Typography

| CSS variable | Actual font loaded | Declared fallback in `globals.css` |
| --- | --- | --- |
| `--font-display` | Fraunces (variable, `SOFT` axis) | `"Fraunces"` ✅ |
| `--font-geist-sans` | **Inter** | `"Geist"` ❌ |
| `--font-geist-mono` | **JetBrains Mono** | `"Geist Mono"` ❌ |

The variable names and CSS fallbacks are inherited from an earlier Geist-based design and no
longer match what `layout.tsx` actually loads. Cosmetic today, confusing later.

`.display` sets `font-variation-settings: "opsz" 144, "SOFT" 30` plus
`padding-bottom: 0.08em` — the padding exists because `.text-gradient` uses
`background-clip: text`, which clips descenders without it.

### Global overlays

- `.grain` on `<body>` — animated SVG `feTurbulence` noise, 8% opacity, `mix-blend-overlay`,
  `z-index: 100`. Animation is disabled under reduced-motion.
- `.mouse-glow` — Klein spotlight driven by CSS custom properties, `z-index: -5`.
- `html { scroll-padding-top: 6.5rem }` — anchor targets clear the fixed nav. Sections that
  need tighter control use Tailwind's `scroll-mt-28`.

---

## 7. The `/demos` project page

Structurally the most involved page, modelled on an academic project page
(hero → teaser → abstract → gallery → motivation → method → results → credits → BibTeX).
It is a server component composed from four primitives in `components/demos/`:

| Component | Kind | Responsibility |
| --- | --- | --- |
| `LabSection` | RSC | The `NN / Label` → rule → H2 → lede → body rhythm |
| `FigureFrame` | RSC | Numbered figure slot: 2×2 comparison grid · real video/image · placeholder |
| `SectionNav` | Client | `IntersectionObserver` scroll-spy; fixed rail ≥2xl, sticky pill strip below |
| `CopyBlock` | Client | BibTeX panel, Clipboard API, `aria-live` status |

`FigureFrame` picks its mode from the data: `panels` → comparison grid, `src` + `kind` →
real asset, neither → placeholder. `SectionNav` uses
`rootMargin: "-45% 0px -50% 0px"` so a section becomes "current" when it owns the middle of
the viewport, and picks the topmost intersecting entry so scrolling up behaves symmetrically.

The results table is explicitly annotated with a `Basis` column (`Vendor docs` / `Measured`
/ `Target`) and a caveat paragraph. **This is a content invariant, not decoration** — the
numbers are partly design targets, and stripping the provenance column would turn honest
targets into fabricated benchmarks.

---

## 8. The 3D subsystem

Three **independent** `<Canvas>` instances, never mounted simultaneously on the same route
except Scene3D + Portal on `/`.

### 8.1 `Scene3D` — ambient background (`/` only)

- `StarField`: 3,500 points in a `Float32Array`, positions memoised, distributed inside a
  sphere via `Math.cbrt(Math.random()) * 8` for edge bias. `useFrame` applies slow rotation
  plus `state.mouse` parallax.
- `Nebula`: a 30×30 plane with a `canvasTexture` painted from a radial gradient.
- `dpr={[1, 2]}`, `alpha: true`, fixed at `-z-10`, `pointer-events-none`.

⚠️ The `Nebula` canvas texture is built inside an **IIFE in JSX**, so it re-creates a 512×512
canvas on every render of that component rather than being memoised.

### 8.2 `Portal` — floating navigation orb (all routes except `/cyber`)

An 88×88px fixed button in the bottom-right containing its own Canvas: an icosahedron core,
a wireframe `edgesGeometry` shell, and a glow sphere, with hover driving rotation speed,
emissive intensity, and a `scale.lerp`. Clicking adds `.portal-flash` to
`documentElement`, waits 220 ms, `router.push("/cyber")`, then removes the class after
600 ms.

⚠️ `new THREE.Vector3(...)` and `new THREE.IcosahedronGeometry(...)` are allocated inside
`useFrame` / JSX rather than memoised — per-frame garbage on the animation hot path.

### 8.3 `CyberCity` — the walkable world (`/cyber`)

The largest single file in the repo (~28 KB) and the only place with real systems complexity.

**Procedural generation.** `generateCity()` runs a seeded LCG (`seed = 42`,
`s = (s * 9301 + 49297) % 233280`) over `CITY_CONFIG` — a 7×7 grid of 18-unit blocks with
6-unit streets — producing a deterministic `Building[]` plus `cityRadius`. Same city every
load, which is what makes collision data and signage placement cacheable.

**Facade textures.** `makeWindowTexture()` paints a 256×256 canvas of randomly lit windows
and returns a `CanvasTexture`. A few variants are generated and **shared across all
buildings** rather than one per building — the key cost decision in this file.

**Systems present:**

| System | Implementation |
| --- | --- |
| Rain | `instancedMesh` of 1,200 boxes, single shared `THREE.Object3D` dummy for matrix writes |
| Wet ground | drei `MeshReflectorMaterial` |
| Neon signage | 8 PNGs from `/public/cyber/signs/`, loaded via `useTexture(SIGN_PATHS)`, placed by `planSigns(buildings)` |
| Post-processing | `EffectComposer` + `Bloom` (+ `BlendFunction` from `postprocessing`) |
| Camera — cinematic | `CinematicRig`, lerped mouse-driven drift |
| Camera — walk | `WalkController`, WASD + shift sprint, AABB collision, head bob |

**`WalkController` specifics:** `PLAYER_HEIGHT 1.7`, `PLAYER_RADIUS 0.6`, `WALK_SPEED 7.5`,
`SPRINT_MULT 1.8`, `ACCEL 35`, `FRICTION 10`. Collision uses `buildingAABBs(buildings)`,
memoised. Input state lives in refs (`keys`, `velocity`, `yaw`, `pitch`, `isLocked`,
`isDragging`) so the render loop never triggers React re-renders — correct and important.

It registers listeners across three different targets: `document` for
`pointerlockchange`, the canvas element for `mousedown`, and `window` for `mouseup`,
`mousemove`, `keydown`, `keyup`. Each `useEffect` has cleanup.

The component is a `forwardRef` exposing `WalkControllerHandle`, which is how
`app/cyber/page.tsx` drives `enterWalk()` / `exitWalk()` from its HUD.

**`/cyber` page** owns the HUD: clock, coordinates, boot sequence, pointer-lock state, and
an optional ambient audio track. Audio is feature-detected rather than assumed:

```ts
fetch("/audio/cyber-rain.mp3", { method: "HEAD" })
  .then(res => { if (!cancelled && res.ok) setAudioAvailable(true); });
```

The file does **not** currently exist in `public/`, so the control simply never appears.
This is the same "absent asset degrades silently" pattern as `FigureFrame`.

---

## 9. API layer and the verification flow

Two Node-runtime route handlers backed by `lib/verificationStore.ts`.

```
ContactForm (client)                 /api/send-verification            /api/verify-code
  stage: idle
    │ POST { email }
    ├──────────────────────────────────────►
    │                                  generate 6-digit code
    │                                  store { code, timestamp, attempts: 0 }
    │                                  EMAIL_USER && EMAIL_PASS ?
    │                                    ├ yes → nodemailer Gmail SMTP
    │                                    └ no  → console.log, respond { dev: true }
    │ ◄──────────────────────────────────────
  stage: code
    │ POST { email, code }
    ├───────────────────────────────────────────────────────────────────►
    │                                                     lookup, then reject if:
    │                                                       • no entry
    │                                                       • age > 10 min (delete)
    │                                                       • attempts >= 5 (delete)
    │                                                     attempts += 1
    │                                                     compare, delete on success
    │ ◄───────────────────────────────────────────────────────────────────
  stage: done
```

`ContactForm` is a 6-state machine (`idle · sending · code · verifying · done · error`) with
`step` tracked separately so an error preserves which field the user was on. Accessibility
is handled properly here: `autoComplete="one-time-code"`, `inputMode="numeric"`, a single
`aria-live` region that switches between `role="status"` and `role="alert"`, and
`aria-invalid` on the active field.

**Secrets** are environment-only (`EMAIL_USER`, `EMAIL_PASS`) — no keys in the bundle, no
keys in the repo. The dev fallback logs to the server console rather than weakening the flow.

`READING_COLLECTION_ORIGIN` and `ASR_DEMO_ORIGIN` are non-secret deploy-time origins.
`next.config.mjs` accepts public HTTPS origins in production and loopback HTTP during local
development; request data can never select an upstream. Production refuses to build without
a valid Reading Collection origin.

### The known structural flaw

`verificationStore` is an in-memory `Map` pinned to `globalThis`. On Vercel, the two routes
may execute in different serverless instances, so a code written by `send-verification` is
**not guaranteed** to be visible to `verify-code`. It works on warm invocations and fails
unpredictably otherwise. `DEPLOY.md` documents this and lists the fixes (Vercel KV, Upstash,
or a signed JWT carrying the code). Still open.

---

## 10. Build and deploy

```bash
npm install
cp .env.example .env.local     # optional; only the contact form needs it
npm run dev                    # http://localhost:3001
```

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev -p 3001` | Note the **non-default port**. |
| `build` | `next build` | Writes to `.next`. |
| `build:verify` | `NEXT_DIST_DIR=.next-verify next build` | Type/build check **while `dev` is running**. |
| `start` | `next start -p 3001` | |
| `lint` | `next lint` | |

`build:verify` exists for a real reason encoded in `next.config.mjs`: running a normal
`next build` while `next dev` is live overwrites the dev chunks and 404s every asset. Use
`build:verify` (or `npx tsc --noEmit`) to check work without killing the dev server.

```js
distDir: process.env.NEXT_DIST_DIR || ".next",
images: { remotePatterns: [ images.unsplash.com, chenj219.wixsite.com ] },
transpilePackages: ["three"],
```

**Deploy:** the same Git repository feeds two Vercel projects. Reading Collection builds
first from Root Directory `reading-collection`; the portfolio then builds from the repository
root with `READING_COLLECTION_ORIGIN` pointing at the static project's stable HTTPS alias.
`next.config.mjs` exposes that origin below `/reading-collection/*`. Domain `joylism.com`
resolves via Cloudflare DNS in *DNS-only* mode. Full ordering, environment, and rollback
steps are in `DEPLOY.md`.

---

## 11. Debt register

Ordered by how much it would hurt.

| # | Severity | Issue | Location |
| --- | --- | --- | --- |
| 1 | **High** | **The subscribe flow persists nothing.** On success, `verify-code` `console.log`s the address and deletes it from the store. There is no subscriber list, database, or mailing-list integration anywhere in `src/`. The UI tells the user "You're in. Thanks for subscribing!" and then discards them. | `api/verify-code/route.ts` |
| 2 | **High** | In-memory verification store is unreliable on serverless; codes silently fail to validate across instances. | `lib/verificationStore.ts` |
| 3 | Medium | No rate limiting on `/api/send-verification`. Any client can trigger unbounded Gmail sends against your quota, to arbitrary addresses. Attempt-limiting exists only on *verify*, not *send* — so the route doubles as an open email relay for a fixed template. | `api/send-verification/route.ts` |
| 4 | Medium | No email format validation before sending — only a `typeof === "string"` check. | `api/send-verification/route.ts` |
| 5 | Medium | `metadataBase` is `https://joy-oyo.github.io`, but the site serves `joylism.com`. Every canonical, OG, and Twitter URL resolves to the wrong host. | `app/layout.tsx:29` |
| 6 | Medium | `AlbumStack` cards are clickable `motion.div`s with no `role="button"`, no `tabIndex`, and no keyboard activation; hidden `Link`s inside non-top cards remain focusable but call `preventDefault()`, creating a confusing focus trap. | `components/AlbumStack.tsx` |
| 7 | Low–Med | `twitter.card` is `summary_large_image` and `openGraph` is configured, but **no image asset exists** — no `opengraph-image`, no `public/og*`. Social shares render blank. No `sitemap.ts` or `robots.ts` either. | `app/layout.tsx`, `public/` |
| 8 | Low–Med | Per-frame allocations in `useFrame` (`new THREE.Vector3`) and an unmemoised 512×512 canvas texture built in an IIFE inside JSX. | `Portal.tsx`, `Scene3D.tsx` |
| 9 | Low | Three unused dependencies shipped in `package.json`: `gsap`, `lucide-react`, `dotenv`. | `package.json` |
| 10 | Low | Dead code: empty `app/about/` and `app/work/` directories; legacy exports in `timeline.ts` and `projects.ts` are currently unconsumed. | various |
| 11 | Low | Font CSS variables named `--font-geist-*` actually resolve to Inter and JetBrains Mono. | `globals.css` vs `layout.tsx` |
| 12 | Low | `AlbumStack` passes a dynamically changing `priority` to `next/image`; the prop is intended as a static LCP hint. | `components/AlbumStack.tsx` |
| 13 | Low | No tests and no CI. Type safety is the only automated guardrail, and only when run manually. | repo |

### Content-vs-code gap

Worth separating from the list above because it isn't a bug — it's a promise the code hasn't
caught up to. `demoProjects` marks **ASR Transcriber** as `In progress` with a stack of
`Transformers.js · Whisper · WebGPU · Web Worker`. A search across `src/` for
`transformers`, `whisper`, `webgpu`, `onnx`, `AudioContext`, or `MediaRecorder` returns
**only `content/demos.ts`** — the portfolio metadata. None of those packages are in this
application's `package.json`; the implementation lives in the external ASR project reached
through `/asrtranscriber`.

The same applies to the `/cyber` ambient audio: `public/audio/cyber-rain.mp3` is probed for
but has never been added.

---

## 12. Conventions to follow

Patterns the codebase already commits to. Breaking them is what will make it feel
inconsistent.

**Structure**
- Content goes in the matching `src/content/<domain>.ts` module, never inline in a component.
- Reading guides stay inside `reading-collection/` and use relative same-directory links.
- Pages are server components; push interactivity into the smallest possible client leaf.
- Anything touching WebGL, `window`, or `document` at module scope must be behind
  `dynamic(..., { ssr: false })`.

**Styling**
- Compose the four clay tiers rather than writing new shadows.
- Pair `.glass-bloom` with `isolate`.
- Reuse the focus ring verbatim — it appears as a `focusRing` const in most files:
  ```
  outline-none focus-visible:ring-2 focus-visible:ring-klein
  focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950
  ```

**Motion**
- Client components read `useReducedMotion()` and degrade to opacity-only.
- Server components use the `animate-rise` Tailwind keyframe with inline `animationDelay`;
  `globals.css` neutralises it under `prefers-reduced-motion`.

**Accessibility**
- Every page's `<main>` carries `id="main"` for the skip link in `Nav`.
- Decorative elements get `aria-hidden`; decorative images get `alt=""`.
- Captions are always visible, never hover-only (touch devices have no hover).
- Async status changes go through a single `aria-live` region.

**Honesty about state**
- Missing assets render designed placeholders, not gaps (`FigureFrame`, the `/cyber` audio
  probe).
- Unverified numbers are labelled with their basis (`/demos` results table).
