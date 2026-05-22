import {
  PLAY_CHAPTERS,
  PLAY_GOLDEN_ORBS,
  PLAY_MATCH_MS,
  PLAY_MAX_PLAYERS,
  PLAY_MIN_PLAYERS,
  PLAY_ORB_COUNT,
  PLAY_RANKS,
  PLAY_WORLD_HALF,
} from "@/lib/play/constants";

export type PlayInput = {
  ax: number;
  ay: number;
  rt: number;
  dash: boolean;
  camYaw: number;
};

export type PlayPlayerState = {
  uid: string;
  codename: string;
  slot: number;
  x: number;
  y: number;
  z: number;
  facing: number;
  score: number;
  combo: number;
  shields: number;
  rank: number;
  streak: number;
  relics: number;
  penaltyDebt: number;
  lastCollectAt: number;
  slowUntil: number;
  dashVx: number;
  dashVz: number;
  lastDash: number;
  padCooldown: Record<number, number>;
  connected: boolean;
};

export type OrbDef = { x: number; y: number; z: number; golden: boolean };

export type RoomPhase = "waiting" | "countdown" | "live" | "verdict";

export type RoomSnapshot = {
  roomId: string;
  phase: RoomPhase;
  phaseEndsAt: number;
  seed: number;
  chapterIndex: number;
  chapterTitle: string;
  chapterBlurb: string;
  collectedOrbs: number[];
  players: PlayPlayerState[];
  orbTotal: number;
  tick: number;
  teamRelics: number;
};

