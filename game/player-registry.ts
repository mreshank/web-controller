import { Vector3 } from "three";

export const playerPositions = new Map<number, Vector3>();

export function setPlayerPosition(slot: number, x: number, y: number, z: number) {
  let v = playerPositions.get(slot);
  if (!v) {
    v = new Vector3();
    playerPositions.set(slot, v);
  }
  v.set(x, y, z);
}

export function getFocusCentroid(): Vector3 {
  const out = new Vector3();
  let n = 0;
  playerPositions.forEach((p) => {
    out.add(p);
    n++;
  });
  if (n === 0) return out;
  out.divideScalar(n);
  return out;
}
