"use client";

import { useEffect } from "react";

/**
 * The reading collection is a separately deployed, self-contained static
 * project with its own typography and transitions. The main site's rewrite
 * exposes it below /reading-collection, so this same-origin frame preserves its
 * relative navigation without coupling the document to the Next.js build.
 */
const SRC = "/reading-collection/index.html";

/** Matches the collection's own --paper, so there is no dark flash on paint. */
const PAPER = "#f7f6f2";

export default function ReadingCollectionEmbed() {
  useEffect(() => {
    // The film grain is a fixed, blend-mode overlay on <body> that paints above
    // everything, including this frame. Over the site's dark glass it is a
    // texture; over the collection's paper white it reads as dirt. Drop it
    // while this route is mounted and restore it on the way out.
    document.body.classList.remove("grain");
    return () => {
      document.body.classList.add("grain");
    };
  }, []);

  return (
    <main id="main" className="fixed inset-0 z-0" style={{ background: PAPER }}>
      <iframe
        src={SRC}
        title="Joy's reading collection"
        className="h-full w-full border-0"
      />
    </main>
  );
}
