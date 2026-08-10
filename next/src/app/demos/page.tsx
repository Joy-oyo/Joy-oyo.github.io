import Image from "next/image";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { demoProjects } from "@/content/portfolio";

export const metadata = { title: "Demos — Joy Chen" };

export default function DemosPage() {
  const interactiveCount = demoProjects.filter(
    (project) => project.format === "Interactive demo"
  ).length;
  const videoCount = demoProjects.length - interactiveCount;

  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <PageHeader
          eyebrow="Build · Demo roadmap"
          title="Projects taking shape"
          lede="Some ideas will become live, browser-based prototypes. Projects that depend on robotics, game engines, or heavier production will arrive as video showcases, with build notes added along the way."
        />

        {/* Roadmap summary — orients the reader before the grid. */}
        <section
          aria-label="Roadmap summary"
          className="mx-auto mt-12 grid max-w-6xl gap-3 px-6 sm:grid-cols-3"
        >
          {[
            { label: "Planned projects", value: String(demoProjects.length) },
            { label: "Interactive demos", value: String(interactiveCount) },
            { label: "Video showcases", value: String(videoCount) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass glass-sheen flex items-baseline justify-between rounded-2xl px-5 py-4"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-ink-50/45">
                {stat.label}
              </span>
              <span className="display text-2xl text-ink-50">{stat.value}</span>
            </div>
          ))}
        </section>

        <section
          aria-label="Planned demo projects"
          className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2"
        >
          {demoProjects.map((project, index) => {
            const isInteractive = project.format === "Interactive demo";

            return (
              <article
                key={project.id}
                className="glass-card glass-sheen glass-lift glass-bloom group isolate flex flex-col overflow-hidden rounded-[1.75rem]"
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
                      {/* Faint grid so the empty slot still feels designed. */}
                      <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(245,245,240,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,245,240,0.6)_1px,transparent_1px)] [background-size:34px_34px]"
                      />
                      <span className="relative font-mono text-[10px] uppercase tracking-[0.32em] text-ink-50/35">
                        {isInteractive ? "Interactive build" : "Video production"} ·{" "}
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="display relative text-lg text-ink-50/50">
                        {isInteractive ? "Online demo coming soon" : "Video coming soon"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="glass-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-ink-50/60">
                      <span aria-hidden className="h-1 w-1 rounded-full bg-amber-300/80" />
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

                  <h2 className="display text-2xl leading-tight text-ink-50 md:text-3xl">
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                      >
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </h2>

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
                </div>
              </article>
            );
          })}
        </section>
      </main>
      <Footer />
    </>
  );
}
