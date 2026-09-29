import Image from "next/image";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SectionNav from "@/components/demos/SectionNav";
import {
  collections,
  type Choreo,
  type Collection,
  type Photo,
  type Piece,
} from "@/content/arte";

export const metadata = { title: "Arte — Joy Chen" };

const pad = (n: number) => String(n).padStart(2, "0");

const sections = collections.map((c) => ({ id: c.id, label: c.title }));

const countLabel = (c: Collection) => {
  const n = c.items.length;
  if (n === 0) return "Soon";
  const noun = c.kind === "photo" ? "frame" : c.kind === "choreo" ? "piece" : "text";
  return `${n} ${noun}${n === 1 ? "" : "s"}`;
};

export default function ArtePage() {
  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <PageHeader title="Light, texture, quiet" />

        <SectionNav sections={sections} width="max-w-6xl" />

        <div className="mx-auto mt-10 max-w-6xl px-6">
          {collections.map((c, i) => (
            <CollectionSection key={c.id} collection={c} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function CollectionSection({ collection: c, index }: { collection: Collection; index: number }) {
  const headingId = `${c.id}-title`;

  return (
    <section
      id={c.id}
      aria-labelledby={headingId}
      className="grid scroll-mt-28 border-t border-ink-50/10 py-12 last:border-b md:grid-cols-[11rem_minmax(0,1fr)] md:gap-x-12 md:py-16"
    >
      {/* Medium rail — sticks below the section strip while the collection scrolls past. */}
      <div className="mb-8 flex items-baseline justify-between md:sticky md:top-36 md:mb-0 md:block md:self-start">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-50/35">
            {pad(index + 1)}
          </p>
          <h2 id={headingId} className="display mt-2 text-3xl leading-none text-ink-50/80 md:text-4xl">
            {c.title}
          </h2>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-50/30 md:mt-3">
          {countLabel(c)}
        </p>
      </div>

      <div className="min-w-0">
        {c.items.length === 0 ? (
          <InProgress />
        ) : c.kind === "photo" ? (
          <PhotoGrid photos={c.items} eager={index === 0} />
        ) : c.kind === "choreo" ? (
          <ChoreoGrid pieces={c.items} />
        ) : (
          <TextList pieces={c.items} />
        )}
      </div>
    </section>
  );
}

function InProgress() {
  return (
    <div className="flex min-h-[8rem] items-center rounded-[1.5rem] border border-dashed border-ink-50/10 px-6 md:min-h-[10rem]">
      <p className="flex items-center gap-3">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-klein shadow-[0_0_10px_rgba(0,47,167,0.9)]" />
        <span className="display text-lg leading-none text-ink-50/45 md:text-xl">In progress</span>
      </p>
    </div>
  );
}

function PhotoGrid({ photos, eager }: { photos: Photo[]; eager: boolean }) {
  return (
    <div className="columns-1 gap-6 [column-fill:_balance] md:columns-2">
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
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04]"
              priority={eager && i < 2}
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
              <span className="font-mono text-[10px] text-ink-50/45">{pad(i + 1)}</span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Only http(s) links leave the page — content is static, but stay strict. */
const safeHref = (href?: string) => (href && /^https?:\/\//i.test(href) ? href : undefined);

function ChoreoGrid({ pieces }: { pieces: Choreo[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {pieces.map((p) => {
        const href = safeHref(p.href);
        const body = (
          <>
            <div className="relative aspect-video">
              <Image
                src={p.poster}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04]"
              />
              {href && (
                <span
                  aria-hidden
                  className="glass-chip glass-sheen absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-ink-50/90"
                >
                  ▶
                </span>
              )}
            </div>
            <div className="flex items-baseline justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <h3 className="display text-xl leading-tight text-ink-50/85">{p.title}</h3>
                {p.credit && <p className="mt-1 text-xs text-ink-50/45">{p.credit}</p>}
              </div>
              <span className="font-mono text-[10px] text-ink-50/40">{p.year}</span>
            </div>
          </>
        );

        return (
          <li
            key={p.title}
            className="glass-card glass-sheen glass-lift group isolate overflow-hidden rounded-[1.75rem]"
          >
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block outline-none focus-visible:ring-2 focus-visible:ring-klein"
              >
                {body}
              </a>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}

function TextList({ pieces }: { pieces: Piece[] }) {
  return (
    <ol className="divide-y divide-ink-50/[0.06]">
      {pieces.map((p) => {
        const href = safeHref(p.href);
        const body = (
          <>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50/40">
              {p.year}
            </span>
            <div className="min-w-0">
              <h3 className="display text-2xl leading-[1.15] text-ink-50/85 transition-colors group-hover:text-ink-50">
                {p.title}
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-50/55 md:text-[15px]">
                {p.excerpt}
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-ink-50/40">{p.form}</p>
            </div>
          </>
        );
        const row =
          "group -mx-4 grid grid-cols-[3.75rem_minmax(0,1fr)] items-baseline gap-x-5 rounded-2xl px-4 py-7";

        return (
          <li key={p.title}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${row} outline-none transition-colors hover:bg-ink-50/[0.03] focus-visible:ring-2 focus-visible:ring-klein`}
              >
                {body}
              </a>
            ) : (
              <div className={row}>{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
