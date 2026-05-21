/** Shared helpers — zero deps. Include in every html5 demo. */
(function (global) {
  const DEADZONE = 0.1;
  const apply = (v) => (Math.abs(v) < DEADZONE ? 0 : v);

  function primaryPad() {
    const pads = navigator.getGamepads?.() || [];
    return pads.find((p) => p && p.connected) || null;
  }

  function poll(callback) {
    let id = 0;
    const tick = () => {
      const gp = primaryPad();
      callback(
        gp
          ? {
              connected: true,
              id: gp.id,
              lx: apply(gp.axes[0] ?? 0),
              ly: apply(gp.axes[1] ?? 0),
              rx: apply(gp.axes[2] ?? 0),
              ry: apply(gp.axes[3] ?? 0),
              buttons: gp.buttons.map((b) => b.pressed),
            }
          : { connected: false }
      );
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    window.addEventListener("gamepadconnected", () => {});
    return () => cancelAnimationFrame(id);
  }

  global.GamepadHTML5 = { poll, primaryPad, apply };
})(window);
