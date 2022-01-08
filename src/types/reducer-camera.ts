import { CameraType, FlashType, WhiteBalanceType } from "."


/**
 * Receives the new flash and sets it to the state
 */
type CameraSettingsFlash = {
    type: "flash";
    payload: FlashType;
}

/**
 * Receives the new white balance and sets it
 * to the state
 */
type CameraSettingsWhiteBalance = {
    type: "white-balance";
    payload: WhiteBalanceType;
}

/**
 * Receives the new camera type and sets it
 * to the state
 */
type CameraSettingsCameraType = {
    type: "camera-type";
    payload: CameraType;
}

/**
 * Receives the camera id string in payload
 * and sets it to the state
 */
type CameraSettingsCameraId = {
    type: "camera-id";
    payload: string;
}

/**
 * Receives an object with all camera settings data
 * to set the state
 */
type CameraSettingsSet = {
    type: "set";
    payload: {
        flash: FlashType;
        whiteBalance: WhiteBalanceType;
        cameraType: CameraType;
        cameraId: string;
    };
}

/**
 * Resets all camera settings to its default value
 */
type CameraSettingsReset = {
    type: "reset";
}


/**
 * Actions for camera settings reducer to handler with
 * the camera settings state
 */
export type CameraSettingsReducerAction = CameraSettingsSet
    | CameraSettingsFlash
    | CameraSettingsWhiteBalance
    | CameraSettingsCameraType
    | CameraSettingsCameraId
    | CameraSettingsReset
