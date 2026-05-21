"use client";

import { GamepadProvider } from "@/context/GamepadProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <GamepadProvider>{children}</GamepadProvider>;
}
