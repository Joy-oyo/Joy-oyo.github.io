"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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

  // /reading embeds a paper-white document that owns the whole viewport. The
  // dark glass bar fights that surface, so there the nav parks off-screen and
  // slides in only when the pointer reaches the top edge — or when focus lands
  // inside it, which keeps it reachable by keyboard.
  const autoHide = pathname?.startsWith("/reading") ?? false;
  const [revealed, setRevealed] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const cancelHide = useCallback(() => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  /** Touch has no "leave" to hide on, so a tapped reveal times itself out. */
  const reveal = useCallback(
    (autoHideAfter?: number) => {
      cancelHide();
      setRevealed(true);
      if (autoHideAfter) {
        hideTimer.current = window.setTimeout(() => setRevealed(false), autoHideAfter);
      }
    },
    [cancelHide]
  );

  // Small delay so a pointer clipping the edge of the bar does not flicker it.
  const dismiss = useCallback(
    (delay = 180) => {
      cancelHide();
      hideTimer.current = window.setTimeout(() => setRevealed(false), delay);
    },
    [cancelHide]
  );

  useEffect(() => cancelHide, [cancelHide]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Leaving the route drops the bar back to its normal, always-visible state.
  useEffect(() => {
    cancelHide();
    setRevealed(false);
  }, [pathname, cancelHide]);

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

  // Open menu wins over auto-hide: a bar that vanishes under its own menu is
  // worse than one that overstays.
  const barHidden = autoHide && !revealed && !open;
  // Nothing scrolls behind the embedded document, so on auto-hide routes the
  // backdrop has to come from the reveal instead — otherwise pale nav text
  // would sit on a transparent bar over a white page.
  const solid = scrolled || (autoHide && !barHidden);

  return (
    <>
      <a href="#main" className={cn("skip-link", focusRing)}>
        Skip to content
      </a>

      {/* Hover target along the very top edge. Deliberately thin, and empty of
          links, so an overshooting cursor reveals the bar while a stray click
          near the top of the document can never navigate anywhere. */}
      {autoHide && (
        <div
          aria-hidden
          onPointerEnter={(e) => reveal(e.pointerType === "mouse" ? undefined : 3500)}
          className="fixed inset-x-0 top-0 z-40 h-6"
        />
      )}

      <motion.header
        initial={reduceMotion ? { opacity: 0 } : { y: -20, opacity: 0 }}
        animate={
          barHidden
            ? { y: reduceMotion ? 0 : "-100%", opacity: 0 }
            : { y: 0, opacity: 1 }
        }
        transition={{
          // Reveal/dismiss wants to feel immediate; the one-off intro on normal
          // routes keeps its original, slower settle.
          duration: autoHide ? (reduceMotion ? 0.2 : 0.4) : 0.6,
          ease: "easeOut",
        }}
        onPointerEnter={autoHide ? () => reveal() : undefined}
        onPointerLeave={autoHide ? () => dismiss() : undefined}
        onFocus={autoHide ? () => reveal() : undefined}
        onBlur={
          autoHide
            ? (e) => {
                // Ignore focus moving between the bar's own links.
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  dismiss(0);
                }
              }
            : undefined
        }
        className={cn(
          // transition-colors, not transition-all: the transform and opacity
          // belong to motion, and a CSS transition on top double-eases them.
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          solid
            ? "border-b border-ink-50/10 bg-ink-950/95 shadow-glass"
            : "border-b border-transparent bg-transparent",
          // Off-screen and unclickable, but still tabbable — focus brings it back.
          barHidden && "pointer-events-none"
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
