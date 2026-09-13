"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * PageHeader — left-aligned, generous, used as the top of every subpage.
 * The eyebrow is a glass chip so it reads as a surface rather than stray text,
 * and a soft Klein bloom sits behind the title to give the glass something
 * to refract.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  const ease = [0.22, 1, 0.36, 1] as const;
  const reduceMotion = useReducedMotion();

  // With reduced motion we still fade, but nothing travels.
  const rise = (distance: number) =>
    reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance };

  return (
    <header className="relative mx-auto max-w-6xl px-6">
      {/* Ambient bloom — purely decorative, sits beneath the type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-0 h-72 w-[36rem] max-w-full rounded-full bg-klein/20 blur-[110px]"
      />

      <motion.div
        initial={rise(8)}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-chip glass-sheen relative inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5"
      >
        <span aria-hidden className="h-1 w-1 rounded-full bg-ink-50/60" />
        <span className="text-[10px] uppercase tracking-[0.34em] text-ink-50/65">
          {eyebrow}
        </span>
      </motion.div>

      <motion.h1
        initial={rise(18)}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.85, ease }}
        className="display relative mt-6 text-5xl leading-[1.02] text-gradient md:text-7xl lg:text-[5.5rem]"
      >
        {title}
      </motion.h1>

      {lede && (
        <motion.p
          initial={rise(12)}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="relative mt-6 max-w-2xl text-base leading-[1.65] text-ink-50/70 md:text-lg"
        >
          {lede}
        </motion.p>
      )}

      {/* Subtle hairline */}
      <motion.div
        aria-hidden
        initial={reduceMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8, ease }}
        style={{ transformOrigin: "left" }}
        className="relative mt-12 h-px bg-gradient-to-r from-ink-50/30 via-ink-50/10 to-transparent"
      />
    </header>
  );
}
