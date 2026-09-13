export type DemoProject = {
  id: string;
  title: string;
  tag: string;
  body: string;
  status: "Planned" | "In progress" | "Available";
  /**
   * Publishing track. "Hosted session" exists because some builds genuinely
   * cannot run in a browser tab — they need a rented GPU, which breaks the
   * lab's zero-cost / nothing-leaves-your-device contract. Giving them their
   * own track keeps that contract honest instead of quietly widening it.
   */
  format: "Interactive demo" | "Hosted session" | "Video showcase";
  formatNote: string;
  /**
   * Live build. Each interactive demo deploys as its own project on its own
   * origin — they set cross-origin isolation headers for multi-threaded WASM,
   * which cannot be shared with a site that loads cross-origin images.
   */
  href?: string;
  /** Source repository. Set as soon as code exists, with or without a deploy. */
  repo?: string;
  cover?: string;
  stack?: string[];
};

export const demoProjects: DemoProject[] = [
  {
    id: "agent-operations-center",
    title: "Agent Operations Center",
    tag: "AI / Enterprise",
    status: "Planned",
    format: "Interactive demo",
    formatNote: "A browser-based operations console with simulated agents, approvals, and traces.",
    body: "Enterprise agents, tool calling, MCP, approvals, and observability.",
  },
  {
    id: "world-model-playground",
    title: "World Model Playground",
    tag: "AI / Vision",
    status: "Planned",
    format: "Interactive demo",
    formatNote: "Upload a short clip and explore predictions from an online vision model.",
    body: "Analyze videos, predict what happens next, and identify physical risks.",
  },
  {
    id: "adaptive-social-agent",
    title: "Adaptive Social Agent",
    tag: "AI / HCI",
    status: "Planned",
    format: "Interactive demo",
    formatNote: "A live text or voice conversation with visible adaptation controls.",
    body: "An AI character that adjusts to the user's emotion, knowledge, and communication style.",
  },
  {
    id: "ai-architecture-sandbox",
    title: "AI Architecture Sandbox",
    tag: "AI / Infrastructure",
    status: "Planned",
    format: "Interactive demo",
    formatNote: "Build a system diagram in the browser and compare estimated tradeoffs.",
    body: "Visually design AI systems and estimate latency, cost, scaling, and bottlenecks.",
  },
  {
    id: "asr-transcriber",
    title: "ASR Transcriber",
    tag: "AI / Speech",
    status: "In progress",
    format: "Interactive demo",
    formatNote:
      "Whisper runs entirely in the browser — drop in audio or record live, then export timestamped text.",
    body: "Private, on-device speech-to-text with timestamps and subtitle export. No upload, no API keys.",
    repo: "https://github.com/Joy-oyo/asr-transcriber",
    // Served from its own repo and Vercel project, proxied in at this path as a
    // multi-zone (see `rewrites` in next.config.mjs). Flip status to
    // "Available" once that deploy is live.
    href: "/asrtranscriber",
    stack: ["Next.js", "Transformers.js", "Whisper", "WebGPU", "Web Worker"],
  },
  {
    id: "ai-interview-simulator",
    title: "AI Interview Simulator",
    tag: "AI / Simulation",
    status: "Planned",
    format: "Interactive demo",
    formatNote: "Run a short interview session and receive an immediate structured scorecard.",
    body: "Realistic hiring managers, customers, or CTOs with scoring and feedback.",
  },
  {
    id: "language-to-robot-planner",
    title: "Language-to-Robot Planner",
    tag: "AI / Robotics",
    status: "Planned",
    format: "Video showcase",
    formatNote: "A recorded Unity simulation will show planning, execution, and obstacle recovery.",
    body: "Instruct a simulated robot in Unity to complete tasks and replan around obstacles.",
  },
  {
    id: "multimodal-product-tester",
    title: "Multimodal Product Tester",
    tag: "AI / UX",
    status: "Planned",
    format: "Interactive demo",
    formatNote: "Upload screenshots or a screen recording and receive a prioritized UX review.",
    body: "AI reviews websites, screen recordings, or apps for UX and usability issues.",
  },
  {
    id: "ai-game-director",
    title: "AI Game Director",
    tag: "AI / Gaming",
    status: "Planned",
    format: "Video showcase",
    formatNote: "A gameplay video will compare dynamic director decisions across play styles.",
    body: "Dynamically changes difficulty, story, and NPC behavior based on the player.",
  },
  {
    id: "live-stream-restyler",
    title: "Live Stream Restyler",
    tag: "AI / Real-time video",
    status: "In progress",
    format: "Hosted session",
    formatNote:
      "Runs on a hosted realtime video model rather than in this tab — book a 60-second session and restyle your own camera feed live.",
    body:
      "Restyle a live camera feed from a text prompt at 720p, streamed over WebRTC. Built on Decart's Lucy realtime API, with StreamDiffusionV2 self-hosting held in reserve as the margin play.",
    stack: ["Lucy Restyle 2", "Decart realtime API", "WebRTC", "Next.js", "Ephemeral tokens"],
  },
];

