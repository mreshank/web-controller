"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConnectPrompt } from "@/components/ConnectPrompt";
import { Providers } from "@/components/Providers";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";
import {
  playLanternClose,
  playLanternOpen,
  resumePortfolioAudio,
} from "@/portfolio/portfolio-sounds";
import { PortfolioHUD } from "@/portfolio/PortfolioHUD";
import { PortfolioPanel } from "@/portfolio/PortfolioPanel";
import { PortfolioWorld } from "@/portfolio/PortfolioWorld";

export function PortfolioApp() {
  const [nearbyId, setNearbyId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const interactRef = useRef<((v: boolean) => void) | null>(null);
  const pendingOpenRef = useRef<string | null>(null);

  const registerInteract = useCallback((fn: (v: boolean) => void) => {
    interactRef.current = fn;
  }, []);

  const onInteract = useCallback((id: string) => {
    resumePortfolioAudio();
    playLanternOpen();
    interactRef.current?.(true);
    pendingOpenRef.current = id;
    window.setTimeout(() => {
      if (pendingOpenRef.current === id) {
        setActiveId(id);
        setVisited((prev) => new Set(prev).add(id));
      }
    }, 420);
  }, []);

  const closePanel = useCallback(() => {
    pendingOpenRef.current = null;
    playLanternClose();
    interactRef.current?.(false);
    setActiveId(null);
  }, []);

  const panelOpen = activeId !== null;
  const active = PORTFOLIO_BEACONS.find((b) => b.id === activeId);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    const wake = () => resumePortfolioAudio();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", wake, { once: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", wake);
    };
  }, [closePanel]);

  return (
    <Providers>
      <PortfolioWorld
        nearbyId={nearbyId}
        visited={visited}
        panelOpen={panelOpen}
        onNearby={setNearbyId}
        onInteract={onInteract}
        onClosePanel={closePanel}
        registerInteract={registerInteract}
      />
      <PortfolioHUD nearbyId={nearbyId} visited={visited} />
      <ConnectPrompt
        title="Connect your controller"
        body="Plug in via USB or Bluetooth, then press any button. Walk the cobblestone road and press × at a lantern."
      />
      {active ? (
        <PortfolioPanel beacon={active} visited={visited} onClose={closePanel} />
      ) : null}
    </Providers>
  );
}
