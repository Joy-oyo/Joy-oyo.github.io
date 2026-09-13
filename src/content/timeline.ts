import { site } from "./site";

export const workExperience = [
  {
    org: "Tencent",
    role: "AI Solution Architect",
    period: "2024 — Now",
    location: "Palo Alto",
    note: "",
    current: true,
  },
  {
    org: "Consulting Practice",
    role: "Co-founder",
    period: "2022 — 2024",
    location: "Palo Alto",
    note: "Professional consulting for the general public",
    current: false,
  },
];

// Unified timeline — work + education, most recent first.
// kind: "work" | "edu" lets us style differently if needed.
export type TimelineItem = {
  kind: "work" | "edu";
  period?: string;
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
    role: "AI Solution Architect",
    org: "Tencent",
    location: "Palo Alto, CA",
    note: "AI-powered media products for North America clients",
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
    org: "Consulting Practice",
    location: "Remote",
    note: "Professional consulting — making expert knowledge accessible to the general public",
    highlights: [
      "Co-founded a consulting practice that translates professional expertise into actionable guidance for everyday clients.",
      "Led service design, client onboarding, and end-to-end delivery across multiple engagement types.",
      "Designed the brand, marketing presence, and core client experience from the ground up.",
    ],
  },
  {
    kind: "edu",
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
    subtitle: "AI Solution Architect",
    location: "Palo Alto, CA",
    note: "AI-powered media products for North America clients.",
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
    title: "Consulting Practice",
    subtitle: "Co-founder",
    location: "Remote",
    note: "Professional consulting — making expert knowledge accessible to the general public.",
    highlights: [
      "Co-founded a consulting practice that translates professional expertise into actionable guidance for everyday clients.",
      "Led service design, client onboarding, and end-to-end delivery across multiple engagement types.",
      "Designed the brand, marketing presence, and core client experience from the ground up.",
    ],
  },
  {
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
    title: "Paid Search Marketing Analytics Simulation, Wake Forest University",
    location: "Winston-Salem, NC",
    note: "DSP-based paid search simulation — bidding, ROAS, A/B tests across regions.",
    highlights: [
      "Managed end-to-end paid search campaigns within a DSP — keyword research, bidding, budget allocation, performance optimization.",
      "Monitored ROAS, CPC, CTR, and conversion rates to improve marketing effectiveness and cost efficiency.",
      "Conducted A/B testing, SWOT analyses, and investment evaluations across regional markets.",
    ],
  },
  {
    title: "Find the Gate",
    subtitle: "Independent — interactive game",
    note: "A small atmospheric game exploring place, memory, and the act of finding.",
    links: [
      { label: "Play on Itch.io", href: "https://joy-oyo.itch.io/find-the-gate" },
      { label: "DM me for code", href: `mailto:${site.email}` },
    ],
  },
];

// Education — separate horizontal section beneath the two tracks.
// Most recent first.
export type EducationItem = {
  period?: string;
  degree: string;
  school: string;
  location?: string;
  note?: string;
  current?: boolean;
};

export const education: EducationItem[] = [
  {
    degree: "M.A. in Digital Studies",
    school: "University of Chicago",
    location: "Chicago, IL",
    note: "Concentration: Artificial Intelligence & Language.",
  },
  {
    degree: "B.S. in Business Management",
    school: "Wake Forest University",
    location: "Winston-Salem, NC",
    note: "Double major in Media Studies & Communication.",
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
