import { Dispatch } from "react"

import { CameraSettingsReducerAction } from "."


/**
 * All camera flash setting options
 */
export type FlashType = "auto" | "on" | "off"

/**
 * All camera white balande setting options
 */
export type WhiteBalanceType = "auto" | "sunny" | "cloudy" | "shadow" | "incandescent" | "fluorescent"

/**
 * All camera type setting options
 */
export type CameraType = "front" | "back"


/**
 * All camera ratio setting options
 */
export type CameraRatio = "3:4" | "9:16"


/**
 * Type of the complete camera settings object
 */
export type CameraSettingsObject = {
    flash: FlashType;
    whiteBalance: WhiteBalanceType;
    cameraType: CameraType;
    cameraId: string;
    cameraRatio: CameraRatio;
}


/**
 * Type for the camera settings state and dispatch,
 * returned by the reducer hook
 */
export type CameraSettingsContextType = {
    cameraSettingsState: CameraSettingsObject;
    dispatchCameraSettings: Dispatch<CameraSettingsReducerAction>;
}
