export const TALK_TITLE =
  "Breaking the DOM: Driving 3D Web Interfaces with Physical Gamepads";

export const TALK_TOTAL_MINUTES = 25;

export type TalkSection = {
  time: string;
  title: string;
  bullets: readonly string[];
  /** Suggested routes to open during this beat */
  links?: readonly { label: string; href: string }[];
  /** Code walkthrough tab id (see /code) */
  codeTabs?: readonly string[];
};

export const TALK_SECTIONS: readonly TalkSection[] = [
  {
    time: "0:00–2:00",
    title: "Hook",
    links: [{ label: "Live demo", href: "/demo" }],
    bullets: [
      "Plug in controller on stage — move cube before explaining",
      "Let the room react",
    ],
  },
  {
    time: "2:00–5:00",
    title: "Why this matters",
    links: [{ label: "Live demo", href: "/demo" }],
    bullets: [
      "Browser as runtime beyond forms and 2D",
      "Cloud gaming UIs, accessibility, installations",
    ],
  },
  {
    time: "5:00–12:00",
    title: "Gamepad API",
    links: [
      { label: "Naive (2 loops)", href: "/naive" },
      { label: "Live demo", href: "/demo" },
    ],
    codeTabs: ["slots"],
    bullets: [
      "Polling vs events — no push, only requestAnimationFrame",
      "Press a button after load (browser security)",
      "Slot index ≠ connection order — show HUD slots",
      "Optional: open /naive to show 2 poll loops",
    ],
  },
  {
    time: "12:00–18:00",
    title: "React + 60fps (the aha)",
    links: [{ label: "Code walkthrough", href: "/code" }],
    codeTabs: ["naive", "provider", "cube", "hud"],
    bullets: [
      "useState at 60fps = re-render hell",
      "Refs + useFrame mutate mesh directly",
      "HUD uses DOM refs, not React state",
      "Production: one GamepadProvider, many subscribers",
      "Open /code — tab: naive → provider → cube → HUD",
    ],
  },
  {
    time: "18:00–22:00",
    title: "Bigger demo",
    links: [
      { label: "Orb Rush game", href: "/game" },
      { label: "Talk demo", href: "/demo" },
    ],
    bullets: [
      "Finale: /game — up to 4 players collect orbs in 3D",
      "Face buttons → color, triggers → scale on /demo",
      "Two controllers → two cubes (if both connected)",
    ],
  },
  {
    time: "22:00–25:00",
    title: "Wrap + Q&A",
    links: [{ label: "Backup video", href: "/backup" }],
    bullets: [
      "WebHID, Web MIDI as cousins",
      "If demo dies: press B → /backup video",
      "“I haven't dug into that — what's your take?”",
    ],
  },
];

/** Parse "0:00–2:00" → duration in seconds for rehearsal timer */
export function sectionDurationSeconds(time: string): number {
  const parts = time.split(/[–-]/).map((s) => s.trim());
  if (parts.length !== 2) return 180;
  const toSec = (t: string) => {
    const [min, sec] = t.split(":").map(Number);
    return (min ?? 0) * 60 + (sec ?? 0);
  };
  return Math.max(60, toSec(parts[1]!) - toSec(parts[0]!));
}

export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const QA_CHEATSHEET = [
  {
    q: "Mobile / touch?",
    a: "Gamepad API on Android Chrome; iOS limited. Touch = Pointer Events, different API.",
  },
  {
    q: "Performance vs keyboard?",
    a: "Polling at 60fps is cheap; cost is what you do with the data (re-renders).",
  },
  {
    q: "Why not use-gamepad library?",
    a: "Fine for prototypes; raw API needed to marry with your render loop.",
  },
  {
    q: "DualSense haptics / adaptive triggers?",
    a: "Basic rumble via Gamepad Haptics API; advanced features need WebHID.",
  },
  {
    q: "Production use cases?",
    a: "Cloud gaming UI, alternative input, kiosks, in-browser game dev tools.",
  },
] as const;

export const PRESENTER_SHORTCUTS = [
  { key: "B", action: "Open backup video (/backup)" },
  { key: "C", action: "Code walkthrough (/code)" },
  { key: "S", action: "Stage hub (/stage)" },
  { key: "R", action: "Rehearsal timer (/rehearse)" },
  { key: "N", action: "Toggle speaker notes" },
  { key: "F", action: "Toggle fullscreen" },
  { key: "H", action: "Hide presenter bar" },
  { key: "?", action: "Keyboard shortcuts" },
] as const;
