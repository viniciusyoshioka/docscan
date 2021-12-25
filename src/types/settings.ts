import { cameraType, flashType, whiteBalanceType } from "."
import { themeType } from "../service/theme"


export type settingsObject = {
    theme: themeType,
    cameraFlash: flashType,
    cameraWhiteBalance: whiteBalanceType,
    cameraType: cameraType,
    cameraId: string
}


export type settingsKey = "theme"
 | "cameraFlash" 
 | "cameraWhiteBalance" 
 | "cameraType"
 | "cameraId"
