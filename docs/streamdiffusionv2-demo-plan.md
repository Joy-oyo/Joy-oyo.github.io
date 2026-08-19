# Live Stream Restyler — build plan

A real-time video web app, linked from `/demos` as a **hosted session**.
Architecture notes on StreamDiffusionV2 live in [`streamdiffusionv2.md`](./streamdiffusionv2.md).

**Status:** planning · **Owner:** Joy · **Last updated:** August 2026
**Supersedes** the earlier self-host-first version of this plan — see [§2](#2-why-the-plan-changed).

---

## 1. The recommendation, up front

> **Don't rent a GPU yet. Build the app on Decart's Lucy API first. Self-host
> StreamDiffusionV2 later, as a margin play, only if usage justifies it.**

You said performance matters most and pointed at [lucy.decart.ai](https://lucy.decart.ai/).
Lucy is not a self-hosted stack you need to reverse-engineer — **it is a public API with a
browser SDK**, and it is a straight-line path to the thing you want to build. The integration
is roughly fifteen lines. Self-hosting StreamDiffusionV2 on RunPod gets you **lower resolution,
higher latency, and weeks of ops work**, in exchange for a cost advantage that does not
materialise until you have real volume.

**Settled configuration:**

```
provider   Decart direct            (not fal — see §6)
model      lucy-restyle-2           $0.60/min, 720p, A/B against lucy-2.5 in Stage 0
access     private, allowlist auth
repo       separate, own subdomain
GPU        none yet                 revisit at ~100 stream-min/month (§8 Stage 3)
```

---

## 2. Why the plan changed

The previous version of this document recommended renting a 4090 and measuring
StreamDiffusionV2 first. Two facts invalidated that ordering:

1. **Lucy is available as an API** — [platform.decart.ai](https://platform.decart.ai/), also
   resold on [fal.ai](https://fal.ai/lucy-2.5). Realtime, over WebRTC, with an
   `@decartai/sdk` browser client, ephemeral tokens, and pay-as-you-go billing with **no
   subscription and no minimum spend**. New accounts get free credits.
2. **It's 720p.** StreamDiffusionV2's published numbers are 480p / 512×512. If performance is
   the priority, the hosted option wins on the axis you care about before cost even enters.

---

## 3. What Lucy actually is

### Specs (`lucy-2.5`, realtime)

| | |
| --- | --- |
| Resolution | **1280×720** per the docs, landscape 16:9 and portrait 9:16. ⚠️ Third-party launch coverage (16 July 2026) claims **1080p / 30 FPS**. That is unreconciled with the official docs and with a price card whose tier is labelled 720p. Verify in Stage 0 before promising a number. |
| Transport | **WebRTC** |
| Reference image | Supported — JPEG / PNG / WebP, ≥512×512 recommended |
| Prompt enhance | On by default |
| **Self-anchoring** | On by default — recent generated frames fed back as reference to prevent long-session drift |
| Reconnect | Automatic, exponential backoff, up to 5 retries |
| Session states | `connecting` · `connected` · `generating` · `reconnecting` · `disconnected` |
| Usage telemetry | `generationTick` event emits `{ seconds }` |
| FPS / latency | **Not published in the docs.** Third-party coverage of the 2.5 launch claims sub-40 ms; treat as unverified marketing until you measure it. |

Note that **self-anchoring solves the same problem as StreamDiffusionV2's adaptive sink
tokens** — unbounded-horizon drift. Two labs, same bottleneck, similar answer. That's a useful
signal that the problem is real and that Decart is solving it at the same level of the stack.

### Eight edit types

Character swap · Add · Replace · Remove · Change attribute · Background · Style · VFX —
each with a documented prompt template. Restyling (your original use case) is one of eight,
and there's a cheaper model dedicated to it.

### Pricing (720p, pay-as-you-go)

| Model | ID | Per second | **Per minute** |
| --- | --- | --- | --- |
| **Lucy Restyle 2** | `lucy-restyle-2` | $0.01 | **$0.60** ← cheapest, and closest to what SDV2 does |
| Lucy 2.5 | `lucy-2.5` | $0.02 | $1.20 |
| Lucy VTON 3.5 | `lucy-vton-3.5` | $0.02 | $1.20 |
| Oasis 3 Preview | `oasis-3-preview` | $0.02 | $1.20 |
| Lucy 2.5 (batch) | `lucy-2.5` | $0.04 | $2.40 |

### Which of these is open source — and why you can't have all three goals

Three different things get called "Lucy," and only one of them is open. Worth being precise,
because the naming actively misleads:

| Model | Open weights? | Realtime? | Where it runs |
| --- | --- | --- | --- |
| **StreamDiffusionV2** | ✅ Apache-2.0, code **and** weights | ✅ | self-host |
| **Lucy Edit Dev** (`decart-ai/Lucy-Edit-Dev`) | ✅ open weights, Wan 2.2 5B | ❌ **batch editing only** | self-host / HF |
| **Lucy Restyle 2** | ❌ proprietary | ✅ | Decart API |
| **Lucy 2.5** | ❌ proprietary | ✅ | Decart API |

**Decart has open-sourced an editing model, not a realtime one.** Lucy Edit Dev has diffusers
support (`LucyEditPipeline`), ComfyUI nodes, and LoRA/finetune scripts — but it is not the
thing behind lucy.decart.ai, and it will not restyle a live camera feed.

So the three goals you named — open source, low cost, high performance — **do not currently
have a single answer**:

```
open + low cost        →  StreamDiffusionV2      but 480p, 357 ms mean latency
high performance       →  Lucy API               but closed, $0.60–1.20/min
open + performance     →  does not exist yet
```

That's not a gap in your options; it's the actual state of the field in August 2026. The
sequencing in [§8](#8-revised-staged-plan) is designed around it: **buy performance now, earn
the open/low-cost position later** through the streams-per-GPU work, which is the one place
all three could eventually be true at once.

### Recommended model: start on `lucy-restyle-2`

| | |
| --- | --- |
| **Why** | Half the price of 2.5 ($0.60 vs $1.20/min), purpose-built for restyling — which is your actual use case — and the same 720p tier. |
| **Upgrade trigger** | You need character swap, reference images, add/replace/remove, or VFX. Those are `lucy-2.5` only. |
| **Switching cost** | One string in `models.realtime(...)`, provided the provider stays behind a single adapter module. |
| **Caveat** | Restyle 2 is a cheaper SKU and may simply be a weaker model. **A/B it against 2.5 in Stage 0** on your own footage before the UX commits to either. |

---

## 4. The three paths

| | **A. Lucy API** | **B. Self-host SDV2** | **C. Recorded only** |
| --- | --- | --- | --- |
| Resolution | **720p** | ~480p (unmeasured) | any |
| Latency | sub-100 ms class (unverified) | 357 ms mean, P99 585 ms (paper, 1×H100 @ 512²) | n/a |
| Cost per stream-minute | $0.60 – $1.20 | **~$0.007** (4090 @ $0.40/hr) | $0 |
| Cost when idle | **$0** | $0.27–0.69/hr if warm | $0 |
| Time to first working demo | **a weekend** | 2–4 weeks | days |
| Ops burden | **none** | pod lifecycle, queue, cold start, moderation, spend caps | none |
| Reference images / 8 edit types | ✅ | ❌ restyle only | — |
| Vendor dependency | high | none | none |
| Margin at scale | poor | **good** | n/a |

### The crossover

Self-hosting looks ~90× cheaper per minute, but that comparison is wrong for a demo because
**a warm GPU bills while idle and the API doesn't**.

```
Self-host, warm 2 h/day  =  60 GPU-hours/month  =  $16 – $41/month, flat
Lucy Restyle 2           =  $0.60 per stream-minute, zero when nobody is streaming

Crossover:  $16 / $0.60  ≈  27 stream-minutes/month
            $41 / $0.60  ≈  68 stream-minutes/month
```

**Below ~30–70 stream-minutes per month, the API is cheaper *and* better *and* faster to
build.** A portfolio demo doing fifty 60-second sessions is 50 minutes — right in that band.

Self-hosting only pulls ahead at real volume: 500 stream-minutes/month is **$300 on the API**
versus **~$41 self-hosted** — but only if one concurrent stream suffices, and only if you
accept 480p and 357 ms. **Self-hosting is cheaper and worse.** The reason to do it is margin
at scale, never quality.

---

## 5. Recommended architecture

```
  Browser — Next.js app                       Your backend                    Decart
  ─────────────────────                       ─────────────                   ──────
  1. POST /api/session ──────────────────────► route handler
                                               ├ auth + rate limit
                                               ├ daily budget check
                                               ├ client.tokens.create()  ────► mint ephemeral
                                               │   (DECART_API_KEY, env only)      token
  2. ◄──────────── { token, expiresAt } ───────┘
                                                                            
  3. getUserMedia({ frameRate: model.fps,
                    width: model.width,
                    height: model.height })
                                                                            
  4. createDecartClient({ apiKey: token })
     models.realtime("lucy-restyle-2")
     client.realtime.connect(stream, {...})  ═══ WebRTC ═══════════════════►  Lucy
                                                                                │
  5. onRemoteStream(edited) → <video>.srcObject  ◄═══════════════════════════════┘
                                                                            
  6. generationTick { seconds } → report back to /api/usage for accounting
```

**The portfolio stays static.** `/demos` links out to a separate app on its own subdomain.
Vercel never touches a GPU, and the Next.js portfolio deploy stays free and cacheable.

### Client-side auth is the one thing you must not get wrong

Decart's own docs say it explicitly: **do not put a permanent API key in browser or mobile
code.** Mint short-lived tokens server-side.

```ts
// app/api/session/route.ts  — server only
export const runtime = "nodejs";

export async function POST(req: Request) {
  // 1. authenticate the caller (session cookie / OAuth) — abuse must be attributable
  // 2. rate limit per account AND per IP
  // 3. check today's spend against a hard cap; refuse rather than overspend
  const client = createDecartClient({ apiKey: process.env.DECART_API_KEY! }); // env only
  const token = await client.tokens.create();
  return Response.json({ apiKey: token.apiKey });
}
```

```ts
// client component
const { apiKey } = await fetch("/api/session", { method: "POST" }).then(r => r.json());
const client = createDecartClient({ apiKey });          // ephemeral, never the real key
const model  = models.realtime("lucy-restyle-2");

const stream = await navigator.mediaDevices.getUserMedia({
  video: { frameRate: model.fps, width: model.width, height: model.height },
});

const rt = await client.realtime.connect(stream, {
  model,
  mirror: "auto",
  onRemoteStream: (edited) => { videoEl.srcObject = edited; },
  initialState: { prompt: { text: "..." } },   // set at connect — see footgun #3
});
```

**Unresolved and worth asking Decart directly:** the token **TTL**, whether a token is
single-use, and whether a per-token session duration cap can be enforced server-side. Without
a server-enforced cap, a client-side 60-second timer is trivially bypassable and your only
real controls are token TTL and how many tokens you mint per period. **Get this answered
before any public launch** — it is the difference between a $30 month and a $3,000 month.

---

## 6. Provider: Decart direct, or fal?

**Recommendation: Decart direct.** The usual reason to prefer an aggregator — one API, one
bill, one auth model across many providers — mostly evaporates here, because of one line in
fal's own docs.

### The decisive fact

> *"Signaling relay only. **Media flows peer-to-peer between the browser and Decart.**"*
> — fal, `decart/lucy-2-5/realtime`

fal never touches the video. Your frames go **browser → Decart** either way. What fal relays is
the WebRTC handshake.

```
Via fal:            browser ──WebSocket (sdp/ice)──► fal ──► Decart
                    browser ◄════════ media, P2P ═══════════► Decart

Via Decart direct:  browser ◄════════ media, P2P ═══════════► Decart
                              (SDK handles the handshake for you)
```

So routing through fal adds a dependency to the handshake path while giving you **none** of
fal's inference infrastructure, **none** of its data-processing guarantees over the media, and
**no** latency advantage — the network path that determines latency is identical.

### And it costs you real work

fal's realtime output schema is `iceServers · type · sdp · candidate · error`. That is raw
signaling. **You implement `RTCPeerConnection` yourself** — negotiate the offer/answer, handle
ICE, manage renegotiation and teardown. fal's docs give the `fal.realtime.connect` skeleton but
no complete WebRTC example.

Decart's SDK collapses all of that into one call that hands you a `MediaStream`:

```ts
const rt = await client.realtime.connect(stream, { model, onRemoteStream });
```

### Side by side

| | **Decart direct** | **fal** |
| --- | --- | --- |
| Media path | browser ↔ Decart | browser ↔ Decart (**identical**) |
| Handshake path | direct | via fal |
| WebRTC negotiation | **handled by SDK** | **you build it** |
| Ephemeral tokens | `client.tokens.create()` | `tokenProvider` + your own signing endpoint (~10 s JWT, endpoint-scoped) |
| Server proxy required | no | **yes** — fal has no browser-callable token endpoint |
| `lucy-restyle-2` (the $0.60/min SKU) | ✅ listed | ❌ not exposed; only `lucy-2-5` and `lucy-2` |
| Published pricing | ✅ full rate card | ❌ **none on the model page** |
| Documented rate limits / concurrency / session caps | partial | ❌ none |
| Model catalog | Lucy, Restyle, VTON, Oasis | 2 Decart endpoints |
| Commercial use | ✅ | ✅ (tagged *Partner*) |

Note that fal's ephemeral-token story is **not simpler** — both require a backend that signs
short-lived credentials with a secret. fal additionally requires a server-side proxy, so it's
strictly more infrastructure.

### When fal would win

If you were already consolidating spend across many models on fal and wanted one invoice and
one key, or if you needed Decart plus several unrelated models behind a single client. Neither
applies to a single-model private beta. And the deciding practical detail: **fal doesn't expose
`lucy-restyle-2`**, so choosing fal means paying $1.20/min instead of $0.60 for a restyling app.

Keep the provider behind one adapter module anyway — fal remains a useful second source if
Decart has an incident or changes pricing.

### Reference implementation worth reading

[`mechanicalreproductions/Lucy-Studio`](https://github.com/mechanicalreproductions/Lucy-Studio)
— an Android-first realtime Lucy client that fetches short-lived tokens scoped to
`decart/lucy-2-5/realtime`. Useful prior art for the token-exchange pattern regardless of
platform.

---

## 7. SDK footguns

Found in the docs; each one is a bug you would otherwise ship.

1. **`set()` is an atomic whole-state replacement.** `set({ image })` **clears the prompt**.
   `set({ prompt })` clears the image. Wrap it in a reducer that always sends complete state —
   never call `set()` with a partial object.
2. **`self_anchor` is connect-time only.** It can't be changed via `set()`, and it *hurts* when
   the subject or scene changes (it anchors to stale frames). If your UX lets users switch
   subjects, that requires a reconnect, not a state update.
3. **Always pass `initialState` with a prompt.** Otherwise viewers see raw unprocessed camera
   for the first moment of the session.
4. **Portrait on desktop needs manual swapping** — pass `model.height` as width and
   `model.width` as height in `getUserMedia`. Mobile maps automatically.
5. **No negative prompts.** "Don't add a hat" does not work; describe the desired result.
6. **Add and VFX require an explicit location**, or placement is unpredictable.
7. **Reference-image composition must match the source shot** — a head-and-shoulders reference
   against a full-body source produces bad results.
8. **`enable_prompt_expansion` / `enhance` defaults to `true`.** Decart rewrites your prompt
   before inference. Great for short prompts, but it means you are not testing what you wrote.
   Turn it **off** during Stage 0 A/B comparisons, then decide.
9. **If you ever use fal:** `@fal-ai/serverless-client` is deprecated — use `@fal-ai/client`.

---

## 8. Revised staged plan

Scoped for **private beta first**, which removes a large amount of v1 work.

### Stage 0 — Validate on free credits. (a weekend, $0)

Sign up, burn the free credits, and answer the questions the docs don't:

- **Measured** end-to-end latency and FPS from your network, on your machine
- **Is it 720p or 1080p?** The docs and the launch coverage disagree. Settle it.
- **A/B `lucy-restyle-2` vs `lucy-2.5`** on your own footage, with prompt expansion **off**
- How does quality hold over a 3–5 minute session with self-anchoring on?
- **Token TTL, single-use or not, and whether session length can be capped server-side**

Deliverable: real numbers, plus footage. The footage alone fills the recorded-showcase slot
even if the app never ships.

### Stage 1 — Private app. (about a week)

Separate repo, separate subdomain, Next.js. Private-first scope:

- **Auth: allowlist.** Magic link or GitHub OAuth restricted to a list of addresses you
  maintain. No public signup, no waitlist plumbing.
- Camera preview → connect → restyled output, side by side
- Curated preset prompts (prompt quality dominates output quality, and Decart's Do/Don't
  guidance is prescriptive enough that presets will beat a free-text box)
- Live prompt swap via `set()` mid-stream, through the full-state reducer
- **Hard 60-second sessions** with a visible countdown
- **Server-side daily spend cap** that hard-stops
- Graceful handling of all five connection states

**Deferred by going private:** queueing, output moderation, abuse reporting, cost-per-visitor
modelling, and public-facing rate limits. All of that becomes real only at Stage 2b.

At 60 s on `lucy-restyle-2`, a session costs **$0.60**. Private-beta usage — call it 30
sessions a month across you and a handful of testers — is **~$18/month**.

⚠️ **Private does not remove the spend cap.** The likeliest way to get a surprise bill is your
own development loop: a hot-reloading dev server that reconnects on every save, billing per
second while you debug. Build the cap and a `generationTick` counter on day one, and add a
kill switch you can hit from the server.

### Stage 2 — Wire it into `/demos`. (private variant)

While private, leave `status: "In progress"` and **do not set `href`** — a public link to a
gated app is a dead end for visitors. Add the Stage 0 footage as `cover` so the card shows
something real. Flip to `Available` with an `href` only when you open it up.

### Stage 2b — Open it up, if you choose to. (later)

This is where moderation, queueing, and public rate limits get built. Deciding this later is
exactly right; the work is substantial and none of it is needed to learn whether the app is
any good.

### Stage 3 — Revisit self-hosting, only on evidence.

Trigger: **sustained usage above ~100 stream-minutes/month**, or a paying product where API
cost eats the margin. Then the [`streamdiffusionv2.md`](./streamdiffusionv2.md) work becomes
relevant, and the thesis is:

> The paper spends **4 GPUs to make 1 stream faster**. A product needs **1 GPU serving N
> streams**. Multi-tenancy appears unexplored, and the SLO-aware batching scheduler is already
> the right primitive — just pointed at denoising steps instead of independent streams.

This is also the only path on which **open source, low cost, and performance stop being
mutually exclusive** — see [§3](#which-of-these-is-open-source--and-why-you-cant-have-all-three-goals).
It's genuine systems work that stands alone as a portfolio artifact. But it is a **Stage 3
optimisation, not a Stage 0 prerequisite.** Building it first optimises a cost you don't have.

---

## 9. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| **Unbounded API spend.** A leaked token, a bypassed client timer, or your own hot-reloading dev server bills you per second. | **High** | Ephemeral tokens only; server-side daily cap that hard-stops; `generationTick` accounting; server-side kill switch; confirm token TTL with Decart. |
| **API key in the client bundle** | **High** | `DECART_API_KEY` server-side only. Never in a client component, never in `NEXT_PUBLIC_*`. |
| **Vendor dependency.** Pricing, availability, and model behaviour are entirely Decart's call, and `lucy-restyle-2` is a single-source SKU. | Medium | Keep the provider behind one adapter module. fal is a partial second source (Lucy 2.5 only, at 2× the price). Stage 3 self-hosting is the real hedge. |
| Resolution and latency claims unverified (720p vs 1080p) | Medium | Stage 0 settles both before any UX or marketing depends on them. |
| `set()` partial-update data loss | Medium | Full-state reducer, enforced by types. |
| **Moderation.** Real-time generative video from arbitrary webcams — NSFW, harassment, likeness misuse. | **Deferred by going private** → High at Stage 2b | Allowlist auth means abuse is attributable and volume is trivial. Keep reference-image upload disabled and no recording/sharing while private. Revisit fully before opening up. |
| Cost per minute is ~90× self-hosting | Low now, High at scale | Watch monthly stream-minutes; Stage 3 trigger at ~100. |

---

## 10. Decisions

### Settled

| | Decision |
| --- | --- |
| Architecture | **API-first.** No GPU rental yet. |
| Provider | **Decart direct** — see [§6](#6-provider-decart-direct-or-fal). fal relays signaling only, doesn't carry the media, doesn't expose the $0.60/min SKU, and publishes no pricing. |
| Model | **`lucy-restyle-2`** to start; A/B against `lucy-2.5` in Stage 0. |
| Access | **Private first.** Allowlist auth, no public launch. |
| Repo | **Separate**, own subdomain. Nothing shared with the portfolio's deploy target. |

### Still open

1. **Who's on the allowlist?** Just you, or a handful of testers? Changes whether Stage 1 needs
   real auth or a single shared secret.
2. **Desktop only, or mobile too?** Mobile means portrait handling and the manual
   width/height swap; desktop-only cuts a chunk of v1.
3. **Does Decart cap session length server-side?** Ask them directly. Until answered, the spend
   cap is your only hard control, and it should be conservative.
4. **Want me to scaffold the repo?** Token route, provider adapter, connection state machine,
   full-state reducer, session cap, budget guard, and the `generationTick` accounting.
