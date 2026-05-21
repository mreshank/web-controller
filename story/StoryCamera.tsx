"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGamepad } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";

const BOUNDS = 28;

export function StoryCamera() {
  const stateRef = useRef<GamepadState | null>(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const { camera } = useThree();

  useGamepad((s) => {
    stateRef.current = s;
  });

  useFrame((_, delta) => {
    const s = stateRef.current;
    if (!s?.connected) return;

    yawRef.current -= s.rightStick.x * 1.8 * delta;
    pitchRef.current = Math.max(
      -1.2,
      Math.min(1.2, pitchRef.current + s.rightStick.y * 1.2 * delta)
    );

    const speed = 10 + s.triggers.right * 12;
    const yaw = yawRef.current;
    const forward = new THREE.Vector3(
      Math.sin(yaw),
      0,
      Math.cos(yaw)
    );
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    const move = new THREE.Vector3()
      .addScaledVector(forward, -s.leftStick.y * speed * delta)
      .addScaledVector(right, s.leftStick.x * speed * delta);

    camera.position.add(move);
    camera.position.y = Math.max(
      1.2,
      Math.min(12, camera.position.y - s.triggers.left * 0.8 * delta + s.triggers.right * 0.5 * delta)
    );
    camera.position.x = Math.max(-BOUNDS, Math.min(BOUNDS, camera.position.x));
    camera.position.z = Math.max(-BOUNDS, Math.min(BOUNDS, camera.position.z));

    const lookAt = camera.position.clone().add(
      new THREE.Vector3(
        Math.sin(yaw) * Math.cos(pitchRef.current),
        Math.sin(pitchRef.current),
        Math.cos(yaw) * Math.cos(pitchRef.current)
      )
    );
    camera.lookAt(lookAt);
  });

  return null;
}
