"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "framer-motion";
import YinYang from "@/components/YinYang";
import type { ShelfId } from "@/content/books";
import type { OpenBook } from "./BookReader";
import { BusinessFace, HumanitiesFace } from "./ShelfFaces";
import styles from "./RevolvingShelf.module.css";

/** Narrow facets on each rounded end of the case. */
const FACETS = 4;
const TURNED_KEY = "secret-shelf:turned";

type Panel = {
  key: string;
  kind: ShelfId | "end";
  width: number;
  x: number;
  z: number;
  angle: number;
  /** 0 = business side, 1 = humanities side; blends the end facets' wood. */
  tint: number;
};

/**
 * A stadium-shaped revolving case: two wide flat faces (the two shelves)
 * joined by rounded ends built from narrow facets. It rests like a
 * two-sided bookcase and turns like a cylinder.
 */
function buildPanels(W: number, R: number): Panel[] {
  const step = 180 / FACETS;
  const half = (step / 2) * (Math.PI / 180);
  const apothem = R * Math.cos(half);
  const chord = 2 * R * Math.sin(half) + 1.5; // overlap hides hairline seams
  const end = (side: 1 | -1, from: number, tint: (j: number) => number) =>
    Array.from({ length: FACETS }, (_, j): Panel => {
      const angle = from + (j + 0.5) * step;
      const rad = angle * (Math.PI / 180);
      return {
        key: `end-${side}-${j}`,
        kind: "end",
        width: chord,
        x: (side * W) / 2 + apothem * Math.sin(rad),
        z: apothem * Math.cos(rad),
        angle,
        tint: tint(j),
      };
    });
  return [
    { key: "business", kind: "business", width: W, x: 0, z: R, angle: 0, tint: 0 },
    ...end(1, 0, (j) => (j + 0.5) / FACETS),
    { key: "humanities", kind: "humanities", width: W, x: 0, z: -R, angle: 180, tint: 1 },
    ...end(-1, 180, (j) => 1 - (j + 0.5) / FACETS),
  ];
}

const faceAt = (rotation: number): ShelfId =>
  (((Math.round(rotation / 180) % 2) + 2) % 2 === 0 ? "business" : "humanities");

function TurnIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="12" cy="8" rx="8.5" ry="3" opacity=".45" />
      <path d="M3.5 8v8c0 1.7 3.8 3 8.5 3s8.5-1.3 8.5-3V8" opacity=".45" />
      <path d="M5.2 13.6c1.6.8 4 1.3 6.8 1.3s5.2-.5 6.8-1.3" />
      <path d="M16.6 12.7l2.2.9-1 2.1" />
    </svg>
  );
}

