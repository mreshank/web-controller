"use client";

import { PRESENTER_SHORTCUTS } from "@/lib/talk-outline";

type KeyboardHelpProps = {
  open: boolean;
  onClose: () => void;
};

export function KeyboardHelp({ open, onClose }: KeyboardHelpProps) {
  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-w-sm rounded-xl border border-white/15 bg-slate-900 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Keyboard shortcuts"
      >
        <p className="text-sm font-medium text-white">Presenter shortcuts</p>
        <ul className="mt-3 space-y-2 font-mono text-xs">
          {PRESENTER_SHORTCUTS.map((s) => (
            <li key={s.key} className="flex gap-3 text-white/80">
              <kbd className="min-w-8 rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-center text-white">
                {s.key}
              </kbd>
              <span className="text-white/60">{s.action}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded border border-white/15 py-1.5 text-xs text-white/70 hover:bg-white/10"
        >
          Close (?)
        </button>
      </div>
    </div>
  );
}
