"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { DoubleSide, Group, Mesh } from "three";
import type { StoryChapter, StoryFeature } from "@/story/chapters";

type StoryBeaconProps = {
  chapter: StoryChapter;
  active: boolean;
  nearby: boolean;
  visited: boolean;
};

function FeatureIcon({ feature, color }: { feature: StoryFeature; color: string }) {
  const mat = useMemo(
    () => ({
      color,
      emissive: color,
      emissiveIntensity: 2,
      metalness: 0.35,
      roughness: 0.2,
      toneMapped: false as const,
    }),
    [color]
  );

  switch (feature) {
    case "webgl":
      return (
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial {...mat} wireframe />
        </mesh>
      );
    case "canvas":
      return (
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <planeGeometry args={[1.1, 1.1]} />
          <meshStandardMaterial {...mat} side={DoubleSide} />
        </mesh>
      );
    case "css":
      return (
        <mesh>
          <boxGeometry args={[1.2, 0.15, 0.8]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    case "gamepad":
      return (
        <mesh>
          <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    case "multiplayer":
      return (
        <group>
          {([-0.35, 0.35] as const).map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <sphereGeometry args={[0.28, 12, 12]} />
              <meshStandardMaterial {...mat} />
            </mesh>
          ))}
        </group>
      );
    case "audio":
      return (
        <mesh>
          <torusGeometry args={[0.45, 0.12, 8, 24]} />
          <meshStandardMaterial {...mat} />
        </mesh>
      );
    case "vanilla":
    default:
      return (
        <mesh>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial {...mat} flatShading />
        </mesh>
      );
  }
}

export function StoryBeacon({ chapter, active, nearby, visited }: StoryBeaconProps) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const beamRef = useRef<Mesh>(null);

  const scale = nearby ? 1.45 : visited ? 1.15 : 1;

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.65;
      const pulse = 1 + Math.sin(Date.now() * 0.004 + chapter.position[0]) * 0.1;
      ringRef.current.scale.setScalar(scale * pulse);
    }
    if (beamRef.current) {
      const s = nearby ? 1.25 : 1;
      beamRef.current.scale.set(1, s + Math.sin(Date.now() * 0.005) * 0.12, 1);
    }
    if (groupRef.current) groupRef.current.position.y =
      chapter.position[1] + Math.sin(Date.now() * 0.002 + chapter.position[2]) * 0.15;
  });

  return (
    <group ref={groupRef} position={chapter.position}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.1, 0.14, 12, 56]} />
        <meshStandardMaterial
          color={chapter.color}
          emissive={chapter.color}
          emissiveIntensity={nearby || active ? 3.5 : 1.8}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={beamRef} position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.06, 0.2, 3.2, 8]} />
        <meshStandardMaterial
          color={chapter.color}
          emissive={chapter.color}
          emissiveIntensity={2.5}
          transparent
          opacity={nearby ? 0.85 : 0.55}
          toneMapped={false}
        />
      </mesh>
      <group position={[0, 0.5, 0]}>
        <FeatureIcon feature={chapter.feature} color={chapter.color} />
      </group>
      {visited ? (
        <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.35, 0.35, 0.08]} />
          <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ) : null}
      <Text
        position={[0, 3.6, 0]}
        fontSize={0.52}
        color="#f8fafc"
        outlineWidth={0.04}
        outlineColor="#020617"
        anchorX="center"
        anchorY="middle"
        maxWidth={5.5}
        textAlign="center"
      >
        {chapter.title}
      </Text>
      <Text
        position={[0, 2.85, 0]}
        fontSize={0.22}
        color={chapter.color}
        outlineWidth={0.03}
        outlineColor="#020617"
        anchorX="center"
        anchorY="middle"
        maxWidth={5}
      >
        {nearby ? "× open · ○ close" : chapter.subtitle}
      </Text>
    </group>
  );
}
