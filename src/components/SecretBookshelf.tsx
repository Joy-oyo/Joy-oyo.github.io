"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, X } from "lucide-react";
import { bookshelf } from "@/content/books";
import styles from "./SecretBookshelf.module.css";

type Phase = "opening" | "open" | "closing" | "leaving";

export default function SecretBookshelf({
  left,
  right,
  seam,
  initialGap = 0,
  onClose,
}: {
  left: "yang" | "yin";
  right: "yang" | "yin";
  seam: string;
  initialGap?: number;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<Phase>("opening");
  const reduceMotion = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const closing = phase === "closing" || phase === "leaving";
  const requestClose = () => setPhase((current) => current === "leaving" ? current : "closing");
  const doorDuration = reduceMotion ? 0 : closing ? 0.65 : 1.1;
  const doorTransition = {
    duration: doorDuration,
    delay: reduceMotion || closing ? 0 : 0.12,
    ease: [0.76, 0, 0.24, 1] as const,
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const { body, documentElement: html } = document;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const bodyStyle = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
    };
    const overflow = html.style.overflow;
    const scrollBehavior = html.style.scrollBehavior;
    html.style.overflow = "hidden";
    Object.assign(body.style, {
      overflow: "hidden",
      position: "fixed",
      top: `-${scrollY}px`,
      left: `-${scrollX}px`,
      width: "100%",
    });
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      Object.assign(body.style, bodyStyle);
      html.style.overflow = overflow;
      html.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      html.style.scrollBehavior = scrollBehavior;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      data-no-flip
      data-phase={phase}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key !== "Tab") return;
        const targets = event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)");
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <motion.div
        className={styles.stage}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "leaving" ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        onAnimationComplete={() => {
          if (phase === "leaving") onClose();
        }}
      >
        <BookshelfRoom closing={closing} titleId={`${id}-title`} descriptionId={`${id}-description`} />

        <svg className={styles.definitions} aria-hidden="true" focusable="false">
          <defs>
            <clipPath id={`${id}-left`} clipPathUnits="objectBoundingBox">
              <path d={`${seam} H 0 V 0 Z`} />
            </clipPath>
            <clipPath id={`${id}-right`} clipPathUnits="objectBoundingBox">
              <path d={`${seam} H 1 V 0 Z`} />
            </clipPath>
          </defs>
        </svg>
        <motion.div
          aria-hidden="true"
          data-polarity={left}
          data-door="left"
          className={styles.door}
          style={{ clipPath: `url(#${id}-left)` }}
          initial={{ x: `calc(0% - ${initialGap}px)` }}
          animate={{ x: closing ? "calc(0% - 0px)" : "calc(-54% - 0px)" }}
          transition={doorTransition}
        />
        <motion.div
          aria-hidden="true"
          data-polarity={right}
          data-door="right"
          className={styles.door}
          style={{ clipPath: `url(#${id}-right)` }}
          initial={{ x: `calc(0% + ${initialGap}px)` }}
          animate={{ x: closing ? "calc(0% + 0px)" : "calc(54% + 0px)" }}
          transition={doorTransition}
          onAnimationComplete={() => {
            setPhase((current) => current === "closing" ? "leaving" : current === "opening" ? "open" : current);
          }}
        />
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={requestClose}
          aria-label="Close secret bookshelf"
        >
          <X size={17} aria-hidden="true" />
          <span>Back to the surface</span>
        </button>
      </motion.div>
    </dialog>
  );
}

export function BookshelfRoom({
  preview = false,
  closing = false,
  titleId,
  descriptionId,
}: {
  preview?: boolean;
  closing?: boolean;
  titleId?: string;
  descriptionId?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (preview) {
    return (
      <div className={styles.room} aria-hidden="true">
        <div className={styles.emptyShelves}>
          {[0, 1, 2].map((index) => <div key={index} className={styles.emptyShelf} />)}
        </div>
      </div>
    );
  }
  return (
    <div className={styles.room}>
      <motion.div
        className={styles.collection}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        animate={{ opacity: closing ? 0 : 1, y: closing && !reduceMotion ? 12 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion || closing ? 0 : 0.35 }}
      >
        <header className={styles.heading}>
          <p className={styles.eyebrow}><BookOpen size={15} aria-hidden="true" /> A room between worlds</p>
          <h2 id={titleId} className="display">The secret bookshelf.</h2>
          <p id={descriptionId} className={styles.description}>
            A few books I keep coming back to. Pick one to open my reading notes.
          </p>
        </header>
        <ol className={styles.shelves} aria-label="Reading collection">
          {bookshelf.map((book, index) => (
            <li key={book.id} className={styles.bookSlot}>
              <a
                href={book.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.book}
                style={{ "--book-color": book.color } as CSSProperties}
              >
                <span className={styles.cover}>
                  <span className={styles.subject}>{book.subject}</span>
                  <span className={`${styles.bookTitle} display`}>{book.title}</span>
                  <span className={styles.author}>{book.author}</span>
                </span>
                <span className={styles.bookAction}>Open notes <ArrowUpRight size={13} aria-hidden="true" /></span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <span className={styles.catalogueNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </li>
          ))}
        </ol>
        <div className={styles.colophon}>
          <span>{String(bookshelf.length).padStart(2, "0")} books · A personal collection</span>
          <span>Found in the space between black & white.</span>
        </div>
      </motion.div>
    </div>
  );
}
