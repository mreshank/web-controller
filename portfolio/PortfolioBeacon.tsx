"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh } from "three";
import type { PortfolioBeacon, PortfolioKind } from "@/portfolio/data";
import { portfolioHeight } from "@/portfolio/terrain";

type Props = {
  beacon: PortfolioBeacon;
  nearby: boolean;
  visited: boolean;
};

function Icon({ kind, color }: { kind: PortfolioKind; color: string }) {
  const mat = {
    color,
    emissive: color,
    emissiveIntensity: 2,
    toneMapped: false as const,
  };
  switch (kind) {
    case "intro":
      return (
        <mesh>
          <cylinderGeometry args={[0.35, 0.45, 1.2, 8]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    case "work":
      return (
        <mesh>
          <boxGeometry args={[0.9, 0.7, 0.5]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    case "project":
      return (
        <mesh>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial {...mat} wireframe />
        </mesh>
      );
    case "contact":
      return (
        <mesh>
          <torusGeometry args={[0.4, 0.12, 8, 24]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    default:
      return (
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
  }
}

export function PortfolioBeacon({ beacon, nearby, visited }: Props) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const x = beacon.position[0];
  const z = beacon.position[2];
  const baseY = portfolioHeight(x, z);

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.5;
    if (groupRef.current) {
      groupRef.current.position.y =
        baseY + 0.2 + Math.sin(Date.now() * 0.002 + x) * 0.08;
    }
  });

  const scale = nearby ? 1.4 : visited ? 1.15 : 1;

  return (
    <group ref={groupRef} position={[x, baseY, z]}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} scale={scale}>
        <torusGeometry args={[1.9, 0.12, 12, 48]} />
        <meshStandardMaterial
          color={beacon.color}
          emissive={beacon.color}
          emissiveIntensity={nearby ? 3 : 1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.12, 2.4, 8]} />
        <meshStandardMaterial
          color={beacon.color}
          emissive={beacon.color}
          emissiveIntensity={2}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
      <group position={[0, 0.6, 0]}>
        <Icon kind={beacon.kind} color={beacon.color} />
      </group>
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.48}
        color="#f8fafc"
        outlineWidth={0.04}
        outlineColor="#020617"
        anchorX="center"
        maxWidth={5}
        textAlign="center"
      >
        {beacon.title}
      </Text>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.2}
        color={beacon.color}
        outlineWidth={0.03}
        outlineColor="#020617"
        anchorX="center"
        maxWidth={4.5}
      >
        {nearby ? "× read · ○ close" : beacon.subtitle}
      </Text>
    </group>
  );
}
