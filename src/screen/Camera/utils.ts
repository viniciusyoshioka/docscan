import { CameraRatio, getCameraRatioNumber } from "@lib/settings/camera"


export type Size = {
  width: number
  height: number
}

export function getCameraSize(screenSize: Size, cameraRatio: CameraRatio): Size {
  const ratio = getCameraRatioNumber(cameraRatio)
  let cameraWidth = screenSize.width
  let cameraHeight = screenSize.width * ratio
  if (cameraHeight > screenSize.height) {
    cameraHeight = screenSize.height
    cameraWidth = screenSize.height / ratio
  }
  return { width: cameraWidth, height: cameraHeight }
}
