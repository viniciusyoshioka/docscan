import { flashType, whiteBalanceType } from "./settings"


// Camera
export type cameraReducerState = {
    flash: flashType,
    whiteBalance: whiteBalanceType,
}

type cameraReducerActionFlash = {
    type: "flash",
    payload: flashType
}

type cameraReducerActionWhiteBalance = {
    type: "white-balance",
    payload: whiteBalanceType
}

type cameraReducerActionSet = {
    type: "set",
    payload: {
        flash: flashType,
        whiteBalance: whiteBalanceType,
    },
}

type cameraReducerActionReset = {
    type: "reset"
}

export type cameraReducerAction = cameraReducerActionFlash
    | cameraReducerActionWhiteBalance
    | cameraReducerActionSet
    | cameraReducerActionReset
