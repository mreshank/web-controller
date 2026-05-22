"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGamepad } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";

const BOUNDS = 32;
const UP = new THREE.Vector3(0, 1, 0);
const lookDir = new THREE.Vector3();
const rightDir = new THREE.Vector3();
const move = new THREE.Vector3();
const lookAt = new THREE.Vector3();

export function StoryCamera() {
  const stateRef = useRef<GamepadState | null>(null);
  const yawRef = useRef(0);
  const pitchRef = useRef(0.12);
  const { camera } = useThree();

  useGamepad((s) => {
    stateRef.current = s;
  });

  useFrame((_, delta) => {
    const s = stateRef.current;
    if (!s?.connected) return;

    const dt = Math.min(delta, 0.05);

    // Right stick horizontal (inverted for standard gamepad X axis)
    yawRef.current -= s.rightStick.x * 2.2 * dt;
    pitchRef.current = THREE.MathUtils.clamp(
      pitchRef.current - s.rightStick.y * 1.8 * dt,
      -1.05,
      1.05
    );

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    lookDir.set(
      Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      Math.cos(yaw) * Math.cos(pitch)
    ).normalize();
    // UP × look = true screen-right (lookDir × UP was mirrored)
    rightDir.crossVectors(UP, lookDir).normalize();

    const speed = 14 + s.triggers.right * 14;
    move.set(0, 0, 0);

    // Left stick: fly along view (stick up = forward into the scene)
    move.addScaledVector(lookDir, -s.leftStick.y * speed * dt);
    move.addScaledVector(rightDir, -s.leftStick.x * speed * dt);

    // Triggers: rise / dive along world up for fine altitude
    move.y += (s.triggers.right - s.triggers.left) * speed * 0.45 * dt;

    camera.position.add(move);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -BOUNDS, BOUNDS);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, 1.5, 16);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -BOUNDS, BOUNDS);

    lookAt.copy(camera.position).add(lookDir);
    camera.lookAt(lookAt);
  });

  return null;
}
