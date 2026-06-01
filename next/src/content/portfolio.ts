export const site = {
  name: "Joy Chen",
  initials: "JC",
  title: "Joy Chen — Portfolio",
  tagline: "Product · Creative Coding · Photography",
  bio:
    "I design playful, thoughtful experiences at the edge of product, code, and image. A small universe of work, all in one place.",
  email: "joychen0709@gmail.com",
  location: "Palo Alto",
  currently:
    "Working on AI-powered products at Tencent and Veeup. Interested in how language, media, and tools shape the way we work.",
  socials: [
    { label: "GitHub", href: "https://github.com/Joy-oyo" },
    { label: "Itch.io", href: "https://joy-oyo.itch.io" },
    { label: "Wix Portfolio", href: "https://chenj219.wixsite.com/portfolio-joy" },
  ],
};

export const workExperience = [
  {
    org: "Tencent",
    role: "Cloud Media Solution Architect",
    period: "2024 — Now",
    location: "Palo Alto",
    note: "",
    current: true,
  },
  {
    org: "Veeup",
    role: "Co-founder",
    period: "2022 — 2024",
    location: "Palo Alto",
    note: "Resume automation application platform",
    current: false,
  },
];

// Unified timeline — work + education, most recent first.
// kind: "work" | "edu" lets us style differently if needed.
export type TimelineItem = {
  kind: "work" | "edu";
  period: string;
  role: string;
  org: string;
  location?: string;
  note?: string;
  /** Short bullet points — achievements, scope, themes. */
  highlights?: string[];
  /** Optional external link (company, school, project). */
  href?: string;
  /** Mark the current / most recent item for emphasis. */
  current?: boolean;
};

export const timeline: TimelineItem[] = [
  {
    kind: "work",
    period: "2024 — Now",
    role: "Cloud Media Solution Architect",
    org: "Tencent",
    location: "Palo Alto, CA",
    note: "AI & media infrastructure for North America clients",
    current: true,
    highlights: [
      "Architect end-to-end cloud media solutions across streaming, transcoding, and real-time AI inference for enterprise clients.",
      "Translate product needs into technical proposals — bridging engineering, sales, and creative teams.",
      "Prototype with LLM + media pipelines: caption generation, semantic search over video, and creative tooling.",
    ],
  },
  {
    kind: "work",
    period: "2022 — 2024",
    role: "Co-founder",
    org: "Veeup",
    location: "Remote",
    note: "Resume automation & job-application platform",
    highlights: [
      "Co-founded an early-stage platform that automates resume tailoring and job applications using LLMs.",
      "Led product design, prototype-to-MVP build, and the first cohort of beta users.",
      "Designed the brand, marketing site, and core onboarding flow end-to-end.",
    ],
  },
  {
    kind: "edu",
    period: "2023 — 2024",
    role: "M.A. in Digital Studies",
    org: "University of Chicago",
    location: "Chicago, IL",
    note: "Concentration: Artificial Intelligence & Language",
    highlights: [
      "Research at the intersection of computational linguistics, generative AI, and media theory.",
      "Coursework spanning NLP, critical theory, and computational creativity.",
    ],
  },
  {
    kind: "edu",
    period: "2019 — 2023",
    role: "B.S. in Business Management",
    org: "Wake Forest University",
    location: "Winston-Salem, NC",
    note: "Double major in Media Studies & Communication",
    highlights: [
      "Cross-disciplinary training across business strategy, media studies, and design thinking.",
      "Independent projects in photography, editorial design, and student-led media.",
    ],
  },
];

// Two parallel tracks shown side-by-side on the home page.
// Industry = product / engineering / company work.
// Research = academic, lab, independent inquiry.
export type TrackLink = {
  label: string;
  href: string;
};

export type TrackItem = {
  /**
   * Date range. Optional — only shown when we actually know a date.
   * Prefer specific months (e.g. "Aug 2023 – Nov 2023") over bare years.
   */
  period?: string;
  /**
   * Primary headline for the entry — e.g. "HRI Lab, University of Chicago"
   * or "Cloud Media Solution Architect". This is what's set big.
   */
  title: string;
  /** Optional secondary line (role at a company, or project subtitle). */
  subtitle?: string;
  location?: string;
  note?: string;
  /** Detailed bullets — shown beneath the note. */
  highlights?: string[];
  /** External references: talks, papers, repos, etc. */
  links?: TrackLink[];
  current?: boolean;
};

