import Link from "next/link";
import { CodeWalkthrough } from "@/components/code/CodeWalkthrough";
import { getTalkCodeSnippets } from "@/lib/code-snippets";

export default function CodePage() {
  const snippets = getTalkCodeSnippets();

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Talk code walkthrough
          </p>
          <h1 className="text-sm font-medium sm:text-base">
            React + 60fps — refs, one poll loop, direct DOM
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/"
            className="rounded border border-green-500/30 bg-green-950/40 px-3 py-1 text-green-200/90 hover:border-green-400/50"
          >
            Live demo
          </Link>
          <Link
            href="/naive"
            className="rounded border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-amber-200/90 hover:border-amber-400/50"
          >
            Naive demo
          </Link>
          <Link
            href="/stage"
            className="rounded border border-white/15 px-3 py-1 text-white/70 hover:bg-white/10"
          >
            Stage hub
          </Link>
        </div>
      </header>

      <main className="min-h-0 flex-1 p-4 sm:p-6">
        <CodeWalkthrough snippets={snippets} />
      </main>

      <footer className="shrink-0 border-t border-white/10 px-4 py-2 text-center text-[10px] text-white/35">
        Tab through sections · yellow = call out on stage · source read from this repo at build time
      </footer>
    </div>
  );
}
