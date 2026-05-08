import Image from "next/image";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { photos } from "@/content/portfolio";

export const metadata = { title: "Photography — Joy Chen" };

export default function PhotographyPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="02 · Photography"
          title="Light, texture, quiet"
          lede="A small collection of tree studies. Click any frame for a closer look."
        />

        <section className="mx-auto max-w-6xl px-6 mt-20 columns-1 md:columns-2 gap-6 [column-fill:_balance]">
          {photos.map((p, i) => (
            <figure
              key={p.src}
              className="mb-6 break-inside-avoid overflow-hidden rounded-2xl glass group relative"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={i < 2}
                />
              </div>
              <figcaption className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/70 to-transparent text-xs uppercase tracking-[0.3em] text-ink-50/80 opacity-0 group-hover:opacity-100 transition-opacity">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
