"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { businessBooks, humanitiesBooks, type BusinessBook, type HumanitiesBook } from "@/content/books";
import styles from "./RevolvingShelf.module.css";

const SPINE_CLOTH = ["#5a2a27", "#23413a", "#2b3452", "#6b5327", "#3f2d45", "#4a3a2a"];
const SPINE_HEIGHT = [0.94, 1, 0.86, 0.97, 0.9, 0.99, 0.88];

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

export function HumanitiesFace({
  active,
  onOpen,
}: {
  active: boolean;
  onOpen: (book: HumanitiesBook, from: HTMLElement) => void;
}) {
  const ref = useInert(active);
  const half = Math.ceil(humanitiesBooks.length / 2);
  const rows = humanitiesBooks.length > 8 ? [humanitiesBooks.slice(0, half), humanitiesBooks.slice(half)] : [humanitiesBooks];

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

        {humanitiesBooks.length === 0 ? (
          <div className={styles.emptyLibrary}>
            <div className={styles.plank} aria-hidden="true" />
            <p className={styles.plaque}>
              <span className="display">Being shelved.</span>
              Reviews and excerpts arrive with each new book.
            </p>
            <div className={styles.plank} aria-hidden="true" />
          </div>
        ) : (
          <div className={styles.spineRows}>
            {rows.map((row, r) => (
              <ol key={r} className={styles.spines} aria-label={r === 0 ? "Humanities books" : "More humanities books"}>
                {row.map((book, i) => {
                  const index = r * half + i;
                  return (
                    <li key={book.id}>
                      <button
                        type="button"
                        className={styles.spine}
                        style={
                          {
                            "--cloth": book.color ?? SPINE_CLOTH[index % SPINE_CLOTH.length],
                            "--h": SPINE_HEIGHT[index % SPINE_HEIGHT.length],
                            "--w": `${Math.min(58, 34 + book.title.length * 0.7)}px`,
                          } as CSSProperties
                        }
                        onClick={(e) => onOpen(book, e.currentTarget)}
                        aria-label={`${book.title} by ${book.author} — read review and excerpts`}
                      >
                        <span className={`display ${styles.spineTitle}`}>{book.title}</span>
                        <span className={styles.spineAuthor}>{book.author.split(" ").slice(-1)[0]}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
