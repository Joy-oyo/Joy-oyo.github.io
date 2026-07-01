import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { writings } from "@/content/portfolio";

export function generateStaticParams() {
  return writings.map((w) => ({ slug: w.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = writings.find((w) => w.slug === params.slug);
  return { title: post ? `${post.title} — Joy Chen` : "Blog — Joy Chen" };
}

export default function WritingDetail({
  params,
}: {
  params: { slug: string };
}) {
  const post = writings.find((w) => w.slug === params.slug);
  if (!post) notFound();

  const hasBody = Array.isArray(post.body) && post.body.length > 0;

  return (
    <>
      <main className="relative pt-32 pb-24">
        <article className="mx-auto max-w-2xl px-6">
          <Link
            href="/writing"
            className="text-xs uppercase tracking-[0.3em] text-ink-50/50 hover:text-ink-50"
          >
            ← All posts
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {post.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full border border-ink-50/15 px-2 py-0.5 tracking-[0.25em] text-ink-50/55"
              >
                {t}
              </span>
            ))}
          </div>

          <h1 className="display mt-4 text-4xl leading-tight text-gradient md:text-6xl">
            {post.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-ink-50/70">
            {post.excerpt}
          </p>

          <div className="mt-12 space-y-6 text-[15px] leading-[1.85] text-ink-50/80 md:text-base">
            {hasBody ? (
              post.body!.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p className="text-ink-50/55">
                  This post doesn&apos;t have a body yet.
                </p>
              </>
            )}
          </div>

          <div className="mt-20 border-t border-ink-50/10 pt-8">
            <Link
              href="/writing"
              className="text-xs uppercase tracking-[0.3em] text-ink-50/50 hover:text-ink-50"
            >
              ← All posts
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
