import { CameraSettingsReducerAction, CameraSettingsObject } from "@type/"
import { cameraFlashDefault, cameraIdDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "./settings"


export const initialCameraSettings: CameraSettingsObject = {
    flash: cameraFlashDefault,
    whiteBalance: cameraWhiteBalanceDefault,
    cameraType: cameraTypeDefault,
    cameraId: cameraIdDefault,
}


export function reducerCameraSettings(
    state: CameraSettingsObject,
    action: CameraSettingsReducerAction
): CameraSettingsObject {
    switch (action.type) {
        case "flash":
            return {
                ...state,
                flash: action.payload,
            }
        case "white-balance":
            return {
                ...state,
                whiteBalance: action.payload,
            }
        case "camera-type":
            return {
                ...state,
                cameraType: action.payload,
            }
        case "camera-id":
            return {
                ...state,
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
