"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useGamepadSlot } from "@/hooks/useGamepad";
import type { GamepadState } from "@/lib/gamepad";
import { ARENA_HALF, ORB_VALUE } from "@/game/config";
import { tryCollectOrb } from "@/game/orbs";
import { gameState } from "@/game/state";

type PlayerShipProps = {
  slotIndex: number;
  color: string;
  spawn: [number, number, number];
};

export function PlayerShip({ slotIndex, color, spawn }: PlayerShipProps) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const trailRef = useRef<MeshStandardMaterial>(null);
  const stateRef = useRef<GamepadState | null>(null);
  const velRef = useRef({ x: 0, z: 0 });

  useGamepadSlot(slotIndex, (s) => {
    stateRef.current = s;
  });

  useFrame((_, delta) => {
    if (!groupRef.current || !stateRef.current?.connected) return;

    const s = stateRef.current;
    const speed = 14 + s.triggers.right * 18;
    const turn = s.rightStick.x * 2.5 * delta;

    groupRef.current.rotation.y += turn;

    const forward = groupRef.current.rotation.y;
    const ax = s.leftStick.x;
    const ay = s.leftStick.y;
    const dx = (Math.sin(forward) * ay + Math.cos(forward) * ax) * speed * delta;
    const dz = (Math.cos(forward) * ay - Math.sin(forward) * ax) * speed * delta;

    velRef.current.x = dx;
    velRef.current.z = dz;

    groupRef.current.position.x = Math.max(
      -ARENA_HALF,
      Math.min(ARENA_HALF, groupRef.current.position.x + dx)
    );
    groupRef.current.position.z = Math.max(
      -ARENA_HALF,
      Math.min(ARENA_HALF, groupRef.current.position.z + dz)
    );
    groupRef.current.position.y =
      0.6 + Math.sin(Date.now() * 0.004 + slotIndex) * 0.08 + s.triggers.left * 0.3;

    if (trailRef.current) {
      trailRef.current.emissiveIntensity =
        0.4 + s.triggers.right * 1.2 + (s.buttons[0] ? 2 : 0);
    }

    if (
      tryCollectOrb(
        slotIndex,
        groupRef.current.position.x,
        groupRef.current.position.z
      )
    ) {
      gameState.scores[slotIndex] =
        (gameState.scores[slotIndex] ?? 0) + ORB_VALUE;
      gameState.orbsCollected += 1;
      window.dispatchEvent(new CustomEvent("game-score"));
    }
  });

  return (
    <group ref={groupRef} position={spawn}>
      <mesh ref={coreRef} castShadow>
        <coneGeometry args={[0.45, 1.1, 8]} />
        <meshStandardMaterial
          ref={trailRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
