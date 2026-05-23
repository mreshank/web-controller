import type { PlayPlayerState, RoomSnapshot } from "@/lib/play/simulation";

export const playRoomRef: { current: RoomSnapshot | null } = { current: null };

/** Fast lookup by slot (0–3) — updated when room snapshot arrives. */
export const playPlayersBySlot: Array<PlayPlayerState | null> = [null, null, null, null];

export let playCollectedSig = "";

export function setPlayRoom(snapshot: RoomSnapshot | null) {
  playRoomRef.current = snapshot;
  playPlayersBySlot[0] = null;
  playPlayersBySlot[1] = null;
  playPlayersBySlot[2] = null;
  playPlayersBySlot[3] = null;
  if (snapshot) {
    for (const p of snapshot.players) {
      if (p.slot >= 0 && p.slot < 4) playPlayersBySlot[p.slot] = p;
    }
    playCollectedSig = snapshot.collectedOrbs.join(",");
  } else {
    playCollectedSig = "";
  }
}

export function playRunnerSig(): string {
  const room = playRoomRef.current;
  if (!room) return "";
  return room.players.map((p) => p.uid).join(",");
}
