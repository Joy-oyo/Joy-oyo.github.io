import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { selectedWork, talks, type SelectedWorkItem, type TalkItem } from "@/content/portfolio";

export const metadata = { title: "Work — Joy Chen" };

/**
 * SelectedWorkCard — project / paper / product.
 * Featured items span both columns and run larger.
 */
function SelectedWorkCard({ item }: { item: SelectedWorkItem }) {
  const Tag = item.href ? "a" : "div";
  const isExternal = item.href?.startsWith("http");
  return (
    <Tag
      {...(item.href
        ? {
            href: item.href,
            target: isExternal ? "_blank" : undefined,
            rel: isExternal ? "noreferrer" : undefined,
          }
        : {})}
      className={`group glass rounded-2xl p-6 md:p-7 flex flex-col gap-3 transition-colors ${
        item.href ? "hover:bg-ink-50/8" : ""
      } ${item.featured ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ink-50/45">
        <span>{item.tag}</span>
        <span className="text-ink-50/30">{item.context}</span>
      </div>

      <h3
        className={`display text-ink-50 leading-tight ${
          item.featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
        }`}
      >
        {item.title}
      </h3>

      <p className="text-sm text-ink-50/65 leading-relaxed">{item.body}</p>

      {item.href && (
        <div className="mt-2 text-xs uppercase tracking-[0.25em] text-ink-50/55 group-hover:text-ink-50">
          {isExternal ? "Visit" : "Read more"} →
        </div>
      )}
    </Tag>
  );
}

function TalkRow({ talk }: { talk: TalkItem }) {
  const Tag = talk.href ? "a" : "div";
  return (
    <Tag
      {...(talk.href
        ? { href: talk.href, target: "_blank", rel: "noreferrer" }
        : {})}
      className={`group block py-6 border-b border-ink-50/8 ${
        talk.href ? "hover:bg-ink-50/[0.02]" : ""
      } transition-colors`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40 tabular-nums">
          {talk.year}
        </span>
        {talk.location && (
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-50/35">
            · {talk.location}
          </span>
        )}
      </div>

      <h3 className="display text-xl md:text-2xl text-ink-50 leading-tight mt-1.5">
        {talk.title}
      </h3>
      <p className="mt-1 text-sm text-ink-50/65">{talk.venue}</p>

      {talk.body && (
        <p className="mt-2 max-w-2xl text-sm text-ink-50/55 leading-relaxed">
          {talk.body}
        </p>
      )}

      {talk.href && (
        <div className="mt-3 text-[11px] uppercase tracking-[0.3em] text-ink-50/55 group-hover:text-ink-50">
          Watch / read →
        </div>
      )}
    </Tag>
  );
}

export default function WorkPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="02 · Work"
          title="Selected work"
          lede="Projects, papers, and shipped products — ordered by what mattered, not when it happened."
        />

        {/* Selected Work grid */}
        <section className="mx-auto max-w-6xl px-6 mt-20">
          <div className="grid md:grid-cols-2 gap-5">
            {selectedWork.map((item) => (
              <SelectedWorkCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Talks */}
        {talks.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 mt-28">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-50/45">
                  In public
                </span>
                <h2 className="display text-3xl md:text-4xl mt-2 text-ink-50/90">
                  Speaking &amp; talks
                </h2>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/35">
                {talks.length} talk{talks.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="border-t border-ink-50/8">
              {talks.map((talk) => (
                <TalkRow key={talk.id} talk={talk} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 mt-24">
          <div className="glass rounded-2xl px-6 py-8 md:px-10 md:py-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h3 className="display text-2xl text-ink-50">Have something in mind?</h3>
              <p className="mt-1 text-sm text-ink-50/60">
                I&apos;m always open to thoughtful projects and conversations.
              </p>
            </div>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-5 py-2.5 text-sm font-medium text-ink-950 hover:bg-white transition-colors"
            >
              Say hi
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
