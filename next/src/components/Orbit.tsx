"use client";

import { motion } from "framer-motion";
import { modules, site } from "@/content/portfolio";
import { Icons } from "@/lib/icons";
import clsx from "clsx";

export default function Orbit() {
  const RADIUS = 200; // base radius in px
  const SIZE = RADIUS * 2 + 200; // viewbox-ish size

  return (
    <section className="relative px-5 py-24">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-block rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">
          Universe
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
          Portfolio Journey
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink/60">
          Navigate through my creative and professional endeavors.
        </p>
      </div>

      <div className="relative mx-auto mt-16 hidden md:block" style={{ width: SIZE, height: SIZE }}>
        {/* Orbit rings */}
        <div className="absolute inset-0 grid place-items-center">
          {[1, 0.7, 0.4].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-dashed border-klein/15"
              style={{ width: RADIUS * 2 * s, height: RADIUS * 2 * s }}
            />
          ))}
        </div>

        {/* Central hub */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-klein to-klein-dark text-2xl font-display font-bold text-white shadow-[0_20px_50px_rgba(0,47,167,0.4)]"
        >
          <span className="relative">{site.initials}</span>
          <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl" />
        </motion.div>

        {/* Modules */}
        {modules.map((m, i) => {
          const rad = (m.angle * Math.PI) / 180;
          const x = Math.cos(rad) * RADIUS * m.radius;
          const y = Math.sin(rad) * RADIUS * m.radius;
          const Icon = Icons[m.icon];
          const Card: any = m.empty ? "div" : "a";
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <Card
                {...(m.empty ? {} : { href: m.href, target: "_blank", rel: "noopener" })}
                className={clsx(
                  "group flex w-44 flex-col items-center gap-3 rounded-2xl border border-black/5 bg-white/90 p-5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur transition-all",
                  m.empty
                    ? "opacity-50"
                    : "cursor-pointer hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,47,167,0.18)]"
                )}
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-klein/10 text-klein transition-colors group-hover:bg-klein group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold text-ink">{m.title}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile fallback grid */}
      <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-3 md:hidden">
        {modules.map((m) => {
          const Icon = Icons[m.icon];
          const Card: any = m.empty ? "div" : "a";
          return (
            <Card
              key={m.id}
              {...(m.empty ? {} : { href: m.href, target: "_blank", rel: "noopener" })}
              className={clsx(
                "flex flex-col items-center gap-2 rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm",
                m.empty && "opacity-50"
              )}
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-klein/10 text-klein">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-semibold text-ink">{m.title}</div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
