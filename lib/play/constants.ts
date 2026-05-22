export const PLAY_MIN_PLAYERS = 2;
export const PLAY_MAX_PLAYERS = 4;
export const PLAY_COUNTDOWN_MS = 5000;
export const PLAY_MATCH_MS = 180_000;
export const PLAY_TICK_HZ = 20;
export const PLAY_ORB_COUNT = 32;
export const PLAY_GOLDEN_ORBS = 5;

export const PLAY_WORLD_HALF = 48;

export const PLAY_RANKS = [
  "Drifter",
  "Scout",
  "Raider",
  "Vault Knight",
  "Nexus Ace",
  "Legend",
] as const;

export const PLAY_CHAPTERS = [
  {
    id: "infiltration",
    title: "Act I — Infiltration",
    blurb: "The breach is live. Harvest unstable relics before patrol drones tax your rank.",
  },
  {
    id: "harvest",
    title: "Act II — Harvest Storm",
    blurb: "Relic density spikes. Chain pickups or lose your streak multiplier.",
  },
  {
    id: "extraction",
    title: "Act III — Extraction",
    blurb: "Vault seals in moments. Golden relics decide who escapes with legend status.",
  },
] as const;

export const PLAYER_COLORS = ["#f97316", "#38bdf8", "#a78bfa", "#4ade80"] as const;
