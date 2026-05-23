# Vanilla Web Dev Lab

**HTML + CSS + JS + Gamepad** — no framework, no build step. Each file is one idea you can teach or copy into a project.

## Run

```bash
# From repo root (synced to public/vanilla on npm run dev)
http://localhost:3000/vanilla/

# Or standalone
cd vanilla
npx --yes serve . -p 3340
```

Requires **http://** (not `file://`). Press a button on the controller after load.

## Shared assets

- Styles: `https://static.mreshank.com/gamepad/styles.css` (or `/gamepad/styles.css` locally)
- Input: `/html5/gamepad.js` → `GamepadHTML5.poll()`
- Helpers: `vanilla.js` → `VanillaLab.stickDir()`, `allSlots()`, rumble

## vs HTML5 Lab

| HTML5 Lab (`/html5/`) | Vanilla Lab (`/vanilla/`) |
|----------------------|---------------------------|
| Canvas, WebGL, games | **Web UI patterns** — focus, scroll, CSS vars, media UI |
| Graphics-forward | **Architecture-forward** — what product teams ship daily |
