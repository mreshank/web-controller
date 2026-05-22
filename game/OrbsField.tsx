"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { collectedOrbIds, orbDefs } from "@/game/orbs";

const _matrix = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();

/** Single instanced draw — no per-orb React subscriptions (fixes stutter). */
export function OrbsField() {
  const normalRef = useRef<THREE.InstancedMesh>(null);
  const goldenRef = useRef<THREE.InstancedMesh>(null);

  const { normalIndices, goldenIndices } = useMemo(() => {
    const normal: number[] = [];
    const golden: number[] = [];
    orbDefs.forEach((o, i) => (o.golden ? golden : normal).push(i));
    return { normalIndices: normal, goldenIndices: golden };
  }, []);

  const normalGeo = useMemo(() => new THREE.IcosahedronGeometry(0.42, 1), []);
  const goldenGeo = useMemo(() => new THREE.OctahedronGeometry(0.58, 0), []);

  useLayoutEffect(() => {
    const apply = (
      mesh: THREE.InstancedMesh | null,
      indices: number[],
      baseScale: number
    ) => {
      if (!mesh) return;
      indices.forEach((orbId, i) => {
        const def = orbDefs[orbId]!;
        _pos.set(def.position[0], def.position[1], def.position[2]);
        _quat.identity();
        _scale.setScalar(baseScale);
        _matrix.compose(_pos, _quat, _scale);
        mesh.setMatrixAt(i, _matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    apply(normalRef.current, normalIndices, 1);
    apply(goldenRef.current, goldenIndices, 1);
  }, [normalIndices, goldenIndices]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    const updateMesh = (
      mesh: THREE.InstancedMesh | null,
      indices: number[],
      spin: number,
      bob: number
    ) => {
      if (!mesh) return;
      let write = false;
      indices.forEach((orbId, i) => {
        if (collectedOrbIds.has(orbId)) {
          _scale.set(0, 0, 0);
        } else {
          const def = orbDefs[orbId]!;
          const y = def.position[1] + Math.sin(t * 2.2 + orbId) * bob;
          _pos.set(def.position[0], y, def.position[2]);
          _quat.setFromEuler(new THREE.Euler(0, t * spin + orbId, 0));
          _scale.setScalar(def.golden ? 1.05 + Math.sin(t * 3 + orbId) * 0.08 : 1);
        }
        _matrix.compose(_pos, _quat, _scale);
        mesh.setMatrixAt(i, _matrix);
        write = true;
      });
      if (write) mesh.instanceMatrix.needsUpdate = true;
    };

    updateMesh(normalRef.current, normalIndices, 1.6, 0.22);
    updateMesh(goldenRef.current, goldenIndices, 2.4, 0.35);
  });

  return (
    <group>
      {normalIndices.length > 0 ? (
        <instancedMesh
          ref={normalRef}
          args={[normalGeo, undefined, normalIndices.length]}
          frustumCulled={false}
        >
          <meshStandardMaterial
            color="#fde047"
            emissive="#facc15"
            emissiveIntensity={1.8}
            metalness={0.5}
            roughness={0.05}
            toneMapped={false}
          />
        </instancedMesh>
      ) : null}
      {goldenIndices.length > 0 ? (
        <instancedMesh
          ref={goldenRef}
          args={[goldenGeo, undefined, goldenIndices.length]}
          frustumCulled={false}
        >
          <meshStandardMaterial
            color="#fcd34d"
            emissive="#f59e0b"
            emissiveIntensity={2.8}
            metalness={0.55}
            roughness={0.02}
            toneMapped={false}
          />
        </instancedMesh>
      ) : null}
    </group>
  );
}
