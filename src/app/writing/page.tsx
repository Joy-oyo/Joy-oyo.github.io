import { Fragment } from "react";
import Link from "next/link";
import ComingSoon from "@/components/ComingSoon";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SectionNav from "@/components/demos/SectionNav";
import { BLOG_COMING_SOON, blogSections, writings, type Writing } from "@/content/writing";

export const metadata = { title: "Blog — Joy Chen" };

const pad = (n: number) => String(n).padStart(2, "0");

// Each topic's posts, newest first. Hidden entirely while the blog is paused.
const sections = blogSections.map((s) => ({
  ...s,
  posts: BLOG_COMING_SOON
    ? []
    : writings
        .filter((w) => w.section === s.id)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
}));

const navSections = blogSections.map(({ id, label }) => ({ id, label }));

/** Rough reading time so readers can judge the commitment up front. */
function readingTime(body?: string[]) {
  if (!body || body.length === 0) return null;
  const words = body.join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

/** "Nov 2024" — ISO dates parse as UTC midnight, so format in UTC to avoid off-by-one days. */
function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function WritingPage() {
  return (
    <>
      <main id="main" className="relative pb-24 pt-32">
        <PageHeader
          size="md"
          title="Some thoughts about today's world"
          lede="The intersection of tech x humanities"
        />

        <SectionNav sections={navSections} width="max-w-6xl" />

        <div className="mx-auto mt-10 max-w-6xl px-6">
          {sections.map((s, i) => (
            <TopicSection key={s.id} id={s.id} label={s.label} posts={s.posts} index={i} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function TopicSection({
  id,
  label,
  posts,
  index,
}: {
  id: string;
  label: string;
  posts: Writing[];
  index: number;
}) {
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="grid scroll-mt-28 border-t border-ink-50/10 py-12 last:border-b md:grid-cols-[11rem_minmax(0,1fr)] md:gap-x-12 md:py-16"
    >
      {/* Topic rail — sticks below the section strip while its posts scroll past. */}
      <div className="mb-8 flex items-baseline justify-between md:sticky md:top-36 md:mb-0 md:block md:self-start min-[1700px]:top-28">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-50/35">
            {pad(index + 1)}
          </p>
          <h2 id={headingId} className="display mt-2 text-3xl leading-none text-ink-50/80 md:text-4xl">
            {label}
          </h2>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-50/30 md:mt-3">
          {posts.length === 0 ? "Soon" : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
        </p>
      </div>

      <div className="min-w-0">
        {posts.length === 0 ? <ComingSoon /> : <PostList posts={posts} />}
      </div>
    </section>
  );
}

function PostList({ posts }: { posts: Writing[] }) {
  return (
    <ol className="divide-y divide-ink-50/[0.06]">
      {posts.map((post, i) => {
        const meta = [readingTime(post.body), ...(post.tags ?? [])].filter(
          (m): m is string => Boolean(m)
        );

        return (
          <li key={post.slug} className="animate-rise" style={{ animationDelay: `${200 + i * 80}ms` }}>
            <Link
              href={`/writing/${post.slug}`}
              className="group relative -mx-4 my-1 grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-5 rounded-2xl px-4 py-7 transition-colors duration-300 hover:bg-ink-50/[0.03] focus-visible:rounded-2xl focus-visible:bg-ink-50/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klein sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:gap-x-8"
            >
              {/* Klein accent that draws in on hover / focus. */}
              <span
                aria-hidden
                className="absolute bottom-7 left-0 top-7 w-[2px] origin-top scale-y-0 rounded-full bg-klein shadow-[0_0_12px_rgba(0,47,167,0.9)] transition-transform duration-500 ease-out-soft group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />

              <time
                dateTime={post.date}
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50/40"
              >
                {shortDate(post.date)}
              </time>

              <div className="min-w-0">
                <h3 className="display text-2xl leading-[1.15] text-ink-50/85 transition-colors duration-300 group-hover:text-ink-50 md:text-[2rem]">
                  {post.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-50/55 md:text-[15px]">
                  {post.excerpt}
                </p>

                {meta.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] uppercase tracking-[0.24em] text-ink-50/40">
                    {meta.map((m, j) => (
                      <Fragment key={m}>
                        {j > 0 && (
                          <span aria-hidden className="text-ink-50/20">
                            ·
                          </span>
                        )}
                        <span>{m}</span>
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>

              <span
                aria-hidden
                className="hidden text-lg text-ink-50/25 transition-all duration-500 ease-out-soft group-hover:translate-x-1 group-hover:text-ink-50 sm:block"
              >
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
