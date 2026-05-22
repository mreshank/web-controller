"use client";

import { useRef } from "react";
import { useGamepad } from "@/hooks/useGamepad";

/** Standard mapping: buttons[1] = Circle (PS) / B (Xbox) — "O" close */
const CLOSE_BUTTON_INDEX = 1;

export function useStoryPanelGamepad(panelOpen: boolean, onClose: () => void) {
  const prevCloseRef = useRef(false);

  useGamepad((s) => {
    if (!panelOpen || !s.connected) {
      prevCloseRef.current = false;
      return;
    }
    const pressed = Boolean(s.buttons[CLOSE_BUTTON_INDEX]);
    if (pressed && !prevCloseRef.current) onClose();
    prevCloseRef.current = pressed;
  });
}
