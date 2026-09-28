"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import YinYang from "@/components/YinYang";

// Contact stays out of the pill — the mobile menu and the home hero cover
// that intent. Work and About merged into the Home page (Trajectory
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
  const reduceMotion = useReducedMotion();

  // /reading embeds a paper-white document that owns the whole viewport. The
  // floating pill fights that surface, so there it parks off-screen and
  // slides in only when the pointer reaches the top edge — or when focus lands
  // inside it, which keeps it reachable by keyboard.
  const autoHide = pathname?.startsWith("/reading") ?? false;
  const [revealed, setRevealed] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const pillRef = useRef<HTMLElement | null>(null);

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

  // Small delay so a pointer clipping the edge of the pill does not flicker it.
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

  // Leaving the route drops the pill back to its normal, always-visible state.
  useEffect(() => {
    cancelHide();
    setRevealed(false);
  }, [pathname, cancelHide]);

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

  // Open menu wins over auto-hide: a pill that vanishes under its own menu is
  // worse than one that overstays.
  const barHidden = autoHide && !revealed && !open;

  return (
    <>
      <a href="#main" className={cn("skip-link", focusRing)}>
        Skip to content
      </a>

      {/* Hover target along the very top edge. Deliberately thin, and empty of
          links, so an overshooting cursor reveals the pill while a stray click
          near the top of the document can never navigate anywhere. */}
      {autoHide && (
        <div
          aria-hidden
          onPointerEnter={(e) => reveal(e.pointerType === "mouse" ? undefined : 3500)}
          onPointerLeave={(e) => {
            // Sliding from the strip straight into the pill is a handoff —
            // the pill's own leave handler decides when to dismiss.
            if (pillRef.current?.contains(e.relatedTarget as Node | null)) return;
            dismiss();
          }}
          className="fixed inset-x-0 top-0 z-40 h-6"
        />
      )}

      {/* No bar: the header is only an invisible positioning frame for the
          floating pill. pointer-events-none lets clicks fall through to the
          page (home's empty-click swaps the taiji halves); the pill and the
          hamburger opt back in with pointer-events-auto. Focus/blur still
          bubble to this frame, so keyboard users can summon it on /reading. */}
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
        onFocus={autoHide ? () => reveal() : undefined}
        onBlur={
          autoHide
            ? (e) => {
                // Ignore focus moving between the pill's own links.
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  dismiss(0);
                }
              }
            : undefined
        }
        className="pointer-events-none fixed inset-x-0 top-0 z-50"
      >
        <div className="relative mx-auto flex min-h-[76px] max-w-7xl items-center justify-center gap-4 px-6 py-4 md:min-h-0 md:py-5">
          {/* Desktop nav */}
          <nav
            ref={pillRef}
            aria-label="Main"
            onPointerEnter={autoHide ? () => reveal() : undefined}
            onPointerLeave={autoHide ? () => dismiss() : undefined}
            className="pointer-events-auto hidden md:block"
          >
            <ul className="glass glass-sheen flex items-center gap-1 rounded-full px-2 py-1.5">
              {links.map((l) => {
                const active = isActive(l.href);
                // Photography wears the site's yin-yang seal instead of a
                // word; the glyph flips its colors while the route is active
                // so it stays legible on the light active pill.
                const isPhoto = l.href === "/photography";
                return (
                  <li key={l.href} className="relative">
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      aria-label={isPhoto ? "Photography" : undefined}
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
                      <span className="relative">
                        {isPhoto ? (
                          <YinYang
                            size={18}
                            duration={40}
                            flipped={active}
                            yangColor="#0a0a12"
                            yinColor="#f5f5f0"
                            stroke="rgba(245,245,240,0.35)"
                            title="Photography"
                            className="block"
                          />
                        ) : (
                          l.label
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Mobile hamburger — floats at the right edge, where it sat when
              there was a bar. 44px target. */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "glass glass-sheen pointer-events-auto absolute right-6 top-1/2 flex h-11 w-11 -translate-y-1/2 flex-col items-center justify-center gap-1.5 rounded-full md:hidden",
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
