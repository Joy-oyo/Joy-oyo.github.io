"use client";

import { useEffect, useState } from "react";

type Section = { id: string; label: string };

/**
 * SectionNav — scroll-spy table of contents for the long project page.
 *
 * Two presentations from one source of truth: a fixed rail on very wide
 * screens (where there's dead margin to spend) and a horizontally scrollable
 * sticky strip everywhere else, offset to clear the fixed site header.
 */
export default function SectionNav({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Topmost intersecting section wins, so scrolling up feels symmetrical.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      // A band across the middle of the viewport — a section is "current"
      // once it owns the reader's centre, not the moment it peeks in.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const focusRing =
    "outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  return (
    <>
      {/* Wide screens — fixed rail in the left margin. */}
      <nav
        aria-label="Sections"
        className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block"
      >
        <ul className="pointer-events-auto flex flex-col gap-1">
          {sections.map((section, i) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex items-center gap-3 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors ${focusRing} ${
                    isActive ? "text-ink-50" : "text-ink-50/35 hover:text-ink-50/70"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-px transition-all duration-300 ${
                      isActive ? "w-6 bg-ink-50" : "w-3 bg-ink-50/30 group-hover:w-5"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-ink-50/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Everything else — sticky strip beneath the site header. */}
      <div className="sticky top-[64px] z-30 mt-14 border-y border-ink-50/10 bg-ink-950/92 backdrop-blur-sm 2xl:hidden">
        <nav aria-label="Sections" className="mx-auto max-w-4xl px-6">
          <ul className="no-scrollbar flex gap-1 overflow-x-auto py-2">
            {sections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id} className="shrink-0">
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`block whitespace-nowrap rounded-full px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors ${focusRing} ${
                      isActive
                        ? "bg-ink-50 font-medium text-ink-950"
                        : "text-ink-50/45 hover:text-ink-50"
                    }`}
                  >
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
