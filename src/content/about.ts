// ---------------------------------------------------------------------------
// About — shown on the home page, beneath the trajectory + education.
// ---------------------------------------------------------------------------

// The longer story — a few short paragraphs, most-recent-first framing.
export const story: string[] = [
  `I work at the seam between product, code, and image. By day I architect AI-powered media solutions at Tencent; by night I run a small consulting practice, and shoot stills on the side.`,
  `The mix wasn't planned. I started in Media Studies because I liked stories, picked up CS because I liked making things, then spent a Master's at UChicago getting comfortable with the parts of AI that aren't a demo. Somewhere along the way I noticed the most interesting questions for me sit between disciplines — what a model can render, what a person actually wants to make, and what a screen can carry.`,
  `I'm drawn to tools that disappear into the work. The ones that let you forget they're there until the moment you need them. That's true whether it's a cloud media pipeline, a job-hunt copilot, or a camera. I care less about whether something is "AI" and more about whether it earns its place in someone's day.`,
  `If we end up talking, I'd rather hear about what you're trying to make than what you're building with. The stack is downstream of the idea.`,
];

// What I'm currently thinking about — open questions, not answers.
export const currentlyThinking: { title: string; body: string }[] = [
  {
    title: "Where do AI agents stop being demos and start being craft tools?",
    body:
      "Most agent products feel like party tricks. I'm interested in the boundary where they become reliable enough to live inside a working creative pipeline — and what that does to authorship along the way.",
  },
  {
    title: "Media tools as instruments, not appliances.",
    body:
      "Cameras, DAWs, and even text editors reward mastery. A lot of AI-creative software currently rewards prompting tricks instead. I want to make tools that are deep enough to grow into.",
  },
  {
    title: "The continuum from toy to tool.",
    body:
      "Some of the best products start as toys. I keep a running list of things that feel playful but suspiciously useful — and I try to figure out which side they end up on.",
  },
];

// Off the clock — a few humanizing facts.
export const elsewhere: { label: string; value: string }[] = [
  { label: "Reading", value: "Bits of cognitive science, anything Robin Sloan writes." },
  { label: "Listening", value: "A lot of ambient, occasional 90s shoegaze relapses." },
  { label: "Shooting", value: "35mm film when I have the patience, iPhone when I don't." },
  { label: "If not building", value: "Probably walking, probably overthinking a coffee order." },
];

// Grouped toolkit — shown alongside the rest of the About content on the home page.
export const toolkit: { group: string; items: string[] }[] = [
  {
    group: "Design",
    items: ["Product Design", "Figma", "Design Systems", "UX Research", "Brand & Identity"],
  },
  {
    group: "Code",
    items: ["TypeScript", "React / Next.js", "Three.js / R3F", "GSAP", "Tailwind", "Python"],
  },
  {
    group: "Media",
    items: ["Photography", "Editorial Layout", "Storytelling", "Generative AI", "Video & Cloud Media"],
  },
];
