"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { Mesh, MeshStandardMaterial, Color } from "three";
import { useGamepadNaive } from "@/hooks/useGamepadNaive";
import type { GamepadState } from "@/lib/gamepad";

export function NaiveCube() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<MeshStandardMaterial>(null);
  const stateRef = useRef<GamepadState | null>(null);

  const colors = useMemo(
    () => [
      new Color("#3b82f6"),
      new Color("#ef4444"),
      new Color("#f472b6"),
      new Color("#22c55e"),
    ],
    []
  );
  const defaultColor = useMemo(() => new Color("#f97316"), []);

  useGamepadNaive((state) => {
    stateRef.current = state;
  });

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current || !stateRef.current?.connected)
      return;

    const state = stateRef.current;
    const speed = 5;

    meshRef.current.position.x += state.leftStick.x * speed * delta;
    meshRef.current.position.z += state.leftStick.y * speed * delta;
    meshRef.current.rotation.y += state.rightStick.x * 2 * delta;
    meshRef.current.rotation.x += state.rightStick.y * 2 * delta;

    const targetScale = Math.max(
      0.2,
      1 + state.triggers.right * 1.5 - state.triggers.left * 0.7
    );
    meshRef.current.scale.setScalar(targetScale);

    let activeColor = defaultColor;
    for (let i = 0; i < 4; i++) {
      if (state.buttons[i]) {
        activeColor = colors[i];
        break;
      }
    }
    materialRef.current.color.lerp(activeColor, 0.15);
  });

  return (
    <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial ref={materialRef} color="#f97316" />
    </mesh>
  );
}
