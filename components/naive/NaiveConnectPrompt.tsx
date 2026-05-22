"use client";

import { useEffect, useState } from "react";

export function NaiveConnectPrompt() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    window.addEventListener("gamepadconnected", hide);
    return () => window.removeEventListener("gamepadconnected", hide);
  }, []);

  if (!visible) return null;

  return (
    <div className="gp-connect gp-pointer-none" style={{ zIndex: 20 }}>
      <div className="gp-connect__panel" style={{ borderColor: "rgba(251, 191, 36, 0.25)" }}>
        <p className="gp-connect__title">Plug in a controller</p>
        <p className="gp-connect__text">Press any button to activate (naive demo uses two poll loops)</p>
      </div>
    </div>
  );
}
