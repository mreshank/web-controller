import { ConnectPrompt } from "@/components/ConnectPrompt";
import { DemoScene } from "@/components/DemoScene";
import { GamepadHUD } from "@/components/GamepadHUD";
import { PresenterChrome } from "@/components/PresenterChrome";

export default function Page() {
  return (
    <>
      <DemoScene />
      <GamepadHUD />
      <ConnectPrompt />
      <PresenterChrome />
    </>
  );
}
