"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { STORY_CHAPTERS } from "@/story/chapters";
import { StoryBeacon } from "@/story/StoryBeacon";
import { StoryCamera } from "@/story/StoryCamera";
import { StoryEnvironment } from "@/story/StoryEnvironment";
import { edgeConfirm, getPrimaryGamepad, pollAllGamepadSlots } from "@/lib/gamepad";

const PROXIMITY = 5.5;

type StorySceneLogicProps = {
  nearbyId: string | null;
  visited: Set<string>;
  panelOpen: boolean;
  onNearby: (chapterId: string | null) => void;
  onInteract: (chapterId: string) => void;
};

export function StorySceneLogic({
  nearbyId,
  visited,
  panelOpen,
  onNearby,
  onInteract,
}: StorySceneLogicProps) {
  const lastNearbyRef = useRef<string | null>(null);
  const prevButtonsRef = useRef<boolean[]>([]);
  const panelOpenRef = useRef(panelOpen);
  const onInteractRef = useRef(onInteract);

  panelOpenRef.current = panelOpen;
  onInteractRef.current = onInteract;

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

    if (nearest !== lastNearbyRef.current) {
      lastNearbyRef.current = nearest;
      onNearby(nearest);
    }

    const s = getPrimaryGamepad(pollAllGamepadSlots());
    const prev = prevButtonsRef.current;
    if (
      s.connected &&
      !panelOpenRef.current &&
      edgeConfirm(s.buttons, prev) &&
      nearest
    ) {
      onInteractRef.current(nearest);
    }
    prevButtonsRef.current = s.connected ? s.buttons.slice() : [];
  });

  return (
    <>
      <StoryEnvironment />
      <StoryCamera />
      {STORY_CHAPTERS.map((ch) => (
        <StoryBeacon
          key={ch.id}
          chapter={ch}
          active={nearbyId === ch.id}
          nearby={nearbyId === ch.id}
          visited={visited.has(ch.id)}
        />
      ))}
    </>
  );
}
