"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/content/portfolio";
import YinYang from "@/components/YinYang";

// Contact removed — the "Say hi →" CTA on the right of the bar already
// covers that intent. Work and About merged into the Home page (Trajectory
// section + About section) — no separate Work or About pages anymore.
const links = [
  { label: "Home", href: "/" },
  { label: "Demos", href: "/demos" },
  { label: "Photography", href: "/photography" },
  { label: "Blog", href: "/writing" },
  { label: "Reading", href: "/reading" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduceMotion = useReducedMotion();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Track scroll to add backdrop after first scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Hide nav inside the immersive cyber world
  if (pathname?.startsWith("/cyber")) return null;

  const focusRing =
    "outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  return (
    <>
      <a href="#main" className={cn("skip-link", focusRing)}>
        Skip to content
      </a>

      <motion.header
        initial={reduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-ink-50/10 bg-ink-950/95 shadow-glass"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:py-5">
          <div className="flex items-center gap-2.5">
            {/* Quiet yin-yang glyph — the visual seal that this site is
                organised around the unity of opposites (industry/research,
                making/knowing, code/photo). Purely decorative here; the
                clickable version lives at the seam in the Trajectory
                section below. */}
            <YinYang
              size={22}
              yangColor="#0a0a12"
              yinColor="#f5f5f0"
              stroke="rgba(245,245,240,0.35)"
              duration={40}
            />
            <Link
              href="/"
              aria-label={`${site.name} — home`}
              className={cn("flex items-center gap-2 rounded-md", focusRing)}
            >
              <span className="display text-2xl text-ink-50">{site.initials}</span>
              <span className="hidden text-sm text-ink-50/60 md:inline">
                {site.name}
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden md:block">
            <ul className="glass glass-sheen flex items-center gap-1 rounded-full px-2 py-1.5">
              {links.map((l) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href} className="relative">
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // Tighter at md so five items plus the CTA still fit on
                        // a tablet; full padding returns at lg.
                        "relative block rounded-full px-3 py-2 text-xs uppercase tracking-wide transition-colors lg:px-4",
                        focusRing,
                        active ? "text-ink-950" : "text-ink-50/65 hover:text-ink-50"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden
                          transition={
                            reduceMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 420, damping: 34 }
                          }
                          className="absolute inset-0 rounded-full bg-ink-50 shadow-[0_6px_20px_-8px_rgba(245,245,240,0.7)]"
                        />
                      )}
                      <span className="relative">{l.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className={cn(
              "glass-chip glass-sheen hidden items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest text-ink-50/75 transition-colors hover:text-ink-50 md:inline-flex",
              focusRing
            )}
          >
            Say hi
            <span aria-hidden>→</span>
          </Link>

          {/* Mobile hamburger — 44px target */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "glass glass-sheen relative flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full md:hidden",
              focusRing
            )}
          >
            <motion.span
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-px w-4 bg-ink-50"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-px w-4 bg-ink-50"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink-950/95 md:hidden"
          >
            <div className="h-[72px]" />
            <nav aria-label="Mobile" className="flex flex-1 flex-col px-6 pb-10 pt-4">
              <ul className="glass-card glass-sheen overflow-hidden rounded-3xl px-5 py-2">
                {links.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.li
                      key={l.href}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                      className="border-b border-ink-50/8 last:border-b-0"
                    >
                      <Link
                        href={l.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-baseline justify-between rounded-xl py-4",
                          focusRing,
                          active ? "text-ink-50" : "text-ink-50/60"
                        )}
                      >
                        <span className="display flex items-center gap-3 text-3xl">
                          {active && (
                            <span
                              aria-hidden
                              className="h-1.5 w-1.5 rounded-full bg-klein shadow-[0_0_12px_rgba(0,47,167,0.9)]"
                            />
                          )}
                          {l.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                          {String(i).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="glass glass-sheen mt-6 rounded-2xl p-5 text-sm text-ink-50/50">
                <a
                  href={`mailto:${site.email}`}
                  className={cn(
                    "rounded border-b border-ink-50/20 pb-0.5 text-ink-50/85 hover:border-ink-50 hover:text-ink-50",
                    focusRing
                  )}
                >
                  {site.email}
                </a>
                <div className="mt-4 flex gap-5 text-xs uppercase tracking-[0.25em]">
                  {site.socials.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className={cn("rounded hover:text-ink-50", focusRing)}
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                className={cn(
                  "mt-6 flex items-center justify-center gap-2 rounded-full bg-ink-50 py-4 text-xs uppercase tracking-[0.3em] font-medium text-ink-950",
                  focusRing
                )}
              >
                Say hi
                <span aria-hidden>→</span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
