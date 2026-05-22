"use client";

import { Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useSyncExternalStore } from "react";
import { useRef } from "react";
import { Mesh } from "three";
import { collectedOrbIds, type OrbDef } from "@/game/orbs";

function subscribeOrbs(onChange: () => void) {
  const h = () => onChange();
  window.addEventListener("game-score", h);
  return () => window.removeEventListener("game-score", h);
}

type OrbProps = {
  id: number;
  def: OrbDef;
};

export function Orb({ id, def }: OrbProps) {
  const ref = useRef<Mesh>(null);
  const collected = useSyncExternalStore(
    subscribeOrbs,
    () => collectedOrbIds.has(id),
    () => false
  );

  useFrame((_, delta) => {
    if (!ref.current || collected) return;
    ref.current.rotation.y += delta * (def.golden ? 2.2 : 1.5);
  });

  if (collected) return null;

  const color = def.golden ? "#fcd34d" : "#fde047";
  const emissive = def.golden ? "#f59e0b" : "#facc15";
  const scale = def.golden ? 0.55 : 0.38;

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={def.position}>
        {def.golden ? (
          <octahedronGeometry args={[scale, 0]} />
        ) : (
          <icosahedronGeometry args={[scale, 1]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={def.golden ? 2 : 1.2}
          metalness={0.45}
          roughness={0.08}
        />
        {def.golden ? (
          <pointLight color="#fbbf24" intensity={1.5} distance={5} />
        ) : null}
      </mesh>
    </Float>
  );
}
