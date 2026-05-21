export type GamepadState = {
  slotIndex: number;
  leftStick: { x: number; y: number };
  rightStick: { x: number; y: number };
  buttons: boolean[];
  triggers: { left: number; right: number };
  connected: boolean;
  id: string;
};

const DEADZONE = 0.1;

const applyDeadzone = (v: number) => (Math.abs(v) < DEADZONE ? 0 : v);

export function emptyGamepadState(slotIndex: number): GamepadState {
  return {
    slotIndex,
    leftStick: { x: 0, y: 0 },
    rightStick: { x: 0, y: 0 },
    buttons: [],
    triggers: { left: 0, right: 0 },
    connected: false,
    id: "",
  };
}

export function parseGamepad(gp: Gamepad): GamepadState {
  return {
    slotIndex: gp.index,
    leftStick: {
      x: applyDeadzone(gp.axes[0] ?? 0),
      y: applyDeadzone(gp.axes[1] ?? 0),
    },
    rightStick: {
      x: applyDeadzone(gp.axes[2] ?? 0),
      y: applyDeadzone(gp.axes[3] ?? 0),
    },
    buttons: gp.buttons.map((b) => b.pressed),
    triggers: {
      left: gp.buttons[6]?.value ?? 0,
      right: gp.buttons[7]?.value ?? 0,
    },
    connected: true,
    id: gp.id,
  };
}

/** Read all four browser slots (index is not connection order). */
export function pollAllGamepadSlots(): GamepadState[] {
  const pads = navigator.getGamepads();
  return Array.from({ length: 4 }, (_, slotIndex) => {
    const gp = pads[slotIndex];
    if (gp?.connected) return parseGamepad(gp);
    return emptyGamepadState(slotIndex);
  });
}

export function getPrimaryGamepad(states: GamepadState[]): GamepadState {
  return states.find((s) => s.connected) ?? emptyGamepadState(0);
}

export function countConnected(states: GamepadState[]): number {
  return states.filter((s) => s.connected).length;
}
