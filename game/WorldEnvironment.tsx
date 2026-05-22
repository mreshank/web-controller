"use client";

import { Cloud, Sky, Sparkles, Stars } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { WORLD_HALF } from "@/game/config";
import { terrainHeight } from "@/game/terrain";
import { beacons, boostPads, worldRocks, worldTrees } from "@/game/world-layout";
import { BoostRing } from "@/game/BoostRing";
import { HazardDrone } from "@/game/HazardDrone";
import { WorldBeacon } from "@/game/WorldBeacon";

function TerrainMesh() {
    const { geometry } = useMemo(() => {
    const seg = 64;
    const geo = new THREE.PlaneGeometry(WORLD_HALF * 2.1, WORLD_HALF * 2.1, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const cLow = new THREE.Color("#0c1222");
    const cMid = new THREE.Color("#152238");
    const cHigh = new THREE.Color("#1e3a5f");
    const cPeak = new THREE.Color("#2d4a6f");

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = terrainHeight(x, z);
      pos.setY(i, h);
      const t = Math.min(1, (h + 1) / 4.5);
      const c = new THREE.Color();
      if (t < 0.35) c.copy(cLow).lerp(cMid, t / 0.35);
      else if (t < 0.7) c.copy(cMid).lerp(cHigh, (t - 0.35) / 0.35);
      else c.copy(cHigh).lerp(cPeak, (t - 0.7) / 0.3);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    geo.computeVertexNormals();
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { geometry: geo };
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.92} metalness={0.08} />
    </mesh>
  );
}

function InstancedRocks() {
  const { mesh } = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: "#475569",
      roughness: 0.85,
      metalness: 0.15,
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
    m.castShadow = true;
    return { mesh: m };
  }, []);

  return <primitive object={mesh} />;
}

function Tree({ position, scale }: { position: [number, number, number]; scale: number }) {
  const [x, , z] = position;
  const y = terrainHeight(x, z);
  return (
    <group position={[x, y, z]} scale={scale}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 0.7, 6]} />
        <meshStandardMaterial color="#3d2914" roughness={0.9} />
      </mesh>
      <mesh castShadow position={[0, 1.05, 0]}>
        <coneGeometry args={[0.55, 1.1, 7]} />
        <meshStandardMaterial color="#14532d" roughness={0.75} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.65, 0]}>
        <coneGeometry args={[0.4, 0.75, 7]} />
        <meshStandardMaterial color="#166534" roughness={0.75} flatShading />
      </mesh>
    </group>
  );
}

export function WorldEnvironment() {
  return (
    <>
      <fog attach="fog" args={["#030408", 35, 130]} />
      <Sky
        distance={450000}
        sunPosition={[80, 24, 40]}
        inclination={0.52}
        azimuth={0.22}
        mieCoefficient={0.005}
        mieDirectionalG={0.9}
        turbidity={8}
      />
      <Stars radius={120} depth={60} count={8000} factor={4} fade speed={0.6} />
      <Sparkles count={200} scale={[WORLD_HALF * 1.2, 8, WORLD_HALF * 1.2]} size={1.5} speed={0.2} color="#00e8cc" />
      <Cloud opacity={0.35} speed={0.25} bounds={[40, 6, 40]} segments={18} position={[0, 18, -20]} />
      <Cloud opacity={0.25} speed={0.2} bounds={[30, 4, 30]} segments={14} position={[-25, 14, 15]} />
      <ambientLight intensity={0.28} />
      <directionalLight
        position={[40, 55, 30]}
        intensity={1.35}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={120}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
      />
      <pointLight position={[-30, 12, -25]} intensity={0.7} color="#00e8cc" />
      <pointLight position={[35, 8, 30]} intensity={0.55} color="#f472b6" />
      <hemisphereLight args={["#38bdf8", "#0f172a", 0.35]} />
      <TerrainMesh />
      <InstancedRocks />
      {worldTrees.map((t, i) => (
        <Tree key={i} position={t.position} scale={t.scale} />
      ))}
      {beacons.map((b, i) => (
        <WorldBeacon key={i} position={b.position} />
      ))}
      {boostPads.map((p, i) => (
        <BoostRing key={i} position={p.position} radius={p.radius} />
      ))}
      <HazardDrone pathIndex={0} color="#fb7185" />
      <HazardDrone pathIndex={1} color="#fbbf24" speed={0.35} />
      <HazardDrone pathIndex={2} color="#a78bfa" speed={0.28} />
    </>
  );
}
