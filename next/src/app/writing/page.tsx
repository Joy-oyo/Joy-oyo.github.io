import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { writings } from "@/content/portfolio";

export const metadata = { title: "Blog — Joy Chen" };

// Newest first.
const sorted = [...writings].sort((a, b) => (a.date < b.date ? 1 : -1));

export default function WritingPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="04 · Blog"
          title="Notes, thoughts, field reports"
          lede="Short essays on design, code, and the occasional thing that doesn't fit anywhere else."
        />

        <section className="mx-auto max-w-3xl px-6 mt-20">
          <ul className="divide-y divide-ink-50/10">
            {sorted.map((w) => (
              <li key={w.slug} className="group">
                <Link
                  href={`/writing/${w.slug}`}
                  className="-mx-4 flex items-start justify-between gap-8 rounded-2xl px-4 py-8 transition-colors hover:bg-ink-50/5"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                      <span>
                        {new Date(w.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {w.tags?.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-ink-50/15 px-2 py-0.5 tracking-[0.25em] text-ink-50/55"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="display mt-2 text-2xl text-ink-50 group-hover:text-gradient md:text-3xl">
                      {w.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-50/60">
                      {w.excerpt}
                    </p>
                  </div>
                  <span className="mt-3 hidden text-ink-50/40 group-hover:text-ink-50 md:block">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
