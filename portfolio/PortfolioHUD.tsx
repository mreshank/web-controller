"use client";

import Link from "next/link";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";

type Props = {
  nearbyId: string | null;
  visited: Set<string>;
};

export function PortfolioHUD({ nearbyId, visited }: Props) {
  const nearby = PORTFOLIO_BEACONS.find((b) => b.id === nearbyId);

  return (
    <>
      <div className="gp-hud gp-hud--portfolio">
        <div className="gp-hud__head">
          <span className="gp-hud__label">Eshank Tyagi — 3D portfolio</span>
        </div>
        <p className="gp-hud__line">
          <strong>Walk</strong> stick or WASD · <strong>Look</strong> right stick ·{" "}
          <strong>R2</strong> sprint · <strong>×</strong> or Enter · <strong>○</strong> close
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
            Follow the teal path — visit each beacon in any order
          </p>
        )}
        <div className="gp-story-progress" aria-label="Chapters visited">
          {PORTFOLIO_BEACONS.map((ch) => (
            <span
              key={ch.id}
              className={`gp-story-dot${visited.has(ch.id) ? " is-visited" : ""}${nearbyId === ch.id ? " is-near" : ""}`}
              style={
                visited.has(ch.id) || nearbyId === ch.id
                  ? { borderColor: ch.color, background: visited.has(ch.id) ? ch.color : "transparent" }
                  : undefined
              }
              title={ch.title}
            />
          ))}
        </div>
        <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
          {visited.size}/{PORTFOLIO_BEACONS.length} chapters ·{" "}
          <a href="https://mreshank.com" style={{ color: "#1eaedb" }}>
            mreshank.com
          </a>
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
