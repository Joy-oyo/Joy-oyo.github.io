export const site = {
  name: "Joy Chen",
  initials: "JC",
  title: "Joy Chen — Portfolio",
  tagline: "Product · Creative Coding · Photography",
  bio:
    "I design playful, thoughtful experiences at the edge of product, code, and image. A small universe of work, all in one place.",
  email: "joychen0709@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/Joy-oyo" },
    { label: "Itch.io", href: "https://joy-oyo.itch.io" },
    { label: "Wix Portfolio", href: "https://chenj219.wixsite.com/portfolio-joy" },
  ],
};

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
    title: "Projects",
    subtitle: "Products, prototypes, and playful things.",
    description:
      "Case studies across product design, creative coding, and interactive games on Itch.io.",
    href: "/projects",
    accent: "from-[#2a1a3e] to-[#6a3ea3]",
  },
  {
    id: "writing",
    index: "04",
    eyebrow: "Think",
    title: "Writing",
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
