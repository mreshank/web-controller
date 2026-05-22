"use client";

import Link from "next/link";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { PLAYER_COLORS, PLAYER_LABELS } from "@/game/config";
import { gameState, resetGameState } from "@/game/state";
import { resetOrbs } from "@/game/orbs";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

function subscribeScores(onChange: () => void) {
  const h = () => onChange();
  window.addEventListener("game-score", h);
  return () => window.removeEventListener("game-score", h);
}

export function GameHUD() {
  const slots = useConnectedSlotIndexes();
  const scoreRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLSpanElement>(null);

  const scoreSnap = useSyncExternalStore(
    subscribeScores,
    () =>
      JSON.stringify({
        scores: gameState.scores,
        orbs: gameState.orbsCollected,
      }),
    () => "{}"
  );

  useEffect(() => {
    if (!scoreRef.current) return;
    const lines = (slots.length ? slots : [0]).map((slot) => {
      const label = PLAYER_LABELS[slot] ?? `P${slot + 1}`;
      const score = gameState.scores[slot] ?? 0;
      return `<span style="color:${PLAYER_COLORS[slot]}">${label}: ${score}</span>`;
    });
    scoreRef.current.innerHTML = lines.join(" · ");
    if (orbsRef.current) orbsRef.current.textContent = String(gameState.orbsCollected);
  }, [scoreSnap, slots]);

  const reset = () => {
    resetGameState();
    resetOrbs();
    window.dispatchEvent(new CustomEvent("game-score"));
  };

  return (
    <>
      <div className="gp-hud gp-hud--game">
        <div className="gp-hud__head">
          <span className="gp-hud__label">Orb Rush</span>
        </div>
        <div ref={scoreRef} className="gp-hud__line" style={{ fontSize: "0.85rem" }} />
        <p className="gp-hud__line" style={{ marginTop: "0.5rem" }}>
          Orbs: <span ref={orbsRef}>0</span> · R2 boost · × pulse
        </p>
        <p className="gp-hud__meta" style={{ marginTop: "0.35rem" }}>
          Up to 4 controllers
        </p>
      </div>
      <div className="gp-chrome">
        <div className="gp-chrome__row">
          <button type="button" className="gp-btn" onClick={reset}>
            Reset
          </button>
          <Link href="/" className="gp-btn">
            Hub
          </Link>
        </div>
      </div>
    </>
  );
}
