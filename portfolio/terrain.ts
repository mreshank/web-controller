import { PORTFOLIO_WORLD_HALF } from "@/portfolio/config";

/** Gentle grass hills — walkable village ground. */
export function portfolioHeight(x: number, z: number): number {
  const gentle =
    Math.sin(x * 0.04) * Math.cos(z * 0.035) * 0.45 +
    Math.sin(x * 0.09 + 1.2) * Math.cos(z * 0.07) * 0.2;
  const edge = Math.max(Math.abs(x), Math.abs(z)) / PORTFOLIO_WORLD_HALF;
  const falloff = 1 - Math.min(1, edge * edge * 1.1);
  return gentle * falloff;
}

export function clampPortfolio(x: number, z: number): [number, number] {
  const m = PORTFOLIO_WORLD_HALF - 3;
  return [Math.max(-m, Math.min(m, x)), Math.max(-m, Math.min(m, z))];
}
