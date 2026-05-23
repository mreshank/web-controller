"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGamepadSlot } from "@/hooks/useGamepad";
import { playCameraYaw } from "@/play/play-camera-yaw";
import { playRoomRef } from "@/play/play-room-store";

type PlayCameraProps = {
  controlSlot: number;
  localUid: string;
};

export function PlayCamera({ controlSlot, localUid }: PlayCameraProps) {
  const { camera } = useThree();
  const yawRef = useRef(0);
  const pitchRef = useRef(0.55);
  const distRef = useRef(14);
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

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
      22
    );
  });

  useFrame((_, delta) => {
    const room = playRoomRef.current;
    const players = room?.players ?? [];
    const local = players.find((p) => p.uid === localUid);
    const focus = local ?? players[0];
    if (!focus) return;

    let cx = 0;
    let cz = 0;
    for (const p of players) {
      cx += p.x;
      cz += p.z;
    }
    cx /= players.length;
    cz /= players.length;
    const cy = focus.y + 1.1;

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    const d = distRef.current;
    targetPos.current.set(
      cx + Math.sin(yaw) * Math.cos(pitch) * d,
      cy + Math.sin(pitch) * d,
      cz + Math.cos(yaw) * Math.cos(pitch) * d
    );
    targetLook.current.set(cx, cy, cz);

    const k = 1 - Math.exp(-5 * delta);
    camera.position.lerp(targetPos.current, k);
    camera.lookAt(targetLook.current);
    playCameraYaw.value = yawRef.current;
  });

  return null;
}
