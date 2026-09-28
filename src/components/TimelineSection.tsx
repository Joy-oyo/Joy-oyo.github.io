"use client";

import { useEffect, useId, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import {
  industryTrack,
  researchTrack,
  education,
  talks,
  type TrackItem,
} from "@/content/timeline";
import { story, currentlyThinking, elsewhere, toolkit } from "@/content/about";
import { useTaiji } from "@/components/TaijiHome";

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
 *
 * The About block (story, currently-thinking, off-the-clock, toolkit)
 * lives further down this same section — no separate /about page.
 */
export default function TimelineSection() {
  // The flip is owned by TaijiHome (its switch lives in the site header);
  // outside the provider the panels simply keep their base assignment.
  const taiji = useTaiji();
  const flipped = taiji?.flipped ?? false;
  const industryVariant: Variant = flipped ? "yin" : "yang";
  const researchVariant: Variant = flipped ? "yang" : "yin";
  const reduceMotion = useReducedMotion();

  // Education and About both sit as folded drawers under the taiji card —
  // they're context, not headline.
  const [eduOpen, setEduOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  // Deep links (the nav's /#about, or an in-page jump) should reveal the
  // folded About drawer rather than scrolling to a closed header.
  useEffect(() => {
    const openIfHashed = () => {
      if (window.location.hash === "#about") setAboutOpen(true);
    };
    openIfHashed();
    window.addEventListener("hashchange", openIfHashed);
    return () => window.removeEventListener("hashchange", openIfHashed);
  }, []);

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
        {/* Each end of the row takes the polarity of the page half it
            sits over, so the labels never cross the seam unstyled. */}
        <span
          data-polarity={industryVariant}
          className="text-[10px] uppercase tracking-[0.4em] text-on/60"
        >
          Trajectory · 太极
        </span>
        <Link
          data-polarity={researchVariant}
          href="#about"
          onClick={() => setAboutOpen(true)}
          className="text-[10px] uppercase tracking-[0.3em] text-on/60 hover:text-on transition-colors"
        >
          More about me ↓
        </Link>
      </motion.div>

      <div className="taiji-pair mt-6">
          <div data-polarity={industryVariant} className="taiji-panel taiji-panel-industry">
            <Track
              label="Industry"
              eyebrow={industryVariant === "yang" ? "Yang · 阳" : "Yin · 阴"}
              items={industryTrack}
              seedTitle="FinTech4Good"
              seedLabel="Research in practice"
              seedPolarity={researchVariant}
              firstItemExtra={<TalksExtra />}
            />
          </div>

          <div data-polarity={researchVariant} className="taiji-panel taiji-panel-research">
            <Track
              label="Research & Projects"
              eyebrow={researchVariant === "yang" ? "Yang · 阳" : "Yin · 阴"}
              items={researchTrack}
              seedTitle="Find the Gate"
              seedLabel="Practice in research"
              seedPolarity={industryVariant}
            />
          </div>
      </div>

      {/* Education — folded drawer under the two tracks */}
      <FoldPanel
        title="Education"
        dotClass="bg-amber-300/80 shadow-[0_0_10px_rgba(252,211,77,0.6)]"
        open={eduOpen}
        onToggle={() => setEduOpen((v) => !v)}
        className="mt-12 md:mt-16"
      >
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
      </FoldPanel>

      {/* About — a second folded drawer, stacked right under Education */}
      <FoldPanel
        id="about"
        title="About"
        dotClass="bg-sky-300/80 shadow-[0_0_10px_rgba(125,211,252,0.6)]"
        open={aboutOpen}
        onToggle={() => setAboutOpen((v) => !v)}
        className="mt-3 md:mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {/* How I got here */}
          <div className="md:col-span-2 max-w-3xl">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40 mb-4">
              How I got here
            </h4>
            <div className="space-y-4 text-sm md:text-[15px] text-ink-50/70 leading-relaxed">
              {story.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* What I'm thinking about */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40 mb-4">
              What I&rsquo;m thinking about
            </h4>
            <div className="space-y-6">
              {currentlyThinking.map((c, i) => (
                <div key={i}>
                  <h5 className="display text-base md:text-lg text-ink-50 leading-snug">
                    {c.title}
                  </h5>
                  <p className="mt-2 text-sm text-ink-50/60 leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Off the clock + toolkit */}
          <div className="space-y-10">
            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40 mb-4">
                Off the clock
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {elsewhere.map((e) => (
                  <div key={e.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-50/35">
                      {e.label}
                    </dt>
                    <dd className="mt-1 text-sm text-ink-50/70 leading-relaxed">
                      {e.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40 mb-4">
                What I reach for
              </h4>
              <div className="space-y-4">
                {toolkit.map((group) => (
                  <div key={group.group}>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-50/35">
                      {group.group}
                    </span>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((s) => (
                        <li
                          key={s}
                          className="glass rounded-full px-3 py-1 text-[11px] tracking-wide text-ink-50/80"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FoldPanel>
    </section>
  );
}

/* ---------- Folded drawer (Education, About) ---------- */

/**
 * FoldPanel — a collapsed section header that expands in place.
 * Used for the two "context" blocks that hang below the taiji pair
 * (Education, About) so the trajectory stays the visual headline.
 * Each fold is a self-surfaced dark (yang) band, so it reads
 * intentionally over either assignment of the page's halves.
 */
function FoldPanel({
  id,
  title,
  dotClass,
  open,
  onToggle,
  className = "",
  children,
}: {
  id?: string;
  title: string;
  dotClass: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      id={id}
      data-polarity="yang"
      initial={{ y: 12 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay: 0.05 }}
      className={`taiji-fold scroll-mt-28 ${className}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group w-full flex items-baseline justify-between gap-4 rounded-2xl px-4 py-3.5 ring-1 ring-ink-50/10 hover:ring-ink-50/20 transition-colors text-left"
      >
        <span className="flex items-center gap-2.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
          <span className="display text-xl md:text-2xl text-ink-50">{title}</span>
        </span>
        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-ink-50/40 group-hover:text-ink-50/70 transition-colors">
          <span>{open ? "Less" : "More"}</span>
          <span
            aria-hidden
            className={`transition-transform duration-300 ${open ? "rotate-90" : ""}`}
          >
            →
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="fold-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-6 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
function TalksExtra() {
  return (
    <div className="mt-1 pt-3 border-t border-dashed border-on/10">
      <ol className="space-y-3">
        {talks.map((t) => (
          <li key={t.id} className="relative pl-3.5">
            <span aria-hidden className="absolute left-0 top-[7px] w-1 h-1 rounded-full bg-on/30" />
            <span className="text-[10px] uppercase tracking-[0.25em] tabular-nums text-on2">
              {t.year}
              {t.location && <span className="text-on4"> · {t.location}</span>}
            </span>
            <p className="display mt-0.5 text-sm md:text-[15px] leading-snug text-on">
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
              <p className="mt-1 text-[11px] md:text-xs leading-relaxed text-on2">{t.body}</p>
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
  seedTitle,
  seedLabel,
  seedPolarity,
  firstItemExtra,
}: {
  label: string;
  eyebrow: string;
  items: TrackItem[];
  seedTitle: string;
  seedLabel: string;
  seedPolarity: Variant;
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
            seed={t.title === seedTitle ? { label: seedLabel, polarity: seedPolarity } : undefined}
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
  seed?: { label: string; polarity: Variant };
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
          {seed && (
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
                        <ul className="mt-3 space-y-1">
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
