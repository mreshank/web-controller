"use client";

import { useConnectedGamepadCount } from "@/hooks/useGamepad";

export function ConnectPrompt() {
  const count = useConnectedGamepadCount();
  const visible = count === 0;

  return (
    <div
      className={`gp-connect${visible ? "" : " is-hidden"}`}
      aria-hidden={!visible}
    >
      <div className="gp-connect__panel">
        <p className="gp-connect__title">Connect a controller</p>
        <p className="gp-connect__text">
          Plug in via USB or Bluetooth, then press any button. Browsers require
          user input before exposing the Gamepad API.
        </p>
        <p className="gp-connect__hint">
          Two controllers? Press a button on each — every slot gets its own
          entity in multiplayer modes.
        </p>
      </div>
    </div>
  );
}
