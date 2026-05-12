"use client";

import { motion } from "framer-motion";

/**
 * PageHeader — left-aligned, generous, used as the top of every subpage.
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

  return (
    <header className="mx-auto max-w-6xl px-6">
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="block text-[10px] uppercase tracking-[0.4em] text-ink-50/50"
      >
        {eyebrow}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.85, ease }}
        className="display text-5xl md:text-7xl lg:text-[5.5rem] mt-5 text-gradient leading-[1.02]"
      >
        {title}
      </motion.h1>

      {lede && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.7 }}
          className="mt-6 text-base md:text-lg text-ink-50/65 max-w-2xl leading-[1.6]"
        >
          {lede}
        </motion.p>
      )}

      {/* Subtle hairline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.8, ease }}
        style={{ transformOrigin: "left" }}
        className="mt-12 h-px bg-gradient-to-r from-ink-50/25 via-ink-50/10 to-transparent"
      />
    </header>
  );
}
