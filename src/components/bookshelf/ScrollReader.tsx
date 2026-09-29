"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ideaScrolls, isVerticalText, type IdeaScroll } from "@/content/scrolls";
import { site } from "@/content/site";
import { scrollLook } from "./scrollLook";
import styles from "./ScrollReader.module.css";

const UNROLL = { duration: 1.15, delay: 0.35, ease: [0.65, 0, 0.35, 1] as const };
const ROLL_UP = { duration: 0.6, ease: [0.65, 0, 0.35, 1] as const };

/**
 * An idea scroll taken off the rack: a handscroll that stands up, unties,
 * and unrolls to the right. It reads sideways, section by section —
 * frontispiece, passages, colophon — with the wheel, trackpad, touch, or
 * arrow keys. Chinese passages are set vertically, right to left.
 */
export default function ScrollReader({ scroll, onClose }: { scroll: IdeaScroll; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const paperRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [started, setStarted] = useState(false);
  const { scrollXProgress } = useScroll({ container: paperRef });
  const index = ideaScrolls.findIndex((s) => s.id === scroll.id);
  const no = String(index + 1).padStart(2, "0");
  const look = scrollLook(scroll, index);

  useMotionValueEvent(scrollXProgress, "change", (p) => {
    if (p > 0.02) setStarted(true);
  });

  useEffect(() => {
    paperRef.current?.focus({ preventScroll: true });
  }, []);

  // Only offer the sideways hint and progress when there is more to read.
  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    const measure = () => setOverflowing(el.scrollWidth - el.clientWidth > 4);
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);

  // A handscroll reads sideways: vertical wheel movement unrolls it.
  useEffect(() => {
    const el = paperRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientWidth : 1;
      const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * unit;
      const max = el.scrollWidth - el.clientWidth;
      const next = Math.max(0, Math.min(max, el.scrollLeft + delta));
      if (max <= 0 || next === el.scrollLeft) return;
      e.preventDefault();
      el.scrollLeft = next;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const page = el.clientWidth * 0.8;
    const by: Record<string, number> = { ArrowDown: page, PageDown: page, " ": page, ArrowUp: -page, PageUp: -page };
    if (e.key in by) {
      e.preventDefault();
      el.scrollBy({ left: e.shiftKey && e.key === " " ? -page : by[e.key], behavior: reduceMotion ? "auto" : "smooth" });
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      el.scrollTo({ left: e.key === "Home" ? 0 : el.scrollWidth, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  const still = reduceMotion ? { duration: 0 } : undefined;

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.back} onClick={onClose}>
        <ArrowLeft size={15} aria-hidden="true" />
        Back to the shelf
      </button>

      <motion.section
        className={styles.scroll}
        aria-label={`${scroll.title} — scroll`}
        style={{ "--silk": look.silk, "--knob": look.knob } as CSSProperties}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : 0.5 } }}
        transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className={styles.stave} aria-hidden="true" />
        <div className={styles.track}>
          <motion.div
            className={styles.sheet}
            initial={reduceMotion ? false : { clipPath: "inset(0% 100% 0% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={reduceMotion ? undefined : { clipPath: "inset(0% 100% 0% 0%)", transition: ROLL_UP }}
            transition={still ?? UNROLL}
          >
            <span className={`${styles.edge} ${styles.edgeTop}`} aria-hidden="true" />
            <span className={`${styles.edge} ${styles.edgeBottom}`} aria-hidden="true" />
            <div
              ref={paperRef}
              className={styles.paper}
              tabIndex={0}
              role="region"
              aria-label={`${scroll.title} — passages`}
              onKeyDown={onKeyDown}
            >
              <div className={styles.strip}>
                <header className={styles.frontis}>
                  {scroll.glyph && (
                    <span className={styles.bigGlyph} aria-hidden="true">
                      {scroll.glyph}
                    </span>
                  )}
                  <div className={styles.frontisText}>
                    <p className={styles.kicker}>Humanities · Scroll {no}</p>
                    <h3 className={`display ${styles.title}`}>{scroll.title}</h3>
                    {scroll.line && <p className={styles.line}>{scroll.line}</p>}
                    <p className={styles.count}>
                      {String(scroll.passages.length).padStart(2, "0")} {scroll.passages.length === 1 ? "passage" : "passages"}
                    </p>
                  </div>
                  {scroll.glyph && (
                    <span className={styles.seal} aria-hidden="true">
                      {scroll.glyph}
                    </span>
                  )}
                </header>

                <span className={styles.divider} aria-hidden="true" />

                {scroll.passages.length === 0 && (
                  <p className={styles.blank}>
                    <span className="display">Blank paper, for now.</span>
                    Passages arrive as they are kept.
                  </p>
                )}

                {scroll.passages.map((passage, i) => {
                  const vertical = isVerticalText(passage.text);
                  return (
                    <figure key={i} className={styles.passage} data-vertical={vertical || undefined}>
                      <span className={styles.passageNo} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <blockquote className={vertical ? styles.cjk : "display"}>{passage.text}</blockquote>
                      {(passage.source || passage.note) && (
                        <figcaption>
                          {passage.source && <span className={styles.source}>{passage.source}</span>}
                          {passage.note && <span className={styles.note}>{passage.note}</span>}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}

                <span className={styles.divider} aria-hidden="true" />

                <footer className={styles.colophon}>
                  <span className={styles.sealSmall} aria-hidden="true">
                    {site.initials}
                  </span>
                  <p className={styles.kicker}>End of scroll</p>
                  <p className={styles.kept}>Kept by {site.name.split(" ")[0]}</p>
                  <button type="button" className={styles.rollUp} onClick={onClose}>
                    Roll it back up
                  </button>
                </footer>
              </div>
            </div>
          </motion.div>

          {/* The rolled bulk rides the unrolling edge; its ribbon comes
              untied just before it moves. */}
          <motion.span
            className={styles.roll}
            aria-hidden="true"
            initial={reduceMotion ? false : { left: "0%" }}
            animate={{ left: "100%" }}
            exit={reduceMotion ? undefined : { left: "0%", transition: ROLL_UP }}
            transition={still ?? UNROLL}
          >
            <motion.span
              className={styles.ribbon}
              initial={reduceMotion ? false : { opacity: 1, scaleX: 1 }}
              animate={{ opacity: 0, scaleX: 1.6 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.3, delay: 0.1 }}
            />
          </motion.span>
        </div>
      </motion.section>

      <div className={styles.under} data-hidden={!overflowing || undefined}>
        <span className={styles.progress} aria-hidden="true">
          <motion.span style={{ scaleX: scrollXProgress }} />
        </span>
        <p className={styles.hint} data-hidden={started || undefined}>
          Scroll sideways to keep unrolling →
        </p>
      </div>
    </div>
  );
}
