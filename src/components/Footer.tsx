import Link from "next/link";
import { site } from "@/content/site";

/**
 * Footer — the closing card of every page.
 *
 * Default: a full-width glass band, used by every route.
 *
 * With `polarity`: a seed card in the taiji palette. That is how the home
 * page renders it — the right-hand card of the closing pair, opposite
 * Education. It then takes the opposite polarity to the half it sits in
 * and reads through the `on` tokens, so it stays legible after the flip.
 */
export default function Footer({ polarity }: { polarity?: "yang" | "yin" } = {}) {
  const focusRing =
    "rounded outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  // Two palettes: polarity-aware tokens on the split, the site-wide ink
  // scale everywhere else (other pages keep their exact current look).
  const c = (on: string, ink: string) => (polarity ? on : ink);

  // On the home split the footer is a card in the closing pair, not a
  // sign-off: it carries only outbound links plus the contact route.
  // The email address itself is never printed here.
  if (polarity) {
    return (
      <footer>
        <div data-polarity={polarity} className="overflow-hidden taiji-seed">
          <div className="px-7 pb-6 pt-9">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex items-center gap-2 transition-colors text-on2 hover:text-on ${focusRing}`}
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
            <a
              href="/contact"
              className={`glass-chip glass-sheen mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.28em] transition-colors text-on2 hover:text-on ${focusRing}`}
            >
              Get in touch
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={c("", "relative mt-20 px-6 pb-10")}>
      <div
        data-polarity={polarity}
        className={`overflow-hidden ${c(
          "taiji-seed",
          "glass-card glass-sheen mx-auto max-w-7xl rounded-[2rem]"
        )}`}
      >
        <div className={`grid gap-8 px-7 pt-9 ${polarity ? "" : "md:grid-cols-2 md:px-12 md:pb-12 md:pt-14"}`}>
          <div>
            <div className={`display text-3xl ${c("text-on", "text-ink-50")}`}>{site.name}</div>
            <p className={`mt-3 max-w-xs text-sm leading-relaxed ${c("text-on2", "text-ink-50/60")}`}>
              {site.taglineSignOff}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className={`inline-flex items-center gap-2 text-xs ${c("text-on2", "text-ink-50/65")}`}>
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-emerald-300/80 shadow-[0_0_10px_rgba(110,231,183,0.8)]"
                />
                {site.location}
              </p>
            </div>
          </div>

          <div>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-sm sm:gap-x-12">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group inline-flex items-center gap-2 transition-colors ${c(
                      "text-on2 hover:text-on",
                      "text-ink-50/70 hover:text-ink-50"
                    )} ${focusRing}`}
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
            <Link
              href="/contact"
              className={`glass-chip glass-sheen mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[10px] uppercase tracking-[0.28em] transition-colors ${c(
                "text-on2 hover:text-on",
                "text-ink-50/75 hover:text-ink-50"
              )} ${focusRing}`}
            >
              Get in touch
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
