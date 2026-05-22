"use client";

import { SceneShell } from "@/components/shared/SceneShell";
import { StorySceneLogic } from "@/story/StorySceneLogic";

type StoryWorldProps = {
  nearbyId: string | null;
  visited: Set<string>;
  panelOpen: boolean;
  onNearby: (chapterId: string | null) => void;
  onInteract: (chapterId: string) => void;
};

export function StoryWorld({ nearbyId, visited, panelOpen, onNearby, onInteract }: StoryWorldProps) {
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
          panelOpen={panelOpen}
          onNearby={onNearby}
          onInteract={onInteract}
        />
      </SceneShell>
    </div>
  );
}
