const ADMIN_KEY = "gp_admin_session";

export type AdminSession = {
  ok: true;
  exp: number;
};

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw) as AdminSession;
    return s.ok === true && s.exp > Date.now();
  } catch {
    return false;
  }
}

export function setAdminSession(days = 7): void {
  const exp = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(ADMIN_KEY, JSON.stringify({ ok: true, exp } satisfies AdminSession));
}

export function clearAdminSession(): void {
  localStorage.removeItem(ADMIN_KEY);
}