// ---------------------------------------------------------------------------
// Demo Lab — /demos is laid out like an academic project page: hero → teaser →
// abstract → gallery → motivation → method → results → acknowledgements →
// bibtex. All the prose lives here so the page component stays declarative.
// Structure modelled on https://streamdiffusionv2.github.io/ (credited in the
// acknowledgements section).
// ---------------------------------------------------------------------------

export type LabResource = {
  label: string;
  href: string;
  /** primary = filled button, ghost = clay chip. */
  kind: "primary" | "ghost";
  external?: boolean;
};

/**
 * A numbered figure or video slot. Assets are optional on purpose — until a
 * capture exists the frame renders a designed placeholder rather than a gap,
 * so the page reads as complete while the builds are still landing.
 */
export type LabFigure = {
  /** Numbered label used in the caption, e.g. "Fig. 2" or "Video 1". */
  label: string;
  caption: string;
  /** Mono sub-line: prompt, capture parameters, or a candid limitation note. */
  note?: string;
  src?: string;
  kind?: "video" | "image";
  poster?: string;
  aspect?: "16/9" | "21/9" | "4/3";
  /** Headline shown inside the placeholder while the asset is pending. */
  pending?: string;
  /** Four-up baseline comparison, mirroring the reference/ours grid. */
  panels?: { corner: string; title: string; note?: string }[];
};

export type LabStat = { value: string; label: string; note?: string };

