/**
 * The secret bookshelf is a revolving case with two faces: business /
 * tool books here, and a rack of idea scrolls on the humanities face
 * (see `scrolls.ts`).
 */
export type ShelfId = "business" | "humanities";

export type BusinessBook = {
  id: string;
  title: string;
  author: string;
  /** Two-digit catalogue number shown under the cover. */
  no: string;
  /** Short kicker printed on the cover. */
  subject: string;
  /** Collection-map grouping. */
  category: string;
  /** One-line gist, shown in the knowledge cosmos. */
  description: string;
  /** Cover cloth color. */
  color: string;
  /** File name of the interactive reading guide in /reading-collection. */
  notes: string;
};

export const businessBooks: BusinessBook[] = [
  {
    id: "skin-in-the-game",
    title: "Skin in the Game",
    author: "Nassim Nicholas Taleb",
    no: "06",
    subject: "Risk & symmetry",
    category: "Leadership, risk & management",
    description:
      "Why advice, power, and decisions become more reliable when the people making them share the consequences.",
    color: "#8a4435",
    notes: "skin-in-the-game-summary.html",
  },
  {
    id: "good-to-great",
    title: "Good to Great",
    author: "Jim Collins",
    no: "05",
    subject: "Performance",
    category: "Leadership, risk & management",
    description:
      "How disciplined people, thought, and action compound into sustained performance through the flywheel effect.",
    color: "#315d54",
    notes: "good-to-great-summary.html",
  },
  {
    id: "no-rules-rules",
    title: "No Rules Rules",
    author: "Reed Hastings & Erin Meyer",
    no: "04",
    subject: "Culture",
    category: "Culture & organizations",
    description:
      "How Netflix sequences talent density, candor, and fewer controls to build freedom with responsibility.",
    color: "#6c3850",
    notes: "no-rules-rules-summary.html",
  },
  {
    id: "the-lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    no: "03",
    subject: "Innovation",
    category: "Product & innovation",
    description: "How to turn uncertainty into evidence through validated learning and rapid experiments.",
    color: "#32556a",
    notes: "the-lean-startup-summary.html",
  },
  {
    id: "the-hard-thing-about-hard-things",
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    no: "02",
    subject: "Leadership",
    category: "Leadership, risk & management",
    description: "How to lead, build, and decide when every available option has a serious cost.",
    color: "#745a32",
    notes: "the-hard-thing-about-hard-things-summary.html",
  },
  {
    id: "influence",
    title: "Influence",
    author: "Robert B. Cialdini",
    no: "01",
    subject: "Psychology",
    category: "Psychology & decision-making",
    description: "Why people say yes—and the seven shortcuts that shape persuasion.",
    color: "#524969",
    notes: "influence-book-summary.html",
  },
];

export const notesHref = (book: BusinessBook) => `/reading-collection/${book.notes}`;
