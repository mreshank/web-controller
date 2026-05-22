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
          <span className="gp-hud__label">Story world — HTML5 atlas</span>
        </div>
        <p className="gp-hud__line">
          <strong>Left stick</strong> fly · <strong>Right stick</strong> look ·{" "}
          <strong>L2/R2</strong> down/up · <strong>×</strong> read beacon
        </p>
        {nearby ? (
          <>
            <p className="gp-hud__line gp-story-nearby" style={{ color: nearby.color }}>
              {nearby.title}
            </p>
            <p className="gp-hud__meta" style={{ marginTop: "0.35rem", color: "var(--gp-text)" }}>
              {nearby.hook}
            </p>
            <p className="gp-hud__meta" style={{ marginTop: "0.25rem" }}>
              Press × to open full story
            </p>
          </>
        ) : (
          <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
            Fly toward a glowing ring — 7 features, any order
          </p>
        )}
        <div className="gp-story-progress" aria-label="Chapters discovered">
          {STORY_CHAPTERS.map((ch) => (
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
