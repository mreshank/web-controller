import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orb Rush — Gamepad Arena",
  description: "Multi-controller 3D game in the browser",
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
