"use client";

import { useConnectedGamepadCount } from "@/hooks/useGamepad";

type ConnectPromptProps = {
  title?: string;
  body?: string;
  hint?: string;
};

export function ConnectPrompt({
  title = "Connect a controller",
  body = "Plug in via USB or Bluetooth, then press any button. Browsers require user input before exposing the Gamepad API.",
  hint = "Two controllers? Press a button on each — every slot gets its own entity in multiplayer modes.",
}: ConnectPromptProps = {}) {
  const count = useConnectedGamepadCount();
  const visible = count === 0;

  return (
    <div
      className={`gp-connect${visible ? "" : " is-hidden"}`}
      aria-hidden={!visible}
    >
      <div className="gp-connect__panel">
        <p className="gp-connect__title">{title}</p>
        <p className="gp-connect__text">{body}</p>
        <p className="gp-connect__hint">{hint}</p>
      </div>
    </div>
  );
}
