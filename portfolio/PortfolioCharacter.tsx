"use client";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PORTFOLIO_CHARACTER_HEIGHT, PORTFOLIO_VILLAGER_GLB } from "@/portfolio/config";
import { playFootstep } from "@/portfolio/portfolio-sounds";
import { usePortfolioPlayer } from "@/portfolio/PortfolioPlayerContext";

const VILLAGER_SCALE = 1.15;
const SKIN = "#c9a27a";
const ROBE = "#5c4a32";
const NOSE = "#3d2914";

function Limb({
  position,
  size,
  rotation,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  rotation: [number, number, number];
  color: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, -size[1] / 2, 0]} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
    </group>
  );
}

function AnimatedVillager({
  phase,
  interactPhase,
}: {
  phase: number;
  interactPhase: number;
}) {
  const walk = Math.sin(phase * 11);
  const legSwing = walk * 0.62;
  const armSwing = -walk * 0.48;
  const bob = Math.abs(Math.sin(phase * 11)) * 0.055;
  const reach = interactPhase * 1.1;
  const armForward = -reach * 1.35 + (1 - interactPhase) * armSwing;

  return (
    <group position={[0, bob, 0]}>
      <mesh position={[0, 0.58, 0]} castShadow>
        <boxGeometry args={[0.54, 0.76, 0.4]} />
        <meshStandardMaterial color={ROBE} roughness={0.88} />
      </mesh>
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.46, 0.46, 0.46]} />
        <meshStandardMaterial color={SKIN} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.1, 0.25]} castShadow>
        <boxGeometry args={[0.14, 0.2, 0.16]} />
        <meshStandardMaterial color={NOSE} />
      </mesh>
      <Limb
        position={[-0.36, 0.92, 0]}
        size={[0.16, 0.58, 0.16]}
        rotation={[armForward, 0, 0.12]}
        color={ROBE}
      />
      <Limb
        position={[0.36, 0.92, 0]}
        size={[0.16, 0.58, 0.16]}
        rotation={[armForward, 0, -0.12]}
        color={ROBE}
      />
      <Limb
        position={[-0.15, 0.38, 0]}
        size={[0.2, 0.46, 0.2]}
        rotation={[legSwing, 0, 0]}
        color={ROBE}
      />
      <Limb
        position={[0.15, 0.38, 0]}
        size={[0.2, 0.46, 0.2]}
        rotation={[-legSwing, 0, 0]}
        color={ROBE}
      />
      {interactPhase > 0.2 ? (
        <group position={[0.42, 1.0, 0.35 + interactPhase * 0.25]} rotation={[0, 0, -0.3]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.28, 0.12]} />
            <meshStandardMaterial
              color="#ffcc55"
              emissive="#ffaa22"
              emissiveIntensity={interactPhase * 2}
            />
          </mesh>
        </group>
      ) : null}
    </group>
  );
}

function GltfVillager({
  phase,
  interactPhase,
}: {
  phase: number;
  interactPhase: number;
}) {
  const { scene } = useGLTF(PORTFOLIO_VILLAGER_GLB);
  const root = useRef<THREE.Group>(null);
  const cloned = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const mount = root.current;
    if (!mount || cloned.current) return;
    cloned.current = scene.clone(true);
    cloned.current.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    mount.add(cloned.current);
  }, [scene]);

  useFrame(() => {
    if (!root.current) return;
    const walkBob = Math.abs(Math.sin(phase * 11)) * 0.04;
    root.current.position.y = walkBob;
    root.current.rotation.x = -interactPhase * 0.15;
  });

  return <group ref={root} scale={VILLAGER_SCALE} />;
}

function VillagerInner() {
  const [hasGltf, setHasGltf] = useState(false);
  const phaseRef = useRef(0);
  const { walking, interacting, interactPhase } = usePortfolioPlayer();
  const lastFoot = useRef(0);

  useEffect(() => {
    fetch(PORTFOLIO_VILLAGER_GLB, { method: "HEAD" })
      .then((r) => setHasGltf(r.ok))
      .catch(() => setHasGltf(false));
  }, []);

  useFrame((_, dt) => {
    const target = interacting.current ? 1 : 0;
    interactPhase.current = THREE.MathUtils.lerp(interactPhase.current, target, dt * 6);

    if (walking.current && !interacting.current) {
      phaseRef.current += dt;
      lastFoot.current += dt;
      if (lastFoot.current > 0.34) {
        lastFoot.current = 0;
        playFootstep();
      }
    } else {
      lastFoot.current = 0;
    }
  });

  const phase = phaseRef.current;
  const ip = interactPhase.current;

  if (hasGltf) {
    return (
      <Suspense fallback={<AnimatedVillager phase={phase} interactPhase={ip} />}>
        <GltfVillager phase={phase} interactPhase={ip} />
      </Suspense>
    );
  }
  return <AnimatedVillager phase={phase} interactPhase={ip} />;
}

export function PortfolioCharacter() {
  const groupRef = useRef<THREE.Group>(null);
  const { position, yaw } = usePortfolioPlayer();

  useFrame(() => {
    if (!groupRef.current) return;
    const p = position.current;
    groupRef.current.position.set(p.x, p.y, p.z);
    groupRef.current.rotation.y = yaw.current;
  });

  return (
    <group ref={groupRef}>
      <group position={[0, PORTFOLIO_CHARACTER_HEIGHT * 0.02, 0]}>
        <VillagerInner />
      </group>
    </group>
  );
}
