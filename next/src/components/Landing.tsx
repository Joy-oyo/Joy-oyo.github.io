"use client";

import { motion } from "framer-motion";
import { site } from "@/content/portfolio";
import AlbumStack from "@/components/AlbumStack";

/**
 * Landing — two-column hero.
 * Left: name + role + currently + location (the "who/what" pitch).
 * Right: AlbumStack 3D card interaction (the "explore" affordance).
 */
export default function Landing() {
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative px-6 pt-28 md:pt-32 pb-4 md:pb-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Left — Who I am */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="md:col-span-5"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="glass-chip glass-sheen inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.34em] text-ink-50/60"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/90 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Available · {site.location}
          </motion.div>

          {/* H1 — name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1, ease }}
            className="display text-gradient mt-6 text-5xl md:text-6xl lg:text-7xl leading-[1.15] pb-2"
          >
            {site.name}
          </motion.h1>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mt-5 text-base md:text-lg text-ink-50/85 leading-[1.55] max-w-md"
          >
            {site.tagline}.
          </motion.p>

          {/* Currently */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="glass glass-sheen mt-6 max-w-md rounded-2xl px-5 py-4"
          >
            <span className="block text-[10px] uppercase tracking-[0.28em] text-ink-50/40">
              Now
            </span>
            <p className="mt-2 text-sm leading-[1.65] text-ink-50/70 md:text-[15px]">
              {site.currently}
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-8 flex flex-wrap items-center gap-3 text-sm"
          >
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-50 text-ink-950 px-5 py-3 font-medium hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 outline-none"
            >
              Say hi
              <span aria-hidden>→</span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="glass-chip glass-sheen inline-flex items-center gap-2 rounded-full px-5 py-3 text-ink-50/75 transition-colors hover:text-ink-50 focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 outline-none"
            >
              {site.email}
            </a>
          </motion.div>
        </motion.div>

        {/* Right — AlbumStack with affordance hint */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease }}
          className="md:col-span-7 relative"
        >
          {/* Hint */}
          <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-ink-50/45">
            <span>Explore the work</span>
            <span className="hidden md:inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("albumstack:prev")
                  )
                }
                aria-label="Previous album"
                className="glass-chip flex h-8 w-8 items-center justify-center rounded-full font-mono text-[11px] text-ink-50/65 transition-colors hover:text-ink-50 focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 outline-none"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("albumstack:next")
                  )
                }
                aria-label="Next album"
                className="glass-chip flex h-8 w-8 items-center justify-center rounded-full font-mono text-[11px] text-ink-50/65 transition-colors hover:text-ink-50 focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 outline-none"
              >
                →
              </button>
              <span className="text-ink-50/35">or drag</span>
            </span>
          </div>

          <AlbumStack compact />
        </motion.div>
      </div>
    </section>
  );
}
