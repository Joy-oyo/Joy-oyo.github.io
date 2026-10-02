import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import PaperPlane from "@/components/writing/PaperPlane";
import { blogSections, publishedWritings } from "@/content/writing";
import styles from "@/components/writing/FlightLetter.module.css";

export function generateStaticParams() {
  return publishedWritings.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = publishedWritings.find((entry) => entry.slug === params.slug);
  return {
    title: post ? `${post.title} · Blog` : "Blog",
    description: post?.excerpt,
    openGraph: post ? { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date } : undefined,
  };
}

export default function WritingDetail({ params }: { params: { slug: string } }) {
  const index = publishedWritings.findIndex((entry) => entry.slug === params.slug);
  const post = publishedWritings[index];
  if (!post) notFound();
  const minutes = Math.max(1, Math.round((post.body?.join(" ").split(/\s+/).length ?? 0) / 220));
  const more = [publishedWritings[index - 1], publishedWritings[index + 1]].filter(Boolean);

  return (
    <>
      <main id="main" className={styles.page}>
        <div className={styles.container}>
          <Link href="/writing" className={styles.back}>← Back to the flight map</Link>
          <article className={styles.letter}>
            <header>
              <div className={styles.postmark}>
                <span>FIELD NOTE / {String(index + 1).padStart(3, "0")}</span>
                <PaperPlane />
              </div>
              <p className={styles.topic}>{blogSections.find((section) => section.id === post.section)?.label}</p>
              <h1>{post.title}</h1>
              <div className={styles.meta}>
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time>
                <span>{post.place ?? "From my notebook"}</span>
                <span>{minutes} min read</span>
              </div>
              <p className={styles.excerpt}>{post.excerpt}</p>
            </header>
            <div className={styles.body}>
              {post.body?.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
            <footer className={styles.signature}>
              <span>{post.author ?? "Joy Chen"}</span>
              <span>Still a work in progress.</span>
            </footer>
          </article>
          {more.length > 0 && <nav aria-label="More posts" className={styles.more}>{more.map((sibling) => <Link key={sibling.slug} href={`/writing/${sibling.slug}`}>{sibling.title} ↗</Link>)}</nav>}
          <Link href="/writing" className={styles.return}>Fold it back up <PaperPlane /></Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
