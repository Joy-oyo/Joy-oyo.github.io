import type { ReactNode } from "react";

/**
 * LabSection — the numbered H2 block that every section of the project page
 * sits inside. Keeps the rhythm (rule → number → title → lede → content)
 * identical down the page so the long scroll stays legible.
 */
export default function LabSection({
  id,
  index,
  title,
  lede,
  children,
}: {
  id: string;
  index: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto mt-24 max-w-4xl scroll-mt-28 px-6 md:mt-32"
    >
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/35">
          {index}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 bg-gradient-to-r from-ink-50/25 via-ink-50/10 to-transparent"
        />
      </div>

      <h2
        id={`${id}-title`}
        className="display mt-5 text-3xl leading-tight text-gradient md:text-[2.75rem]"
      >
        {title}
      </h2>

      {lede && (
        <p className="mt-5 max-w-3xl text-[15px] leading-[1.75] text-ink-50/70 md:text-base">
          {lede}
        </p>
      )}

      <div className="mt-10">{children}</div>
    </section>
  );
}
