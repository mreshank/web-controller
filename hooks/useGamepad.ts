export type { GamepadState } from "@/lib/gamepad";
export {
  GP_BTN,
  edgeButton,
  edgeCancel,
  edgeConfirm,
  isButtonHeld,
  readButtonPressed,
} from "@/lib/gamepad";
export {
  useGamepad,
  useGamepadSlot,
  useConnectedGamepadCount,
  useConnectedSlotIndexes,
  useGamepadStates,
  useSubscriberCount,
} from "@/context/GamepadProvider";
