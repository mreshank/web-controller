"use client";

import { useRef } from "react";
import { useGamepad } from "@/hooks/useGamepad";

const BUTTON_LABELS = ["×", "○", "□", "△"];

export function GamepadHUD() {
  const statusRef = useRef<HTMLSpanElement>(null);
  const idRef = useRef<HTMLSpanElement>(null);
  const lxRef = useRef<HTMLSpanElement>(null);
  const lyRef = useRef<HTMLSpanElement>(null);
  const rxRef = useRef<HTMLSpanElement>(null);
  const ryRef = useRef<HTMLSpanElement>(null);
  const l2Ref = useRef<HTMLSpanElement>(null);
  const r2Ref = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);

  useGamepad((state) => {
    if (statusRef.current) {
      statusRef.current.textContent = state.connected ? "connected" : "waiting…";
      statusRef.current.className = state.connected
        ? "text-green-400"
        : "text-amber-400";
    }
    if (idRef.current) idRef.current.textContent = state.id || "—";
    if (lxRef.current) lxRef.current.textContent = state.leftStick.x.toFixed(2);
    if (lyRef.current) lyRef.current.textContent = state.leftStick.y.toFixed(2);
    if (rxRef.current) rxRef.current.textContent = state.rightStick.x.toFixed(2);
    if (ryRef.current) ryRef.current.textContent = state.rightStick.y.toFixed(2);
    if (l2Ref.current) l2Ref.current.textContent = state.triggers.left.toFixed(2);
    if (r2Ref.current) r2Ref.current.textContent = state.triggers.right.toFixed(2);
    if (btnRef.current) {
      const pressed = state.buttons
        .map((b, i) => (b && i < 4 ? BUTTON_LABELS[i] : b ? String(i) : null))
        .filter((label) => label !== null);
      btnRef.current.textContent = pressed.length ? pressed.join(" ") : "—";
    }
  });

  return (
    <div className="absolute top-4 left-4 z-10 max-w-xs rounded-lg border border-white/10 bg-black/75 p-4 font-mono text-xs text-white shadow-xl backdrop-blur pointer-events-none">
      <div className="mb-2 border-b border-white/10 pb-2 text-[10px] uppercase tracking-wider text-white/50">
        Gamepad API · live
      </div>
      <div>
        Status: <span ref={statusRef} className="text-amber-400">waiting…</span>
      </div>
      <div className="truncate text-white/70">
        Device: <span ref={idRef}>—</span>
      </div>
      <div className="mt-2 space-y-0.5">
        <div>
          L stick: <span ref={lxRef}>0.00</span>, <span ref={lyRef}>0.00</span>
        </div>
        <div>
          R stick: <span ref={rxRef}>0.00</span>, <span ref={ryRef}>0.00</span>
        </div>
        <div>
          L2: <span ref={l2Ref}>0.00</span> · R2: <span ref={r2Ref}>0.00</span>
        </div>
        <div>
          Buttons: <span ref={btnRef}>—</span>
        </div>
      </div>
    </div>
  );
}
