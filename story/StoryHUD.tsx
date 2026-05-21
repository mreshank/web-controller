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
      <div className="pointer-events-none absolute top-4 left-4 z-10 max-w-sm rounded-xl border border-white/10 bg-black/75 p-4 text-xs text-white backdrop-blur">
        <p className="text-[10px] uppercase tracking-wider text-violet-400/90">
          Story world · your order
        </p>
        <p className="mt-2 text-white/80">
          Left stick fly · Right stick look · R2 sprint · Visit any beacon
        </p>
        {nearby ? (
          <p className="mt-2 font-medium" style={{ color: nearby.color }}>
            Near: {nearby.title} — press × to read
          </p>
        ) : (
          <p className="mt-2 text-white/45">Find a glowing beacon…</p>
        )}
        <p className="mt-3 text-[10px] text-white/40">
          {visited.size}/{STORY_CHAPTERS.length} discovered
        </p>
      </div>
      <Link
        href="/"
        className="absolute top-4 right-4 z-10 rounded border border-white/15 bg-black/60 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
      >
        Hub
      </Link>
    </>
  );
}
