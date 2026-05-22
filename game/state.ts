import { BOOST_PAD_VALUE, GOLDEN_ORB_VALUE, ORB_VALUE } from "@/game/config";
import { orbDefs } from "@/game/orbs";

export const gameState = {
  scores: {} as Record<number, number>,
  orbsCollected: 0,
  boostPadsHit: 0,
  totalOrbs: orbDefs.length,
};

export function orbScoreForId(id: number): number {
  return orbDefs[id]?.golden ? GOLDEN_ORB_VALUE : ORB_VALUE;
}

export function applyScoreDelta(slot: number, delta: number) {
  gameState.scores[slot] = Math.max(0, (gameState.scores[slot] ?? 0) + delta);
}

export function resetGameState() {
  gameState.scores = {};
  gameState.orbsCollected = 0;
  gameState.boostPadsHit = 0;
}

export function addBoostPadScore(slot: number) {
  applyScoreDelta(slot, BOOST_PAD_VALUE);
  gameState.boostPadsHit += 1;
}
