"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PresenterKeysOptions = {
  onToggleNotes?: () => void;
  onToggleHelp?: () => void;
  onToggleHideChrome?: () => void;
};

export function usePresenterKeys({
  onToggleNotes,
  onToggleHelp,
  onToggleHideChrome,
}: PresenterKeysOptions = {}) {
  const router = useRouter();
  const [hidden, setHidden] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "b":
        case "B":
          router.push("/backup");
          break;
        case "n":
        case "N":
          onToggleNotes?.();
          break;
        case "f":
        case "F":
          e.preventDefault();
          void toggleFullscreen();
          break;
        case "h":
        case "H":
          setHidden((v) => !v);
          onToggleHideChrome?.();
          break;
        case "?":
          onToggleHelp?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, onToggleNotes, onToggleHelp, onToggleHideChrome, toggleFullscreen]);

  return { chromeHidden: hidden, setChromeHidden: setHidden };
}
