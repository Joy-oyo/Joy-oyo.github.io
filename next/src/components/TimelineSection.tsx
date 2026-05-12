"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { site, timeline } from "@/content/portfolio";

/**
 * TimelineSection — Home version.
 * Shows current role spotlight + 2 most recent items + CTA to full /about.
 * The complete timeline lives on /about.
 */
export default function TimelineSection() {
  const current = timeline[0];
  const recent = timeline.slice(1, 3);

  return (
    <section className="relative px-6 pt-20 md:pt-28 pb-20 max-w-5xl mx-auto">
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

      {/* Current role — spotlight */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, delay: 0.05 }}
        className="mt-8 glass rounded-3xl p-7 md:p-9 relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-klein/20 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-ink-50/55">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
            Now · {current.period}
          </div>
          <h3 className="display text-3xl md:text-4xl mt-3 text-ink-50 leading-tight">
            {current.role}
          </h3>
          <p className="mt-2 text-sm md:text-base text-ink-50/60">
            {current.org}
            {current.location && (
              <span className="text-ink-50/35"> · {current.location}</span>
            )}
          </p>
        </div>
      </motion.div>

      {/* Recent items */}
      <motion.dl
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-8 divide-y divide-ink-50/8"
      >
        {recent.map((t) => (
          <div
            key={`${t.org}-${t.period}`}
            className="grid grid-cols-[88px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-10 py-5 items-baseline"
          >
            <dt className="text-[11px] uppercase tracking-[0.25em] text-ink-50/40 tabular-nums">
              {t.period}
            </dt>
            <dd className="text-ink-50/85">
              <span className="text-ink-50">{t.role}</span>
              <span className="text-ink-50/40"> · {t.org}</span>
              {t.note && (
                <div className="mt-1 text-xs text-ink-50/40">{t.note}</div>
              )}
            </dd>
          </div>
        ))}
      </motion.dl>

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
          Always up for a good conversation about{" "}
          <span className="italic text-ink-50/80">design, code, or trees.</span>
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
