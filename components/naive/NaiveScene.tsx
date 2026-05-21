"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows } from "@react-three/drei";
import { NaiveConnectPrompt } from "@/components/naive/NaiveConnectPrompt";
import { NaiveCube } from "@/components/naive/NaiveCube";
import { NaiveHUD } from "@/components/naive/NaiveHUD";
import { PresenterChrome } from "@/components/PresenterChrome";

export function NaiveScene() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 4, 7], fov: 50 }}
        className="touch-none"
      >
        <color attach="background" args={["#0f172a"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />
        <Grid
          infiniteGrid
          fadeDistance={25}
          fadeStrength={1}
          cellSize={0.5}
          sectionSize={2}
          sectionColor="#334155"
          cellColor="#1e293b"
        />
        <NaiveCube />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={12} blur={2} />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      <NaiveHUD />
      <NaiveConnectPrompt />
      <PresenterChrome variant="naive" />
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 text-center text-[10px] text-amber-400/60">
        Press any button on your controller · then compare with{" "}
        <span className="text-green-400/80">Production demo</span> (top right)
      </div>
    </div>
  );
}
