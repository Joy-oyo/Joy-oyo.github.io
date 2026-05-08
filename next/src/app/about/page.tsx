import Footer from "@/components/Footer";
import { experiences, skills, site } from "@/content/portfolio";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "About — Joy Chen" };

export default function AboutPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="01 · About"
          title="A little about me"
          lede={site.bio}
        />

        <section className="mx-auto max-w-3xl px-6 mt-24">
          <h2 className="display text-3xl mb-10 text-ink-50/80">Experience</h2>
          <ol className="relative border-l border-ink-50/10 space-y-12 pl-8">
            {experiences.map((exp, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-klein ring-4 ring-ink-950" />
                <div className="text-xs uppercase tracking-[0.3em] text-ink-50/40">
                  {exp.period}
                </div>
                <div className="mt-2 text-xl text-ink-50">
                  {exp.role}{" "}
                  <span className="text-ink-50/50">· {exp.org}</span>
                </div>
                <p className="mt-2 text-sm text-ink-50/60 leading-relaxed max-w-lg">
                  {exp.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-3xl px-6 mt-24">
          <h2 className="display text-3xl mb-8 text-ink-50/80">Toolkit</h2>
          <ul className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <li
                key={s}
                className="glass rounded-full px-4 py-2 text-xs tracking-wide text-ink-50/80"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
