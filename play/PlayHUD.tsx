"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PLAY_RANKS } from "@/lib/play/constants";
import type { PlayIdentity } from "@/lib/play/identity";
import type { PlaySocketState } from "@/hooks/usePlaySocket";
import type { RoomSnapshot } from "@/lib/play/simulation";

type PlayHUDProps = {
  identity: PlayIdentity;
  socket: PlaySocketState;
};

function phaseLabel(room: RoomSnapshot | null): string {
  if (!room) return "Linking to breach network…";
  switch (room.phase) {
    case "waiting":
      return `Staging breach · ${room.players.length}/4 runners`;
    case "countdown":
      return "Breach opens in…";
    case "live": {
      const left = Math.max(0, Math.ceil((room.phaseEndsAt - Date.now()) / 1000));
      return `${room.chapterTitle} · ${left}s`;
    }
    case "verdict":
      return "Vault verdict";
    default:
      return "";
  }
}

export function PlayHUD({ identity, socket }: PlayHUDProps) {
  const { room, online, queue, toast, verdict, connected, error } = socket;
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setToastVisible(true);
    const t = setTimeout(() => setToastVisible(false), 1800);
    return () => clearTimeout(t);
  }, [toast?.text, toast?.color]);

  const local = room?.players.find((p) => p.uid === identity.uid);

  return (
    <>
      <div className="gp-hud gp-hud--game gp-play-hud">
        <div className="gp-hud__head">
          <span className="gp-hud__label">Nexus Breach</span>
          <span className="gp-play-codename">{identity.codename}</span>
        </div>
        <p className="gp-hud__meta gp-game-mission">
          {room?.chapterBlurb ??
            "Online vault heist — relics, rank, and breach tax. Minimum 2 runners to open a room."}
        </p>
        <p className="gp-hud__line" style={{ marginTop: "0.5rem", fontSize: "0.88rem" }}>
          {phaseLabel(room)}
        </p>
        {room?.phase === "live" && local ? (
          <p className="gp-hud__line" style={{ marginTop: "0.45rem" }}>
            <span style={{ color: "#f97316" }}>
              {PLAY_RANKS[local.rank]} · {local.score} pts
            </span>
            {" · "}
            streak {local.streak.toFixed(1)} · relics {local.relics} · shields ♥{local.shields}
            {local.penaltyDebt > 0 ? ` · tax debt ${local.penaltyDebt}` : ""}
          </p>
        ) : null}
        {room ? (
          <p className="gp-hud__meta" style={{ marginTop: "0.35rem" }}>
            {room.collectedOrbs.length}/{room.orbTotal} relics · team vault {room.teamRelics}
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
          sprint · <strong>×</strong> dash · golden relics raise rank · drones inflict breach tax
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
