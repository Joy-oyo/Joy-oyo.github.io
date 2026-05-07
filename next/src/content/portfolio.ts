import type { IconKey } from "@/lib/icons";

export const site = {
  name: "Joy Chen",
  title: "Joy Chen — Interactive Portfolio",
  description:
    "Joy Chen's interactive portfolio showcasing games, business projects, photography, and technical work.",
  initials: "JC",
  year: "2026",
  hero: {
    eyebrow: "Portfolio · 2026",
    headlinePrefix: "Hi, I'm",
    headlineAccent: "Joy Chen",
    headlineSuffix: "I design playful, thoughtful experiences.",
    lede: "Product · Creative coding · Photography — a small universe of work, all in one place.",
    primaryCta: { label: "Explore work", href: "#work" },
    secondaryCta: { label: "Get in touch", href: "#newsletter" },
  },
};

export const nav: { label: string; href: string; external?: boolean }[] = [
  { label: "Work", href: "#work" },
  { label: "Photography", href: "#photography" },
  { label: "Games", href: "#games" },
  { label: "Contact", href: "#newsletter" },
];

export const stats: { label: string; target: number; suffix?: string }[] = [
  { label: "Projects", target: 12 },
  { label: "Interactive Demos", target: 8 },
  { label: "Awards", target: 5 },
  { label: "Years", target: 3 },
];

export const skills: string[] = [
  "Product Design",
  "Creative Coding",
  "Interactive Games",
  "Photography",
  "UX Research",
  "Data Visualization",
  "Prototyping",
  "Storytelling",
];

export type Module = {
  id: string;
  title: string;
  href?: string;
  icon: IconKey;
  empty?: boolean;
  angle: number;
  radius: number;
};

export const modules: Module[] = [
  { id: "business", title: "Business Portfolio", href: "https://chenj219.wixsite.com/portfolio-joy", icon: "briefcase", angle: -150, radius: 1 },
  { id: "games", title: "Interactive Games", href: "https://joy-oyo.itch.io/find-the-gate", icon: "gamepad", angle: -90, radius: 1 },
  { id: "photography", title: "Photography", href: "https://chenj219.wixsite.com/portfolio-joy/art", icon: "camera", angle: -30, radius: 1 },
  { id: "creative", title: "Creative Hub", icon: "palette", empty: true, angle: 60, radius: 1 },
  { id: "future", title: "Future Projects", icon: "rocket", empty: true, angle: 150, radius: 1 },
];

export type Project = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
  href: string;
  cta: { label: string; icon: IconKey };
  accent: "beige" | "navy" | "klein";
  icon: IconKey;
  reverse?: boolean;
};

export const projects: Project[] = [
  {
    id: "photography",
    index: "01",
    eyebrow: "01 · Photography",
    title: "Photography Work",
    subtitle: "Selected shoots, edits, and visual studies.",
    body: "Projects exploring light, composition, and texture. Clean layouts with large imagery and subtle motion draw attention to detail.",
    href: "https://chenj219.wixsite.com/portfolio-joy/art",
    cta: { label: "View Gallery", icon: "image" },
    accent: "beige",
    icon: "camera",
    reverse: true,
  },
  {
    id: "business",
    index: "02",
    eyebrow: "02 · Business",
    title: "Business Portfolio",
    subtitle: "Strategy, product, and market work with a clean, modern touch.",
    body: "Explore case studies, growth experiments, and product thinking. Large visuals and concise narratives highlight outcomes and the underlying frameworks.",
    href: "https://chenj219.wixsite.com/portfolio-joy",
    cta: { label: "View Portfolio", icon: "arrow-right" },
    accent: "klein",
    icon: "briefcase",
  },
  {
    id: "games",
    index: "03",
    eyebrow: "03 · Games",
    title: "Interactive Games",
    subtitle: "Playable prototypes, mechanics, and engaging interactions.",
    body: "Discover small games and interactive experiments focused on player flow and clarity. Built with accessible tech and polished UI patterns.",
    href: "https://joy-oyo.itch.io/find-the-gate",
    cta: { label: "Play on Itch.io", icon: "play" },
    accent: "navy",
    icon: "gamepad",
    reverse: true,
  },
];

export const footer = {
  copyright: "All rights reserved to Joy.",
  links: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact", href: "#newsletter" },
  ],
};
