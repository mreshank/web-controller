"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";

type BoostRingProps = {
  position: [number, number, number];
  radius: number;
};

export function BoostRing({ position, radius }: BoostRingProps) {
  const ringRef = useRef<Mesh>(null);
  const innerRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.8;
    if (innerRef.current) {
      const s = 1 + Math.sin(Date.now() * 0.004) * 0.06;
      innerRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={[position[0], position[1] + 0.08, position[2]]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.12, 8, 48]} />
        <meshStandardMaterial
          color="#00e8cc"
          emissive="#00e8cc"
          emissiveIntensity={1.2}
          transparent
          opacity={0.75}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={innerRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.55, radius * 0.85, 32]} />
        <meshBasicMaterial color="#00e8cc" transparent opacity={0.2} />
      </mesh>
      <pointLight color="#00e8cc" intensity={0.8} distance={radius * 3} />
    </group>
  );
}
