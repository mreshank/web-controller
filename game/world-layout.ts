import { WORLD_HALF } from "@/game/config";
import { terrainHeight } from "@/game/terrain";

export type WorldRock = {
  position: [number, number, number];
  scale: number;
  rot: number;
};

export type WorldTree = {
  position: [number, number, number];
  scale: number;
};

export type BoostPadDef = {
  position: [number, number, number];
  radius: number;
};

export type BeaconDef = {
  position: [number, number, number];
};

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const rnd = seeded(90210);

export const worldRocks: WorldRock[] = Array.from({ length: 48 }, () => {
  const x = (rnd() - 0.5) * WORLD_HALF * 1.7;
  const z = (rnd() - 0.5) * WORLD_HALF * 1.7;
  const y = terrainHeight(x, z);
  return {
    position: [x, y, z],
    scale: 0.6 + rnd() * 1.4,
    rot: rnd() * Math.PI * 2,
  };
});

export const worldTrees: WorldTree[] = Array.from({ length: 36 }, () => {
  const x = (rnd() - 0.5) * WORLD_HALF * 1.5;
  const z = (rnd() - 0.5) * WORLD_HALF * 1.5;
  const y = terrainHeight(x, z);
  return { position: [x, y, z], scale: 0.85 + rnd() * 0.6 };
});

export const boostPads: BoostPadDef[] = [
  { position: [0, 0, 0], radius: 3.2 },
  { position: [-18, 0, 12], radius: 2.8 },
  { position: [20, 0, -14], radius: 2.8 },
  { position: [-12, 0, -22], radius: 2.5 },
  { position: [14, 0, 24], radius: 2.5 },
].map((p) => {
  const x = p.position[0];
  const z = p.position[2];
  return {
    ...p,
    position: [x, terrainHeight(x, z), z] as [number, number, number],
  };
});

export const beacons: BeaconDef[] = [
  { position: [0, 0, 0] },
  { position: [-28, 0, -28] },
  { position: [28, 0, -28] },
  { position: [-28, 0, 28] },
  { position: [28, 0, 28] },
].map((b) => {
  const [x, , z] = b.position;
  return { position: [x, terrainHeight(x, z) + 0.1, z] as [number, number, number] };
});

export const hazardPaths: Array<[[number, number, number], [number, number, number]]> = [
  [[-30, 0, 0], [30, 0, 0]],
  [[0, 0, -30], [0, 0, 30]],
  [[-20, 0, -20], [20, 0, 20]],
];
