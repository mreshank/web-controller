import Link from "next/link";
import { TALK_TITLE } from "@/lib/talk-outline";

const STAGE_ROUTES = [
  {
    href: "/rehearse",
    label: "Rehearsal timer",
    color: "violet",
    desc: "25-min timed run-through with section links and Q&A cheatsheet.",
    keys: "Space next · P pause · ←/→ sections",
  },
  {
    href: "/game",
    label: "Orb Rush (finale)",
    color: "fuchsia",
    desc: "4-player 3D arena — end the talk with this if you can.",
    keys: "",
  },
  {
    href: "/story",
    label: "Story World",
    color: "violet",
    desc: "Fly through narrative beacons in any order.",
    keys: "",
  },
  {
    href: "/demo",
    label: "Talk demo",
    color: "green",
    desc: "25-min technical demo: 1 poll loop, multi-slot HUD.",
    keys: "N notes · B backup · F fullscreen · H hide bar",
  },
  {
    href: "/html5/index.html",
    label: "HTML5 lab",
    color: "amber",
    desc: "Vanilla zero-build demos — max inspiration per line.",
    keys: "",
  },
  {
    href: "/naive",
    label: "Naive demo",
    color: "slate",
    desc: "Anti-pattern: 2 RAF loops. Show before fixing.",
    keys: "",
  },
  {
    href: "/code",
    label: "Code walkthrough",
    color: "cyan",
    desc: "5 tabs: slots → naive → provider → cube → HUD. For the 12–18 min section.",
    keys: "Press C from any page with presenter keys",
  },
  {
    href: "/backup",
    label: "Backup video",
    color: "rose",
    desc: "Pre-recorded demo if Bluetooth dies on stage.",
    keys: "B · requires public/backup-demo.mp4",
  },
] as const;

const colorClasses = {
  fuchsia:
    "border-fuchsia-500/40 bg-fuchsia-950/30 hover:border-fuchsia-400/60 hover:bg-fuchsia-950/50",
  violet:
    "border-violet-500/40 bg-violet-950/30 hover:border-violet-400/60 hover:bg-violet-950/50",
  amber:
    "border-amber-500/40 bg-amber-950/30 hover:border-amber-400/60 hover:bg-amber-950/50",
  green:
    "border-green-500/40 bg-green-950/30 hover:border-green-400/60 hover:bg-green-950/50",
  slate:
    "border-slate-500/40 bg-slate-900/50 hover:border-slate-400/60 hover:bg-slate-800/50",
  cyan: "border-cyan-500/40 bg-cyan-950/30 hover:border-cyan-400/60 hover:bg-cyan-950/50",
  rose: "border-rose-500/40 bg-rose-950/30 hover:border-rose-400/60 hover:bg-rose-950/50",
};

export default function StagePage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <p className="text-[10px] uppercase tracking-wider text-white/40">
        Stage launcher
      </p>
      <h1 className="mt-2 max-w-2xl text-xl font-semibold leading-snug sm:text-2xl">
        {TALK_TITLE}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-white/55">
        Open this page before you go on stage. Bookmark on your phone as a backup.
        Suggested flow: Demo → Naive → Code → Game finale → Story (optional) → Q&A.
      </p>

      <ul className="mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        {STAGE_ROUTES.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className={`block rounded-2xl border p-5 transition ${colorClasses[route.color]}`}
            >
              <span className="text-lg font-medium">{route.label}</span>
              <p className="mt-2 text-sm text-white/60">{route.desc}</p>
              {route.keys ? (
                <p className="mt-3 font-mono text-[10px] text-white/40">{route.keys}</p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12 max-w-xl rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
        <p className="font-medium text-white/90">Day-of checklist</p>
        <ul className="mt-3 list-inside list-disc space-y-1.5">
          <li>Test projector + HDMI at venue</li>
          <li>Press button on controller before demo (browser security)</li>
          <li>backup-demo.mp4 in public/ — tab on /backup ready</li>
          <li>Saturday: do not change code</li>
        </ul>
      </section>
    </div>
  );
}
