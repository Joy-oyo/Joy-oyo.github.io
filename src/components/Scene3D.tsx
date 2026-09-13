"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function StarField({ count = 4000 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Inside a sphere, biased toward edges for depth
      const r = Math.cbrt(Math.random()) * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 30;
    // Subtle mouse parallax
    const { x, y } = state.mouse;
    ref.current.rotation.x += (y * 0.05 - ref.current.rotation.x * 0.001);
    ref.current.rotation.y += (x * 0.05 - ref.current.rotation.y * 0.001);
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#f5f5f0"
          size={0.012}
          sizeAttenuation
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

function Nebula() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.02;
  });
  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial transparent opacity={0.5}>
        <canvasTexture
          attach="map"
          image={(() => {
            if (typeof document === "undefined") return null as unknown as HTMLCanvasElement;
            const c = document.createElement("canvas");
            c.width = 512; c.height = 512;
            const ctx = c.getContext("2d")!;
            const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
            grad.addColorStop(0, "rgba(0, 47, 167, 0.45)");
            grad.addColorStop(0.4, "rgba(106, 62, 163, 0.15)");
            grad.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 512);
            return c;
          })()}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Nebula />
          <StarField count={3500} />
          <Preload all />
        </Suspense>
      </Canvas>
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,5,8,0.8)_100%)]" />
    </div>
  );
}
