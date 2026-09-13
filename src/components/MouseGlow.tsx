"use client";

import { useEffect, useRef } from "react";

/**
 * MouseGlow — a soft radial spotlight that follows the cursor.
 * - Pure CSS + rAF lerp for smooth trailing.
 * - Fixed full-screen layer, non-interactive, sits above 3D scene.
 * - Falls back to a static centered glow when no pointer (touch devices).
 */
export default function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5 });
  const hasPointer = useRef(false);

  useEffect(() => {
    // Respect reduced motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const onMove = (e: PointerEvent) => {
      hasPointer.current = true;
      target.current.x = e.clientX / window.innerWidth;
      target.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      // Lerp toward target for buttery trailing
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      const el = ref.current;
      if (el) {
        el.style.setProperty("--gx", `${current.current.x * 100}%`);
        el.style.setProperty("--gy", `${current.current.y * 100}%`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-0 -z-[5] pointer-events-none mouse-glow"
      style={
        {
          ["--gx" as string]: "50%",
          ["--gy" as string]: "50%",
        } as React.CSSProperties
      }
    />
  );
}
