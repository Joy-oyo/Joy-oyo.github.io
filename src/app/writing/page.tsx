import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { writings } from "@/content/writing";

export const metadata = { title: "Blog — Joy Chen" };

// Newest first.
const sorted = [...writings].sort((a, b) => (a.date < b.date ? 1 : -1));

/** Rough reading time so readers can judge the commitment up front. */
function readingTime(body?: string[]) {
  if (!body || body.length === 0) return null;
  const words = body.join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export default function WritingPage() {
  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <PageHeader
          eyebrow="04 · Blog"
          title="Notes, thoughts, field reports"
          lede="Short essays on design, code, and the occasional thing that doesn't fit anywhere else."
        />

        <section aria-label="Blog posts" className="mx-auto mt-20 max-w-3xl px-6">
          <ul className="space-y-4">
            {sorted.map((w) => {
              const minutes = readingTime(w.body);

              return (
                <li key={w.slug}>
                  <Link
                    href={`/writing/${w.slug}`}
                    className="glass-card glass-sheen glass-lift glass-bloom group isolate flex items-start justify-between gap-6 rounded-[1.5rem] px-6 py-7 outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 md:px-8"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                        <time dateTime={w.date}>
                          {new Date(w.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        {minutes && (
                          <span className="tracking-[0.2em] text-ink-50/35">{minutes}</span>
                        )}
                        {w.tags?.map((t) => (
                          <span
                            key={t}
                            className="glass-chip rounded-full px-2.5 py-1 tracking-[0.24em] text-ink-50/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <h2 className="display mt-3 text-2xl text-ink-50 transition-colors group-hover:text-gradient md:text-3xl">
                        {w.title}
                      </h2>

                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-50/60">
                        {w.excerpt}
                      </p>
                    </div>

                    <span
                      aria-hidden
                      className="glass-chip mt-2 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-50/45 transition-all duration-500 ease-out-soft group-hover:translate-x-1 group-hover:text-ink-50 md:flex"
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
