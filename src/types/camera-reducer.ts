import { cameraType, flashType, whiteBalanceType } from "."


export type cameraReducerState = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
    cameraType: cameraType,
    cameraId: string,
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
    payload: string,
}

type cameraReducerActionSet = {
    type: "set",
    payload: {
        flash: flashType,
        whiteBalance: whiteBalanceType,
        cameraType: cameraType,
        cameraId: string,
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
