"use client";

import { ConnectPrompt } from "@/components/ConnectPrompt";
import { DemoScene } from "@/components/DemoScene";
import { GamepadHUD } from "@/components/GamepadHUD";
import { PresenterChrome } from "@/components/PresenterChrome";
import { Providers } from "@/components/Providers";

export function LiveDemo() {
  return (
    <Providers>
      <DemoScene />
      <GamepadHUD />
      <ConnectPrompt />
      <PresenterChrome variant="live" />
    </Providers>
  );
}
