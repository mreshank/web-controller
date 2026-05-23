"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGamepad } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";
import {
  PORTFOLIO_CAM_DISTANCE,
  PORTFOLIO_CAM_HEIGHT,
  PORTFOLIO_CAM_LOOK_AT,
  PORTFOLIO_CAM_SMOOTH,
  PORTFOLIO_CHARACTER_HEIGHT,
  PORTFOLIO_SPRINT_MULT,
  PORTFOLIO_WALK_SPEED,
} from "@/portfolio/config";
import { usePortfolioPlayer } from "@/portfolio/PortfolioPlayerContext";
import { clampPortfolio, portfolioHeight } from "@/portfolio/terrain";

const UP = new THREE.Vector3(0, 1, 0);
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

/** Third-person follow — villager is the avatar; right stick orbits camera. */
export function PortfolioController() {
  const { camera } = useThree();
  const { position, yaw, walking } = usePortfolioPlayer();
  const stateRef = useRef<GamepadState | null>(null);
  const camYawRef = useRef(yaw.current);
  const camPitchRef = useRef(0.22);
  const keysRef = useRef<Record<string, boolean>>({});

  useGamepad((s) => {
    stateRef.current = s;
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const s = stateRef.current;
    const dt = Math.min(delta, 0.033);
    const pos = position.current;

    let moveX = 0;
    let moveZ = 0;
    let lookX = 0;
    let lookPitch = 0;
    let sprint = 0;

    if (s?.connected) {
      lookX = -s.rightStick.x * 2.2 * dt;
      lookPitch = -s.rightStick.y * 1.1 * dt;
      moveX = -s.leftStick.x;
      moveZ = -s.leftStick.y;
      sprint = s.triggers.right;
    } else {
      const k = keysRef.current;
      if (k.KeyA) moveX -= 1;
      if (k.KeyD) moveX += 1;
      if (k.KeyW) moveZ -= 1;
      if (k.KeyS) moveZ += 1;
      if (k.ArrowLeft) lookX += 1.6 * dt;
      if (k.ArrowRight) lookX -= 1.6 * dt;
      if (k.ArrowUp) lookPitch += 1.2 * dt;
      if (k.ArrowDown) lookPitch -= 1.2 * dt;
      if (k.ShiftLeft || k.ShiftRight) sprint = 1;
    }

    camYawRef.current += lookX;
    camPitchRef.current = THREE.MathUtils.clamp(
      camPitchRef.current + lookPitch,
      0.12,
      0.55
    );

    const facingYaw = camYawRef.current;
    forward.set(Math.sin(facingYaw), 0, Math.cos(facingYaw)).normalize();
    right.crossVectors(UP, forward).normalize();

    const speed =
      PORTFOLIO_WALK_SPEED * (1 + sprint * (PORTFOLIO_SPRINT_MULT - 1));
    move.set(0, 0, 0);
    const moving = Math.abs(moveX) > 0.08 || Math.abs(moveZ) > 0.08;
    walking.current = moving;

    if (moving) {
      move.addScaledVector(forward, moveZ * speed * dt);
      move.addScaledVector(right, moveX * speed * dt);
      pos.add(move);
      const [nx, nz] = clampPortfolio(pos.x, pos.z);
      pos.x = nx;
      pos.z = nz;
      const targetYaw = Math.atan2(move.x, move.z);
      yaw.current = THREE.MathUtils.lerp(yaw.current, targetYaw, 0.18);
    }

    const groundY = portfolioHeight(pos.x, pos.z);
    pos.y = groundY;

    const cy = Math.cos(camPitchRef.current);
    const sy = Math.sin(camPitchRef.current);
    const ox = -Math.sin(camYawRef.current) * PORTFOLIO_CAM_DISTANCE * cy;
    const oz = -Math.cos(camYawRef.current) * PORTFOLIO_CAM_DISTANCE * cy;
    const oy = PORTFOLIO_CAM_HEIGHT + sy * PORTFOLIO_CAM_DISTANCE * 0.35;

    camTarget.set(pos.x + ox, groundY + oy, pos.z + oz);
    lookTarget.set(pos.x, groundY + PORTFOLIO_CAM_LOOK_AT, pos.z);

    camera.position.lerp(camTarget, PORTFOLIO_CAM_SMOOTH);
    camera.lookAt(lookTarget);
  });

  return null;
}
