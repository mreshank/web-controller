"use client";

import { SceneShell } from "@/components/shared/SceneShell";
import { PortfolioSceneLogic } from "@/portfolio/PortfolioSceneLogic";

type Props = {
  nearbyId: string | null;
  visited: Set<string>;
  panelOpen: boolean;
  onNearby: (id: string | null) => void;
  onInteract: (id: string) => void;
};

export function PortfolioWorld(props: Props) {
  return (
    <div className="gp-canvas-wrap">
      <SceneShell
        camera={{ position: [0, 1.72, 8], fov: 60 }}
        showGrid={false}
        showStars={false}
        dpr={[1, 1.5]}
      >
        <PortfolioSceneLogic {...props} />
      </SceneShell>
    </div>
  );
}
