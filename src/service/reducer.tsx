import { cameraId, cameraType, flashType, whiteBalanceType } from "./settings"


// Camera
export type cameraReducerState = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
    cameraType: cameraType,
    cameraId: cameraId,
}

type cameraReducerActionFlash = {
    type: "flash",
    payload: flashType,
}

type cameraReducerActionWhiteBalance = {
    type: "white-balance",
    payload: whiteBalanceType,
}

type cameraReducerActionCameraType = {
    type: "camera-type",
    payload: cameraType,
}

type cameraReducerActionCameraId = {
    type: "camera-id",
    payload: cameraId,
}

type cameraReducerActionSet = {
    type: "set",
    payload: {
        flash: flashType,
        whiteBalance: whiteBalanceType,
        cameraType: cameraType,
        cameraId: cameraId,
    },
}

type cameraReducerActionReset = {
    type: "reset",
}

export type cameraReducerAction = cameraReducerActionFlash
    | cameraReducerActionWhiteBalance
    | cameraReducerActionCameraType
    | cameraReducerActionCameraId
    | cameraReducerActionSet
    | cameraReducerActionReset
