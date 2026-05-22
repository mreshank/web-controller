"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh } from "three";

type WorldBeaconProps = {
  position: [number, number, number];
};

export function WorldBeacon({ position }: WorldBeaconProps) {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.5;
    const beam = ref.current.children[1] as Mesh | undefined;
    if (beam?.scale) {
      const s = 1 + Math.sin(Date.now() * 0.003) * 0.15;
      beam.scale.set(1, s, 1);
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.5, 1.2, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.08, 0.02, 4, 8]} />
        <meshStandardMaterial
          color="#00e8cc"
          emissive="#00e8cc"
          emissiveIntensity={2}
          transparent
          opacity={0.65}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#00e8cc" intensity={1.2} distance={14} position={[0, 2, 0]} />
    </group>
  );
}
