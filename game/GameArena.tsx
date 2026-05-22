"use client";

import { SceneShell } from "@/components/shared/SceneShell";
import { PLAYER_COLORS } from "@/game/config";
import { GameCamera } from "@/game/GameCamera";
import { PlayerRover } from "@/game/PlayerRover";
import { WorldEnvironment } from "@/game/WorldEnvironment";
import { Orb } from "@/game/Orb";
import { orbDefs } from "@/game/orbs";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

const SPAWNS: Array<[number, number, number]> = [
  [-8, 0, -8],
  [8, 0, -8],
  [-8, 0, 8],
  [8, 0, 8],
];

export function GameArena() {
  const connected = useConnectedSlotIndexes();
  const slots = connected.length > 0 ? connected : [0];
  const cameraSlot = slots[0] ?? 0;

  return (
    <div className="gp-canvas-wrap">
      <SceneShell
        camera={{ position: [0, 14, 18], fov: 52 }}
        showGrid={false}
        showStars={false}
      >
        <WorldEnvironment />
        {slots.map((slot, i) => (
          <PlayerRover
            key={slot}
            slotIndex={slot}
            color={PLAYER_COLORS[slot] ?? PLAYER_COLORS[i]!}
            spawn={SPAWNS[slot] ?? SPAWNS[i]!}
          />
        ))}
        {orbDefs.map((def, id) => (
          <Orb key={id} id={id} def={def} />
        ))}
        <GameCamera controlSlot={cameraSlot} />
      </SceneShell>
    </div>
  );
}
