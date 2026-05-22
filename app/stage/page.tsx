import Link from "next/link";
import { TALK_TITLE } from "@/lib/talk-outline";

const STAGE_ROUTES = [
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

export default function StagePage() {
  return (
    <div className="gp-page">
      <div className="gp-container">
        <p className="gp-eyebrow">Stage launcher</p>
        <h1 className="gp-display" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
          {TALK_TITLE}
        </h1>
        <p className="gp-lead">
          Bookmark before you go on stage. Flow: Demo → Naive → Code → Game finale →
          Q&A.
        </p>

        <ul className="gp-stage-grid">
          {STAGE_ROUTES.map((route) => (
            <li key={route.href}>
              <Link href={route.href} className={`gp-stage-card ${route.mod}`}>
                <span className="gp-card__title">{route.label}</span>
                <span className="gp-card__desc">{route.desc}</span>
                {route.keys ? (
                  <span className="gp-mono" style={{ display: "block", marginTop: "0.75rem", fontSize: "0.62rem", color: "var(--gp-text-faint)" }}>
                    {route.keys}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="gp-panel gp-panel--callout" style={{ marginTop: "2.5rem" }}>
          <p className="gp-heading" style={{ fontSize: "1rem" }}>
            Day-of checklist
          </p>
          <ul className="gp-drawer__list" style={{ marginTop: "0.75rem" }}>
            <li>Test projector + HDMI at venue</li>
            <li>Press button on controller before each route</li>
            <li>backup-demo.mp4 ready · tab on /backup</li>
            <li>Saturday: no code changes</li>
          </ul>
        </div>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/" className="gp-btn">
            ← Hub
          </Link>
        </p>
      </div>
    </div>
  );
}
