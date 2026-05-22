import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexus Breach",
  description: "Live multiplayer vault run",
};

export const dynamic = "force-dynamic";

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
