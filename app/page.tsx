"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows } from "@react-three/drei";
import { Cube } from "@/components/Cube";
import { GamepadHUD } from "@/components/GamepadHUD";
import { ConnectPrompt } from "@/components/ConnectPrompt";

export default function Page() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 4, 7], fov: 50 }}
        className="touch-none"
      >
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <Grid
          infiniteGrid
          fadeDistance={25}
          fadeStrength={1}
          cellSize={0.5}
          sectionSize={2}
          sectionColor="#334155"
          cellColor="#1e293b"
        />
        <Cube />
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.4}
          scale={12}
          blur={2}
        />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>

      <GamepadHUD />
      <ConnectPrompt />

      <div className="pointer-events-none absolute bottom-4 right-4 z-10 max-w-xs text-right text-[10px] text-white/40">
        Left stick · move · Right stick · rotate · Face buttons · color · L2/R2 ·
        scale
      </div>
    </div>
  );
}
