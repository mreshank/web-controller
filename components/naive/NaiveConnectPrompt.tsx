"use client";

import { useEffect, useState } from "react";

export function NaiveConnectPrompt() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    window.addEventListener("gamepadconnected", hide);
    return () => window.removeEventListener("gamepadconnected", hide);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60">
      <div className="max-w-md rounded-2xl border border-amber-500/20 bg-slate-900/90 px-8 py-6 text-center">
        <p className="text-lg font-medium text-white">Plug in a controller</p>
        <p className="mt-2 text-sm text-white/60">Press any button to activate</p>
      </div>
    </div>
  );
}
