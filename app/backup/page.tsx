"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { KeyboardHelp } from "@/components/KeyboardHelp";
import { usePresenterKeys } from "@/hooks/usePresenterKeys";

export default function BackupPage() {
  const [missing, setMissing] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const toggleHelp = useCallback(() => setHelpOpen((v) => !v), []);
  usePresenterKeys({ onToggleHelp: toggleHelp });

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 text-sm sm:px-6">
        <span className="text-white/50">Stage backup — narrate over this if live demo fails</span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={replay}
            className="rounded border border-white/15 px-3 py-1 hover:bg-white/10"
          >
            Replay
          </button>
          <Link
            href="/demo"
            className="rounded border border-green-500/30 bg-green-950/40 px-3 py-1 text-green-200/90 hover:border-green-400/50"
          >
            Talk demo
          </Link>
          <Link
            href="/stage"
            className="rounded border border-white/15 px-3 py-1 text-white/80 hover:bg-white/10"
          >
            Stage hub
          </Link>
        </div>
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
              Tip: record with controller visible + HUD on screen. Reload this page
              after adding the file.
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="max-h-[80vh] w-full max-w-5xl rounded-lg shadow-2xl"
            src="/backup-demo.mp4"
            controls
            autoPlay
            muted
            loop
            playsInline
            onError={() => setMissing(true)}
          />
        )}
      </main>
      <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
