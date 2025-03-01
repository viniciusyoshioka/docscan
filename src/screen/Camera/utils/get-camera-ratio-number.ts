import { CameraRatio } from "@libs/settings"
import { cameraRatioToRatioNumber } from "./camera-ratio-to-ratio-number"


export function getCameraRatioNumber(cameraRatio: CameraRatio): number {
  const ratioNumber = cameraRatioToRatioNumber[cameraRatio]

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (ratioNumber === undefined) {
    throw new Error(`Invalid camera ratio provided: "${cameraRatio}"`)
  }
  return ratioNumber
}
