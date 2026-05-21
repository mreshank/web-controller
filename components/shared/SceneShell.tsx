"use client";

import { Canvas } from "@react-three/fiber";
import { Grid, Stars } from "@react-three/drei";
import type { ReactNode } from "react";

type SceneShellProps = {
  children: ReactNode;
  camera?: { position: [number, number, number]; fov?: number };
  showGrid?: boolean;
  showStars?: boolean;
  className?: string;
};

export function SceneShell({
  children,
  camera = { position: [0, 4, 7], fov: 50 },
  showGrid = true,
  showStars = false,
  className = "touch-none",
}: SceneShellProps) {
  return (
    <Canvas shadows camera={camera} className={className}>
      <color attach="background" args={["#030712"]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-10, 6, -8]} intensity={0.6} color="#38bdf8" />
      <pointLight position={[10, 4, 10]} intensity={0.5} color="#f472b6" />
      {showStars ? (
        <Stars radius={80} depth={40} count={6000} factor={3} fade speed={0.5} />
      ) : null}
      {showGrid ? (
        <Grid
          infiniteGrid
          fadeDistance={30}
          fadeStrength={1}
          cellSize={0.5}
          sectionSize={2}
          sectionColor="#334155"
          cellColor="#1e293b"
        />
      ) : null}
      {children}
    </Canvas>
  );
}
