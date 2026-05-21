export const TALK_TITLE =
  "Breaking the DOM: Driving 3D Web Interfaces with Physical Gamepads";

export const TALK_SECTIONS = [
  {
    time: "0:00–2:00",
    title: "Hook",
    bullets: [
      "Plug in controller on stage — move cube before explaining",
      "Let the room react",
    ],
  },
  {
    time: "2:00–5:00",
    title: "Why this matters",
    bullets: [
      "Browser as runtime beyond forms and 2D",
      "Cloud gaming UIs, accessibility, installations",
    ],
  },
  {
    time: "5:00–12:00",
    title: "Gamepad API",
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
    bullets: [
      "useState at 60fps = re-render hell",
      "Refs + useFrame mutate mesh directly",
      "HUD uses DOM refs, not React state",
      "Production: one GamepadProvider, many subscribers",
    ],
  },
  {
    time: "18:00–22:00",
    title: "Bigger demo",
    bullets: [
      "Face buttons → color, triggers → scale",
      "Two controllers → two cubes (if both connected)",
    ],
  },
  {
    time: "22:00–25:00",
    title: "Wrap + Q&A",
    bullets: [
      "WebHID, Web MIDI as cousins",
      "If demo dies: press B → /backup video",
      "“I haven't dug into that — what's your take?”",
    ],
  },
] as const;

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
  { key: "N", action: "Toggle speaker notes" },
  { key: "F", action: "Toggle fullscreen" },
  { key: "H", action: "Hide presenter bar" },
  { key: "?", action: "Keyboard shortcuts" },
] as const;
