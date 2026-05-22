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
  CAMERA_DEFAULT_DISTANCE,
} from "@/game/config";
import { getFocusCentroid, playerPositions } from "@/game/player-registry";

type GameCameraProps = {
  controlSlot: number;
};

const targetPos = new THREE.Vector3();
const lookAt = new THREE.Vector3();
const smoothPos = new THREE.Vector3();

export function GameCamera({ controlSlot }: GameCameraProps) {
  const { camera } = useThree();
  const stateRef = useRef<GamepadState | null>(null);
  const initialized = useRef(false);

  useGamepadSlot(controlSlot, (s) => {
    stateRef.current = s;
  });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.033);
    const s = stateRef.current;

    if (s?.connected) {
      cameraRig.yaw -= s.rightStick.x * dt * 2.6;
      cameraRig.pitch = THREE.MathUtils.clamp(
        cameraRig.pitch - s.rightStick.y * dt * 1.6,
        CAMERA_MIN_PITCH,
        CAMERA_MAX_PITCH
      );
      const zoomIn = s.triggers.left * 0.5;
      const zoomOut = s.triggers.right * 0.35;
      cameraRig.distance = THREE.MathUtils.clamp(
        cameraRig.distance + (zoomOut - zoomIn) * dt * 14,
        CAMERA_MIN_DISTANCE,
        CAMERA_MAX_DISTANCE
      );
    }

    cameraRig.yawWorld = cameraRig.yaw;

    const focus = getFocusCentroid();
    lookAt.set(focus.x, focus.y + 1.25, focus.z);

    let spread = 0;
    playerPositions.forEach((p) => {
      spread = Math.max(spread, p.distanceTo(focus));
    });
    const dist = THREE.MathUtils.clamp(
      cameraRig.distance + spread * 0.85,
      CAMERA_MIN_DISTANCE,
      CAMERA_MAX_DISTANCE
    );

    const cp = Math.cos(cameraRig.pitch);
    const sp = Math.sin(cameraRig.pitch);
    const sy = Math.sin(cameraRig.yaw);
    const cy = Math.cos(cameraRig.yaw);

    targetPos.set(
      lookAt.x + sy * cp * dist,
      lookAt.y + sp * dist,
      lookAt.z + cy * cp * dist
    );

    targetPos.y = Math.max(targetPos.y, lookAt.y + 2);

    if (!initialized.current) {
      smoothPos.copy(targetPos);
      initialized.current = true;
    }

    const smooth = 1 - Math.exp(-10 * dt);
    smoothPos.lerp(targetPos, smooth);
    camera.position.copy(smoothPos);
    camera.lookAt(lookAt);
  });

  return null;
}
