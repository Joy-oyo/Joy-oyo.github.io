"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  industryTrack,
  researchTrack,
  education,
  talks,
  type TrackItem,
} from "@/content/timeline";
import { useTaiji } from "@/components/TaijiHome";
import Footer from "@/components/Footer";

/**
 * TimelineSection — Home version.
 *
 * Two parallel trajectories laid directly over the page-wide taiji
 * (see TaijiHome):
 *   • Industry  (left)  — yang / black half — "doing"
 *   • Research  (right) — yin  / white half — "knowing"
 * The panels carry no surface of their own on desktop; the fixed page
 * split shows through, so this section IS the same taiji as the hero
 * above it. The swap control lives in the site header and trades the
 * halves of the whole page — hero, trajectory, nav bar — at once.
 * (Below md the page split is hidden, so each panel falls back to its
 * own fill and the flip only recolors this section's cards.)
 */
export default function TimelineSection() {
  // The flip is owned by TaijiHome (its switch lives in the site header);
  // outside the provider the panels simply keep their base assignment.
  const taiji = useTaiji();
  const flipped = taiji?.flipped ?? false;
  const industryVariant: Variant = flipped ? "yin" : "yang";
  const researchVariant: Variant = flipped ? "yang" : "yin";
  const reduceMotion = useReducedMotion();

  return (
    <section id="trajectory" className="relative px-6 pt-10 md:pt-14 pb-6 max-w-6xl mx-auto">
      {/* Section label — sits on the dark page background. */}
      {/* Reveal moves transform only — content never starts invisible,
          so off-screen renders (full-page capture, print) get real content. */}
      <motion.div
        initial={{ y: reduceMotion ? 0 : 14 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: reduceMotion ? 0 : 0.7 }}
        className="flex items-baseline justify-between"
      >
        <span
          data-polarity={industryVariant}
          className="text-[10px] uppercase tracking-[0.4em] text-on/60"
        >
          Trajectory · 太极
        </span>
      </motion.div>

      <div className="taiji-pair mt-6">
          <div data-polarity={industryVariant} className="taiji-panel taiji-panel-industry">
            <Track
              label="Industry"
              eyebrow={industryVariant === "yang" ? "Yang · 阳" : "Yin · 阴"}
              items={industryTrack}
              cardPolarity={researchVariant}
              // No card entries on this side — the conference talks under the
              // Tencent chapter carry the card treatment instead.
              firstItemExtra={<TalksExtra polarity={researchVariant} />}
            />
          </div>

          <div data-polarity={researchVariant} className="taiji-panel taiji-panel-research">
            <Track
              label="Research & Projects"
              eyebrow={researchVariant === "yang" ? "Yang · 阳" : "Yin · 阴"}
              items={researchTrack}
              cardPolarity={industryVariant}
            />
          </div>
      </div>

      {/* Closing pair — Education on the left, the site footer on the right,
          both as expanded cards. Each takes the opposite polarity to the
          half it sits in: another seed of the other side. */}
      <div className="taiji-pair taiji-pair-closing mt-10 md:mt-14">
        <div data-polarity={industryVariant} className="taiji-panel taiji-panel-industry">
          <EducationCard polarity={researchVariant} />
        </div>

        <div data-polarity={researchVariant} className="taiji-panel taiji-panel-research">
          <Footer polarity={industryVariant} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Education card (left half) ---------- */

/**
 * EducationCard — the left half's closing card, always expanded: short
 * enough to show in full, and it balances the footer card opposite it.
 * Carries the opposite polarity to the half it sits in, like every other
 * seed card on the page, and reads through the `on` tokens so it stays
 * legible in either assignment.
 */
function EducationCard({ polarity }: { polarity: Variant }) {
  return (
    <div data-polarity={polarity} className="taiji-seed">
      {/* The dot is taken out of flow so the word itself sits on the card's
          centre line rather than centre-minus-the-dot. */}
      <div className="relative mb-5 flex items-center justify-center">
        <span
          aria-hidden
          className="absolute left-0 h-1.5 w-1.5 rounded-full bg-amber-300/80 shadow-[0_0_10px_rgba(252,211,77,0.6)]"
        />
        <h3 className="display text-center text-xl leading-tight text-on md:text-2xl">Education</h3>
      </div>

      <ol className="space-y-6">
        {education.map((e) => (
          <li key={`${e.school}-${e.period ?? ""}`} className="relative pl-5">
            <span
              aria-hidden
              className="absolute left-0 top-[7px] h-1.5 w-1.5 rounded-full bg-on/30"
            />
            {e.period && (
              <span className="text-[11px] uppercase tabular-nums tracking-[0.25em] text-on2">
                {e.period}
              </span>
            )}
            <h4 className="display mt-1.5 text-lg leading-tight text-on md:text-xl">
              {e.school}
            </h4>
            <p className="mt-1 text-sm text-on3 md:text-[15px]">
              {e.degree}
              {e.location && <span className="text-on4"> · {e.location}</span>}
            </p>
            {e.note && (
              <p className="mt-2 text-xs leading-relaxed text-on4 md:text-sm">{e.note}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Track column ---------- */

type Variant = "yang" | "yin";

/**
 * Polarity is inherited, not prop-drilled. The column wrappers above set
 * `data-polarity`, and every on-surface value below resolves through the
 * `surface`/`on` palette to the CSS variables that attribute defines.
 * Text steps: `text-on` (headline) → `text-on2` (labels/meta) →
 * `text-on3` (body) → `text-on4` (faint); all ≥ WCAG AA on both surfaces.
 * Non-text marks (guides, bullets, dashed rules) use /alpha modifiers.
 */
/**
 * Conference talks — each one is a seed card (`.taiji-seed`) carrying the
 * opposite polarity, so speaking reads as the industry half's "seed" rather
 * than another line in a list. This is the card treatment that used to sit
 * on the Fintech Startup entry.
 */
function TalksExtra({ polarity }: { polarity: Variant }) {
  return (
    <ol className="mt-3 space-y-3 border-t border-dashed border-on/10 pt-3">
      {talks.map((t) => (
        <li key={t.id}>
          <div data-polarity={polarity} className="taiji-seed">
            <span className="text-[10px] uppercase tracking-[0.25em] tabular-nums text-on2">
              {t.year}
              {t.location && <span className="text-on4"> · {t.location}</span>}
            </span>
            <p className="display mt-1 text-sm leading-snug text-on md:text-[15px]">
              {t.href ? (
                <a
                  href={t.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors underline decoration-dotted underline-offset-4 decoration-on/30 hover:decoration-on/70"
                >
                  {t.title}
                </a>
              ) : (
                t.title
              )}
            </p>
            <p className="mt-0.5 text-[12px] text-on3">{t.venue}</p>
            {t.body && (
              <p className="mt-1.5 text-[11px] leading-relaxed text-on2 md:text-xs">{t.body}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Track({
  label,
  eyebrow,
  items,
  cardPolarity,
  firstItemExtra,
}: {
  label: string;
  eyebrow: string;
  items: TrackItem[];
  /** Polarity a `card` entry takes — normally the opposite half's. */
  cardPolarity: Variant;
  firstItemExtra?: React.ReactNode;
}) {
  return (
    <div className="taiji-track">
      {/* Same typographic step as the section's "Trajectory · 太极" row —
          10px, wide-tracked, faint — but on the panel's own `on4` step
          (AA on both surfaces) instead of an alpha, and centred over the
          track it labels. */}
      <div className="mb-7">
        <p className="mb-2 text-center text-[10px] uppercase tracking-[0.4em] text-on4">
          {eyebrow}
        </p>
        <div className="flex items-center justify-center gap-2.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-on/80" />
          <h3 className="display text-xl md:text-2xl text-on">{label}</h3>
        </div>
      </div>

      <ol className="taiji-entries">
        {items.map((t, i) => (
          <TrackEntry
            key={`${t.title}-${t.period ?? i}`}
            item={t}
            spotlightGlow={i === 0 && !!t.current}
            extra={i === 0 ? firstItemExtra : undefined}
            seed={t.card ? { label: t.cardLabel, polarity: cardPolarity } : undefined}
          />
        ))}
      </ol>
    </div>
  );
}

/* ---------- Single entry (expandable) ---------- */

function TrackEntry({
  item: t,
  spotlightGlow,
  extra,
  seed,
}: {
  item: TrackItem;
  spotlightGlow: boolean;
  extra?: React.ReactNode;
  seed?: { label?: string; polarity: Variant };
}) {
  const hasDetails = (t.highlights && t.highlights.length > 0) || (t.links && t.links.length > 0);
  const [open, setOpen] = useState(Boolean(seed && !t.highlights?.length));
  const detailsId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <li className="relative pl-5 group">
      {/* Bullet on the guide */}
      <span
        aria-hidden
        className={`absolute left-[-3px] top-[7px] w-1.5 h-1.5 rounded-full ${
          t.current ? "bg-on/80 shadow-[0_0_10px_var(--glow)]" : "bg-on/10"
        }`}
      />

      <div data-polarity={seed?.polarity} className={seed ? "taiji-seed relative" : "relative"}>
        {spotlightGlow && (
          <div
            aria-hidden
            className="absolute -top-8 -left-4 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-on/10"
          />
        )}

        <div className="relative">
          {seed?.label && (
            <p className="mb-3 flex items-center gap-2 text-[11px] leading-relaxed tracking-wide text-on2">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-on" />
              {seed.label}
            </p>
          )}
          {/* Top meta row — period (if any) + Now tag. */}
          {(t.period || t.current) && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {t.period && (
                <span className="text-[11px] uppercase tracking-[0.25em] tabular-nums text-on2">
                  {t.period}
                </span>
              )}
              {t.current && (
                <span className="text-[9px] uppercase tracking-[0.3em] px-1.5 py-0.5 rounded-full border text-on/80 border-on/40">
                  Now
                </span>
              )}
            </div>
          )}

          {/* Primary title — bigger, display font */}
          <h4
            className={`display text-lg md:text-xl leading-tight text-on ${
              t.period || t.current ? "mt-1.5" : ""
            }`}
          >
            {t.title}
          </h4>
          {/* Subtitle + location */}
          {(t.subtitle || t.location) && (
            <p className="mt-0.5 text-sm text-on3">
              {t.subtitle}
              {t.subtitle && t.location && (
                <span className="text-on2"> · {t.location}</span>
              )}
              {!t.subtitle && t.location && (
                <span className="text-on2">{t.location}</span>
              )}
            </p>
          )}
          {t.note && (
            <p className="mt-1.5 text-xs md:text-[13px] leading-relaxed text-on2">
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
                aria-controls={detailsId}
                aria-label={`${open ? "Hide" : "Show"} details for ${t.title}`}
                className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded px-1 text-[11px] uppercase tracking-[0.2em] transition-colors text-on2 hover:text-on"
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
                    id={detailsId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      {t.highlights && t.highlights.length > 0 && (
                        <ul className="space-y-1.5">
                          {t.highlights.map((h, hi) => (
                            <li
                              key={hi}
                              className="relative pl-3 text-[13px] leading-relaxed text-on3"
                            >
                              <span
                                aria-hidden
                                className="absolute left-0 top-[9px] w-1 h-px bg-on/30"
                              />
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}

                      {t.links && t.links.length > 0 && (
                        // One wrapping row: short exits belong side by side,
                        // longer ones fall to their own line.
                        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
                          {t.links.map((l) => (
                            <li key={l.href}>
                              <a
                                href={l.href}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-baseline gap-1.5 text-[12px] leading-snug transition-colors text-on/85 hover:text-on"
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
