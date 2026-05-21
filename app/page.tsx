import Link from "next/link";

const EXPERIENCES = [
  {
    href: "/game",
    title: "Orb Rush",
    tag: "Finale",
    desc: "Up to 4 controllers. 3D arena. Collect orbs. The crowd moment.",
    className:
      "border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/50 to-slate-900/80 hover:border-fuchsia-400/70",
  },
  {
    href: "/story",
    title: "Story World",
    tag: "Explore",
    desc: "Fly through beacons in any order. A narrative about the web + hardware.",
    className:
      "border-violet-500/40 bg-gradient-to-br from-violet-950/50 to-slate-900/80 hover:border-violet-400/70",
  },
  {
    href: "/demo",
    title: "Talk Demo",
    tag: "25 min",
    desc: "Gamepad API + React Three Fiber. Polling, refs, multi-slot HUD.",
    className:
      "border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-slate-900/80 hover:border-cyan-400/60",
  },
  {
    href: "/html5/index.html",
    title: "HTML5 Lab",
    tag: "Zero build",
    desc: "Vanilla HTML/CSS/JS. Max ROI. Visualizer, canvas ship, CSS driver, Three CDN.",
    className:
      "border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-slate-900/80 hover:border-amber-400/60",
  },
] as const;

const TOOLS = [
  { href: "/stage", label: "Stage hub" },
  { href: "/rehearse", label: "Rehearsal" },
  { href: "/code", label: "Code walkthrough" },
  { href: "/naive", label: "Naive loops" },
  { href: "/backup", label: "Backup video" },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-14">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-400/90">
          Gamepad × HTML5 × The Open Web
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
          The browser is a game engine.
          <span className="block text-white/50 text-2xl font-normal mt-2">
            Plug in. Press start. Ship impossible UX.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/60">
          Four experiences — from a 25-minute technical talk demo to a multiplayer
          3D arena and a story you walk through in your own order — plus vanilla
          HTML5 labs with almost no code. All driven by the same Gamepad API.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {EXPERIENCES.map((e) => (
            <li key={e.href}>
              <Link
                href={e.href}
                className={`block rounded-2xl border p-5 transition ${e.className}`}
              >
                <span className="text-[10px] uppercase tracking-wider text-white/40">
                  {e.tag}
                </span>
                <span className="mt-1 block text-lg font-semibold">{e.title}</span>
                <span className="mt-2 block text-sm text-white/55">{e.desc}</span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12">
          <p className="text-[10px] uppercase tracking-wider text-white/35">
            Presenter tools
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-white/25 hover:text-white"
              >
                {t.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
