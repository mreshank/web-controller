import { PORTFOLIO_WORLD_HALF } from "@/portfolio/config";

export function portfolioHeight(x: number, z: number): number {
  const a = Math.sin(x * 0.06) * Math.cos(z * 0.05) * 1.4;
  const b = Math.sin(x * 0.11 + z * 0.09) * 0.7;
  const edge = Math.max(Math.abs(x), Math.abs(z)) / PORTFOLIO_WORLD_HALF;
  const falloff = 1 - Math.min(1, edge * edge);
  return (a + b) * falloff;
}

export function clampPortfolio(x: number, z: number): [number, number] {
  const m = PORTFOLIO_WORLD_HALF - 2;
  return [Math.max(-m, Math.min(m, x)), Math.max(-m, Math.min(m, z))];
}
