"use client";

import { ConnectPrompt } from "@/components/ConnectPrompt";
import { Providers } from "@/components/Providers";
import { GameArena } from "@/game/GameArena";
import { GameHUD } from "@/game/GameHUD";

export function GameApp() {
  return (
    <Providers>
      <GameArena />
      <GameHUD />
      <ConnectPrompt />
    </Providers>
  );
}