export const industryTrack: TrackItem[] = [
  {
    title: "Tencent",
    subtitle: "Cloud Media Solution Architect",
    location: "Palo Alto, CA",
    note: "AI & media infrastructure for North America clients.",
    current: true,
    highlights: [
      "Architect end-to-end cloud media solutions across streaming, transcoding, and real-time AI inference for enterprise clients.",
      "Translate product needs into technical proposals — bridging engineering, sales, and creative teams.",
      "Prototype LLM + media pipelines: caption generation, semantic video search, and creative tooling.",
    ],
    links: [
      {
        label: "GDC 2026 · Boosting Game Retention with Voice, AI & Acceleration",
        href: "https://gdcvault.com/play/1036040/Boosting-Game-Retention-with-Voice",
      },
      {
        label: "GDC 2025 · Conversational AI Gaming Solution",
        href: "https://gdcvault.com/play/1035448/Tencent-Games-Developer-Summit-Conversational",
      },
    ],
  },
  {
    period: "Aug 2023 – Nov 2023",
    title: "FinTech4Good",
    subtitle: "Market Research Fellow",
    location: "Chicago, IL",
    note: "AI adoption across finance & healthcare — research and executive briefings.",
    highlights: [
      "Researched AI adoption across financial services and healthcare — LLM-powered decision intelligence, risk automation, regulatory compliance.",
      "Analyzed industry trends, competitive landscapes, and investment opportunities; produced executive reports informing partnership and innovation initiatives.",
      "Synthesized qualitative + quantitative findings into dashboards and presentations for senior stakeholders.",
    ],
  },
  {
    period: "Jun 2023 – Aug 2023",
    title: "ByteDance",
    subtitle: "AI Content Strategy & UX Analyst (Data Science)",
    location: "Beijing, China",
    note: "Recommendation-system performance, content quality, and large-scale UX analytics.",
    highlights: [
      "Evaluated AI model performance and content recommendation workflows — improved technical efficiency, data quality, and user outcomes.",
      "Built performance metrics and analytical frameworks for data management and content discovery at large scale.",
      "Created interactive dashboards translating insights into actionable cross-functional recommendations.",
    ],
  },
  {
    title: "Veeup",
    subtitle: "Co-founder",
    location: "Remote",
    note: "Resume automation & job-application platform powered by LLMs.",
    highlights: [
      "Co-founded an early-stage platform that automates resume tailoring and job applications.",
      "Led product design, prototype-to-MVP build, and the first cohort of beta users.",
      "Designed the brand, marketing site, and core onboarding flow end-to-end.",
    ],
  },
  {
    title: "UrBanests",
    subtitle: "Marketing Analyst",
    note: "Performance marketing & acquisition analytics — Google Ads, ROAS, channel ROI.",
    highlights: [
      "Designed and executed performance campaigns across acquisition channels — increased property exposure and lead conversion.",
      "Applied auction-based bidding within Google Ads to optimize budget, keywords, and ROI.",
      "Built reporting frameworks and dashboards tracking acquisition, engagement, and conversion metrics.",
    ],
  },
];

