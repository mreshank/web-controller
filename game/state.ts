import { BOOST_PAD_VALUE, GOLDEN_ORB_VALUE, ORB_VALUE } from "@/game/config";
import { orbDefs } from "@/game/orbs";

export const gameState = {
  scores: {} as Record<number, number>,
  orbsCollected: 0,
  boostPadsHit: 0,
};

export function orbScoreForId(id: number): number {
  return orbDefs[id]?.golden ? GOLDEN_ORB_VALUE : ORB_VALUE;
}

export function resetGameState() {
  gameState.scores = {};
  gameState.orbsCollected = 0;
  gameState.boostPadsHit = 0;
}

export function addBoostPadScore(slot: number) {
  gameState.scores[slot] = (gameState.scores[slot] ?? 0) + BOOST_PAD_VALUE;
  gameState.boostPadsHit += 1;
  window.dispatchEvent(new CustomEvent("game-score"));
}
