"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { PORTFOLIO_BEACONS } from "@/portfolio/data";
import { mcMaterial, MC_TEX } from "@/portfolio/minecraft-textures";
import { portfolioHeight } from "@/portfolio/terrain";

const ROAD_ORDER = [
  "intro",
  "about",
  "work",
  "skills",
  "projects",
  "meta",
  "contact",
] as const;

const ROAD_W = 3.2;
const BORDER_W = 0.45;

function roadY(x: number, z: number) {
  return portfolioHeight(x, z) + 0.06;
}

function RoadSegment({
  from,
  to,
  cobble,
  plank,
  brick,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  cobble: THREE.MeshStandardMaterial;
  plank: THREE.MeshStandardMaterial;
  brick: THREE.MeshStandardMaterial;
}) {
  const mid = from.clone().add(to).multiplyScalar(0.5);
  const len = from.distanceTo(to);
  const angle = Math.atan2(to.x - from.x, to.z - from.z);

  if (len < 0.5) return null;

  const posts = Math.max(1, Math.floor(len / 4));

  return (
    <group position={[mid.x, roadY(mid.x, mid.z), mid.z]} rotation={[0, angle, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[ROAD_W, 0.14, len + 0.2]} />
        <meshStandardMaterial map={cobble.map} roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[-(ROAD_W / 2 + BORDER_W / 2), 0.02, 0]}>
        <boxGeometry args={[BORDER_W, 0.16, len + 0.3]} />
        <meshStandardMaterial map={brick.map} roughness={0.95} />
      </mesh>
      <mesh receiveShadow position={[ROAD_W / 2 + BORDER_W / 2, 0.02, 0]}>
        <boxGeometry args={[BORDER_W, 0.16, len + 0.3]} />
        <meshStandardMaterial map={brick.map} roughness={0.95} />
      </mesh>
      {Array.from({ length: posts }, (_, i) => {
        const t = (i + 0.5) / posts - 0.5;
        const z = t * len;
        return (
          <group key={i} position={[0, 0.1, z]}>
            <mesh position={[-(ROAD_W / 2 + 0.35), 0, 0]} castShadow>
              <boxGeometry args={[0.2, 0.55, 0.2]} />
              <meshStandardMaterial map={plank.map} roughness={0.95} />
            </mesh>
            <mesh position={[ROAD_W / 2 + 0.35, 0, 0]} castShadow>
              <boxGeometry args={[0.2, 0.55, 0.2]} />
              <meshStandardMaterial map={plank.map} roughness={0.95} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Junction({
  pos,
  cobble,
}: {
  pos: [number, number, number];
  cobble: THREE.MeshStandardMaterial;
}) {
  const y = roadY(pos[0], pos[2]);
  return (
    <mesh position={[pos[0], y, pos[2]]} receiveShadow>
      <boxGeometry args={[ROAD_W + 0.8, 0.15, ROAD_W + 0.8]} />
      <meshStandardMaterial map={cobble.map} roughness={0.95} />
    </mesh>
  );
}

export function PortfolioRoads() {
  const cobble = useMemo(() => mcMaterial(MC_TEX.cobble, [4, 4]), []);
  const plank = useMemo(() => mcMaterial(MC_TEX.oakPlanks, [1, 1]), []);
  const brick = useMemo(() => mcMaterial(MC_TEX.stoneBrick, [2, 2]), []);

  const points = useMemo(() => {
    return ROAD_ORDER.map((id) => {
      const b = PORTFOLIO_BEACONS.find((x) => x.id === id)!;
      return new THREE.Vector3(b.position[0], 0, b.position[2]);
    });
  }, []);

  return (
    <group>
      {points.map((p) => (
        <Junction key={`j-${p.x}-${p.z}`} pos={[p.x, 0, p.z]} cobble={cobble} />
      ))}
      {points.slice(0, -1).map((from, i) => (
        <RoadSegment
          key={`seg-${i}`}
          from={from}
          to={points[i + 1]!}
          cobble={cobble}
          plank={plank}
          brick={brick}
        />
      ))}
      <RoadSegment
        from={points[points.length - 1]!}
        to={points[0]!}
        cobble={cobble}
        plank={plank}
        brick={brick}
      />
    </group>
  );
}
