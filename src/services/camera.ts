import { createContext, useContext } from "react"

import { CameraSettingsContextType, CameraSettingsObject, CameraSettingsReducerAction } from "../types"
import { cameraFlashDefault, cameraIdDefault, cameraRatioDefault, cameraTypeDefault, cameraWhiteBalanceDefault } from "./settings"


/**
 * Object with the default values for camera settings
 */
export const cameraSettingsDefault: CameraSettingsObject = {
    flash: cameraFlashDefault,
    whiteBalance: cameraWhiteBalanceDefault,
    cameraType: cameraTypeDefault,
    cameraId: cameraIdDefault,
    cameraRatio: cameraRatioDefault,
}


/**
 * Reducer function to handle with camera setting action
 * and update its state
 */
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
        case "camera-ratio":
            return {
                ...state,
                cameraRatio: action.payload,
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
} as CameraSettingsContextType)

/**
 * Provider to pass camera settings through the component tree
 */
export const CameraSettingsProvider = CameraSettingsContext.Provider

/**
 * Hook to get the camera settings state and the dispatch function
 */
export function useCameraSettings() {
    return useContext(CameraSettingsContext)
}
