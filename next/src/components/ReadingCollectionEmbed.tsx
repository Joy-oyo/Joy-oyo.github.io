"use client";

import { useEffect } from "react";

/**
 * The reading collection is a self-contained static document (its own
 * typography, its own transitions, works offline) that lives in
 * /public/reading-collection. It is embedded full-bleed rather than ported into
 * this app's components, so it stays byte-for-byte as authored — and so its
 * internal navigation between the index and the chapter guides keeps working.
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
