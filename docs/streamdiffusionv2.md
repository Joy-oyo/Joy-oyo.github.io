# StreamDiffusionV2 — Technical Architecture & Progress

Reference notes on **StreamDiffusionV2: A Streaming System for Dynamic and Interactive Video
Generation** — the system whose project page our `/demos` layout is modelled on.

| | |
| --- | --- |
| **Paper** | [arXiv:2511.07399](https://arxiv.org/abs/2511.07399) · v1 10 Nov 2025 · **v2 22 Feb 2026** (camera-ready) |
| **Venue** | MLSys 2026 — **Best Research Paper Award** (announced 18 May 2026) |
| **Code** | [chenfengxu714/StreamDiffusionV2](https://github.com/chenfengxu714/StreamDiffusionV2) · Apache-2.0 · `master` |
| **Weights** | [jerryfeng/StreamDiffusionV2](https://huggingface.co/jerryfeng/StreamDiffusionV2) |
| **Project page** | <https://streamdiffusionv2.github.io/> |
| **Repo state** | ~545 stars · 61 forks · 165 commits |
| **Lead** | Chenfeng Xu (UT Austin) · 14 authors across UT Austin, UC Berkeley, Stanford, MIT, Nunchaku AI, First Intelligence, Shizuku AI |
| **Notes current as of** | August 2026 |

---

## 1. One-paragraph summary

StreamDiffusionV2 is a **training-free inference and serving system** that converts existing
autoregressive video-diffusion models (Wan 2.1 + CausVid-style causal DiT) into something
that can hold a live stream. It does not propose a new model. It proposes a scheduler, a
cache policy, a noise policy, and a parallelism scheme — and the claim is that those
system-level pieces are what stand between "fast video diffusion" and "live video
diffusion." The headline result: **0.37–0.5 s time-to-first-frame** and **58.28 FPS on a 14B
model / 64.52 FPS on 1.3B across 4×H100**, with no TensorRT and no quantisation.

The deeper argument — and the reason this won best paper at a *systems* conference rather
than a vision one — is [§7](#7-the-memory-bound-thesis): streaming video diffusion is
**memory-bandwidth-bound, not compute-bound**, and that will get *more* true as hardware and
VAEs evolve.

---

## 2. Progress timeline

| Date | Event |
| --- | --- |
| 2025-10-06 | Open-sourced |
| 2025-10-18 | Checkpoints published on HuggingFace |
| 2025-11-10 | arXiv v1 |
| 2026-01-26 | Accepted to MLSys 2026 |
| 2026-02-22 | arXiv v2 — camera-ready |
| 2026-03-06 | **Ring-buffer KV cache** shipped (efficient sliding-window attention) |
| 2026-03-27 | **PyPI release** (`pip install streamdiffusionv2`) + optional **TAEHV-VAE** decoder |
| 2026-05-17 | Preliminary **NVIDIA Blackwell** support (requires `torch==2.11.0`) |
| 2026-05-18 | **MLSys 2026 Best Research Paper Award** |

**Read on cadence:** ten months from open-source to best-paper, with roughly monthly
substantive releases through May 2026 — then no news entries for about three months. The
project shifted from research artifact to installable package (PyPI, Blackwell, a lightweight
VAE) rather than chasing new capability, which reads like consolidation. Whether the quiet
since May is a pause, a pivot into the roadmap items, or work moving into
[Daydream's](#10-ecosystem) downstream product is not visible from the repo.

---

## 3. The problem, stated precisely

Four bottlenecks, each of which maps directly onto one architectural component.

### 3.1 Fixed-size input cannot meet real-time SLOs

Offline video diffusion processes a fixed `1 × T × H × W` block per forward pass, where
`T` is 81 frames (CausVid, Self-Forcing) up to several hundred (Wan). Time-to-first-frame:

```
TTFF ≈ (2 · B · T · H · W · P_model) / (C_device · ρ_VAE)
```

For 480p, 81-frame chunk, 1.3B params on one H100 this gives a theoretical **5.31 s** —
matching measurement, and roughly 5× over the ~1 s industry target for live startup.

### 3.2 Drift over unbounded horizons

CausVid and Self-Forcing derive from Wan-2.1-T2V and are trained on 5–10 second clips. Their
KV caches, sink tokens, and RoPE schedules are calibrated for a *bounded* context. Run them
for an hour and sink tokens go stale, RoPE accumulates positional drift, and fixed context
windows stop matching the content statistics. Quality degrades rather than plateaus.

### 3.3 Motion tearing under fast dynamics

Video diffusion training sets skew slow-motion. Inference pipelines compensate with large
chunks and rule-based noise schedules that suppress inter-frame variation — which
over-smooths. Result on fast content: blur, ghosting, tearing.

### 3.4 Poor GPU scaling under per-frame deadlines

Offline parallelism does not transfer. Two reasons:

- **Sequence parallelism** (DeepSpeed-Ulysses, Ring Attention) pays **~40–120 ms** of
  cross-device latency per step — measured at **20–40× higher** than this system's approach.
- **Short chunks** (4 frames ≈ 1,536 tokens at 480p) push the workload into a memory-bound
  regime where communication overhead is proportionally enormous.

---

## 4. System architecture

Three layers. Layer 1 runs on a single GPU; Layer 2 makes it scale; Layer 3 is the
unglamorous work that keeps the pipeline from stalling.

```
                         ┌─────────────────── input stream ───────────────────┐
                         │            webcam / screen / video file            │
                         └─────────────────────────┬─────────────────────────┘
                                                   ▼
   ┌───────────────────────────────────────────────────────────────────────────────┐
   │ LAYER 1 — real-time scheduling & quality control            (single-GPU core) │
   │                                                                               │
   │  SLO-aware batching scheduler      reshape 1×T×H×W  →  B×T′×H×W  (T′ small)   │
   │  Motion-aware noise scheduler      latent Δ → noise rate, EMA-smoothed        │
   │  Adaptive sink + RoPE refresh      cosine-similarity sink swap, RoPE reset    │
   └───────────────────────────────────┬───────────────────────────────────────────┘
                                       ▼
   ┌───────────────────────────────────────────────────────────────────────────────┐
   │ LAYER 2 — scalable pipeline orchestration                      (multi-GPU)    │
   │                                                                               │
   │   GPU0            GPU1            GPU2            GPU3                        │
   │  ┌──────┐        ┌──────┐        ┌──────┐        ┌──────┐                    │
   │  │VAE-enc│──────▶│ DiT   │──────▶│ DiT   │──────▶│ DiT   │──┐  ring topology  │
   │  │+ DiT  │       │blocks │       │blocks │       │+VAE-dec│  │  micro-steps    │
   │  └──────┘        └──────┘        └──────┘        └──────┘  │                  │
   │       ▲                                                     │                  │
   │       └─────────────────────────────────────────────────────┘                  │
   │   Parallel across BOTH network stages AND denoising steps                      │
   │   n denoising steps act as an effective batch multiplier →  L(T, nB)           │
   └───────────────────────────────────┬───────────────────────────────────────────┘
                                       ▼
   ┌───────────────────────────────────────────────────────────────────────────────┐
   │ LAYER 3 — system/algorithm co-design                                          │
   │   DiT block scheduler  ·  Stream-VAE  ·  async comm overlap (2 CUDA streams)   │
   └───────────────────────────────────┬───────────────────────────────────────────┘
                                       ▼
                              clean latent every micro-step  →  decoded frames out
```

### 4.1 SLO-aware batching scheduler

The core reframing. Instead of one large chunk, process `B × T′ × H × W` with **`T′`
deliberately small** (a few frames) to bound per-step latency, and adapt **`B`** to
instantaneous hardware load to keep utilisation high.

Because the workload is memory-bound, latency is modelled as:

```
L(T, B) ≈ ( A(T,B) + P_model ) / ( η · BW_HBM )
```

where `A(T,B)` is activation footprint, `P_model` is parameter memory volume, and
`η ∈ (0,1]` is achieved bandwidth utilisation. With FlashAttention, `A(T,B) = O(BT)`, so
latency grows linearly in `B` — but throughput does not:

```
f = B·T / L(T,B)  ∝  B / (1 + B)
```

This is the whole trick. Throughput has **diminishing returns in `B`**, so the scheduler
climbs toward the roofline knee — the memory-bound → compute-bound transition — and settles
at `B*`, the smallest batch that saturates bandwidth without blowing the per-frame deadline.
Constraint: `B · T` must not exceed the frames already buffered from the input stream.

### 4.2 Adaptive sink token + RoPE refresh

Fixes drift ([§3.2](#32-drift-over-unbounded-horizons)). Where Self-Forcing fixes the sink
set for the whole run, this updates it continuously against evolving prompt semantics.

For sink set `S_t = {s₁ᵗ … s_mᵗ}` and new chunk embedding `h_t`:

```
αᵢ = cos(h_t, sᵢᵗ⁻¹)

sᵢᵗ = sᵢᵗ⁻¹   if αᵢ ≥ τ        (keep — still aligned)
sᵢᵗ = h_t     otherwise         (refresh the least-similar sinks)
```

`τ` is set **high** in practice, so sinks track the text closely. RoPE phase is reset once
the frame index passes `T_reset`:

```
θ_t = θ_t              if t ≤ T_reset
θ_t = θ_(t − T_reset)   otherwise
```

Combined with a **rolling / ring-buffer KV cache** (shorter cache, sliding window), this is
what turns a 5–10 second clip generator into an unbounded stream.

### 4.3 Motion-aware noise scheduler

Fixes tearing ([§3.3](#33-motion-tearing-under-fast-dynamics)). Notably it uses a
**frame-difference proxy on latents**, not real optical flow — cheap enough to run per chunk.

```
d_t  = sqrt( (1/CHW) · ‖v_t − v_(t−1)‖²₂ )         RMS latent delta

d̂_t  = clip( (1/σ) · max_{i ∈ [t−k, t]} dᵢ , 0, 1 )  windowed max, normalised

s_t  = λ·[ s_max − (s_max − s_min)·d̂_t ] + (1−λ)·s_(t−1)     EMA-smoothed noise rate
```

Fast motion (`d̂_t` high) → conservative denoising, suppressing tearing and ghosting. Slow or
static scenes → aggressive refinement, recovering detail. The EMA prevents the noise rate
from snapping between regimes and creating its own visible artifact.

### 4.4 Multi-pipeline orchestration

DiT blocks are **partitioned across devices**; each device treats its input sequence as a
**micro-step** and passes results to the next stage in a **ring**. Stages therefore run
concurrently, giving near-linear DiT speedup.

The critical detail: naive pipeline parallelism alone does *not* deliver linear FPS scaling.
It is paired with the Layer-1 batching scheduler, and the `n` denoising steps are treated as
an **effective batch multiplier** — the latency model becomes `L(T, nB)`. Deeper in-flight
pipelines from more denoising steps *amplify* the Stream-Batch benefit rather than costing
throughput. The implementation guarantees a **clean latent at every micro-step**.

### 4.5 The three Layer-3 optimisations

| Component | What it does | Why it matters |
| --- | --- | --- |
| **DiT block scheduler** | Measures per-stage execution time at runtime and reallocates DiT blocks between devices to equalise it. | Static partitioning is unbalanced by construction: rank 0 also does VAE encode and the last rank does VAE decode. That imbalance becomes pipeline bubbles. |
| **Stream-VAE** | Encodes/decodes **short chunks (~4 frames)** instead of long sequences, caching intermediate features inside each 3D convolution to hold temporal coherence. | The VAE is **~30% of total inference time**. This is also the main lever on TTFF. |
| **Async communication overlap** | Two CUDA streams per GPU — one compute, one communication — so P2P transfers hide behind local compute. | Removes residual bubbles; matches each device's compute pace to its bandwidth. |

The Stream-VAE detail explains an otherwise-odd result: **14B throughput is close to 1.3B**
throughput. Both share the same VAE weights, and since the VAE is a fixed ~30% of runtime,
scaling the model 10× only inflates the DiT portion.

---

## 5. Model stack

StreamDiffusionV2 is a serving layer over a stack of other people's models:

```
Wan 2.1 T2V  (1.3B / 14B)          ← base bidirectional video diffusion
        │
        ▼  DMD distillation, CausVid-style  (+ optional REPA / DINOv2 alignment)
Causal DiT  (autoregressive, few-step)
        │   14B variant sourced from CausVid-Plus
        ▼
StreamDiffusionV2 serving pipeline  ← this paper: schedulers, caches, parallelism
        │
        ├─ Wan VAE (streaming variant)     default
        └─ TAEHV VAE (taew2_1.pth)         optional, lower decode cost
```

Checkpoints in use: `Wan-AI/Wan2.1-T2V-1.3B`, `Wan-AI/Wan2.1-T2V-14B`,
`jerryfeng/StreamDiffusionV2` (`wan_causal_dmd_v2v`, `wan_causal_dmd_v2v_14b`), and
optionally `madebyollin/taehv`.

**Training-free is a load-bearing claim.** The system adds no training requirement. The
paper does describe optional **REPA finetuning** (cosine-alignment of DiT hidden states to
DINOv2 features, `L = L_DMD + λ·L_REPA`) as an orthogonal quality boost during distillation —
but that's an appendix, and the training code is **not released**.

---

## 6. Results

All runs **bf16, no TensorRT, no quantisation**. Hardware: 4×H100 80GB (NVLink) and
4×RTX 4090 24GB (PCIe). Resolutions 512×512 and 480p (832×480), 1–4 denoising steps.

### 6.1 Throughput

| Model | Hardware | 480p | 512×512 |
| --- | --- | --- | --- |
| 1.3B, 1-step | 4×H100 | 42.26 FPS | 61.57 FPS |
| 1.3B, 4-step | 4×H100 | > 40 FPS | ~60 FPS |
| 1.3B | 4×RTX 4090 (PCIe) | ~16 FPS | ~24 FPS |
| **14B** | 4×H100 | **39.24 FPS** | **58.28 FPS** |
| 14B, more steps | 4×H100 | — | 31.62 FPS |

The abstract's headline `64.52 FPS (1.3B)` is the peak configuration; §5.2.2 reports
61.57 FPS at 512×512 1-step. Read the abstract number as best-case.

### 6.2 Time-to-first-frame

| System | TTFF @ 30 FPS | Relative |
| --- | --- | --- |
| **StreamDiffusionV2** | **0.37 s** (0.47 s @ 16 FPS) | 1× |
| CausVid | ~6.7 s | **18×** worse |
| Wan2.1-T2V-1.3B (50 step) | ~104 s | **280×** worse |

### 6.3 SLO metrics — the most convincing table in the paper

Single H100, 1-step, 512×512, online video-to-video, 1.0 s end-to-end budget:

| Metric | | Mean | Std | P50 | P90 | P95 | P99 | Miss rate (1 s) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **SDV2** | Tail latency | 357 ms | — | 361 | 484 | 497 | 585 | **0.2%** |
| | Jitter | 21 ms | 30 | 13 | 45 | 61 | 132 | — |
| **CausVid** | Tail latency | 1760 ms | — | 1672 | 2958 | 3304 | 3896 | **99.9%** |
| | Jitter | 235 ms | 255 | 164 | 498 | 599 | 1310 | — |

A **0.2% vs 99.9% miss rate** is the actual thesis of the paper. CausVid is fast on average
and unusable in a live pipeline; the difference is entirely distributional.

### 6.4 Quality

| | StreamDiffusion | StreamV2V | CausVid | **SDV2** |
| --- | --- | --- | --- | --- |
| Text-Image CLIP ↑ | 26.48 | — | 27.69 | **29.29** |
| Temporal CLIP ↑ | 95.24 | 96.58 | 98.48 | **98.51** |
| Warp Error ↓ | 117.01 | 102.99 | 78.71 | **73.31** |

**Ablation** — the two quality components are near-orthogonal:

| Sink token | Dynamic noising | CLIP ↑ | Warp Error ↓ |
| --- | --- | --- | --- |
| — | — | 98.38 | 79.51 |
| — | ✓ | 98.36 | 75.71 |
| ✓ | — | 98.47 | 73.64 |
| ✓ | ✓ | **98.51** | **73.13** |

Note the honest reporting: dynamic noising alone *slightly lowers* CLIP while improving warp
error — trading a little semantic fidelity for pixel-level temporal alignment.

---

## 7. The memory-bound thesis

This is the part worth internalising, because it generalises past this specific system.

**Roofline for H100 SXM:** 990 TFLOP/s dense FP16, 1.5 TB/s HBM →

```
AI_ridge = 990 TFLOP/s ÷ 1.5 TB/s = 660 FLOP/Byte
```

For a causal DiT with hidden dim `C`, query length `L_q`, KV length `L_kv`, batch `b`,
`N` layers:

```
compute  F = N ( 24·b·L_q·C²  +  4·b·L_q·L_kv·C )
memory   B = N ( 24·C²  +  4·b·L_kv·C  +  4·b·L_q·C  +  36·b·L_q·C )  +  b·γ
```

`γ` is the extra traffic beyond standard DiT read/write — sliding-window buffering, feature
concatenation — **measured with Nsight Systems at 5.2 GiB**. With the real 480p config
(`C = 2048`, `L_q = 1536`, `L_kv = 1536×6`, `N = 30`):

```
Intensity ≈ (F / 990 TFLOPS) / (B / 1.5 TB/s) ≈ 0.84  <  1     → memory-bound
```

Two trends push this further, not back:

- **Hardware.** V100 → GB100: peak compute ~17× (≈130 TFLOP/s → ≈2.3 PFLOP/s), HBM
  bandwidth only ~7× (≈1.1 → ≈8 TB/s). The roofline knee keeps moving right.
- **Algorithms.** Better VAEs compress harder — Wan 2.2's VAE cuts token count to **¼** of
  Wan 2.1's. Fewer tokens means less compute per byte moved, dropping normalised intensity
  to **~0.2**.

So the design bet is that shaping *memory traffic and scheduling under SLO constraints* is
the durable lever, and that compute-side tricks (quantisation, TensorRT, sparse attention)
are attacking the side of the ratio that isn't binding. That's a strong, falsifiable claim,
and it's why the paper reads as systems research rather than a model release.

---

## 8. Repository and API surface

### Constraints

| | |
| --- | --- |
| OS | **Linux only** + NVIDIA GPU (no Windows, macOS, or AMD path) |
| Python | 3.10 |
| Blackwell | Preliminary; requires `torch==2.11.0` / `torchvision==0.26.0` |
| Frontend | Node.js 18 |
| Optional | `flash-attn` extra (recommended for throughput) |

### Install

```bash
conda create -n streamdiffusionv2 python=3.10 -y && conda activate streamdiffusionv2
pip install streamdiffusionv2
pip install "streamdiffusionv2[flash-attn]"     # recommended
```

### Python API — single GPU

The API exposes the streaming loop explicitly, which is the clearest illustration of the
chunked architecture: `chunk_video → encode_chunk → denoise_chunk → decode_chunk`, with the
noise scale threaded through as state.

```python
from streamdiffusionv2 import StreamDiffusionV2Pipeline, export_video, load_video

stream = StreamDiffusionV2Pipeline(
    checkpoint_folder="ckpts/wan_causal_dmd_v2v",
    mode="single",          # "single" | "single-wo" (no Stream-Batch) | "pipe"
)
stream.prepare("A dog walks on the grass, realistic")

video = load_video("examples/original.mp4", height=480, width=832)
noise_scale = stream.noise_scale

for video_chunk in stream.chunk_video(video):
    encoded = stream.encode_chunk(
        video, video_chunk,
        previous_noise_scale=noise_scale,
        initial_noise_scale=stream.noise_scale,
    )
    noise_scale = encoded.noise_scale          # motion-aware controller state
    denoised = stream.denoise_chunk(encoded)
    if denoised is None:                        # pipeline still filling
        continue
    frames = stream.decode_chunk(denoised)
```

`stream.enable_acceleration(fast=True)` flips on `use_taehv` + `use_tensorrt` and swaps the
config to `wan_causal_dmd_v2v_fast.yaml`.

### Python API — multi-GPU

Pipeline parallelism needs multiple worker processes, so it is **not** an inline call —
it's a single entry-point function that spawns them:

```python
from streamdiffusionv2 import run_video_to_video

run_video_to_video(
    mode="pipe", checkpoint_folder="ckpts/wan_causal_dmd_v2v",
    video_path="examples/original.mp4", prompt="...",
    output_path="outputs/python_pipe.mp4",
    gpu_ids=[0, 1], num_gpus=2,
)
```

### CLI

```bash
./run_v2v.sh single       # single GPU, Stream-Batch
./run_v2v.sh single-wo    # single GPU, no Stream-Batch
./run_v2v.sh pipe         # multi-GPU pipeline
./run_v2v.sh pipe --profile   # profiling ONLY — not valid for benchmarks or deployment
```

Key flags: `--step` (1–4), `--height/--width`, `--fps`, `--use_taehv`, and `--schedule_block`
(the dynamic DiT block scheduler — pipe mode only, and described as helping only on *some*
multi-GPU configurations). Env overrides: `NPROC_PER_NODE`, `MASTER_PORT`, `OUTPUT_FOLDER`,
`VIDEO_PATH`, `PROMPT_FILE_PATH`.

### Repo structure

| Path | Contents |
| --- | --- |
| `streamdiffusionv2/` | core package — pipeline, schedulers, utils |
| `models/` | model definitions |
| `configs/` | `wan_causal_dmd_v2v.yaml`, `..._fast.yaml` |
| `demo/` | web UI (own README) |
| `streamv2v/` | extended usage examples |
| `tools/`, `examples/`, `assets/` | helpers, sample input, demo GIFs |
| `run_v2v.sh` | unified offline inference entry point |

---

## 9. Serving topology (the web demo)

```
Browser  ──  MediaDevices API (webcam / screen capture)
   │         demo/frontend, Node 18, npm run build
   │
   │         transport protocol NOT documented — do not assume WebRTC or WebSocket
   ▼
Backend  ──  0.0.0.0:7860   (serves built frontend + inference)
   │         GPU_IDS → num_gpus, single-node multi-GPU
   ▼
StreamDiffusionV2 pipeline  ──  ckpts/ (+ optional ckpts/taew2_1.pth)
```

Env: `HOST`, `PORT`, `GPU_IDS`, `STEP` (1–4), `USE_TAEHV`. **Official guidance is `STEP=2`
for real-time live streaming** — the speed/quality sweet spot, which is a more useful default
than the 1-step headline numbers.

Two operational notes:

- The `demo/` README does **not** state how frames move between browser and backend. Anyone
  integrating should read `demo/start.sh` and the frontend source rather than assume.
- The demo binds **`0.0.0.0:7860` with no authentication documented**. On any shared or
  cloud host that is an open GPU endpoint. Bind `127.0.0.1` and front it with something that
  authenticates before exposing it.

---

## 10. Ecosystem

- **Daydream** has integrated this pipeline into their demo UI,
  [`daydreamlive/scope`](https://github.com/daydreamlive/scope) — the clearest signal of
  production pickup.
- Lineage credited by the authors: [StreamDiffusion](https://github.com/cumulo-autumn/StreamDiffusion)
  and [StreamV2V](https://github.com/Jeff-LiangF/streamv2v) for inspiration,
  [CausVid](https://github.com/tianweiy/CausVid) for the causal DiT,
  [Self-Forcing](https://github.com/guandeh17/Self-Forcing) for the rolling KV cache idea.
- Related contemporaries worth tracking from the same circle: LongLive, StreamDiT,
  Matrix-Game 2.0, MAGI-1, Sparse VideoGen 1/2.

---

## 11. Maturity assessment

### Shipped

Inference pipeline, single + multi-GPU, offline CLI and online web demo, HF checkpoints for
1.3B and 14B, PyPI distribution, ring-buffer KV cache, optional TAEHV decoder, preliminary
Blackwell support.

### Roadmap (open)

- [ ] Dynamic scheduler for varying workloads
- [ ] Training code
- [ ] FP8 support
- [ ] TensorRT support

### Gaps worth flagging before adopting

1. **The dynamic scheduler is the paper's headline and is listed as unfinished.** The paper
   presents the SLO-aware batching scheduler and dynamic DiT-block scheduler as central
   contributions; the README's to-do list still has "dynamic scheduler for different
   workloads" unchecked, and `--schedule_block` is documented as helping only on *some*
   configurations. **The published numbers may not be reproducible from the released code
   with default settings.** Verify before quoting them.
2. **TensorRT is simultaneously a to-do and a code path.** `enable_acceleration(fast=True)`
   sets `use_tensorrt`, but TensorRT is unchecked on the roadmap. Treat that flag as
   unvalidated.
3. **No training code**, so the REPA quality path in the appendix is not reproducible.
4. **Linux + NVIDIA only.** No Windows, macOS, or AMD story at all.
5. **Benchmarks are single-configuration.** One H100 workstation and one 4090 box. The 4090
   result (~16 FPS at 480p) is the honest number for consumer hardware, and it comes with a
   caveat that batching was disabled there due to 24 GB memory limits.
6. **Demo is explicitly minimal** and unauthenticated.
7. **Latency figures exclude the network.** The project page states demo stutter comes from
   **50–300 ms** of network transport on top of the compute latency. A 357 ms mean tail
   latency plus 300 ms of network is a different product than 357 ms.

### What I'd watch next

Whether FP8 lands. The paper argues the regime is memory-bound, and FP8 reduces *bytes moved*
as much as it reduces compute — so it should compound with this architecture rather than hit
a wall, unlike TensorRT-style compute optimisation. If FP8 ships and delivers close to
linear gains, that's strong confirmation of the [§7](#7-the-memory-bound-thesis) thesis. If
it doesn't, the memory-bound framing deserves a second look.
