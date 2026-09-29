import { readFile } from "node:fs/promises";
import path from "node:path";
import { businessBooks } from "@/content/books";

// Only the reading guides attached to books on the secret shelf are served.
// The old collection index is retired; the shelf replaced it.
const files = new Set(businessBooks.map((book) => book.notes));

// Guides whose sidebar footer only says "return to the collection".
const collectionFooters = new Set([
  "skin-in-the-game-summary.html",
  "good-to-great-summary.html",
  "the-hard-thing-about-hard-things-summary.html",
]);

/**
 * Re-skins the standalone guides to the home page's palette: yin paper,
 * yang ink, Klein-blue accents. The guides share variable names, so the
 * palette swap is a variable override; the few hard-coded colors (accent
 * numbers on the dark selected tab) are overridden by selector.
 */
const THEME = `
:root{--paper:#f4f1ea;--white:#fbfaf6;--ink:#0a0a12;--muted:#5d5d66;--line:#dcd6c8;--soft:#ebe5d8;--red:#002fa7;--red-dark:#00237d;--font:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;color-scheme:light}
::selection{background:#002fa7;color:#fff}
h1,h2,.brand-title{font-family:"Iowan Old Style","Palatino Linotype",Georgia,serif;font-weight:500;letter-spacing:-.02em}
.tab-button[aria-selected="true"] .tab-number,.tab-button[aria-selected="true"] .tab-index,.outcome-role .outcome-label{color:#a9bdff!important}
.collection-link{display:none!important}
`;

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from(files, (file) => ({ file }));
}

export async function GET(_request: Request, { params }: { params: { file: string } }) {
  if (!files.has(params.file)) return new Response("Not found", { status: 404 });

  const html = await readFile(path.join(process.cwd(), "reading-collection", params.file), "utf8");
  const extra = collectionFooters.has(params.file) ? ".sidebar-footer{display:none!important}" : "";
  const style = `<style id="secret-shelf-theme">${THEME}${extra}</style>`;
  const themed = html.includes("</head>") ? html.replace("</head>", `${style}</head>`) : style + html;

  return new Response(themed, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "same-origin",
      // The guides are self-contained: inline styles and scripts, nothing
      // fetched. They may only be framed by this site's own shelf.
      "Content-Security-Policy":
        "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'self'",
    },
  });
}
