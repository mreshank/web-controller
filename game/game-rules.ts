import { BOOST_PAD_VALUE, HAZARD_PENALTY, VAULT_SHIELDS_MAX } from "@/game/config";
import { orbDefs } from "@/game/orbs";
import { applyScoreDelta, orbScoreForId } from "@/game/state";

export type PlayerRuntime = {
  combo: number;
  lastCollectAt: number;
  slowUntil: number;
  shields: number;
};

const runtimes = new Map<number, PlayerRuntime>();

export type GameToast = {
  text: string;
  color: string;
  until: number;
};

export const gameToast: GameToast = { text: "", color: "#00e8cc", until: 0 };

function runtime(slot: number): PlayerRuntime {
  let r = runtimes.get(slot);
  if (!r) {
    r = {
      combo: 0,
      lastCollectAt: 0,
      slowUntil: 0,
      shields: VAULT_SHIELDS_MAX,
    };
    runtimes.set(slot, r);
  }
  return r;
}

export function resetRuntimes() {
  runtimes.clear();
}

export function getSlowFactor(slot: number, now = performance.now()): number {
  const r = runtimes.get(slot);
  if (!r || now >= r.slowUntil) return 1;
  return 0.45;
}

export function showToast(text: string, color = "#00e8cc", ms = 1600) {
  gameToast.text = text;
  gameToast.color = color;
  gameToast.until = performance.now() + ms;
  window.dispatchEvent(new CustomEvent("game-toast"));
}

export function collectOrb(slot: number, orbId: number): number {
  const r = runtime(slot);
  const now = performance.now();
  const golden = orbDefs[orbId]?.golden ?? false;
  const base = orbScoreForId(orbId);

  if (now - r.lastCollectAt < 2800) r.combo += 1;
  else r.combo = 1;
  r.lastCollectAt = now;

  const mult = Math.min(5, 1 + (r.combo - 1) * 0.35);
  const points = Math.round(base * mult);

  showToast(
    golden
      ? `+${points} GOLD${r.combo > 1 ? ` · ×${mult.toFixed(1)}` : ""}`
      : `+${points}${r.combo > 1 ? ` · combo ×${mult.toFixed(1)}` : ""}`,
    golden ? "#fbbf24" : "#fde047"
  );

  applyScoreDelta(slot, points);
  window.dispatchEvent(new CustomEvent("game-score"));

  return points;
}

export function hitHazard(slot: number): void {
  const r = runtime(slot);
  const now = performance.now();
  if (now < r.slowUntil + 400) return;

  r.combo = 0;
  r.slowUntil = now + 1100;

  let penalty = HAZARD_PENALTY;
  if (r.shields > 0) {
    r.shields -= 1;
    penalty = Math.round(penalty * 0.5);
    showToast(`Drone hit · shield −1 (−${penalty})`, "#fb7185", 1400);
  } else {
    showToast(`CRITICAL · −${penalty} · no shields`, "#f43f5e", 1800);
  }

  applyScoreDelta(slot, -penalty);
  window.dispatchEvent(
    new CustomEvent("game-hazard", { detail: { slot, penalty } })
  );
}

export function rewardBoostPad(slot: number): void {
  showToast(`Boost relay +${BOOST_PAD_VALUE}`, "#00e8cc", 900);
  applyScoreDelta(slot, BOOST_PAD_VALUE);
  window.dispatchEvent(
    new CustomEvent("game-score", { detail: { slot, boost: true } })
  );
}

export function getRuntimeSnapshot(slot: number) {
  return runtime(slot);
}

export function getCombo(slot: number) {
  return runtimes.get(slot)?.combo ?? 0;
}

export function getShields(slot: number) {
  return runtimes.get(slot)?.shields ?? VAULT_SHIELDS_MAX;
}
