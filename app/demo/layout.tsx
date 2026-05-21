import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Talk Demo — Gamepad × R3F",
  description: "Technical talk demo: Gamepad API + React Three Fiber",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
