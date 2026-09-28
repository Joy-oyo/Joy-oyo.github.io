"use client";

import { createContext, useContext, useEffect, useId, useState } from "react";

/**
 * TaijiHome — makes the whole home page a yin-yang (taiji) surface.
 *
 * A fixed, viewport-sized split sits behind everything: left half yang
 * (near-black — doing / industry), right half yin (off-white — knowing /
 * research), divided by a gentle taiji S-curve. Sections lay their
 * columns over the matching half with `data-polarity`, and clicking any
 * empty stretch of the page swaps the halves.
 *
 * "Empty" excludes text, media, controls, links, and surfaced cards —
 * see the click handler below. The swap can also arrive as a
 * `taiji:toggle` window event, and the current state is mirrored back
 * both on `html[data-taiji]` (for CSS) and as a `taiji:flipped` event
 * (for any chrome that wants to mirror it).
 *
 * Below md the split stays hidden — full-width blocks would straddle the
 * seam — so each column falls back to its own surfaced card (`.taiji-col`)
 * and each panel to its own fill, keeping the same polarity everywhere.
 */
type Polarity = "yang" | "yin";

const TaijiContext = createContext<{
  flipped: boolean;
  toggle: () => void;
  /** Polarity of the page's left half. */
  left: Polarity;
  /** Polarity of the page's right half. */
  right: Polarity;
} | null>(null);

export function useTaiji() {
  return useContext(TaijiContext);
}

export default function TaijiHome({ children }: { children: React.ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  const toggle = () => setFlipped((f) => !f);
  const left: Polarity = flipped ? "yin" : "yang";
  const right: Polarity = flipped ? "yang" : "yin";
  const curveId = `taiji-page-curve-${useId().replace(/:/g, "")}`;

  // External chrome can still ask for a flip by dispatching `taiji:toggle`.
  useEffect(() => {
    const onToggle = () => setFlipped((f) => !f);
    window.addEventListener("taiji:toggle", onToggle);
    return () => window.removeEventListener("taiji:toggle", onToggle);
  }, []);

  // Click-to-swap: tapping any empty stretch of the page trades the halves.
  // "Empty" excludes text, media, controls/links, the site chrome, and
  // surfaced (.glass*) cards — anything the user likely meant to read or
  // operate. Text selections and already-handled clicks (e.g. drags)
  // never trigger a swap.
  useEffect(() => {
    const IGNORE =
      "a, button, input, textarea, select, summary, label, header, nav, " +
      "#mobile-menu, [role='button'], [role='link'], [data-no-flip], " +
      "p, h1, h2, h3, h4, h5, h6, span, li, dd, dt, blockquote, figcaption, " +
      "td, th, code, pre, time, img, svg, video, canvas, " +
      ".glass, .glass-chip, .glass-card";
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (!(e.target instanceof Element)) return;
      if (e.target.closest(IGNORE)) return;
      if (window.getSelection()?.toString()) return;
      setFlipped((f) => !f);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Let site-wide chrome (the nav bar) mirror the current assignment:
  // CSS hooks on `html[data-taiji]`, the header's controlled glyph
  // listens for the broadcast so the two never drift apart.
  useEffect(() => {
    document.documentElement.dataset.taiji = flipped ? "flipped" : "base";
    window.dispatchEvent(new CustomEvent("taiji:flipped", { detail: flipped }));
    return () => {
      delete document.documentElement.dataset.taiji;
    };
  }, [flipped]);

  return (
    <TaijiContext.Provider value={{ flipped, toggle, left, right }}>
      <div aria-hidden="true" className="taiji-page">
        <svg className="absolute h-0 w-0" focusable="false">
          <defs>
            <clipPath id={curveId} clipPathUnits="objectBoundingBox">
              {/* Gentle S: amplitude 2% of viewport width, so column padding
                  always keeps content clear of the seam. */}
              <path d="M 0 0 H .5 C .52 .12 .52 .38 .5 .5 C .48 .62 .48 .88 .5 1 H 0 Z" />
            </clipPath>
          </defs>
        </svg>
        <div data-polarity={right} className="taiji-page-half" />
        <div
          data-polarity={left}
          className="taiji-page-half"
          style={{ clipPath: `url(#${curveId})` }}
        />
      </div>
      {children}
    </TaijiContext.Provider>
  );
}
