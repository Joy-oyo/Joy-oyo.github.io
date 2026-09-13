"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * YinYang — a hand-tuned taiji (太极) glyph.
 *
 * Two halves (yang/black and yin/white) chase one another. Each contains
 * a small "seed" of its opposite — the canonical reminder that the two
 * forces are not separable. Used site-wide as a quiet emblem of the
 * Industry/Research duality that organises this portfolio.
 *
 * The whole thing is a single SVG path so it scales crisply at any size
 * and inherits its colors from props (no CSS knowledge required).
 *
 * When `interactive`, it renders as a small button: clicking it flips
 * the glyph — swapping which half is black/white and reversing the spin
 * direction. This is a purely local, decorative toggle; it does not
 * affect the site-wide theme.
 */
export default function YinYang({
  size = 56,
  spin = true,
  duration = 28,
  yangColor = "#0a0a12", // black half (industry / yang)
  yinColor = "#f5f5f0", // white half (research / yin)
  stroke = "rgba(10,10,18,0.35)",
  className = "",
  title = "Yin-Yang",
  interactive = false,
  flipped: flippedProp,
  onToggle,
}: {
  size?: number;
  /** Whether the symbol slowly rotates. Respects prefers-reduced-motion. */
  spin?: boolean;
  /** Full rotation duration in seconds. */
  duration?: number;
  yangColor?: string;
  yinColor?: string;
  stroke?: string;
  className?: string;
  title?: string;
  /** Render as a clickable toggle button that flips colors + spin direction. */
  interactive?: boolean;
  /** Controlled mode: current flipped state, owned by a parent (e.g. so
   *  the parent can also flip surrounding panel colors in sync). If
   *  omitted, the glyph manages its own local flipped state. */
  flipped?: boolean;
  /** Controlled mode: called on click instead of toggling local state. */
  onToggle?: () => void;
}) {
  const reduce = useReducedMotion();
  const [localFlipped, setLocalFlipped] = useState(false);
  const isControlled = flippedProp !== undefined;
  const flipped = isControlled ? flippedProp : localFlipped;

  const handleClick = () => {
    if (onToggle) onToggle();
    else setLocalFlipped((f) => !f);
  };

  // Flipping swaps which half is which color, and reverses the direction
  // of rotation — a self-contained visual "flip", nothing else on the
  // page reacts to this state (unless controlled by a parent).
  const yang = flipped ? yinColor : yangColor;
  const yin = flipped ? yangColor : yinColor;
  const direction = flipped ? -1 : 1;
  const animate = spin && !reduce ? { rotate: direction * 360 } : { rotate: 0 };

  const glyph = (
    <motion.svg
      key={flipped ? "flipped" : "base"}
      role="img"
      aria-label={title}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={interactive ? "" : className}
      animate={animate}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      <title>{title}</title>

      {/* Outer disk — the white (yin) half is the background circle. */}
      <circle
        cx="50"
        cy="50"
        r="49"
        style={{ fill: yin, transition: "fill 0.4s ease" }}
        stroke={stroke}
        strokeWidth="1"
      />

      {/* The classic S-curve: the black (yang) half.
          Built from a half-circle plus two semicircles that swap sides,
          producing the taiji wave. */}
      <path
        d="
          M 50 1
          A 49 49 0 0 1 50 99
          A 24.5 24.5 0 0 1 50 50
          A 24.5 24.5 0 0 0 50 1
          Z
        "
        style={{ fill: yang, transition: "fill 0.4s ease" }}
      />

      {/* Seeds — each half holds a small dot of the opposite color. */}
      <circle cx="50" cy="25.5" r="6" style={{ fill: yin, transition: "fill 0.4s ease" }} />
      <circle cx="50" cy="74.5" r="6" style={{ fill: yang, transition: "fill 0.4s ease" }} />
    </motion.svg>
  );

  if (!interactive) return glyph;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.9 }}
      aria-pressed={flipped}
      aria-label="Flip the yin-yang glyph"
      title="Flip the yin-yang glyph"
      className={`inline-flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-klein focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 ${className}`}
    >
      {glyph}
    </motion.button>
  );
}
