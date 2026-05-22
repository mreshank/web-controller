"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";

const EXPERIENCES = [
  {
    href: "/game",
    title: "Orb Rush",
    tag: "Finale",
    desc: "Up to four controllers. One 3D arena. Collect orbs. Let the room play.",
    mod: "gp-card--game",
  },
  {
    href: "/story",
    title: "Story World",
    tag: "Explore",
    desc: "Fly between narrative beacons in any order — your path through the web.",
    mod: "gp-card--story",
  },
  {
    href: "/demo",
    title: "Talk Demo",
    tag: "Engineering",
    desc: "Gamepad API + React Three Fiber. One poll loop, refs, multi-slot HUD.",
    mod: "gp-card--demo",
  },
  {
    href: "/html5/index.html",
    title: "HTML5 Lab",
    tag: "Zero build",
    desc: "Vanilla HTML/CSS/JS. Same API, no framework — maximum ROI per line.",
    mod: "gp-card--html5",
  },
] as const;

const TOOLS = [
  { href: "/stage", label: "Stage hub" },
  { href: "/rehearse", label: "Rehearsal" },
  { href: "/code", label: "Code" },
  { href: "/naive", label: "Naive loops" },
  { href: "/backup", label: "Backup" },
] as const;

export function HubPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = contentRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    el.style.transform = `translate3d(${x * 12}px, ${y * 8}px, 24px)`;
  }, []);

  const onLeave = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.style.transform = "translate3d(0, 0, 0)";
    }
  }, []);

  return (
    <div className="gp-parallax" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="gp-parallax__bg" aria-hidden />
      <div className="gp-parallax__grid" aria-hidden />
      <div className="gp-parallax__orb gp-parallax__orb--a" aria-hidden />
      <div className="gp-parallax__orb gp-parallax__orb--b" aria-hidden />

      <div
        ref={contentRef}
        className="gp-parallax__content"
        data-depth="content"
      >
        <div className="gp-container">
          <p className="gp-eyebrow">Gamepad × HTML5 × Open Web</p>
          <h1 className="gp-display">
            The browser is a game engine.
            <span className="gp-display__sub">
              Plug in hardware. Press start. Ship experiences people remember.
            </span>
          </h1>
          <p className="gp-lead">
            Four runtime modes — technical demo, multiplayer arena, explorable
            story, and vanilla labs — all driven by the same Gamepad API. One
            stylesheet powers the entire surface.
          </p>

          <ul className="gp-card-grid">
            {EXPERIENCES.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className={`gp-card ${e.mod}`}>
                  <span className="gp-card__tag">{e.tag}</span>
                  <span className="gp-card__title">{e.title}</span>
                  <span className="gp-card__desc">{e.desc}</span>
                </Link>
              </li>
            ))}
          </ul>

          <section style={{ marginTop: "3rem" }}>
            <p className="gp-section-label">Presenter tools</p>
            <div className="gp-chips">
              {TOOLS.map((t) => (
                <Link key={t.href} href={t.href} className="gp-chip">
                  {t.label}
                </Link>
              ))}
            </div>
          </section>

          <p
            className="gp-mono"
            style={{
              marginTop: "2.5rem",
              fontSize: "0.72rem",
              color: "var(--gp-text-faint)",
            }}
          >
            Stylesheet:{" "}
            <a
              href="https://static.mreshank.com/gamepad/styles.css"
              target="_blank"
              rel="noreferrer"
            >
              static.mreshank.com/gamepad/styles.css
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