export const researchTrack: TrackItem[] = [
  {
    period: "Oct 2023 – Apr 2024",
    title: "HRI Lab, University of Chicago",
    location: "Chicago, IL",
    note: "Rapport, social engagement, and robot-facilitated conversation studies.",
    highlights: [
      "Designed and ran HRI studies on rapport-building, social engagement, and perceptions of robot-facilitated conversations.",
      "Performed experimental design reviews and bias analyses, improving study reliability and data integrity.",
      "Built Python pipelines for data processing + visualization; applied p-value and one-way ANOVA across study conditions.",
      "Analyzed participant attitudes and behaviors to generate insights for trust, engagement, and human-centered AI design.",
    ],
  },
  {
    period: "Oct 2023 – Apr 2024",
    title: "Cannon Lab, University of Chicago",
    location: "Chicago, IL",
    note: "Evidence-based K–12 CS education with Scratch Encore.",
    highlights: [
      "Investigated evidence-based approaches for improving K–12 computer science education through weekly literature reviews.",
      "Designed educational modules using Scratch Encore to assess learning outcomes and computational thinking development.",
      "Evaluated student comprehension and analyzed learning performance to inform curriculum and instruction.",
    ],
  },
  {
    period: "Jan 2024 – May 2024",
    title: "Web Phishing Machine Learning Detection, University of Chicago",
    location: "Chicago, IL",
    note: "End-to-end ML benchmark — MLP / ANN / CNN / LSTM over 10,000+ URLs.",
    highlights: [
      "Built an end-to-end ML pipeline for phishing detection: data cleaning, EDA, feature engineering, dimensionality reduction across 10,000+ URLs.",
      "Trained and compared MLP, ANN, CNN, and LSTM architectures to identify the most effective classification approach.",
      "Assessed accuracy, precision, recall, and generalization for real-world cybersecurity deployment.",
    ],
  },
  {
    period: "Jan 2023 – May 2023",
    title: "Paid Search Marketing Analytics Simulation, Wake Forest University",
    location: "Winston-Salem, NC",
    note: "DSP-based paid search simulation — bidding, ROAS, A/B tests across regions.",
    highlights: [
      "Managed end-to-end paid search campaigns within a DSP — keyword research, bidding, budget allocation, performance optimization.",
      "Monitored ROAS, CPC, CTR, and conversion rates to improve marketing effectiveness and cost efficiency.",
      "Conducted A/B testing, SWOT analyses, and investment evaluations across regional markets.",
    ],
  },
];

// Education — separate horizontal section beneath the two tracks.
// Most recent first.
export type EducationItem = {
  period: string;
  degree: string;
  school: string;
  location?: string;
  note?: string;
  current?: boolean;
};

export const education: EducationItem[] = [
  {
    period: "2023 — 2024",
    degree: "M.A. in Digital Studies",
    school: "University of Chicago",
    location: "Chicago, IL",
    note: "Concentration: Artificial Intelligence & Language.",
  },
  {
    period: "2019 — 2023",
    degree: "B.S. in Business Management",
    school: "Wake Forest University",
    location: "Winston-Salem, NC",
    note: "Double major in Media Studies & Communication.",
  },
];

export type AlbumId = "about" | "photography" | "projects" | "writing" | "contact";

export type Album = {
  id: AlbumId;
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string; // tailwind gradient tokens
  cover?: string;
};

export const albums: Album[] = [
  {
    id: "about",
    index: "01",
    eyebrow: "Who",
    title: "About / Resume",
    subtitle: "Background, experience, the stuff that shaped me.",
    description:
      "A timeline of work and study, tools I reach for, and the little principles that guide my craft.",
    href: "/about",
    accent: "from-[#1a1a2e] to-[#002FA7]",
  },
  {
    id: "photography",
    index: "02",
    eyebrow: "See",
    title: "Photography",
    subtitle: "Light, texture, and quiet moments.",
    description:
      "A gallery of shoots and visual studies — film grain, cool greens, the occasional tree.",
    href: "/photography",
    accent: "from-[#2b3a1e] to-[#6b8e4e]",
    cover: "/images/tree1.jpg",
  },
  {
    id: "projects",
    index: "03",
    eyebrow: "Build",
    title: "Selected Work",
    subtitle: "Products, prototypes, papers, and playful things.",
    description:
      "Lives on the About page now — projects ranked by what mattered, plus conference talks.",
    href: "/about#selected-work",
    accent: "from-[#2a1a3e] to-[#6a3ea3]",
  },
  {
    id: "writing",
    index: "04",
    eyebrow: "Think",
    title: "Blog",
    subtitle: "Notes on design, code, and curious things.",
    description:
      "Short essays and field notes. Updated whenever something feels worth saying.",
    href: "/writing",
    accent: "from-[#3a2a1a] to-[#a0764a]",
  },
  {
    id: "contact",
    index: "05",
    eyebrow: "Say hi",
    title: "Contact",
    subtitle: "Let's make something together.",
    description:
      "Drop a line, subscribe for updates, or find me across the usual places.",
    href: "/contact",
    accent: "from-[#1e1e2a] to-[#6a6a8a]",
  },
];

