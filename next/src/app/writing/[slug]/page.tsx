import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { writings } from "@/content/portfolio";

export function generateStaticParams() {
  return writings.map((w) => ({ slug: w.slug }));
}

export default function WritingDetail({
  params,
}: {
  params: { slug: string };
}) {
  const post = writings.find((w) => w.slug === params.slug);
  if (!post) notFound();

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
          <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="display text-4xl md:text-6xl mt-4 text-gradient leading-tight">
            {post.title}
          </h1>
          <p className="mt-6 text-lg text-ink-50/70 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-12 prose prose-invert max-w-none text-ink-50/75 leading-relaxed space-y-6">
            <p>
              This is a placeholder for the essay body. Replace this file with
              your real content — or wire up MDX if you want to write posts in{" "}
              <code>.mdx</code> files with components inside.
            </p>
            <p>
              Small, considered posts work best here. Keep a voice. Link
              generously. Don&apos;t worry about publishing on a schedule.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
