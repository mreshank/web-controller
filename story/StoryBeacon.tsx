"use client";

import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";
import type { StoryChapter } from "@/story/chapters";

type StoryBeaconProps = {
  chapter: StoryChapter;
  active: boolean;
  nearby: boolean;
};

export function StoryBeacon({ chapter, active, nearby }: StoryBeaconProps) {
  const ringRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
      const scale = nearby ? 1.35 : 1;
      ringRef.current.scale.setScalar(scale + Math.sin(Date.now() * 0.003) * 0.08);
    }
  });

  return (
    <group position={chapter.position}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.2, 0.08, 16, 48]} />
        <meshStandardMaterial
          color={chapter.color}
          emissive={chapter.color}
          emissiveIntensity={nearby || active ? 2 : 0.6}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={chapter.color}
          emissive={chapter.color}
          emissiveIntensity={1.5}
        />
      </mesh>
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.35}
        color={chapter.color}
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {chapter.title}
      </Text>
    </group>
  );
}
