"use client";

import { Cloud, Grid, Sky, Sparkles, Stars } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { STORY_CHAPTERS } from "@/story/chapters";

/** High-contrast world tuned for projectors and dark rooms */
export function StoryEnvironment() {
  const floorRing = useMemo(() => {
    const geo = new THREE.RingGeometry(18, 22, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: "#00e8cc",
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    return { geo, mat };
  }, []);

  return (
    <>
      <color attach="background" args={["#060a14"]} />
      <fog attach="fog" args={["#060a14", 45, 95]} />

      <Sky
        distance={450000}
        sunPosition={[100, 28, 50]}
        inclination={0.55}
        azimuth={0.18}
        mieCoefficient={0.004}
        mieDirectionalG={0.92}
        turbidity={6}
        rayleigh={1.2}
      />

      {/* Brighter, denser star field — readable on projector */}
      <Stars
        radius={90}
        depth={55}
        count={16000}
        factor={7.5}
        saturation={1}
        fade={false}
        speed={0.15}
      />
      <Sparkles
        count={350}
        scale={[70, 14, 70]}
        size={2.8}
        speed={0.15}
        color="#ffffff"
        opacity={0.85}
      />

      <Cloud opacity={0.2} speed={0.15} bounds={[36, 5, 36]} segments={16} position={[0, 16, -12]} />
      <Cloud opacity={0.15} speed={0.12} bounds={[28, 4, 28]} segments={12} position={[-20, 12, 18]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[25, 40, 20]}
        intensity={1.65}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#7dd3fc", "#0f172a", 0.45]} />

      {STORY_CHAPTERS.map((ch) => (
        <pointLight
          key={ch.id}
          position={[ch.position[0], ch.position[1] + 1, ch.position[2]]}
          color={ch.color}
          intensity={2.2}
          distance={22}
        />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#1e293b"
          emissiveIntensity={0.35}
          metalness={0.15}
          roughness={0.85}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} geometry={floorRing.geo} material={floorRing.mat} />

      <Grid
        infiniteGrid
        fadeDistance={55}
        fadeStrength={0.6}
        cellSize={1}
        sectionSize={5}
        sectionColor="#00e8cc"
        sectionThickness={1.4}
        cellColor="#334155"
        cellThickness={0.6}
      />

      {/* Central landmark — orientation hub */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.9, 2.4, 8]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#818cf8"
          emissiveIntensity={1.2}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[0.55, 20, 20]} />
        <meshStandardMaterial
          color="#e0e7ff"
          emissive="#a5b4fc"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0, 4, 0]} intensity={3} color="#c7d2fe" distance={28} />
    </>
  );
}
