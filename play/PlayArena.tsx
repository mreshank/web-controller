"use client";

import { memo } from "react";
import { PlaySceneShell } from "@/components/shared/PlaySceneShell";
import { PlayCamera } from "@/play/PlayCamera";
import { PlaySceneDriver } from "@/play/PlaySceneDriver";
import { PlayWorld } from "@/play/PlayWorld";

type PlayArenaProps = {
  roomId: string;
  seed: number;
  localUid: string;
};

function PlayArenaInner({ seed, localUid }: PlayArenaProps) {
  return (
    <div className="gp-canvas-wrap">
      <PlaySceneShell camera={{ position: [0, 14, 18], fov: 50 }}>
        <PlayWorld seed={seed} />
        <PlaySceneDriver seed={seed} localUid={localUid} />
        <PlayCamera controlSlot={0} localUid={localUid} />
      </PlaySceneShell>
    </div>
  );
}

export const PlayArena = memo(PlayArenaInner);
