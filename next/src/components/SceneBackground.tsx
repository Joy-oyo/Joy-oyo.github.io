"use client";

import dynamic from "next/dynamic";
import MouseGlow from "./MouseGlow";

// Load 3D scene only on client (avoids SSR issues with WebGL)
const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function SceneBackground() {
  return (
    <>
      <Scene3D />
      <MouseGlow />
    </>
  );
}
