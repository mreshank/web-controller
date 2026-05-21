"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function PresenterChrome() {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "b" || e.key === "B") {
        router.push("/backup");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 text-[10px] text-white/50">
      <Link
        href="/backup"
        className="rounded border border-white/10 bg-black/60 px-2 py-1 text-white/70 backdrop-blur transition hover:border-white/25 hover:text-white"
      >
        Backup demo (B)
      </Link>
    </div>
  );
}
