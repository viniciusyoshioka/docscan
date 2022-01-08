import { cameraType, flashType, themeType, whiteBalanceType } from "."


export type settingsObject = {
    theme: themeType;
    cameraFlash: flashType;
    cameraWhiteBalance: whiteBalanceType;
    cameraType: cameraType;
    cameraId: string;
}


export type settingsKey = "theme"
    | "cameraFlash" 
    | "cameraWhiteBalance" 
    | "cameraType"
    | "cameraId"
