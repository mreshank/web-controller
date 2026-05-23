"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PLAY_WORLD_HALF } from "@/lib/play/constants";
import { terrainHeight } from "@/lib/play/simulation";

const ROCK_COUNT = 10;

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function TerrainMesh() {
  const geometry = useMemo(() => {
    const seg = 12;
    const geo = new THREE.PlaneGeometry(
      PLAY_WORLD_HALF * 2,
      PLAY_WORLD_HALF * 2,
      seg,
      seg
    );
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, terrainHeight(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color="#14243d" />
    </mesh>
  );
}

function InstancedRocks({ seed }: { seed: number }) {
  const mesh = useMemo(() => {
    const rnd = seeded(seed + 99);
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: "#64748b" });
    const m = new THREE.InstancedMesh(geo, mat, ROCK_COUNT);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < ROCK_COUNT; i++) {
      const x = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.4;
      const z = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.4;
      dummy.position.set(x, terrainHeight(x, z) + 0.3, z);
      dummy.scale.setScalar(0.4 + rnd() * 0.6);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [seed]);

  return <primitive object={mesh} />;
}

function BoostPads() {
  const pads: Array<[number, number]> = [
    [0, 0],
    [-16, 11],
    [18, -12],
  ];
  return (
    <>
      {pads.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, terrainHeight(x, z) + 0.04, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.5, 2.1, 8]} />
          <meshBasicMaterial color="#00e8cc" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

type PlayWorldProps = {
  seed: number;
};

/** Static world only — motion lives in PlaySceneDriver (single useFrame). */
export function PlayWorld({ seed }: PlayWorldProps) {
  return (
    <>
      <TerrainMesh />
      <InstancedRocks seed={seed} />
      <BoostPads />
    </>
  );
}
