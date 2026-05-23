"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGamepad } from "@/hooks/useGamepad";

const DEMOS = [
  {
    href: "/vanilla/focus-navigator.html",
    tag: "Accessibility",
    title: "Focus Navigator",
    desc: "Stick moves focus between buttons — smart-TV / kiosk UI.",
    featured: true,
  },
  {
    href: "/vanilla/css-vars-studio.html",
    tag: "CSS",
    title: "CSS Variables Studio",
    desc: "Sticks drive custom properties — live theme without React.",
  },
  {
    href: "/vanilla/scroll-pilot.html",
    tag: "DOM",
    title: "Scroll Pilot",
    desc: "Right stick scrolls the page — deck / long-read mode.",
  },
  {
    href: "/vanilla/pad-sequencer.html",
    tag: "Audio UI",
    title: "Pad Sequencer",
    desc: "Face buttons trigger a grid — rhythm / launcher pad.",
  },
  {
    href: "/vanilla/dom-puppet.html",
    tag: "Transform",
    title: "DOM Puppet",
    desc: "Move, rotate, scale any card with sticks + triggers.",
  },
  {
    href: "/vanilla/svg-sketch.html",
    tag: "SVG",
    title: "SVG Sketch",
    desc: "Draw vector lines — left stick + color buttons.",
  },
  {
    href: "/vanilla/media-remote.html",
    tag: "Product",
    title: "Media Remote",
    desc: "Netflix-style UI — navigate tiles, play with ×.",
  },
  {
    href: "/vanilla/page-deck.html",
    tag: "Talks",
    title: "Page Deck",
    desc: "Fullscreen slides — stick flips your presentation.",
  },
  {
    href: "/vanilla/slots-dashboard.html",
    tag: "API",
    title: "Slots Dashboard",
    desc: "All four browser slots live — never assume index 0.",
  },
] as const;

const COLS = 3;
const COLS_NARROW = 2;

function gridCols() {
  if (typeof window === "undefined") return COLS_NARROW;
  return window.matchMedia("(min-width: 900px)").matches ? COLS : COLS_NARROW;
}

