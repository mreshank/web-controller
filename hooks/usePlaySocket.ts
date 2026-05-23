"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOrCreatePlayIdentity } from "@/lib/play/identity";
import type { ClientMessage, OnlinePlayer, ServerMessage } from "@/lib/play/protocol";
import { playWsUrl } from "@/lib/play/protocol";
import type { RoomSnapshot } from "@/lib/play/simulation";
import { playRoomRef, setPlayRoom } from "@/play/play-room-store";

export type VerdictRank = {
  uid: string;
  codename: string;
  score: number;
  rank: string;
};

/** HUD-only state — throttled; never drives the 3D canvas per frame. */
export type PlayHudState = {
  connected: boolean;
  online: OnlinePlayer[];
  queue: number;
  roomMeta: {
    roomId: string;
    seed: number;
    phase: RoomSnapshot["phase"];
    chapterTitle: string;
    chapterBlurb: string;
    orbCollected: number;
    orbTotal: number;
    teamRelics: number;
    phaseEndsAt: number;
    playerCount: number;
  } | null;
  localStats: {
    score: number;
    rank: number;
    streak: number;
    relics: number;
    shields: number;
    penaltyDebt: number;
  } | null;
  toast: { text: string; color: string } | null;
  verdict: VerdictRank[] | null;
  error: string | null;
};

const HUD_INTERVAL_MS = 250;

function buildHudFromRoom(
  room: RoomSnapshot | null,
  uid: string
): Pick<PlayHudState, "roomMeta" | "localStats"> {
  if (!room) return { roomMeta: null, localStats: null };
  const local = room.players.find((p) => p.uid === uid);
  return {
    roomMeta: {
      roomId: room.roomId,
      seed: room.seed,
      phase: room.phase,
      chapterTitle: room.chapterTitle,
      chapterBlurb: room.chapterBlurb,
      orbCollected: room.collectedOrbs.length,
      orbTotal: room.orbTotal,
      teamRelics: room.teamRelics,
      phaseEndsAt: room.phaseEndsAt,
      playerCount: room.players.length,
    },
    localStats: local
      ? {
          score: local.score,
          rank: local.rank,
          streak: local.streak,
          relics: local.relics,
          shields: local.shields,
          penaltyDebt: local.penaltyDebt,
        }
      : null,
  };
}

export function usePlaySocket(sendInput: () => ClientMessage | null) {
  const [hud, setHud] = useState<PlayHudState>({
    connected: false,
    online: [],
    queue: 0,
    roomMeta: null,
    localStats: null,
    toast: null,
    verdict: null,
    error: null,
  });
  const wsRef = useRef<WebSocket | null>(null);
  const identityRef = useRef(getOrCreatePlayIdentity());
  const hudDirtyRef = useRef(true);

  const flushHud = useCallback(() => {
    if (!hudDirtyRef.current) return;
    hudDirtyRef.current = false;
    const room = playRoomRef.current;
    const uid = identityRef.current.uid;
    const partial = buildHudFromRoom(room, uid);
    setHud((s) => ({ ...s, ...partial }));
  }, []);

  useEffect(() => {
    const id = setInterval(flushHud, HUD_INTERVAL_MS);
    return () => clearInterval(id);
  }, [flushHud]);

  useEffect(() => {
    const url = playWsUrl();
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      const id = identityRef.current;
      ws.send(JSON.stringify({ type: "hello", uid: id.uid, codename: id.codename } satisfies ClientMessage));
      setHud((s) => ({ ...s, connected: true, error: null }));
    };

    ws.onmessage = (ev) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as ServerMessage;
      } catch {
        return;
      }

      const uid = identityRef.current.uid;

      switch (msg.type) {
        case "welcome":
          setHud((s) => ({ ...s, online: msg.online }));
          break;
        case "lobby":
          setHud((s) => ({ ...s, online: msg.online, queue: msg.queue }));
          break;
        case "room":
          setPlayRoom(msg.snapshot);
          hudDirtyRef.current = true;
          setHud((s) => ({
            ...s,
            ...buildHudFromRoom(msg.snapshot, uid),
            verdict: null,
          }));
          break;
        case "toast":
          setHud((s) => ({
            ...s,
            toast: { text: msg.text, color: msg.color ?? "#00e8cc" },
          }));
          break;
        case "verdict":
          setHud((s) => ({ ...s, verdict: msg.ranks }));
          break;
        case "error":
          setHud((s) => ({ ...s, error: msg.message }));
          break;
        default:
          break;
      }
    };

    ws.onclose = () => {
      setPlayRoom(null);
      setHud((s) => ({ ...s, connected: false, roomMeta: null, localStats: null }));
      wsRef.current = null;
    };

    ws.onerror = () => {
      setHud((s) => ({
        ...s,
        error: "Cannot reach breach server — check NEXT_PUBLIC_PLAY_WS_URL",
      }));
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const payload = sendInput();
      if (payload) ws.send(JSON.stringify(payload));
    }, 1000 / 15);
    return () => clearInterval(id);
  }, [sendInput]);

  const reconnect = useCallback(() => {
    wsRef.current?.close();
    identityRef.current = getOrCreatePlayIdentity();
    setPlayRoom(null);
    setHud({
      connected: false,
      online: [],
      queue: 0,
      roomMeta: null,
      localStats: null,
      toast: null,
      verdict: null,
      error: null,
    });
  }, []);

  return { hud, identity: identityRef.current, reconnect };
}
