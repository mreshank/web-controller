import { ARENA_HALF, ORB_COUNT } from "@/game/config";

export const orbPositions: Array<[number, number, number]> = Array.from(
  { length: ORB_COUNT },
  () => [
    (Math.random() - 0.5) * ARENA_HALF * 1.6,
    0.8 + Math.random() * 0.5,
    (Math.random() - 0.5) * ARENA_HALF * 1.6,
  ]
);

export const collectedOrbIds = new Set<number>();

export function tryCollectOrb(
  slotIndex: number,
  x: number,
  z: number
): boolean {
  for (let i = 0; i < orbPositions.length; i++) {
    if (collectedOrbIds.has(i)) continue;
    const o = orbPositions[i]!;
    const dx = x - o[0];
    const dz = z - o[2];
    if (dx * dx + dz * dz < 1.2) {
      collectedOrbIds.add(i);
      return true;
    }
  }
  return false;
}

export function resetOrbs() {
  collectedOrbIds.clear();
}
