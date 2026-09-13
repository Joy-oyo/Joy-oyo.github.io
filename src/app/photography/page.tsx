import Image from "next/image";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { photos } from "@/content/photography";

export const metadata = { title: "Photography — Joy Chen" };

export default function PhotographyPage() {
  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <PageHeader
          eyebrow="02 · Photography"
          title="Light, texture, quiet"
          lede="A small collection of tree studies — the same subject followed across a single day, from morning through dusk."
        />

        <section
          aria-label="Photographs"
          className="mx-auto mt-20 max-w-6xl columns-1 gap-6 px-6 [column-fill:_balance] md:columns-2"
        >
          {photos.map((p, i) => (
            <figure
              key={p.src}
              className="glass-card glass-sheen glass-lift group relative isolate mb-6 break-inside-avoid overflow-hidden rounded-[1.75rem]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04]"
                  priority={i < 2}
                />
                {/* Gradient scrim keeps the glass caption legible over any frame. */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent"
                />
              </div>

              {/* Always visible — hover-only captions are invisible on touch. */}
              <figcaption className="absolute inset-x-4 bottom-4">
                <span className="glass-chip glass-sheen flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
                  <span className="text-[11px] uppercase tracking-[0.28em] text-ink-50/85">
                    {p.caption}
                  </span>
                  <span className="font-mono text-[10px] text-ink-50/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
