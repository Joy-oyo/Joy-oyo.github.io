"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CyberCity = dynamic(() => import("@/components/CyberCity"), {
  ssr: false,
});

export default function CyberPage() {
  const [time, setTime] = useState("");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [booted, setBooted] = useState(false);

  // Boot sequence — show HUD after a short delay
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Live clock (HUD)
  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Mouse coords for the HUD readout
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3);
      const y = ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3);
      setCoords({ x: parseFloat(x), y: parseFloat(y) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="cyber-bg fixed inset-0 z-[80] overflow-hidden">
      {/* 3D scene */}
      <div className="absolute inset-0">
        <CyberCity />
      </div>

      {/* Scanline overlay */}
      <div
        aria-hidden
        className="cyber-scanlines pointer-events-none absolute inset-0 z-10 opacity-50"
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(4,3,10,0.65) 100%)",
        }}
      />

      {/* Boot sequence — quick neon burst */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black"
          >
            <div className="text-center font-mono">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#3afff0]/80">
                NEURAL UPLINK ESTABLISHED
              </div>
              <div className="mt-3 text-3xl text-[#ff3da6] animate-pulse">
                // ENTERING NEO_TOKYO
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#3afff0]/50">
                decrypting reality...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD — top left: location */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : -20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute left-6 top-6 z-20 font-mono text-[10px] uppercase tracking-[0.3em]"
      >
        <div className="text-[#3afff0]/90">▸ NEO_TOKYO / SECTOR 47</div>
        <div className="mt-1 text-[#3afff0]/40">35.6762°N · 139.6503°E</div>
        <div className="mt-3 text-[#ff3da6]/80">// LIVE FEED</div>
      </motion.div>

      {/* HUD — top right: clock + coords */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute right-6 top-6 z-20 text-right font-mono text-[10px] uppercase tracking-[0.3em]"
      >
        <div className="text-[#3afff0]/90">SYS · {time}</div>
        <div className="mt-1 text-[#3afff0]/40">
          AXIS · {coords.x.toFixed(2)} / {coords.y.toFixed(2)}
        </div>
        <div className="mt-3 text-[#ffd03a]/80">SIGNAL ▮▮▮▮▯</div>
      </motion.div>

      {/* HUD — bottom left: status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-6 left-6 z-20 font-mono text-[10px] uppercase tracking-[0.3em]"
      >
        <div className="text-[#3afff0]/90">▸ MOVE MOUSE TO LOOK</div>
        <div className="mt-1 text-[#3afff0]/40">framerate locked · 60fps</div>
      </motion.div>

      {/* Center crosshair (subtle) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 font-mono text-[#3afff0]/40"
      >
        <div className="text-[10px] tracking-[0.3em]">+</div>
      </div>

      {/* Return button — bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-6 right-6 z-20"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-full border border-[#3afff0]/40 bg-black/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#3afff0] backdrop-blur-md transition-colors hover:border-[#ff3da6] hover:text-[#ff3da6]"
        >
          <span aria-hidden>←</span> RETURN TO BASE
        </Link>
      </motion.div>

      {/* Title block — center bottom area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: booted ? 1 : 0 }}
        transition={{ duration: 1.0, delay: 0.6 }}
        className="pointer-events-none absolute bottom-24 left-1/2 z-20 -translate-x-1/2 text-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#ff3da6]/80">
          // welcome to the other side
        </div>
        <h1 className="display mt-3 text-5xl md:text-7xl text-[#3afff0] [text-shadow:0_0_30px_rgba(58,255,240,0.4)]">
          NEO_TOKYO
        </h1>
      </motion.div>
    </div>
  );
}
