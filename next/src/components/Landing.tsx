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
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ink-50/50"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/80 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
            Available · Palo Alto
          </motion.div>

          {/* H1 — name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1, ease }}
            className="display text-gradient mt-5 text-5xl md:text-6xl lg:text-7xl leading-[1.15] pb-2"
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
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
            className="mt-4 text-sm md:text-[15px] text-ink-50/60 leading-[1.6] max-w-md"
          >
            <span className="text-ink-50/40 uppercase tracking-[0.25em] text-[10px] mr-2">
              Now ·
            </span>
            {site.currently}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm"
          >
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-50 text-ink-950 px-5 py-2.5 font-medium hover:bg-white transition-colors focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 outline-none"
            >
              Say hi
              <span aria-hidden>→</span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 text-ink-50/70 hover:text-ink-50 border-b border-ink-50/20 hover:border-ink-50/80 pb-0.5 transition-colors"
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
                className="rounded border border-ink-50/15 px-1.5 py-0.5 font-mono text-[10px] text-ink-50/60 hover:text-ink-50 hover:border-ink-50/40 transition-colors"
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
                className="rounded border border-ink-50/15 px-1.5 py-0.5 font-mono text-[10px] text-ink-50/60 hover:text-ink-50 hover:border-ink-50/40 transition-colors"
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
