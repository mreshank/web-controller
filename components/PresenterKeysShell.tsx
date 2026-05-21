"use client";

import { usePresenterKeys } from "@/hooks/usePresenterKeys";

/** Enables B / C / S / N / F / H / ? on pages without full PresenterChrome. */
export function PresenterKeysShell({ children }: { children: React.ReactNode }) {
  usePresenterKeys();
  return <>{children}</>;
}
