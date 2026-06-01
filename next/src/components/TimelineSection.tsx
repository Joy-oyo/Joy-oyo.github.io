"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  site,
  industryTrack,
  researchTrack,
  education,
  talks,
  type TrackItem,
} from "@/content/portfolio";

/**
 * TimelineSection — Home version.
 * Two parallel trajectories side-by-side: Industry (left) and Research (right).
 * The complete unified timeline lives on /about.
 */
export default function TimelineSection() {
  return (
    <section className="relative px-6 pt-10 md:pt-14 pb-6 max-w-6xl mx-auto">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7 }}
        className="flex items-baseline justify-between"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-ink-50/50">
          Trajectory
        </span>
        <Link
          href="/about"
          className="text-[10px] uppercase tracking-[0.3em] text-ink-50/50 hover:text-ink-50 transition-colors"
        >
          Full timeline →
        </Link>
      </motion.div>

      {/* Two-track grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 relative">
        {/* Vertical divider (md+) */}
        <div
          aria-hidden
          className="hidden md:block absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-ink-50/15 to-transparent"
        />

        <Track
          label="Industry"
          items={industryTrack}
          accent="emerald"
          delay={0.05}
          firstItemExtra={
            // Talks belong to the Tencent chapter — render them as a
            // subsection nested inside the Tencent entry itself.
            <div className="mt-1 pt-3 border-t border-dashed border-ink-50/10">
              <ol className="space-y-3">
                {talks.map((t) => (
                  <li key={t.id} className="relative pl-3.5">
                    <span
                      aria-hidden
                      className="absolute left-0 top-[7px] w-1 h-1 rounded-full bg-ink-50/30"
                    />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-ink-50/45 tabular-nums">
                      {t.year}
                      {t.location && (
                        <span className="text-ink-50/30"> · {t.location}</span>
                      )}
                    </span>
                    <p className="display mt-0.5 text-sm md:text-[15px] text-ink-50 leading-snug">
                      {t.href ? (
                        <a
                          href={t.href}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-white transition-colors underline decoration-dotted underline-offset-4 decoration-ink-50/30 hover:decoration-ink-50/70"
                        >
                          {t.title}
                        </a>
                      ) : (
                        t.title
                      )}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink-50/65">
                      {t.venue}
                    </p>
                    {t.body && (
                      <p className="mt-1 text-[11px] md:text-xs text-ink-50/45 leading-relaxed">
                        {t.body}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          }
        />
        <Track
          label="Research"
          items={researchTrack}
          accent="klein"
          delay={0.15}
        />
      </div>

      {/* Education — beneath both tracks */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, delay: 0.05 }}
        className="mt-16 md:mt-20 pt-10 border-t border-ink-50/10"
      >
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-300/80 shadow-[0_0_10px_rgba(252,211,77,0.6)]" />
            <h3 className="display text-xl md:text-2xl text-ink-50">Education</h3>
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-ink-50/35">
            03 / Study
          </span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          {education.map((e) => (
            <li key={`${e.school}-${e.period}`} className="relative pl-5">
              <span
                aria-hidden
                className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full bg-ink-50/30"
              />
              <span className="text-[11px] uppercase tracking-[0.25em] text-ink-50/45 tabular-nums">
                {e.period}
              </span>
              <h4 className="display mt-1.5 text-xl md:text-2xl text-ink-50 leading-tight">
                {e.school}
              </h4>
              <p className="mt-1 text-sm md:text-[15px] text-ink-50/70">
                {e.degree}
                {e.location && (
                  <span className="text-ink-50/30"> · {e.location}</span>
                )}
              </p>
              {e.note && (
                <p className="mt-2 text-xs md:text-sm text-ink-50/45 leading-relaxed">
                  {e.note}
                </p>
              )}
            </li>
          ))}
        </ol>
      </motion.div>

      {/* Get in touch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="mt-24 md:mt-32 pt-12 border-t border-ink-50/10"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-ink-50/50">
          Get in touch
        </span>
        <p className="display text-3xl md:text-5xl mt-5 text-gradient leading-tight max-w-2xl">
          Let&rsquo;s <span className="italic text-ink-50/80">talk about trees.</span>
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-ink-50 text-ink-950 px-5 py-2.5 font-medium hover:bg-white transition-colors"
          >
            {site.email}
            <span aria-hidden>→</span>
          </a>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-50/55">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-ink-50 transition-colors"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- Track column ---------- */

type Accent = "emerald" | "klein";

const accentTokens: Record<
  Accent,
  { dot: string; glow: string; tag: string; link: string }
> = {
  emerald: {
    dot: "bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.7)]",
    glow: "bg-emerald-400/15",
    tag: "text-emerald-300/80 border-emerald-300/30",
    link: "text-emerald-300/85 hover:text-emerald-200",
  },
  klein: {
    dot: "bg-klein/90 shadow-[0_0_10px_rgba(0,47,167,0.8)]",
    glow: "bg-klein/25",
    tag: "text-klein-200 border-klein/40",
    link: "text-klein-200 hover:text-white",
  },
};

function Track({
  label,
  eyebrow,
  items,
  accent,
  delay,
  firstItemExtra,
}: {
  label: string;
  eyebrow?: string;
  items: TrackItem[];
  accent: Accent;
  delay: number;
  firstItemExtra?: React.ReactNode;
}) {
  const tokens = accentTokens[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay }}
      className="relative"
    >
      {/* Column header */}
      <div className="flex items-baseline justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${tokens.dot}`} />
          <h3 className="display text-xl md:text-2xl text-ink-50">{label}</h3>
        </div>
        {eyebrow && (
          <span className="text-[10px] uppercase tracking-[0.3em] text-ink-50/35">
            {eyebrow}
          </span>
        )}
      </div>

      {/* Items */}
      <ol className="relative space-y-5">
        {/* Subtle vertical guide inside the column */}
        <div
          aria-hidden
          className="absolute left-0 top-2 bottom-2 w-px bg-ink-50/8"
        />

        {items.map((t, i) => (
          <TrackEntry
            key={`${t.title}-${t.period ?? i}`}
            item={t}
            tokens={tokens}
            spotlightGlow={i === 0 && !!t.current}
            extra={i === 0 ? firstItemExtra : undefined}
          />
        ))}
      </ol>
    </motion.div>
  );
}

/* ---------- Single entry (expandable) ---------- */

function TrackEntry({
  item: t,
  tokens,
  spotlightGlow,
  extra,
}: {
  item: TrackItem;
  tokens: (typeof accentTokens)[Accent];
  spotlightGlow: boolean;
  extra?: React.ReactNode;
}) {
  const hasDetails = (t.highlights && t.highlights.length > 0) || (t.links && t.links.length > 0);
  const [open, setOpen] = useState(false);

  return (
    <li className="relative pl-5 group">
      {/* Bullet on the guide */}
      <span
        aria-hidden
        className={`absolute left-[-3px] top-[7px] w-1.5 h-1.5 rounded-full ${
          t.current ? tokens.dot : "bg-ink-50/30"
        }`}
      />

      <div className="relative">
        {spotlightGlow && (
          <div
            aria-hidden
            className={`absolute -top-8 -left-4 w-32 h-32 rounded-full blur-3xl pointer-events-none ${tokens.glow}`}
          />
        )}

        <div className="relative">
          {/* Top meta row — period (if any) + Now tag. Hidden entirely when nothing to show. */}
          {(t.period || t.current) && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {t.period && (
                <span className="text-[11px] uppercase tracking-[0.25em] text-ink-50/45 tabular-nums">
                  {t.period}
                </span>
              )}
              {t.current && (
                <span
                  className={`text-[9px] uppercase tracking-[0.3em] px-1.5 py-0.5 rounded-full border ${tokens.tag}`}
                >
                  Now
                </span>
              )}
            </div>
          )}

          {/* Primary title — bigger, display font */}
          <h4
            className={`display text-lg md:text-xl text-ink-50 leading-tight ${
              t.period || t.current ? "mt-1.5" : ""
            }`}
          >
            {t.title}
          </h4>
          {/* Subtitle + location */}
          {(t.subtitle || t.location) && (
            <p className="mt-0.5 text-sm text-ink-50/65">
              {t.subtitle}
              {t.subtitle && t.location && (
                <span className="text-ink-50/35"> · {t.location}</span>
              )}
              {!t.subtitle && t.location && (
                <span className="text-ink-50/35">{t.location}</span>
              )}
            </p>
          )}
          {t.note && (
            <p className="mt-1.5 text-xs md:text-[13px] text-ink-50/45 leading-relaxed">
              {t.note}
            </p>
          )}

          {/* Details toggle */}
          {hasDetails && (
            <>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-ink-50/45 hover:text-ink-50 transition-colors"
              >
                <span>{open ? "Less" : "More"}</span>
                <span
                  aria-hidden
                  className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}
                >
                  →
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      {t.highlights && t.highlights.length > 0 && (
                        <ul className="space-y-1.5">
                          {t.highlights.map((h, hi) => (
                            <li
                              key={hi}
                              className="relative pl-3 text-[13px] text-ink-50/65 leading-relaxed"
                            >
                              <span
                                aria-hidden
                                className="absolute left-0 top-[9px] w-1 h-px bg-ink-50/30"
                              />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      {t.links && t.links.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {t.links.map((l) => (
                            <li key={l.href}>
                              <a
                                href={l.href}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-baseline gap-1.5 text-[12px] leading-snug transition-colors ${tokens.link}`}
                              >
                                <span aria-hidden className="opacity-70">↗</span>
                                <span className="underline decoration-dotted underline-offset-4">
                                  {l.label}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Per-entry extra slot — used to nest References & Speaking
              directly under the Tencent chapter as a subsection. */}
          {extra}
        </div>
      </div>
    </li>
  );
}
