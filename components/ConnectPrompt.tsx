"use client";

import { useConnectedGamepadCount } from "@/hooks/useGamepad";

export function ConnectPrompt() {
  const count = useConnectedGamepadCount();
  const visible = count === 0;

  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 transition-opacity duration-300"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900/90 px-8 py-6 text-center shadow-2xl">
        <p className="text-lg font-medium text-white">Plug in a controller</p>
        <p className="mt-2 text-sm text-white/60">
          Then press any button — browsers require user input before exposing the
          Gamepad API.
        </p>
        <p className="mt-3 text-xs text-white/40">
          Two controllers? Connect both, press a button on each — each gets its own
          cube (browser slot 0 and 1).
        </p>
      </div>
    </div>
  );
}
