import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { reading, type ReadingItem, type ReadingStatus } from "@/content/portfolio";

export const metadata = {
  title: "Reading — Joy Chen",
  description:
    "The shelf behind the work — what I'm reading now, what's next, and what stuck.",
};

/**
 * Grouped by status rather than listed flat: "am I reading this" is the first
 * question anyone asks of a reading page, so it becomes the structure instead
 * of a chip you have to hunt for.
 */
const GROUPS: { status: ReadingStatus; blurb: string; accent: string }[] = [
  {
    status: "Reading now",
    blurb: "Open on the desk.",
    accent: "bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.7)]",
  },
  {
    status: "Next up",
    blurb: "Queued, honestly this time.",
    accent: "bg-klein shadow-[0_0_10px_rgba(0,47,167,0.9)]",
  },
  {
    status: "Finished",
    blurb: "Still changing how I work.",
    accent: "bg-ink-50/45",
  },
];

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

function Card({ item }: { item: ReadingItem }) {
  const body = (
    <>
      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-ink-50/40">
        <span className="glass-chip rounded-full px-2.5 py-1 text-ink-50/60">{item.topic}</span>
        {item.href && (
          <span
            aria-hidden
            className="ml-auto transition-transform duration-500 ease-out-soft group-hover:translate-x-0.5"
          >
            ↗
          </span>
        )}
      </div>

      <h3 className="display mt-4 text-xl leading-snug text-ink-50 md:text-2xl">{item.title}</h3>
      <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-ink-50/45">{item.author}</p>
      <p className="mt-4 border-t border-ink-50/10 pt-4 text-sm leading-relaxed text-ink-50/60">
        {item.note}
      </p>
    </>
  );

  // Only linked cards get the lift — a hover affordance on a dead card is a lie.
  return item.href ? (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className={`glass-card glass-sheen glass-lift glass-bloom group isolate flex h-full flex-col rounded-[1.5rem] px-6 py-6 ${focusRing}`}
    >
      {body}
    </a>
  ) : (
    <article className="glass glass-sheen flex h-full flex-col rounded-[1.5rem] px-6 py-6">
      {body}
    </article>
  );
}

export default function ReadingPage() {
  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <PageHeader
          eyebrow="06 · Reading"
          title="The shelf behind the work"
          lede="Books that shaped how I think about systems, images, and minds. Notes are why each one earned the space, not a summary."
        />

        <div className="mx-auto mt-20 max-w-6xl px-6">
          {GROUPS.map((group) => {
            const items = reading.filter((item) => item.status === group.status);
            if (items.length === 0) return null;

            return (
              <section
                key={group.status}
                aria-label={group.status}
                className="mb-16 last:mb-0"
              >
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <h2 className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-ink-50/70">
                    <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${group.accent}`} />
                    {group.status}
                  </h2>
                  <p className="text-xs text-ink-50/40">{group.blurb}</p>
                  <span className="ml-auto font-mono text-[10px] tracking-[0.24em] text-ink-50/30">
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>

                <ul className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <li key={item.id}>
                      <Card item={item} />
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
