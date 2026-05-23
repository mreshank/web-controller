"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import * as THREE from "three";

export type PortfolioPlayerState = {
  position: React.MutableRefObject<THREE.Vector3>;
  yaw: React.MutableRefObject<number>;
  walking: React.MutableRefObject<boolean>;
  /** Reaching toward lantern (panel opening). */
  interacting: React.MutableRefObject<boolean>;
  /** 0 → 1 reach blend, updated in character. */
  interactPhase: React.MutableRefObject<number>;
};

const PortfolioPlayerContext = createContext<PortfolioPlayerState | null>(null);

export function PortfolioPlayerProvider({ children }: { children: ReactNode }) {
  const position = useRef(new THREE.Vector3(0, 0, 6));
  const yaw = useRef(Math.PI * 0.85);
  const walking = useRef(false);
  const interacting = useRef(false);
  const interactPhase = useRef(0);

  return (
    <PortfolioPlayerContext.Provider
      value={{ position, yaw, walking, interacting, interactPhase }}
    >
      {children}
    </PortfolioPlayerContext.Provider>
  );
}

export function usePortfolioPlayer(): PortfolioPlayerState {
  const ctx = useContext(PortfolioPlayerContext);
  if (!ctx) {
    throw new Error("usePortfolioPlayer must be used within PortfolioPlayerProvider");
  }
  return ctx;
}
