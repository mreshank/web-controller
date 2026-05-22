"use client";

import { SceneShell } from "@/components/shared/SceneShell";
import { StorySceneLogic } from "@/story/StorySceneLogic";

type StoryWorldProps = {
  nearbyId: string | null;
  onNearby: (chapterId: string | null) => void;
  onInteract: (chapterId: string) => void;
};

export function StoryWorld({ nearbyId, onNearby, onInteract }: StoryWorldProps) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <SceneShell
        camera={{ position: [0, 3, 18], fov: 60 }}
        showStars
        showGrid={false}
      >
        <StorySceneLogic
          nearbyId={nearbyId}
          onNearby={onNearby}
          onInteract={onInteract}
        />
      </SceneShell>
    </div>
  );
}
