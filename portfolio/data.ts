export type PortfolioKind =
  | "intro"
  | "about"
  | "work"
  | "skills"
  | "project"
  | "contact"
  | "meta";

export type PortfolioHighlight = { label: string; value: string };
export type PortfolioSection = { heading: string; body: string };
export type PortfolioTimelineItem = { period: string; role: string; org: string; detail: string };
export type PortfolioProject = { name: string; desc: string; href?: string; stack?: string };

export type PortfolioBeacon = {
  id: string;
  kind: PortfolioKind;
  title: string;
  subtitle: string;
  hook: string;
  body: string;
  bullets: readonly string[];
  highlights?: readonly PortfolioHighlight[];
  sections?: readonly PortfolioSection[];
  timeline?: readonly PortfolioTimelineItem[];
  projects?: readonly PortfolioProject[];
  skills?: readonly { name: string; pct: number }[];
  links?: readonly { label: string; href: string }[];
  position: [number, number, number];
  color: string;
};

/** Curated from mreshank.com, GitHub @mreshank, LinkedIn, and public profiles */
export const PORTFOLIO_BEACONS: PortfolioBeacon[] = [
  {
    id: "intro",
    kind: "intro",
    title: "Eshank Tyagi",
    subtitle: "Full-stack engineer · Dehradun, India",
    hook: "Walk the village — each lantern is a chapter of my work.",
    body: "I design and ship web products where performance, accessibility, and joy matter. This world is a live portfolio: a villager you control, gamepad-native navigation, and the same React + Three.js stack I use for client work.",
    bullets: [
      "Primary site: mreshank.com",
      "Open source: github.com/mreshank",
      "Focus: React, TypeScript, Node, real-time UX",
    ],
    highlights: [
      { label: "Role", value: "Full-stack developer" },
      { label: "Location", value: "Dehradun · remote OK" },
      { label: "Current", value: "Matters.AI" },
      { label: "Education", value: "B.Tech CSE — Shivalik College" },
    ],
    sections: [
      {
        heading: "What I care about",
        body: "Interfaces that feel physical—gamepads, 3D, audio—and backends that stay boring in the best way: predictable, observable, and fast. I like demos you can hand to an audience and code teams can fork the next week.",
      },
      {
        heading: "This experience",
        body: "You are exploring a blocky plains village on purpose: approachable, playful, and far from the purple “space story” module. Press × at glowing lecterns to read; ○ closes. Start/Select jump Hub/Lab if you came from the talk app.",
      },
    ],
    links: [
      { label: "mreshank.com", href: "https://mreshank.com" },
      { label: "GitHub", href: "https://github.com/mreshank" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mreshank" },
    ],
    position: [0, 0, 4],
    color: "#1eaedb",
  },
  {
    id: "about",
    kind: "about",
    title: "About me",
    subtitle: "Builder · tinkerer · stage-friendly engineer",
    hook: "From college labs to production dashboards.",
    body: "I grew up shipping small web experiments, then moved into product teams where reliability and UX both score on the same ticket. I document what I learn, present at communities like GDG, and prefer codebases a new teammate can run in ten minutes.",
    bullets: [
      "Shivalik College of Engineering — Computer Science",
      "Certifications: HackerRank Java, platform micro-credentials",
      "Languages: Hindi & English — collaboration across time zones",
    ],
    highlights: [
      { label: "Years shipping", value: "4+" },
      { label: "Stack bias", value: "TypeScript-first" },
      { label: "Interests", value: "WebGL · AI tooling · gamepad UX" },
      { label: "Community", value: "Talks · workshops · open repos" },
    ],
    sections: [
      {
        heading: "How I work",
        body: "I start with user flows and performance budgets, prototype in Next.js or vanilla HTML depending on the audience, then harden APIs and auth. I’m comfortable pairing with design on motion and with DevOps on deploy pipelines.",
      },
      {
        heading: "Outside the editor",
        body: "Music tools in the browser, gamepad experiments, and mentoring juniors on Git and React patterns. I like projects that mix creativity with measurable outcomes—Lighthouse scores, error rates, or smiles per demo.",
      },
    ],
    position: [-10, 0, -6],
    color: "#84cc16",
  },
  {
    id: "work",
    kind: "work",
    title: "Experience",
    subtitle: "Product teams & production traffic",
    hook: "Real users, real SLAs—not tutorial todo apps.",
    body: "I've worked across startup-paced product engineering: owning frontend architecture, integrating AI features, and keeping MERN services maintainable as scope grows.",
    bullets: [
      "Matters.AI — current engineering role",
      "OptIQ.AI — founding engineer / frontend lead (public profiles)",
      "Cross-functional delivery with design + backend",
    ],
    highlights: [
      { label: "Domain", value: "B2B SaaS · AI products" },
      { label: "Strength", value: "React ecosystems" },
      { label: "Also", value: "REST · WebSockets · OAuth" },
    ],
    timeline: [
      {
        period: "Present",
        role: "Software engineer",
        org: "Matters.AI",
        detail: "Building product features across the web stack—UI systems, APIs, and integrations with AI workflows. Emphasis on typed React, fast iteration, and stable releases.",
      },
      {
        period: "Earlier",
        role: "Founding engineer · Frontend lead",
        org: "OptIQ.AI",
        detail: "Led frontend for an early-stage platform: component architecture, performance passes, and hiring-friendly patterns. Shipped customer-facing dashboards under tight deadlines.",
      },
      {
        period: "Foundation",
        role: "Full-stack projects",
        org: "Freelance & college",
        detail: "MERN apps, college platforms, and client sites—auth, payments-adjacent flows, admin panels, and mobile-responsive UI.",
      },
    ],
    sections: [
      {
        heading: "What teams get",
        body: "Clear PRs, Storybook-friendly components when useful, and honest estimates. I’ve debugged production incidents, added logging/metrics, and refactored without pausing feature work entirely.",
      },
    ],
    links: [{ label: "OptIQ.AI", href: "https://optiq.ai" }],
    position: [14, 0, -8],
    color: "#a78bfa",
  },
  {
    id: "skills",
    kind: "skills",
    title: "Technical stack",
    subtitle: "Depth in frontend · confident full-stack",
    hook: "The tools behind the village you’re walking through.",
    body: "TypeScript and React are home base. I reach for Node when the product needs APIs, websockets, or SSR—and Three.js / React Three Fiber when the brief says “make the browser feel like a place.”",
    bullets: [
      "React 19 · Next.js App Router · R3F · Zustand/context patterns",
      "Node · Express-style APIs · MongoDB · PostgreSQL basics",
      "Web platform: Gamepad API · Canvas · Web Audio · PWA patterns",
    ],
    skills: [
      { name: "TypeScript / React", pct: 92 },
      { name: "Next.js & SSR", pct: 88 },
      { name: "Node & APIs", pct: 80 },
      { name: "Three.js / WebGL", pct: 75 },
      { name: "CSS / design systems", pct: 85 },
      { name: "Testing & tooling", pct: 72 },
    ],
    sections: [
      {
        heading: "Frontend craft",
        body: "Accessible components, keyboard + gamepad paths, CSS variables for theming, and bundle discipline. I’ve shipped shared stylesheets CDN-hosted for static HTML demos and React apps alike.",
      },
      {
        heading: "Backend & data",
        body: "JWT/OAuth flows, file uploads, pagination, and pragmatic schema design. Comfortable reading SQL and modeling documents in MongoDB depending on the product.",
      },
    ],
    position: [18, 0, 6],
    color: "#fbbf24",
  },
  {
    id: "projects",
    kind: "project",
    title: "Selected projects",
    subtitle: "Repos you can clone tonight",
    hook: "Tactile web—controllers, audio, multiplayer.",
    body: "Side projects are how I stress-test ideas before talks. Each one below is open source or documented on GitHub; several power live demos in this monorepo.",
    bullets: [
      "gamepad-demo — this talk codebase (you’re in it)",
      "web-controller — HTML5 + Gamepad patterns",
      "Notater — browser DAW, offline-first",
    ],
    projects: [
      {
        name: "gamepad-demo",
        desc: "Next.js experiences: Orb Rush arena, story world, vanilla lab, HTML5 graphics, and this portfolio village. One GamepadProvider poll loop, shared stylesheet.",
        href: "/",
        stack: "Next · R3F · TypeScript",
      },
      {
        name: "web-controller",
        desc: "Standalone Gamepad API experiments—canvas, CSS drivers, visualizers—ideal for workshops.",
        href: "https://github.com/mreshank/web-controller",
        stack: "HTML5 · Canvas · CSS",
      },
      {
        name: "Notater",
        desc: "In-browser music workstation with Tone.js, offline storage, and P2P flavor for collaboration experiments.",
        href: "https://github.com/mreshank/Notater",
        stack: "Web Audio · React",
      },
      {
        name: "Earlier sites & apps",
        desc: "guess-the-word, SCE connect, currency tools, and mreshank.github.io—foundational JS/CSS portfolio evolution.",
        href: "https://github.com/mreshank?tab=repositories",
        stack: "MERN · vanilla",
      },
    ],
    links: [
      { label: "All repositories", href: "https://github.com/mreshank?tab=repositories" },
      { label: "web-controller", href: "https://github.com/mreshank/web-controller" },
      { label: "Notater", href: "https://github.com/mreshank/Notater" },
    ],
    position: [-14, 0, 12],
    color: "#f97316",
  },
  {
    id: "meta",
    kind: "meta",
    title: "This codebase",
    subtitle: "gamepad-demo · talk-ready monorepo",
    hook: "Every route is a different lesson in browser-as-game-engine.",
    body: "Fork it for meetups: each module isolates one idea—multiplayer 3D, narrative fly-through, vanilla product patterns, or this walkable portfolio.",
    bullets: [
      "/game — 4-player orb arena",
      "/story — fly + HTML5 beacons (space theme)",
      "/vanilla — nine DOM labs with controller chrome",
      "/demo — minimal R3F teaching scene",
    ],
    sections: [
      {
        heading: "Architecture notes",
        body: "Single requestAnimationFrame gamepad poll in GamepadProvider; subscribers use refs to avoid re-render storms. Static HTML labs sync to public/ and can run from any static host.",
      },
      {
        heading: "Portfolio vs story",
        body: "Story = zero-g exploration. Portfolio = grounded village, third-person villager, richer panels. Same ×/○ conventions for consistency on stage.",
      },
    ],
    links: [
      { label: "Orb Rush", href: "/game" },
      { label: "Story world", href: "/story" },
      { label: "Vanilla lab", href: "/vanilla" },
    ],
    position: [6, 0, 18],
    color: "#fde047",
  },
  {
    id: "contact",
    kind: "contact",
    title: "Let's build something",
    subtitle: "Open to roles, contracts, and weird web ideas",
    hook: "Great fit: React product teams, creative tech, interactive installs.",
    body: "If you need someone who can ship a conference demo on Friday and harden it on Monday, say hello. I’m especially excited about gamepad-native UIs, 3D commerce, and devtools teams that care about DX.",
    bullets: [
      "Email & form via mreshank.com",
      "LinkedIn for professional ping",
      "GitHub for code-first intros",
    ],
    highlights: [
      { label: "Availability", value: "Open to conversation" },
      { label: "Remote", value: "Yes — IST timezone" },
      { label: "Talks", value: "GDG-style web hardware demos" },
    ],
    sections: [
      {
        heading: "Good project fit",
        body: "Next.js product work, interactive marketing microsites, internal tools with gamepad/kiosk mode, or WebGL experiences that still need SEO and accessibility.",
      },
      {
        heading: "What to send",
        body: "A short note about the product, stack, and timeline. Links to designs or repos help me respond with useful questions—not generic availability fluff.",
      },
    ],
    links: [
      { label: "mreshank.com", href: "https://mreshank.com" },
      { label: "GitHub", href: "https://github.com/mreshank" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mreshank" },
    ],
    position: [0, 0, -16],
    color: "#4ade80",
  },
];

export function getPortfolioBeacon(id: string): PortfolioBeacon | undefined {
  return PORTFOLIO_BEACONS.find((b) => b.id === id);
}
