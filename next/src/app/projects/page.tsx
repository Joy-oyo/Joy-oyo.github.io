import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { projects } from "@/content/portfolio";

export const metadata = { title: "Projects — Joy Chen" };

export default function ProjectsPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="03 · Projects"
          title="Built things"
          lede="Case studies, prototypes, and playful experiments."
        />

        <section className="mx-auto max-w-6xl px-6 mt-20 grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              target={p.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="group glass rounded-3xl overflow-hidden hover:bg-ink-50/10 transition-colors"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                  <span>{p.tag}</span>
                  <span>{p.year}</span>
                </div>
                <h3 className="display text-2xl mt-3 text-ink-50">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-ink-50/60 leading-relaxed">
                  {p.body}
                </p>
                <div className="mt-5 text-xs uppercase tracking-widest text-ink-50/70 group-hover:text-ink-50">
                  View project →
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
