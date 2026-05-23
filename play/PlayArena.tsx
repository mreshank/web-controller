"use client";

import { memo } from "react";
import { PlaySceneShell } from "@/components/shared/PlaySceneShell";
import { PlayCamera } from "@/play/PlayCamera";
import { PlayRunners } from "@/play/PlayRunners";
import { PlayWorld } from "@/play/PlayWorld";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

type PlayArenaProps = {
  roomId: string;
  seed: number;
  localUid: string;
};

/** Canvas mounts once per room; game state flows through playRoomRef (no per-tick React). */
function PlayArenaInner({ seed, localUid }: PlayArenaProps) {
  const connected = useConnectedSlotIndexes();
  const cameraSlot = connected[0] ?? 0;

  return (
    <div className="gp-canvas-wrap">
      <PlaySceneShell camera={{ position: [0, 14, 18], fov: 50 }}>
        <PlayWorld seed={seed} />
        <PlayRunners localUid={localUid} />
        <PlayCamera controlSlot={cameraSlot} localUid={localUid} />
      </PlaySceneShell>
    </div>
  );
}

export const PlayArena = memo(PlayArenaInner);
