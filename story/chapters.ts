export type StoryFeature =
  | "webgl"
  | "canvas"
  | "css"
  | "gamepad"
  | "multiplayer"
  | "audio"
  | "vanilla";

export type StoryChapter = {
  id: string;
  feature: StoryFeature;
  title: string;
  subtitle: string;
  /** One-line hook for projector / HUD */
  hook: string;
  body: string;
  bullets: readonly string[];
  demoHref?: string;
  demoLabel?: string;
  position: [number, number, number];
  color: string;
};

/** Each beacon = one HTML5 + controller capability. Visit in any order. */
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "webgl",
    feature: "webgl",
    title: "WebGL & 3D Worlds",
    subtitle: "Hardware-accelerated graphics in the tab",
    hook: "Your GPU renders this entire space — no install.",
    body: "WebGL turns the browser into a game engine. Three.js, React Three Fiber, and WebGPU (next) let you ship open worlds, shaders, particles, and lighting that used to require Unity or Unreal.",
    bullets: [
      "Same frame loop as the Gamepad API — poll input, render scene",
      "Shadows, fog, and emissive materials read well on a projector",
      "Orb Rush (/game) is this stack with four local players",
    ],
    demoHref: "/game",
    demoLabel: "Open Orb Rush",
    position: [-14, 3, -6],
    color: "#38bdf8",
  },
  {
    id: "canvas",
    feature: "canvas",
    title: "Canvas 2D + Twin Sticks",
    subtitle: "No WebGL required",
    hook: "2D pixels, full-speed sticks — perfect for arcade feel.",
    body: "The <canvas> API is still unbeatable for lightweight games: vector ships, particles, tile maps. Pair it with requestAnimationFrame + navigator.getGamepads() and you have a console-style 2D experience in one file.",
    bullets: [
      "Left stick thrust, right stick aim — classic twin-stick",
      "Works on low-end laptops and classroom projectors",
      "Standalone demo: canvas-ship.html (no Next.js)",
    ],
    demoHref: "/html5/canvas-ship.html",
    demoLabel: "Canvas starship",
    position: [16, 3.5, -8],
    color: "#f97316",
  },
  {
    id: "css",
    feature: "css",
    title: "CSS Transforms + Gamepad",
    subtitle: "DOM as your game engine",
    hook: "Move HTML with transforms — zero WebGL context.",
    body: "Not every experience needs a canvas. CSS translate/rotate/scale on DOM nodes is GPU-composited in modern browsers. Drive divs from gamepad axes for UI toys, kiosks, museum installs, and accessible control surfaces.",
    bullets: [
      "Ideal when designers own layout in HTML/CSS",
      "Hit targets, text, and branding stay crisp at any scale",
      "css-driver.html — car + orbs, pure DOM",
    ],
    demoHref: "/html5/css-driver.html",
    demoLabel: "CSS driver",
    position: [0, 4, 16],
    color: "#f472b6",
  },
  {
    id: "gamepad",
    feature: "gamepad",
    title: "Gamepad API",
    subtitle: "Standard mapping, four slots",
    hook: "Press × — you're already using the API.",
    body: "navigator.getGamepads() exposes sticks, buttons, and triggers. There is no event stream for analog axes — you poll inside rAF. Deadzone, slot index, and a single shared poll loop are the difference between a demo and production.",
    bullets: [
      "Slots 0–3 — never assume your pad is [0]",
      "Compare /naive (two loops) vs /demo (one loop)",
      "visualizer.html plots every axis live",
    ],
    demoHref: "/html5/visualizer.html",
    demoLabel: "Pad visualizer",
    position: [-18, 3, 10],
    color: "#a78bfa",
  },
  {
    id: "multiplayer",
    feature: "multiplayer",
    title: "Couch Co-op in One URL",
    subtitle: "Four players · one tab",
    hook: "Four USB pads → four entities — no app store.",
    body: "Local multiplayer used to mean native binaries. On the web, four gamepad slots in one browser tab enable party games, installations, and conference demos where the audience walks up and plays.",
    bullets: [
      "Scan all slots each frame — connect order is random",
      "Shared or split camera; same poll loop feeds everyone",
      "Finale: Orb Rush with 2–4 controllers on stage",
    ],
    demoHref: "/game",
    demoLabel: "4-player arena",
    position: [14, 2.5, 12],
    color: "#4ade80",
  },
  {
    id: "audio",
    feature: "audio",
    title: "Audio, Rumble & Feedback",
    subtitle: "Web Audio + vibration",
    hook: "Controllers speak with sound and haptics.",
    body: "Web Audio API synthesizes SFX without asset packs. Gamepad vibration (where supported) pulses on collect and hit. Together they sell impact on a big screen even when graphics are minimal.",
    bullets: [
      "Oscillators + gain nodes for UI bleeps and engine hum",
      "navigator.vibrate on mobile; gamepad haptics on some pads",
      "Pair with 3D or CSS — feedback is platform-agnostic",
    ],
    demoHref: "/demo",
    demoLabel: "Talk demo HUD",
    position: [-8, 5.5, -18],
    color: "#fde047",
  },
  {
    id: "vanilla",
    feature: "vanilla",
    title: "Zero-Build HTML5 Lab",
    subtitle: "Open file · serve folder · done",
    hook: "No webpack on stage — just static files.",
    body: "The HTML5 folder is vanilla: one HTML file, optional ES module import map, gamepad.js helper. Serve with npx serve — gamepads work over http:// (not file://). Same Gamepad API your framework app uses underneath.",
    bullets: [
      "three-gamepad.html — full 3D on CDN Three.js",
      "Shared stylesheet: static.mreshank.com/gamepad/styles.css",
      "Ship labs to schools and meetups as a zip, not a repo",
    ],
    demoHref: "/vanilla",
    demoLabel: "Vanilla Web Dev Lab",
    position: [10, 3, -16],
    color: "#00e8cc",
  },
];

export function getChapter(id: string): StoryChapter | undefined {
  return STORY_CHAPTERS.find((c) => c.id === id);
}
