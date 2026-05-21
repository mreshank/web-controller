# Gamepad × 3D Web Demo

Talk demo for **Breaking the DOM: Driving 3D Web Interfaces with Physical Gamepads** — HTML5 Gamepad API + React Three Fiber in Next.js.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Plug in a controller (EVOFOX USB or PS5 DualSense), **press any button** so the browser exposes the gamepad, then move sticks / face buttons / triggers.

## Controls

| Input | Effect |
|-------|--------|
| Left stick | Move cube on XZ plane |
| Right stick | Rotate |
| Face buttons (× ○ □ △) | Color |
| L2 / R2 | Scale |

## Two controllers

Connect DualSense + EVOFOX. Press a button on **each**. Each device gets a browser **slot index** (not always 0 and 1) — the HUD shows which slots are active; each connected slot gets its own cube.

## Stage backup

1. Record a clean run (OBS / QuickTime).
2. Save as `public/backup-demo.mp4`.
3. On stage if live demo fails: open `/backup` or press **B** from the main demo.

## Architecture (talk beats)

- **Single poll loop** — `GamepadProvider` calls `navigator.getGamepads()` once per frame; Cube + HUD subscribe via refs (no 60fps React re-renders on the scene).
- **Refs in `useFrame`** — gamepad state → mesh mutation, not `useState`.
- **Slot index** — never hardcode `pads[0]`; browsers assign arbitrary indices.

## Pack for May 23

- Laptop + charger + HDMI adapter
- PS5 controller + EVOFOX + USB-C cable
- Backup video in `public/backup-demo.mp4`, tab on `/backup`
