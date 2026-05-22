/**
 * Gamepad HTML5 helper — zero dependencies.
 * Works when served over http:// (required for gamepad in most browsers).
 */
(function (global) {
  const DEADZONE = 0.1;
  const apply = (v) => (Math.abs(v) < DEADZONE ? 0 : v);

  function primaryPad() {
    if (!navigator.getGamepads) return null;
    const pads = navigator.getGamepads();
    for (let i = 0; i < pads.length; i++) {
      const p = pads[i];
      if (p && p.connected) return p;
    }
    return null;
  }

  function readState() {
    const gp = primaryPad();
    if (!gp) return { connected: false };
    return {
      connected: true,
      id: gp.id,
      index: gp.index,
      lx: apply(gp.axes[0] ?? 0),
      ly: apply(gp.axes[1] ?? 0),
      rx: apply(gp.axes[2] ?? 0),
      ry: apply(gp.axes[3] ?? 0),
      l2: gp.buttons[6]?.value ?? 0,
      r2: gp.buttons[7]?.value ?? 0,
      buttons: Array.from(gp.buttons, (b) => b.pressed),
    };
  }

  function poll(callback) {
    let raf = 0;
    const tick = () => {
      callback(readState());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("gamepadconnected", () => callback(readState()));
    window.addEventListener("gamepaddisconnected", () => callback(readState()));
    return () => cancelAnimationFrame(raf);
  }

  global.GamepadHTML5 = { poll, primaryPad, readState, apply };
})(window);
