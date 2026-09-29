"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notesHref, type BusinessBook, type HumanitiesBook } from "@/content/books";
import styles from "./BookReader.module.css";

export type OpenBook =
  | { shelf: "business"; book: BusinessBook }
  | { shelf: "humanities"; book: HumanitiesBook };

/**
 * A book taken off the shelf. Business books open their interactive
 * reading guide (re-skinned to the site's palette by the route that
 * serves it); humanities books open the review and kept excerpts.
 */
export default function BookReader({ open, onClose }: { open: OpenBook; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef(onClose);
  const [loaded, setLoaded] = useState(false);
  closeRef.current = onClose;

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

  const business = open.shelf === "business";
  const { book } = open;

  return (
    <motion.section
      className={styles.reader}
      data-shelf={open.shelf}
      aria-label={`${book.title} — ${business ? "reading notes" : "review and excerpts"}`}
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
          <p className={styles.kicker}>{business ? `Business · ${open.book.no}` : "Humanities"}</p>
          <h3 className={`display ${styles.title}`}>{book.title}</h3>
          <p className={styles.author}>{book.author}</p>
        </div>
        {business && (
          <a className={styles.full} href={notesHref(open.book)} target="_blank" rel="noopener noreferrer">
            Full page <ArrowUpRight size={13} aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </header>

      {business ? (
        <div className={styles.frame}>
          {!loaded && <p className={styles.loading}>Opening the book…</p>}
          <iframe
            src={notesHref(open.book)}
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
      ) : (
        <HumanitiesNotes book={open.book} />
      )}
    </motion.section>
  );
}

function HumanitiesNotes({ book }: { book: HumanitiesBook }) {
  const paragraphs = book.review.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className={styles.notes}>
      <article className={styles.notesInner}>
        {book.subject && <p className={styles.kicker}>{book.subject}</p>}
        <h4 className={styles.section}>Review</h4>
        {paragraphs.map((paragraph, i) => (
          <p key={i} className={styles.review}>
            {paragraph}
          </p>
        ))}
        {book.excerpts.length > 0 && (
          <>
            <h4 className={styles.section}>Kept passages</h4>
            <ol className={styles.excerpts}>
              {book.excerpts.map((excerpt, i) => (
                <li key={i}>
                  <figure>
                    <blockquote className="display">{excerpt.text}</blockquote>
                    {excerpt.where && <figcaption>{excerpt.where}</figcaption>}
                  </figure>
                </li>
              ))}
            </ol>
          </>
        )}
      </article>
    </div>
  );
}
