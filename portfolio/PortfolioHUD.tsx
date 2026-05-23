"use client";

import Link from "next/link";
import { useRef } from "react";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";
import { useGamepad } from "@/hooks/useGamepad";
const FACE_LABELS = ["×", "○", "□", "△"] as const;

type Props = {
  nearbyId: string | null;
  visited: Set<string>;
};

export function PortfolioHUD({ nearbyId, visited }: Props) {
  const nearby = PORTFOLIO_BEACONS.find((b) => b.id === nearbyId);
  const faceRef = useRef<HTMLSpanElement>(null);

  useGamepad((s) => {
    if (!faceRef.current) return;
    if (!s.connected) {
      faceRef.current.textContent = "—";
      return;
    }
    const pressed = FACE_LABELS.map((label, i) =>
      s.buttons[i] ? label : null
    ).filter(Boolean);
    faceRef.current.textContent = pressed.length ? pressed.join(" ") : "—";
  });

  return (
    <>
      <div className="gp-hud gp-hud--portfolio">
        <div className="gp-hud__head">
          <span className="gp-hud__label">Plains village · Eshank Tyagi</span>
        </div>
        <p className="gp-hud__line">
          <strong>Move</strong> left stick · <strong>Look</strong> right stick ·{" "}
          <strong>R2</strong> sprint · <strong>×</strong> at lantern · <strong>○</strong> close book
        </p>
        <p className="gp-hud__meta">
          Face buttons: <span ref={faceRef} className="gp-mono">—</span>
        </p>
        {nearby ? (
          <>
            <p className="gp-hud__line gp-story-nearby" style={{ color: nearby.color }}>
              {nearby.title}
            </p>
            <p className="gp-hud__meta" style={{ marginTop: "0.35rem", color: "var(--gp-text)" }}>
              {nearby.hook}
            </p>
          </>
        ) : (
          <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
            Walk the dirt path — visit each lectern (glow ring) in any order
          </p>
        )}
        <div className="gp-story-progress" aria-label="Chapters visited">
          {PORTFOLIO_BEACONS.map((ch) => (
            <span
              key={ch.id}
              className={`gp-story-dot${visited.has(ch.id) ? " is-visited" : ""}${nearbyId === ch.id ? " is-near" : ""}`}
              style={
                visited.has(ch.id) || nearbyId === ch.id
                  ? {
                      borderColor: ch.color,
                      background: visited.has(ch.id) ? ch.color : "transparent",
                    }
                  : undefined
              }
              title={ch.title}
            />
          ))}
        </div>
        <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
          {visited.size}/{PORTFOLIO_BEACONS.length} chapters · Drop GLB models in{" "}
          <code className="gp-mono">public/portfolio/models/</code>
        </p>
      </div>
      <div className="gp-chrome">
        <Link href="/" className="gp-btn">
          Hub
        </Link>
        <a
          href="https://mreshank.com"
          target="_blank"
          rel="noreferrer"
          className="gp-btn gp-btn--accent"
        >
          Full site ↗
        </a>
      </div>
    </>
  );
}
