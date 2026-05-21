import { useEffect, useRef } from "react";

export type GamepadState = {
  leftStick: { x: number; y: number };
  rightStick: { x: number; y: number };
  buttons: boolean[];
  triggers: { left: number; right: number };
  connected: boolean;
  id: string;
};

const EMPTY_STATE: GamepadState = {
  leftStick: { x: 0, y: 0 },
  rightStick: { x: 0, y: 0 },
  buttons: [],
  triggers: { left: 0, right: 0 },
  connected: false,
  id: "",
};

export function useGamepad(onUpdate: (state: GamepadState) => void) {
  const rafRef = useRef<number | null>(null);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  useEffect(() => {
    const DEADZONE = 0.1;
    const apply = (v: number) => (Math.abs(v) < DEADZONE ? 0 : v);

    const poll = () => {
      const pads = navigator.getGamepads();
      const gp = Array.from(pads).find((p) => p && p.connected);

      if (gp) {
        onUpdateRef.current({
          leftStick: { x: apply(gp.axes[0] ?? 0), y: apply(gp.axes[1] ?? 0) },
          rightStick: { x: apply(gp.axes[2] ?? 0), y: apply(gp.axes[3] ?? 0) },
          buttons: gp.buttons.map((b) => b.pressed),
          triggers: {
            left: gp.buttons[6]?.value ?? 0,
            right: gp.buttons[7]?.value ?? 0,
          },
          connected: true,
          id: gp.id,
        });
      } else {
        onUpdateRef.current(EMPTY_STATE);
      }

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
    };
  }, []);
}