export const experiences = [
  {
    period: "2024 — Now",
    role: "Creative Technologist",
    org: "Independent",
    body: "Building interactive portfolios, games, and visual studies. Mixing product sensibilities with creative code.",
  },
  {
    period: "2022 — 2024",
    role: "Product Designer",
    org: "Various",
    body: "End-to-end product design for early-stage teams — research, prototyping, systems.",
  },
  {
    period: "2020 — 2022",
    role: "Photographer & Designer",
    org: "Freelance",
    body: "Editorial shoots, brand identity, and visual direction for small clients and passion projects.",
  },
];

export const skills = [
  "Product Design",
  "Creative Coding",
  "Three.js / R3F",
  "React / Next.js",
  "TypeScript",
  "Figma",
  "Photography",
  "GSAP",
  "Storytelling",
  "UX Research",
];

// Grouped toolkit — used on the About page for a more editorial layout.
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

export const projects = [
  {
    id: "find-the-gate",
    title: "Find the Gate",
    year: "2024",
    tag: "Interactive Game",
    body: "A small atmospheric game exploring place, memory, and the act of finding. Playable on Itch.io.",
    href: "https://joy-oyo.itch.io/find-the-gate",
    cover: "/images/tree2.jpg",
  },
  {
    id: "business-portfolio",
    title: "Business Portfolio",
    year: "2023",
    tag: "Case Studies",
    body: "Selected strategy, product, and market work presented with a clean editorial layout.",
    href: "https://chenj219.wixsite.com/portfolio-joy",
    cover: "/images/tree3.jpg",
  },
  {
    id: "photo-series",
    title: "Quiet Forest",
    year: "2023",
    tag: "Photography",
    body: "A short series on light filtering through leaves. Exploring mood, restraint, and green.",
    href: "/photography",
    cover: "/images/tree4.jpg",
  },
];

// ---------------------------------------------------------------------------
// Selected Work — shown on /about. Manually ordered by importance (not date).
// Each item is a specific project, paper, product, or shipped artifact.
// Featured items render larger; the rest fall into a tighter grid.
// ---------------------------------------------------------------------------
export type SelectedWorkItem = {
  id: string;
  title: string;
  /** Short context line — e.g. "Tencent · 2024–Now" or "University of Chicago · 2024". */
  context: string;
  /** One-paragraph summary of what it is + why it matters. */
  body: string;
  /** What kind of artifact this is — Project, Paper, Product, Talk, etc. */
  tag: string;
  /** Optional external/internal href. Omit if there's nothing to link to. */
  href?: string;
  /** Featured items get the larger card treatment. */
  featured?: boolean;
};

