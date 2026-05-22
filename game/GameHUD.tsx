"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { GAME_MISSION, PLAYER_COLORS, PLAYER_LABELS, VAULT_SHIELDS_MAX } from "@/game/config";
import { gameToast, getCombo, getShields, resetRuntimes } from "@/game/game-rules";
import { gameState, resetGameState } from "@/game/state";
import { resetOrbs } from "@/game/orbs";
import { useConnectedSlotIndexes } from "@/hooks/useGamepad";

function subscribeGame(onChange: () => void) {
  const h = () => onChange();
  window.addEventListener("game-score", h);
  window.addEventListener("game-hazard", h);
  window.addEventListener("game-toast", h);
  return () => {
    window.removeEventListener("game-score", h);
    window.removeEventListener("game-hazard", h);
    window.removeEventListener("game-toast", h);
  };
}

export function GameHUD() {
  const slots = useConnectedSlotIndexes();
  const hudRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);
  const toastRef = useRef<HTMLParagraphElement>(null);
  const hazardRef = useRef(false);

  const paint = useCallback(() => {
    const active = slots.length ? slots : [0];
    if (scoreRef.current) {
      scoreRef.current.innerHTML = active
        .map((slot) => {
          const label = PLAYER_LABELS[slot] ?? `P${slot + 1}`;
          const score = gameState.scores[slot] ?? 0;
          const combo = getCombo(slot);
          const shields = getShields(slot);
          const comboTag = combo > 1 ? ` <span style="opacity:0.7">×${(1 + (combo - 1) * 0.35).toFixed(1)}</span>` : "";
          const shieldTag = ` <span style="opacity:0.55">♥${shields}</span>`;
          return `<span style="color:${PLAYER_COLORS[slot]}">${label}: ${score}${comboTag}${shieldTag}</span>`;
        })
        .join(" · ");
    }
    if (metaRef.current) {
      metaRef.current.textContent = `${gameState.orbsCollected}/${gameState.totalOrbs} orbs · ${gameState.boostPadsHit} relays`;
    }
    const now = performance.now();
    if (toastRef.current) {
      if (gameToast.until > now && gameToast.text) {
        toastRef.current.textContent = gameToast.text;
        toastRef.current.style.color = gameToast.color;
        toastRef.current.style.opacity = "1";
      } else {
        toastRef.current.style.opacity = "0";
      }
    }
    if (hudRef.current) {
      hudRef.current.classList.toggle("is-hit", hazardRef.current);
    }
  }, [slots]);

  useEffect(() => {
    paint();
    return subscribeGame(paint);
  }, [paint]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onHazard = () => {
      hazardRef.current = true;
      paint();
      clearTimeout(t);
      t = setTimeout(() => {
        hazardRef.current = false;
        paint();
      }, 450);
    };
    window.addEventListener("game-hazard", onHazard);
    return () => {
      window.removeEventListener("game-hazard", onHazard);
      clearTimeout(t);
    };
  }, [paint]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (gameToast.until > performance.now()) paint();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paint]);

  const reset = () => {
    resetGameState();
    resetOrbs();
    resetRuntimes();
    window.dispatchEvent(new CustomEvent("game-score"));
  };

  return (
    <>
      <div ref={hudRef} className="gp-hud gp-hud--game">
        <div className="gp-hud__head">
          <span className="gp-hud__label">Vault Run</span>
        </div>
        <p className="gp-hud__meta gp-game-mission">{GAME_MISSION}</p>
        <div ref={scoreRef} className="gp-hud__line" style={{ fontSize: "0.88rem", marginTop: "0.65rem" }} />
        <p ref={metaRef} className="gp-hud__line" style={{ marginTop: "0.4rem" }} />
        <p ref={toastRef} className="gp-game-toast" aria-live="polite" />
        <p className="gp-hud__meta" style={{ marginTop: "0.65rem", lineHeight: 1.5 }}>
          <strong>Left stick</strong> move · <strong>Right stick</strong> orbit ·{" "}
          <strong>R2</strong> speed · <strong>×</strong> dash · chain orbs for combo ·{" "}
          {VAULT_SHIELDS_MAX} shields vs drones
        </p>
      </div>
      <div className="gp-chrome">
        <div className="gp-chrome__row">
          <button type="button" className="gp-btn" onClick={reset}>
            Reset run
          </button>
          <Link href="/" className="gp-btn">
            Hub
          </Link>
        </div>
      </div>
    </>
  );
}
