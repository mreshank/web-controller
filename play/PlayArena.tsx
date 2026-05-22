"use client";

import { memo, useMemo } from "react";
import { PLAY_TICK_HZ } from "@/lib/play/constants";
import { SceneShell } from "@/components/shared/SceneShell";
import { PLAYER_COLORS } from "@/lib/play/constants";
import type { RoomSnapshot } from "@/lib/play/simulation";
import { NetworkRover } from "@/play/NetworkRover";
import { PlayCamera } from "@/play/PlayCamera";
import { PlayWorld } from "@/play/PlayWorld";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

type PlayArenaProps = {
  room: RoomSnapshot;
  localUid: string;
};

function PlayArenaInner({ room, localUid }: PlayArenaProps) {
  const connected = useConnectedSlotIndexes();
  const cameraSlot = connected[0] ?? 0;
  const players = useMemo(() => room.players, [room.tick, room.players]);
  const hazardClock = room.tick / PLAY_TICK_HZ;

  return (
    <div className="gp-canvas-wrap">
      <SceneShell
        camera={{ position: [0, 14, 18], fov: 52 }}
        showGrid={false}
        showStars={false}
        dpr={[1, 1.25]}
      >
        <PlayWorld
          seed={room.seed}
          collected={room.collectedOrbs}
          hazardClock={hazardClock}
        />
        {players.map((p, i) => (
          <NetworkRover
            key={p.uid}
            player={p}
            color={PLAYER_COLORS[p.slot] ?? PLAYER_COLORS[i]!}
            isLocal={p.uid === localUid}
          />
        ))}
        <PlayCamera controlSlot={cameraSlot} players={players} localUid={localUid} />
      </SceneShell>
    </div>
  );
}

export const PlayArena = memo(PlayArenaInner);
