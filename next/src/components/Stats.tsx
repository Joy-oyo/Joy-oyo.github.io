"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/content/portfolio";

function CountUp({ to, active }: { to: number; active: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active]);
  return <>{n}</>;
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="relative -mt-20 px-5">
      <div
        ref={ref}
        className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.15)] backdrop-blur md:grid-cols-4"
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="bg-white p-8 text-center"
          >
            <div className="font-display text-4xl font-bold text-klein md:text-5xl">
              <CountUp to={s.target} active={inView} />
              <span className="text-gold">+</span>
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
