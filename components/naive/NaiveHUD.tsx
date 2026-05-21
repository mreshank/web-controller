"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import {
  getNaivePollLoopCount,
  useGamepadNaive,
} from "@/hooks/useGamepadNaive";

const BUTTON_LABELS = ["×", "○", "□", "△"];

function subscribeNaiveLoops(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener("naive-loop-change", handler);
  return () => window.removeEventListener("naive-loop-change", handler);
}

export function NaiveHUD() {
  const loopCount = useSyncExternalStore(
    subscribeNaiveLoops,
    getNaivePollLoopCount,
    () => 0
  );

  const loopsRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const lxRef = useRef<HTMLSpanElement>(null);
  const lyRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (loopsRef.current) loopsRef.current.textContent = String(loopCount);
  }, [loopCount]);

  useGamepadNaive((state) => {
    if (statusRef.current) {
      statusRef.current.textContent = state.connected ? "connected" : "waiting…";
      statusRef.current.className = state.connected
        ? "text-green-400"
        : "text-amber-400";
    }
    if (lxRef.current) lxRef.current.textContent = state.leftStick.x.toFixed(2);
    if (lyRef.current) lyRef.current.textContent = state.leftStick.y.toFixed(2);
  });

  return (
    <div className="absolute top-4 left-4 z-10 max-w-sm rounded-lg border border-amber-500/30 bg-black/80 p-4 font-mono text-xs text-white shadow-xl backdrop-blur pointer-events-none">
      <div className="mb-2 border-b border-amber-500/20 pb-2">
        <span className="text-[10px] uppercase tracking-wider text-amber-400/90">
          Anti-pattern demo
        </span>
        <p className="mt-1 text-[10px] text-white/50">
          Cube + HUD each call <code className="text-amber-200">useGamepadNaive</code>
        </p>
      </div>
      <div className="text-amber-300">
        Poll loops: <span ref={loopsRef}>0</span>
        {loopCount >= 2 ? " ← wasteful" : ""}
      </div>
      <div className="mt-1">
        Status: <span ref={statusRef} className="text-amber-400">waiting…</span>
      </div>
      <div className="mt-2 text-white/60">
        L stick: <span ref={lxRef}>0.00</span>, <span ref={lyRef}>0.00</span>
      </div>
      <p className="mt-3 text-[10px] leading-relaxed text-white/45">
        Same inputs, double <code>getGamepads()</code> per frame. Compare with the
        main demo (1 loop, many subscribers).
      </p>
    </div>
  );
}
