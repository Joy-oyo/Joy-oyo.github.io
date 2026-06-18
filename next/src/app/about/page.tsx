import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import {
  site,
  timeline,
  toolkit,
  selectedWork,
  talks,
  type TimelineItem,
  type SelectedWorkItem,
  type TalkItem,
} from "@/content/portfolio";

export const metadata = { title: "About — Joy Chen" };

const work = timeline.filter((t) => t.kind === "work");
const education = timeline.filter((t) => t.kind === "edu");

function TimelineList({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative border-l border-ink-50/10 space-y-14 pl-8">
      {items.map((item, i) => (
        <li key={`${item.org}-${i}`} className="relative">
          <span
            className={`absolute -left-[37px] top-1.5 h-3 w-3 rounded-full ring-4 ring-ink-950 ${
              item.current ? "bg-klein" : "bg-ink-50/30"
            }`}
          />

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {item.period && (
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                {item.period}
              </span>
            )}
            {item.current && (
              <span className="rounded-full bg-klein/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.25em] text-klein">
                Now
              </span>
            )}
            {item.location && (
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-50/35">
                · {item.location}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
            <h3 className="display text-2xl md:text-3xl text-ink-50 leading-tight">
              {item.role}
            </h3>
            <span className="text-ink-50/45">·</span>
            <span className="text-base md:text-lg text-ink-50/70">
              {item.org}
            </span>
          </div>

          {item.note && (
            <p className="mt-2 max-w-xl text-sm text-ink-50/55 leading-relaxed">
              {item.note}
            </p>
          )}

          {item.highlights && item.highlights.length > 0 && (
            <ul className="mt-4 max-w-2xl space-y-2 text-sm text-ink-50/70 leading-relaxed">
              {item.highlights.map((h, j) => (
                <li key={j} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-[3px] w-3 flex-none bg-ink-50/25" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * SelectedWorkCard — a single project / paper / product card.
 * Featured items take both columns and run larger; non-featured share a row.
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

export default function AboutPage() {
  return (
    <>
      <main className="relative pt-32 pb-24">
        <PageHeader
          eyebrow="01 · About"
          title="A little about me"
          lede={site.bio}
        />

        {/* Quick facts strip */}
        <section className="mx-auto max-w-3xl px-6 mt-14">
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4 border-t border-ink-50/10 pt-8">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                Based in
              </dt>
              <dd className="mt-2 text-sm text-ink-50/85">{site.location}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                Currently
              </dt>
              <dd className="mt-2 text-sm text-ink-50/85">
                Tencent · Veeup
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                Working on
              </dt>
              <dd className="mt-2 text-sm text-ink-50/85">
                AI · Media · Tools
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                Reach me
              </dt>
              <dd className="mt-2 text-sm">
                <a
                  href={`mailto:${site.email}`}
                  className="border-b border-ink-50/20 text-ink-50/85 hover:border-ink-50/80 hover:text-ink-50 transition-colors"
                >
                  {site.email}
                </a>
              </dd>
            </div>
          </dl>
        </section>

        {/* Long-form intro */}
        <section className="mx-auto max-w-3xl px-6 mt-20 space-y-5 text-ink-50/75 leading-relaxed">
          <p>
            I work at the seam between <em className="not-italic text-ink-50">product, code, and image</em>
            {" "}— shipping AI-powered media tools by day, and making small interactive
            experiments by night. I like things that feel intentional but a little playful.
          </p>
          <p>
            Most recently I&apos;ve been building cloud media and AI solutions at
            Tencent, and co-leading <strong className="font-medium text-ink-50/90">Veeup</strong>,
            a platform that automates the tedious parts of job hunting so people
            can spend more time on the parts that actually matter.
          </p>
          <p>
            Before that — a Master&apos;s at the University of Chicago focused on
            AI and language, and a B.S. at Wake Forest with a double major in
            Media Studies. I think the mix shows up in how I work: equal parts
            systems and stories.
          </p>
        </section>

        {/* Selected Work — projects & papers, ordered by importance, NOT a timeline */}
        <section
          id="selected-work"
          className="mx-auto max-w-6xl px-6 mt-28 scroll-mt-32"
        >
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-50/45">
                What I&apos;ve built
              </span>
              <h2 className="display text-3xl md:text-4xl mt-2 text-ink-50/90">
                Selected work
              </h2>
            </div>
            <p className="max-w-sm text-sm text-ink-50/55 leading-relaxed">
              Projects, papers, and shipped products — ordered by what mattered,
              not when it happened.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {selectedWork.map((item) => (
              <SelectedWorkCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Speaking & Talks */}
        {talks.length > 0 && (
          <section className="mx-auto max-w-3xl px-6 mt-28">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-50/45">
                  In public
                </span>
                <h2 className="display text-3xl md:text-4xl mt-2 text-ink-50/90">
                  Speaking & talks
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

        {/* Experience */}
        <section className="mx-auto max-w-3xl px-6 mt-28">
          <div className="mb-10 flex items-baseline justify-between">
            <h2 className="display text-3xl text-ink-50/85">Experience</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/35">
              {work.length} role{work.length === 1 ? "" : "s"}
            </span>
          </div>
          <TimelineList items={work} />
        </section>

        {/* Education */}
        <section className="mx-auto max-w-3xl px-6 mt-24">
          <div className="mb-10 flex items-baseline justify-between">
            <h2 className="display text-3xl text-ink-50/85">Education</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/35">
              {education.length} program{education.length === 1 ? "" : "s"}
            </span>
          </div>
          <TimelineList items={education} />
        </section>

        {/* Toolkit */}
        <section className="mx-auto max-w-3xl px-6 mt-24">
          <h2 className="display text-3xl mb-10 text-ink-50/85">Toolkit</h2>
          <div className="space-y-8">
            {toolkit.map((group) => (
              <div key={group.group}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                  {group.group}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((s) => (
                    <li
                      key={s}
                      className="glass rounded-full px-3.5 py-1.5 text-xs tracking-wide text-ink-50/80"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-3xl px-6 mt-24">
          <div className="glass rounded-2xl px-6 py-8 md:px-10 md:py-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <h3 className="display text-2xl text-ink-50">Want to work together?</h3>
              <p className="mt-1 text-sm text-ink-50/60">
                I&apos;m always open to thoughtful projects and conversations.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-5 py-2.5 font-medium text-ink-950 hover:bg-white transition-colors"
              >
                Say hi
                <span aria-hidden>→</span>
              </a>
              <a
                href="#selected-work"
                className="text-ink-50/70 border-b border-ink-50/20 pb-0.5 hover:text-ink-50 hover:border-ink-50/80 transition-colors"
              >
                See selected work
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
