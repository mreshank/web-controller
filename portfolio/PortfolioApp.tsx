"use client";

import { useCallback, useEffect, useState } from "react";
import { ConnectPrompt } from "@/components/ConnectPrompt";
import { Providers } from "@/components/Providers";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";
import { PortfolioHUD } from "@/portfolio/PortfolioHUD";
import { PortfolioPanel } from "@/portfolio/PortfolioPanel";
import { PortfolioWorld } from "@/portfolio/PortfolioWorld";

export function PortfolioApp() {
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());

  const onInteract = useCallback((id: string) => {
    setActiveId(id);
    setVisited((prev) => new Set(prev).add(id));
  }, []);

  const closePanel = useCallback(() => setActiveId(null), []);

  const panelOpen = activeId !== null;
  const active = PORTFOLIO_BEACONS.find((b) => b.id === activeId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  return (
    <Providers>
      <PortfolioWorld
        nearbyId={nearbyId}
        visited={visited}
        panelOpen={panelOpen}
        onNearby={setNearbyId}
        onInteract={onInteract}
      />
      <PortfolioHUD nearbyId={nearbyId} visited={visited} />
      <ConnectPrompt />
      {active ? <PortfolioPanel beacon={active} onClose={closePanel} /> : null}
    </Providers>
  );
}
