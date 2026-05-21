"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  QA_CHEATSHEET,
  TALK_SECTIONS,
  TALK_TITLE,
  TALK_TOTAL_MINUTES,
  formatClock,
  sectionDurationSeconds,
} from "@/lib/talk-outline";

function useTick(active: boolean) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
}

export function RehearsalMode() {
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [sectionStartedAt, setSectionStartedAt] = useState<number | null>(null);
  const [showQa, setShowQa] = useState(false);

  useTick(running);

  const section = TALK_SECTIONS[index]!;
  const sectionBudget = sectionDurationSeconds(section.time);
  const totalBudget = TALK_TOTAL_MINUTES * 60;

  const now = Date.now();
  const sectionElapsed =
    running && sectionStartedAt
      ? Math.floor((now - sectionStartedAt) / 1000)
      : 0;
  const totalElapsed =
    running && startedAt ? Math.floor((now - startedAt) / 1000) : 0;

  const sectionOver = sectionElapsed > sectionBudget;
  const totalOver = totalElapsed > totalBudget;

  const start = useCallback(() => {
    const t = Date.now();
    setStartedAt(t);
    setSectionStartedAt(t);
    setRunning(true);
  }, []);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setStartedAt(null);
    setSectionStartedAt(null);
    setIndex(0);
    setShowQa(false);
  }, []);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(TALK_SECTIONS.length - 1, next));
      setIndex(clamped);
      if (running) setSectionStartedAt(Date.now());
      setShowQa(clamped === TALK_SECTIONS.length - 1);
    },
    [running]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          if (!running && !startedAt) start();
          else if (running) next();
          break;
        case "ArrowRight":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prev();
          break;
        case "p":
        case "P":
          if (running) pause();
          else if (startedAt) {
            setRunning(true);
            setSectionStartedAt(Date.now());
          } else start();
          break;
        case "Escape":
          reset();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, startedAt, start, pause, next, prev, reset]);

  const sectionProgress = useMemo(
    () => Math.min(100, (sectionElapsed / sectionBudget) * 100),
    [sectionElapsed, sectionBudget]
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-white/40">
            Rehearsal · 25 min run-through
          </p>
          <h1 className="text-sm font-medium sm:text-base">{TALK_TITLE}</h1>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/stage" className="rounded border border-white/15 px-3 py-1 hover:bg-white/10">
            Stage hub
          </Link>
          <Link href="/" className="rounded border border-green-500/30 bg-green-950/40 px-3 py-1 text-green-200/90">
            Live demo
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-white/10 p-4 lg:w-56 lg:border-b-0 lg:border-r">
          <p className="text-[10px] uppercase text-white/40">Sections</p>
          <ol className="mt-2 space-y-1">
            {TALK_SECTIONS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  className={`w-full rounded-lg px-2 py-1.5 text-left text-xs transition ${
                    i === index
                      ? "bg-cyan-950/60 text-cyan-100"
                      : "text-white/50 hover:bg-white/5 hover:text-white/80"
                  }`}
                >
                  <span className="font-mono text-[10px] text-white/35">{s.time}</span>
                  <span className="mt-0.5 block">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-cyan-400/90">{section.time}</p>
              <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">{section.title}</h2>
            </div>
            <div className="flex gap-6 font-mono text-sm">
              <div className={sectionOver ? "text-rose-400" : "text-white/80"}>
                <span className="text-[10px] uppercase text-white/40">Section</span>
                <p className="text-lg tabular-nums">
                  {formatClock(sectionElapsed)} / {formatClock(sectionBudget)}
                </p>
              </div>
              <div className={totalOver ? "text-rose-400" : "text-white/60"}>
                <span className="text-[10px] uppercase text-white/40">Total</span>
                <p className="text-lg tabular-nums">
                  {formatClock(totalElapsed)} / {formatClock(totalBudget)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full transition-all ${sectionOver ? "bg-rose-500" : "bg-cyan-500"}`}
              style={{ width: `${sectionProgress}%` }}
            />
          </div>

          <ul className="mt-6 flex-1 space-y-2 text-sm text-white/75">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-cyan-500">→</span>
                {b}
              </li>
            ))}
          </ul>

          {section.links && section.links.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs hover:border-cyan-500/40 hover:bg-cyan-950/30"
                >
                  Open {link.label} ↗
                </Link>
              ))}
            </div>
          ) : null}

          {section.codeTabs && section.codeTabs.length > 0 ? (
            <p className="mt-3 text-xs text-white/45">
              Code tabs:{" "}
              <span className="font-mono text-cyan-400/80">
                {section.codeTabs.join(" → ")}
              </span>
            </p>
          ) : null}

          {showQa && index === TALK_SECTIONS.length - 1 ? (
            <div className="mt-6 max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase text-white/40">Q&A cheatsheet</p>
              <dl className="mt-2 space-y-2 text-xs">
                {QA_CHEATSHEET.map((item) => (
                  <div key={item.q}>
                    <dt className="font-medium text-white/85">{item.q}</dt>
                    <dd className="text-white/55">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {!running && !startedAt ? (
              <button
                type="button"
                onClick={start}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium hover:bg-cyan-500"
              >
                Start rehearsal
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={running ? pause : () => setRunning(true)}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
                >
                  {running ? "Pause (P)" : "Resume (P)"}
                </button>
                <button
                  type="button"
                  onClick={prev}
                  disabled={index === 0}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-30"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={index >= TALK_SECTIONS.length - 1}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-30"
                >
                  Next (Space) →
                </button>
              </>
            )}
            <button
              type="button"
              onClick={reset}
              className="rounded-lg px-4 py-2 text-sm text-white/50 hover:text-white"
            >
              Reset
            </button>
          </div>
        </main>
      </div>

      <footer className="shrink-0 border-t border-white/10 px-4 py-2 text-center text-[10px] text-white/35">
        Space = next · ←/→ sections · P pause · Esc reset
      </footer>
    </div>
  );
}
