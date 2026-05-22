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
        <p className="gp-hide-chrome-hint">Press H to show controls</p>
      </>
    );
  }

  return (
    <>
      <div className="gp-chrome">
        <div className="gp-chrome__row">
          <Link href="/" className="gp-btn gp-btn--ghost">
            Hub
          </Link>
          <Link href="/rehearse" className="gp-btn">
            Rehearse
          </Link>
          <Link href="/stage" className="gp-btn">
            Stage
          </Link>
          <Link href="/code" className="gp-btn gp-btn--accent">
            Code
          </Link>
          <Link href="/backup" className="gp-btn">
            Backup
          </Link>
          <button type="button" className="gp-btn" onClick={toggleNotes}>
            Notes
          </button>
          <button type="button" className="gp-btn" onClick={toggleHelp}>
            Keys
          </button>
        </div>
        <div className="gp-chrome__row">
          {variant === "live" ? (
            <>
              <Link href="/game" className="gp-btn gp-btn--game">
                Game →
              </Link>
              <Link href="/naive" className="gp-btn gp-btn--naive">
                Naive →
              </Link>
            </>
          ) : (
            <Link href="/demo" className="gp-btn gp-btn--accent">
              ← Talk demo
            </Link>
          )}
          <span className="gp-chrome__hint">F fullscreen · H hide</span>
        </div>
      </div>

      <PresenterNotes open={notesOpen} onClose={() => setNotesOpen(false)} />
      <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
