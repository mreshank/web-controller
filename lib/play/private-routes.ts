/** Presenter / internal routes — only surfaced when admin session is valid. */
export const PRIVATE_TOOL_CHIPS = [
  { href: "/stage", label: "Stage hub" },
  { href: "/rehearse", label: "Rehearsal" },
  { href: "/code", label: "Code" },
  { href: "/naive", label: "Naive loops" },
  { href: "/backup", label: "Backup" },
] as const;

/** Admin-only launcher entry (never on public hub cards). */
export const ADMIN_ONLY_ROUTES = [
  {
    href: "/play",
    label: "Nexus Breach (online)",
    mod: "gp-stage-card--fuchsia",
    desc: "Live multiplayer vault run — 2–4 runners per breach room.",
    keys: "Controller required · AUTH for launcher",
  },
] as const;
