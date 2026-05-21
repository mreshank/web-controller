"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { KeyboardHelp } from "@/components/KeyboardHelp";
import { PresenterNotes } from "@/components/PresenterNotes";
import { usePresenterKeys } from "@/hooks/usePresenterKeys";

type PresenterChromeProps = {
  variant?: "live" | "naive";
};

export function PresenterChrome({ variant = "live" }: PresenterChromeProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const toggleNotes = useCallback(() => setNotesOpen((v) => !v), []);
  const toggleHelp = useCallback(() => setHelpOpen((v) => !v), []);

  const { chromeHidden } = usePresenterKeys({
    onToggleNotes: toggleNotes,
    onToggleHelp: toggleHelp,
  });

  if (chromeHidden) {
    return (
      <>
        <PresenterNotes open={notesOpen} onClose={() => setNotesOpen(false)} />
        <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
        <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 text-[9px] text-white/25">
          Press H to show controls
        </p>
      </>
    );
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5 text-[10px]">
        <div className="flex flex-wrap justify-end gap-1.5">
          <Link
            href="/rehearse"
            className="rounded border border-violet-500/30 bg-violet-950/40 px-2 py-1 text-violet-100/90 backdrop-blur transition hover:border-violet-400/50"
          >
            Rehearse (R)
          </Link>
          <Link
            href="/stage"
            className="rounded border border-white/10 bg-black/60 px-2 py-1 text-white/70 backdrop-blur transition hover:border-white/25 hover:text-white"
          >
            Stage (S)
          </Link>
          <Link
            href="/code"
            className="rounded border border-cyan-500/30 bg-cyan-950/40 px-2 py-1 text-cyan-100/90 backdrop-blur transition hover:border-cyan-400/50"
          >
            Code (C)
          </Link>
          <Link
            href="/backup"
            className="rounded border border-white/10 bg-black/60 px-2 py-1 text-white/70 backdrop-blur transition hover:border-white/25 hover:text-white"
          >
            Backup (B)
          </Link>
          <button
            type="button"
            onClick={toggleNotes}
            className="rounded border border-white/10 bg-black/60 px-2 py-1 text-white/70 backdrop-blur transition hover:border-white/25 hover:text-white"
          >
            Notes (N)
          </button>
          <button
            type="button"
            onClick={toggleHelp}
            className="rounded border border-white/10 bg-black/60 px-2 py-1 text-white/70 backdrop-blur transition hover:border-white/25 hover:text-white"
          >
            Keys (?)
          </button>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5 text-white/40">
          {variant === "live" ? (
            <>
              <Link
                href="/game"
                className="rounded border border-fuchsia-500/30 bg-fuchsia-950/40 px-2 py-0.5 text-fuchsia-200/80 hover:border-fuchsia-400/50"
              >
                Game →
              </Link>
              <Link
                href="/naive"
                className="rounded border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 text-amber-200/80 hover:border-amber-400/50"
              >
                Naive →
              </Link>
            </>
          ) : (
            <Link
              href="/demo"
              className="rounded border border-green-500/30 bg-green-950/40 px-2 py-0.5 text-green-200/80 hover:border-green-400/50"
            >
              ← Talk demo
            </Link>
          )}
          <span className="px-1 py-0.5">F fullscreen · H hide</span>
        </div>
      </div>

      <PresenterNotes open={notesOpen} onClose={() => setNotesOpen(false)} />
      <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
