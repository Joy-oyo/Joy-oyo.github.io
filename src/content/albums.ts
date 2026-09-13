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
      "Lives further down this page — the longer story, what I'm thinking about, and the tools I reach for.",
    href: "/#about",
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
      "Lives in the Trajectory section below — Industry and Research, ranked by what mattered.",
    href: "/#trajectory",
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
