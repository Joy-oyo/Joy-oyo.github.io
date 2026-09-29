"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { businessBooks } from "@/content/books";
import { businessIdeas, knowledgeSystems } from "@/content/knowledge";
import { ideaScrolls } from "@/content/scrolls";
import { openTitle, type OpenBook } from "./BookReader";
import styles from "./KnowledgeCosmos.module.css";

// Positions are percentages of the cosmos. Business fills the left lobe,
// humanities the right, mirroring the home page's taiji split.
const SYSTEM_AT = [
  [11, 42],
  [30, 33],
  [33, 71],
  [12, 75],
] as const;
const BUSINESS_STAR_AT = [
  [22, 55],
  [42, 49],
  [24, 88],
  [44, 84],
  [41, 25],
  [5, 61],
] as const;
const HUMANITIES_STAR_AT = [
  [62, 32],
  [80, 26],
  [70, 50],
  [88, 46],
  [60, 70],
  [78, 72],
  [90, 84],
  [66, 88],
  [84, 60],
  [57, 50],
  [74, 38],
  [92, 32],
] as const;

type Node =
  | { id: string; kind: "system"; at: readonly [number, number]; system: (typeof knowledgeSystems)[number] }
  | { id: string; kind: "book"; at: readonly [number, number]; open: OpenBook };

const nodes: Node[] = [
  ...knowledgeSystems.map((system, i): Node => ({ id: `system-${system.id}`, kind: "system", at: SYSTEM_AT[i % SYSTEM_AT.length], system })),
  ...businessBooks.map((book, i): Node => ({
    id: `business-${book.id}`,
    kind: "book",
    at: BUSINESS_STAR_AT[i % BUSINESS_STAR_AT.length],
    open: { shelf: "business", book },
  })),
  ...ideaScrolls.map((scroll, i): Node => ({
    id: `humanities-${scroll.id}`,
    kind: "book",
    at: HUMANITIES_STAR_AT[i % HUMANITIES_STAR_AT.length],
    open: { shelf: "humanities", scroll },
  })),
];

const humanitiesIdeas = ideaScrolls.map((s) => s.title).slice(0, 6);

