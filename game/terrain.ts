import { WORLD_HALF } from "@/game/config";

/** Lightweight height field — no extra libraries */
export function terrainHeight(x: number, z: number): number {
  const a = Math.sin(x * 0.07) * Math.cos(z * 0.055) * 2.2;
  const b = Math.sin(x * 0.14 + z * 0.11) * 1.1;
  const c = Math.cos(x * 0.04 - z * 0.09) * 0.8;
  const edge = Math.max(Math.abs(x), Math.abs(z)) / WORLD_HALF;
  const falloff = 1 - Math.min(1, edge * edge * 1.1);
  return (a + b + c) * falloff;
}

export function clampToWorld(x: number, z: number): [number, number] {
  const m = WORLD_HALF - 2;
  return [Math.max(-m, Math.min(m, x)), Math.max(-m, Math.min(m, z))];
}

export function terrainNormal(x: number, z: number): [number, number, number] {
  const e = 0.35;
  const y0 = terrainHeight(x, z);
  const yx = terrainHeight(x + e, z) - y0;
  const yz = terrainHeight(x, z + e) - y0;
  const nx = -yx / e;
  const nz = -yz / e;
  const ny = 1;
  const len = Math.hypot(nx, ny, nz) || 1;
  return [nx / len, ny / len, nz / len];
}
