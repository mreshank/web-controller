"use client";

import { OrbitControls, ContactShadows } from "@react-three/drei";
import { SceneShell } from "@/components/shared/SceneShell";
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
    <div className="gp-canvas-wrap">
      <SceneShell
        camera={{ position: [0, 4, 7], fov: 50 }}
        showGrid
        showStars={false}
      >
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
      </SceneShell>
      <p className="gp-legend">
        Left stick · move · Right stick · rotate · Face buttons · color · L2/R2
        · scale
      </p>
    </div>
  );
}
