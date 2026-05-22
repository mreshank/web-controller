"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminAuthModal } from "@/components/AdminAuthModal";
import { isAdmin } from "@/lib/play/auth-client";
import { PRIVATE_TOOL_CHIPS } from "@/lib/play/private-routes";

export function HubPresenterTools() {
  const [admin, setAdmin] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const onAuthed = useCallback(() => setAdmin(true), []);

  if (!admin) {
    return (
      <section style={{ marginTop: "3rem" }}>
        <p className="gp-section-label">Presenter tools</p>
        <p className="gp-hud__meta gp-play-admin-unlock">
          Hidden until authenticated.{" "}
          <button type="button" className="gp-chip" onClick={() => setModal(true)}>
            Unlock
          </button>
        </p>
        <AdminAuthModal open={modal} onClose={() => setModal(false)} onAuthed={onAuthed} />
      </section>
    );
  }

  return (
    <section style={{ marginTop: "3rem" }}>
      <p className="gp-section-label">Presenter tools</p>
      <div className="gp-chips">
        {PRIVATE_TOOL_CHIPS.map((t) => (
          <Link key={t.href} href={t.href} className="gp-chip">
            {t.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
