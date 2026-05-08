"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="display text-2xl text-ink-50">{site.initials}</span>
          <span className="hidden md:inline text-sm text-ink-50/60">
            {site.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
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

        <Link
          href="/contact"
          className="text-xs uppercase tracking-widest text-ink-50/70 hover:text-ink-50"
        >
          Say hi →
        </Link>
      </div>
    </motion.header>
  );
}
