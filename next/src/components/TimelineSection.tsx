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
import YinYang from "@/components/YinYang";

/**
 * TimelineSection — Home version.
 *
 * Two parallel trajectories, framed as a taiji (yin-yang).
 *   • Industry  (left)  — yang / black panel — "doing"
 *   • Research  (right) — yin  / white panel — "knowing"
 * Both sit on a light-grey "stone" backdrop; a yin-yang glyph rotates
 * slowly at the seam, making the unity-of-opposites motif explicit.
 *
 * The complete unified timeline lives on /about.
 */
export default function TimelineSection() {
  // Clicking the yin-yang glyph at the seam swaps which column is black
  // (yang) and which is white (yin) — Industry and Research literally
  // trade colors, the taiji metaphor made interactive.
  const [flipped, setFlipped] = useState(false);
  const toggleFlipped = () => setFlipped((f) => !f);
  const industryVariant: Variant = flipped ? "yin" : "yang";
  const researchVariant: Variant = flipped ? "yang" : "yin";

  return (
    <section className="relative px-6 pt-10 md:pt-14 pb-6 max-w-6xl mx-auto">
      {/* Section label — sits on the dark page background. */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.7 }}
        className="flex items-baseline justify-between"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-ink-50/50">
          Trajectory · 太极
        </span>
        <Link
          href="/about"
          className="text-[10px] uppercase tracking-[0.3em] text-ink-50/50 hover:text-ink-50 transition-colors"
        >
          Full timeline →
        </Link>
      </motion.div>

      {/* ─── Taiji shell ──────────────────────────────────────────────
          A light-grey "stone" card that hosts both halves. The two
          inner panels (yang/yin) sit flush against one another and
          are visually stitched by the central yin-yang glyph. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9 }}
        className="taiji-surface mt-6 rounded-3xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-black/10 relative"
      >
        {/* Two-track grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 relative">
          {/* ─── Industry (left) — color follows industryVariant ─── */}
          <div className={industryVariant === "yang" ? "taiji-yang p-8 md:p-10" : "taiji-yin p-8 md:p-10"}>
            <Track
              label="Industry"
              eyebrow={industryVariant === "yang" ? "Yang · 阳" : "Yin · 阴"}
              items={industryTrack}
              variant={industryVariant}
              delay={0.05}
              firstItemExtra={<TalksExtra variant={industryVariant} />}
            />
          </div>

          {/* ─── Research (right) — color follows researchVariant ─── */}
          <div className={researchVariant === "yang" ? "taiji-yang p-8 md:p-10" : "taiji-yin p-8 md:p-10"}>
            <Track
              label="Research"
              eyebrow={researchVariant === "yang" ? "Yang · 阳" : "Yin · 阴"}
              items={researchTrack}
              variant={researchVariant}
              delay={0.15}
            />
          </div>

          {/* Faint S-curve seam between the two halves (md+). */}
          <div
            aria-hidden
            className="taiji-divider hidden md:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px pointer-events-none"
          />

          {/* The yin-yang glyph straddling the boundary — desktop.
              Clickable: flips the glyph AND swaps the two panels' colors —
              a purely local, decorative toggle that doesn't touch the
              site-wide theme. */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="rounded-full bg-[var(--stone-soft)] p-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
              <YinYang size={64} interactive flipped={flipped} onToggle={toggleFlipped} />
            </div>
          </div>

          {/* Mobile: render the glyph between the two stacked panels. */}
          <div className="md:hidden flex justify-center -my-6 relative z-10">
            <div className="rounded-full bg-[var(--stone-soft)] p-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] ring-1 ring-black/10">
              <YinYang size={52} interactive flipped={flipped} onToggle={toggleFlipped} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Education — beneath both tracks, on the dark page bg */}
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
            <li key={`${e.school}-${e.period ?? ""}`} className="relative pl-5">
              <span
                aria-hidden
                className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full bg-ink-50/30"
              />
              {e.period && (
                <span className="text-[11px] uppercase tracking-[0.25em] text-ink-50/45 tabular-nums">
                  {e.period}
                </span>
              )}
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

type Variant = "yang" | "yin";

/**
 * Variant tokens — the only place that knows about "dark text on white"
 * vs "light text on black". Everything below pulls from this map so the
 * two columns stay perfectly symmetric in structure (Tao-style).
 */
const variantTokens: Record<
  Variant,
  {
    dot: string;
    glow: string;
    tag: string;
    link: string;
    title: string;
    subtle: string;
    faint: string;
    guide: string;
    detailText: string;
    detailBullet: string;
    button: string;
  }
> = {
  // Industry — black panel, light type
  yang: {
    dot: "bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]",
    glow: "bg-white/10",
    tag: "text-white/80 border-white/30",
    link: "text-white/85 hover:text-white",
    title: "text-white",
    subtle: "text-white/65",
    faint: "text-white/45",
    guide: "bg-white/10",
    detailText: "text-white/65",
    detailBullet: "bg-white/30",
    button: "text-white/55 hover:text-white",
  },
  // Research — white panel, dark type
  yin: {
    dot: "bg-black/85 shadow-[0_0_10px_rgba(0,0,0,0.25)]",
    glow: "bg-black/5",
    tag: "text-black/70 border-black/25",
    link: "text-black/80 hover:text-black",
    title: "text-black",
    subtle: "text-black/65",
    faint: "text-black/45",
    guide: "bg-black/10",
    detailText: "text-black/65",
    detailBullet: "bg-black/30",
    button: "text-black/55 hover:text-black",
  },
};

/**
 * TalksExtra — the References & Speaking sub-list nested under the first
 * Industry entry. Styled via `talkTokens` so it stays legible whichever
 * color the Industry panel currently is (black or white, per `variant`).
 */
const talkTokens: Record<
  Variant,
  {
    border: string;
    dot: string;
    meta: string;
    metaFaint: string;
    title: string;
    titleHover: string;
    underline: string;
    venue: string;
    body: string;
  }
> = {
  yang: {
    border: "border-white/10",
    dot: "bg-white/30",
    meta: "text-white/45",
    metaFaint: "text-white/30",
    title: "text-white",
    titleHover: "hover:text-white",
    underline: "decoration-white/30 hover:decoration-white/70",
    venue: "text-white/65",
    body: "text-white/45",
  },
  yin: {
    border: "border-black/10",
    dot: "bg-black/30",
    meta: "text-black/45",
    metaFaint: "text-black/30",
    title: "text-black",
    titleHover: "hover:text-black",
    underline: "decoration-black/30 hover:decoration-black/70",
    venue: "text-black/65",
    body: "text-black/45",
  },
};

function TalksExtra({ variant }: { variant: Variant }) {
  const tt = talkTokens[variant];
  return (
    <div className={`mt-1 pt-3 border-t border-dashed ${tt.border}`}>
      <ol className="space-y-3">
        {talks.map((t) => (
          <li key={t.id} className="relative pl-3.5">
            <span aria-hidden className={`absolute left-0 top-[7px] w-1 h-1 rounded-full ${tt.dot}`} />
            <span className={`text-[10px] uppercase tracking-[0.25em] tabular-nums ${tt.meta}`}>
              {t.year}
              {t.location && <span className={tt.metaFaint}> · {t.location}</span>}
            </span>
            <p className={`display mt-0.5 text-sm md:text-[15px] leading-snug ${tt.title}`}>
              {t.href ? (
                <a
                  href={t.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`transition-colors underline decoration-dotted underline-offset-4 ${tt.titleHover} ${tt.underline}`}
                >
                  {t.title}
                </a>
              ) : (
                t.title
              )}
            </p>
            <p className={`mt-0.5 text-[12px] ${tt.venue}`}>{t.venue}</p>
            {t.body && (
              <p className={`mt-1 text-[11px] md:text-xs leading-relaxed ${tt.body}`}>{t.body}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Track({
  label,
  eyebrow,
  items,
  variant,
  delay,
  firstItemExtra,
}: {
  label: string;
  eyebrow?: string;
  items: TrackItem[];
  variant: Variant;
  delay: number;
  firstItemExtra?: React.ReactNode;
}) {
  const tokens = variantTokens[variant];

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
          <h3 className={`display text-xl md:text-2xl ${tokens.title}`}>{label}</h3>
        </div>
        {eyebrow && (
          <span className={`text-[10px] uppercase tracking-[0.3em] ${tokens.faint}`}>
            {eyebrow}
          </span>
        )}
      </div>

      {/* Items */}
      <ol className="relative space-y-5">
        {/* Subtle vertical guide inside the column */}
        <div
          aria-hidden
          className={`absolute left-0 top-2 bottom-2 w-px ${tokens.guide}`}
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
  tokens: (typeof variantTokens)[Variant];
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
          t.current ? tokens.dot : tokens.guide
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
          {/* Top meta row — period (if any) + Now tag. */}
          {(t.period || t.current) && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {t.period && (
                <span className={`text-[11px] uppercase tracking-[0.25em] tabular-nums ${tokens.faint}`}>
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
            className={`display text-lg md:text-xl leading-tight ${tokens.title} ${
              t.period || t.current ? "mt-1.5" : ""
            }`}
          >
            {t.title}
          </h4>
          {/* Subtitle + location */}
          {(t.subtitle || t.location) && (
            <p className={`mt-0.5 text-sm ${tokens.subtle}`}>
              {t.subtitle}
              {t.subtitle && t.location && (
                <span className={tokens.faint}> · {t.location}</span>
              )}
              {!t.subtitle && t.location && (
                <span className={tokens.faint}>{t.location}</span>
              )}
            </p>
          )}
          {t.note && (
            <p className={`mt-1.5 text-xs md:text-[13px] leading-relaxed ${tokens.faint}`}>
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
                className={`mt-2.5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] transition-colors ${tokens.button}`}
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
                              className={`relative pl-3 text-[13px] leading-relaxed ${tokens.detailText}`}
                            >
                              <span
                                aria-hidden
                                className={`absolute left-0 top-[9px] w-1 h-px ${tokens.detailBullet}`}
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
