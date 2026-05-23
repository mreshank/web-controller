"use client";

import { useRef } from "react";
import { useGamepad } from "@/hooks/useGamepad";
import { edgeCancel, edgeConfirm } from "@/lib/gamepad";

export function useStoryPanelGamepad(panelOpen: boolean, onClose: () => void) {
  const prevButtonsRef = useRef<boolean[]>([]);
  const armedRef = useRef(false);

  useGamepad((s) => {
    if (!panelOpen || !s.connected) {
      prevButtonsRef.current = [];
      armedRef.current = false;
      return;
    }

    if (!armedRef.current) {
      armedRef.current = true;
      prevButtonsRef.current = s.buttons.slice();
      return;
    }

    const prev = prevButtonsRef.current;
    if (edgeCancel(s.buttons, prev) || edgeConfirm(s.buttons, prev)) {
      onClose();
    }
    prevButtonsRef.current = s.buttons.slice();
  });
}
