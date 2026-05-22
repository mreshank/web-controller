import { CAMERA_DEFAULT_DISTANCE } from "@/game/config";

/** Shared third-person orbit rig (updated by GameCamera, read by players) */
export const cameraRig = {
  yaw: Math.PI * 0.25,
  pitch: 0.42,
  distance: CAMERA_DEFAULT_DISTANCE,
  /** World-space yaw used for camera-relative movement */
  yawWorld: Math.PI * 0.25,
};
