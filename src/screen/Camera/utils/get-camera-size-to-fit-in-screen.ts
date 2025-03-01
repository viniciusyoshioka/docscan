import { CameraRatio } from "@libs/settings"
import { getCameraRatioNumber } from "./get-camera-ratio-number"


export type Size = {
  width: number
  height: number
}


export function getCameraSizeToFitInScreen(screenSize: Size, cameraRatio: CameraRatio): Size {
  const ratio = getCameraRatioNumber(cameraRatio)

  let cameraWidth = screenSize.width
  let cameraHeight = screenSize.width * ratio
  if (cameraHeight > screenSize.height) {
    cameraHeight = screenSize.height
    cameraWidth = screenSize.height / ratio
  }

  return { width: cameraWidth, height: cameraHeight }
}
