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
  }, []);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(TALK_SECTIONS.length - 1, next));
      setIndex(clamped);
      if (running) setSectionStartedAt(Date.now());
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
    <div className="gp-page">
      <header className="gp-page-header gp-container">
        <div>
          <p className="gp-eyebrow">Rehearsal</p>
          <h1 className="gp-heading">{TALK_TITLE}</h1>
        </div>
        <div className="gp-page-header__actions">
          <Link href="/game" className="gp-btn gp-btn--game">
            Game
          </Link>
          <Link href="/demo" className="gp-btn gp-btn--accent">
            Demo
          </Link>
          <Link href="/stage" className="gp-btn">
            Stage
          </Link>
        </div>
      </header>

      <div className="gp-container gp-rehearse">
        <nav className="gp-rehearse__nav">
          {TALK_SECTIONS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              className={`gp-rehearse__nav-btn${i === index ? " is-active" : ""}`}
              onClick={() => go(i)}
            >
              <span className="gp-mono" style={{ display: "block", fontSize: "0.58rem", color: "var(--gp-text-faint)" }}>
                {s.time}
              </span>
              {s.title}
            </button>
          ))}
        </nav>

        <div className="gp-rehearse__main">
          <div className="gp-row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p className="gp-mono" style={{ fontSize: "0.68rem", color: "var(--gp-accent)" }}>
                {section.time}
              </p>
              <h2 className="gp-display" style={{ fontSize: "1.75rem", marginTop: "0.25rem" }}>
                {section.title}
              </h2>
            </div>
            <div className="gp-row" style={{ gap: "1.25rem" }}>
              <div>
                <p className="gp-section-label">Section</p>
                <p className={`gp-timer${sectionOver ? " gp-timer--over" : ""}`}>
                  {formatClock(sectionElapsed)} / {formatClock(sectionBudget)}
                </p>
              </div>
              <div>
                <p className="gp-section-label">Total</p>
                <p className={`gp-timer${totalOver ? " gp-timer--over" : ""}`}>
                  {formatClock(totalElapsed)} / {formatClock(totalBudget)}
                </p>
              </div>
            </div>
          </div>

          <div className="gp-progress">
            <div
              className={`gp-progress__fill${sectionOver ? " gp-progress__fill--over" : ""}`}
              style={{ width: `${sectionProgress}%` }}
            />
          </div>

          <ul className="gp-drawer__list" style={{ marginTop: "1.25rem", flex: 1 }}>
            {section.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          {section.links && section.links.length > 0 ? (
            <div className="gp-chips" style={{ marginTop: "1rem" }}>
              {section.links.map((link) => (
                <Link key={link.href} href={link.href} className="gp-chip">
                  Open {link.label}
                </Link>
              ))}
            </div>
          ) : null}

          {section.codeTabs && section.codeTabs.length > 0 ? (
            <p className="gp-mono" style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "var(--gp-text-muted)" }}>
              Code tabs: {section.codeTabs.join(" → ")}
            </p>
          ) : null}

          {index === TALK_SECTIONS.length - 1 ? (
            <div className="gp-panel" style={{ marginTop: "1rem", maxHeight: "12rem", overflow: "auto" }}>
              <p className="gp-section-label">Q&A</p>
              <dl className="gp-drawer__qa">
                {QA_CHEATSHEET.map((item) => (
                  <div key={item.q}>
                    <dt>{item.q}</dt>
                    <dd>{item.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          <div className="gp-row" style={{ marginTop: "1.25rem", gap: "0.5rem" }}>
            {!running && !startedAt ? (
              <button type="button" className="gp-btn gp-btn--accent" onClick={start}>
                Start rehearsal
              </button>
            ) : (
              <>
                <button type="button" className="gp-btn" onClick={running ? pause : () => setRunning(true)}>
                  {running ? "Pause" : "Resume"}
                </button>
                <button type="button" className="gp-btn" onClick={prev} disabled={index === 0}>
                  ← Prev
                </button>
                <button
                  type="button"
                  className="gp-btn"
                  onClick={next}
                  disabled={index >= TALK_SECTIONS.length - 1}
                >
                  Next →
                </button>
              </>
            )}
            <button type="button" className="gp-btn gp-btn--ghost" onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <p
        className="gp-mono gp-container"
        style={{
          paddingBottom: "1rem",
          fontSize: "0.62rem",
          color: "var(--gp-text-faint)",
          textAlign: "center",
        }}
      >
        Space = next · ←/→ sections · P pause · Esc reset
      </p>
    </div>
  );
}
