import type { RoomSnapshot } from "@/lib/play/simulation";

/** Authoritative room state — updated by WebSocket, read in useFrame (not React). */
export const playRoomRef: { current: RoomSnapshot | null } = { current: null };

export function setPlayRoom(snapshot: RoomSnapshot | null) {
  playRoomRef.current = snapshot;
}
