"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
import { useGamepad, GamepadState } from "@/hooks/useGamepad";

function Cube() {
  const meshRef = useRef<Mesh>(null);
  const stateRef = useRef<GamepadState | null>(null);

  // CRITICAL: store gamepad state in a ref, NOT useState.
  // useState would re-render 60x/second and kill performance.
  useGamepad((state) => {
    stateRef.current = state;
  });

  // useFrame runs every render frame inside R3F's loop.
  // Read the ref here and mutate the mesh directly.
  useFrame((_, delta) => {
    if (!meshRef.current || !stateRef.current) return;
    const speed = 5;
    meshRef.current.position.x += stateRef.current.leftStick.x * speed * delta;
    meshRef.current.position.z += stateRef.current.leftStick.y * speed * delta;
    meshRef.current.rotation.y += stateRef.current.rightStick.x * 2 * delta;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function Page() {
  return (
    <div className="w-screen h-screen bg-slate-900">
      <Canvas camera={{ position: [0, 3, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Cube />
        <OrbitControls />
      </Canvas>
    </div>
  );
}