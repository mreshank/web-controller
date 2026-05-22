import type { RoomSnapshot } from "@/lib/play/simulation";

export type OnlinePlayer = {
  uid: string;
  codename: string;
  roomId: string | null;
};

export type ClientMessage =
  | { type: "hello"; uid: string; codename: string }
  | { type: "input"; ax: number; ay: number; rt: number; dash: boolean; camYaw: number };

export type ServerMessage =
  | { type: "welcome"; uid: string; online: OnlinePlayer[] }
  | { type: "lobby"; online: OnlinePlayer[]; queue: number }
  | { type: "room"; snapshot: RoomSnapshot }
  | { type: "toast"; text: string; color?: string }
  | { type: "verdict"; ranks: Array<{ uid: string; codename: string; score: number; rank: string }> }
  | { type: "error"; message: string };

export function playWsUrl(): string {
  if (typeof window === "undefined") return "";
  const env = process.env.NEXT_PUBLIC_PLAY_WS_URL;
  if (env) return env;
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.hostname;
  const port = process.env.NEXT_PUBLIC_PLAY_WS_PORT ?? "3001";
  if (host === "localhost" || host === "127.0.0.1") {
    return `${proto}//${host}:${port}`;
  }
  return `${proto}//${host}/ws/play`;
}
