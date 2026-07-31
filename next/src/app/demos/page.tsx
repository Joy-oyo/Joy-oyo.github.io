import Image from "next/image";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { demoProjects } from "@/content/portfolio";

export const metadata = { title: "Demos — Joy Chen" };

export default function DemosPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="Build · Demo roadmap"
          title="Projects taking shape"
          lede="Reserved spaces for demos I plan to build. Each entry will grow into an interactive prototype, with progress, technical notes, and a live demo added along the way."
        />

        <section
          aria-label="Planned demo projects"
          className="mx-auto max-w-6xl px-6 mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {demoProjects.map((project, index) => (
            <article
              key={project.id}
              className="group overflow-hidden rounded-2xl border border-ink-50/10 bg-ink-50/[0.025] transition-colors hover:border-ink-50/20"
            >
              <div className="relative aspect-[16/9] overflow-hidden border-b border-ink-50/10 bg-gradient-to-br from-ink-50/[0.07] via-transparent to-klein/10">
                {project.cover ? (
                  <Image
                    src={project.cover}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-ink-50/30">
                      Demo slot {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-lg text-ink-50/45">Preview coming soon</span>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-7">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full border border-ink-50/10 text-ink-50/50">
                    {project.status}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-ink-50/35">
                    {project.tag}
                  </span>
                </div>

                <h2 className="display text-2xl md:text-3xl text-ink-50 leading-tight">
                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline decoration-ink-50/20 underline-offset-4"
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h2>

                <p className="mt-3 text-sm md:text-[15px] text-ink-50/60 leading-relaxed">
                  {project.body}
                </p>

                {project.stack && project.stack.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technology stack">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="text-[11px] font-mono text-ink-50/40 bg-ink-50/[0.04] px-2 py-1 rounded"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
