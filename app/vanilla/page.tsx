import Link from "next/link";

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

export default function VanillaLabPage() {
  return (
    <div className="gp-page gp-vanilla">
      <div className="gp-container">
        <p className="gp-eyebrow">Vanilla Web Dev Lab</p>
        <h1 className="gp-display" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
          HTML + CSS + JS + Controller
        </h1>
        <p className="gp-lead">
          Nine minimal demos — same Gamepad API, zero React. Each file is one product
          pattern you can copy into real apps. Uses{" "}
          <code className="gp-mono">/html5/gamepad.js</code> + shared stylesheet.
        </p>
        <div className="gp-serve">
          <span>
            Static files:{" "}
            <Link href="/vanilla/index.html">/vanilla/index.html</Link>
            {" · "}
            <code className="gp-mono">npx serve vanilla -p 3340</code>
          </span>
        </div>

        <ul className="gp-card-grid" style={{ marginTop: "1.5rem" }}>
          {DEMOS.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className={`gp-card gp-card--vanilla${"featured" in d && d.featured ? " is-featured" : ""}`}
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

        <p className="gp-mono" style={{ marginTop: "2rem", fontSize: "0.72rem", color: "var(--gp-text-faint)" }}>
          Graphics demos → <Link href="/html5/index.html">HTML5 Lab</Link> ·{" "}
          <Link href="/">Hub</Link>
        </p>
      </div>
    </div>
  );
}
