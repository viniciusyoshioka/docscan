import { cameraType, flashType, whiteBalanceType } from "."


/**
 * Type of the complete camera settings.
 * Its also the type of camera settings state.
 */
export type cameraReducerState = {
    flash: flashType;
    whiteBalance: whiteBalanceType;
    cameraType: cameraType;
    cameraId: string;
}


/**
 * Receives the new flash and sets it to the state
 */
type cameraReducerActionFlash = {
    type: "flash";
    payload: flashType;
}

/**
 * Receives the new white balance and sets it
 * to the state
 */
type cameraReducerActionWhiteBalance = {
    type: "white-balance";
    payload: whiteBalanceType;
}

/**
 * Receives the new camera type and sets it
 * to the state
 */
type cameraReducerActionCameraType = {
    type: "camera-type";
    payload: cameraType;
}

/**
 * Receives the camera id string in payload
 * and sets it to the state
 */
type cameraReducerActionCameraId = {
    type: "camera-id";
    payload: string;
}

/**
 * Receives an object with all camera settings data
 * to set the state
 */
type cameraReducerActionSet = {
    type: "set";
    payload: {
        flash: flashType;
        whiteBalance: whiteBalanceType;
        cameraType: cameraType;
        cameraId: string;
    };
}

/**
 * Resets all camera settings to its default value
 */
type cameraReducerActionReset = {
    type: "reset";
}


/**
 * Actions for camera settings reducer to handler with
 * the camera settings state
 */
export type cameraReducerAction = cameraReducerActionFlash
    | cameraReducerActionWhiteBalance
    | cameraReducerActionCameraType
    | cameraReducerActionCameraId
    | cameraReducerActionSet
    | cameraReducerActionReset