export const demoLab = {
  eyebrow: "Build · Technical demos",
  title: "Demo Lab: Interactive Prototypes for Real-Time AI Media Systems",
  tagline:
    "A rolling lab of nine prototypes — browser-native where the physics allow, recorded builds where they don't — testing where an AI system stops being a demo and starts being a tool.",
  badge: "Rolling release · 1 of 9 builds live",
  // Deliberately just the code. This page is about the builds, so it does not
  // route visitors off into the rest of the site.
  resources: [
    { label: "Code", href: "https://github.com/Joy-oyo", kind: "primary", external: true },
  ] as LabResource[],
  positioning:
    "Every interactive build holds the same contract: first useful output in under a second, no API key in the client, nothing uploaded that doesn't have to be, and a documented path down to CPU so the page still works on an old laptop.",

  teaser: {
    label: "Video 1",
    caption:
      "Four ways to transcribe the same thirty seconds. Top left: reference audio and ground truth. Top right: a hosted cloud API. Bottom left: naive in-browser WASM. Bottom right: this lab — streaming WebGPU Whisper, on-device.",
    note:
      "Clip: a two-speaker product review recorded on a laptop mic, room noise left in on purpose. Capture pending — recorded once the streaming decoder lands.",
    pending: "Comparison capture pending",
    panels: [
      { corner: "Top left", title: "Reference", note: "Raw audio + ground truth" },
      { corner: "Top right", title: "Hosted API", note: "Upload → transcribe → return" },
      { corner: "Bottom left", title: "Naive WASM", note: "Single thread, whole-file decode" },
      { corner: "Bottom right", title: "This lab", note: "Streaming WebGPU, on-device" },
    ],
  } as LabFigure,

  abstract: [
    "AI demos are usually optimised for the screenshot. They run on a warm server, on the happy path, with a prompt the author already knows works — and they quietly fall apart the moment someone brings their own file, their own accent, or their own network. The gap is rarely model quality. It is systems work: latency budgets, streaming, failure ladders, and the unglamorous question of who pays for the inference.",
    "Demo Lab collects nine prototypes that take that systems work as the actual subject. Seven run as interactive builds in the browser; two ship as recorded showcases, because a robot arm and a game engine will not fit in a tab. The first build — an on-device Whisper transcriber — is in progress; the rest land one at a time, each with a build note about what broke. Nothing here needs a key, a quota, or a credit card to try.",
  ],

  abstractStats: [
    { value: "10", label: "Prototypes in the lab", note: "7 interactive · 1 hosted · 2 recorded" },
    { value: "< 1s", label: "Time to first result", note: "Hard constraint, not a metric" },
    { value: "0", label: "API keys in the client", note: "Secrets stay server-side or absent" },
    { value: "$0", label: "Marginal cost per session", note: "Interactive builds run on your hardware" },
  ] as LabStat[],

  gallery: {
    lede:
      "Ten builds, three publishing tracks. Interactive builds run live in this tab. Hosted sessions need a GPU big enough that it has to be rented, so they are queued and time-boxed. Recorded builds ship as video because they depend on hardware or an engine that cannot honestly be faked in a browser.",
    groups: [
      {
        id: "interactive-builds",
        title: "Interactive builds",
        counterLabel: "Demo",
        note: "Runs client-side in this tab. No upload, no key, no quota.",
        format: "Interactive demo" as const,
      },
      {
        id: "hosted-sessions",
        title: "Hosted sessions",
        counterLabel: "Session",
        note: "Runs on someone else's GPU through a metered API, not in your browser — so unlike everything else here, it costs real money per minute and your camera frames do leave your device. Both are stated up front rather than buried.",
        format: "Hosted session" as const,
      },
      {
        id: "recorded-builds",
        title: "Recorded builds",
        counterLabel: "Video",
        note: "Ships as video — a full run including the recovery after something goes wrong.",
        format: "Video showcase" as const,
      },
    ],
  },

  motivation: {
    lede:
      "Near-real-time demos have wildly different budgets depending on what they process — a thirty-second voice note, a 4K screen recording, a live camera feed. The bottleneck moves as the input changes, and it rarely sits where the model card suggests. Four of them shaped how this lab is built.",
    figure: {
      label: "Fig. 1",
      caption:
        "Batch demo versus streaming demo. A batch demo collects everything, then thinks; a streaming demo returns something useful before the input has finished arriving. The second shape is harder to build and is the only one that feels like an instrument.",
      pending: "Diagram in progress",
      aspect: "21/9",
    } as LabFigure,
    bottlenecks: [
      {
        n: "01",
        title: "Latency budgets nobody agreed to",
        body:
          "A demo that answers in four seconds is not a slow tool; it is a different category of object. People stop treating it as an instrument and start treating it as a submission form. Hosted APIs make this hard to escape — the round trip alone eats most of the budget before the model has done anything. So time-to-first-result is treated as a constraint that decides whether a build ships, not a number reported afterwards.",
        figure: {
          label: "Fig. 2",
          caption:
            "Time to first result across deployment modes, same thirty-second clip.",
          note:
            "Hosted figures from vendor documentation; browser figures measured on one M-series laptop in Chrome with a warm model cache.",
          pending: "Chart pending — plotted from logged runs",
        } as LabFigure,
      },
      {
        n: "02",
        title: "The distance between a demo and a tool",
        body:
          "Most prototypes demonstrate a capability rather than attempt a tool. They accept one file format, assume one speaker, and have no answer for the second minute of input. That is a legitimate way to show a model off, but it tells you nothing about whether the thing would survive inside somebody's working day — which is the only question this lab finds interesting.",
        reference: "See Video 1: the same clip, four deployments, one of which you could actually work in.",
      },
      {
        n: "03",
        title: "Privacy is a constraint, not a checkbox",
        body:
          "Voice notes, interview recordings, client screenshots, camera feeds — the inputs these demos want are precisely the inputs people are least willing to hand to a third party. Asking a visitor to upload a client recording to try a portfolio demo is a reasonable thing to refuse. On-device inference is not a feature bolted on afterwards here; it is the only version of these demos most people can actually try.",
      },
      {
        n: "04",
        title: "A portfolio cannot run on a GPU bill",
        body:
          "A demo with a per-session cost has a half-life. It gets rate-limited, then keyed, then quietly taken down when the credits run out. Anything that has to stay online indefinitely needs to cost approximately nothing to serve — which rules out per-request inference and rules in the visitor's own hardware.",
        figure: {
          label: "Fig. 3",
          caption:
            "Cost per session and what it implies about a demo's lifespan. Left: marginal cost by deployment mode. Right: the same builds ranked by how long they can stay online unattended.",
          pending: "Chart pending",
        } as LabFigure,
      },
    ],
  },

  method: {
    lede:
      "The lab is one pipeline with two exits. Everything that can run in a browser tab does; everything that needs a robot, a cluster, or a game engine becomes a recorded showcase with the same write-up attached.",
    figure: {
      label: "Fig. 4",
      caption:
        "The Demo Lab pipeline. Input capture, a chunked scheduler, a runtime ladder that picks the fastest backend the device actually supports, and two publishing exits — interactive build or recorded showcase.",
      pending: "Pipeline diagram in progress",
      aspect: "21/9",
    } as LabFigure,
    stages: [
      {
        n: "01",
        title: "Browser-first inference",
        body:
          "Models run client-side through WebGPU where it exists, inside a dedicated worker so the main thread stays free for the interface. Nothing about the input leaves the tab: no upload step, no signed URL, no retention policy to read. The cost of serving a session is the cost of serving static files.",
      },
      {
        n: "02",
        title: "A chunked streaming scheduler",
        body:
          "Input is cut into short overlapping windows and processed as it arrives rather than collected and decoded in one pass. The overlap is what stops window boundaries from swallowing words; processing-as-you-go is what makes the first result appear while the user is still talking. The same idea carries over to video — small chunks, cached state between them.",
      },
      {
        n: "03",
        title: "A degradation ladder, not a fallback",
        body:
          "Three rungs, checked at load: WebGPU, then WASM with SIMD and threads, then a smaller model at reduced fidelity. The interface says which rung it landed on instead of pretending the experience is identical. A demo that silently runs six times slower is worse than one that tells you why.",
      },
      {
        n: "04",
        title: "No secrets in the client",
        body:
          "Nothing needing a credential runs in the browser. The few features that genuinely require a server — mail, verification, anything with a quota — go through a route handler that reads keys from the environment, validates its input, and rate-limits per session. No keys in the bundle, no keys in the repo, no temporary proxy that becomes permanent.",
      },
      {
        n: "05",
        title: "A recorded track for what physics won't allow",
        body:
          "Robotics planning and a game director cannot be honestly faked in a tab. Those ship as video: a full run, including the recovery after something goes wrong, plus the same write-up an interactive build would get. The rule is that the recording shows a failure and its repair, not only the clean take.",
      },
    ],
  },

  results: {
    lede:
      "The table below is the contract each interactive build is held to. Where a build has shipped the figure is measured; where it hasn't, it's the target that decides when the build is done.",
    columns: [
      "Deployment mode",
      "Time to first result",
      "Throughput",
      "Cost / session",
      "Data leaves device",
      "Basis",
    ],
    rows: [
      ["Hosted API baseline", "1.8 – 4.0 s", "≈ 1× realtime", "≈ $0.006 / min", "Yes", "Vendor docs"],
      ["In-browser WASM (CPU rung)", "6 – 12 s", "0.4× realtime", "$0", "No", "Measured"],
      ["In-browser WebGPU (ASR build)", "0.6 – 1.0 s", "3 – 6× realtime", "$0", "No", "Measured"],
      ["Lab contract (every interactive build)", "< 1 s", "≥ 2× realtime", "$0", "No", "Target"],
      ["Hosted session (Lucy realtime API, 720p)", "to measure", "720p realtime", "$0.60 – 1.20 / min", "Yes", "Vendor pricing"],
      ["Recorded showcase", "—", "—", "$0", "No", "By design"],
    ],
    caveat:
      "No TensorRT, no custom kernels, no quantisation beyond what the browser runtime already ships. Measurements come from a single M-series laptop in Chrome with a warm model cache, which makes them indicative rather than a benchmark — a cold cache adds the model download, and a Windows laptop on an integrated GPU lands closer to the WASM row. The hosted row is the exception on every axis: it is someone else's GPU, its price comes straight from the vendor's rate card, and its latency is deliberately left blank because the vendor does not publish one. Each figure gets replaced with logged numbers as the corresponding build ships.",
    figures: [
      {
        label: "Fig. 5",
        caption:
          "Throughput by device class: M-series laptop over WebGPU versus an integrated-GPU Windows laptop over WASM.",
        pending: "Chart pending",
      },
      {
        label: "Fig. 6",
        caption:
          "Where the time actually goes. Left: model load, cold cache versus warm. Right: per-chunk decode as the window grows.",
        pending: "Chart pending",
      },
    ] as LabFigure[],
  },

  acknowledgements: {
    body:
      "This lab is assembled almost entirely out of other people's work. On-device inference runs on Transformers.js; the speech models trace back to Whisper and the optimisation work around whisper.cpp. The builds themselves are Next.js and Tailwind. The layout of this page — hero, teaser, abstract, gallery, motivation, method, results — is modelled on the StreamDiffusionV2 project page, the clearest example I've seen of a demo explaining itself.",
    links: [
      {
        label: "Transformers.js",
        href: "https://github.com/huggingface/transformers.js",
        note: "Client-side model runtime",
      },
      { label: "Whisper", href: "https://github.com/openai/whisper", note: "Speech recognition models" },
      { label: "whisper.cpp", href: "https://github.com/ggerganov/whisper.cpp", note: "Inference optimisation work" },
      { label: "Next.js", href: "https://nextjs.org", note: "App framework" },
      {
        label: "StreamDiffusionV2 project page",
        href: "https://streamdiffusionv2.github.io/",
        note: "This page's structure is modelled on it",
      },
    ],
  },

  bibtex: `@misc{chen2026demolab,
  title        = {Demo Lab: Interactive Prototypes for Real-Time AI Media Systems},
  author       = {Chen, Joy},
  year         = {2026},
  note         = {Rolling release. Build notes published as each prototype lands},
  howpublished = {\\url{https://joy-oyo.github.io/demos}}
}`,

  sections: [
    { id: "abstract", label: "Abstract" },
    { id: "demos", label: "Demos" },
    { id: "motivation", label: "Motivation" },
    { id: "method", label: "Method" },
    { id: "results", label: "Results" },
    { id: "acknowledgements", label: "Acknowledgements" },
    { id: "bibtex", label: "BibTeX" },
  ],
};
