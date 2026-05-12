"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { albums } from "@/content/portfolio";
import { cn } from "@/lib/cn";

/**
 * AlbumStack — 3D card stack interaction.
 * - Default: cards stacked with slight offset & rotation.
 * - Navigation: click next/prev, keyboard ← →, wheel, or direct card click.
 * - Top card flips + exits on advance; new top rises to front.
 *
 * compact: when true, render without section wrapper/header and with a
 * smaller stack — designed to sit inside the hero's right column.
 */
export default function AlbumStack({ compact = false }: { compact?: boolean } = {}) {
  const [index, setIndex] = useState(0);
  const total = albums.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total]
  );

  // Helper: only react if the stack is actually visible in viewport.
  const isStackInView = useCallback(() => {
    const el = rootRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.bottom > 0 &&
      rect.top < window.innerHeight &&
      rect.right > 0 &&
      rect.left < window.innerWidth
    );
  }, []);

  // Keyboard — only when stack is in view AND focus isn't in a form field
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (!isStackInView()) return;
      if (e.key === "ArrowRight") next();
      else prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, isStackInView]);

  // Wheel (section-scoped, throttled) — only in full/standalone mode
  useEffect(() => {
    if (compact) return;
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      if (!isStackInView()) return;
      if (locked) return;
      if (Math.abs(e.deltaY) < 30) return;
      locked = true;
      if (e.deltaY > 0) next();
      else prev();
      setTimeout(() => (locked = false), 700);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev, compact, isStackInView]);

  // Custom events — let external UI (e.g. Landing's hint arrows) drive the stack
  useEffect(() => {
    const onPrev = () => prev();
    const onNext = () => next();
    window.addEventListener("albumstack:prev", onPrev);
    window.addEventListener("albumstack:next", onNext);
    return () => {
      window.removeEventListener("albumstack:prev", onPrev);
      window.removeEventListener("albumstack:next", onNext);
    };
  }, [next, prev]);

  // --- Inner stack (shared between compact and full) ---
  const stack = (
    <div
      className={cn(
        "relative w-full perspective-1000",
        compact
          ? "max-w-md h-[420px] md:h-[480px]"
          : "max-w-2xl h-[520px] md:h-[560px]"
      )}
    >
      <AnimatePresence initial={false}>
        {albums.map((album, i) => {
          const distance = (i - index + total) % total;
          if (distance > 3) return null;

          const isTop = distance === 0;
          const offset = distance * 36;
          const xOffset = (distance % 2 === 0 ? -1 : 1) * distance * 10;
          const rotateDelta = (distance % 2 === 0 ? -1 : 1) * distance * 3;
          const scale = 1 - distance * 0.06;
          const opacity = distance === 3 ? 0.45 : 1 - distance * 0.12;

          return (
            <motion.div
              key={album.id}
              initial={{
                x: xOffset,
                y: offset + 40,
                rotate: rotateDelta,
                scale,
                opacity: 0,
              }}
              animate={{
                x: xOffset,
                y: offset,
                rotate: rotateDelta,
                scale,
                opacity,
                zIndex: total - distance,
              }}
              exit={{
                y: -40,
                rotateY: prefersReducedMotion ? 0 : 90,
                opacity: 0,
                transition: { duration: 0.5 },
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 26,
              }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -100) next();
                else if (info.offset.x > 100) prev();
              }}
              onClick={() => !isTop && setIndex(i)}
              className={cn(
                "absolute inset-0 preserve-3d cursor-pointer",
                isTop ? "cursor-grab active:cursor-grabbing" : ""
              )}
              style={{ transformStyle: "preserve-3d" }}
            >
              <AlbumCard album={album} isTop={isTop} compact={compact} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );

  // --- Controls (shared) ---
  const controls = (
    <>
      <div
        className={cn(
          "flex items-center gap-6",
          compact ? "mt-8" : "mt-12"
        )}
      >
        <button
          onClick={prev}
          className="glass w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-ink-50 hover:text-ink-950 transition-colors"
          aria-label="Previous album"
        >
          ←
        </button>

        <div className="flex gap-2">
          {albums.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1 rounded-full transition-all",
                i === index ? "w-8 bg-ink-50" : "w-4 bg-ink-50/30"
              )}
              aria-label={`Go to ${a.title}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="glass w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-ink-50 hover:text-ink-950 transition-colors"
          aria-label="Next album"
        >
          →
        </button>
      </div>

      <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </>
  );

  // --- Compact: no wrapper section, no header — sits inside hero column ---
  if (compact) {
    return (
      <div ref={rootRef} className="relative flex flex-col items-center w-full">
        {stack}
        {controls}
      </div>
    );
  }

  // --- Full: standalone section (not used when inlined in hero) ---
  return (
    <section
      ref={rootRef}
      id="albums"
      className="relative flex flex-col items-center px-6 pt-8 md:pt-12 pb-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 md:mb-12"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-ink-50/50">
          Browse by album
        </span>
        <h2 className="display text-3xl md:text-4xl mt-4 text-ink-50/90">
          A few corners of the work
        </h2>
        <p className="mt-3 text-xs text-ink-50/50 max-w-sm mx-auto">
          Click a card, use ← → keys, or scroll.
        </p>
      </motion.div>

      {stack}
      {controls}
    </section>
  );
}

function AlbumCard({
  album,
  isTop,
  compact = false,
}: {
  album: (typeof albums)[number];
  isTop: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full h-full rounded-3xl overflow-hidden glass-strong",
        "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      )}
    >
      {/* Gradient wash */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-70",
          album.accent
        )}
      />

      {/* Optional cover image */}
      {album.cover && (
        <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
          <Image
            src={album.cover}
            alt=""
            fill
            sizes="600px"
            className="object-cover"
          />
        </div>
      )}

      {/* Inner border */}
      <div className="absolute inset-4 rounded-2xl border border-ink-50/10 pointer-events-none" />

      {/* Content */}
      <div
        className={cn(
          "relative h-full flex flex-col justify-between",
          compact ? "p-6 md:p-7" : "p-8 md:p-10"
        )}
      >
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.4em] text-ink-50/60">
            {album.eyebrow}
          </span>
          <span
            className={cn(
              "display text-ink-50/20",
              compact ? "text-4xl" : "text-5xl md:text-6xl"
            )}
          >
            {album.index}
          </span>
        </div>

        <div>
          <h3
            className={cn(
              "display text-ink-50 leading-tight",
              compact ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
            )}
          >
            {album.title}
          </h3>
          <p
            className={cn(
              "mt-2 text-ink-50/70 max-w-md",
              compact ? "text-xs md:text-sm" : "text-sm md:text-base mt-3"
            )}
          >
            {album.subtitle}
          </p>
          {!compact && (
            <p className="mt-4 text-xs md:text-sm text-ink-50/50 max-w-md leading-relaxed">
              {album.description}
            </p>
          )}

          <Link
            href={album.href}
            onClick={(e) => {
              if (!isTop) e.preventDefault();
            }}
            className={cn(
              "mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest",
              "border-b border-ink-50/40 pb-1 transition-opacity",
              isTop ? "opacity-100 hover:text-ink-50 hover:border-ink-50" : "opacity-0"
            )}
          >
            Open {album.title} →
          </Link>
        </div>
      </div>
    </div>
  );
}
