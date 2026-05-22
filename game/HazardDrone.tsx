"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { hitHazard } from "@/game/game-rules";
import { hazardPaths } from "@/game/world-layout";
import { terrainHeight } from "@/game/terrain";
import { playerPositions } from "@/game/player-registry";

type HazardDroneProps = {
  pathIndex: number;
  color?: string;
  speed?: number;
};

const hitCooldown = new Map<string, number>();

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
    const dt = Math.min(delta, 0.033);
    tRef.current = (tRef.current + dt * speed) % 1;
    const t = tRef.current;
    const ping = t < 0.5 ? t * 2 : 2 - t * 2;
    groupRef.current.position.lerpVectors(path.a, path.b, ping);
    groupRef.current.rotation.y += dt * 2;

    const now = performance.now();
    playerPositions.forEach((p, slot) => {
      const dx = p.x - groupRef.current!.position.x;
      const dy = p.y - groupRef.current!.position.y;
      const dz = p.z - groupRef.current!.position.z;
      if (dx * dx + dy * dy + dz * dz > 2.8) return;

      const key = `${pathIndex}-${slot}`;
      if ((hitCooldown.get(key) ?? 0) > now) return;
      hitCooldown.set(key, now + 900);
      hitHazard(slot);
    });
  });

  if (!path) return null;

  return (
    <group ref={groupRef}>
      <mesh castShadow>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          metalness={0.5}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.06, 8, 28]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} toneMapped={false} />
      </mesh>
    </group>
  );
}
