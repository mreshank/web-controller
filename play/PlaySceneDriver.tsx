"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Group, Mesh } from "three";
import * as THREE from "three";
import { PLAYER_COLORS, PLAY_ORB_COUNT, PLAY_WORLD_HALF } from "@/lib/play/constants";
import { buildOrbs, terrainHeight } from "@/lib/play/simulation";
import {
  playCollectedSig,
  playPlayersBySlot,
  playRoomRef,
} from "@/play/play-room-store";

type PlaySceneDriverProps = {
  seed: number;
  localUid: string;
};

export function PlaySceneDriver({ seed, localUid }: PlaySceneDriverProps) {
  const roverRefs = [
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
    useRef<Group>(null),
  ];
  const ringRefs = [
    useRef<Mesh>(null),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
    useRef<Mesh>(null),
  ];
  const hazardRefs = [useRef<Mesh>(null), useRef<Mesh>(null), useRef<Mesh>(null)];
  const relicRef = useRef<THREE.InstancedMesh>(null);
  const orbs = useMemo(() => buildOrbs(seed), [seed]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const hazardT = useRef(0);
  const lastRelicSig = useRef("");

  const relicGeo = useMemo(() => new THREE.IcosahedronGeometry(0.38, 0), []);
  const relicMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#38bdf8" }), []);

  const applyRelicMatrices = (sig: string) => {
    const inst = relicRef.current;
    if (!inst) return;
    const collected = new Set(sig ? sig.split(",").filter(Boolean).map(Number) : []);
    for (let i = 0; i < PLAY_ORB_COUNT; i++) {
      if (collected.has(i)) {
        dummy.position.set(0, -999, 0);
        dummy.scale.setScalar(0.001);
      } else {
        const o = orbs[i]!;
        dummy.position.set(o.x, o.y, o.z);
        dummy.scale.setScalar(o.golden ? 1.1 : 1);
      }
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    lastRelicSig.current = sig;
  };

  useLayoutEffect(() => {
    applyRelicMatrices("");
  }, [orbs]);

  useFrame((_, delta) => {
    if (!playRoomRef.current) return;
    hazardT.current += delta;

    for (let slot = 0; slot < 4; slot++) {
      const g = roverRefs[slot]?.current;
      const ring = ringRefs[slot]?.current;
      const p = playPlayersBySlot[slot];
      if (!g) continue;
      if (!p) {
        g.visible = false;
        if (ring) ring.visible = false;
        continue;
      }
      g.visible = true;
      const isLocal = p.uid === localUid;
      if (ring) {
        ring.visible = isLocal;
        const mat = ring.material;
        if (mat && "color" in mat && mat.color instanceof THREE.Color) {
          mat.color.set(PLAYER_COLORS[slot]!);
        }
      }

      const k = isLocal ? 0.45 : 0.28;
      g.position.x += (p.x - g.position.x) * k;
      g.position.y += (p.y - g.position.y) * k;
      g.position.z += (p.z - g.position.z) * k;
      g.rotation.y += (p.facing - g.rotation.y) * k;
    }

    const hOff = [0, 0.33, 0.66];
    for (let i = 0; i < 3; i++) {
      const m = hazardRefs[i]?.current;
      if (!m) continue;
      const t = hOff[i]!;
      const phase = (hazardT.current * 0.15 + t) % 1;
      const x = Math.sin(phase * Math.PI * 2) * PLAY_WORLD_HALF * 0.55;
      const z = Math.cos(phase * Math.PI * 2 + t) * PLAY_WORLD_HALF * 0.45;
      m.position.set(x, terrainHeight(x, z) + 1.1, z);
    }

    if (playCollectedSig !== lastRelicSig.current) {
      applyRelicMatrices(playCollectedSig);
    }
  });

  return (
    <>
      {[0, 1, 2, 3].map((slot) => (
        <group key={slot} ref={roverRefs[slot]} visible={false}>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.9, 0.35, 1.3]} />
            <meshBasicMaterial color={PLAYER_COLORS[slot]!} />
          </mesh>
          <mesh
            ref={ringRefs[slot]}
            visible={false}
            position={[0, 0.02, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.75, 1, 10]} />
            <meshBasicMaterial
              color={PLAYER_COLORS[slot]!}
              transparent
              opacity={0.45}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={`h-${i}`} ref={hazardRefs[i]}>
          <octahedronGeometry args={[0.9, 0]} />
          <meshBasicMaterial color="#fb7185" />
        </mesh>
      ))}
      <instancedMesh
        ref={relicRef}
        args={[relicGeo, relicMat, PLAY_ORB_COUNT]}
        frustumCulled={false}
      />
    </>
  );
}
