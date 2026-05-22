"use client";

import { Grid, Sky, Sparkles, Stars } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { WORLD_HALF } from "@/game/config";
import { terrainHeight } from "@/game/terrain";
import { boostPads, worldRocks, worldTrees } from "@/game/world-layout";
import { BoostRing } from "@/game/BoostRing";
import { HazardDrone } from "@/game/HazardDrone";

function TerrainMesh() {
  const geometry = useMemo(() => {
    const seg = 48;
    const geo = new THREE.PlaneGeometry(WORLD_HALF * 2.1, WORLD_HALF * 2.1, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const cLow = new THREE.Color("#0c1222");
    const cMid = new THREE.Color("#1a2d4a");
    const cHigh = new THREE.Color("#243b5c");

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = terrainHeight(x, z);
      pos.setY(i, h);
      const t = Math.min(1, (h + 1) / 4.5);
      const c = new THREE.Color().copy(cLow).lerp(cMid, t * 0.7).lerp(cHigh, Math.max(0, t - 0.5) * 2);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    geo.computeVertexNormals();
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function InstancedRocks() {
  const mesh = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: "#64748b",
      roughness: 0.85,
      flatShading: true,
    });
    const m = new THREE.InstancedMesh(geo, mat, worldRocks.length);
    const dummy = new THREE.Object3D();
    worldRocks.forEach((r, i) => {
      dummy.position.set(r.position[0], r.position[1] + r.scale * 0.35, r.position[2]);
      dummy.rotation.set(0, r.rot, 0);
      dummy.scale.setScalar(r.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, []);

  return <primitive object={mesh} />;
}

function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  const [x, , z] = position;
  const y = terrainHeight(x, z);
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.5, 1.2, 6]} />
        <meshStandardMaterial color="#166534" emissive="#14532d" emissiveIntensity={0.25} flatShading />
      </mesh>
    </group>
  );
}

const TREE_SLICE = worldTrees.slice(0, 28);

export function WorldEnvironment() {
  return (
    <>
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 40, 110]} />
      <Sky
        distance={450000}
        sunPosition={[90, 32, 45]}
        inclination={0.52}
        azimuth={0.2}
        turbidity={5}
      />
      <Stars radius={100} depth={50} count={7000} factor={6} saturation={1} fade={false} speed={0.12} />
      <Sparkles count={120} scale={[90, 10, 90]} size={2.2} speed={0.12} color="#00e8cc" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[35, 50, 25]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight args={["#7dd3fc", "#0f172a", 0.4]} />
      <TerrainMesh />
      <InstancedRocks />
      {TREE_SLICE.map((t, i) => (
        <Tree key={i} position={t.position} scale={t.scale} />
      ))}
      {boostPads.map((p, i) => (
        <BoostRing key={i} position={p.position} radius={p.radius} />
      ))}
      <HazardDrone pathIndex={0} color="#fb7185" />
      <HazardDrone pathIndex={1} color="#fbbf24" speed={0.38} />
      <HazardDrone pathIndex={2} color="#a78bfa" speed={0.3} />
    </>
  );
}
