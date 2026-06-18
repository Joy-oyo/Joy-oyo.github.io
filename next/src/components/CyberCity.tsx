"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Sparkles,
  MeshReflectorMaterial,
  useTexture,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*                       Procedural neon-window texture                       */
/* -------------------------------------------------------------------------- */
// Draws a grid of randomly lit windows on an HTML canvas, returns it as a
// THREE.CanvasTexture. We instantiate a few variants and reuse them across all
// buildings so we don't pay the texture cost per-building.

function makeWindowTexture(opts: {
  cols: number;
  rows: number;
  hue: string; // emissive hue for "lit" windows
  density: number; // 0..1 how many windows are lit
  seed: number;
}): THREE.CanvasTexture {
  const { cols, rows, hue, density, seed } = opts;
  const W = 256;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;

  // Dark facade background
  ctx.fillStyle = "#02030a";
  ctx.fillRect(0, 0, W, H);

  // Subtle vertical structural lines
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += W / cols) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  // Deterministic RNG so each variant looks consistent across renders
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const cellW = W / cols;
  const cellH = H / rows;
  const padX = cellW * 0.25;
  const padY = cellH * 0.3;

  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const lit = rand() < density;
      const x = col * cellW + padX;
      const y = r * cellH + padY;
      const w = cellW - padX * 2;
      const h = cellH - padY * 2;

      if (lit) {
        const a = 0.55 + rand() * 0.45;
        ctx.fillStyle = hexWithAlpha(hue, a);
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = hexWithAlpha(hue, 0.15);
        ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.02)";
        ctx.fillRect(x, y, w, h);
      }
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

