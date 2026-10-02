"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { businessBooks, type BusinessBook } from "@/content/books";
import { ideaScrolls, type IdeaScroll } from "@/content/scrolls";
import { scrollLook } from "./scrollLook";
import styles from "./RevolvingShelf.module.css";

/** The face turned away from the viewer must not take focus or clicks. */
function useInert(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.inert = !active;
  }, [active]);
  return ref;
}

export function BusinessFace({
  active,
  onOpen,
}: {
  active: boolean;
  onOpen: (book: BusinessBook, from: HTMLElement) => void;
}) {
  const ref = useInert(active);

  return (
    <div ref={ref} className={`${styles.carcass} ${styles.business}`}>
      <div className={styles.interior}>
        <header className={styles.faceHead}>
          <div>
            <h3 className={`display ${styles.faceTitle}`}>Business</h3>
          </div>
        </header>

        <ol className={styles.covers} aria-label="Business books">
          {businessBooks.map((book) => (
            <li key={book.id} className={styles.coverSlot}>
              <div className={styles.stand}>
                <button
                  type="button"
                  className={styles.cover}
                  style={{ "--cloth": book.color } as CSSProperties}
                  onClick={(e) => onOpen(book, e.currentTarget)}
                  aria-label={`${book.title} by ${book.author} — open reading notes`}
                >
                  <span className={styles.coverKicker}>{book.subject}</span>
                  <span className={`display ${styles.coverTitle}`}>{book.title}</span>
                  <span className={styles.coverAuthor}>{book.author}</span>
                </button>
              </div>
              <p className={styles.coverMeta} aria-hidden="true">
                <span>{book.no}</span> / {book.category}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/**
 * The rack fills whatever height the face gives it: as many rows of
 * cubbies as fit — more once the scrolls outgrow them, and then it
 * scrolls — with empty cubbies waiting for the next idea.
 */
function useRackCells(count: number) {
  const rackRef = useRef<HTMLOListElement>(null);
  const [cells, setCells] = useState(count);
  useEffect(() => {
    const rack = rackRef.current;
    if (!rack) return;
    const measure = () => {
      const cs = getComputedStyle(rack);
      const cols = Math.max(1, cs.gridTemplateColumns.split(" ").filter(Boolean).length);
      const row = parseFloat(cs.getPropertyValue("--row")) || 104;
      const gap = parseFloat(cs.rowGap) || 0;
      const inner = rack.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const fit = Math.max(1, Math.floor((inner + gap) / (row + gap)));
      setCells(Math.max(fit, Math.ceil(count / cols)) * cols);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(rack);
    return () => observer.disconnect();
  }, [count]);
  return [rackRef, Math.max(cells, count)] as const;
}

export function HumanitiesFace({
  active,
  onOpen,
}: {
  active: boolean;
  onOpen: (scroll: IdeaScroll, from: HTMLElement) => void;
}) {
  const ref = useInert(active);
  const [rackRef, cells] = useRackCells(ideaScrolls.length);

  return (
    <div ref={ref} className={`${styles.carcass} ${styles.humanities}`}>
      <div className={styles.interior}>
        <div className={styles.lamp} aria-hidden="true" />
        <header className={styles.faceHead}>
          <div>
            <h3 className={`display ${styles.faceTitle}`}>Humanities</h3>
            <p className={styles.faceNote}>
              While practical pursuits sustain life, things like poetry and romance are what we stay alive for.
            </p>
          </div>
        </header>

        <div className={styles.rackArea}>
          <ol ref={rackRef} className={styles.rack} aria-label="Idea scrolls">
            {Array.from({ length: cells }, (_, i) => {
              const scroll = ideaScrolls[i];
              if (!scroll) return <li key={`empty-${i}`} className={styles.cubby} aria-hidden="true" />;
              const look = scrollLook(scroll, i);
              const n = scroll.passages.length;
              return (
                <li key={scroll.id} className={styles.cubby}>
                  {/* The whole cubby is the hit target; the roll inside is decoration. */}
                  <button
                    type="button"
                    className={styles.scrollBtn}
                    onClick={(e) => onOpen(scroll, e.currentTarget)}
                    aria-label={`${scroll.title} — unroll the scroll (${n} ${n === 1 ? "passage" : "passages"})`}
                    title={scroll.title}
                    style={
                      {
                        "--silk": look.silk,
                        "--knob": look.knob,
                        "--len": look.length / 100,
                        "--left": look.left / 100,
                        "--thick": `${look.thick}px`,
                      } as CSSProperties
                    }
                  >
                    <span className={styles.cubbyNo} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* Full title + one-liner surface in the dark of the cubby on
                        hover — the slip on the roll may have to truncate. */}
                    <span className={styles.cubbyCaption} aria-hidden="true">
                      <span className={`display ${styles.cubbyTitle}`}>{scroll.title}</span>
                      {scroll.line && <span className={styles.cubbyLine}>{scroll.line}</span>}
                    </span>
                    <span className={styles.rolled} aria-hidden="true">
                      <span className={`display ${styles.slip}`}>{scroll.title}</span>
                      <span className={styles.tie}>
                        <span className={styles.tag}>{scroll.glyph ?? scroll.title.charAt(0)}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {ideaScrolls.length === 0 && (
            <p className={styles.plaque}>
              <span className="display">The rack is ready.</span>
              Scrolls arrive with each new idea.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
