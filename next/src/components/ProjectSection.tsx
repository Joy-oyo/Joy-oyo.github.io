"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Project } from "@/content/portfolio";
import { Icons } from "@/lib/icons";

const accentMap = {
  beige: "bg-[#f5efe6] text-ink",
  navy: "bg-klein-dark text-white",
  klein: "bg-klein text-white",
} as const;

export default function ProjectSection({
  project,
  alt,
}: {
  project: Project;
  alt?: boolean;
}) {
  const Icon = Icons[project.icon];
  const CtaIcon = Icons[project.cta.icon];

  return (
    <section
      id={project.id}
      className={clsx(
        "scroll-mt-24 px-5 py-20 md:py-28",
        alt ? "bg-white" : "bg-cream"
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className={clsx(
            "grid items-center gap-10 md:grid-cols-2 md:gap-16",
            project.reverse && "md:[&>:first-child]:order-2"
          )}
        >
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-klein text-white shadow-[0_8px_20px_rgba(0,47,167,0.25)]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-black/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-ink/60">
                  {project.eyebrow}
                </span>
                <h2 className="mt-2 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                  {project.title}
                </h2>
                <p className="mt-1 text-ink/60">{project.subtitle}</p>
              </div>
            </div>

            <p className="mt-6 max-w-prose leading-relaxed text-ink/75">
              {project.body}
            </p>

            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
            >
              <CtaIcon className="h-4 w-4" />
              {project.cta.label}
            </a>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className={clsx(
              "relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.25)]",
              accentMap[project.accent]
            )}
          >
            <div className="absolute inset-0 grain" />
            {/* Big numeral */}
            <div className="absolute -bottom-8 -right-4 font-display text-[18rem] font-bold leading-none opacity-10 select-none">
              {project.index}
            </div>
            {/* Center icon */}
            <div className="absolute inset-0 grid place-items-center">
              <Icon className="h-24 w-24 opacity-30" />
            </div>
            {/* Caption */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-sm font-medium opacity-80">
              <span>{project.eyebrow}</span>
              <span className="rounded-full border border-current/30 px-2 py-0.5 text-xs">
                {project.accent}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
