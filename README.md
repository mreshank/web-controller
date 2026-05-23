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
| `/portfolio` | `portfolio/` | **3D walkable portfolio** — Eshank Tyagi story beacons |
| `/demo` | `demo/` | 25-min talk: R3F cube, HUD, presenter tools |
| `/game` | `game/` | **Orb Rush** — up to 4 controllers, 3D arena, orbs |
| `/story` | `story/` | Fly through narrative beacons in **your order** |
| `/vanilla` | `vanilla/` | **Vanilla Web Dev Lab** — focus UI, CSS vars, scroll, media remote, slots |
| `/html5/…` | `html5/` | HTML5 graphics lab (canvas, CSS driver, Three CDN) |

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

## Master stylesheet (logic-only reuse)

**Source of truth:** `styles/gamepad.css` — synced to `public/gamepad/styles.css` on `npm run dev` / `npm run build`.

**CDN (production):** `https://static.mreshank.com/gamepad/styles.css`

### Publish to static.mreshank.com

1. Upload `styles/gamepad.css` (or the synced `public/gamepad/styles.css`) to your static host at path `/gamepad/styles.css`.
2. Ensure `Cache-Control` allows updates when you ship design changes (or version the URL, e.g. `styles.v2.css`).
3. In any HTML page, load fonts + stylesheet and use `gp-*` classes — write only gamepad logic:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:...&family=IBM+Plex+Mono...&family=Syne..." rel="stylesheet" />
<link rel="stylesheet" href="https://static.mreshank.com/gamepad/styles.css" />
<body class="gp-root">
```

4. Copy markup patterns from `components/hub/HubPage.tsx`, `html5/index.html`, or presenter pages. Prefix every class with `gp-` (hub, HUD, cards, connect prompt, rehearse, stage, html5 lab).

**This Next app:** dev uses `/gamepad/styles.css` locally; production uses the CDN (`lib/stylesheet.ts`). Override with `NEXT_PUBLIC_GP_STYLESHEET=/gamepad/styles.css` to force local in prod builds.

**HTML5 folder:** demos link the CDN directly so they work from `npx serve html5` without Next.js. Until the file is uploaded, swap the `href` to `http://localhost:3000/gamepad/styles.css` while `npm run dev` is running.
