"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PORTFOLIO_VILLAGE_GLB } from "@/portfolio/config";
import { PORTFOLIO_WORLD_HALF } from "@/portfolio/config";
import { mcMaterial, MC_TEX } from "@/portfolio/minecraft-textures";
import { PortfolioRoads } from "@/portfolio/PortfolioRoads";
import { portfolioHeight } from "@/portfolio/terrain";

const VILLAGE_SCALE = 1.8;

function GrassGround() {
  const grass = useMemo(() => mcMaterial(MC_TEX.grass, [24, 24]), []);
  const geometry = useMemo(() => {
    const seg = 72;
    const geo = new THREE.PlaneGeometry(
      PORTFOLIO_WORLD_HALF * 2.2,
      PORTFOLIO_WORLD_HALF * 2.2,
      seg,
      seg
    );
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      pos.setY(i, portfolioHeight(pos.getX(i), pos.getZ(i)));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} material={grass} receiveShadow />
  );
}

function TexturedHouse({
  position,
  size = [5, 3.5, 5] as [number, number, number],
}: {
  position: [number, number, number];
  size?: [number, number, number];
}) {
  const plank = useMemo(() => mcMaterial(MC_TEX.oakPlanks, [2, 2]), []);
  const brick = useMemo(() => mcMaterial(MC_TEX.stoneBrick, [2, 2]), []);
  const [w, h, d] = size;
  const y = portfolioHeight(position[0], position[2]);

  return (
    <group position={[position[0], y, position[2]]}>
      <mesh position={[0, h / 2, 0]} material={plank} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <mesh position={[0, h + 0.4, 0]} castShadow>
        <boxGeometry args={[w + 0.5, 0.55, d + 0.5]} />
        <meshStandardMaterial color="#3d2914" roughness={0.9} />
      </mesh>
      <mesh position={[0, h * 0.35, d / 2 + 0.04]} castShadow>
        <boxGeometry args={[w * 0.35, h * 0.55, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 0.25, d / 2 + 0.2]} material={brick} castShadow>
        <boxGeometry args={[w + 0.3, 0.5, 0.2]} />
      </mesh>
    </group>
  );
}

function OakTree({ position }: { position: [number, number, number] }) {
  const y = portfolioHeight(position[0], position[2]);
  const plank = useMemo(() => mcMaterial(MC_TEX.oakPlanks, [1, 1]), []);
  return (
    <group position={[position[0], y, position[2]]}>
      <mesh position={[0, 1.4, 0]} material={plank} castShadow>
        <boxGeometry args={[0.4, 2.8, 0.4]} />
      </mesh>
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[2.6, 2.4, 2.6]} />
        <meshStandardMaterial color="#2d6b2d" roughness={0.9} />
      </mesh>
    </group>
  );
}

function ProceduralVillage() {
  return (
    <group>
      <GrassGround />
      <PortfolioRoads />
      <TexturedHouse position={[-14, 0, -10]} size={[6, 4, 5]} />
      <TexturedHouse position={[16, 0, -12]} size={[7, 4.5, 6]} />
      <TexturedHouse position={[-18, 0, 14]} size={[5, 3.5, 5]} />
      <TexturedHouse position={[12, 0, 16]} size={[6, 3.5, 6]} />
      <TexturedHouse position={[0, 0, -20]} size={[8, 3, 5]} />
      <OakTree position={[-8, 0, 8]} />
      <OakTree position={[8, 0, -6]} />
      <OakTree position={[-22, 0, 2]} />
      <OakTree position={[22, 0, 6]} />
      <OakTree position={[5, 0, 24]} />
    </group>
  );
}

function GltfVillage() {
  const { scene } = useGLTF(PORTFOLIO_VILLAGE_GLB);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!group.current) return;
    group.current.clear();
    const root = scene.clone(true);
    root.scale.setScalar(VILLAGE_SCALE);
    root.position.y = portfolioHeight(0, 0) - 0.5;
    root.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    group.current.add(root);
  }, [scene]);

  return (
    <group ref={group}>
      <GrassGround />
      <PortfolioRoads />
    </group>
  );
}

function VillageLoader() {
  const [hasGltf, setHasGltf] = useState(false);
  useEffect(() => {
    fetch(PORTFOLIO_VILLAGE_GLB, { method: "HEAD" })
      .then((r) => setHasGltf(r.ok))
      .catch(() => setHasGltf(false));
  }, []);
  if (hasGltf) {
    return (
      <Suspense fallback={<ProceduralVillage />}>
        <GltfVillage />
      </Suspense>
    );
  }
  return <ProceduralVillage />;
}

export function PortfolioVillage() {
  return (
    <>
      <color attach="background" args={["#78b7e8"]} />
      <fog attach="fog" args={["#9ad0f0", 40, 100]} />
      <ambientLight intensity={0.62} />
      <directionalLight
        position={[35, 55, 25]}
        intensity={1.45}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={120}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
      />
      <hemisphereLight args={["#fff8e7", "#4a7c3f", 0.5]} />
      <VillageLoader />
    </>
  );
}
