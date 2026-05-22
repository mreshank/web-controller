"use client";

import { SceneShell } from "@/components/shared/SceneShell";
import { StorySceneLogic } from "@/story/StorySceneLogic";

type StoryWorldProps = {
  nearbyId: string | null;
  visited: Set<string>;
  onNearby: (chapterId: string | null) => void;
  onInteract: (chapterId: string) => void;
};

export function StoryWorld({ nearbyId, visited, onNearby, onInteract }: StoryWorldProps) {
  return (
    <div className="gp-canvas-wrap">
      <SceneShell
        camera={{ position: [0, 4, 14], fov: 58 }}
        showGrid={false}
        showStars={false}
      >
        <StorySceneLogic
          nearbyId={nearbyId}
          visited={visited}
          onNearby={onNearby}
          onInteract={onInteract}
        />
      </SceneShell>
    </div>
  );
}
