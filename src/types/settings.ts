import { cameraType, flashType, themeType, whiteBalanceType } from "."


/**
 * Type of app settings object
 */
export type settingsObject = {
    theme: themeType;
    cameraFlash: flashType;
    cameraWhiteBalance: whiteBalanceType;
    cameraType: cameraType;
    cameraId: string;
}


/**
 * Contains all keys of app settings object
 */
export type settingsKey = "theme"
    | "cameraFlash" 
    | "cameraWhiteBalance" 
    | "cameraType"
    | "cameraId"
