import { useEffect, useRef } from "react";

export type GamepadState = {
  leftStick: { x: number; y: number };
  rightStick: { x: number; y: number };
  buttons: boolean[];
  connected: boolean;
};

export function useGamepad(onUpdate: (state: GamepadState) => void) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const DEADZONE = 0.1;
    const apply = (v: number) => (Math.abs(v) < DEADZONE ? 0 : v);

    const poll = () => {
  const pads = navigator.getGamepads();
  // find the first non-null, connected gamepad — index isn't guaranteed
  const gp = Array.from(pads).find((p) => p && p.connected);

  if (gp) {
    onUpdate({
      leftStick: { x: apply(gp.axes[0] ?? 0), y: apply(gp.axes[1] ?? 0) },
      rightStick: { x: apply(gp.axes[2] ?? 0), y: apply(gp.axes[3] ?? 0) },
      buttons: gp.buttons.map((b) => b.pressed),
      connected: true,
    });
  }
  rafRef.current = requestAnimationFrame(poll);
};

    const onConnect = () => {
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(poll);
    };

    window.addEventListener("gamepadconnected", onConnect);
    // start polling immediately too, in case controller is already connected
    rafRef.current = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener("gamepadconnected", onConnect);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [onUpdate]);
}