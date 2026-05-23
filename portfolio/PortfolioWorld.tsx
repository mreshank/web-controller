"use client";

import { SceneShell } from "@/components/shared/SceneShell";
import { PortfolioPlayerProvider } from "@/portfolio/PortfolioPlayerContext";
import { PortfolioSceneLogic } from "@/portfolio/PortfolioSceneLogic";

type Props = {
  nearbyId: string | null;
  visited: Set<string>;
  panelOpen: boolean;
  onNearby: (id: string | null) => void;
  onInteract: (id: string) => void;
  onClosePanel: () => void;
  registerInteract: (fn: (v: boolean) => void) => void;
};

export function PortfolioWorld({
  registerInteract,
  ...props
}: Props) {
  return (
    <div className="gp-canvas-wrap">
      <SceneShell
        camera={{ position: [0, 4, 12], fov: 55 }}
        showGrid={false}
        showStars={false}
        dpr={[1, 1.5]}
      >
        <PortfolioPlayerProvider>
          <PortfolioSceneLogic registerInteract={registerInteract} {...props} />
        </PortfolioPlayerProvider>
      </SceneShell>
    </div>
  );
}
