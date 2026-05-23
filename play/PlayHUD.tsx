"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PLAY_RANKS } from "@/lib/play/constants";
import type { PlayIdentity } from "@/lib/play/identity";
import type { PlayHudState } from "@/hooks/usePlaySocket";

type PlayHUDProps = {
  identity: PlayIdentity;
  hud: PlayHudState;
};

function phaseLabel(meta: PlayHudState["roomMeta"]): string {
  if (!meta) return "Linking to breach network…";
  switch (meta.phase) {
    case "waiting":
      return `Staging breach · ${meta.playerCount}/4 runners`;
    case "countdown":
      return "Breach opens in…";
    case "live": {
      const left = Math.max(0, Math.ceil((meta.phaseEndsAt - Date.now()) / 1000));
      return `${meta.chapterTitle} · ${left}s`;
    }
    case "verdict":
      return "Vault verdict";
    default:
      return "";
  }
}

export function PlayHUD({ identity, hud }: PlayHUDProps) {
  const { roomMeta, localStats, online, queue, toast, verdict, connected, error } = hud;
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setToastVisible(true);
    const t = setTimeout(() => setToastVisible(false), 1800);
    return () => clearTimeout(t);
  }, [toast?.text, toast?.color]);

  return (
    <>
      <div className="gp-hud gp-hud--game gp-play-hud">
        <div className="gp-hud__head">
          <span className="gp-hud__label">Nexus Breach</span>
          <span className="gp-play-codename">{identity.codename}</span>
        </div>
        <p className="gp-hud__meta gp-game-mission">
          {roomMeta?.chapterBlurb ??
            "Online vault heist — relics, rank, and breach tax. Minimum 2 runners to open a room."}
        </p>
        <p className="gp-hud__line" style={{ marginTop: "0.5rem", fontSize: "0.88rem" }}>
          {phaseLabel(roomMeta)}
        </p>
        {roomMeta?.phase === "live" && localStats ? (
          <p className="gp-hud__line" style={{ marginTop: "0.45rem" }}>
            <span style={{ color: "#f97316" }}>
              {PLAY_RANKS[localStats.rank]} · {localStats.score} pts
            </span>
            {" · "}
            streak {localStats.streak.toFixed(1)} · relics {localStats.relics} · shields ♥
            {localStats.shields}
            {localStats.penaltyDebt > 0 ? ` · tax debt ${localStats.penaltyDebt}` : ""}
          </p>
        ) : null}
        {roomMeta ? (
          <p className="gp-hud__meta" style={{ marginTop: "0.35rem" }}>
            {roomMeta.orbCollected}/{roomMeta.orbTotal} relics · team vault {roomMeta.teamRelics}
          </p>
        ) : null}
        {toast && toastVisible ? (
          <p className="gp-game-toast" style={{ color: toast.color, opacity: 1 }}>
            {toast.text}
          </p>
        ) : (
          <p className="gp-game-toast" aria-live="polite" />
        )}
        <section className="gp-play-lobby" aria-label="Online runners">
          <p className="gp-section-label">Live network ({online.length})</p>
          <ul className="gp-play-roster">
            {online.map((p) => (
              <li key={p.uid} className={p.uid === identity.uid ? "is-you" : ""}>
                <span className="gp-play-roster__name">{p.codename}</span>
                <span className="gp-play-roster__meta">
                  {p.roomId ? "in breach" : queue > 0 ? "queued" : "lobby"}
                </span>
              </li>
            ))}
          </ul>
        </section>
        {verdict ? (
          <div className="gp-play-verdict">
            <p className="gp-heading" style={{ fontSize: "0.95rem" }}>
              Vault verdict
            </p>
            <ol>
              {verdict.map((v, i) => (
                <li key={v.uid}>
                  #{i + 1} {v.codename} — {v.rank} ({v.score})
                </li>
              ))}
            </ol>
          </div>
        ) : null}
        {error ? (
          <p className="gp-play-error" role="alert">
            {error}
          </p>
        ) : null}
        {!connected ? (
          <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
            Connecting…
          </p>
        ) : null}
        <p className="gp-hud__meta" style={{ marginTop: "0.65rem", lineHeight: 1.5 }}>
          <strong>Left stick</strong> move · <strong>Right stick</strong> orbit · <strong>R2</strong>{" "}
          sprint · <strong>×</strong> dash
        </p>
      </div>
      <div className="gp-chrome">
        <div className="gp-chrome__row">
          <Link href="/game" className="gp-btn">
            Solo vault (/game)
          </Link>
        </div>
      </div>
    </>
  );
}
