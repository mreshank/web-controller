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
    <div className="gp-page" style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
      <header className="gp-page-header">
        <span className="gp-lead" style={{ margin: 0 }}>
          Stage backup — narrate if live demo fails
        </span>
        <div className="gp-page-header__actions">
          <button type="button" className="gp-btn" onClick={replay}>
            Replay
          </button>
          <Link href="/demo" className="gp-btn gp-btn--accent">
            Talk demo
          </Link>
          <Link href="/stage" className="gp-btn">
            Stage
          </Link>
        </div>
      </header>

      <main className="gp-video-stage">
        {missing ? (
          <div className="gp-modal" style={{ maxWidth: "28rem", textAlign: "center" }}>
            <p className="gp-heading">No backup video yet</p>
            <p className="gp-modal__body">
              Record your demo, then save as{" "}
              <code className="gp-mono">public/backup-demo.mp4</code>
            </p>
          </div>
        ) : (
          <video
            ref={videoRef}
            className="gp-video"
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
