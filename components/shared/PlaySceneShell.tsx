"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

type PlaySceneShellProps = {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
};

/** Low-GPU canvas: no shadows, no antialiasing, fixed DPR 1. */
export function PlaySceneShell({
  children,
  camera = { position: [0, 14, 18], fov: 50 },
}: PlaySceneShellProps) {
  return (
    <Canvas
      shadows={false}
      dpr={1}
      flat
      className="touch-none"
      camera={camera}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      performance={{ min: 0.5, max: 1, debounce: 200 }}
    >
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[12, 18, 10]} intensity={0.85} />
      {children}
    </Canvas>
  );
}