export const selectedWork: SelectedWorkItem[] = [
  {
    id: "tencent-cloud-media",
    title: "Cloud Media & AI Solutions at Tencent",
    context: "Tencent · 2024 — Now",
    tag: "Product · Architecture",
    body:
      "End-to-end cloud media solutions for North America clients — streaming, transcoding, and real-time AI inference. Prototyping LLM + media pipelines for caption generation, semantic video search, and creative tooling.",
    featured: true,
  },
  {
    id: "veeup",
    title: "Veeup — LLM-powered job application platform",
    context: "Co-founder · 2022 — 2024",
    tag: "Product · 0→1",
    body:
      "Co-founded an early-stage platform that automates resume tailoring and job applications. Led product design, prototype-to-MVP build, the first cohort of beta users, and the brand + marketing site end-to-end.",
    featured: true,
  },
  {
    id: "hri-rapport",
    title: "Rapport, social engagement, and robot-facilitated conversation",
    subtitle: "Research Assistant",
    context: "HRI Lab, University of Chicago · 2023 – 2024",
    tag: "Research",
    body:
      "Designed and ran human-robot interaction studies on rapport-building and perceptions of robot-facilitated conversation. Built Python pipelines for data processing and visualization; ran ANOVA across study conditions.",
  },
  {
    id: "phishing-ml",
    title: "Web Phishing Detection — MLP / ANN / CNN / LSTM benchmark",
    context: "University of Chicago · Jan – May 2024",
    tag: "ML · Coursework",
    body:
      "End-to-end ML pipeline for phishing URL classification over 10,000+ samples — data cleaning, EDA, feature engineering, dimensionality reduction. Trained and compared MLP, ANN, CNN, and LSTM to find the most effective architecture for real-world deployment.",
  },
  {
    id: "cannon-k12-cs",
    title: "K–12 CS education with Scratch Encore",
    context: "Cannon Lab, University of Chicago · 2023 – 2024",
    tag: "Research",
    body:
      "Investigated evidence-based approaches to K–12 computer science education. Designed Scratch Encore modules to assess learning outcomes and computational thinking, and evaluated student comprehension to inform curriculum design.",
  },
  {
    id: "find-the-gate",
    title: "Find the Gate",
    context: "Interactive game · 2024",
    tag: "Creative Code",
    body:
      "A small atmospheric game exploring place, memory, and the act of finding. Playable on Itch.io.",
    href: "https://joy-oyo.itch.io/find-the-gate",
  },
  {
    id: "business-portfolio",
    title: "Business & Strategy Portfolio",
    context: "Selected case studies · 2023",
    tag: "Case Studies",
    body:
      "Selected strategy, product, and market work — including marketing analytics simulations, paid search optimization, and competitive analyses — presented with a clean editorial layout.",
    href: "https://chenj219.wixsite.com/portfolio-joy",
  },
];

// ---------------------------------------------------------------------------
// Speaking & Talks — conference appearances, panels, public sessions.
// Ordered most-recent first.
// ---------------------------------------------------------------------------
export type TalkItem = {
  id: string;
  title: string;
  venue: string;
  year: string;
  /** Optional location for in-person talks. */
  location?: string;
  /** Short framing of what the talk was about. */
  body?: string;
  href?: string;
};

export const talks: TalkItem[] = [
  {
    id: "gdc-2026-voice-ai",
    title: "Boosting Game Retention with Voice, AI & Acceleration",
    venue: "Game Developers Conference (GDC) 2026",
    year: "2026",
    location: "San Francisco, CA",
    body:
      "How conversational voice + AI infrastructure can be deployed to lift retention and engagement in live games.",
    href: "https://gdcvault.com/play/1036040/Boosting-Game-Retention-with-Voice",
  },
  {
    id: "gdc-2025-conversational-ai",
    title: "Tencent Games Developer Summit · Conversational AI Gaming Solution",
    venue: "Game Developers Conference (GDC) 2025",
    year: "2025",
    location: "San Francisco, CA",
    body:
      "A walk-through of Tencent's conversational AI stack for games — architecture, latency budget, and developer integration.",
    href: "https://gdcvault.com/play/1035448/Tencent-Games-Developer-Summit-Conversational",
  },
];

export const photos = [
  { src: "/images/tree1.jpg", alt: "Tree study 01", caption: "Morning — 2023" },
  { src: "/images/tree2.jpg", alt: "Tree study 02", caption: "Midday — 2023" },
  { src: "/images/tree3.jpg", alt: "Tree study 03", caption: "Afternoon — 2023" },
  { src: "/images/tree4.jpg", alt: "Tree study 04", caption: "Dusk — 2023" },
];

export const writings = [
  {
    slug: "on-designing-playful-tools",
    title: "On designing playful tools",
    date: "2024-11-02",
    excerpt:
      "Why the best tools feel like toys — and how that changes how we design them.",
  },
  {
    slug: "three-js-and-restraint",
    title: "Three.js and restraint",
    date: "2024-09-18",
    excerpt:
      "You don't need every particle in the world. Some notes on quieter 3D.",
  },
  {
    slug: "the-tree-series",
    title: "The tree series",
    date: "2024-07-01",
    excerpt:
      "A short note behind four photographs of the same tree across a day.",
  },
];
