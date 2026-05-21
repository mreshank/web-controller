"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  countConnected,
  emptyGamepadState,
  getPrimaryGamepad,
  pollAllGamepadSlots,
  type GamepadState,
} from "@/lib/gamepad";

type GamepadListener = (states: GamepadState[]) => void;

type GamepadContextValue = {
  subscribe: (listener: GamepadListener) => () => void;
  getSnapshot: () => GamepadState[];
  getConnectedCount: () => number;
  getConnectedSlotsKey: () => string;
  getSubscriberCount: () => number;
};

const GamepadContext = createContext<GamepadContextValue | null>(null);

function slotsKey(states: GamepadState[]) {
  return states
    .filter((s) => s.connected)
    .map((s) => s.slotIndex)
    .sort((a, b) => a - b)
    .join(",");
}

const INITIAL_STATES = [
  emptyGamepadState(0),
  emptyGamepadState(1),
  emptyGamepadState(2),
  emptyGamepadState(3),
];

function createGamepadStore() {
  let states = INITIAL_STATES;
  let connectedCount = 0;
  let connectedSlotsKey = "";
  const listeners = new Set<GamepadListener>();
  let subscriberCount = 0;
  let rafId: number | null = null;

  const notify = () => {
    for (const listener of listeners) listener(states);
  };

  const poll = () => {
    states = pollAllGamepadSlots();
    const nextCount = countConnected(states);
    const nextSlotsKey = slotsKey(states);
    const countChanged = nextCount !== connectedCount;
    const slotsChanged = nextSlotsKey !== connectedSlotsKey;
    connectedCount = nextCount;
    connectedSlotsKey = nextSlotsKey;
    notify();
    if (countChanged || slotsChanged) {
      window.dispatchEvent(new CustomEvent("gamepad-count-changed"));
    }
    rafId = requestAnimationFrame(poll);
  };

  const start = () => {
    if (rafId === null) rafId = requestAnimationFrame(poll);
  };

  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const onConnect = () => start();

  if (typeof window !== "undefined") {
    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onConnect);
    start();
  }

  return {
    subscribe(listener: GamepadListener) {
      listeners.add(listener);
      const prev = subscriberCount;
      subscriberCount = listeners.size;
      if (prev !== subscriberCount) {
        window.dispatchEvent(new CustomEvent("gamepad-subscribers-changed"));
      }
      listener(states);
      return () => {
        listeners.delete(listener);
        const before = subscriberCount;
        subscriberCount = listeners.size;
        if (before !== subscriberCount) {
          window.dispatchEvent(new CustomEvent("gamepad-subscribers-changed"));
        }
      };
    },
    getSnapshot: () => states,
    getConnectedCount: () => connectedCount,
    getConnectedSlotsKey: () => connectedSlotsKey,
    getSubscriberCount: () => subscriberCount,
    destroy() {
      stop();
      if (typeof window !== "undefined") {
        window.removeEventListener("gamepadconnected", onConnect);
        window.removeEventListener("gamepaddisconnected", onConnect);
      }
    },
  };
}

let store: ReturnType<typeof createGamepadStore> | null = null;

function getStore() {
  if (typeof window === "undefined") return null;
  if (!store) store = createGamepadStore();
  return store;
}

const SSR_FALLBACK: GamepadContextValue = {
  subscribe: () => () => {},
  getSnapshot: () => INITIAL_STATES,
  getConnectedCount: () => 0,
  getConnectedSlotsKey: () => "",
  getSubscriberCount: () => 0,
};

function storeToContext(s: NonNullable<ReturnType<typeof getStore>>): GamepadContextValue {
  return {
    subscribe: s.subscribe,
    getSnapshot: s.getSnapshot,
    getConnectedCount: s.getConnectedCount,
    getConnectedSlotsKey: s.getConnectedSlotsKey,
    getSubscriberCount: s.getSubscriberCount,
  };
}

export function useSubscriberCount(): number {
  const ctx = useGamepadContext();
  return useSyncExternalStore(
    (onStoreChange) => {
      const handler = () => onStoreChange();
      window.addEventListener("gamepad-subscribers-changed", handler);
      return () =>
        window.removeEventListener("gamepad-subscribers-changed", handler);
    },
    ctx.getSubscriberCount,
    () => 0
  );
}

export function GamepadProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState<GamepadContextValue>(SSR_FALLBACK);

  useEffect(() => {
    const s = getStore();
    if (s) setValue(storeToContext(s));
  }, []);

  return (
    <GamepadContext.Provider value={value}>{children}</GamepadContext.Provider>
  );
}

function useGamepadContext() {
  const ctx = useContext(GamepadContext);
  if (!ctx) {
    throw new Error("useGamepad must be used within GamepadProvider");
  }
  return ctx;
}

export function useGamepadStates(): GamepadState[] {
  const { subscribe, getSnapshot } = useGamepadContext();
  return useSyncExternalStore(subscribe, getSnapshot, () => [
    emptyGamepadState(0),
    emptyGamepadState(1),
    emptyGamepadState(2),
    emptyGamepadState(3),
  ]);
}

export function useConnectedGamepadCount(): number {
  const ctx = useGamepadContext();
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsub = ctx.subscribe(() => onStoreChange());
      const onCount = () => onStoreChange();
      window.addEventListener("gamepad-count-changed", onCount);
      return () => {
        unsub();
        window.removeEventListener("gamepad-count-changed", onCount);
      };
    },
    ctx.getConnectedCount,
    () => 0
  );
}

export function useGamepadContextValue() {
  return useGamepadContext();
}

export function useGamepad(onUpdate: (state: GamepadState) => void) {
  const { subscribe } = useGamepadContext();
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  useEffect(() => {
    return subscribe((states) => {
      onUpdateRef.current(getPrimaryGamepad(states));
    });
  }, [subscribe]);
}

export function useGamepadSlot(
  slotIndex: number,
  onUpdate: (state: GamepadState) => void
) {
  const { subscribe } = useGamepadContext();
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  useEffect(() => {
    return subscribe((states) => {
      onUpdateRef.current(
        states[slotIndex] ?? emptyGamepadState(slotIndex)
      );
    });
  }, [subscribe, slotIndex]);
}

export function useConnectedSlotIndexes(): number[] {
  const ctx = useGamepadContext();
  const key = useSyncExternalStore(
    (onStoreChange) => {
      const onCount = () => onStoreChange();
      window.addEventListener("gamepad-count-changed", onCount);
      return () => window.removeEventListener("gamepad-count-changed", onCount);
    },
    ctx.getConnectedSlotsKey,
    () => ""
  );

  if (!key) return [];
  return key.split(",").map((n) => Number(n));
}
