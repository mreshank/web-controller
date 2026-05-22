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
      className="gp-help-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="gp-help"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Keyboard shortcuts"
      >
        <p className="gp-help__title">Presenter shortcuts</p>
        <ul className="gp-kbd-list">
          {PRESENTER_SHORTCUTS.map((s) => (
            <li key={s.key}>
              <kbd className="gp-kbd">{s.key}</kbd>
              <span>{s.action}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="gp-btn gp-btn--block"
          style={{ marginTop: "1rem" }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
