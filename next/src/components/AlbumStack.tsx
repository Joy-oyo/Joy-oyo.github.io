"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { albums } from "@/content/portfolio";
import { cn } from "@/lib/cn";

/**
 * AlbumStack — 3D card stack interaction.
 * - Default: cards stacked with slight offset & rotation.
 * - Navigation: click next/prev, keyboard ← →, wheel, or direct card click.
 * - Top card flips + exits on advance; new top rises to front.
 */
export default function AlbumStack() {
  const [index, setIndex] = useState(0);
  const total = albums.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total]
  );

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Wheel (section-scoped, throttled)
  useEffect(() => {
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      const target = document.getElementById("albums");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const inView = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
      if (!inView) return;
      if (locked) return;
      if (Math.abs(e.deltaY) < 30) return;
      locked = true;
      if (e.deltaY > 0) next();
      else prev();
      setTimeout(() => (locked = false), 700);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  return (
    <section
      id="albums"
      className="relative flex flex-col items-center px-6 pt-4 pb-24"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10 md:mb-12"
      >
        <span className="text-xs uppercase tracking-[0.4em] text-ink-50/50">
          The Albums
        </span>
        <h2 className="display text-4xl md:text-6xl mt-4 text-gradient">
          Pick a world to enter
        </h2>
        <p className="mt-4 text-sm text-ink-50/60 max-w-md mx-auto">
          Click a card, use ← → keys, or scroll. Each album opens a different
          corner of my work.
        </p>
      </motion.div>

      {/* Stack */}
      <div className="relative w-full max-w-2xl h-[520px] md:h-[560px] perspective-1000">
        <AnimatePresence initial={false}>
          {albums.map((album, i) => {
            // Distance from current top
            const distance = (i - index + total) % total;
            // Only render top 4 cards for perf
            if (distance > 3) return null;

            const isTop = distance === 0;
            const offset = distance * 36; // px Y — more visible stagger
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
                  rotateY: 90,
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
                <AlbumCard album={album} isTop={isTop} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-12 flex items-center gap-6">
        <button
          onClick={prev}
          className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-ink-50 hover:text-ink-950 transition-colors"
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
          className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-ink-50 hover:text-ink-950 transition-colors"
          aria-label="Next album"
        >
          →
        </button>
      </div>

      <div className="mt-6 text-[10px] uppercase tracking-[0.3em] text-ink-50/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </section>
  );
}

function AlbumCard({
  album,
  isTop,
}: {
  album: (typeof albums)[number];
  isTop: boolean;
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
      <div className="relative h-full flex flex-col justify-between p-8 md:p-10">
        <div className="flex items-start justify-between">
          <span className="text-[10px] uppercase tracking-[0.4em] text-ink-50/60">
            {album.eyebrow}
          </span>
          <span className="display text-5xl md:text-6xl text-ink-50/20">
            {album.index}
          </span>
        </div>

        <div>
          <h3 className="display text-4xl md:text-5xl text-ink-50 leading-tight">
            {album.title}
          </h3>
          <p className="mt-3 text-sm md:text-base text-ink-50/70 max-w-md">
            {album.subtitle}
          </p>
          <p className="mt-4 text-xs md:text-sm text-ink-50/50 max-w-md leading-relaxed">
            {album.description}
          </p>

          <Link
            href={album.href}
            onClick={(e) => {
              if (!isTop) e.preventDefault();
            }}
            className={cn(
              "mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest",
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
