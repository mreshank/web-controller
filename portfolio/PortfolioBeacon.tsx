"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh } from "three";
import type { PortfolioBeacon } from "@/portfolio/data";
import { mcMaterial, MC_TEX } from "@/portfolio/minecraft-textures";
import { portfolioHeight } from "@/portfolio/terrain";

type Props = {
  beacon: PortfolioBeacon;
  nearby: boolean;
  visited: boolean;
};

export function PortfolioBeacon({ beacon, nearby, visited }: Props) {
  const groupRef = useRef<Group>(null);
  const flameRef = useRef<Mesh>(null);
  const x = beacon.position[0];
  const z = beacon.position[2];
  const baseY = portfolioHeight(x, z);
  const glowMat = useMemo(() => mcMaterial(MC_TEX.glow, [1, 1]), []);

  useFrame((_, delta) => {
    if (flameRef.current) {
      flameRef.current.rotation.y += delta * 1.2;
      const s = nearby ? 1.25 : visited ? 1.1 : 1;
      flameRef.current.scale.setScalar(s + Math.sin(Date.now() * 0.008) * 0.08);
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        baseY + Math.sin(Date.now() * 0.0025 + x) * 0.04;
    }
  });

  const intensity = nearby ? 4 : visited ? 2.2 : 1.2;

  return (
    <group ref={groupRef} position={[x, baseY, z]}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 1.05, 0.22]} />
        <meshStandardMaterial color="#3d2914" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.5]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <mesh ref={flameRef} position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[0.32, 0.38, 0.32]} />
        <meshStandardMaterial
          map={glowMat.map}
          emissive="#ffcc44"
          emissiveIntensity={intensity}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        color="#ffcc66"
        intensity={intensity * 1.2}
        distance={14}
        position={[0, 1.6, 0]}
      />
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[1.2, 1.85, 4]} />
        <meshBasicMaterial
          color={nearby ? "#fde047" : "#8b6914"}
          transparent
          opacity={nearby ? 0.5 : 0.22}
        />
      </mesh>
      <Text
        position={[0, 2.35, 0]}
        fontSize={0.28}
        color="#3d2914"
        outlineWidth={0.04}
        outlineColor="#fef9c3"
        anchorX="center"
        maxWidth={5}
        textAlign="center"
      >
        {beacon.title}
      </Text>
      <Text
        position={[0, 2.05, 0]}
        fontSize={0.14}
        color={nearby ? "#422006" : "#57534e"}
        outlineWidth={0.02}
        outlineColor="#fef9c3"
        anchorX="center"
        maxWidth={4.5}
      >
        {nearby ? "[ X ] Read sign" : beacon.subtitle}
      </Text>
    </group>
  );
}
