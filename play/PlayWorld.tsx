"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { PLAY_ORB_COUNT, PLAY_WORLD_HALF } from "@/lib/play/constants";
import { buildOrbs, terrainHeight } from "@/lib/play/simulation";
import { playRoomRef } from "@/play/play-room-store";

const ROCK_COUNT = 14;

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function TerrainMesh() {
  const geometry = useMemo(() => {
    const seg = 16;
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
      <meshLambertMaterial color="#14243d" />
    </mesh>
  );
}

function InstancedRocks({ seed }: { seed: number }) {
  const mesh = useMemo(() => {
    const rnd = seeded(seed + 99);
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshLambertMaterial({ color: "#64748b" });
    const m = new THREE.InstancedMesh(geo, mat, ROCK_COUNT);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < ROCK_COUNT; i++) {
      const x = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.5;
      const z = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.5;
      const y = terrainHeight(x, z);
      dummy.position.set(x, y + 0.35, z);
      dummy.scale.setScalar(0.45 + rnd() * 0.7);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [seed]);

  return <primitive object={mesh} />;
}

function InstancedRelics({ seed }: { seed: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const orbs = useMemo(() => buildOrbs(seed), [seed]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(0.4, 0), []);
  const mat = useMemo(() => new THREE.MeshLambertMaterial({ color: "#38bdf8" }), []);

  useLayoutEffect(() => {
    const inst = meshRef.current;
    if (!inst) return;
    for (let i = 0; i < PLAY_ORB_COUNT; i++) {
      const o = orbs[i]!;
      dummy.position.set(o.x, o.y, o.z);
      dummy.scale.setScalar(o.golden ? 1.15 : 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  }, [orbs, dummy]);

  useFrame(() => {
    const inst = meshRef.current;
    const room = playRoomRef.current;
    if (!inst || !room) return;
    const collected = new Set(room.collectedOrbs);
    for (let i = 0; i < PLAY_ORB_COUNT; i++) {
      if (collected.has(i)) {
        dummy.position.set(0, -999, 0);
        dummy.scale.setScalar(0.001);
      } else {
        const o = orbs[i]!;
        dummy.position.set(o.x, o.y, o.z);
        dummy.scale.setScalar(o.golden ? 1.15 : 1);
      }
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geo, mat, PLAY_ORB_COUNT]}
      frustumCulled={false}
    />
  );
}

function HazardDrones() {
  const refs = [
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
    useRef<THREE.Mesh>(null),
  ];
  const offsets = [0, 0.33, 0.66];

  useFrame(() => {
    const room = playRoomRef.current;
    const clock = room ? room.tick / 20 : 0;
    offsets.forEach((t, i) => {
      const m = refs[i]?.current;
      if (!m) return;
      const phase = (clock * 0.15 + t) % 1;
      const x = Math.sin(phase * Math.PI * 2) * PLAY_WORLD_HALF * 0.55;
      const z = Math.cos(phase * Math.PI * 2 + t) * PLAY_WORLD_HALF * 0.45;
      m.position.set(x, terrainHeight(x, z) + 1.1, z);
    });
  });

  return (
    <>
      {refs.map((ref, i) => (
        <mesh key={i} ref={ref}>
          <octahedronGeometry args={[1, 0]} />
          <meshLambertMaterial color="#fb7185" />
        </mesh>
      ))}
    </>
  );
}

function BoostPads() {
  const pads = useMemo(
    () =>
      [
        [0, 0],
        [-16, 11],
        [18, -12],
      ] as const,
    []
  );
  return (
    <>
      {pads.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, terrainHeight(x, z) + 0.04, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.6, 2.2, 12]} />
          <meshBasicMaterial color="#00e8cc" transparent opacity={0.4} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

type PlayWorldProps = {
  seed: number;
};

export function PlayWorld({ seed }: PlayWorldProps) {
  return (
    <>
      <fog attach="fog" args={["#030712", 28, 72]} />
      <TerrainMesh />
      <InstancedRocks seed={seed} />
      <BoostPads />
      <InstancedRelics seed={seed} />
      <HazardDrones />
    </>
  );
}
