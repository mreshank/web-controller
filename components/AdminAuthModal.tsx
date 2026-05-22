"use client";

import { useCallback, useState } from "react";
import { clearAdminSession, isAdmin, setAdminSession } from "@/lib/play/auth-client";

type AdminAuthModalProps = {
  open: boolean;
  onClose: () => void;
  onAuthed: () => void;
};

export function AdminAuthModal({ open, onClose, onAuthed }: AdminAuthModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/play/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Access denied");
        return;
      }
      setAdminSession();
      setCode("");
      onAuthed();
      onClose();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [code, onAuthed, onClose]);

  if (!open) return null;

  return (
    <div className="gp-play-modal-backdrop" role="dialog" aria-modal="true">
      <div className="gp-play-modal">
        <p className="gp-eyebrow">Presenter access</p>
        <h2 className="gp-heading" style={{ marginTop: "0.35rem" }}>
          Enter access code
        </h2>
        <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
          Unlocks private routes and the online breach launcher. Not shown on the public hub.
        </p>
        <input
          className="gp-play-input"
          type="password"
          autoComplete="off"
          placeholder="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {error ? (
          <p className="gp-play-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="gp-chrome__row" style={{ marginTop: "1rem" }}>
          <button type="button" className="gp-btn gp-btn--game" disabled={loading} onClick={submit}>
            {loading ? "Checking…" : "Unlock"}
          </button>
          <button type="button" className="gp-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
        {isAdmin() ? (
          <button
            type="button"
            className="gp-btn"
            style={{ marginTop: "0.75rem", opacity: 0.7 }}
            onClick={() => {
              clearAdminSession();
              onClose();
            }}
          >
            Sign out admin
          </button>
        ) : null}
      </div>
    </div>
  );
}
