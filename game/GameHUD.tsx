"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PLAYER_COLORS, PLAYER_LABELS } from "@/game/config";
import { gameState, resetGameState } from "@/game/state";
import { resetOrbs } from "@/game/orbs";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

function subscribeScores(onChange: () => void) {
  const h = () => onChange();
  window.addEventListener("game-score", h);
  window.addEventListener("game-hazard", h);
  return () => {
    window.removeEventListener("game-score", h);
    window.removeEventListener("game-hazard", h);
  };
}

export function GameHUD() {
  const slots = useConnectedSlotIndexes();
  const scoreRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLSpanElement>(null);
  const [hazardFlash, setHazardFlash] = useState(false);

  const scoreSnap = useSyncExternalStore(
    subscribeScores,
    () =>
      JSON.stringify({
        scores: gameState.scores,
        orbs: gameState.orbsCollected,
        boosts: gameState.boostPadsHit,
      }),
    () => "{}"
  );

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onHazard = () => {
      setHazardFlash(true);
      clearTimeout(t);
      t = setTimeout(() => setHazardFlash(false), 400);
    };
    window.addEventListener("game-hazard", onHazard);
    return () => {
      window.removeEventListener("game-hazard", onHazard);
      clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!scoreRef.current) return;
    const lines = (slots.length ? slots : [0]).map((slot) => {
      const label = PLAYER_LABELS[slot] ?? `P${slot + 1}`;
      const score = gameState.scores[slot] ?? 0;
      return `<span style="color:${PLAYER_COLORS[slot]}">${label}: ${score}</span>`;
    });
    scoreRef.current.innerHTML = lines.join(" · ");
    if (orbsRef.current) {
      orbsRef.current.textContent = `${gameState.orbsCollected} orbs · ${gameState.boostPadsHit} boosts`;
    }
  }, [scoreSnap, slots]);

  const reset = () => {
    resetGameState();
    resetOrbs();
    window.dispatchEvent(new CustomEvent("game-score"));
  };

  return (
    <>
      <div className={`gp-hud gp-hud--game${hazardFlash ? " is-hit" : ""}`}>
        <div className="gp-hud__head">
          <span className="gp-hud__label">Orb Rush — Open World</span>
        </div>
        <div ref={scoreRef} className="gp-hud__line" style={{ fontSize: "0.85rem" }} />
        <p className="gp-hud__line" style={{ marginTop: "0.5rem" }}>
          <span ref={orbsRef}>0 orbs · 0 boosts</span>
        </p>
        <p className="gp-hud__meta" style={{ marginTop: "0.5rem", lineHeight: 1.5 }}>
          <strong>Left stick</strong> move · <strong>Right stick</strong> orbit camera ·{" "}
          <strong>R2</strong> boost · <strong>×</strong> dash · golden orbs = 50pts · dodge drones
        </p>
        <p className="gp-hud__meta" style={{ marginTop: "0.25rem" }}>
          Up to 4 controllers · teal rings = speed boost
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
