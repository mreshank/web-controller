export const WORLD_HALF = 52;

/** @deprecated use WORLD_HALF */
export const ARENA_HALF = WORLD_HALF;

export const PLAYER_COLORS = ["#f97316", "#38bdf8", "#a78bfa", "#4ade80"] as const;

export const PLAYER_LABELS = ["P1", "P2", "P3", "P4"] as const;

export const ORB_COUNT = 36;
export const GOLDEN_ORB_COUNT = 6;

export const ORB_VALUE = 10;
export const GOLDEN_ORB_VALUE = 50;

export const BOOST_PAD_VALUE = 8;
export const HAZARD_PENALTY = 20;

export const VAULT_SHIELDS_MAX = 3;

export const CAMERA_MIN_PITCH = 0.25;
export const CAMERA_MAX_PITCH = 1.05;
export const CAMERA_MIN_DISTANCE = 9;
export const CAMERA_MAX_DISTANCE = 28;
export const CAMERA_DEFAULT_DISTANCE = 15;

export const DASH_COOLDOWN_MS = 850;
export const DASH_IMPULSE = 24;

export const GAME_MISSION =
  "Vault Run — harvest unstable orbs before patrol drones tax your score. Chain pickups for combo multipliers. Teal relays boost speed. Shields absorb drone hits.";
