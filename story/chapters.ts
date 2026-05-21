export type StoryChapter = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  position: [number, number, number];
  color: string;
};

/** Free-order narrative nodes — fly to any beacon in any sequence. */
export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "awaken",
    title: "The Browser Awakens",
    subtitle: "1993 → today",
    body: "The web started as documents. Now it is a real-time runtime — WebGL, WASM, WebGPU, audio, MIDI, and gamepads. Your browser is an operating system wearing a tab.",
    position: [-12, 2, -8],
    color: "#38bdf8",
  },
  {
    id: "dom",
    title: "Beyond the DOM",
    subtitle: "Input is not just click",
    body: "Buttons, sticks, triggers, gyros — standardized as the Gamepad API. No plugin. No install. Plug in hardware and JavaScript can read it at 60–1000 Hz.",
    position: [14, 3, -10],
    color: "#f472b6",
  },
  {
    id: "poll",
    title: "The Honest Loop",
    subtitle: "Polling is not shameful",
    body: "There is no gamepad input event stream. You poll inside requestAnimationFrame. One loop. Many readers. Refs for hot paths. React for cold paths.",
    position: [0, 4, 14],
    color: "#a78bfa",
  },
  {
    id: "slots",
    title: "Slot Index 1",
    subtitle: "Never hardcode [0]",
    body: "Browsers assign gamepad indices arbitrarily. Your DualSense might be slot 1. Production code discovers connected pads — it does not assume order.",
    position: [-16, 2.5, 10],
    color: "#f97316",
  },
  {
    id: "multi",
    title: "Four Players, One Tab",
    subtitle: "Local multiplayer on the web",
    body: "Four slots. Four friends. One URL. No app store review. Ship arena games, party games, and installations tomorrow — not next quarter.",
    position: [12, 2, 12],
    color: "#4ade80",
  },
  {
    id: "future",
    title: "WebHID & Beyond",
    subtitle: "When standard is not enough",
    body: "Adaptive triggers, RGB, custom devices — WebHID opens the pipe. The web stack is now competitive with native for interaction design. Build what people remember.",
    position: [-6, 5, -16],
    color: "#fde047",
  },
  {
    id: "build",
    title: "Your Turn",
    subtitle: "Inspire the room",
    body: "Fork this demo. Replace cubes with your art. Connect your controller to your product. The audience does not need another slide — they need a moment they can touch.",
    position: [8, 3, -14],
    color: "#22d3ee",
  },
];
