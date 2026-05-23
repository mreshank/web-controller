import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio Walk — Eshank Tyagi",
  description: "Minecraft-style village portfolio with gamepad navigation",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
