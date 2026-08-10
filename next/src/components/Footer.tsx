import Link from "next/link";
import { site } from "@/content/portfolio";

export default function Footer() {
  const focusRing =
    "rounded outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  return (
    <footer className="relative mt-20 px-6 pb-10">
      <div className="glass-card glass-sheen mx-auto max-w-7xl overflow-hidden rounded-[2rem]">
        <div className="grid gap-12 px-8 py-14 md:grid-cols-3 md:px-12">
          <div>
            <div className="display text-3xl text-ink-50">{site.name}</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-50/60">
              {site.tagline}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 text-xs text-ink-50/45">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-emerald-300/80 shadow-[0_0_10px_rgba(110,231,183,0.8)]"
              />
              {site.location}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
              Elsewhere
            </h2>
            <ul className="space-y-2.5 text-sm">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex items-center gap-2 text-ink-50/70 transition-colors hover:text-ink-50 ${focusRing}`}
                  >
                    {s.label}
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
              Get in touch
            </h2>
            <Link
              href="/contact"
              className={`text-sm text-ink-50/70 transition-colors hover:text-ink-50 ${focusRing}`}
            >
              {site.email}
            </Link>
            <Link
              href="/contact"
              className={`glass-chip glass-sheen mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-ink-50/75 transition-colors hover:text-ink-50 ${focusRing}`}
            >
              Start a conversation
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-ink-50/8 px-8 py-6 text-center text-xs text-ink-50/40 md:px-12">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
