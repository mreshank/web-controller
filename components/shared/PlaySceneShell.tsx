"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

type PlaySceneShellProps = {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
};

export function PlaySceneShell({
  children,
  camera = { position: [0, 14, 18], fov: 50 },
}: PlaySceneShellProps) {
  return (
    <Canvas
      shadows={false}
      dpr={1}
      className="touch-none"
      camera={camera}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
    >
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={1} />
      {children}
    </Canvas>
  );
}