function seeded(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

export function terrainHeight(x: number, z: number): number {
  const a = Math.sin(x * 0.07) * Math.cos(z * 0.055) * 2.2;
  const b = Math.sin(x * 0.14 + z * 0.11) * 1.1;
  const c = Math.cos(x * 0.04 - z * 0.09) * 0.8;
  const edge = Math.max(Math.abs(x), Math.abs(z)) / PLAY_WORLD_HALF;
  const falloff = 1 - Math.min(1, edge * edge * 1.1);
  return (a + b + c) * falloff;
}

function clampToWorld(x: number, z: number): [number, number] {
  const m = PLAY_WORLD_HALF - 2;
  return [
    Math.max(-m, Math.min(m, x)),
    Math.max(-m, Math.min(m, z)),
  ];
}

export function buildOrbs(seed: number): OrbDef[] {
  const rnd = seeded(seed);
  return Array.from({ length: PLAY_ORB_COUNT }, (_, i) => {
    const golden = i >= PLAY_ORB_COUNT - PLAY_GOLDEN_ORBS;
    const x = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.5;
    const z = (rnd() - 0.5) * PLAY_WORLD_HALF * 1.5;
    const y = terrainHeight(x, z) + (golden ? 1.35 : 1.05);
    return { x, y, z, golden };
  });
}

const SPAWNS: Array<[number, number]> = [
  [-8, -8],
  [8, -8],
  [-8, 8],
  [8, 8],
];

const BOOST_PADS = [
  { x: 0, z: 0, r: 3 },
  { x: -16, z: 11, r: 2.6 },
  { x: 18, z: -12, r: 2.6 },
];

const HAZARD_T = [0, 0.33, 0.66];

export type RoomRuntime = {
  roomId: string;
  seed: number;
  phase: RoomPhase;
  phaseEndsAt: number;
  chapterIndex: number;
  orbs: OrbDef[];
  collected: Set<number>;
  players: Map<string, PlayPlayerState>;
  tick: number;
  teamRelics: number;
  hazardClock: number;
  toastQueue: Array<{ text: string; color: string }>;
};

export function createRoom(roomId: string, seed: number): RoomRuntime {
  return {
    roomId,
    seed,
    phase: "waiting",
    phaseEndsAt: 0,
    chapterIndex: 0,
    orbs: buildOrbs(seed),
    collected: new Set(),
    players: new Map(),
    tick: 0,
    teamRelics: 0,
    hazardClock: 0,
    toastQueue: [],
  };
}

export function snapshotRoom(r: RoomRuntime): RoomSnapshot {
  const ch = PLAY_CHAPTERS[r.chapterIndex] ?? PLAY_CHAPTERS[0]!;
  return {
    roomId: r.roomId,
    phase: r.phase,
    phaseEndsAt: r.phaseEndsAt,
    seed: r.seed,
    chapterIndex: r.chapterIndex,
    chapterTitle: ch.title,
    chapterBlurb: ch.blurb,
    collectedOrbs: [...r.collected],
    players: [...r.players.values()].sort((a, b) => a.slot - b.slot),
    orbTotal: r.orbs.length,
    tick: r.tick,
    teamRelics: r.teamRelics,
  };
}

function rankLabel(rank: number): string {
  return PLAY_RANKS[Math.min(PLAY_RANKS.length - 1, Math.max(0, rank))]!;
}

function applyRankDelta(p: PlayPlayerState, delta: number) {
  const next = p.rank + delta;
  p.rank = Math.max(0, Math.min(PLAY_RANKS.length - 1, next));
}

function collectOrb(
  r: RoomRuntime,
  p: PlayPlayerState,
  orbId: number,
  now: number
): number {
  const orb = r.orbs[orbId]!;
  const golden = orb.golden;
  const base = golden ? 55 : 12;

  if (now - p.lastCollectAt < 2800) p.combo += 1;
  else p.combo = 1;
  p.lastCollectAt = now;

  const mult = Math.min(6, 1 + (p.combo - 1) * 0.4 + p.streak * 0.08);
  let points = Math.round(base * mult);

  if (golden) {
    p.relics += 1;
    r.teamRelics += 1;
    points += 15;
    applyRankDelta(p, 1);
    p.streak += 1;
    r.toastQueue.push({
      text: `${p.codename} seized GOLD +${points}`,
      color: "#fbbf24",
    });
  } else {
    p.streak += 0.25;
    r.toastQueue.push({
      text: `${p.codename} +${points}${p.combo > 1 ? ` ×${mult.toFixed(1)}` : ""}`,
      color: "#fde047",
    });
  }

  p.score += points;
  return points;
}

function hazardHit(r: RoomRuntime, p: PlayPlayerState, now: number) {
  if (now < p.slowUntil + 400) return;
  p.combo = 0;
  p.streak = Math.max(0, p.streak - 1.5);
  p.slowUntil = now + 1200;

  let penalty = 22;
  if (p.shields > 0) {
    p.shields -= 1;
    penalty = Math.round(penalty * 0.45);
    r.toastQueue.push({
      text: `${p.codename} drone graze · shield −1`,
      color: "#fb7185",
    });
  } else {
    penalty = 35;
    applyRankDelta(p, -1);
    p.streak = 0;
    r.toastQueue.push({
      text: `${p.codename} BREACH TAX −${penalty}`,
      color: "#f43f5e",
    });
  }
  p.score = Math.max(0, p.score - penalty);
  p.penaltyDebt += penalty;
}

export function addPlayerToRoom(
  r: RoomRuntime,
  uid: string,
  codename: string
): PlayPlayerState | null {
  if (r.players.size >= PLAY_MAX_PLAYERS) return null;
  const used = new Set([...r.players.values()].map((p) => p.slot));
  let slot = 0;
  while (used.has(slot) && slot < PLAY_MAX_PLAYERS) slot++;
  if (slot >= PLAY_MAX_PLAYERS) return null;

  const [sx, sz] = SPAWNS[slot] ?? SPAWNS[0]!;
  const sy = terrainHeight(sx, sz) + 0.55;
  const p: PlayPlayerState = {
    uid,
    codename,
    slot,
    x: sx,
    y: sy,
    z: sz,
    facing: 0,
    score: 0,
    combo: 0,
    shields: 3,
    rank: 0,
    streak: 0,
    relics: 0,
    penaltyDebt: 0,
    lastCollectAt: 0,
    slowUntil: 0,
    dashVx: 0,
    dashVz: 0,
    lastDash: 0,
    padCooldown: {},
    connected: true,
  };
  r.players.set(uid, p);
  return p;
}

export function removePlayerFromRoom(r: RoomRuntime, uid: string) {
  r.players.delete(uid);
}

export function maybeStartCountdown(r: RoomRuntime, now: number) {
  if (r.phase !== "waiting") return;
  if (r.players.size < PLAY_MIN_PLAYERS) return;
  r.phase = "countdown";
  r.phaseEndsAt = now + 5000;
  r.toastQueue.push({
    text: `Breach team locked · ${r.players.size} runners`,
    color: "#00e8cc",
  });
}

export function advancePhase(r: RoomRuntime, now: number) {
  if (r.phase === "countdown" && now >= r.phaseEndsAt) {
    r.phase = "live";
    r.phaseEndsAt = now + PLAY_MATCH_MS;
    r.chapterIndex = 0;
    r.toastQueue.push({
      text: PLAY_CHAPTERS[0]!.title,
      color: "#38bdf8",
    });
  } else if (r.phase === "live" && now >= r.phaseEndsAt) {
    r.phase = "verdict";
    r.phaseEndsAt = now + 12_000;
    for (const p of r.players.values()) {
      if (p.relics >= 2) applyRankDelta(p, 1);
      if (p.score >= 200) applyRankDelta(p, 1);
      r.toastQueue.push({
        text: `${p.codename} closes as ${rankLabel(p.rank)} · ${p.score} pts`,
        color: "#a78bfa",
      });
    }
  } else if (r.phase === "live") {
    const elapsed = PLAY_MATCH_MS - (r.phaseEndsAt - now);
    const nextChapter = elapsed > PLAY_MATCH_MS * 0.66 ? 2 : elapsed > PLAY_MATCH_MS * 0.33 ? 1 : 0;
    if (nextChapter !== r.chapterIndex) {
      r.chapterIndex = nextChapter;
      const ch = PLAY_CHAPTERS[nextChapter]!;
      r.toastQueue.push({ text: ch.title, color: "#38bdf8" });
    }
  }
}

export function stepRoom(
  r: RoomRuntime,
  inputs: Map<string, PlayInput>,
  now: number,
  dt: number
) {
  r.tick += 1;
  advancePhase(r, now);

  if (r.phase !== "live") return;

  r.hazardClock += dt;
  const hazardPos = (t: number) => {
    const phase = (r.hazardClock * 0.15 + t) % 1;
    const x = Math.sin(phase * Math.PI * 2) * PLAY_WORLD_HALF * 0.55;
    const z = Math.cos(phase * Math.PI * 2 + t) * PLAY_WORLD_HALF * 0.45;
    return { x, z };
  };

  for (const p of r.players.values()) {
    const inp = inputs.get(p.uid);
    if (!inp) continue;

    const slow = now < p.slowUntil ? 0.42 : 1;
    const baseSpeed = (11 + inp.rt * 16) * slow;
    const yaw = inp.camYaw;
    let mx =
      (Math.sin(yaw) * inp.ay + Math.cos(yaw) * inp.ax) * baseSpeed * dt +
      p.dashVx * dt;
    let mz =
      (Math.cos(yaw) * inp.ay - Math.sin(yaw) * inp.ax) * baseSpeed * dt +
      p.dashVz * dt;

    if (Math.abs(mx) > 0.001 || Math.abs(mz) > 0.001) {
      p.facing = Math.atan2(mx, mz);
    }

    const [nx, nz] = clampToWorld(p.x + mx, p.z + mz);
    p.x = nx;
    p.z = nz;
    p.y = terrainHeight(nx, nz) + 0.55;

    p.dashVx *= Math.exp(-12 * dt);
    p.dashVz *= Math.exp(-12 * dt);

    if (inp.dash && now - p.lastDash > 850 && slow >= 0.85) {
      p.lastDash = now;
      p.dashVx = Math.sin(p.facing) * 22;
      p.dashVz = Math.cos(p.facing) * 22;
    }

    for (let i = 0; i < BOOST_PADS.length; i++) {
      const pad = BOOST_PADS[i]!;
      const dx = p.x - pad.x;
      const dz = p.z - pad.z;
      if (dx * dx + dz * dz < pad.r * pad.r) {
        const last = p.padCooldown[i] ?? 0;
        if (now - last > 2200) {
          p.padCooldown[i] = now;
          p.score += 10;
          p.streak += 0.5;
          r.toastQueue.push({
            text: `${p.codename} relay surge +10`,
            color: "#00e8cc",
          });
        }
      }
    }

    for (let i = 0; i < r.orbs.length; i++) {
      if (r.collected.has(i)) continue;
      const o = r.orbs[i]!;
      const dx = p.x - o.x;
      const dz = p.z - o.z;
      const rad = o.golden ? 1.55 : 1.2;
      if (dx * dx + dz * dz < rad * rad) {
        r.collected.add(i);
        collectOrb(r, p, i, now);
      }
    }

    for (const t of HAZARD_T) {
      const h = hazardPos(t);
      const dx = p.x - h.x;
      const dz = p.z - h.z;
      if (dx * dx + dz * dz < 2.8 * 2.8) hazardHit(r, p, now);
    }
  }
}

export function drainToasts(r: RoomRuntime) {
  const q = r.toastQueue.splice(0, r.toastQueue.length);
  return q;
}