export function VanillaLabPage() {
  const [focusIdx, setFocusIdx] = useState(0);
  const [navIdx, setNavIdx] = useState(0);
  const [cols, setCols] = useState(COLS_NARROW);
  const [status, setStatus] = useState(
    "Press any button on your controller…"
  );
  const prevA = useRef(false);
  const prevB = useRef(false);
  const prevL1 = useRef(false);
  const prevR1 = useRef(false);
  const stickCooldown = useRef(0);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const update = () => setCols(gridCols());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      window.location.href = href;
    },
    []
  );

  useGamepad((s) => {
    setStatus(
      s?.connected
        ? `Connected: ${s.id}`
        : "Press any button on your controller…"
    );

    if (s?.connected) {
      if (s.buttons[9] && !prevL1.current) navigate("/");
      if (s.buttons[8] && !prevR1.current) navigate("/vanilla");
      if (s.buttons[1] && !prevB.current) navigate("/");
      prevL1.current = s.buttons[9];
      prevR1.current = s.buttons[8];
      prevB.current = s.buttons[1];

      const a = s.buttons[0];
      if (a && !prevA.current) {
        const href = DEMOS[focusIdx]?.href;
        if (href) navigate(href);
      }
      prevA.current = a;
    } else {
      prevL1.current = false;
      prevR1.current = false;
      prevB.current = false;
      prevA.current = false;
    }

    if (!s?.connected) return;

    const now = performance.now();
    if (now < stickCooldown.current) return;

    {
      const ax = Math.abs(s.leftStick.x) > Math.abs(s.leftStick.y) ? s.leftStick.x : 0;
      const ay =
        Math.abs(s.leftStick.y) >= Math.abs(s.leftStick.x) ? s.leftStick.y : 0;
      if (Math.hypot(ax, ay) > 0.55) {
        stickCooldown.current = now + 180;
        const row = Math.floor(focusIdx / cols);
        const col = focusIdx % cols;
        let nr = row;
        let nc = col;
        if (ax < -0.55) nc = Math.max(0, col - 1);
        if (ax > 0.55) nc = Math.min(cols - 1, col + 1);
        if (ay < -0.55) nr = Math.max(0, row - 1);
        if (ay > 0.55)
          nr = Math.min(Math.ceil(DEMOS.length / cols) - 1, row + 1);
        const next = Math.min(DEMOS.length - 1, Math.max(0, nr * cols + nc));
        setFocusIdx(next);
        cardRefs.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  });

  return (
    <div className="gp-page gp-vanilla gp-vanilla--chromed">
      <header className="gp-vanilla-chrome" id="gp-vanilla-chrome">
        <div className="gp-vanilla-chrome__inner">
          <nav className="gp-vanilla-chrome__crumbs" aria-label="Lab navigation">
            <Link
              href="/"
              className={`gp-vanilla-chrome__crumb${navIdx === 0 ? " is-focus" : ""}`}
              onMouseEnter={() => setNavIdx(0)}
            >
              Hub
            </Link>
            <span className="gp-vanilla-chrome__sep" aria-hidden>
              /
            </span>
            <Link
              href="/vanilla"
              className={`gp-vanilla-chrome__crumb${navIdx === 1 ? " is-focus" : ""}`}
              onMouseEnter={() => setNavIdx(1)}
            >
              Vanilla Lab
            </Link>
            <span className="gp-vanilla-chrome__sep" aria-hidden>
              /
            </span>
            <span className="gp-vanilla-chrome__current">Index</span>
          </nav>
          <p
            className={`gp-vanilla-chrome__status${status.includes("Connected") ? " is-ok" : ""}`}
          >
            {status}
          </p>
          <p className="gp-vanilla-chrome__hint">
            <span className="gp-vanilla-chrome__pill">Start</span> Hub
            <span className="gp-vanilla-chrome__pill">Select</span> Lab
            <span className="gp-vanilla-chrome__pill">Stick</span> pick demo
            <span className="gp-vanilla-chrome__pill">×</span> open
            <span className="gp-vanilla-chrome__pill">○</span> Hub
          </p>
        </div>
      </header>

      <div className="gp-container">
        <p className="gp-badge">Vanilla Web Dev Lab</p>
        <h1
          className="gp-display"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}
        >
          HTML + CSS + JS + Controller
        </h1>
        <p className="gp-lead">
          Nine minimal demos — same Gamepad API, zero React. Each file is one
          product pattern you can copy into real apps. Uses{" "}
          <code className="gp-mono">/html5/gamepad.js</code> + shared stylesheet.
        </p>
        <div className="gp-serve">
          <span>
            Static mirror:{" "}
            <Link href="/vanilla/index.html">/vanilla/index.html</Link>
            {" · "}
            <code className="gp-mono">npx serve . -p 3340</code>
          </span>
        </div>

        <ul className="gp-card-grid gp-card-grid--lab">
          {DEMOS.map((d, i) => (
            <li key={d.href}>
              <Link
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                href={d.href}
                className={`gp-card gp-card--vanilla${"featured" in d && d.featured ? " is-featured" : ""}${focusIdx === i ? " is-focus" : ""}`}
              >
                {"featured" in d && d.featured ? (
                  <span className="gp-card__tag">Featured</span>
                ) : null}
                <span className="gp-card__tag">{d.tag}</span>
                <span className="gp-card__title">{d.title}</span>
                <span className="gp-card__desc">{d.desc}</span>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="gp-vanilla-footer">
          <Link className="gp-vanilla-footer__link" href="/">
            Hub
          </Link>
          <Link
            className="gp-vanilla-footer__link gp-vanilla-footer__link--html5"
            href="/html5/index.html"
          >
            HTML5 Lab
          </Link>
        </footer>
      </div>
    </div>
  );
}
