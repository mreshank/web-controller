"use client";

import { Cloud, Sky } from "@react-three/drei";
import { PortfolioVillage } from "@/portfolio/PortfolioVillage";

export function PortfolioEnvironment() {
  return (
    <>
      <Sky sunPosition={[80, 40, 60]} turbidity={4} rayleigh={0.4} />
      <Cloud
        opacity={0.35}
        speed={0.25}
        bounds={[20, 4, 20]}
        segments={12}
        position={[0, 22, -10]}
      />
      <PortfolioVillage />
    </>
  );
}
