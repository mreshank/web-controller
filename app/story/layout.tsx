import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Story World — Gamepad Journey",
  description: "Explore a 3D narrative in any order with your controller",
};

export default function StoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
