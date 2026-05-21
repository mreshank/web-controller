import { readFileSync } from "node:fs";
import { join } from "node:path";

export type CodeLine = {
  number: number;
  text: string;
  highlight: boolean;
};

export type TalkCodeSnippet = {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  lines: CodeLine[];
};

type SnippetConfig = {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  startLine: number;
  endLine: number;
  highlightLines: number[];
};

function buildSnippet(config: SnippetConfig): TalkCodeSnippet {
  const source = readFileSync(
    join(/* turbopackIgnore: true */ process.cwd(), config.path),
    "utf8"
  );
  const all = source.split("\n");
  const highlightSet = new Set(config.highlightLines);
  const lines: CodeLine[] = [];

  for (let n = config.startLine; n <= config.endLine; n++) {
    const text = all[n - 1] ?? "";
    lines.push({
      number: n,
      text,
      highlight: highlightSet.has(n),
    });
  }

  return {
    id: config.id,
    path: config.path,
    title: config.title,
    subtitle: config.subtitle,
    lines,
  };
}

/** Source excerpts for the /code walkthrough — read from repo at build time. */
export function getTalkCodeSnippets(): TalkCodeSnippet[] {
  return [
    buildSnippet({
      id: "slots",
      path: "lib/gamepad.ts",
      title: "Browser slot indices",
      subtitle: "Never hardcode pads[0] — indices are assigned by the OS",
      startLine: 48,
      endLine: 60,
      highlightLines: [50, 51, 52, 53],
    }),
    buildSnippet({
      id: "naive",
      path: "hooks/useGamepadNaive.ts",
      title: "Naive: one loop per hook",
      subtitle: "Each useGamepadNaive() → its own requestAnimationFrame",
      startLine: 30,
      endLine: 54,
      highlightLines: [34, 35, 36, 45],
    }),
    buildSnippet({
      id: "provider",
      path: "context/GamepadProvider.tsx",
      title: "Production: single poll loop",
      subtitle: "One getGamepads() per frame, fan-out to subscribers",
      startLine: 59,
      endLine: 109,
      highlightLines: [60, 67, 71, 95, 96, 97],
    }),
    buildSnippet({
      id: "cube",
      path: "components/Cube.tsx",
      title: "Hot loop: refs + useFrame",
      subtitle: "Gamepad state in a ref — mutate the mesh, skip React reconciliation",
      startLine: 35,
      endLine: 65,
      highlightLines: [35, 36, 37, 39, 46, 47],
    }),
    buildSnippet({
      id: "hud",
      path: "components/GamepadHUD.tsx",
      title: "HUD: direct DOM updates",
      subtitle: "Same subscriber pattern — no setState at 60fps",
      startLine: 54,
      endLine: 73,
      highlightLines: [54, 61, 62, 63],
    }),
  ];
}
