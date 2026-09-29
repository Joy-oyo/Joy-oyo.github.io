"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import SecretBookshelf, { BookshelfRoom } from "@/components/SecretBookshelf";
import styles from "@/components/SecretBookshelf.module.css";

const SEAM = "M .5 0 C .52 .12 .52 .38 .5 .5 C .48 .62 .48 .88 .5 1";
const PEEK_HALF_WIDTH = 28.5;

function distanceFromSeam(x: number, y: number) {
  if (window.innerWidth < 768) return Infinity;
  const lowerHalf = y > window.innerHeight / 2;
  const localY = (y / window.innerHeight - (lowerHalf ? 0.5 : 0)) * 2;
  let lo = 0;
  let hi = 1;
  // Invert the two cubic segments' y coordinates, then evaluate their x.
  for (let i = 0; i < 12; i++) {
    const t = (lo + hi) / 2;
    const curveY = 3 * (1 - t) ** 2 * t * 0.24 + 3 * (1 - t) * t ** 2 * 0.76 + t ** 3;
    if (curveY < localY) lo = t;
    else hi = t;
  }
  const t = (lo + hi) / 2;
  const seamX = (0.5 + (lowerHalf ? -1 : 1) * 0.06 * t * (1 - t)) * window.innerWidth;
  return Math.abs(x - seamX);
}

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
  const [bookshelfOpen, setBookshelfOpen] = useState(false);
  const [nearSeam, setNearSeam] = useState(false);
  const [openingGap, setOpeningGap] = useState(0);
  const entranceRef = useRef<HTMLButtonElement>(null);
  const peekingRef = useRef(false);
  const skipFocusPeek = useRef(false);
  const activationWasPeeking = useRef(false);
  const peekOffset = useMotionValue(0);
  const leftOffset = useTransform(peekOffset, (value) => -value);
  const reduceMotion = useReducedMotion();
  const updatePeek = useCallback((value: boolean) => {
    peekingRef.current = value;
    setNearSeam(value);
  }, []);
  /**
   * `fromSeam` — opened by the seam itself, so focus is parked on the seam's
   * entrance button and returns there on close. Openings from elsewhere
   * (the nav seal) leave focus where it is, so it returns to their trigger.
   */
  const openBookshelf = useCallback((fromSeam = true) => {
    setOpeningGap(window.innerWidth >= 768 ? peekOffset.get() : 0);
    if (fromSeam) {
      skipFocusPeek.current = true;
      entranceRef.current?.focus({ preventScroll: true });
      skipFocusPeek.current = true;
    }
    updatePeek(false);
    setBookshelfOpen(true);
  }, [peekOffset, updatePeek]);
  const closeBookshelf = useCallback(() => {
    skipFocusPeek.current = true;
    peekOffset.set(0);
    updatePeek(false);
    setBookshelfOpen(false);
  }, [peekOffset, updatePeek]);
  const toggle = useCallback(() => {
    if (!bookshelfOpen) {
      updatePeek(false);
      setFlipped((f) => !f);
    }
  }, [bookshelfOpen, updatePeek]);
  const left: Polarity = flipped ? "yin" : "yang";
  const right: Polarity = flipped ? "yang" : "yin";
  const curveId = `taiji-page-curve-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const animation = animate(peekOffset, nearSeam && !bookshelfOpen ? PEEK_HALF_WIDTH : 0, {
      duration: reduceMotion ? 0 : 0.45,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => animation.stop();
  }, [nearSeam, bookshelfOpen, peekOffset, reduceMotion]);

  useEffect(() => {
    if (!nearSeam || bookshelfOpen) return;
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "pointer";
    return () => { document.body.style.cursor = previousCursor; };
  }, [nearSeam, bookshelfOpen]);

  useEffect(() => {
    window.addEventListener("taiji:toggle", toggle);
    return () => window.removeEventListener("taiji:toggle", toggle);
  }, [toggle]);

  // Second way in: the yin-yang seal in the nav. On this page it asks with a
  // `bookshelf:open` event; from any other page it lands here on
  // `/#bookshelf`, and the hash is consumed so a refresh doesn't reopen it.
  useEffect(() => {
    const onOpen = () => openBookshelf(false);
    window.addEventListener("bookshelf:open", onOpen);
    if (window.location.hash === "#bookshelf") {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      openBookshelf(false);
    }
    return () => window.removeEventListener("bookshelf:open", onOpen);
  }, [openBookshelf]);

  // Click-to-swap: tapping any empty stretch of the page trades the halves.
  // "Empty" excludes text, media, controls/links, the site chrome, and
  // surfaced (.glass*) cards — anything the user likely meant to read or
  // operate. Text selections and already-handled clicks (e.g. drags)
  // never trigger a swap.
  useEffect(() => {
    if (bookshelfOpen) return;
    const IGNORE =
      "a, button, input, textarea, select, summary, label, header, nav, dialog, " +
      "#mobile-menu, [role='button'], [role='link'], [contenteditable], [data-no-flip], " +
      "p, h1, h2, h3, h4, h5, h6, span, li, dd, dt, blockquote, figcaption, " +
      "td, th, code, pre, time, img, svg, video, canvas, " +
      ".glass, .glass-chip, .glass-card, .taiji-seed";
    let pointerStart: { x: number; y: number; gap: number; peeking: boolean } | null = null;
    const onPointerDown = (e: PointerEvent) => {
      pointerStart = e.isPrimary && e.button === 0
        ? { x: e.clientX, y: e.clientY, gap: peekOffset.get(), peeking: peekingRef.current }
        : null;
      if (e.pointerType !== "mouse" && !(e.target instanceof Node && entranceRef.current?.contains(e.target)) &&
          distanceFromSeam(e.clientX, e.clientY) > PEEK_HALF_WIDTH + 10) updatePeek(false);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (e.target instanceof Node && entranceRef.current?.contains(e.target)) return;
      // The wider exit threshold keeps the gap steady as its edges move away.
      const threshold = peekingRef.current ? PEEK_HALF_WIDTH + 10 : 14;
      updatePeek(
        e.buttons === 0 && e.target instanceof Element && !e.target.closest(IGNORE) &&
        !window.getSelection()?.toString() && distanceFromSeam(e.clientX, e.clientY) <= threshold
      );
    };
    const resetPointer = () => {
      pointerStart = null;
      updatePeek(false);
    };
    const onPointerOut = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !e.relatedTarget) resetPointer();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") updatePeek(false);
    };
    const onClick = (e: MouseEvent) => {
      const start = pointerStart;
      pointerStart = null;
      if (e.defaultPrevented || e.button !== 0 || e.detail === 0) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      if (!(e.target instanceof Element) || e.target.closest(IGNORE)) return;
      if (window.getSelection()?.toString()) return;
      if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) return;
      const distance = distanceFromSeam(e.clientX, e.clientY);
      if (start.peeking && start.gap > 1 && distance < start.gap) {
        openBookshelf();
      } else if (distance <= PEEK_HALF_WIDTH + 10) {
        updatePeek(true);
      } else {
        updatePeek(false);
        if (!start.peeking) setFlipped((f) => !f);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("pointercancel", resetPointer);
    window.addEventListener("scroll", resetPointer, { passive: true });
    window.addEventListener("resize", resetPointer);
    window.addEventListener("blur", resetPointer);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointercancel", resetPointer);
      window.removeEventListener("scroll", resetPointer);
      window.removeEventListener("resize", resetPointer);
      window.removeEventListener("blur", resetPointer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
    };
  }, [bookshelfOpen, openBookshelf, peekOffset, updatePeek]);

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
      <div aria-hidden="true" className={`taiji-page ${styles.peekSurface}`} data-peeking={nearSeam}>
        <BookshelfRoom preview />
        <svg className="absolute h-0 w-0" focusable="false">
          <defs>
            <clipPath id={curveId} clipPathUnits="objectBoundingBox">
              <path d={`${SEAM} H 0 V 0 Z`} />
            </clipPath>
            <clipPath id={`${curveId}-right`} clipPathUnits="objectBoundingBox">
              <path d={`${SEAM} H 1 V 0 Z`} />
            </clipPath>
          </defs>
        </svg>
        <motion.div
          data-polarity={right}
          data-peek-door="right"
          className={`taiji-page-half ${styles.peekDoor}`}
          style={{ clipPath: `url(#${curveId}-right)`, x: peekOffset }}
        />
        <motion.div
          data-polarity={left}
          data-peek-door="left"
          className={`taiji-page-half ${styles.peekDoor}`}
          style={{ clipPath: `url(#${curveId})`, x: leftOffset }}
        />
      </div>
      {children}
      <button
        ref={entranceRef}
        type="button"
        className={styles.entrance}
        data-peeking={nearSeam}
        aria-label="Open secret bookshelf"
        aria-haspopup="dialog"
        onFocus={(event) => {
          if (skipFocusPeek.current) {
            skipFocusPeek.current = false;
            return;
          }
          if (event.currentTarget.matches(":focus-visible")) updatePeek(true);
        }}
        onBlur={() => updatePeek(false)}
        onPointerDown={() => { activationWasPeeking.current = peekingRef.current; }}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
          if (window.innerWidth < 768 || (event.detail === 0 ? peekingRef.current : activationWasPeeking.current)) openBookshelf();
          else updatePeek(true);
        }}
      >
        <span aria-hidden="true" className={styles.mobileSeam} />
      </button>
      {bookshelfOpen && (
        <SecretBookshelf left={left} right={right} seam={SEAM} initialGap={openingGap} onClose={closeBookshelf} />
      )}
    </TaijiContext.Provider>
  );
}
