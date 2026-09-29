"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notesHref, type BusinessBook } from "@/content/books";
import type { IdeaScroll } from "@/content/scrolls";
import styles from "./BookReader.module.css";

/** Whatever is taken off the shelf: a business book, or an idea scroll. */
export type OpenBook =
  | { shelf: "business"; book: BusinessBook }
  | { shelf: "humanities"; scroll: IdeaScroll };

export const openTitle = (open: OpenBook) => (open.shelf === "business" ? open.book.title : open.scroll.title);

/**
 * A business book taken off the shelf: its interactive reading guide,
 * re-skinned to the site's palette by the route that serves it.
 * (Humanities scrolls open in ScrollReader.)
 */
export default function BookReader({ book, onClose }: { book: BusinessBook; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  const [loaded, setLoaded] = useState(false);
  closeRef.current = onClose;

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.section
      className={styles.reader}
      aria-label={`${book.title} — reading notes`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : 26, scale: reduceMotion ? 1 : 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className={styles.bar}>
        <button ref={backRef} type="button" className={styles.back} onClick={onClose}>
          <ArrowLeft size={15} aria-hidden="true" />
          Back to shelf
        </button>
        <div className={styles.titleBlock}>
          <p className={styles.kicker}>Business · {book.no}</p>
          <h3 className={`display ${styles.title}`}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
        </div>
        <a className={styles.full} href={notesHref(book)} target="_blank" rel="noopener noreferrer">
          Full page <ArrowUpRight size={13} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </header>

      <div className={styles.frame}>
        {!loaded && <p className={styles.loading}>Opening the book…</p>}
        <iframe
          src={notesHref(book)}
          title={`${book.title} — reading notes`}
          onLoad={(e) => {
            setLoaded(true);
            // Same-origin guide: let Escape inside it close the book too.
            try {
              e.currentTarget.contentWindow?.addEventListener("keydown", (event) => {
                if (event.key === "Escape") closeRef.current();
              });
            } catch {
              /* the book still reads fine without the shortcut */
            }
          }}
        />
      </div>
    </motion.section>
  );
}
