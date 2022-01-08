import { CameraType, FlashType, ThemeType, WhiteBalanceType } from "."


/**
 * Type of app settings object
 */
export type SettingsObject = {
    theme: ThemeType;
    cameraFlash: FlashType;
    cameraWhiteBalance: WhiteBalanceType;
    cameraType: CameraType;
    cameraId: string;
}


/**
 * Contains all keys of app settings object
 */
export type SettingsKey = "theme"
    | "cameraFlash" 
    | "cameraWhiteBalance" 
    | "cameraType"
    | "cameraId"
