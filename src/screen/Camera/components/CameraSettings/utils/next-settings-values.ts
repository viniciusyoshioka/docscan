import { CameraFlash, CameraPosition, CameraRatio } from "@libs/settings"


type NextFlashSetting = {
  [key in CameraFlash]: CameraFlash
}

export const nextFlashSetting: NextFlashSetting = {
  [CameraFlash.AUTO]: CameraFlash.ON,
  [CameraFlash.ON]: CameraFlash.OFF,
  [CameraFlash.OFF]: CameraFlash.AUTO,
}


type NextCameraPositionSetting = {
  [key in CameraPosition]: CameraPosition
}

export const nextCameraPositionSetting: NextCameraPositionSetting = {
  [CameraPosition.BACK]: CameraPosition.FRONT,
  [CameraPosition.FRONT]: CameraPosition.BACK,
}


type NextRatioSetting = {
  [key in CameraRatio]: CameraRatio
}

export const nextRatioSetting: NextRatioSetting = {
  [CameraRatio["4_3"]]: CameraRatio["16_9"],
  [CameraRatio["16_9"]]: CameraRatio["4_3"],
}
