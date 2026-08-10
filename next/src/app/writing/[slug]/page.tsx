import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { writings } from "@/content/portfolio";

// Newest first — shared by metadata and prev/next navigation.
const sorted = [...writings].sort((a, b) => (a.date < b.date ? 1 : -1));

export function generateStaticParams() {
  return writings.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = writings.find((w) => w.slug === params.slug);
  return {
    title: post ? `${post.title} — Joy Chen` : "Blog — Joy Chen",
    description: post?.excerpt,
  };
}

/** Rough reading time, matched to the estimate on the index page. */
function readingTime(body?: string[]) {
  if (!body || body.length === 0) return null;
  const words = body.join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export default function WritingDetail({
  params,
}: {
  params: { slug: string };
}) {
  const index = sorted.findIndex((w) => w.slug === params.slug);
  const post = index === -1 ? undefined : sorted[index];
  if (!post) notFound();

  const hasBody = Array.isArray(post.body) && post.body.length > 0;
  const minutes = readingTime(post.body);
  const newer = index > 0 ? sorted[index - 1] : null;
  const older = index < sorted.length - 1 ? sorted[index + 1] : null;

  const focusRing =
    "outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <div className="mx-auto max-w-2xl px-6">
          <Link
            href="/writing"
            className={`glass-chip glass-sheen inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ink-50/60 transition-colors hover:text-ink-50 ${focusRing}`}
          >
            <span aria-hidden>←</span>
            All posts
          </Link>
        </div>

        <article className="relative mx-auto mt-8 max-w-2xl px-6">
          {/* Ambient bloom behind the glass sheet. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 h-64 w-[30rem] max-w-full -translate-x-1/2 rounded-full bg-klein/20 blur-[110px]"
          />

          <div className="glass-card glass-sheen relative isolate overflow-hidden rounded-[2rem] px-7 py-10 md:px-12 md:py-14">
            <header>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {minutes && <span className="tracking-[0.2em]">{minutes}</span>}
                {post.tags?.map((t) => (
                  <span
                    key={t}
                    className="glass-chip rounded-full px-2.5 py-1 tracking-[0.24em] text-ink-50/60"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h1 className="display mt-5 text-4xl leading-tight text-gradient md:text-6xl">
                {post.title}
              </h1>

              <p className="mt-6 border-l-2 border-klein/50 pl-5 text-lg leading-relaxed text-ink-50/75">
                {post.excerpt}
              </p>
            </header>

            <div className="mt-12 space-y-6 text-[15px] leading-[1.85] text-ink-50/80 md:text-base">
              {hasBody ? (
                post.body!.map((paragraph, i) => <p key={i}>{paragraph}</p>)
              ) : (
                <p className="text-ink-50/55">
                  This post doesn&apos;t have a body yet — the note is still in progress.
                </p>
              )}
            </div>
          </div>
        </article>

        {/* Keep reading — prevents the article from being a dead end. */}
        {(newer || older) && (
          <nav
            aria-label="More posts"
            className="mx-auto mt-6 grid max-w-2xl gap-3 px-6 sm:grid-cols-2"
          >
            {[
              { post: newer, label: "Newer", arrow: "←" },
              { post: older, label: "Older", arrow: "→" },
            ].map(({ post: sibling, label, arrow }) =>
              sibling ? (
                <Link
                  key={label}
                  href={`/writing/${sibling.slug}`}
                  className={`glass glass-sheen glass-lift group block rounded-2xl px-5 py-5 ${focusRing}`}
                >
                  <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-ink-50/40">
                    {label === "Newer" && <span aria-hidden>{arrow}</span>}
                    {label}
                    {label === "Older" && <span aria-hidden>{arrow}</span>}
                  </span>
                  <span className="display mt-2 block text-lg leading-snug text-ink-50/85 transition-colors group-hover:text-ink-50">
                    {sibling.title}
                  </span>
                </Link>
              ) : (
                <span key={label} aria-hidden className="hidden sm:block" />
              )
            )}
          </nav>
        )}
      </main>
      <Footer />
    </>
  );
}