export default function RevolvingShelf({
  ready,
  onOpenBook,
  onOpenCosmos,
}: {
  /** True once the doors have finished opening. */
  ready: boolean;
  onOpenBook: (open: OpenBook, from: HTMLElement) => void;
  onOpenCosmos: (from: HTMLElement) => void;
}) {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [face, setFace] = useState<ShelfId>("business");
  const [turned, setTurned] = useState(true);
  const [coarse, setCoarse] = useState(false);
  const rotation = useMotionValue(0);
  const counterRotation = useTransform(rotation, (r) => -r);
  const running = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    setTurned(sessionStorage.getItem(TURNED_KEY) === "1");
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(rotation, "change", (r) => {
    const next = faceAt(r);
    setFace((current) => (current === next ? current : next));
  });

  const markTurned = useCallback(() => {
    setTurned(true);
    sessionStorage.setItem(TURNED_KEY, "1");
  }, []);

  const mobile = (size?.w ?? 1200) < 640;
  const R = mobile ? 26 : 88;
  const W = size ? Math.max(260, Math.min(size.w - 2 * R - (mobile ? 16 : 64), 1040)) : 0;
  const H = size ? Math.max(mobile ? 420 : 380, Math.min(size.h, mobile ? 560 : 590)) : 0;
  const degPerPx = W ? 180 / (W * 0.7) : 0;

  const spinTo = useCallback(
    (target: number, velocity = 0) => {
      running.current?.stop();
      running.current = animate(
        rotation,
        target,
        reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 110, damping: 19, velocity }
      );
    },
    [rotation, reduceMotion]
  );

  /** Settle on a face. A deliberate push past ~28° turns the case over. */
  const settle = useCallback(
    (startRotation: number, velocity: number) => {
      const r = rotation.get();
      const base = Math.round(startRotation / 180) * 180;
      let target = Math.round(r / 180) * 180;
      const moved = r - base;
      if (target === base && (Math.abs(moved) > 28 || Math.abs(velocity) > 420)) {
        target = base + 180 * Math.sign(Math.abs(velocity) > 420 ? velocity : moved);
      }
      spinTo(target, velocity);
    },
    [rotation, spinTo]
  );

  // Pointer drag (mouse) and swipe (touch). Capture only once a horizontal
  // drag is recognised, so a plain click still reaches the book under it.
  const drag = useRef<{ id: number; x: number; y: number; start: number; lastX: number; lastT: number; v: number; active: boolean } | null>(null);
  const suppressClick = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, start: rotation.get(), lastX: e.clientX, lastT: e.timeStamp, v: 0, active: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    if (!d.active) {
      const dy = e.clientY - d.y;
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dx) < 6) return;
      d.active = true;
      d.x = e.clientX;
      d.start = rotation.get();
      running.current?.stop();
      e.currentTarget.setPointerCapture(e.pointerId);
      markTurned();
    }
    rotation.set(d.start - (e.clientX - d.x) * degPerPx);
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = d.v * 0.6 + ((-(e.clientX - d.lastX) * degPerPx) / dt) * 1000 * 0.4;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId || !d.active) return;
    suppressClick.current = true;
    window.setTimeout(() => (suppressClick.current = false), 0);
    settle(d.start, d.v);
  };

  // Two-finger horizontal swipe on a trackpad turns the case too.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !degPerPx) return;
    let start: number | null = null;
    let timer = 0;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < 1 || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (start === null) {
        start = rotation.get();
        running.current?.stop();
        markTurned();
      }
      rotation.set(rotation.get() + e.deltaX * degPerPx * 0.85);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const from = start ?? rotation.get();
        start = null;
        settle(from, 0);
      }, 140);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
  }, [degPerPx, rotation, settle, markTurned]);

  // A small nudge on first sight suggests the case can turn.
  useEffect(() => {
    if (!ready || turned || reduceMotion || !size) return;
    running.current?.stop();
    running.current = animate(rotation, [0, -18, 8, 0], { duration: 1.7, times: [0, 0.35, 0.7, 1], ease: "easeInOut", delay: 0.3 });
    return () => running.current?.stop();
    // Only on the first ready frame of this opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, size !== null]);

  const showShelf = (target: ShelfId) => {
    markTurned();
    const r = rotation.get();
    const rest = Math.round(r / 180) * 180;
    spinTo(faceAt(rest) === target ? rest : rest + 180);
  };

  const panels = W ? buildPanels(W, R) : [];

  return (
    <div className={styles.shelf}>
      <div className={styles.switch} role="group" aria-label="Choose a shelf">
        <button type="button" className={styles.side} data-on={face === "business"} aria-pressed={face === "business"} onClick={() => showShelf("business")}>
          Business
        </button>
        <motion.button
          type="button"
          className={styles.core}
          style={{ rotate: rotation }}
          onClick={(e) => onOpenCosmos(e.currentTarget)}
          aria-label="Open the knowledge cosmos"
          title="Knowledge cosmos"
        >
          <span aria-hidden="true">
            <YinYang size={26} spin={false} yangColor="#0a0a12" yinColor="#f5f5f0" stroke="rgba(245,245,240,0.45)" />
          </span>
        </motion.button>
        <button type="button" className={styles.side} data-on={face === "humanities"} aria-pressed={face === "humanities"} onClick={() => showShelf("humanities")}>
          Humanities
        </button>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{ perspective: mobile ? 1100 : 2400 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (!suppressClick.current) return;
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {W > 0 && (
          <div className={styles.stageBox} style={{ height: H }}>
            <motion.div className={styles.rotor} style={{ z: -R, rotateY: counterRotation }}>
              {panels.map((panel) => (
                <ShelfPanel key={panel.key} panel={panel} height={H} rotation={rotation}>
                  {panel.kind === "business" && (
                    <BusinessFace active={face === "business"} onOpen={(book, el) => onOpenBook({ shelf: "business", book }, el)} />
                  )}
                  {panel.kind === "humanities" && (
                    <HumanitiesFace active={face === "humanities"} onOpen={(scroll, el) => onOpenBook({ shelf: "humanities", scroll }, el)} />
                  )}
                </ShelfPanel>
              ))}
            </motion.div>
            <div className={styles.floor} aria-hidden="true" />
          </div>
        )}
      </div>

      <p className={styles.hint} data-hidden={turned}>
        <span className={styles.hintIcon}>
          <TurnIcon />
        </span>
        {coarse ? "Swipe to turn the shelf" : "Drag to turn the shelf"}
      </p>
    </div>
  );
}

function ShelfPanel({
  panel,
  height,
  rotation,
  children,
}: {
  panel: Panel;
  height: number;
  rotation: MotionValue<number>;
  children?: React.ReactNode;
}) {
  // Facets turning away from the viewer darken, so the case reads as solid.
  const shade = useTransform(rotation, (r) => {
    const delta = ((((panel.angle - r) % 360) + 540) % 360) - 180;
    const facing = Math.cos((delta * Math.PI) / 180);
    return facing <= 0 ? 0.7 : 0.7 * (1 - facing);
  });
  return (
    <div
      className={panel.kind === "end" ? styles.end : styles.face}
      aria-hidden={panel.kind === "end" || undefined}
      style={
        {
          width: panel.width,
          height,
          marginLeft: -panel.width / 2,
          transform: `translate3d(${panel.x}px, 0, ${panel.z}px) rotateY(${panel.angle}deg)`,
          "--tint": panel.tint,
        } as CSSProperties
      }
    >
      {children}
      <motion.div className={styles.shade} style={{ opacity: shade }} aria-hidden="true" />
    </div>
  );
}
