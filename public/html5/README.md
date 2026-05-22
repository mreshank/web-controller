# HTML5 Gamepad Lab (standalone)

**Not part of the Next.js bundle.** Plain HTML/CSS/JS you can copy, email, or host anywhere.

## Run (required for gamepads)

Gamepad API needs a secure context — use a local server, not `file://`:

```bash
cd html5
npx --yes serve . -p 3333
```

Open http://localhost:3333

## Files

| File | Description |
|------|-------------|
| `three-gamepad.html` | **Standalone** Three.js + gamepad — import map, no other deps |
| `visualizer.html` | Axes, buttons, all connected slots |
| `canvas-ship.html` | 2D canvas twin-stick ship |
| `css-driver.html` | DOM/CSS transforms only |
| `gamepad.js` | Optional shared helper for multi-page demos |

## Sync to Next.js

`npm run dev` copies this folder → `public/html5/` so http://localhost:3000/html5/ also works.

For talks, prefer **port 3333** so the audience sees these are zero-build demos.
