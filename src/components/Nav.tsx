"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import YinYang from "@/components/YinYang";
import styles from "./Nav.module.css";

// Contact stays out of the pill — the mobile menu and the home hero cover
// that intent. Work and About merged into the Home page (Trajectory
// section + About section). Reading lives in the home page's secret
// bookshelf, so it has no page of its own either.
const links = [
  { label: "Home", href: "/" },
  { label: "Demo", href: "/demos" },
  { label: "Blog", href: "/writing" },
  { label: "Arte", href: "/photography" },
];

// The desktop pill splits its links around a decorative yin-yang seal.
const SEAL_AT = Math.ceil(links.length / 2);

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // A rotation or resize into the desktop layout must also release scroll.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const onChange = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
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

  // The bookshelf lives on the home page (TaijiHome). There, ask it to open;
  // anywhere else, go home with the hash TaijiHome opens it from.
  const openBookshelf = () => {
    // Release the menu's scroll lock before the shelf saves the body's styles.
    flushSync(() => setOpen(false));
    if (pathname === "/") window.dispatchEvent(new CustomEvent("bookshelf:open"));
    else router.push("/#bookshelf");
  };

  // Hide nav inside the immersive cyber world
  if (pathname?.startsWith("/cyber")) return null;

  const focusRing =
    "outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

  return (
    <>
      <a href="#main" className={cn("skip-link", focusRing)}>
        Skip to content
      </a>

      {/* No bar: the header is only an invisible positioning frame for the
          floating pill. pointer-events-none lets clicks fall through to the
          page (home's empty-click swaps the taiji halves); the pill and the
          hamburger opt back in with pointer-events-auto. */}
      <motion.header
        initial={reduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[80]"
      >
        <div className={cn(styles.frame, "relative mx-auto flex max-w-7xl items-center justify-center md:px-6 md:py-5")}>
          {/* Desktop nav */}
          <nav aria-label="Main" className="pointer-events-auto hidden md:block">
            <ul className="glass glass-sheen flex items-center gap-1 rounded-full px-2 py-1.5">
              {links.map((l, i) => {
                const active = isActive(l.href);
                return (
                  <li key={l.href} className="relative flex items-center">
                    {/* The site's seal, centred in the pill — and the second
                        door to the secret bookshelf (the first is the home
                        page's seam). */}
                    {i === SEAL_AT && (
                      <button
                        type="button"
                        onClick={openBookshelf}
                        aria-label="Open secret bookshelf"
                        aria-haspopup="dialog"
                        title="Secret bookshelf"
                        className={cn(
                          "mx-0.5 rounded-full p-1.5 transition-transform duration-300 hover:scale-110 lg:mx-1",
                          focusRing
                        )}
                      >
                        <YinYang
                          size={18}
                          duration={40}
                          yangColor="#0a0a12"
                          yinColor="#f5f5f0"
                          stroke="rgba(245,245,240,0.35)"
                          className="block"
                        />
                      </button>
                    )}
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // Tighter at md so five items still fit on a tablet;
                        // full padding returns at lg.
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

          {/* A single mobile pill keeps both entrances visible and aligned. */}
          <div className="glass glass-sheen pointer-events-auto flex w-full max-w-sm items-center justify-between rounded-full p-1.5 md:hidden">
            <button
              type="button"
              onClick={openBookshelf}
              aria-label="Open secret bookshelf"
              aria-haspopup="dialog"
              className={cn("flex min-h-11 items-center gap-2.5 rounded-full px-3 text-xs text-ink-50/85", focusRing)}
            >
              <YinYang size={24} duration={40} yangColor="#0a0a12" yinColor="#f5f5f0" stroke="rgba(245,245,240,0.35)" className="block shrink-0" />
              <span>Secret shelf</span>
            </button>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className={cn(
                "flex min-h-11 items-center justify-center gap-3 rounded-full px-4 text-xs text-ink-50/85",
                focusRing
              )}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span aria-hidden="true" className="relative block h-4 w-4">
                <motion.span
                  animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-1/2 block h-px w-4 bg-ink-50"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 top-1/2 block h-px w-4 bg-ink-50"
                />
              </span>
            </button>
          </div>
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
            className={cn(styles.menu, "fixed inset-0 z-[70] flex flex-col bg-ink-950 md:hidden")}
          >
            <nav aria-label="Mobile" className={cn(styles.menuContent, "mx-auto flex w-full max-w-md flex-col")}>
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
                        onClick={() => setOpen(false)}
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
                        <span className="text-[10px] uppercase tracking-[0.3em] text-ink-50/60">
                          {String(i).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="glass glass-sheen mt-6 rounded-2xl p-5 text-sm text-ink-50/70">
                <a
                  href={`mailto:${site.email}`}
                  className={cn(
                    "rounded border-b border-ink-50/20 pb-0.5 text-ink-50/85 hover:border-ink-50 hover:text-ink-50",
                    focusRing
                  )}
                >
                  {site.email}
                </a>
                <div className="mt-4 flex flex-wrap gap-5 text-xs uppercase tracking-[0.25em]">
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
                onClick={() => setOpen(false)}
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