export default function KnowledgeCosmos({
  origin,
  detail,
  onDetail,
  onClose,
  onOpenBook,
}: {
  /** Where the cosmos opens from, in px within the stage. */
  origin: { x: number; y: number };
  detail: string | null;
  onDetail: (id: string | null) => void;
  onClose: () => void;
  onOpenBook: (open: OpenBook) => void;
}) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const detailCloseRef = useRef<HTMLButtonElement>(null);
  const lastNode = useRef<string | null>(null);
  const active = nodes.find((n) => n.id === detail) ?? null;

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (detail) {
      lastNode.current = detail;
      detailCloseRef.current?.focus({ preventScroll: true });
    } else if (lastNode.current) {
      document.getElementById(`cosmos-${lastNode.current}`)?.focus({ preventScroll: true });
    }
  }, [detail]);

  const at = `${origin.x}px ${origin.y}px`;
  const detailSide = active && active.at[0] < 50 ? "right" : "left";

  return (
    <motion.section
      className={styles.cosmos}
      aria-label="Knowledge cosmos"
      initial={reduceMotion ? { opacity: 0 } : { clipPath: `circle(0px at ${at})` }}
      animate={reduceMotion ? { opacity: 1 } : { clipPath: `circle(150vmax at ${at})` }}
      exit={reduceMotion ? { opacity: 0 } : { clipPath: `circle(0px at ${at})` }}
      transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <svg className={styles.taiji} viewBox="0 0 1000 1000" aria-hidden="true">
        <circle cx="500" cy="500" r="490" className={styles.yangLobe} />
        <path d="M 500 10 A 490 490 0 0 1 500 990 A 245 245 0 0 1 500 500 A 245 245 0 0 0 500 10 Z" className={styles.yinLobe} />
        <circle cx="500" cy="500" r="490" className={styles.outline} />
        <path d="M 500 10 A 245 245 0 0 1 500 500 A 245 245 0 0 0 500 990" className={styles.seam} />
        <circle cx="500" cy="255" r="16" className={styles.seedWarm} />
        <circle cx="500" cy="745" r="16" className={styles.seedCool} />
      </svg>

      <div className={styles.ideas} aria-hidden="true">
        {businessIdeas.map((word, i) => (
          <span key={word} className={styles.idea} style={{ "--i": i, "--side": 0 } as CSSProperties}>
            {word}
          </span>
        ))}
        {humanitiesIdeas.map((word, i) => (
          <span key={word} className={styles.idea} style={{ "--i": i, "--side": 1 } as CSSProperties}>
            {word}
          </span>
        ))}
      </div>

      <header className={styles.head}>
        <button ref={closeRef} type="button" className={styles.back} onClick={onClose}>
          <ArrowLeft size={15} aria-hidden="true" />
          Back to the shelf
        </button>
        <p className={styles.kicker}>Business × Humanities</p>
        <h3 className={`display ${styles.title}`}>Knowledge cosmos.</h3>
        <p className={styles.lede}>Two shelves, one universe. Pick a star.</p>
      </header>

      <p className={`${styles.hemisphere} ${styles.hemisphereLeft}`}>Business · systems &amp; tools</p>
      <p className={`${styles.hemisphere} ${styles.hemisphereRight}`}>Humanities · ideas &amp; meaning</p>

      <ul className={styles.map} aria-label="Knowledge">
        {nodes.map((node) => (
          <li
            key={node.id}
            className={node.kind === "system" ? styles.planetSlot : styles.starSlot}
            data-side={node.at[0] < 50 ? "business" : "humanities"}
            style={{ "--x": `${node.at[0]}%`, "--y": `${node.at[1]}%` } as CSSProperties}
          >
            <button
              id={`cosmos-${node.id}`}
              type="button"
              className={node.kind === "system" ? styles.planet : styles.star}
              aria-pressed={detail === node.id}
              onClick={() => onDetail(detail === node.id ? null : node.id)}
            >
              {node.kind === "system" ? (
                <>
                  <span className={styles.nodeIndex}>{node.system.index}</span>
                  <span className={`display ${styles.nodeTitle}`}>{node.system.title}</span>
                  <span className={styles.nodeIdea}>{node.system.idea}</span>
                </>
              ) : (
                <>
                  <span className={styles.starDot} aria-hidden="true" />
                  <span className={styles.starLabel}>{openTitle(node.open)}</span>
                </>
              )}
            </button>
          </li>
        ))}
      </ul>

      {ideaScrolls.length === 0 && (
        <p className={styles.waiting}>
          <span className="display">This half is still forming.</span>
          Stars appear here as the scroll rack fills.
        </p>
      )}

      {active && (
        <motion.aside
          key={active.id}
          className={styles.detail}
          data-side={detailSide}
          aria-label={active.kind === "system" ? active.system.title : openTitle(active.open)}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <button ref={detailCloseRef} type="button" className={styles.detailClose} onClick={() => onDetail(null)} aria-label="Close detail">
            <X size={16} aria-hidden="true" />
          </button>
          {active.kind === "system" ? (
            <>
              <p className={styles.kicker}>{active.system.kicker}</p>
              <h4 className={`display ${styles.detailTitle}`}>{active.system.title}</h4>
              <p className={styles.detailBody}>{active.system.summary}</p>
              <ol className={styles.steps}>
                {active.system.steps.map(([title, body], i) => (
                  <li key={title}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <strong>{title}</strong>
                    <p>{body}</p>
                  </li>
                ))}
              </ol>
              <p className={styles.detailNote}>{active.system.note}</p>
            </>
          ) : active.open.shelf === "business" ? (
            <>
              <p className={styles.kicker}>Business shelf · {active.open.book.no}</p>
              <h4 className={`display ${styles.detailTitle}`}>{active.open.book.title}</h4>
              <p className={styles.detailAuthor}>{active.open.book.author}</p>
              <p className={styles.detailBody}>{active.open.book.description}</p>
              <button type="button" className={styles.openBook} onClick={() => onOpenBook(active.open)}>
                Open the book
              </button>
            </>
          ) : (
            <>
              <p className={styles.kicker}>Humanities · scroll</p>
              <h4 className={`display ${styles.detailTitle}`}>{active.open.scroll.title}</h4>
              {active.open.scroll.line && <p className={styles.detailAuthor}>{active.open.scroll.line}</p>}
              {active.open.scroll.passages[0] && (
                <p className={styles.detailBody}>{active.open.scroll.passages[0].text}</p>
              )}
              <button type="button" className={styles.openBook} onClick={() => onOpenBook(active.open)}>
                Unroll the scroll
              </button>
            </>
          )}
        </motion.aside>
      )}
    </motion.section>
  );
}
