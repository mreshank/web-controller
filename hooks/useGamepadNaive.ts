import { useEffect, useRef } from "react";
import {
  getPrimaryGamepad,
  pollAllGamepadSlots,
  type GamepadState,
} from "@/lib/gamepad";

let naivePollLoopCount = 0;

export function getNaivePollLoopCount() {
  return naivePollLoopCount;
}

function emitNaiveLoopChange() {
  window.dispatchEvent(new CustomEvent("naive-loop-change"));
}

/**
 * Anti-pattern for the talk: each caller spins its own requestAnimationFrame loop.
 * Use on /naive only — compare with GamepadProvider on the main demo.
 */
export function useGamepadNaive(onUpdate: (state: GamepadState) => void) {
  const rafRef = useRef<number | null>(null);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  useEffect(() => {
    naivePollLoopCount += 1;
    emitNaiveLoopChange();

    const poll = () => {
      onUpdateRef.current(getPrimaryGamepad(pollAllGamepadSlots()));
      rafRef.current = requestAnimationFrame(poll);
    };

    const onConnect = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(poll);
    };

    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onConnect);
    rafRef.current = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener("gamepadconnected", onConnect);
      window.removeEventListener("gamepaddisconnected", onConnect);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      naivePollLoopCount -= 1;
      emitNaiveLoopChange();
    };
  }, []);
}
