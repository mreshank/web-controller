"use client";

import { useRef } from "react";
import { useGamepad } from "@/hooks/useGamepad";

const CLOSE_BUTTON = 1;

export function usePortfolioPanelGamepad(panelOpen: boolean, onClose: () => void) {
  const prevCloseRef = useRef(false);

  useGamepad((s) => {
    if (!panelOpen || !s.connected) {
      prevCloseRef.current = false;
      return;
    }
    const pressed = Boolean(s.buttons[CLOSE_BUTTON]);
    if (pressed && !prevCloseRef.current) onClose();
    prevCloseRef.current = pressed;
  });
}
