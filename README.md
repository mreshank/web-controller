# Gamepad × Web — Maximum Potential

Inspire a room with **Gamepad API + HTML5**: a talk demo, a multiplayer 3D game, a story world, and vanilla labs with almost no code.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the hub links to everything.

`html5/` is synced to `public/html5/` on `dev` and `build` (edit files in **`html5/`** at repo root).

## Experiences

| URL | Folder | What |
|-----|--------|------|
| `/` | `app/page.tsx` | Hub |
| `/demo` | `demo/` | 25-min talk: R3F cube, HUD, presenter tools |
| `/game` | `game/` | **Orb Rush** — up to 4 controllers, 3D arena, orbs |
| `/story` | `story/` | Fly through narrative beacons in **your order** |
| `/html5/…` | `html5/` | Vanilla demos (visualizer, canvas ship, CSS, Three CDN) |

## Shared (root)

- `lib/gamepad.ts` — parsing, slots, deadzone
- `context/GamepadProvider.tsx` — single poll loop
- `hooks/useGamepad.ts` — subscribers
- `components/shared/SceneShell.tsx` — R3F canvas shell

Feature folders (`game/`, `story/`, `demo/`) only contain what that experience needs.

## Presenter / talk

| URL | Purpose |
|-----|---------|
| `/stage` | Launcher + checklist |
| `/rehearse` | Timed 25-min run-through |
| `/code` | Source walkthrough tabs |
| `/naive` | Dual poll-loop anti-pattern |
| `/backup` | Pre-recorded fallback (`public/backup-demo.mp4`) |

Shortcuts on demo: **N** notes · **B** backup · **C** code · **S** stage · **R** rehearse · **F** fullscreen · **H** hide bar

## Suggested talk ending

1. Teach on `/demo` + `/code`  
2. Show `/naive` → production pattern  
3. **Finale:** `/game` with 2–4 controllers — let the audience play  
4. Optional: `/story` or `/html5` if time remains  

## Pack for stage

- Laptop + HDMI + USB-C for PS5
- Controllers charged, button press before each page
- `public/backup-demo.mp4` (gitignored)
- Bookmark `/stage` and `/game`
