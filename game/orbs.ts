import { GOLDEN_ORB_COUNT, ORB_COUNT, WORLD_HALF } from "@/game/config";
import { terrainHeight } from "@/game/terrain";

export type OrbDef = {
  position: [number, number, number];
  golden: boolean;
};

function seeded(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

const rnd = seeded(4242);

export const orbDefs: OrbDef[] = Array.from({ length: ORB_COUNT }, (_, i) => {
  const golden = i >= ORB_COUNT - GOLDEN_ORB_COUNT;
  const x = (rnd() - 0.5) * WORLD_HALF * 1.55;
  const z = (rnd() - 0.5) * WORLD_HALF * 1.55;
  const y = terrainHeight(x, z) + (golden ? 1.4 : 1.1);
  return { position: [x, y, z], golden };
});

/** @deprecated use orbDefs */
export const orbPositions = orbDefs.map((o) => o.position);

export const collectedOrbIds = new Set<number>();

export function tryCollectOrb(
  _slotIndex: number,
  x: number,
  z: number
): number | null {
  for (let i = 0; i < orbDefs.length; i++) {
    if (collectedOrbIds.has(i)) continue;
    const o = orbDefs[i]!;
    const dx = x - o.position[0];
    const dz = z - o.position[2];
    const r = o.golden ? 1.6 : 1.25;
    if (dx * dx + dz * dz < r * r) {
      collectedOrbIds.add(i);
      return i;
    }
  }
  return null;
}

export function resetOrbs() {
  collectedOrbIds.clear();
}
