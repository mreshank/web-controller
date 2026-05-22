"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { hazardPaths } from "@/game/world-layout";
import { terrainHeight } from "@/game/terrain";
import { playerPositions } from "@/game/player-registry";

type HazardDroneProps = {
  pathIndex: number;
  color?: string;
  speed?: number;
};

export function HazardDrone({
  pathIndex,
  color = "#fb7185",
  speed = 0.42,
}: HazardDroneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(Math.random());

  const path = useMemo(() => {
    const seg = hazardPaths[pathIndex];
    if (!seg) return null;
    const [a, b] = seg;
    const y0 = terrainHeight(a[0], a[2]) + 2.5;
    const y1 = terrainHeight(b[0], b[2]) + 2.5;
    return {
      a: new THREE.Vector3(a[0], y0, a[2]),
      b: new THREE.Vector3(b[0], y1, b[2]),
    };
  }, [pathIndex]);

  useFrame((_, delta) => {
    if (!groupRef.current || !path) return;
    tRef.current = (tRef.current + delta * speed) % 1;
    const t = tRef.current;
    const ping = t < 0.5 ? t * 2 : 2 - t * 2;
    groupRef.current.position.lerpVectors(path.a, path.b, ping);
    groupRef.current.rotation.y += delta * 2;

    playerPositions.forEach((p, slot) => {
      const dx = p.x - groupRef.current!.position.x;
      const dy = p.y - groupRef.current!.position.y;
      const dz = p.z - groupRef.current!.position.z;
      if (dx * dx + dy * dy + dz * dz < 2.2) {
        const knock = 8;
        p.x += dx * knock * delta;
        p.z += dz * knock * delta;
        window.dispatchEvent(
          new CustomEvent("game-hazard", { detail: { slot } })
        );
      }
    });
  });

  if (!path) return null;

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <octahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.4}
          metalness={0.5}
          roughness={0.2}
          wireframe
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 8, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <pointLight color={color} intensity={0.6} distance={6} />
    </group>
  );
}
