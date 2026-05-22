"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGamepadSlot } from "@/hooks/useGamepad";
import type { PlayPlayerState } from "@/lib/play/simulation";
import { playCameraYaw } from "@/play/play-camera-yaw";

type PlayCameraProps = {
  controlSlot: number;
  players: PlayPlayerState[];
  localUid: string;
};

export function PlayCamera({ controlSlot, players, localUid }: PlayCameraProps) {
  const { camera } = useThree();
  const yawRef = useRef(0);
  const pitchRef = useRef(0.55);
  const distRef = useRef(14);

  useGamepadSlot(controlSlot, (s) => {
    if (!s.connected) return;
    yawRef.current -= (s.rightStick.x ?? 0) * 0.04;
    pitchRef.current = THREE.MathUtils.clamp(
      pitchRef.current + (s.rightStick.y ?? 0) * 0.03,
      0.3,
      1.05
    );
    distRef.current = THREE.MathUtils.clamp(
      distRef.current - (s.triggers.left ?? 0) * 0.35 + (s.triggers.right ?? 0) * 0.2,
      9,
      24
    );
  });

  useFrame((_, delta) => {
    const local = players.find((p) => p.uid === localUid);
    const focus = local ?? players[0];
    if (!focus) return;

    const cx = players.reduce((s, p) => s + p.x, 0) / Math.max(1, players.length);
    const cz = players.reduce((s, p) => s + p.z, 0) / Math.max(1, players.length);
    const cy = focus.y + 1.2;

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const d = distRef.current;
    const tx = cx + Math.sin(yaw) * Math.cos(pitch) * d;
    const ty = cy + Math.sin(pitch) * d;
    const tz = cz + Math.cos(yaw) * Math.cos(pitch) * d;

    const target = new THREE.Vector3(cx, cy, cz);
    camera.position.lerp(new THREE.Vector3(tx, ty, tz), 1 - Math.exp(-5 * delta));
    camera.lookAt(target);
    playCameraYaw.value = yawRef.current;
  });

  return null;
}
