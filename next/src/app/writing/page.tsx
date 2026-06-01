import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { writings } from "@/content/portfolio";

export const metadata = { title: "Blog — Joy Chen" };

export default function WritingPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="04 · Blog"
          title="Notes, thoughts, field reports"
          lede="Short essays on design, code, and curious things."
        />

        <section className="mx-auto max-w-3xl px-6 mt-20">
          <ul className="divide-y divide-ink-50/10">
            {writings.map((w) => (
              <li key={w.slug} className="group">
                <Link
                  href={`/writing/${w.slug}`}
                  className="block py-8 flex items-start justify-between gap-8 hover:bg-ink-50/5 transition-colors -mx-4 px-4 rounded-2xl"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                      {new Date(w.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h3 className="display text-2xl md:text-3xl mt-2 text-ink-50 group-hover:text-gradient">
                      {w.title}
                    </h3>
                    <p className="mt-3 text-sm text-ink-50/60 max-w-lg leading-relaxed">
                      {w.excerpt}
                    </p>
                  </div>
                  <span className="hidden md:block text-ink-50/40 group-hover:text-ink-50 mt-3">
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
