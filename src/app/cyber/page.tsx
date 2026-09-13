"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WalkControllerHandle } from "@/components/CyberCity";

const CyberCity = dynamic(() => import("@/components/CyberCity"), {
  ssr: false,
});

type Mode = "auto" | "walk";

export default function CyberPage() {
  const [time, setTime] = useState("");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [booted, setBooted] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [mode, setMode] = useState<Mode>("auto");
  const [pointerLocked, setPointerLocked] = useState(false);
  const [lockAttempted, setLockAttempted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cityRef = useRef<WalkControllerHandle | null>(null);

  // Probe whether the optional ambient track exists.
  useEffect(() => {
    let cancelled = false;
    fetch("/audio/cyber-rain.mp3", { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setAudioAvailable(true);
      })
      .catch(() => {
        /* network/file missing — stay hidden */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioOn) {
      audioRef.current.pause();
      setAudioOn(false);
    } else {
      audioRef.current.volume = 0.45;
      audioRef.current
        .play()
        .then(() => setAudioOn(true))
        .catch(() => setAudioOn(false));
    }
  };

  const enterWalk = useCallback(() => {
    setMode("walk");
    setLockAttempted(false);
  }, []);

  const exitWalk = useCallback(() => {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
    setMode("auto");
    setPointerLocked(false);
    setLockAttempted(false);
  }, []);

  // First click inside walk mode (when not yet locked) requests pointer lock —
  // this MUST happen synchronously in a user gesture, so we attach to the
  // overlay's pointerdown rather than calling lock from a useEffect.
  // We mark lockAttempted regardless of success so the overlay dismisses
  // and the player can use the drag-to-look fallback.
  const handleLockClick = useCallback(() => {
    cityRef.current?.requestLock();
    setLockAttempted(true);
  }, []);

  // Boot sequence
  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Live clock
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

  // Mouse coords (only meaningful in auto mode)
  useEffect(() => {
    if (mode !== "auto") return;
    const onMove = (e: MouseEvent) => {
      const x = ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3);
      const y = ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3);
      setCoords({ x: parseFloat(x), y: parseFloat(y) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mode]);

  // Global hotkeys: [E] → enter walk; [Q]/[ESC] → leave walk
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "e" && mode === "auto") {
        enterWalk();
      } else if ((k === "q" || k === "escape") && mode === "walk") {
        exitWalk();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, enterWalk, exitWalk]);

  // Note: we intentionally don't auto-exit on missing pointer lock — Pointer
  // Lock can be unavailable (iframes without `allow="pointer-lock"`) and we
  // still want walk mode to work via drag-to-look fallback. Only an explicit
  // ESC/Q press or "RETURN TO BASE" button drops back to auto.

  const isWalking = mode === "walk";
  // Show the click-to-engage overlay until the user has tried once. After
  // that, even if pointer lock failed silently, drag-to-look takes over.
  const lockHintVisible = mode === "walk" && !pointerLocked && !lockAttempted;

  return (
    <div className="cyber-bg fixed inset-0 z-[80] overflow-hidden">
      {/* 3D scene */}
      <div className="absolute inset-0">
        <CyberCity ref={cityRef} mode={mode} onLockChange={setPointerLocked} />
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

      {/* Boot sequence */}
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

      {/* HUD — top right: clock + coords / status */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: booted ? 1 : 0, x: booted ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute right-6 top-6 z-20 text-right font-mono text-[10px] uppercase tracking-[0.3em]"
      >
        <div className="text-[#3afff0]/90">SYS · {time}</div>
        <div className="mt-1 text-[#3afff0]/40">
          {isWalking
            ? "MODE · WALK"
            : `AXIS · ${coords.x.toFixed(2)} / ${coords.y.toFixed(2)}`}
        </div>
        <div className="mt-3 text-[#ffd03a]/80">SIGNAL ▮▮▮▮▯</div>
      </motion.div>

      {/* HUD — bottom left: status / controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-6 left-6 z-20 font-mono text-[10px] uppercase tracking-[0.3em]"
      >
        {isWalking ? (
          <>
            <div className="text-[#3afff0]/90">▸ WASD · MOVE</div>
            <div className="mt-1 text-[#3afff0]/60">SHIFT · SPRINT</div>
            <div className="mt-1 text-[#3afff0]/60">MOUSE · LOOK</div>
            <div className="mt-1 text-[#ff3da6]/80">ESC / Q · EXIT</div>
          </>
        ) : (
          <>
            <div className="text-[#3afff0]/90">▸ MOVE MOUSE TO LOOK</div>
            <div className="mt-1 text-[#3afff0]/40">framerate locked · 60fps</div>
          </>
        )}
        {audioAvailable && (
          <button
            onClick={toggleAudio}
            className="mt-3 inline-flex items-center gap-2 border border-[#3afff0]/40 bg-black/40 px-3 py-1.5 text-[#3afff0] backdrop-blur-md transition-colors hover:border-[#ff3da6] hover:text-[#ff3da6]"
          >
            <span aria-hidden>{audioOn ? "♪" : "·"}</span>
            <span>AMBIENT · {audioOn ? "ON" : "OFF"}</span>
          </button>
        )}
      </motion.div>

      {/* Hidden audio element — only mounted if the file exists */}
      {audioAvailable && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audioRef} src="/audio/cyber-rain.mp3" loop preload="auto" />
      )}

      {/* Center crosshair — pulses while walking, subtle while idle */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 font-mono"
      >
        <div
          className={`text-[10px] tracking-[0.3em] ${
            isWalking ? "text-[#ff3da6]/80" : "text-[#3afff0]/40"
          }`}
        >
          +
        </div>
      </div>

      {/* Walk-mode call-to-action — visible in auto mode, hidden while walking */}
      <AnimatePresence>
        {!isWalking && booted && mode === "auto" && (
          <motion.button
            key="enter-walk"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            onClick={enterWalk}
            className="absolute left-1/2 top-[58%] z-20 -translate-x-1/2 border border-[#ff3da6]/50 bg-black/40 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.4em] text-[#ff3da6] backdrop-blur-md transition-all hover:border-[#ff3da6] hover:bg-[#ff3da6]/10 hover:text-white"
          >
            <span className="mr-2 opacity-60">[ E ]</span> ENTER THE STREETS
          </motion.button>
        )}
      </AnimatePresence>

      {/* Walk-mode hint when mode=walk but not yet locked. Clicking anywhere
          on this overlay attempts pointer lock from inside a user gesture
          (required by browsers). If pointer lock is unavailable (e.g. inside
          a sandboxed iframe), the WalkController falls back to drag-to-look
          and this overlay disappears on first interaction. */}
      <AnimatePresence>
        {lockHintVisible && (
          <motion.div
            key="lock-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onPointerDown={handleLockClick}
            onClick={handleLockClick}
            className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center bg-black/30 text-center font-mono text-[#3afff0] backdrop-blur-[2px]"
          >
            <div className="text-[10px] uppercase tracking-[0.4em] text-[#3afff0]/60">
              CLICK TO ENGAGE
            </div>
            <div className="mt-2 text-2xl text-[#ff3da6]">// WALK MODE READY</div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-[#3afff0]/40">
              wasd · move &nbsp;·&nbsp; mouse · look &nbsp;·&nbsp; esc · exit
            </div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.3em] text-[#3afff0]/30">
              (drag-to-look fallback if pointer lock is blocked)
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Return button — bottom right, hidden while walking to keep view clean */}
      <AnimatePresence>
        {!isWalking && (
          <motion.div
            key="return"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: booted ? 1 : 0, y: booted ? 0 : 20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="absolute bottom-6 right-6 z-20"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full border border-[#3afff0]/40 bg-black/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#3afff0] backdrop-blur-md transition-colors hover:border-[#ff3da6] hover:text-[#ff3da6]"
            >
              <span aria-hidden>←</span> RETURN TO BASE
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title block — only in auto mode */}
      <AnimatePresence>
        {!isWalking && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: booted ? 1 : 0 }}
            exit={{ opacity: 0 }}
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
        )}
      </AnimatePresence>
    </div>
  );
}
