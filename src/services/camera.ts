import { createContext, useContext } from "react"

import { CameraSettingsReducerAction, CameraSettingsObject, CameraSettingsContextType } from "../types"
import { cameraFlashDefault, cameraIdDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "./settings"


export const cameraSettingsDefault: CameraSettingsObject = {
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
                ...action.payload,
            }
        case "reset":
            return {
                ...cameraSettingsDefault,
            }
        default:
            throw new Error("Unknown action type")
    }
}


const CameraSettingsContext = createContext({
    cameraSettingsState: cameraSettingsDefault,
    dispatchCameraSettings: (value: CameraSettingsReducerAction) => {},
}  as CameraSettingsContextType)

export const CameraSettingsProvider = CameraSettingsContext.Provider

export function useCameraSettings() {
    return useContext(CameraSettingsContext)
}
