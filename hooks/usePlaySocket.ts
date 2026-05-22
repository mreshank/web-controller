"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getOrCreatePlayIdentity } from "@/lib/play/identity";
import type { ClientMessage, OnlinePlayer, ServerMessage } from "@/lib/play/protocol";
import { playWsUrl } from "@/lib/play/protocol";
import type { RoomSnapshot } from "@/lib/play/simulation";

export type VerdictRank = {
  uid: string;
  codename: string;
  score: number;
  rank: string;
};

export type PlaySocketState = {
  connected: boolean;
  online: OnlinePlayer[];
  queue: number;
  room: RoomSnapshot | null;
  toast: { text: string; color: string } | null;
  verdict: VerdictRank[] | null;
  error: string | null;
};

export function usePlaySocket(sendInput: () => ClientMessage | null) {
  const [state, setState] = useState<PlaySocketState>({
    connected: false,
    online: [],
    queue: 0,
    room: null,
    toast: null,
    verdict: null,
    error: null,
  });
  const wsRef = useRef<WebSocket | null>(null);
  const identityRef = useRef(getOrCreatePlayIdentity());

  useEffect(() => {
    const url = playWsUrl();
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      const id = identityRef.current;
      const hello: ClientMessage = { type: "hello", uid: id.uid, codename: id.codename };
      ws.send(JSON.stringify(hello));
      setState((s) => ({ ...s, connected: true, error: null }));
    };

    ws.onmessage = (ev) => {
      let msg: ServerMessage;
      try {
        msg = JSON.parse(String(ev.data)) as ServerMessage;
      } catch {
        return;
      }
      setState((s) => {
        switch (msg.type) {
          case "welcome":
            return { ...s, online: msg.online };
          case "lobby":
            return { ...s, online: msg.online, queue: msg.queue };
          case "room":
            return { ...s, room: msg.snapshot, verdict: null };
          case "toast":
            return { ...s, toast: { text: msg.text, color: msg.color ?? "#00e8cc" } };
          case "verdict":
            return { ...s, verdict: msg.ranks };
          case "error":
            return { ...s, error: msg.message };
          default:
            return s;
        }
      });
    };

    ws.onclose = () => {
      setState((s) => ({ ...s, connected: false }));
      wsRef.current = null;
    };

    ws.onerror = () => {
      setState((s) => ({
        ...s,
        error: "Cannot reach breach server — run npm run dev:play",
      }));
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const payload = sendInput();
      if (payload) ws.send(JSON.stringify(payload));
    }, 1000 / 20);
    return () => clearInterval(id);
  }, [sendInput]);

  const reconnect = useCallback(() => {
    wsRef.current?.close();
    identityRef.current = getOrCreatePlayIdentity();
    setState({
      connected: false,
      online: [],
      queue: 0,
      room: null,
      toast: null,
      verdict: null,
      error: null,
    });
  }, []);

  return { state, identity: identityRef.current, reconnect };
}
