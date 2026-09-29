"use client";

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ReturnGlyph } from "@/components/icons/ReturnGlyph";
import RevolvingShelf from "@/components/bookshelf/RevolvingShelf";
import BookReader, { type OpenBook } from "@/components/bookshelf/BookReader";
import KnowledgeCosmos from "@/components/bookshelf/KnowledgeCosmos";
import styles from "./SecretBookshelf.module.css";

type Phase = "opening" | "open" | "closing" | "leaving";

type CrackBook = {
  /** Deep, near-black spine colours — the crack should read as a dim shelf. */
  color: string;
  width: number;
  height: number;
  tilt: number;
};

// What you glimpse through the seam: rows of spines standing on the shelves,
// a few of them leaning. Widths/heights are deliberately uneven so the sliver
// of light doesn't look like a repeating pattern.
const CRACK_SHELVES: CrackBook[][] = [
  [
    { color: "#231a14", width: 15, height: 46, tilt: 0 },
    { color: "#1b1f1d", width: 12, height: 38, tilt: -5 },
    { color: "#2c2118", width: 17, height: 52, tilt: 0 },
    { color: "#191a20", width: 13, height: 36, tilt: 3 },
    { color: "#2a1c1c", width: 16, height: 48, tilt: -2 },
    { color: "#1f1a14", width: 11, height: 34, tilt: 11 },
    { color: "#23282a", width: 18, height: 44, tilt: 0 },
    { color: "#2b1f16", width: 14, height: 50, tilt: -6 },
    { color: "#1a1618", width: 12, height: 40, tilt: 2 },
    { color: "#26201a", width: 16, height: 43, tilt: 0 },
  ],
  [
    { color: "#1d1712", width: 13, height: 42, tilt: 4 },
    { color: "#2a2019", width: 17, height: 50, tilt: 0 },
    { color: "#1a1e21", width: 12, height: 37, tilt: -8 },
    { color: "#2e2015", width: 15, height: 46, tilt: 0 },
    { color: "#191512", width: 14, height: 39, tilt: 2 },
    { color: "#211d1a", width: 18, height: 53, tilt: 0 },
    { color: "#2b1b1b", width: 11, height: 35, tilt: -12 },
    { color: "#1e2320", width: 16, height: 45, tilt: 0 },
    { color: "#241d16", width: 13, height: 41, tilt: 6 },
    { color: "#1c1917", width: 15, height: 48, tilt: 0 },
  ],
  [
    { color: "#251b15", width: 16, height: 47, tilt: 0 },
    { color: "#1a1c1f", width: 12, height: 36, tilt: -4 },
    { color: "#2d2217", width: 18, height: 51, tilt: 0 },
    { color: "#1e1714", width: 13, height: 40, tilt: 7 },
    { color: "#202420", width: 15, height: 44, tilt: 0 },
    { color: "#2a1a18", width: 11, height: 33, tilt: -9 },
    { color: "#171a1e", width: 17, height: 49, tilt: 0 },
    { color: "#281e15", width: 14, height: 42, tilt: 3 },
    { color: "#1f1b18", width: 12, height: 38, tilt: 0 },
    { color: "#231c18", width: 16, height: 46, tilt: -3 },
  ],
];

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
  const stageRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<Phase>("opening");
  const [reading, setReading] = useState<OpenBook | null>(null);
  const [cosmos, setCosmos] = useState<{ x: number; y: number } | null>(null);
  const [cosmosDetail, setCosmosDetail] = useState<string | null>(null);
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

  const restoreFocus = () => {
    const el = returnFocus.current;
    returnFocus.current = null;
    window.setTimeout(() => el?.isConnected && el.focus({ preventScroll: true }), 0);
  };

  const openBook = useCallback((open: OpenBook, from?: HTMLElement) => {
    if (from) returnFocus.current = from;
    setReading(open);
  }, []);

  const closeBook = () => {
    setReading(null);
    restoreFocus();
  };

  const openCosmos = useCallback((from: HTMLElement) => {
    const stage = stageRef.current?.getBoundingClientRect();
    const rect = from.getBoundingClientRect();
    returnFocus.current = from;
    setCosmosDetail(null);
    setCosmos({ x: rect.left + rect.width / 2 - (stage?.left ?? 0), y: rect.top + rect.height / 2 - (stage?.top ?? 0) });
  }, []);

  const closeCosmos = () => {
    setCosmos(null);
    setCosmosDetail(null);
    restoreFocus();
  };

  /** Escape backs out one layer at a time: book → star → cosmos → room. */
  const backOut = () => {
    if (reading) closeBook();
    else if (cosmosDetail) setCosmosDetail(null);
    else if (cosmos) closeCosmos();
    else requestClose();
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
      data-no-flip
      data-phase={phase}
      onCancel={(event) => {
        event.preventDefault();
        backOut();
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key !== "Tab") return;
        const layer = event.currentTarget.querySelector<HTMLElement>("[data-layer='top']") ?? event.currentTarget;
        const targets = Array.from(
          layer.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), iframe")
        ).filter((el) => !el.closest("[inert]"));
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
        ref={stageRef}
        className={styles.stage}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "leaving" ? 0 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        onAnimationComplete={() => {
          if (phase === "leaving") onClose();
        }}
      >
        <BookshelfRoom
          closing={closing}
          titleId={`${id}-title`}
          covered={!!reading || !!cosmos}
        >
          <RevolvingShelf ready={phase === "open"} onOpenBook={(open, from) => openBook(open, from)} onOpenCosmos={openCosmos} />
        </BookshelfRoom>

        <AnimatePresence>
          {reading && (
            <div key="reader" data-layer="top" className={styles.layer}>
              <div className={styles.scrim} onClick={closeBook} aria-hidden="true" />
              <BookReader open={reading} onClose={closeBook} />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {cosmos && (
            <div key="cosmos" data-layer={reading ? undefined : "top"} className={styles.layer} inert={reading ? true : undefined}>
              <KnowledgeCosmos
                origin={cosmos}
                detail={cosmosDetail}
                onDetail={setCosmosDetail}
                onClose={closeCosmos}
                onOpenBook={(open) => {
                  returnFocus.current = document.getElementById(`cosmos-${cosmosDetail}`);
                  setReading(open);
                }}
              />
            </div>
          )}
        </AnimatePresence>

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
          aria-label="Back to the surface"
          title="Back to the surface"
        >
          <ReturnGlyph className={styles.closeGlyph} />
        </button>
      </motion.div>
    </dialog>
  );
}

export function BookshelfRoom({
  preview = false,
  closing = false,
  covered = false,
  titleId,
  children,
}: {
  preview?: boolean;
  closing?: boolean;
  /** A book or the cosmos sits on top; the room stays put but inert. */
  covered?: boolean;
  titleId?: string;
  children?: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const roomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (roomRef.current) roomRef.current.inert = covered;
  }, [covered]);
  if (preview) {
    return (
      <div className={styles.room} aria-hidden="true">
        <div className={styles.crackShelves}>
          {CRACK_SHELVES.map((shelf, shelfIndex) => (
            <div key={shelfIndex} className={styles.crackShelf}>
              {shelf.map((book, index) => (
                <span
                  key={index}
                  className={styles.crackBook}
                  style={
                    {
                      "--book-color": book.color,
                      "--book-width": `${book.width}px`,
                      "--book-height": `${book.height}px`,
                      "--book-tilt": `${book.tilt}deg`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div ref={roomRef} className={styles.room}>
      <motion.div
        className={styles.collection}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        animate={{ opacity: closing ? 0 : 1, y: closing && !reduceMotion ? 12 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion || closing ? 0 : 0.35 }}
      >
        <header className={styles.heading}>
          <h2 id={titleId} className="display">The secret bookshelf.</h2>
        </header>
        {children}
      </motion.div>
    </div>
  );
}
