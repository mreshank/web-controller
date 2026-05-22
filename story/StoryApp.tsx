"use client";

import { useCallback, useEffect, useState } from "react";
import { ConnectPrompt } from "@/components/ConnectPrompt";
import { Providers } from "@/components/Providers";
import { STORY_CHAPTERS } from "@/story/chapters";
import { StoryHUD } from "@/story/StoryHUD";
import { StoryPanel } from "@/story/StoryPanel";
import { StoryWorld } from "@/story/StoryWorld";
export function StoryApp() {
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());

  const onInteract = useCallback((id: string) => {
    setActiveChapterId(id);
    setVisited((prev) => new Set(prev).add(id));
  }, []);

  const closePanel = useCallback(() => setActiveChapterId(null), []);

  const panelOpen = activeChapterId !== null;
  const activeChapter = STORY_CHAPTERS.find((c) => c.id === activeChapterId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  return (
    <Providers>
      <StoryWorld
        nearbyId={nearbyId}
        visited={visited}
        panelOpen={panelOpen}
        onNearby={setNearbyId}
        onInteract={onInteract}
      />
      <StoryHUD nearbyId={nearbyId} visited={visited} />
      <ConnectPrompt />
      {activeChapter ? (
        <StoryPanel chapter={activeChapter} onClose={closePanel} />
      ) : null}
    </Providers>
  );
}
