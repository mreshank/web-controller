"use client";

import Link from "next/link";
import { STORY_CHAPTERS } from "@/story/chapters";

type StoryHUDProps = {
  nearbyId: string | null;
  visited: Set<string>;
};

export function StoryHUD({ nearbyId, visited }: StoryHUDProps) {
  const nearby = STORY_CHAPTERS.find((c) => c.id === nearbyId);

  return (
    <>
      <div className="gp-hud gp-hud--story">
        <div className="gp-hud__head">
          <span className="gp-hud__label">Story world</span>
        </div>
        <p className="gp-hud__line">Fly · look · visit any beacon</p>
        {nearby ? (
          <p className="gp-hud__line" style={{ color: nearby.color, marginTop: "0.5rem" }}>
            Near: {nearby.title} — press ×
          </p>
        ) : (
          <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
            Find a glowing beacon…
          </p>
        )}
        <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
          {visited.size}/{STORY_CHAPTERS.length} discovered
        </p>
      </div>
      <div className="gp-chrome">
        <Link href="/" className="gp-btn">
          Hub
        </Link>
      </div>
    </>
  );
}
