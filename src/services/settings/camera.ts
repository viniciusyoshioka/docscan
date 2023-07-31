
export type CameraFlash = "auto" | "on" | "off"
export type CameraType = "front" | "back"
export type CameraRatio = "3:4" | "9:16"


export const settingsCameraFlashDefault: CameraFlash = "off"
export const settingsCameraTypeDefault: CameraType = "back"
export const settingsCameraRatioDefault: CameraRatio = "3:4"


export const settingsCameraFlashOptions: CameraFlash[] = ["auto", "on", "off"]
export const settingsCameraTypeOptions: CameraType[] = ["front", "back"]
export const settingsCameraRatioOptions: CameraRatio[] = ["3:4", "9:16"]


export function getCameraRatioNumber(ratio: CameraRatio): number {
    switch (ratio) {
        case "3:4":
            return (3 / 4)
        case "9:16":
            return (9 / 16)
        default:
            throw new Error(`Invalid ratio provided to get the number "${ratio}"`)
    }
}
