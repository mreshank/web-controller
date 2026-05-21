"use client";

import Link from "next/link";
import { useState } from "react";

export default function BackupPage() {
  const [missing, setMissing] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-3 text-sm">
        <span className="text-white/50">Stage backup — narrate over this if live demo fails</span>
        <Link
          href="/"
          className="rounded border border-white/15 px-3 py-1 text-white/80 hover:bg-white/10"
        >
          ← Live demo
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
        {missing ? (
          <div className="max-w-lg text-center">
            <p className="text-lg font-medium">No backup video yet</p>
            <p className="mt-3 text-sm text-white/60">
              Record your demo with OBS or QuickTime, then save it as:
            </p>
            <code className="mt-2 block rounded bg-white/10 px-3 py-2 text-sm">
              public/backup-demo.mp4
            </code>
            <p className="mt-4 text-sm text-white/50">
              Reload this page. On stage: open{" "}
              <code className="text-white/70">/backup</code> or press{" "}
              <kbd className="rounded border border-white/20 px-1">B</kbd> from the
              live demo.
            </p>
          </div>
        ) : (
          <video
            className="max-h-[75vh] w-full max-w-5xl rounded-lg shadow-2xl"
            src="/backup-demo.mp4"
            controls
            autoPlay
            playsInline
            onError={() => setMissing(true)}
          />
        )}
      </main>
    </div>
  );
}
