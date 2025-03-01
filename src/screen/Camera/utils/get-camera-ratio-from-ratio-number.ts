import { CameraRatio } from "@libs/settings"
import { cameraRatioToRatioNumber } from "./camera-ratio-to-ratio-number"


export function getCameraRatioFromRatioNumber(ratio: number): CameraRatio {
  const cameraRatioToRatioNumberEntry = Object
    .entries(cameraRatioToRatioNumber)
    .find(entry => {
      const [_, ratioNumber] = entry
      return ratioNumber === ratio
    })

  if (!cameraRatioToRatioNumberEntry) {
    throw new Error(`Ratio number "${ratio}" is not supported.`)
  }

  const [cameraRatio] = cameraRatioToRatioNumberEntry
  return cameraRatio as CameraRatio
}
