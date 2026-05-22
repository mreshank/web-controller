"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminAuthModal } from "@/components/AdminAuthModal";
import { isAdmin } from "@/lib/play/auth-client";
import { ADMIN_ONLY_ROUTES } from "@/lib/play/private-routes";

const PUBLIC_STAGE_ROUTES = [
  {
    href: "/rehearse",
    label: "Rehearsal timer",
    mod: "gp-stage-card--violet",
    desc: "25-min timed run-through with section links and Q&A cheatsheet.",
    keys: "Space next · P pause",
  },
  {
    href: "/game",
    label: "Orb Rush (finale)",
    mod: "gp-stage-card--fuchsia",
    desc: "4-player 3D arena — end the talk here if you can.",
    keys: "",
  },
  {
    href: "/story",
    label: "Story World",
    mod: "gp-stage-card--violet",
    desc: "Fly through narrative beacons in any order.",
    keys: "",
  },
  {
    href: "/demo",
    label: "Talk demo",
    mod: "gp-stage-card--green",
    desc: "Technical demo: one poll loop, multi-slot HUD.",
    keys: "N notes · B backup",
  },
  {
    href: "/html5/index.html",
    label: "HTML5 lab",
    mod: "gp-stage-card--amber",
    desc: "Vanilla zero-build demos.",
    keys: "serve html5/ on :3333",
  },
  {
    href: "/naive",
    label: "Naive demo",
    mod: "gp-stage-card--slate",
    desc: "Anti-pattern: 2 RAF loops.",
    keys: "",
  },
  {
    href: "/code",
    label: "Code walkthrough",
    mod: "gp-stage-card--cyan",
    desc: "Live source tabs for the architecture section.",
    keys: "",
  },
  {
    href: "/backup",
    label: "Backup video",
    mod: "gp-stage-card--rose",
    desc: "Pre-recorded fallback if live demo fails.",
    keys: "public/backup-demo.mp4",
  },
] as const;

export function StageRouteList() {
  const [admin, setAdmin] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, []);

  const routes = admin
    ? [...PUBLIC_STAGE_ROUTES, ...ADMIN_ONLY_ROUTES]
    : PUBLIC_STAGE_ROUTES;

  return (
    <>
      {!admin ? (
        <p className="gp-hud__meta" style={{ marginBottom: "1rem" }}>
          Private launcher entries hidden.{" "}
          <button type="button" className="gp-chip" onClick={() => setModal(true)}>
            Authenticate
          </button>
        </p>
      ) : null}
      <ul className="gp-stage-grid">
        {routes.map((route) => (
          <li key={route.href}>
            <Link href={route.href} className={`gp-stage-card ${route.mod}`}>
              <span className="gp-card__title">{route.label}</span>
              <span className="gp-card__desc">{route.desc}</span>
              {route.keys ? (
                <span
                  className="gp-mono"
                  style={{
                    display: "block",
                    marginTop: "0.75rem",
                    fontSize: "0.62rem",
                    color: "var(--gp-text-faint)",
                  }}
                >
                  {route.keys}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
      <AdminAuthModal
        open={modal}
        onClose={() => setModal(false)}
        onAuthed={() => setAdmin(true)}
      />
    </>
  );
}
