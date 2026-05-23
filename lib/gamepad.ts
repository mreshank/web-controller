export type GamepadState = {
  slotIndex: number;
  leftStick: { x: number; y: number };
  rightStick: { x: number; y: number };
  buttons: boolean[];
  triggers: { left: number; right: number };
  connected: boolean;
  id: string;
};

/** W3C standard mapping (PS: × ○ □ △ · Xbox: A B X Y) */
export const GP_BTN = {
  SOUTH: 0,
  EAST: 1,
  WEST: 2,
  NORTH: 3,
  L1: 4,
  R1: 5,
  L2: 6,
  R2: 7,
  SELECT: 8,
  START: 9,
} as const;

const DEADZONE = 0.1;
/** Some pads (DualSense, Switch) set `pressed: false` while `value` is analog. */
const BUTTON_THRESHOLD = 0.45;

export function readButtonPressed(b: GamepadButton): boolean {
  return b.pressed || (b.value ?? 0) > BUTTON_THRESHOLD;
}

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
    buttons: gp.buttons.map(readButtonPressed),
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

/** True on the frame a button goes down (not held). */
export function edgeButton(
  buttons: readonly boolean[],
  prev: readonly boolean[],
  index: number
): boolean {
  return Boolean(buttons[index]) && !Boolean(prev[index]);
}

/** Confirm / interact — × (PS) or A (Xbox). */
export function edgeConfirm(
  buttons: readonly boolean[],
  prev: readonly boolean[]
): boolean {
  return (
    edgeButton(buttons, prev, GP_BTN.SOUTH) || edgeButton(buttons, prev, GP_BTN.WEST)
  );
}

/** Cancel / close — ○ (PS) or B (Xbox). */
export function edgeCancel(
  buttons: readonly boolean[],
  prev: readonly boolean[]
): boolean {
  return edgeButton(buttons, prev, GP_BTN.EAST);
}

export function isButtonHeld(buttons: readonly boolean[], index: number): boolean {
  return Boolean(buttons[index]);
}
