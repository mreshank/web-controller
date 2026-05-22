"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { Group, MeshStandardMaterial } from "three";
import type { PlayPlayerState } from "@/lib/play/simulation";

type NetworkRoverProps = {
  player: PlayPlayerState;
  color: string;
  isLocal: boolean;
};

export function NetworkRover({ player, color, isLocal }: NetworkRoverProps) {
  const groupRef = useRef<Group>(null);
  const target = useRef({ x: player.x, y: player.y, z: player.z, facing: player.facing });
  const bodyMatRef = useRef<MeshStandardMaterial>(null);

  target.current = {
    x: player.x,
    y: player.y,
    z: player.z,
    facing: player.facing,
  };

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const t = target.current;
    const lerp = isLocal ? 0.55 : 0.28;
    const k = 1 - Math.exp(-lerp * 60 * delta);
    g.position.x = THREE.MathUtils.lerp(g.position.x, t.x, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, t.y, k);
    g.position.z = THREE.MathUtils.lerp(g.position.z, t.z, k);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, t.facing, k);

    if (bodyMatRef.current) {
      bodyMatRef.current.emissiveIntensity = 0.55 + Math.min(2, player.streak * 0.2);
      bodyMatRef.current.color.set(color);
      bodyMatRef.current.emissive.set(color);
    }
  });

  return (
    <group ref={groupRef} position={[player.x, player.y, player.z]}>
      <mesh castShadow position={[0, 0.32, 0]}>
        <boxGeometry args={[0.95, 0.38, 1.4]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh castShadow position={[0, 0.68, -0.12]}>
        <sphereGeometry args={[0.34, 12, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.15} />
      </mesh>
      {isLocal ? (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.85, 1.15, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      ) : (
        <mesh position={[0, 1.1, 0]}>
          <planeGeometry args={[1.4, 0.35]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  );
}
