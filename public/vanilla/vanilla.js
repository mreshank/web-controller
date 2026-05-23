/**
 * Vanilla Web Dev Lab — chrome, navigation, gamepad helpers.
 * Requires /html5/gamepad.js (GamepadHTML5).
 */
(function (global) {
  const DEAD = 0.55;
  const STYLES_LOCAL = "/gamepad/styles.css";
  const STYLES_CDN = "https://static.mreshank.com/gamepad/styles.css";
  const FONTS =
    "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=IBM+Plex+Mono:wght@400;500;600&family=Syne:wght@500;600;700;800&display=swap";

  let chromeNavIdx = 0;
  let cardIdx = 0;
  let stickCooldown = 0;
  let prevButtons = [];

  function onNextApp() {
    return location.port === "3000";
  }

  function hubHref() {
    return onNextApp() ? "/" : "http://localhost:3000/";
  }

  function labHref() {
    return onNextApp() ? "/vanilla" : new URL("index.html", location.href).pathname;
  }

  function html5Href() {
    return onNextApp() ? "/html5/index.html" : "/html5/index.html";
  }

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

  function stickDir(x, y, threshold = DEAD) {
    if (Math.hypot(x, y) < threshold) return null;
    if (Math.abs(x) > Math.abs(y)) return x > 0 ? "right" : "left";
    return y > 0 ? "down" : "up";
  }

  function pulseVibration(ms = 80, weak = 0.4, strong = 0.9) {
    const gp = global.GamepadHTML5?.primaryPad?.();
    const act = gp?.vibrationActuator;
    if (act?.playEffect) {
      act.playEffect("dual-rumble", {
        duration: ms,
        weakMagnitude: weak,
        strongMagnitude: strong,
      });
    }
  }

  function ensureAssets() {
    if (!document.querySelector('link[data-gp-fonts]')) {
      const pre1 = document.createElement("link");
      pre1.rel = "preconnect";
      pre1.href = "https://fonts.googleapis.com";
      document.head.appendChild(pre1);
      const pre2 = document.createElement("link");
      pre2.rel = "preconnect";
      pre2.href = "https://fonts.gstatic.com";
      pre2.crossOrigin = "anonymous";
      document.head.appendChild(pre2);
      const font = document.createElement("link");
      font.rel = "stylesheet";
      font.href = FONTS;
      font.dataset.gpFonts = "1";
      document.head.appendChild(font);
    }
    const existing = document.querySelector('link[data-gp-styles]');
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = STYLES_LOCAL;
    link.dataset.gpStyles = "1";
    link.onerror = () => {
      link.href = STYLES_CDN;
    };
    document.head.appendChild(link);
  }

  function mountChrome(opts) {
    const { title = "Demo", home = false } = opts;
    if (document.getElementById("gp-vanilla-chrome")) return;

    document.body.classList.add("gp-root", "gp-vanilla", "gp-vanilla--chromed");

    const header = document.createElement("header");
    header.id = "gp-vanilla-chrome";
    header.className = "gp-vanilla-chrome";
    header.innerHTML = `
      <div class="gp-vanilla-chrome__inner">
        <nav class="gp-vanilla-chrome__crumbs" aria-label="Lab navigation">
          <a href="${hubHref()}" class="gp-vanilla-chrome__crumb" data-chrome-nav="0">Hub</a>
          <span class="gp-vanilla-chrome__sep" aria-hidden="true">/</span>
          <a href="${labHref()}" class="gp-vanilla-chrome__crumb" data-chrome-nav="1">Vanilla Lab</a>
          <span class="gp-vanilla-chrome__sep" aria-hidden="true">/</span>
          <span class="gp-vanilla-chrome__current">${title}</span>
        </nav>
        <p id="gp-vanilla-status" class="gp-vanilla-chrome__status">Press any button on your controller…</p>
        <p class="gp-vanilla-chrome__hint">
          <span class="gp-vanilla-chrome__pill">Start</span> Hub
          <span class="gp-vanilla-chrome__pill">Select</span> Lab
          ${home ? '<span class="gp-vanilla-chrome__pill">Stick</span> pick · <span class="gp-vanilla-chrome__pill">×</span> open · <span class="gp-vanilla-chrome__pill">○</span> Hub' : '<span class="gp-vanilla-chrome__pill">○</span> back to lab'}
        </p>
      </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);

    const crumbs = header.querySelectorAll("[data-chrome-nav]");
    const setNavFocus = () => {
      crumbs.forEach((el, i) => {
        el.classList.toggle("is-focus", !home && chromeNavIdx === i);
      });
    };
    setNavFocus();

    return { setNavFocus, crumbs };
  }

  function wireCardGrid(selector) {
    const root = document.querySelector(selector);
    if (!root) return;
    const cards = [...root.querySelectorAll("a.gp-card, .gp-card")];
    if (!cards.length) return;

    const cols = window.matchMedia("(min-width: 900px)").matches ? 3 : 2;

    const paint = () => {
      cards.forEach((c, i) => {
        c.classList.toggle("is-focus", i === cardIdx);
        if (i === cardIdx) c.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    };
    paint();

    return { cards, cols, paint };
  }

  function initPage(opts) {
    const { title = "Demo", home = false } = opts;
    ensureAssets();
    const chrome = mountChrome({ title, home });

    let grid = null;
    if (home) {
      grid = wireCardGrid(".gp-card-grid");
      document.querySelectorAll(".gp-vanilla-footer__link").forEach((el, i) => {
        el.dataset.footerNav = String(i);
      });
    }

    const stop = global.GamepadHTML5?.poll?.((s) => {
      const status = document.getElementById("gp-vanilla-status");
      if (status) {
        status.textContent = s.connected
          ? `Connected: ${s.id}`
          : "Plug in controller & press any button";
        status.classList.toggle("is-ok", s.connected);
      }

      if (!s.connected) {
        prevButtons = [];
        return;
      }

      const btns = s.buttons;
      const prev = prevButtons;
      prevButtons = btns.slice();
      const edge = (idx) => Boolean(btns[idx]) && !Boolean(prev[idx]);

      if (edge(9)) {
        pulseVibration(40, 0.2, 0.5);
        location.href = hubHref();
        return;
      }
      if (edge(8)) {
        pulseVibration(40, 0.2, 0.5);
        location.href = labHref();
        return;
      }
      if (edge(1)) {
        pulseVibration(40, 0.2, 0.5);
        if (!home) {
          location.href = labHref();
          return;
        }
        location.href = hubHref();
        return;
      }

      const now = performance.now();
      if (now < stickCooldown) return;

      if (home && grid) {
        const dir = stickDir(s.lx, s.ly);
        if (dir) {
          stickCooldown = now + 180;
          const { cards, cols, paint } = grid;
          const row = Math.floor(cardIdx / cols);
          const col = cardIdx % cols;
          let nr = row;
          let nc = col;
          if (dir === "left") nc = Math.max(0, col - 1);
          if (dir === "right") nc = Math.min(cols - 1, col + 1);
          if (dir === "up") nr = Math.max(0, row - 1);
          if (dir === "down") nr = Math.min(Math.ceil(cards.length / cols) - 1, row + 1);
          const next = Math.min(cards.length - 1, Math.max(0, nr * cols + nc));
          if (next !== cardIdx) {
            cardIdx = next;
            pulseVibration(30, 0.15, 0.35);
            paint();
          }
        }
        if (edge(0)) {
          const target = grid.cards[cardIdx];
          if (target?.href) {
            pulseVibration(50, 0.3, 0.6);
            location.href = target.href;
          }
        }
      } else if (!home && chrome) {
        const dir = stickDir(s.lx, s.ly);
        if (dir === "left" || dir === "right") {
          stickCooldown = now + 220;
          chromeNavIdx = dir === "left" ? 0 : 1;
          chrome.setNavFocus();
          pulseVibration(30, 0.15, 0.35);
        }
        if (edge(0)) {
          const link = chrome.crumbs[chromeNavIdx];
          if (link?.href) {
            pulseVibration(50, 0.3, 0.6);
            location.href = link.href;
          }
        }
      }
    });

    return stop;
  }

  global.VanillaLab = {
    allSlots,
    stickDir,
    pulseVibration,
    DEAD,
    hubHref,
    labHref,
    html5Href,
    ensureAssets,
    mountChrome,
    wireCardGrid,
    initPage,
  };
})(window);
