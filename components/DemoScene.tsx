"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, ContactShadows } from "@react-three/drei";
import { Cube } from "@/components/Cube";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

const CUBE_SPAWNS: Array<{
  slotIndex: number;
  position: [number, number, number];
  defaultHue: string;
}> = [
  { slotIndex: 0, position: [-1.2, 0.5, 0], defaultHue: "#f97316" },
  { slotIndex: 1, position: [1.2, 0.5, 0], defaultHue: "#38bdf8" },
  { slotIndex: 2, position: [0, 0.5, -1.8], defaultHue: "#a78bfa" },
  { slotIndex: 3, position: [0, 0.5, 1.8], defaultHue: "#4ade80" },
];

export function DemoScene() {
  const connectedSlots = useConnectedSlotIndexes();

  const cubesToShow =
    connectedSlots.length > 0
      ? CUBE_SPAWNS.filter((c) => connectedSlots.includes(c.slotIndex))
      : [CUBE_SPAWNS[0]];

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
        {cubesToShow.map((spawn) => (
          <Cube
            key={spawn.slotIndex}
            slotIndex={spawn.slotIndex}
            position={spawn.position}
            defaultHue={spawn.defaultHue}
          />
        ))}
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

      <div className="pointer-events-none absolute bottom-4 right-4 z-10 max-w-xs text-right text-[10px] text-white/40">
        {connectedSlots.length > 1
          ? `${connectedSlots.length} controllers · slots ${connectedSlots.join(", ")}`
          : "Left stick · move · Right stick · rotate · Face buttons · color · L2/R2 · scale"}
      </div>
    </div>
  );
}
