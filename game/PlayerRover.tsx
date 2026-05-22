"use client";

import { Sparkles, Trail } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useGamepadSlot } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";
import { cameraRig } from "@/game/camera-rig";
import { DASH_COOLDOWN_MS, DASH_IMPULSE } from "@/game/config";
import { tryCollectOrb } from "@/game/orbs";
import { setPlayerPosition } from "@/game/player-registry";
import { addBoostPadScore, gameState, orbScoreForId } from "@/game/state";
import { clampToWorld, terrainHeight } from "@/game/terrain";
import { boostPads } from "@/game/world-layout";

type PlayerRoverProps = {
  slotIndex: number;
  color: string;
  spawn: [number, number, number];
};

export function PlayerRover({ slotIndex, color, spawn }: PlayerRoverProps) {
  const groupRef = useRef<Group>(null);
  const bodyMatRef = useRef<MeshStandardMaterial>(null);
  const stateRef = useRef<GamepadState | null>(null);
  const facingRef = useRef(Math.PI);
  const dashVelRef = useRef({ x: 0, z: 0 });
  const boostRef = useRef(1);
  const lastDashRef = useRef(0);
  const padCooldownRef = useRef<Record<number, number>>({});

  const sx = spawn[0];
  const sz = spawn[2];
  const sy = terrainHeight(sx, sz) + 0.55;

  useGamepadSlot(slotIndex, (s) => {
    stateRef.current = s;
  });

  useEffect(() => {
    setPlayerPosition(slotIndex, sx, sy, sz);
  }, [slotIndex, sx, sy, sz]);

  useFrame((_, delta) => {
    if (!groupRef.current || !stateRef.current?.connected) return;

    const s = stateRef.current;
    const dt = Math.min(delta, 0.05);
    const g = groupRef.current;

    const baseSpeed = 11 + s.triggers.right * 16;
    const speed = baseSpeed * boostRef.current;
    const yaw = cameraRig.yawWorld;
    const ax = s.leftStick.x;
    const ay = s.leftStick.y;

    let mx =
      (Math.sin(yaw) * ay + Math.cos(yaw) * ax) * speed * dt + dashVelRef.current.x * dt;
    let mz =
      (Math.cos(yaw) * ay - Math.sin(yaw) * ax) * speed * dt + dashVelRef.current.z * dt;

    if (Math.abs(mx) > 0.001 || Math.abs(mz) > 0.001) {
      facingRef.current = Math.atan2(mx, mz);
    }

    const [nx, nz] = clampToWorld(g.position.x + mx, g.position.z + mz);
    g.position.x = nx;
    g.position.z = nz;
    g.position.y = terrainHeight(nx, nz) + 0.55;

    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, facingRef.current, 1 - Math.pow(0.02, dt));

    dashVelRef.current.x *= Math.pow(0.02, dt);
    dashVelRef.current.z *= Math.pow(0.02, dt);

    const now = performance.now();
    if (s.buttons[0] && now - lastDashRef.current > DASH_COOLDOWN_MS) {
      lastDashRef.current = now;
      const f = facingRef.current;
      dashVelRef.current.x = Math.sin(f) * DASH_IMPULSE;
      dashVelRef.current.z = Math.cos(f) * DASH_IMPULSE;
    }

    boostRef.current = THREE.MathUtils.lerp(boostRef.current, 1, 1 - Math.pow(0.05, dt));

    for (let i = 0; i < boostPads.length; i++) {
      const pad = boostPads[i]!;
      const dx = g.position.x - pad.position[0];
      const dz = g.position.z - pad.position[2];
      if (dx * dx + dz * dz < pad.radius * pad.radius) {
        const last = padCooldownRef.current[i] ?? 0;
        if (now - last > 2500) {
          padCooldownRef.current[i] = now;
          boostRef.current = 1.85;
          addBoostPadScore(slotIndex);
        }
      }
    }

    if (bodyMatRef.current) {
      bodyMatRef.current.emissiveIntensity =
        0.35 + s.triggers.right * 1.1 + (s.buttons[0] ? 1.5 : 0) + (boostRef.current > 1.2 ? 1.2 : 0);
    }

    setPlayerPosition(slotIndex, g.position.x, g.position.y, g.position.z);

    const orbId = tryCollectOrb(slotIndex, g.position.x, g.position.z);
    if (orbId !== null) {
      gameState.scores[slotIndex] =
        (gameState.scores[slotIndex] ?? 0) + orbScoreForId(orbId);
      gameState.orbsCollected += 1;
      window.dispatchEvent(new CustomEvent("game-score"));
    }
  });

  return (
    <group ref={groupRef} position={[sx, sy, sz]}>
      <Trail
        width={0.8}
        length={6}
        color={color}
        attenuation={(t) => t * t}
      >
        <group>
          <mesh castShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[1.05, 0.42, 1.55]} />
            <meshStandardMaterial
              ref={bodyMatRef}
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              metalness={0.55}
              roughness={0.25}
            />
          </mesh>
          <mesh castShadow position={[0, 0.72, -0.15]}>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.9}
              roughness={0.1}
              emissive="#94a3b8"
              emissiveIntensity={0.15}
            />
          </mesh>
          {([-0.42, 0.42] as const).map((x) =>
            ([-0.55, 0.55] as const).map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0.12, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.14, 0.14, 0.22, 10]} />
                <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
              </mesh>
            ))
          )}
          <mesh position={[0, 0.38, 0.82]}>
            <boxGeometry args={[0.5, 0.12, 0.08]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>
      </Trail>
      <Sparkles count={12} scale={1.2} size={2} speed={0.4} color={color} position={[0, 0.5, -0.6]} />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.95, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}
