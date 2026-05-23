export type PortfolioKind =
  | "intro"
  | "about"
  | "work"
  | "skills"
  | "project"
  | "contact"
  | "meta";

export type PortfolioBeacon = {
  id: string;
  kind: PortfolioKind;
  title: string;
  subtitle: string;
  hook: string;
  body: string;
  bullets: readonly string[];
  links?: readonly { label: string; href: string }[];
  position: [number, number, number];
  color: string;
};

/** Curated from mreshank.com, GitHub @mreshank, and public profiles */
export const PORTFOLIO_BEACONS: PortfolioBeacon[] = [
  {
    id: "intro",
    kind: "intro",
    title: "Eshank Tyagi",
    subtitle: "Full-Stack Developer · Dehradun",
    hook: "Walk this space like a story — sticks to move, × to read each chapter.",
    body: "I build performant, user-centric web products with React, TypeScript, and Node.js. This 3D gallery is itself a live demo of the Gamepad API + WebGL — the same stack I use for real products.",
    bullets: [
      "mreshank.com — portfolio & projects",
      "GitHub @mreshank — open source & experiments",
      "Matters.AI · MERN · real-time systems",
    ],
    links: [
      { label: "Website", href: "https://mreshank.com" },
      { label: "GitHub", href: "https://github.com/mreshank" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mreshank" },
    ],
    position: [0, 0, 0],
    color: "#1eaedb",
  },
  {
    id: "about",
    kind: "about",
    title: "About",
    subtitle: "Engineer · Explorer · Builder",
    hook: "From coursework to production — always shipping.",
    body: "Computer Science engineering background (Shivalik College of Engineering, Dehradun). I care about scalable APIs, thoughtful UX, and demos that make teams say “we can ship that on the web.”",
    bullets: [
      "Full-stack: React, Next.js, Node, MongoDB, PostgreSQL",
      "Interested in AI integration, cloud architecture, WebGL",
      "HackerRank Java · multiple platform certifications",
    ],
    position: [-10, 0, -14],
    color: "#38bdf8",
  },
  {
    id: "work",
    kind: "work",
    title: "Experience",
    subtitle: "Matters.AI · OptIQ.AI · Product teams",
    hook: "Production web — not just tutorials.",
    body: "Currently building at Matters.AI. Previously SDE / frontend work at OptIQ.AI (Founding Engineer & Frontend Lead on public org charts). Focus: React ecosystems, APIs, and interfaces that stay fast under load.",
    bullets: [
      "MERN stack · REST & real-time patterns",
      "Performance, security, and maintainable architecture",
      "Collaboration with design & backend teams",
    ],
    links: [{ label: "OptIQ.AI", href: "https://optiq.ai" }],
    position: [12, 0, -12],
    color: "#a78bfa",
  },
  {
    id: "skills",
    kind: "skills",
    title: "Stack",
    subtitle: "What I ship with",
    hook: "Depth in frontend — breadth across the stack.",
    body: "TypeScript-first React and Next.js on the client; Node and Express (or similar) on the server; MongoDB and SQL where the data model fits. Comfortable with Three.js / R3F for 3D and interactive installs.",
    bullets: [
      "React · Next.js · TypeScript · Tailwind",
      "Node.js · Express · WebSockets · JWT/OAuth",
      "Three.js · Gamepad API · Web Audio · Firebase",
    ],
    position: [16, 0, 6],
    color: "#00e8cc",
  },
  {
    id: "projects",
    kind: "project",
    title: "Selected work",
    subtitle: "Repos & products",
    hook: "Code you can click — not slide bullets.",
    body: "From browser-based tools to gamepad-driven UIs — I like projects that feel tactile. Highlights below; dozens more on GitHub.",
    bullets: [
      "web-controller — HTML + Gamepad experiments",
      "Notater — browser DAW, offline-first, Tone.js + P2P",
      "guess-the-word · SCE connect · currency & game apps",
      "mreshank.github.io — earlier portfolio (HTML/CSS/JS)",
    ],
    links: [
      { label: "web-controller", href: "https://github.com/mreshank/web-controller" },
      { label: "Notater", href: "https://github.com/mreshank/Notater" },
      { label: "All repos", href: "https://github.com/mreshank?tab=repositories" },
    ],
    position: [-14, 0, 10],
    color: "#f97316",
  },
  {
    id: "meta",
    kind: "meta",
    title: "This demo",
    subtitle: "gamepad-demo · GDG / community talks",
    hook: "You are inside the talk codebase.",
    body: "Orb Rush, Story World, Vanilla Web Dev Lab, and HTML5 labs — all driven by one GamepadProvider poll loop and a shared stylesheet CDN. Fork it for your next event.",
    bullets: [
      "/game — 4-player 3D arena",
      "/story — HTML5 narrative beacons",
      "/vanilla — focus, scroll, CSS vars, media UI",
      "/demo — React Three Fiber teaching scene",
    ],
    links: [
      { label: "Orb Rush", href: "/game" },
      { label: "Talk demo", href: "/demo" },
      { label: "Vanilla lab", href: "/vanilla" },
    ],
    position: [-6, 0, 6],
    color: "#fde047",
  },
  {
    id: "contact",
    kind: "contact",
    title: "Let's build",
    subtitle: "Open to roles & collaborations",
    hook: "Hireable · happy to chat.",
    body: "Great project that needs React, 3D on the web, or gamepad-native UX? Reach out. I document, ship, and like stages where the audience touches the product.",
    bullets: [
      "Email via mreshank.com contact",
      "DM on LinkedIn or GitHub",
      "Based in Dehradun · remote-friendly",
    ],
    links: [
      { label: "mreshank.com", href: "https://mreshank.com" },
      { label: "GitHub", href: "https://github.com/mreshank" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mreshank" },
    ],
    position: [0, 0, 22],
    color: "#4ade80",
  },
];

export function getPortfolioBeacon(id: string): PortfolioBeacon | undefined {
  return PORTFOLIO_BEACONS.find((b) => b.id === id);
}
