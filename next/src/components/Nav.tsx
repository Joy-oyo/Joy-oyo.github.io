"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/content/portfolio";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Photography", href: "/photography" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-colors duration-300",
          scrolled ? "bg-ink-950/55 backdrop-blur-xl border-b border-ink-50/8" : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 md:py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-4 focus-visible:ring-offset-ink-950 rounded-md"
          >
            <span className="display text-2xl text-ink-50">{site.initials}</span>
            <span className="hidden md:inline text-sm text-ink-50/60">
              {site.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "px-4 py-1.5 text-xs tracking-wide uppercase rounded-full transition-colors",
                    active
                      ? "bg-ink-50 text-ink-950"
                      : "text-ink-50/70 hover:text-ink-50"
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex text-xs uppercase tracking-widest text-ink-50/70 hover:text-ink-50 transition-colors"
          >
            Say hi →
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-full glass"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-4 h-px bg-ink-50"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block w-4 h-px bg-ink-50"
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
            className="md:hidden fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl flex flex-col"
          >
            <div className="h-[72px]" />
            <nav className="flex-1 px-6 pt-6 pb-10 flex flex-col">
              <ul className="space-y-1">
                {links.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                    >
                      <Link
                        href={l.href}
                        className={cn(
                          "flex items-baseline justify-between py-4 border-b border-ink-50/8",
                          active ? "text-ink-50" : "text-ink-50/60"
                        )}
                      >
                        <span className="display text-3xl">{l.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
                          {String(i).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-10 text-sm text-ink-50/50">
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink-50/80 hover:text-ink-50 border-b border-ink-50/20 hover:border-ink-50 pb-0.5"
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
                      className="hover:text-ink-50"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