function hexWithAlpha(hex: string, a: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* -------------------------------------------------------------------------- */
/*                             Procedural city                                */
/* -------------------------------------------------------------------------- */
// We swap the random-scatter approach for a proper grid of city BLOCKS, with
// streets between them. Each block can host 1–4 buildings stacked side-by-side
// inside its footprint. This (a) lets us walk down actual streets and (b)
// produces those tight neon "alley" sight-lines that read as Neo-Tokyo.

type Building = {
  position: [number, number, number]; // center x/y/z (y = h/2)
  size: [number, number, number]; // w h d
  textureIndex: number;
  windowSeed: number;
};

const CITY_CONFIG = {
  blocksPerSide: 7,        // 7x7 = 49 blocks
  blockSize: 18,           // each block footprint (world units)
  streetWidth: 6,          // gap between blocks
  buildingMargin: 1.2,     // building footprint inset from block edge
};

function generateCity(): { buildings: Building[]; cityRadius: number } {
  let s = 42;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const buildings: Building[] = [];
  const { blocksPerSide, blockSize, streetWidth, buildingMargin } = CITY_CONFIG;
  const totalBlock = blockSize + streetWidth;
  const cityRadius = (blocksPerSide * totalBlock) / 2;

  for (let bx = 0; bx < blocksPerSide; bx++) {
    for (let bz = 0; bz < blocksPerSide; bz++) {
      // Block center in world space
      const cx = (bx - (blocksPerSide - 1) / 2) * totalBlock;
      const cz = (bz - (blocksPerSide - 1) / 2) * totalBlock;

      // Reserve the very center block as a small plaza so the player has a
      // clear spawn area.
      const isCenter = bx === Math.floor(blocksPerSide / 2) && bz === Math.floor(blocksPerSide / 2);
      if (isCenter) continue;

      // Number of buildings in this block (1, 2, or 4 cells of a 2x2)
      const layout = rand();
      const cells: { ox: number; oz: number; ow: number; od: number }[] = [];
      if (layout < 0.35) {
        // single big building filling the block
        cells.push({ ox: 0, oz: 0, ow: blockSize, od: blockSize });
      } else if (layout < 0.7) {
        // split into two halves (random axis)
        if (rand() < 0.5) {
          cells.push({ ox: -blockSize / 4, oz: 0, ow: blockSize / 2, od: blockSize });
          cells.push({ ox: blockSize / 4, oz: 0, ow: blockSize / 2, od: blockSize });
        } else {
          cells.push({ ox: 0, oz: -blockSize / 4, ow: blockSize, od: blockSize / 2 });
          cells.push({ ox: 0, oz: blockSize / 4, ow: blockSize, od: blockSize / 2 });
        }
      } else {
        // 2x2 quad
        const half = blockSize / 2;
        for (let i = 0; i < 2; i++) {
          for (let j = 0; j < 2; j++) {
            cells.push({
              ox: (i - 0.5) * half,
              oz: (j - 0.5) * half,
              ow: half,
              od: half,
            });
          }
        }
      }

      for (const cell of cells) {
        // Skip a cell occasionally for visual variety / extra alley views
        if (rand() < 0.12) continue;

        const w = cell.ow - buildingMargin * 2;
        const d = cell.od - buildingMargin * 2;
        // Height — heavily skewed toward shorter, occasional towers
        const r1 = rand();
        const r2 = rand();
        const h = 6 + r1 * r1 * 34 + r2 * 4;

        buildings.push({
          position: [cx + cell.ox, h / 2, cz + cell.oz],
          size: [w, h, d],
          textureIndex: Math.floor(rand() * 5),
          windowSeed: rand(),
        });
      }
    }
  }

  return { buildings, cityRadius };
}

function BuildingMesh({
  b,
  texture,
  emissive,
}: {
  b: Building;
  texture: THREE.CanvasTexture;
  emissive: string;
}) {
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  const map = useMemo(() => {
    const t = texture.clone();
    t.needsUpdate = true;
    const repeatX = Math.max(1, Math.floor(b.size[0] / 1.2));
    const repeatY = Math.max(1, Math.floor(b.size[1] / 1.2));
    t.repeat.set(repeatX, repeatY);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [texture, b.size]);

  useFrame(({ clock }) => {
    if (!mat.current) return;
    const t = clock.getElapsedTime();
    const flicker = 0.5 + 0.5 * Math.sin(t * 1.3 + b.windowSeed * 30);
    mat.current.emissiveIntensity = 0.9 + flicker * 0.6;
  });

  return (
    <mesh position={b.position}>
      <boxGeometry args={b.size} />
      <meshStandardMaterial
        ref={mat}
        color="#05060f"
        map={map}
        emissive={emissive}
        emissiveMap={map}
        emissiveIntensity={1.1}
        metalness={0.55}
        roughness={0.5}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Wet asphalt ground                            */
/* -------------------------------------------------------------------------- */

function WetGround({ size }: { size: number }) {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.z = (clock.getElapsedTime() * 0.4) % 4;
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1.2}
          mixStrength={1.5}
          roughness={0.7}
          depthScale={1.0}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#05030f"
          metalness={0.85}
          mirror={0.45}
        />
      </mesh>

      {/* eslint-disable-next-line react/no-unknown-property */}
      <gridHelper
        ref={ref}
        args={[size, Math.floor(size / 2), "#3afff0", "#0d2a4a"]}
        position={[0, 0.01, 0]}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Flying neon streaks                            */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                                    Rain                                    */
/* -------------------------------------------------------------------------- */

function Rain({ count = 1200 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const drops = useMemo(() => {
    const arr: { x: number; y: number; z: number; speed: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 160,
        y: Math.random() * 60,
        z: (Math.random() - 0.5) * 160,
        speed: 18 + Math.random() * 24,
      });
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.y -= d.speed * delta;
      if (d.y < 0) d.y = 60;
      dummy.position.set(d.x, d.y, d.z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.015, 0.5, 0.015]} />
      <meshBasicMaterial color="#9fdcff" transparent opacity={0.55} toneMapped={false} />
    </instancedMesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Neon signs                                  */
/* -------------------------------------------------------------------------- */
// Yaw-only billboard: signs always face the camera horizontally but stay
// upright (no awkward tilting when the player looks up/down). Plus an
// intro flash that boosts brightness/scale during the first ~3.5 seconds
// so the city feels like it just "switched on".

const SIGN_COUNT = 8;
const SIGN_PATHS = Array.from(
  { length: SIGN_COUNT },
  (_, i) => `/cyber/signs/sign-${String(i + 1).padStart(2, "0")}.png`
);
const INTRO_DURATION = 3.5; // seconds — sign intro flash

type SignPlacement = {
  position: [number, number, number];
  size: [number, number]; // width, height
  textureIndex: number;
  flickerSeed: number;
};

function planSigns(buildings: Building[]): SignPlacement[] {
  let s = 911;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const placements: SignPlacement[] = [];
  for (const b of buildings) {
    const [bx, , bz] = b.position;
    const [bw, bh, bd] = b.size;

    if (bh < 14) continue;
    if (rand() > 0.55) continue;

    // Pick a face just to anchor the sign at a slight outward offset (so
    // it doesn't visually clip into the building from any angle), then
    // billboard it on Y at runtime.
    const face = Math.floor(rand() * 4);

    const minDim = Math.min(bw, bd);
    const signW = minDim * (0.7 + rand() * 0.3);
    const signH = signW * 1.5;

    const lift = 0.3;
    const yCenter = Math.min(bh - signH / 2 - 0.5, bh * (0.45 + rand() * 0.3));

    let px = bx;
    let pz = bz;
    if (face === 0) pz = bz + bd / 2 + lift;
    else if (face === 1) pz = bz - bd / 2 - lift;
    else if (face === 2) px = bx + bw / 2 + lift;
    else px = bx - bw / 2 - lift;

    placements.push({
      position: [px, yCenter, pz],
      size: [signW, signH],
      textureIndex: Math.floor(rand() * SIGN_COUNT),
      flickerSeed: rand(),
    });
  }
  return placements;
}

function NeonSign({
  placement,
  textures,
}: {
  placement: SignPlacement;
  textures: THREE.Texture[];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const tex = textures[placement.textureIndex];

  const isGlitchy = placement.flickerSeed > 0.78;

  useFrame(({ clock, camera }) => {
    const grp = groupRef.current;
    const mat = matRef.current;
    if (!grp || !mat) return;
    const t = clock.getElapsedTime();

    // Yaw-only billboard: rotate sign around Y so its normal points to camera
    const dx = camera.position.x - placement.position[0];
    const dz = camera.position.z - placement.position[2];
    grp.rotation.y = Math.atan2(dx, dz);

    // Intro flash: aggressive boost during the first INTRO_DURATION seconds
    const introT = Math.min(1, t / INTRO_DURATION);
    // ease-out: 1 - (1 - x)^2  → 1 at end of intro
    const introEase = 1 - (1 - introT) * (1 - introT);
    const introBoost = 1 - introEase; // 1 at start, 0 after intro
    const introScale = 1 + introBoost * 0.35;
    grp.scale.setScalar(introScale);

    // Per-sign flicker (post-intro)
    let baseOpacity: number;
    if (isGlitchy) {
      const phase = (t * 1.7 + placement.flickerSeed * 30) % 6;
      baseOpacity = phase > 0.18 ? 1 : 0.15;
    } else {
      baseOpacity = 0.88 + 0.12 * Math.sin(t * 0.9 + placement.flickerSeed * 20);
    }
    // Blend in extra brightness during intro (capped, since AdditiveBlending
    // already saturates fast)
    mat.opacity = Math.min(1.4, baseOpacity + introBoost * 0.5);
  });

  return (
    <group ref={groupRef} position={placement.position}>
      <mesh>
        <planeGeometry args={placement.size} />
        <meshBasicMaterial
          ref={matRef}
          map={tex}
          transparent
          opacity={1}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function BillboardLayer({ buildings }: { buildings: Building[] }) {
  const textures = useTexture(SIGN_PATHS) as THREE.Texture[];
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
  }, [textures]);

  const placements = useMemo(() => planSigns(buildings), [buildings]);

  return (
    <>
      {placements.map((p, i) => (
        <NeonSign key={i} placement={p} textures={textures} />
      ))}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Player controllers                              */
/* -------------------------------------------------------------------------- */
// Two camera modes:
//   - "auto"   : the original mouse-driven cinematic rig (default landing)
//   - "walk"   : pointer-locked WASD walking, with AABB collision + head bob
// Press [E] from page UI to enter walk; [ESC] / [Q] to exit back to auto.

const PLAYER_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.6;
const WALK_SPEED = 7.5;
const SPRINT_MULT = 1.8;
const FRICTION = 10;
const ACCEL = 35;

type AABB = { minX: number; maxX: number; minZ: number; maxZ: number };

export type WalkControllerHandle = {
  /** Try to engage Pointer Lock. Returns false if the API is unavailable. */
  requestLock: () => boolean;
};

function buildingAABBs(buildings: Building[]): AABB[] {
  return buildings.map((b) => ({
    minX: b.position[0] - b.size[0] / 2 - PLAYER_RADIUS,
    maxX: b.position[0] + b.size[0] / 2 + PLAYER_RADIUS,
    minZ: b.position[2] - b.size[2] / 2 - PLAYER_RADIUS,
    maxZ: b.position[2] + b.size[2] / 2 + PLAYER_RADIUS,
  }));
}

function collidesAt(x: number, z: number, aabbs: AABB[]): boolean {
  for (const a of aabbs) {
    if (x > a.minX && x < a.maxX && z > a.minZ && z < a.maxZ) return true;
  }
  return false;
}

function CinematicRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector2());
  const current = useRef(new THREE.Vector2());

  useFrame((state) => {
    target.current.set(state.mouse.x, state.mouse.y);
    current.current.lerp(target.current, 0.05);

    const tx = current.current.x * 4;
    const ty = 4 + current.current.y * 2;

    camera.position.x = tx;
    camera.position.y = ty;
    camera.position.z = 14;
    camera.lookAt(0, 5, 0);
  });
  return null;
}

function WalkController({
  buildings,
  cityRadius,
  onLockChange,
  controllerRef,
}: {
  buildings: Building[];
  cityRadius: number;
  onLockChange: (locked: boolean) => void;
  controllerRef: React.MutableRefObject<WalkControllerHandle | null>;
}) {
  const { camera, gl } = useThree();

  // Keyboard state
  const keys = useRef({ w: false, a: false, s: false, d: false, shift: false });
  const velocity = useRef(new THREE.Vector3());
  const aabbs = useMemo(() => buildingAABBs(buildings), [buildings]);
  const bobT = useRef(0);

  // Look state — supports both Pointer Lock (when allowed) and drag-to-look
  // fallback (works inside iframes where Pointer Lock is blocked).
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isLocked = useRef(false);
  const isDragging = useRef(false);

  // Initialize camera at street-level, in the central plaza, and seed yaw/pitch
  // from the camera's current orientation so first-frame doesn't snap.
  useEffect(() => {
    camera.position.set(0, PLAYER_HEIGHT, 4);
    camera.lookAt(0, PLAYER_HEIGHT, 0);
    const e = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
    yaw.current = e.y;
    pitch.current = e.x;
  }, [camera]);

  // Expose imperative API to the parent: page calls requestLock() from the
  // user's actual click handler (must be inside a user gesture).
  useImperativeHandle(
    controllerRef,
    () => ({
      requestLock: () => {
        const el = gl.domElement;
        // Only attempt if the API exists; some embeddings (iframes without
        // `allow="pointer-lock"`) will reject this with a SecurityError.
        if (typeof el.requestPointerLock !== "function") return false;
        try {
          // Some browsers return a Promise (Chrome 103+), some return void.
          const maybe = (el.requestPointerLock as () => unknown)();
          if (maybe && typeof (maybe as Promise<void>).catch === "function") {
            (maybe as Promise<void>).catch(() => {
              // Silent — drag-to-look fallback will take over
            });
          }
          return true;
        } catch {
          return false;
        }
      },
    }),
    [gl]
  );

  // Pointer lock change tracking
  useEffect(() => {
    const el = gl.domElement;
    const onChange = () => {
      const locked = document.pointerLockElement === el;
      isLocked.current = locked;
      onLockChange(locked);
    };
    document.addEventListener("pointerlockchange", onChange);
    return () => {
      document.removeEventListener("pointerlockchange", onChange);
    };
  }, [gl, onLockChange]);

  // Mouse look — works for BOTH pointer-lock (movementX always present) and
  // drag-to-look (we only consume movement while a button is pressed).
  useEffect(() => {
    const el = gl.domElement;

    const onMove = (e: MouseEvent) => {
      const active = isLocked.current || isDragging.current;
      if (!active) return;
      const sens = 0.0022;
      yaw.current -= e.movementX * sens;
      pitch.current -= e.movementY * sens;
      // Clamp pitch so we can't flip upside down
      const maxPitch = Math.PI / 2 - 0.05;
      pitch.current = Math.max(-maxPitch, Math.min(maxPitch, pitch.current));
    };

    const onDown = () => {
      // Only used as drag-to-look when pointer-lock isn't active
      if (!isLocked.current) {
        isDragging.current = true;
        el.style.cursor = "grabbing";
      }
    };
    const onUp = () => {
      isDragging.current = false;
      el.style.cursor = "";
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousemove", onMove);
    };
  }, [gl]);

  // Keyboard listeners
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = true;
      else if (k === "s" || k === "arrowdown") keys.current.s = true;
      else if (k === "a" || k === "arrowleft") keys.current.a = true;
      else if (k === "d" || k === "arrowright") keys.current.d = true;
      else if (k === "shift") keys.current.shift = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "w" || k === "arrowup") keys.current.w = false;
      else if (k === "s" || k === "arrowdown") keys.current.s = false;
      else if (k === "a" || k === "arrowleft") keys.current.a = false;
      else if (k === "d" || k === "arrowright") keys.current.d = false;
      else if (k === "shift") keys.current.shift = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, rawDelta) => {
    // Cap delta so a stutter doesn't teleport the player into a wall
    const delta = Math.min(rawDelta, 0.05);

    // Apply yaw/pitch to camera each frame (YXZ order = FPS-style)
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;
    camera.rotation.z = 0;

    // Forward vector projected to ground plane
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    // Desired direction
    const dir = new THREE.Vector3();
    if (keys.current.w) dir.add(forward);
    if (keys.current.s) dir.sub(forward);
    if (keys.current.d) dir.add(right);
    if (keys.current.a) dir.sub(right);
    if (dir.lengthSq() > 0) dir.normalize();

    const speed = WALK_SPEED * (keys.current.shift ? SPRINT_MULT : 1);

    // Apply acceleration, friction
    velocity.current.x += dir.x * ACCEL * delta;
    velocity.current.z += dir.z * ACCEL * delta;
    velocity.current.x -= velocity.current.x * FRICTION * delta;
    velocity.current.z -= velocity.current.z * FRICTION * delta;
    // clamp to max speed
    const horizSpeed = Math.hypot(velocity.current.x, velocity.current.z);
    if (horizSpeed > speed) {
      const k = speed / horizSpeed;
      velocity.current.x *= k;
      velocity.current.z *= k;
    }

    // Step + axis-separated AABB collision (slide along walls)
    const px = camera.position.x;
    const pz = camera.position.z;
    let nx = px + velocity.current.x * delta;
    let nz = pz + velocity.current.z * delta;

    if (collidesAt(nx, pz, aabbs)) {
      nx = px;
      velocity.current.x = 0;
    }
    if (collidesAt(nx, nz, aabbs)) {
      nz = pz;
      velocity.current.z = 0;
    }

    // City boundary clamp
    const limit = cityRadius - 1;
    nx = Math.max(-limit, Math.min(limit, nx));
    nz = Math.max(-limit, Math.min(limit, nz));

    camera.position.x = nx;
    camera.position.z = nz;

    // Head bob — only while moving
    const moving = horizSpeed > 0.5;
    if (moving) {
      bobT.current += delta * (8 + horizSpeed * 0.6);
    }
    const bob = moving ? Math.sin(bobT.current) * 0.06 : 0;
    camera.position.y = PLAYER_HEIGHT + bob;
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/*                                   Scene                                    */
/* -------------------------------------------------------------------------- */

export type CyberCityProps = {
  mode: "auto" | "walk";
  onLockChange?: (locked: boolean) => void;
};

const CyberCity = forwardRef<WalkControllerHandle, CyberCityProps>(
  function CyberCity({ mode, onLockChange }, ref) {
  const { buildings, cityRadius } = useMemo(() => generateCity(), []);

  // Internal ref the WalkController writes its imperative API into; we forward
  // it back out to the page so the user's onClick can call requestLock() in
  // the same gesture (browsers require that for Pointer Lock).
  const walkRef = useRef<WalkControllerHandle | null>(null);
  useImperativeHandle(ref, () => ({
    requestLock: () => walkRef.current?.requestLock() ?? false,
  }), []);

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

  const palette = useMemo(
    () => [
      { hue: "#ff3da6", emissive: "#ff3da6" },
      { hue: "#3afff0", emissive: "#3afff0" },
      { hue: "#7aa2ff", emissive: "#7aa2ff" },
      { hue: "#ffd03a", emissive: "#ffd03a" },
      { hue: "#b27aff", emissive: "#b27aff" },
    ],
    []
  );

  const textures = useMemo(
    () =>
      palette.map((p, i) =>
        makeWindowTexture({
          cols: 8,
          rows: 12,
          hue: p.hue,
          density: 0.55,
          seed: 17 + i * 31,
        })
      ),
    [palette]
  );

  // Walk mode uses a closer/lower starting camera; auto uses the cinematic rig
  const initialCamera =
    mode === "walk"
      ? { position: [0, PLAYER_HEIGHT, 4] as [number, number, number], fov: 75 }
      : { position: [0, 5, 14] as [number, number, number], fov: 60 };

  // Ground plane needs to comfortably cover the city + horizon
  const groundSize = Math.max(400, cityRadius * 4);

  return (
    <Canvas
      camera={initialCamera}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#03020a"]} />
      <fog attach="fog" args={["#0a0420", 14, 95]} />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 20, 0]} intensity={1.4} color="#ff3da6" distance={80} />
      <pointLight position={[20, 10, -20]} intensity={1.1} color="#3afff0" distance={80} />
      <pointLight position={[-20, 8, -10]} intensity={0.9} color="#7aa2ff" distance={80} />
      <directionalLight position={[5, 30, 10]} intensity={0.25} color="#aab8ff" />

      {mode === "auto" ? (
        <CinematicRig />
      ) : (
        <WalkController
          buildings={buildings}
          cityRadius={cityRadius}
          onLockChange={(locked) => onLockChange?.(locked)}
          controllerRef={walkRef}
        />
      )}

      <WetGround size={groundSize} />

      {buildings.map((b, i) => (
        <BuildingMesh
          key={i}
          b={b}
          texture={textures[b.textureIndex]}
          emissive={palette[b.textureIndex].emissive}
        />
      ))}

      {streaks.map((s, i) => (
        <NeonStreak key={i} {...s} />
      ))}

      <Rain count={1200} />

      <BillboardLayer buildings={buildings} />

      <Sparkles
        count={120}
        scale={[80, 30, 80]}
        position={[0, 10, 0]}
        size={2.5}
        speed={0.25}
        opacity={0.5}
        color="#3afff0"
      />

      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.18}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0012, 0.0012)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise opacity={0.06} />
        <Vignette eskil={false} offset={0.18} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
});

export default CyberCity;
