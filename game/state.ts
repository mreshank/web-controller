/** Mutable game state updated in useFrame — no React re-renders. */
export type GameScores = Record<number, number>;

export const gameState = {
  scores: { 0: 0, 1: 0, 2: 0, 3: 0 } as GameScores,
  orbsCollected: 0,
};

export function resetGameState() {
  gameState.scores = { 0: 0, 1: 0, 2: 0, 3: 0 };
  gameState.orbsCollected = 0;
}
