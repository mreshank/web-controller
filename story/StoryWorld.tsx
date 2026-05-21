"use client";

import { Float, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { SceneShell } from "@/components/shared/SceneShell";
import { STORY_CHAPTERS } from "@/story/chapters";
import { StoryBeacon } from "@/story/StoryBeacon";
import { StoryCamera } from "@/story/StoryCamera";
import { useGamepad } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";

const PROXIMITY = 3.5;

export function StoryWorld({
  onNearby,
  onInteract,
}: {
  onNearby: (chapterId: string | null) => void;
  onInteract: (chapterId: string) => void;
}) {
  const stateRef = useRef<GamepadState | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const prevButtonRef = useRef(false);

  useGamepad((s) => {
    stateRef.current = s;
  });

  useFrame(({ camera }) => {
    let nearest: string | null = null;
    let nearestDist = PROXIMITY;

    for (const ch of STORY_CHAPTERS) {
      const dx = camera.position.x - ch.position[0];
      const dy = camera.position.y - ch.position[1];
      const dz = camera.position.z - ch.position[2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = ch.id;
      }
    }

    if (nearest !== activeIdRef.current) {
      activeIdRef.current = nearest;
      onNearby(nearest);
    }

    const s = stateRef.current;
    const pressed = Boolean(s?.connected && s.buttons[0]);
    if (pressed && !prevButtonRef.current && nearest) {
      onInteract(nearest);
    }
    prevButtonRef.current = pressed;
  });

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <SceneShell
        camera={{ position: [0, 3, 18], fov: 60 }}
        showStars
        showGrid={false}
      >
        <StoryCamera />
        {STORY_CHAPTERS.map((ch) => (
          <StoryBeacon
            key={ch.id}
            chapter={ch}
            active={activeIdRef.current === ch.id}
            nearby={activeIdRef.current === ch.id}
          />
        ))}
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.4}>
          <mesh position={[0, 8, 0]}>
            <octahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial
              color="#818cf8"
              emissive="#6366f1"
              emissiveIntensity={0.8}
              wireframe
            />
          </mesh>
        </Float>
        <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} />
      </SceneShell>
    </div>
  );
}
