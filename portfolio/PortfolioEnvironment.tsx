"use client";

import { Grid, Sky, Sparkles, Stars } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";
import { PORTFOLIO_WORLD_HALF } from "@/portfolio/config";
import { portfolioHeight } from "@/portfolio/terrain";

function Terrain() {
  const geometry = useMemo(() => {
    const seg = 56;
    const geo = new THREE.PlaneGeometry(
      PORTFOLIO_WORLD_HALF * 2.1,
      PORTFOLIO_WORLD_HALF * 2.1,
      seg,
      seg
    );
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const cBase = new THREE.Color("#0a1220");
    const cPath = new THREE.Color("#1a2d4a");
    const cGlow = new THREE.Color("#1e4a6a");

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const h = portfolioHeight(x, z);
      pos.setY(i, h);
      const dist = Math.sqrt(x * x + z * z);
      const c = new THREE.Color();
      if (dist < 4) c.copy(cGlow);
      else if (dist < 22) c.copy(cPath);
      else c.copy(cBase);
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
      <meshStandardMaterial vertexColors roughness={0.88} metalness={0.12} />
    </mesh>
  );
}

function Monolith() {
  return (
    <group position={[0, portfolioHeight(0, 0), 0]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <boxGeometry args={[2.2, 3.6, 0.35]} />
        <meshStandardMaterial
          color="#1eaedb"
          emissive="#1eaedb"
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 2.2, 0.2]}>
        <boxGeometry args={[1.8, 0.5, 0.05]} />
        <meshStandardMaterial color="#e0f2fe" emissive="#7dd3fc" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function PathMarkers() {
  return (
    <>
      {PORTFOLIO_BEACONS.map((b) => {
        const y = portfolioHeight(b.position[0], b.position[2]);
        return (
          <mesh
            key={b.id}
            position={[b.position[0], y + 0.03, b.position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.35, 0.55, 24]} />
            <meshBasicMaterial color="#1eaedb" transparent opacity={0.25} />
          </mesh>
        );
      })}
    </>
  );
}

export function PortfolioEnvironment() {
  return (
    <>
      <color attach="background" args={["#050810"]} />
      <fog attach="fog" args={["#050810", 28, 75]} />
      <Sky
        distance={450000}
        sunPosition={[60, 25, 40]}
        inclination={0.5}
        azimuth={0.2}
        turbidity={5}
      />
      <Stars radius={80} depth={45} count={9000} factor={5.5} saturation={0.9} fade={false} speed={0.1} />
      <Sparkles count={80} scale={[50, 8, 50]} size={2} color="#1eaedb" />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[20, 35, 15]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#7dd3fc", "#0f172a", 0.35]} />
      <Terrain />
      <Monolith />
      <PathMarkers />
      <Grid
        infiniteGrid
        fadeDistance={45}
        sectionColor="#1eaedb"
        cellColor="#1e293b"
        sectionThickness={1}
      />
      {PORTFOLIO_BEACONS.map((b) => (
        <pointLight
          key={b.id}
          position={[
            b.position[0],
            portfolioHeight(b.position[0], b.position[2]) + 2,
            b.position[2],
          ]}
          color={b.color}
          intensity={1.8}
          distance={16}
        />
      ))}
    </>
  );
}
