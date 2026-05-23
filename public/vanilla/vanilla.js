/**
 * Vanilla Web Dev Lab helpers — use with /html5/gamepad.js (GamepadHTML5).
 */
(function (global) {
  const DEAD = 0.55;

  function allSlots() {
    if (!navigator.getGamepads) return [];
    const pads = navigator.getGamepads();
    const out = [];
    for (let i = 0; i < pads.length; i++) {
      const p = pads[i];
      if (p?.connected) {
        out.push({
          index: p.index,
          id: p.id,
          lx: global.GamepadHTML5.apply(p.axes[0] ?? 0),
          ly: global.GamepadHTML5.apply(p.axes[1] ?? 0),
          rx: global.GamepadHTML5.apply(p.axes[2] ?? 0),
          ry: global.GamepadHTML5.apply(p.axes[3] ?? 0),
          buttons: Array.from(p.buttons, (b) => b.pressed),
        });
      }
    }
    return out;
  }

  /** One-shot cardinal direction from stick (null if neutral). */
  function stickDir(x, y, threshold = DEAD) {
    if (Math.hypot(x, y) < threshold) return null;
    if (Math.abs(x) > Math.abs(y)) return x > 0 ? "right" : "left";
    return y > 0 ? "down" : "up";
  }

  function pulseVibration(ms = 80, weak = 0.4, strong = 0.9) {
    const gp = global.GamepadHTML5?.primaryPad?.();
    const act = gp?.vibrationActuator;
    if (act?.playEffect) {
      act.playEffect("dual-rumble", { duration: ms, weakMagnitude: weak, strongMagnitude: strong });
    }
  }

  global.VanillaLab = { allSlots, stickDir, pulseVibration, DEAD };
})(window);
