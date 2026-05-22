"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGamepadSlot } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";
import { cameraRig } from "@/game/camera-rig";
import {
  CAMERA_MAX_DISTANCE,
  CAMERA_MAX_PITCH,
  CAMERA_MIN_DISTANCE,
  CAMERA_MIN_PITCH,
} from "@/game/config";
import { getFocusCentroid } from "@/game/player-registry";

type GameCameraProps = {
  /** Controller slot that drives orbit (first connected) */
  controlSlot: number;
};

const targetPos = new THREE.Vector3();
const lookAt = new THREE.Vector3();

export function GameCamera({ controlSlot }: GameCameraProps) {
  const { camera } = useThree();
  const stateRef = useRef<GamepadState | null>(null);

  useGamepadSlot(controlSlot, (s) => {
    stateRef.current = s;
  });

  useFrame((_, delta) => {
    const s = stateRef.current;
    const dt = Math.min(delta, 0.05);

    if (s?.connected) {
      cameraRig.yaw -= s.rightStick.x * dt * 2.4;
      cameraRig.pitch = THREE.MathUtils.clamp(
        cameraRig.pitch + s.rightStick.y * dt * 1.35,
        CAMERA_MIN_PITCH,
        CAMERA_MAX_PITCH
      );
      const zoom = 1 - s.triggers.left * 0.35 + s.triggers.right * 0.45;
      cameraRig.distance = THREE.MathUtils.clamp(
        cameraRig.distance + (zoom - 1) * dt * 8,
        CAMERA_MIN_DISTANCE,
        CAMERA_MAX_DISTANCE
      );
    }

    cameraRig.yawWorld = cameraRig.yaw;

    const focus = getFocusCentroid();
    lookAt.set(focus.x, focus.y + 1.35, focus.z);

    const cp = Math.cos(cameraRig.pitch);
    const sp = Math.sin(cameraRig.pitch);
    const sy = Math.sin(cameraRig.yaw);
    const cy = Math.cos(cameraRig.yaw);

    targetPos.set(
      lookAt.x + sy * cp * cameraRig.distance,
      lookAt.y + sp * cameraRig.distance,
      lookAt.z + cy * cp * cameraRig.distance
    );

    camera.position.lerp(targetPos, 1 - Math.pow(0.001, dt));
    camera.lookAt(lookAt);
  });

  return null;
}
