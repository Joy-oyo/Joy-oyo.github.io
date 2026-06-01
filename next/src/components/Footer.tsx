import Link from "next/link";
import { site } from "@/content/portfolio";

export default function Footer() {
  return (
    <footer className="relative border-t border-ink-50/10 mt-12">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <div className="display text-3xl">{site.name}</div>
          <p className="mt-3 text-sm text-ink-50/60 max-w-xs">
            {site.tagline}
          </p>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-ink-50/40 mb-3">
            Elsewhere
          </div>
          <ul className="space-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink-50/70 hover:text-ink-50"
                >
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-ink-50/40 mb-3">
            Get in touch
          </div>
          <Link
            href="/contact"
            className="text-sm text-ink-50/70 hover:text-ink-50"
          >
            {site.email}
          </Link>
        </div>
      </div>

      <div className="border-t border-ink-50/5 py-6 text-center text-xs text-ink-50/40">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
