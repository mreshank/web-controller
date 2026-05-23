"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Group } from "three";
import { playRoomRef } from "@/play/play-room-store";

type NetworkRoverProps = {
  uid: string;
  color: string;
  isLocal: boolean;
};

export function NetworkRover({ uid, color, isLocal }: NetworkRoverProps) {
  const groupRef = useRef<Group>(null);
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    const room = playRoomRef.current;
    if (!g || !room) return;
    const p = room.players.find((pl) => pl.uid === uid);
    if (!p) return;

    const k = 1 - Math.exp(-(isLocal ? 35 : 18) * delta);
    g.position.x = THREE.MathUtils.lerp(g.position.x, p.x, k);
    g.position.y = THREE.MathUtils.lerp(g.position.y, p.y, k);
    g.position.z = THREE.MathUtils.lerp(g.position.z, p.z, k);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, p.facing, k);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.9, 0.35, 1.3]} />
        <meshLambertMaterial color={colorObj} />
      </mesh>
      {isLocal ? (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.75, 1, 12]} />
          <meshBasicMaterial color={color} transparent opacity={0.45} toneMapped={false} />
        </mesh>
      ) : null}
    </group>
  );
}
