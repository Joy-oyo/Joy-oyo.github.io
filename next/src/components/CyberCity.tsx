"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ----------------------------- Procedural city ---------------------------- */

type Building = {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  windowSeed: number;
};

function generateCity(count: number, spread: number): Building[] {
  // Deterministic-ish seeded RNG so we don't have hydration jitter
  let s = 42;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const palette = ["#0a0e2a", "#0f1230", "#080a1f", "#1a0e2a", "#0e1d2a"];
  const buildings: Building[] = [];

  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * spread;
    const z = (rand() - 0.5) * spread;
    // Avoid spawning right where the camera sits
    if (Math.abs(x) < 6 && Math.abs(z) < 6) continue;

    const w = 2 + rand() * 4;
    const d = 2 + rand() * 4;
    const h = 6 + rand() * rand() * 30; // skewed toward shorter
    buildings.push({
      position: [x, h / 2, z],
      size: [w, h, d],
      color: palette[Math.floor(rand() * palette.length)],
      windowSeed: rand(),
    });
  }
  return buildings;
}

function BuildingMesh({ b }: { b: Building }) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  // Flicker emissive once in a while
  useFrame(({ clock }) => {
    if (!mat.current) return;
    const t = clock.getElapsedTime();
    const flicker = 0.5 + 0.5 * Math.sin(t * 1.5 + b.windowSeed * 30);
    mat.current.emissiveIntensity = 0.25 + flicker * 0.45;
  });

  // Choose a neon emissive based on seed
  const emissive = useMemo(() => {
    const colors = ["#ff3da6", "#3afff0", "#7aa2ff", "#ffd03a", "#b27aff"];
    return colors[Math.floor(b.windowSeed * colors.length)];
  }, [b.windowSeed]);

  return (
    <mesh position={b.position} castShadow={false} receiveShadow={false}>
      <boxGeometry args={b.size} />
      <meshStandardMaterial
        ref={mat}
        color={b.color}
        emissive={emissive}
        emissiveIntensity={0.4}
        metalness={0.6}
        roughness={0.45}
      />
    </mesh>
  );
}

/* --------------------------- Ground + grid --------------------------- */

function GroundGrid() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Subtle scroll forward illusion
    ref.current.position.z = (clock.getElapsedTime() * 0.4) % 4;
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial
          color="#02020a"
          emissive="#0a0a25"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.7}
        />
      </mesh>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <gridHelper ref={ref} args={[400, 200, "#3afff0", "#1a3a5a"]} />
    </>
  );
}

/* --------------------------- Flying neon streaks ------------------------- */

function NeonStreak({
  startX,
  speed,
  y,
  color,
}: {
  startX: number;
  speed: number;
  y: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = ((startX + t * speed) % 80) - 40;
  });
  return (
    <mesh ref={ref} position={[startX, y, -10]}>
      <boxGeometry args={[3, 0.05, 0.05]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

/* ------------------------------ Camera rig ------------------------------- */

function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector2());
  const current = useRef(new THREE.Vector2());

  useFrame((state) => {
    // mouse: -1..1
    target.current.set(state.mouse.x, state.mouse.y);
    current.current.lerp(target.current, 0.05);

    const tx = current.current.x * 4;
    const ty = 4 + current.current.y * 2;

    camera.position.x = tx;
    camera.position.y = ty;
    camera.position.z = 10;
    camera.lookAt(0, 5, 0);
  });
  return null;
}

/* --------------------------------- Scene --------------------------------- */

export default function CyberCity() {
  const buildings = useMemo(() => generateCity(120, 90), []);
  const streaks = useMemo(
    () => [
      { startX: -20, speed: 8, y: 1.5, color: "#ff3da6" },
      { startX: 10, speed: 12, y: 3, color: "#3afff0" },
      { startX: -5, speed: 6, y: 5, color: "#7aa2ff" },
      { startX: 25, speed: 15, y: 2, color: "#ffd03a" },
      { startX: -15, speed: 9, y: 4.5, color: "#3afff0" },
    ],
    []
  );

  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      {/* Atmospheric fog — pink/blue night */}
      <color attach="background" args={["#04030a"]} />
      <fog attach="fog" args={["#0a0420", 15, 70]} />

      {/* Lights */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 20, 0]} intensity={1.5} color="#ff3da6" distance={80} />
      <pointLight position={[20, 10, -20]} intensity={1.2} color="#3afff0" distance={80} />
      <pointLight position={[-20, 8, -10]} intensity={1.0} color="#7aa2ff" distance={80} />
      <directionalLight position={[5, 30, 10]} intensity={0.3} color="#aab8ff" />

      <CameraRig />

      <GroundGrid />

      {buildings.map((b, i) => (
        <BuildingMesh key={i} b={b} />
      ))}

      {streaks.map((s, i) => (
        <NeonStreak key={i} {...s} />
      ))}
    </Canvas>
  );
}
