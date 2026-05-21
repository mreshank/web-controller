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
      <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-xl border border-white/10 bg-black/75 p-4 font-mono text-xs text-white backdrop-blur">
        <p className="text-[10px] uppercase tracking-wider text-cyan-400/90">
          Orb Rush · multiplayer
        </p>
        <div ref={scoreRef} className="mt-2 text-sm" />
        <p className="mt-2 text-white/50">
          Orbs: <span ref={orbsRef}>0</span> · L2 lift · R2 boost · × pulse
        </p>
        <p className="mt-2 text-[10px] text-white/40">
          Connect up to 4 controllers · press any button each
        </p>
      </div>
      <div className="absolute top-4 right-4 z-10 flex gap-2 text-xs">
        <button
          type="button"
          onClick={reset}
          className="rounded border border-white/15 bg-black/60 px-3 py-1 text-white/80 hover:bg-white/10"
        >
          Reset
        </button>
        <Link
          href="/"
          className="rounded border border-white/15 bg-black/60 px-3 py-1 text-white/80 hover:bg-white/10"
        >
          Hub
        </Link>
      </div>
    </>
  );
}
