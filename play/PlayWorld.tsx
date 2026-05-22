"use client";

import { Grid, Sky, Sparkles } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { PLAY_WORLD_HALF } from "@/lib/play/constants";
import { buildOrbs, terrainHeight } from "@/lib/play/simulation";

const TREE_COUNT = 22;
const ROCK_COUNT = 28;

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function TerrainMesh() {
  const geometry = useMemo(() => {
    const seg = 32;
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
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#14243d" roughness={0.92} metalness={0.08} />
    </mesh>
  );
}

function InstancedRocks({ seed }: { seed: number }) {
  const mesh = useMemo(() => {
    const rnd = seeded(seed + 99);
    const geo = new THREE.DodecahedronGeometry(1, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: "#64748b",
      roughness: 0.9,
      flatShading: true,
    });
    const m = new THREE.InstancedMesh(geo, mat, ROCK_COUNT);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < ROCK_COUNT; i++) {
      const x = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.6;
      const z = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.6;
      const y = terrainHeight(x, z);
      dummy.position.set(x, y + 0.4, z);
      dummy.rotation.set(0, rnd() * Math.PI, 0);
      dummy.scale.setScalar(0.5 + rnd() * 0.9);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [seed]);

  return <primitive object={mesh} />;
}

function Trees({ seed }: { seed: number }) {
  const trees = useMemo(() => {
    const rnd = seeded(seed + 7);
    return Array.from({ length: TREE_COUNT }, () => {
      const x = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.4;
      const z = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.4;
      return { x, z, scale: 0.7 + rnd() * 0.5 };
    });
  }, [seed]);

  return (
    <>
      {trees.map((t, i) => (
        <group key={i} position={[t.x, terrainHeight(t.x, t.z), t.z]} scale={t.scale}>
          <mesh position={[0, 0.75, 0]}>
            <coneGeometry args={[0.45, 1, 5]} />
            <meshStandardMaterial color="#166534" flatShading />
          </mesh>
        </group>
      ))}
    </>
  );
}

function RelicOrbs({
  seed,
  collected,
}: {
  seed: number;
  collected: number[];
}) {
  const orbs = useMemo(() => buildOrbs(seed), [seed]);
  const collectedSet = useMemo(() => new Set(collected), [collected]);

  return (
    <>
      {orbs.map((o, i) => {
        if (collectedSet.has(i)) return null;
        return (
          <mesh key={i} position={[o.x, o.y, o.z]}>
            <icosahedronGeometry args={[o.golden ? 0.55 : 0.42, 0]} />
            <meshStandardMaterial
              color={o.golden ? "#fbbf24" : "#38bdf8"}
              emissive={o.golden ? "#f59e0b" : "#0ea5e9"}
              emissiveIntensity={o.golden ? 2.2 : 1.4}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </>
  );
}

function BoostPads() {
  const pads = [
    [0, 0],
    [-16, 11],
    [18, -12],
  ] as const;
  return (
    <>
      {pads.map(([x, z], i) => (
        <mesh
          key={i}
          position={[x, terrainHeight(x, z) + 0.05, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[1.8, 2.6, 24]} />
          <meshBasicMaterial color="#00e8cc" transparent opacity={0.45} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function HazardGhosts({ clock }: { clock: number }) {
  const positions = [0, 0.33, 0.66].map((t) => {
    const phase = (clock * 0.15 + t) % 1;
    const x = Math.sin(phase * Math.PI * 2) * PLAY_WORLD_HALF * 0.55;
    const z = Math.cos(phase * Math.PI * 2 + t) * PLAY_WORLD_HALF * 0.45;
    const y = terrainHeight(x, z) + 1.2;
    return [x, y, z] as [number, number, number];
  });

  return (
    <>
      {positions.map((p, i) => (
        <mesh key={i} position={p}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshStandardMaterial
            color="#fb7185"
            emissive="#e11d48"
            emissiveIntensity={1.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </>
  );
}

type PlayWorldProps = {
  seed: number;
  collected: number[];
  hazardClock: number;
};

export function PlayWorld({ seed, collected, hazardClock }: PlayWorldProps) {
  return (
    <>
      <Sky distance={450000} sunPosition={[80, 20, 40]} mieCoefficient={0.005} />
      <fog attach="fog" args={["#030712", 35, 95]} />
      <Grid
        position={[0, -0.02, 0]}
        infiniteGrid
        fadeDistance={40}
        cellSize={1}
        sectionSize={4}
        sectionColor="#334155"
        cellColor="#1e293b"
      />
      <Sparkles count={80} scale={55} size={2} speed={0.2} opacity={0.35} color="#38bdf8" />
      <TerrainMesh />
      <InstancedRocks seed={seed} />
      <Trees seed={seed} />
      <BoostPads />
      <RelicOrbs seed={seed} collected={collected} />
      <HazardGhosts clock={hazardClock} />
    </>
  );
}
