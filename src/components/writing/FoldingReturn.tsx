"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import PaperPlane from "./PaperPlane";
import styles from "./FoldingReturn.module.css";

const destination = "/writing#flight-route";
const foldTiming = { duration: 1.5, times: [0, .2, .55, 1], ease: "easeInOut" as const };

export default function FoldingReturn({ title, excerpt, className }: { title: string; excerpt: string; className?: string }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [folding, setFolding] = useState(false);

  return <>
    <Link href={destination} className={className} onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduceMotion) return;
      event.preventDefault();
      router.prefetch("/writing");
      setFolding(true);
    }}>Fold it back into the route <PaperPlane /></Link>
    {folding && createPortal(<FoldingSheet title={title} excerpt={excerpt} onArrive={() => router.push(destination)} />, document.body)}
  </>;
}

function FoldingSheet({ title, excerpt, onArrive }: { title: string; excerpt: string; onArrive: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return <dialog ref={dialog} className={styles.stage} aria-label="Folding the article into a paper plane" onCancel={(event) => { event.preventDefault(); onArrive(); }}>
    <p className="sr-only" role="status">Folding {title} and returning to the flight route.</p>
    <Link href={destination} className={styles.skip} autoFocus>Skip animation ↗</Link>
    <div className={styles.sheetPosition} aria-hidden="true">
      <motion.div className={styles.sheet} initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: [0, 1, 1, 1, 0], scale: [1.15, 1, .8, .45, .2], rotate: [0, 0, 0, 35, 55], x: [0, 0, 0, 0, window.innerWidth * .65], y: [0, 0, 0, -30, -window.innerHeight * .65] }} transition={{ duration: 2.25, times: [0, .12, .66, .78, 1], ease: "easeInOut" }} onAnimationComplete={onArrive}>
        <svg viewBox="0 0 240 320" className={styles.paper} fill="none">
          {/* The sheet's corners fold inward, then the wings meet at the spine. */}
          <motion.polygon fill="#f4f0e6" initial={{ points: "0,0 120,0 240,0 240,320 120,320 0,320" }} animate={{ points: ["0,0 120,0 240,0 240,320 120,320 0,320", "0,0 120,0 240,0 240,320 120,320 0,320", "0,120 120,0 240,120 240,320 120,320 0,320", "120,0 120,0 120,0 240,320 120,270 0,320"] }} transition={foldTiming} />
          <motion.foreignObject x="22" y="24" width="196" height="270" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: .25, duration: .35 }}>
            <div className={styles.ink}><span>FROM MY NOTEBOOK</span><h2>{title}</h2><p>{excerpt}</p><div /><div /><div /></div>
          </motion.foreignObject>
          <motion.path d="M120 0V320" stroke="#7d8b9d" strokeWidth=".8" initial={{ opacity: 0 }} animate={{ opacity: [0, .5, .3] }} transition={{ duration: .6 }} />
          <motion.path initial={{ d: "M0 0L120 0L0 120Z", fill: "#f4f0e6", opacity: 0 }} animate={{ d: ["M0 0L120 0L0 120Z", "M120 120L120 0L0 120Z", "M120 0L120 0L0 320Z"], fill: ["#f4f0e6", "#cbd2d3", "#e7e9df"], opacity: [0, 1, 0] }} transition={{ duration: 1.1, delay: .2, times: [0, .6, 1], ease: "easeInOut" }} />
          <motion.path initial={{ d: "M240 0L240 120L120 0Z", fill: "#f4f0e6", opacity: 0 }} animate={{ d: ["M240 0L240 120L120 0Z", "M120 120L240 120L120 0Z", "M120 0L240 320L120 0Z"], fill: ["#f4f0e6", "#d8ddcf", "#c2cddd"], opacity: [0, 1, 0] }} transition={{ duration: 1.1, delay: .25, times: [0, .6, 1], ease: "easeInOut" }} />
          <motion.path initial={{ d: "M120 0L240 120L240 320L120 320Z", opacity: 0 }} animate={{ d: "M120 0L240 320L120 270L120 270Z", opacity: .95 }} fill="#b9c7d8" transition={{ delay: .85, duration: .65, ease: "easeInOut" }} />
          <motion.path d="M120 0L120 270L0 320Z" fill="#e5e7de" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25, duration: .25 }} />
          <motion.path d="M120 0V270" stroke="#6b83a1" strokeWidth="1" initial={{ opacity: 0 }} animate={{ opacity: .6 }} transition={{ delay: 1.1, duration: .4 }} />
        </svg>
      </motion.div>
    </div>
  </dialog>;
}
