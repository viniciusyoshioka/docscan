import { CameraRatio, CameraType, FlashType } from "./types"


export const settingsCameraFlashDefault: FlashType = "off"
export const settingsCameraTypeDefault: CameraType = "back"
export const settingsCameraRatioDefault: CameraRatio = "3:4"


export function getCameraRatioNumber(ratio: CameraRatio): number {
    switch (ratio) {
        case "3:4":
            return (4 / 3)
        case "9:16":
            return (16 / 9)
        default:
            throw new Error(`Invalid ratio provided to get the number "${ratio}"`)
    }
}
