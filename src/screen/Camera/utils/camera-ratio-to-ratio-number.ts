import { CameraRatio } from "@libs/settings"


type CameraRatioToRatioNumber = {
  [key in CameraRatio]: number
}


export const cameraRatioToRatioNumber: CameraRatioToRatioNumber = {
  "4:3": 4 / 3,
  "16:9": 16 / 9,
}
