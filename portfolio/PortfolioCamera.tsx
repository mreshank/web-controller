"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useGamepad } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";
import {
  PORTFOLIO_EYE_HEIGHT,
  PORTFOLIO_SPRINT_MULT,
  PORTFOLIO_WALK_SPEED,
  PORTFOLIO_WORLD_HALF,
} from "@/portfolio/config";
import { clampPortfolio, portfolioHeight } from "@/portfolio/terrain";

const UP = new THREE.Vector3(0, 1, 0);
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
const lookAt = new THREE.Vector3();

/** First-person walk — grounded, story-corrected stick signs */
export function PortfolioCamera() {
  const { camera } = useThree();
  const stateRef = useRef<GamepadState | null>(null);
  const yawRef = useRef(Math.PI * 0.15);
  const pitchRef = useRef(0.08);
  const posRef = useRef(new THREE.Vector3(0, PORTFOLIO_EYE_HEIGHT, 8));
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
    const cam = camera;

    let moveX = 0;
    let moveZ = 0;
    let lookX = 0;
    let sprint = 0;

    if (s?.connected) {
      lookX = -s.rightStick.x * 2.4 * dt;
      pitchRef.current = THREE.MathUtils.clamp(
        pitchRef.current - s.rightStick.y * 1.4 * dt,
        -0.35,
        0.42
      );
      moveX = -s.leftStick.x;
      moveZ = -s.leftStick.y;
      sprint = s.triggers.right;
    } else {
      const k = keysRef.current;
      if (k.KeyA) moveX -= 1;
      if (k.KeyD) moveX += 1;
      if (k.KeyW) moveZ -= 1;
      if (k.KeyS) moveZ += 1;
      if (k.ArrowLeft) lookX += 1.8 * dt;
      if (k.ArrowRight) lookX -= 1.8 * dt;
      if (k.ShiftLeft || k.ShiftRight) sprint = 1;
    }

    yawRef.current += lookX;

    const yaw = yawRef.current;
    const pitch = pitchRef.current;
    forward.set(Math.sin(yaw) * Math.cos(pitch), 0, Math.cos(yaw) * Math.cos(pitch)).normalize();
    right.crossVectors(UP, forward).normalize();

    const speed =
      PORTFOLIO_WALK_SPEED * (1 + sprint * (PORTFOLIO_SPRINT_MULT - 1));
    move.set(0, 0, 0);
    if (Math.abs(moveX) > 0.01 || Math.abs(moveZ) > 0.01) {
      move.addScaledVector(forward, moveZ * speed * dt);
      move.addScaledVector(right, moveX * speed * dt);
      posRef.current.add(move);
      const [nx, nz] = clampPortfolio(posRef.current.x, posRef.current.z);
      posRef.current.x = nx;
      posRef.current.z = nz;
      posRef.current.y = portfolioHeight(nx, nz) + PORTFOLIO_EYE_HEIGHT;
    }

    cam.position.copy(posRef.current);
    lookAt.copy(posRef.current);
    lookAt.add(
      new THREE.Vector3(
        Math.sin(yawRef.current) * Math.cos(pitchRef.current),
        Math.sin(pitchRef.current),
        Math.cos(yawRef.current) * Math.cos(pitchRef.current)
      )
    );
    cam.lookAt(lookAt);
  });

  return null;
}
