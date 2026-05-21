"use client";

import { useFrame } from "@react-three/fiber";
import { useSyncExternalStore } from "react";
import { useRef } from "react";
import { Mesh } from "three";
import { collectedOrbIds } from "@/game/orbs";

function subscribeOrbs(onChange: () => void) {
  const h = () => onChange();
  window.addEventListener("game-score", h);
  return () => window.removeEventListener("game-score", h);
}

type OrbProps = {
  id: number;
  position: [number, number, number];
};

export function Orb({ id, position }: OrbProps) {
  const ref = useRef<Mesh>(null);
  const collected = useSyncExternalStore(
    subscribeOrbs,
    () => collectedOrbIds.has(id),
    () => false
  );

  useFrame((_, delta) => {
    if (!ref.current || collected) return;
    ref.current.rotation.y += delta * 1.5;
    ref.current.position.y =
      position[1] + Math.sin(Date.now() * 0.003 + id) * 0.25;
  });

  if (collected) return null;

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.35, 1]} />
      <meshStandardMaterial
        color="#fde047"
        emissive="#facc15"
        emissiveIntensity={1.2}
        metalness={0.3}
        roughness={0.1}
      />
    </mesh>
  );
}
