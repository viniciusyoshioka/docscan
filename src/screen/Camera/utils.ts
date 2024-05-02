import { CameraRatio } from "@lib/settings"


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
