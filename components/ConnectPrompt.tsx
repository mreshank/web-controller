"use client";

import { useRef } from "react";
import { useGamepad } from "@/hooks/useGamepad";

export function ConnectPrompt() {
  const promptRef = useRef<HTMLDivElement>(null);

  useGamepad((state) => {
    if (promptRef.current) {
      promptRef.current.style.opacity = state.connected ? "0" : "1";
      promptRef.current.style.pointerEvents = state.connected ? "none" : "auto";
    }
  });

  return (
    <div
      ref={promptRef}
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 transition-opacity duration-300"
    >
      <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900/90 px-8 py-6 text-center shadow-2xl">
        <p className="text-lg font-medium text-white">Plug in a controller</p>
        <p className="mt-2 text-sm text-white/60">
          Then press any button — browsers require user input before exposing the
          Gamepad API.
        </p>
      </div>
    </div>
  );
}
