/**
 * Nexus Breach multiplayer server — run alongside Next (`npm run dev:play`).
 * Production: proxy WebSocket /ws/play → this process (port PLAY_WS_PORT).
 */
import { createServer } from "http";
import { WebSocketServer, type WebSocket } from "ws";
import {
  PLAY_MAX_PLAYERS,
  PLAY_MIN_PLAYERS,
  PLAY_TICK_HZ,
} from "../lib/play/constants";
import type { ClientMessage, OnlinePlayer, ServerMessage } from "../lib/play/protocol";
import {
  addPlayerToRoom,
  createRoom,
  drainToasts,
  maybeStartCountdown,
  removePlayerFromRoom,
  snapshotRoom,
  stepRoom,
  type PlayInput,
  type RoomRuntime,
} from "../lib/play/simulation";

const PORT = Number(process.env.PLAY_WS_PORT ?? 3001);

type Client = {
  ws: WebSocket;
  uid: string;
  codename: string;
  roomId: string | null;
};

const clients = new Map<WebSocket, Client>();
const uidToWs = new Map<string, WebSocket>();
const rooms = new Map<string, RoomRuntime>();
const queue: string[] = [];

function send(ws: WebSocket, msg: ServerMessage) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
}

function broadcastLobby() {
  const online: OnlinePlayer[] = [...clients.values()].map((c) => ({
    uid: c.uid,
    codename: c.codename,
    roomId: c.roomId,
  }));
  const msg: ServerMessage = { type: "lobby", online, queue: queue.length };
  for (const c of clients.values()) send(c.ws, msg);
}

function roomWithSpace(): RoomRuntime | null {
  let best: RoomRuntime | null = null;
  let bestCount = -1;
  for (const r of rooms.values()) {
    if (r.phase === "verdict") continue;
    const n = r.players.size;
    if (n >= PLAY_MAX_PLAYERS) continue;
    if (n > bestCount) {
      best = r;
      bestCount = n;
    }
  }
  return best;
}

function newRoomId(): string {
  return `breach-${Math.random().toString(36).slice(2, 8)}`;
}

function assignToRoom(client: Client) {
  let room = roomWithSpace();
  if (!room) {
    room = createRoom(newRoomId(), (Date.now() % 1e6) | 0);
    rooms.set(room.roomId, room);
  }

  const p = addPlayerToRoom(room, client.uid, client.codename);
  if (!p) {
    queue.push(client.uid);
    broadcastLobby();
    return;
  }

  const qi = queue.indexOf(client.uid);
  if (qi >= 0) queue.splice(qi, 1);

  client.roomId = room.roomId;
  maybeStartCountdown(room, Date.now());
  send(client.ws, { type: "room", snapshot: snapshotRoom(room) });
  broadcastLobby();
}

function fillVacantSlots() {
  for (const uid of [...queue]) {
    const ws = uidToWs.get(uid);
    if (!ws) {
      queue.splice(queue.indexOf(uid), 1);
      continue;
    }
    const client = clients.get(ws);
    if (!client || client.roomId) continue;
    const room = roomWithSpace();
    if (!room) break;
    const p = addPlayerToRoom(room, client.uid, client.codename);
    if (!p) break;
    queue.splice(queue.indexOf(uid), 1);
    client.roomId = room.roomId;
    maybeStartCountdown(room, Date.now());
    send(client.ws, { type: "room", snapshot: snapshotRoom(room) });
  }
  broadcastLobby();
}

function onDisconnect(ws: WebSocket) {
  const client = clients.get(ws);
  if (!client) return;

  uidToWs.delete(client.uid);
  const qi = queue.indexOf(client.uid);
  if (qi >= 0) queue.splice(qi, 1);

  if (client.roomId) {
    const room = rooms.get(client.roomId);
    if (room) {
      removePlayerFromRoom(room, client.uid);
      if (room.players.size === 0) rooms.delete(room.roomId);
      else if (room.phase === "live" && room.players.size < PLAY_MIN_PLAYERS) {
        room.phase = "waiting";
        room.phaseEndsAt = 0;
      }
    }
  }

  clients.delete(ws);
  fillVacantSlots();
  broadcastLobby();
}

const roomInputs = new Map<string, Map<string, PlayInput>>();

function tickAll() {
  const now = Date.now();
  const dt = 1 / PLAY_TICK_HZ;

  for (const room of rooms.values()) {
    const inputs = roomInputs.get(room.roomId) ?? new Map();
    stepRoom(room, inputs, now, dt);
    inputs.clear();

    const toasts = drainToasts(room);

    for (const c of clients.values()) {
      if (c.roomId !== room.roomId) continue;
      send(c.ws, { type: "room", snapshot: snapshotRoom(room) });
      for (const t of toasts) {
        send(c.ws, { type: "toast", text: t.text, color: t.color });
      }
    }

    if (room.phase === "verdict" && now > room.phaseEndsAt + 2000) {
      const ranks = [...room.players.values()]
        .sort((a, b) => b.score - a.score)
        .map((p) => ({
          uid: p.uid,
          codename: p.codename,
          score: p.score,
          rank: ["Drifter", "Scout", "Raider", "Vault Knight", "Nexus Ace", "Legend"][
            Math.min(5, p.rank)
          ]!,
        }));
      for (const c of clients.values()) {
        if (c.roomId === room.roomId) {
          send(c.ws, { type: "verdict", ranks });
        }
      }
      rooms.delete(room.roomId);
      for (const c of clients.values()) {
        if (c.roomId === room.roomId) {
          c.roomId = null;
          assignToRoom(c);
        }
      }
    }
  }
}

const httpServer = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Nexus Breach play server\n");
});

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(String(raw)) as ClientMessage;
    } catch {
      send(ws, { type: "error", message: "Invalid JSON" });
      return;
    }

    if (msg.type === "hello") {
      const existing = uidToWs.get(msg.uid);
      if (existing && existing !== ws) existing.close();

      const client: Client = {
        ws,
        uid: msg.uid,
        codename: msg.codename.slice(0, 12),
        roomId: null,
      };
      clients.set(ws, client);
      uidToWs.set(msg.uid, ws);

      const online: OnlinePlayer[] = [...clients.values()].map((c) => ({
        uid: c.uid,
        codename: c.codename,
        roomId: c.roomId,
      }));
      send(ws, { type: "welcome", uid: msg.uid, online });
      assignToRoom(client);
      return;
    }

    const client = clients.get(ws);
    if (!client?.roomId || msg.type !== "input") return;

    let inputs = roomInputs.get(client.roomId);
    if (!inputs) {
      inputs = new Map();
      roomInputs.set(client.roomId, inputs);
    }
    inputs.set(client.uid, {
      ax: msg.ax,
      ay: msg.ay,
      rt: msg.rt,
      dash: msg.dash,
      camYaw: msg.camYaw,
    });
  });

  ws.on("close", () => onDisconnect(ws));
});

setInterval(tickAll, 1000 / PLAY_TICK_HZ);

httpServer.listen(PORT, () => {
  console.log(`[play-server] ws://0.0.0.0:${PORT}`);
});
