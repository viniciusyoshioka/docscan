import { cameraReducerAction, cameraReducerState } from "../types"
import { cameraFlashDefault, cameraIdDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "./settings"


export const initialCameraSettings: cameraReducerState = {
    flash: cameraFlashDefault,
    whiteBalance: cameraWhiteBalanceDefault,
    cameraType: cameraTypeDefault,
    cameraId: cameraIdDefault,
}


export function reducerCameraSettings(
    state: cameraReducerState,
    action: cameraReducerAction
): cameraReducerState {
    switch (action.type) {
        case "flash":
            return {
                flash: action.payload,
                whiteBalance: state.whiteBalance,
                cameraType: state.cameraType,
                cameraId: state.cameraId,
            }
        case "white-balance":
            return {
                flash: state.flash,
                whiteBalance: action.payload,
                cameraType: state.cameraType,
                cameraId: state.cameraId,
            }
        case "camera-type":
            return {
                flash: state.flash,
                whiteBalance: state.whiteBalance,
                cameraType: action.payload,
                cameraId: state.cameraId,
            }
        case "camera-id":
            return {
                flash: state.flash,
                whiteBalance: state.whiteBalance,
                cameraType: state.cameraType,
                cameraId: action.payload,
            }
        case "set":
            return {
                flash: action.payload.flash,
                whiteBalance: action.payload.whiteBalance,
                cameraType: action.payload.cameraType,
                cameraId: action.payload.cameraId,
            }
        case "reset":
            return {
                flash: cameraFlashDefault,
                whiteBalance: cameraWhiteBalanceDefault,
                cameraType: cameraTypeDefault,
                cameraId: cameraIdDefault,
            }
        default:
            throw new Error("Unknown action type")
    }
}
