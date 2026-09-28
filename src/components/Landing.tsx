"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import AlbumStack from "@/components/AlbumStack";
import { useTaiji } from "@/components/TaijiHome";
import { FoxGlyph, HedgehogGlyph } from "@/components/icons/FoxHedgehog";

/**
 * Landing — two-column hero laid over the page-wide taiji split.
 * Left: name + role + currently + location (the "who/what" pitch),
 * sitting on the page's left half. Right: AlbumStack 3D card
 * interaction (the "explore" affordance), on the right half.
 * Each column takes its half's polarity, so flipping the page's
 * halves recolors both columns in sync. Below md (no page split)
 * each column becomes a surfaced card of its own polarity.
 */
export default function Landing() {
  const ease = [0.22, 1, 0.36, 1] as const;
  const taiji = useTaiji();
  const left = taiji?.left ?? "yang";
  const right = taiji?.right ?? "yin";

  return (
    <section className="relative px-6 pt-28 md:pt-32 pb-4 md:pb-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 items-center">
        {/* Left — Who I am */}
        <motion.div
          data-polarity={left}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="taiji-col md:col-span-5"
        >
          {/* H1 — name, with the primary action sitting to its right so the
              hero's whole ask reads on one line. Wraps under the name when
              the column is too narrow. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.1, ease }}
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <h1 className="display text-gradient pb-2 text-5xl leading-[1.15] md:text-6xl lg:text-7xl">
              {site.name}
            </h1>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-on px-5 py-3 text-sm font-medium text-surface transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 outline-none"
            >
              Say hi
              <span aria-hidden>→</span>
            </a>
          </motion.div>

          {/* Role — no max-w-md: the tagline is one breath, so from xl up it
              stays on a single line, borrowing the grid gap instead of
              breaking. Narrower screens wrap as before. */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mt-5 max-w-none text-base leading-[1.55] text-on/85 md:text-lg xl:whitespace-nowrap"
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
            <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm leading-[1.65] text-on/70 md:text-[15px]">
              {site.currently.map(({ glyph, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5">
                  {glyph === "fox" ? (
                    <FoxGlyph className="h-[1.25em] w-[1.25em] shrink-0 text-on/85" />
                  ) : (
                    <HedgehogGlyph className="h-[1.25em] w-[1.25em] shrink-0 text-on/85" />
                  )}
                  {text}
                </span>
              ))}
            </p>
          </motion.div>

        </motion.div>

        {/* Right — AlbumStack with affordance hint. Content hugs the
            outer (right) edge so nothing straddles the taiji seam. */}
        <motion.div
          data-polarity={right}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease }}
          className="taiji-col md:col-span-7 relative"
        >
          {/* Caption only. The stack owns the controls — arrows, dots and
              the drag hint sit together in its row below the cards, so the
              same action isn't offered twice. */}
          <div className="mb-4 flex items-center text-[10px] uppercase tracking-[0.4em] text-on/75 md:justify-end">
            <span>Explore the work</span>
          </div>

          {/* The stack is operated by drag / card click — it is content,
              not empty page, so it opts out of page-wide click-to-swap. */}
          <div data-no-flip className="w-full max-w-md md:ml-auto">
            <AlbumStack compact />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
