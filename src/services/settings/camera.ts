
export type CameraFlash = "auto" | "on" | "off"
export type CameraType = "front" | "back"
export type CameraRatio = "4:3" | "16:9"


export const settingsCameraFlashDefault: CameraFlash = "off"
export const settingsCameraTypeDefault: CameraType = "back"
export const settingsCameraRatioDefault: CameraRatio = "4:3"


export const settingsCameraFlashOptions: CameraFlash[] = ["auto", "on", "off"]
export const settingsCameraTypeOptions: CameraType[] = ["front", "back"]
export const settingsCameraRatioOptions: CameraRatio[] = ["4:3", "16:9"]


export function getCameraRatioNumber(ratio: CameraRatio): number {
  switch (ratio) {
    case "4:3":
      return (4 / 3)
    case "16:9":
      return (16 / 9)
    default:
      throw new Error(`Invalid ratio provided to get the number "${ratio}"`)
  }
}
