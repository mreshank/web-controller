"use client";

import { useCallback, useMemo } from "react";
import { ConnectPrompt } from "@/components/ConnectPrompt";
import { Providers } from "@/components/Providers";
import { usePlaySocket } from "@/hooks/usePlaySocket";
import { getOrCreatePlayIdentity } from "@/lib/play/identity";
import type { ClientMessage } from "@/lib/play/protocol";
import { pollAllGamepadSlots } from "@/lib/gamepad";
import { playCameraYaw } from "@/play/play-camera-yaw";
import { PlayArena } from "@/play/PlayArena";
import { PlayHUD } from "@/play/PlayHUD";

export function PlayApp() {
  const identity = useMemo(() => getOrCreatePlayIdentity(), []);

  const sendInput = useCallback((): ClientMessage | null => {
    const slots = pollAllGamepadSlots();
    const s = slots.find((x) => x.connected) ?? slots[0]!;
    if (!s?.connected) return null;
    return {
      type: "input",
      ax: s.leftStick.x,
      ay: s.leftStick.y,
      rt: s.triggers.right,
      dash: Boolean(s.buttons[0]),
      camYaw: playCameraYaw.value,
    };
  }, []);

  const { hud } = usePlaySocket(sendInput);
  const meta = hud.roomMeta;

  return (
    <Providers>
      {meta ? (
        <PlayArena
          key={meta.roomId}
          roomId={meta.roomId}
          seed={meta.seed}
          localUid={identity.uid}
        />
      ) : (
        <div className="gp-play-backdrop" aria-hidden>
          <div className="gp-play-backdrop__grid" />
        </div>
      )}
      <PlayHUD identity={identity} hud={hud} />
      <ConnectPrompt
        title="Connect a controller"
        body="Nexus Breach is built for gamepads. Press any button on your controller after connecting."
      />
    </Providers>
  );
}
