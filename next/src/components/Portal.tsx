"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/**
 * A small floating "portal" in the bottom-right corner.
 * Click → navigates to /cyber. Hidden while already on /cyber.
 */
function HoloOrb({ hovered }: { hovered: boolean }) {
  const inner = useRef<THREE.Mesh>(null);
  const outer = useRef<THREE.LineSegments>(null);

  useFrame((state, delta) => {
    if (inner.current) {
      inner.current.rotation.y += delta * 0.6;
      inner.current.rotation.x += delta * 0.25;
    }
    if (outer.current) {
      outer.current.rotation.y -= delta * (hovered ? 1.4 : 0.4);
      outer.current.rotation.z += delta * 0.15;
      const s = hovered ? 1.15 : 1.0;
      outer.current.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
    }
  });

  return (
    <group>
      {/* Solid icosahedron core */}
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial
          color={hovered ? "#7aa2ff" : "#3a5fd4"}
          emissive={hovered ? "#4f7dff" : "#1a2f8a"}
          emissiveIntensity={hovered ? 1.2 : 0.6}
          metalness={0.6}
          roughness={0.3}
          flatShading
        />
      </mesh>

      {/* Wireframe shell */}
      <lineSegments ref={outer}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1.05, 1)]} />
        <lineBasicMaterial
          color={hovered ? "#ff3da6" : "#7aa2ff"}
          transparent
          opacity={0.85}
        />
      </lineSegments>

      {/* Subtle glow sphere behind */}
      <mesh>
        <sphereGeometry args={[1.4, 24, 24]} />
        <meshBasicMaterial color="#0a1240" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export default function Portal() {
  const pathname = usePathname();
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  // Hide the portal on the cyber page itself
  if (pathname?.startsWith("/cyber")) return null;

  const enter = () => {
    // Light flash + navigate
    document.documentElement.classList.add("portal-flash");
    setTimeout(() => {
      router.push("/cyber");
      setTimeout(
        () => document.documentElement.classList.remove("portal-flash"),
        600
      );
    }, 220);
  };

  return (
    <motion.button
      type="button"
      onClick={enter}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label="Enter the cyber world"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed bottom-5 right-5 z-[60] h-[88px] w-[88px] rounded-2xl border border-ink-50/15 bg-ink-950/70 backdrop-blur-md shadow-[0_8px_40px_-8px_rgba(80,120,255,0.45)] hover:border-ink-50/40 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-klein"
    >
      {/* Canvas */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 3, 3]} intensity={1.2} color="#7aa2ff" />
          <pointLight
            position={[-3, -2, 2]}
            intensity={0.8}
            color="#ff3da6"
          />
          <HoloOrb hovered={hovered} />
        </Canvas>
      </div>

      {/* Scanline overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 3px)",
        }}
      />

      {/* Corner ticks (HUD) */}
      <span className="pointer-events-none absolute left-1.5 top-1.5 h-2 w-2 border-l border-t border-ink-50/50" />
      <span className="pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 border-r border-t border-ink-50/50" />
      <span className="pointer-events-none absolute left-1.5 bottom-1.5 h-2 w-2 border-l border-b border-ink-50/50" />
      <span className="pointer-events-none absolute right-1.5 bottom-1.5 h-2 w-2 border-r border-b border-ink-50/50" />

      {/* Idle label */}
      <span className="pointer-events-none absolute -top-5 right-0 font-mono text-[9px] uppercase tracking-[0.3em] text-ink-50/40">
        Portal
      </span>

      {/* Hover label — ENTER → */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="enter"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-ink-50/20 bg-ink-950/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-50/90 backdrop-blur-md"
          >
            Enter <span className="text-klein">→</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
