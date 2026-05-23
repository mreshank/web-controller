"use client";

import { useEffect, useState } from "react";
import { PLAYER_COLORS } from "@/lib/play/constants";
import { playRoomRef } from "@/play/play-room-store";
import { NetworkRover } from "@/play/NetworkRover";

type RunnerEntry = { uid: string; slot: number };

type PlayRunnersProps = {
  localUid: string;
};

export function PlayRunners({ localUid }: PlayRunnersProps) {
  const [runners, setRunners] = useState<RunnerEntry[]>([]);

  useEffect(() => {
    const sync = () => {
      const room = playRoomRef.current;
      if (!room) return;
      const next = room.players.map((p) => ({ uid: p.uid, slot: p.slot }));
      setRunners((prev) => {
        const a = prev.map((r) => r.uid).join(",");
        const b = next.map((r) => r.uid).join(",");
        return a === b ? prev : next;
      });
    };
    sync();
    const id = setInterval(sync, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {runners.map((r) => (
        <NetworkRover
          key={r.uid}
          uid={r.uid}
          color={PLAYER_COLORS[r.slot] ?? PLAYER_COLORS[0]!}
          isLocal={r.uid === localUid}
        />
      ))}
    </>
  );
}
