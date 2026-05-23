"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";
import { PORTFOLIO_PROXIMITY } from "@/portfolio/config";
import { PortfolioBeacon } from "@/portfolio/PortfolioBeacon";
import { PortfolioCharacter } from "@/portfolio/PortfolioCharacter";
import { PortfolioController } from "@/portfolio/PortfolioController";
import { PortfolioEnvironment } from "@/portfolio/PortfolioEnvironment";
import { usePortfolioPlayer } from "@/portfolio/PortfolioPlayerContext";
import { portfolioHeight } from "@/portfolio/terrain";
import {
  edgeCancel,
  edgeConfirm,
  getPrimaryGamepad,
  pollAllGamepadSlots,
} from "@/lib/gamepad";

type Props = {
  nearbyId: string | null;
  visited: Set<string>;
  panelOpen: boolean;
  onNearby: (id: string | null) => void;
  onInteract: (id: string) => void;
  onClosePanel: () => void;
  registerInteract: (fn: (v: boolean) => void) => void;
};

export function PortfolioSceneLogic({
  nearbyId,
  visited,
  panelOpen,
  onNearby,
  onInteract,
  onClosePanel,
  registerInteract,
}: Props) {
  const { position, interacting } = usePortfolioPlayer();
  const lastNearbyRef = useRef<string | null>(null);
  const prevButtonsRef = useRef<boolean[]>([]);
  const onInteractRef = useRef(onInteract);
  const onCloseRef = useRef(onClosePanel);
  const panelOpenRef = useRef(panelOpen);

  useEffect(() => {
    registerInteract((v) => {
      interacting.current = v;
    });
  }, [registerInteract, interacting]);

  useEffect(() => {
    onInteractRef.current = onInteract;
    onCloseRef.current = onClosePanel;
    panelOpenRef.current = panelOpen;
  }, [onInteract, onClosePanel, panelOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Enter" && !panelOpenRef.current) {
        const id = lastNearbyRef.current;
        if (id) onInteractRef.current(id);
      }
      if (e.key === "Escape" && panelOpenRef.current) {
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useFrame(() => {
    const p = position.current;
    let nearest: string | null = null;
    let nearestDist = PORTFOLIO_PROXIMITY;

    for (const b of PORTFOLIO_BEACONS) {
      const bx = b.position[0];
      const bz = b.position[2];
      const by = portfolioHeight(bx, bz) + 1.2;
      const dx = p.x - bx;
      const dy = p.y + 1.4 - by;
      const dz = p.z - bz;
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

    const s = getPrimaryGamepad(pollAllGamepadSlots());
    const prev = prevButtonsRef.current;
    const buttons = s.buttons;

    if (s.connected) {
      if (panelOpenRef.current && edgeCancel(buttons, prev)) {
        onCloseRef.current();
      } else if (!panelOpenRef.current && edgeConfirm(buttons, prev) && nearest) {
        onInteractRef.current(nearest);
      }
      prevButtonsRef.current = buttons.slice();
    } else {
      prevButtonsRef.current = [];
    }
  });

  return (
    <>
      <PortfolioEnvironment />
      <PortfolioCharacter />
      <PortfolioController />
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
