"use client";

import { useRef, useEffect } from "react";
import {
  useGamepad,
  useConnectedGamepadCount,
  useConnectedSlotIndexes,
  useSubscriberCount,
} from "@/hooks/useGamepad";

const BUTTON_LABELS = ["×", "○", "□", "△"];

function formatButtons(buttons: boolean[]) {
  return buttons
    .map((b, i) =>
      b && i < 4 ? BUTTON_LABELS[i] : b ? String(i) : null
    )
    .filter((label) => label !== null)
    .join(" ");
}

export function GamepadHUD() {
  const connectedCount = useConnectedGamepadCount();
  const connectedSlots = useConnectedSlotIndexes();
  const subscriberCount = useSubscriberCount();

  const statusRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const idRef = useRef<HTMLSpanElement>(null);
  const lxRef = useRef<HTMLSpanElement>(null);
  const lyRef = useRef<HTMLSpanElement>(null);
  const rxRef = useRef<HTMLSpanElement>(null);
  const ryRef = useRef<HTMLSpanElement>(null);
  const l2Ref = useRef<HTMLSpanElement>(null);
  const r2Ref = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);
  const slotsRef = useRef<HTMLDivElement>(null);
  const subsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (countRef.current) countRef.current.textContent = String(connectedCount);
    if (subsRef.current) subsRef.current.textContent = String(subscriberCount);
  }, [connectedCount, subscriberCount]);

  useEffect(() => {
    if (!slotsRef.current) return;
    slotsRef.current.textContent =
      connectedSlots.length > 1
        ? `also on slots: ${connectedSlots.join(", ")}`
        : "";
  }, [connectedSlots]);

  useGamepad((state) => {
    if (statusRef.current) {
      statusRef.current.textContent = state.connected ? "connected" : "waiting…";
      statusRef.current.className = state.connected
        ? "gp-status--ok"
        : "gp-status--wait";
    }
    if (idRef.current) idRef.current.textContent = state.id || "—";
    if (lxRef.current) lxRef.current.textContent = state.leftStick.x.toFixed(2);
    if (lyRef.current) lyRef.current.textContent = state.leftStick.y.toFixed(2);
    if (rxRef.current) rxRef.current.textContent = state.rightStick.x.toFixed(2);
    if (ryRef.current) ryRef.current.textContent = state.rightStick.y.toFixed(2);
    if (l2Ref.current) l2Ref.current.textContent = state.triggers.left.toFixed(2);
    if (r2Ref.current) r2Ref.current.textContent = state.triggers.right.toFixed(2);
    if (btnRef.current) {
      btnRef.current.textContent = state.connected
        ? formatButtons(state.buttons) || "—"
        : "—";
    }
  });

  return (
    <div className="gp-hud">
      <div className="gp-hud__head">
        <span className="gp-hud__label">
          1 loop · <span ref={subsRef}>0</span> subscribers
        </span>
        <span className="gp-hud__meta">
          <span ref={countRef}>0</span> pad{connectedCount === 1 ? "" : "s"}
        </span>
      </div>
      <div className="gp-hud__line">
        Primary: <span ref={statusRef} className="gp-status--wait">waiting…</span>
      </div>
      <div className="gp-hud__device">
        Device: <span ref={idRef}>—</span>
      </div>
      <div ref={slotsRef} className="gp-hud__slots" />
      <div className="gp-hud__line" style={{ marginTop: "0.5rem" }}>
        L stick: <span ref={lxRef}>0.00</span>, <span ref={lyRef}>0.00</span>
      </div>
      <div className="gp-hud__line">
        R stick: <span ref={rxRef}>0.00</span>, <span ref={ryRef}>0.00</span>
      </div>
      <div className="gp-hud__line">
        L2: <span ref={l2Ref}>0.00</span> · R2: <span ref={r2Ref}>0.00</span>
      </div>
      <div className="gp-hud__line">
        Buttons: <span ref={btnRef}>—</span>
      </div>
    </div>
  );
}
