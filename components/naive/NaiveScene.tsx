"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { SceneShell } from "@/components/shared/SceneShell";
import { NaiveConnectPrompt } from "@/components/naive/NaiveConnectPrompt";
import { NaiveCube } from "@/components/naive/NaiveCube";
import { NaiveHUD } from "@/components/naive/NaiveHUD";
import { PresenterChrome } from "@/components/PresenterChrome";

export function NaiveScene() {
  return (
    <div className="gp-canvas-wrap">
      <SceneShell camera={{ position: [0, 4, 7], fov: 50 }}>
        <NaiveCube />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={12} blur={2} />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={14}
          maxPolarAngle={Math.PI / 2.1}
        />
      </SceneShell>
      <NaiveHUD />
      <NaiveConnectPrompt />
      <PresenterChrome variant="naive" />
      <p className="gp-legend gp-legend--left">
        Anti-pattern: two poll loops — compare with production demo
      </p>
    </div>
  );
}
