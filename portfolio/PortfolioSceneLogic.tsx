"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";
import { PORTFOLIO_PROXIMITY } from "@/portfolio/config";
import { PortfolioBeacon } from "@/portfolio/PortfolioBeacon";
import { PortfolioCamera } from "@/portfolio/PortfolioCamera";
import { PortfolioEnvironment } from "@/portfolio/PortfolioEnvironment";
import { portfolioHeight } from "@/portfolio/terrain";
import { useGamepad } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";

type Props = {
  nearbyId: string | null;
  visited: Set<string>;
  panelOpen: boolean;
  onNearby: (id: string | null) => void;
  onInteract: (id: string) => void;
};

export function PortfolioSceneLogic({
  nearbyId,
  visited,
  panelOpen,
  onNearby,
  onInteract,
}: Props) {
  const stateRef = useRef<GamepadState | null>(null);
  const lastNearbyRef = useRef<string | null>(null);
  const prevA = useRef(false);

  useGamepad((s) => {
    stateRef.current = s;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Enter" || panelOpen) return;
      const id = lastNearbyRef.current;
      if (id) onInteract(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen, onInteract]);

  useFrame(({ camera }) => {
    let nearest: string | null = null;
    let nearestDist = PORTFOLIO_PROXIMITY;

    for (const b of PORTFOLIO_BEACONS) {
      const bx = b.position[0];
      const bz = b.position[2];
      const by = portfolioHeight(bx, bz) + 1.5;
      const dx = camera.position.x - bx;
      const dy = camera.position.y - by;
      const dz = camera.position.z - bz;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = b.id;
      }
    }

    if (nearest !== lastNearbyRef.current) {
      lastNearbyRef.current = nearest;
      onNearby(nearest);
    }

    const s = stateRef.current;
    const a = Boolean(s?.connected && s.buttons[0]);
    if (!panelOpen && a && !prevA.current && nearest) onInteract(nearest);
    prevA.current = a;
  });

  return (
    <>
      <PortfolioEnvironment />
      <PortfolioCamera />
      {PORTFOLIO_BEACONS.map((b) => (
        <PortfolioBeacon
          key={b.id}
          beacon={b}
          nearby={nearbyId === b.id}
          visited={visited.has(b.id)}
        />
      ))}
    </>
  );
}
