import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import CopyBlock from "@/components/demos/CopyBlock";
import FigureFrame from "@/components/demos/FigureFrame";
import LabSection from "@/components/demos/LabSection";
import SectionNav from "@/components/demos/SectionNav";
import { demoLab, demoProjects, type DemoProject } from "@/content/portfolio";

export const metadata = {
  title: "Demo Lab",
  description: demoLab.tagline,
};

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

/** Faint graph paper, shared with FigureFrame so empty slots match. */
const GRID =
  "[background-image:linear-gradient(to_right,rgba(245,245,240,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,245,240,0.6)_1px,transparent_1px)] [background-size:34px_34px]";

/** Shipping work reads before speculative work. */
const STATUS_RANK: Record<DemoProject["status"], number> = {
  Available: 0,
  "In progress": 1,
  Planned: 2,
};

export default function DemosPage() {
  return (
    <>
      <main id="main" className="relative pb-28 pt-32">
        <Hero />

        <SectionNav sections={demoLab.sections} />

        {/* Teaser — the four-up baseline comparison, before any prose. */}
        <div className="mx-auto mt-14 max-w-4xl px-6">
          <FigureFrame figure={demoLab.teaser} />
        </div>

        <LabSection id="abstract" index="01 / Abstract" title="Abstract">
          <div className="space-y-5 text-[15px] leading-[1.85] text-ink-50/75 md:text-base">
            {demoLab.abstract.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {demoLab.abstractStats.map((stat) => (
              <div
                key={stat.label}
                className="glass glass-sheen rounded-2xl px-5 py-5"
              >
                <dd className="display text-3xl leading-none text-ink-50">{stat.value}</dd>
                <dt className="mt-3 text-[10px] uppercase tracking-[0.2em] text-ink-50/50">
                  {stat.label}
                </dt>
                {stat.note && (
                  <p className="mt-2 text-[11px] leading-snug text-ink-50/35">{stat.note}</p>
                )}
              </div>
            ))}
          </dl>
        </LabSection>

        <LabSection
          id="demos"
          index="02 / Gallery"
          title="Online demos and recorded builds"
          lede={demoLab.gallery.lede}
        >
          <div className="space-y-16">
            {demoLab.gallery.groups.map((group) => {
              const projects = demoProjects
                .filter((project) => project.format === group.format)
                .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);

              if (projects.length === 0) return null;

              return (
                <div key={group.id} id={group.id} className="scroll-mt-28">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="display text-xl text-ink-50 md:text-2xl">
                      {group.title}
                      <span className="ml-3 font-mono text-xs tracking-widest text-ink-50/35">
                        ×{projects.length}
                      </span>
                    </h3>
                    <p className="max-w-md text-xs leading-relaxed text-ink-50/45">
                      {group.note}
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {projects.map((project, i) => (
                      <DemoCard
                        key={project.id}
                        project={project}
                        counter={`${group.counterLabel} ${String(i + 1).padStart(2, "0")}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </LabSection>

        <LabSection
          id="motivation"
          index="03 / Motivation"
          title="Why these constraints"
          lede={demoLab.motivation.lede}
        >
          <FigureFrame figure={demoLab.motivation.figure} />

          <div className="mt-12 space-y-12">
            {demoLab.motivation.bottlenecks.map((item) => (
              <div key={item.n}>
                <h3 className="flex items-baseline gap-3 text-lg leading-snug text-ink-50 md:text-xl">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-ink-50/35">
                    {item.n}
                  </span>
                  <span className="display">{item.title}</span>
                </h3>

                <p className="mt-3 pl-0 text-[15px] leading-[1.8] text-ink-50/70 sm:pl-9 md:text-base">
                  {item.body}
                </p>

                {"reference" in item && item.reference && (
                  <p className="mt-4 border-l-2 border-klein/50 pl-4 text-[13px] leading-relaxed text-ink-50/50 sm:ml-9">
                    {item.reference}
                  </p>
                )}

                {"figure" in item && item.figure && (
                  <FigureFrame figure={item.figure} className="mt-6 sm:ml-9" />
                )}
              </div>
            ))}
          </div>
        </LabSection>

        <LabSection
          id="method"
          index="04 / Method"
          title="One pipeline, two exits"
          lede={demoLab.method.lede}
        >
          <FigureFrame figure={demoLab.method.figure} />

          <ol className="mt-12 space-y-3">
            {demoLab.method.stages.map((stage) => (
              <li
                key={stage.n}
                className="glass glass-sheen rounded-2xl px-5 py-6 md:px-7"
              >
                <h3 className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-ink-50/35">
                    {stage.n}
                  </span>
                  <span className="display text-lg leading-snug text-ink-50 md:text-xl">
                    {stage.title}
                  </span>
                </h3>
                <p className="mt-3 text-[15px] leading-[1.8] text-ink-50/70 sm:pl-9">
                  {stage.body}
                </p>
              </li>
            ))}
          </ol>
        </LabSection>

        <LabSection
          id="results"
          index="05 / Results"
          title="The contract, measured"
          lede={demoLab.results.lede}
        >
          <div className="glass-card glass-sheen overflow-hidden rounded-[1.5rem]">
            <div className="no-scrollbar overflow-x-auto">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <caption className="sr-only">
                  Time to first result, throughput, and cost per session by deployment mode
                </caption>
                <thead>
                  <tr className="border-b border-ink-50/12">
                    {demoLab.results.columns.map((column, i) => (
                      <th
                        key={column}
                        scope="col"
                        className={`px-4 py-4 text-[10px] font-medium uppercase tracking-[0.18em] text-ink-50/45 ${
                          i === 0 ? "pl-5 md:pl-6" : ""
                        }`}
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {demoLab.results.rows.map((row) => {
                    // The lab's own contract row is the one to read — set it apart.
                    const isContract = row[5] === "Target";

                    return (
                      <tr
                        key={row[0]}
                        className={`border-b border-ink-50/8 last:border-b-0 ${
                          isContract ? "bg-klein/[0.14]" : ""
                        }`}
                      >
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            className={`px-4 py-4 align-top text-[13px] leading-snug ${
                              i === 0
                                ? `pl-5 md:pl-6 ${isContract ? "text-ink-50" : "text-ink-50/80"}`
                                : i === row.length - 1
                                  ? "font-mono text-[11px] uppercase tracking-[0.14em] text-ink-50/40"
                                  : "text-ink-50/60"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="border-t border-ink-50/10 px-5 py-4 text-xs leading-relaxed text-ink-50/40 md:px-6">
              <span className="mr-2 font-mono uppercase tracking-[0.18em] text-ink-50/30">
                Caveat
              </span>
              {demoLab.results.caveat}
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {demoLab.results.figures.map((figure) => (
              <FigureFrame key={figure.label} figure={figure} />
            ))}
          </div>
        </LabSection>

        <LabSection
          id="acknowledgements"
          index="06 / Credits"
          title="Acknowledgements"
        >
          <p className="max-w-3xl text-[15px] leading-[1.85] text-ink-50/70 md:text-base">
            {demoLab.acknowledgements.body}
          </p>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {demoLab.acknowledgements.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`glass glass-sheen glass-lift group flex items-baseline justify-between gap-4 rounded-2xl px-5 py-4 ${focusRing}`}
                >
                  <span>
                    <span className="block text-sm text-ink-50/85 transition-colors group-hover:text-ink-50">
                      {link.label}
                    </span>
                    <span className="mt-1 block text-[11px] leading-snug text-ink-50/40">
                      {link.note}
                    </span>
                  </span>
                  <span aria-hidden className="text-ink-50/30 transition-colors group-hover:text-ink-50/70">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </LabSection>

        <LabSection
          id="bibtex"
          index="07 / Cite"
          title="BibTeX"
          lede="If any of this is useful in your own work or writing, cite the lab rather than an individual demo — the builds move, the page doesn't."
        >
          <CopyBlock code={demoLab.bibtex} />
        </LabSection>
      </main>

      <Footer />
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <header className="relative mx-auto max-w-4xl px-6">
      {/* Ambient Klein bloom — decorative, gives the clay something to refract. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-0 h-72 w-[36rem] max-w-full rounded-full bg-klein/20 blur-[110px]"
      />

      <div className="animate-rise glass-chip glass-sheen relative inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5">
        <span aria-hidden className="h-1 w-1 rounded-full bg-ink-50/60" />
        <span className="text-[10px] uppercase tracking-[0.34em] text-ink-50/65">
          {demoLab.eyebrow}
        </span>
      </div>

      <h1
        className="animate-rise display relative mt-6 text-[2.35rem] leading-[1.07] text-gradient md:text-5xl lg:text-[3.9rem]"
        style={{ animationDelay: "80ms" }}
      >
        {demoLab.title}
      </h1>

      <p
        className="animate-rise relative mt-6 max-w-3xl text-base leading-[1.7] text-ink-50/70 md:text-lg"
        style={{ animationDelay: "160ms" }}
      >
        {demoLab.tagline}
      </p>

      <div
        className="animate-rise relative mt-8 inline-flex items-center gap-2.5 rounded-full border border-klein/50 bg-klein/20 px-4 py-1.5"
        style={{ animationDelay: "220ms" }}
      >
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-amber-300/90 shadow-[0_0_10px_rgba(252,211,77,0.8)]"
        />
        <span className="text-[10px] uppercase tracking-[0.24em] text-ink-50/85">
          {demoLab.badge}
        </span>
      </div>

      <nav
        aria-label="Project resources"
        className="animate-rise relative mt-8"
        style={{ animationDelay: "280ms" }}
      >
        <ul className="flex flex-wrap gap-2.5">
          {demoLab.resources.map((resource) => {
            const shared = `inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${focusRing}`;
            const styles =
              resource.kind === "primary"
                ? "bg-ink-50 font-medium text-ink-950 hover:bg-white"
                : "glass-chip glass-sheen text-ink-50/70 hover:text-ink-50";

            return (
              <li key={resource.label}>
                {resource.external ? (
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${shared} ${styles}`}
                  >
                    {resource.label}
                    <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <Link href={resource.href} className={`${shared} ${styles}`}>
                    {resource.label}
                    <span aria-hidden>→</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <p
        className="animate-rise relative mt-10 max-w-3xl border-l-2 border-klein/50 pl-5 text-sm leading-[1.75] text-ink-50/60"
        style={{ animationDelay: "340ms" }}
      >
        {demoLab.positioning}
      </p>
    </header>
  );
}

/* ── Gallery card ──────────────────────────────────────────────────────── */

function DemoCard({
  project,
  counter,
}: {
  project: DemoProject;
  counter: string;
}) {
  const isInteractive = project.format === "Interactive demo";
  const isLive = project.status !== "Planned";

  return (
    <article
      id={project.id}
      className="glass-card glass-sheen glass-lift glass-bloom group isolate flex scroll-mt-28 flex-col overflow-hidden rounded-[1.75rem]"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-ink-50/10 bg-gradient-to-br from-ink-50/[0.06] via-transparent to-klein/15">
        {project.cover ? (
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div aria-hidden className={`absolute inset-0 opacity-[0.07] ${GRID}`} />
            <span className="relative font-mono text-[10px] uppercase tracking-[0.32em] text-ink-50/35">
              {counter}
            </span>
            <span className="display relative text-lg text-ink-50/45">
              {isInteractive ? "Online demo coming soon" : "Video coming soon"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="glass-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-ink-50/60">
            <span
              aria-hidden
              className={`h-1 w-1 rounded-full ${
                isLive ? "bg-emerald-300/90" : "bg-amber-300/80"
              }`}
            />
            {project.status}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${
              isInteractive
                ? "border-klein/45 bg-klein/20 text-ink-50/85"
                : "border-ink-50/15 bg-ink-50/[0.05] text-ink-50/60"
            }`}
          >
            {project.format}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-ink-50/35">
            {project.tag}
          </span>
        </div>

        <h4 className="display text-2xl leading-tight text-ink-50 md:text-[1.75rem]">
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className={`rounded underline-offset-4 hover:underline ${focusRing}`}
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h4>

        <p className="mt-3 text-sm leading-relaxed text-ink-50/65 md:text-[15px]">
          {project.body}
        </p>

        <p className="mt-auto border-t border-ink-50/10 pt-4 text-xs leading-relaxed text-ink-50/45">
          <span className="mr-2 font-mono uppercase tracking-[0.18em] text-ink-50/30">
            Format
          </span>
          {project.formatNote}
        </p>

        {project.stack && project.stack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technology stack">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="glass-chip rounded px-2 py-1 font-mono text-[11px] text-ink-50/45"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {/*
          Exits. A build with code but no deploy still gets a way in, so a card
          is never a dead end while the demo is being written.
        */}
        {(project.href || project.repo) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-950 transition-colors hover:bg-white ${focusRing}`}
              >
                Open demo
                <span aria-hidden>↗</span>
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className={`glass-chip glass-sheen inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink-50/70 transition-colors hover:text-ink-50 ${focusRing}`}
              >
                Code
                <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
