import { CameraRatio } from "./types"


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
