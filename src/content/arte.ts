/**
 * Arte — every creative collection on /photography lives here, one entry per
 * medium. Adding work means filling a collection's `items`; an empty list
 * renders as "In progress", so a new medium can be announced before it ships.
 */

export type Photo = {
  src: string;
  alt: string;
  caption: string;
};

/** A performance piece. `href` points at the hosted video (opens in a new tab). */
export type Choreo = {
  title: string;
  year: string;
  poster: string;
  alt: string;
  href?: string;
  credit?: string;
};

export type Piece = {
  title: string;
  year: string;
  form: string; // "Poem", "Prose", "Script"…
  excerpt: string;
  href?: string;
};

type Base = {
  id: string;
  title: string;
};

export type Collection =
  | (Base & { kind: "photo"; items: Photo[] })
  | (Base & { kind: "choreo"; items: Choreo[] })
  | (Base & { kind: "text"; items: Piece[] });

export const collections: Collection[] = [
  {
    id: "photography",
    title: "Photography",
    kind: "photo",
    items: [
      { src: "/images/tree1.jpg", alt: "Tree study 01", caption: "Morning — 2023" },
      { src: "/images/tree2.jpg", alt: "Tree study 02", caption: "Midday — 2023" },
      { src: "/images/tree3.jpg", alt: "Tree study 03", caption: "Afternoon — 2023" },
      { src: "/images/tree4.jpg", alt: "Tree study 04", caption: "Dusk — 2023" },
    ],
  },
  {
    id: "choreography",
    title: "Choreography",
    kind: "choreo",
    items: [],
  },
  {
    id: "writing",
    title: "Writing",
    kind: "text",
    items: [],
  },
];
