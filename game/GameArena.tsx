"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { SceneShell } from "@/components/shared/SceneShell";
import { ARENA_HALF, PLAYER_COLORS } from "@/game/config";
import { PlayerShip } from "@/game/PlayerShip";
import { Orb } from "@/game/Orb";
import { orbPositions } from "@/game/orbs";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

const SPAWNS: Array<[number, number, number]> = [
  [-6, 0.6, -6],
  [6, 0.6, -6],
  [-6, 0.6, 6],
  [6, 0.6, 6],
];

export function GameArena() {
  const connected = useConnectedSlotIndexes();
  const slots = connected.length > 0 ? connected : [0];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <SceneShell camera={{ position: [0, 28, 32], fov: 45 }} showStars>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[ARENA_HALF * 2.2, ARENA_HALF * 2.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.8} />
        </mesh>
        {slots.map((slot, i) => (
          <PlayerShip
            key={slot}
            slotIndex={slot}
            color={PLAYER_COLORS[slot] ?? PLAYER_COLORS[i]!}
            spawn={SPAWNS[slot] ?? SPAWNS[i]!}
          />
        ))}
        {orbPositions.map((pos, id) => (
          <Orb key={id} id={id} position={pos} />
        ))}
        <ContactShadows opacity={0.35} scale={50} blur={2} />
        <OrbitControls
          enablePan={false}
          minDistance={12}
          maxDistance={55}
          maxPolarAngle={Math.PI / 2.2}
        />
      </SceneShell>
    </div>
  );
}
