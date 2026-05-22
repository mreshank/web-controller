const UID_KEY = "gp_play_uid";
const NAME_KEY = "gp_play_codename";

const CONS = "BCDFGHJKLMNPQRSTVWXYZ";
const VOW = "aeiouy";

function randomChunk(len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    const pool = i % 2 === 0 ? CONS : VOW;
    s += pool[Math.floor(Math.random() * pool.length)]!;
  }
  return s;
}

/** Six-character codename tied to uid (stable after first assign). */
export function codenameForUid(uid: string): string {
  let h = 0;
  for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) >>> 0;
  let out = "";
  for (let i = 0; i < 6; i++) {
    h = (h * 16807 + 12345) >>> 0;
    const pool = i % 2 === 0 ? CONS : VOW;
    out += pool[h % pool.length]!;
  }
  return out;
}

export type PlayIdentity = {
  uid: string;
  codename: string;
};

export function getOrCreatePlayIdentity(): PlayIdentity {
  if (typeof window === "undefined") {
    return { uid: "ssr", codename: "------" };
  }
  let uid = localStorage.getItem(UID_KEY);
  if (!uid) {
    uid = crypto.randomUUID();
    localStorage.setItem(UID_KEY, uid);
  }
  let codename = localStorage.getItem(NAME_KEY);
  if (!codename) {
    codename = codenameForUid(uid);
    localStorage.setItem(NAME_KEY, codename);
  }
  return { uid, codename };
}

export function rerollCodename(): PlayIdentity {
  const uid = crypto.randomUUID();
  localStorage.setItem(UID_KEY, uid);
  const codename = codenameForUid(uid);
  localStorage.setItem(NAME_KEY, codename);
  return { uid, codename };
}
