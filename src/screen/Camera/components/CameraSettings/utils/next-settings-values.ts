import { CameraFlash, CameraPosition, CameraRatio } from "@libs/settings"


type NextFlashSetting = {
  [key in CameraFlash]: CameraFlash
}

export const nextFlashSetting: NextFlashSetting = {
  auto: "on",
  on: "off",
  off: "auto",
}


type NextCameraPositionSetting = {
  [key in CameraPosition]: CameraPosition
}

export const nextCameraPositionSetting: NextCameraPositionSetting = {
  back: "front",
  front: "back",
}


type NextRatioSetting = {
  [key in CameraRatio]: CameraRatio
}

export const nextRatioSetting: NextRatioSetting = {
  "4:3": "16:9",
  "16:9": "4:3",
}
