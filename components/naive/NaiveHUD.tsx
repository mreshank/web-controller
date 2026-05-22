"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import {
  getNaivePollLoopCount,
  useGamepadNaive,
} from "@/hooks/useGamepadNaive";

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
        ? "gp-status--ok"
        : "gp-status--wait";
    }
    if (lxRef.current) lxRef.current.textContent = state.leftStick.x.toFixed(2);
    if (lyRef.current) lyRef.current.textContent = state.leftStick.y.toFixed(2);
  });

  return (
    <div className="gp-hud gp-hud--naive">
      <div className="gp-hud__head">
        <span className="gp-hud__label">Anti-pattern</span>
      </div>
      <p className="gp-hud__line gp-status--warn">
        Poll loops: <span ref={loopsRef}>0</span>
        {loopCount >= 2 ? " — wasteful" : ""}
      </p>
      <p className="gp-hud__line">
        Status: <span ref={statusRef} className="gp-status--wait">waiting…</span>
      </p>
      <p className="gp-hud__line">
        L stick: <span ref={lxRef}>0.00</span>, <span ref={lyRef}>0.00</span>
      </p>
      <p className="gp-hud__meta" style={{ marginTop: "0.5rem" }}>
        Cube + HUD each spin their own RAF
      </p>
    </div>
  );
}
