"use client";

import { memo, useMemo } from "react";
import { SceneShell } from "@/components/shared/SceneShell";
import { PLAYER_COLORS } from "@/game/config";
import { GameCamera } from "@/game/GameCamera";
import { PlayerRover } from "@/game/PlayerRover";
import { WorldEnvironment } from "@/game/WorldEnvironment";
import { OrbsField } from "@/game/OrbsField";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

const SPAWNS: Array<[number, number, number]> = [
  [-8, 0, -8],
  [8, 0, -8],
  [-8, 0, 8],
  [8, 0, 8],
];

function GameArenaInner() {
  const connected = useConnectedSlotIndexes();
  const slots = useMemo(
    () => (connected.length > 0 ? connected : [0]),
    [connected.join(",")]
  );
  const cameraSlot = slots[0] ?? 0;

  return (
    <div className="gp-canvas-wrap">
      <SceneShell
        camera={{ position: [0, 14, 18], fov: 54 }}
        showGrid={false}
        showStars={false}
        dpr={[1, 1.5]}
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
        <OrbsField />
        <GameCamera controlSlot={cameraSlot} />
      </SceneShell>
    </div>
  );
}

export const GameArena = memo(GameArenaInner);
